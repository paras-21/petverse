#!/usr/bin/env node
/**
 * One Postgres schema per floor unit on the project Supabase DB, so parallel workers and gates
 * never see each other's migrations. There is no local DB (DECISIONS #10); tests may create and
 * drop only test_<run> schemas (DECISIONS #33), so every schema this script touches is test_<unit>.
 *
 *   node scripts/floor/unit-db.mjs create <unit>   drop+create test_<unit>, migrate it from this checkout
 *   node scripts/floor/unit-db.mjs drop <unit>     drop test_<unit> (gate-queue.sh does this after a land)
 *   node scripts/floor/unit-db.mjs list            list existing test_ schemas (read-only)
 *   node scripts/floor/unit-db.mjs gate            gate step: unit = this worktree's folder name;
 *                                                  create + migrate its schema (fresh each gate)
 *
 * Connection: DIRECT_URL (session pooler :5432, DECISIONS #10) from the environment, else from the
 * main checkout's .env. URLs and passwords are never printed. The schema is passed to the Prisma CLI
 * as ?schema=<name> on DIRECT_URL and as DB_SCHEMA (AD-13). SQL runs through `pg` (already installed
 * as a dependency of @prisma/adapter-pg), resolved from the current checkout's node_modules, so run
 * the gate/create commands after install.
 *
 * Hard guard: any schema name that does not match ^test_[a-z0-9_]+$ is REFUSED before any SQL runs.
 */
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

if (!process.env.DIRECT_URL) {
  try { process.loadEnvFile(path.join(ROOT, '.env')) } catch { /* no .env: rely on the real environment */ }
}
const raw = (process.env.DIRECT_URL || '').trim()
if (!raw) { console.error('unit-db: DIRECT_URL is not set (environment or ' + path.join(ROOT, '.env') + ')'); process.exit(2) }
let base
try { base = new URL(raw) } catch { console.error('unit-db: DIRECT_URL is not a valid URL'); process.exit(2) }
if (!/^postgres(ql)?:$/.test(base.protocol)) { console.error('unit-db: DIRECT_URL must be a postgres:// URL'); process.exit(2) }
if (base.port === '6543') {
  console.error('REFUSED  DIRECT_URL points at the transaction pooler (:6543); schema DDL and migrations need the session pooler (:5432)')
  process.exit(2)
}

const SAFE = /^test_[a-z0-9_]{1,58}$/
function guard(schema) {
  if (!SAFE.test(schema)) { console.error(`REFUSED  schema "${schema}" is not a test_ schema (DECISIONS #33)`); process.exit(2) }
  return schema
}
const schemaFor = (unit) => {
  if (!/^[A-Za-z0-9._-]+$/.test(unit || '')) { console.error('bad unit id: ' + unit); process.exit(1) }
  return guard('test_' + unit.replace(/[^A-Za-z0-9]/g, '_').toLowerCase())
}
// pg connection: the base URL without the Prisma-only ?schema= parameter.
const pgUrl = () => { const u = new URL(base); u.searchParams.delete('schema'); return u.toString() }
// Prisma CLI URL: same server, ?schema=<test schema>.
const prismaUrl = (schema) => { const u = new URL(base); u.searchParams.set('schema', guard(schema)); return u.toString() }

function loadPg() {
  for (const from of [process.cwd(), ROOT]) {
    try { return createRequire(path.join(from, 'package.json'))('pg') } catch { /* try next */ }
  }
  console.error('unit-db: cannot load `pg`; run the install step (npm ci) first'); process.exit(1)
}

async function sql(text, params = []) {
  const { Client } = loadPg()
  const c = new Client({ connectionString: pgUrl() })
  try { await c.connect(); return (await c.query(text, params)).rows }
  catch (e) { console.error('unit-db: SQL failed: ' + (e?.code ? e.code + ' ' : '') + (e?.message ?? e)); process.exit(1) }
  finally { await c.end().catch(() => {}) }
}

async function dropSchema(schema) {
  guard(schema)
  await sql(`drop schema if exists "${schema}" cascade`)
}

function migrate(schema, cwd) {
  if (!fs.existsSync(path.join(cwd, 'prisma', 'migrations'))) {
    console.error(`unit-db: no prisma/migrations in ${cwd}; schema ${schema} left empty`)
    return 0
  }
  const env = { ...process.env, DIRECT_URL: prismaUrl(schema), DB_SCHEMA: guard(schema) }
  const r = spawnSync('npx', ['prisma', 'migrate', 'deploy'], { cwd, env, stdio: 'inherit', shell: true })
  return r.status ?? 1
}

async function create(unit, cwd) {
  const schema = schemaFor(unit)
  const t0 = Date.now()
  await dropSchema(schema)
  await sql(`create schema "${schema}"`)
  const status = migrate(schema, cwd)
  console.error(`${status === 0 ? 'created' : 'MIGRATE FAILED'} ${schema} in ${((Date.now() - t0) / 1000).toFixed(1)}s`)
  return { schema, status }
}

const [cmd, unit] = process.argv.slice(2)
if (cmd === 'create') {
  const { schema, status } = await create(unit, process.cwd())
  console.log(schema)
  process.exit(status)
} else if (cmd === 'drop') {
  const schema = schemaFor(unit)
  await dropSchema(schema)
  console.error('dropped ' + schema)
} else if (cmd === 'list') {
  const rows = await sql(`select nspname from pg_namespace where nspname like 'test\\_%' order by 1`)
  for (const r of rows) console.log(r.nspname)
} else if (cmd === 'gate') {
  // `gate` names the schema after the worktree folder; only unit worktrees (.git is a file there) may run it.
  const dotGit = path.join(process.cwd(), '.git')
  if (!fs.existsSync(dotGit) || fs.statSync(dotGit).isDirectory()) {
    console.error('REFUSED  unit-db gate runs only inside a unit worktree (../bits-wt/<unit>), not the main checkout')
    process.exit(2)
  }
  // Proves this unit's migrations apply to a fresh schema. Nothing is written into the worktree (a file
  // there would show up in git status). TODO(epic-platform entry 8): the test setup creates its own
  // test_<runid> per run (AD-13); if tests should reuse this schema instead, pass it via DB_SCHEMA there.
  const { status } = await create(path.basename(process.cwd()), process.cwd())
  process.exit(status)
} else {
  console.error('usage: unit-db.mjs create <unit> | drop <unit> | list | gate'); process.exit(1)
}
