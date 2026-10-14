#!/usr/bin/env node
// install: the floor gate's install step, safe to run in several worktrees at once.
//
//   node C:/m0/bits/scripts/floor/install.mjs        (cwd = the unit's worktree)
//
// Runs `npm ci` in the root app and in chain/. Each run gets its own TEMP/TMP outside the
// worktree (so git status stays clean and parallel installs never share a temp file;
// pengu lesson: postinstall downloads to a fixed name in %TEMP% clobbered each other),
// removed afterwards. Root postinstall runs `prisma generate`.
// If install fails with EBUSY after a restart, kill the leftover node process holding the
// file, delete the worktree's node_modules and rerun.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// Only inside a unit worktree (`.git` is a file there, a directory in the main checkout), and
// no flags, so `install.mjs --help` never runs npm ci in whatever folder it was called from.
const dotGit = path.join(process.cwd(), '.git')
if (!fs.existsSync(dotGit) || fs.statSync(dotGit).isDirectory()) {
  console.error('REFUSED  install.mjs runs only inside a unit worktree (../bits-wt/<unit>), not the main checkout')
  process.exit(2)
}
if (process.argv.length > 2) {
  console.error('usage: node C:/m0/bits/scripts/floor/install.mjs   (no arguments; cwd = the unit worktree)')
  process.exit(2)
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'floor-install-'))
const env = { ...process.env, TEMP: tmp, TMP: tmp, TMPDIR: tmp }
const run = (cwd) => {
  const r = spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd, env, stdio: 'inherit', shell: true })
  if (r.status !== 0) { fs.rmSync(tmp, { recursive: true, force: true }); process.exit(r.status ?? 1) }
}
run(process.cwd())
run(path.join(process.cwd(), 'chain'))
fs.rmSync(tmp, { recursive: true, force: true })
