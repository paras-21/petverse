#!/usr/bin/env node
// Tests for scripts/floor/bmad-to-units.mjs: a small fixture tree (built in a temp dir, script run there) and the
// real ticket tree (read-only, through build()).
//
//   node scripts/floor/test-bmad-to-units.mjs
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { build, validate, parseToml } from './bmad-to-units.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HERE, 'bmad-to-units.mjs')
const REPO = path.resolve(HERE, '../..')

// Build order: epic 2 (epic-b) before epic 1 (epic-a), so ids are not the order.
//  2.1 story, root                         2.2 hitl, after [1]           2.3 spike
//  2.4 story after [5]  (later sibling)    2.5 story, root, unresolved unknown
//  2.6 story, dropped by its plan file     2.7 story after [6, 1]  (dep on dropped 2.6 removed)
//  1.1 story after ["2.2"]                 1.2 story after [1, "epic-b"]   1.3 story, root (unpinned? no: 1.1 pins 2)
//  epic 3 (epic-c) after epic 1 with no entry pinning it: its root 3.1 waits on epic-a's sinks.
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-to-units-'))
  fs.mkdirSync(path.join(root, 'scripts', 'floor'), { recursive: true })
  fs.copyFileSync(SRC, path.join(root, 'scripts', 'floor', 'bmad-to-units.mjs'))
  fs.mkdirSync(path.join(root, '.floor'))
  fs.writeFileSync(path.join(root, '.floor', 'units.json'), JSON.stringify({ product: 'Fixture product', units: [] }))
  fs.mkdirSync(path.join(root, '_bmad', 'custom'), { recursive: true })
  fs.writeFileSync(path.join(root, '_bmad', 'custom', 'config.user.toml'), '[core]\nactive_initiative = "init-x"\n')
  const I = path.join(root, '_bmad-output', 'init-x')
  for (const d of ['epic-a', 'epic-b', 'epic-c']) {
    fs.mkdirSync(path.join(I, d), { recursive: true })
    fs.writeFileSync(path.join(I, d, `${d}.md`), `---\ntype: epic\ntitle: "${d}"\nafter: []\n---\n# ${d}\n`)
  }
  fs.writeFileSync(path.join(I, 'tickets.toml'), [
    '# build order', '[[epic]]', 'id = 2', 'slug = "epic-b"', 'title = "B"', '',
    '[[epic]]', 'id = 1', 'slug = "epic-a"', 'title = "A"', 'after = [', '  { epic = 2, needs = "b things # not a comment" },', ']', '',
    '[[epic]]', 'id = 3', 'slug = "epic-c"', 'title = "C"', 'after = [{ epic = 1, needs = "a" }]', '',
  ].join('\n'))
  const entry = (id, extra = []) => ['[[entry]]', `id = ${id}`, 'type = "story"', `title = "T${id}"`, `verify = "V${id} works"`, 'covers = ["R1", "R2"]', 'hitl = false', 'risk = "low"', ...extra, ''].join('\n')
  fs.writeFileSync(path.join(I, 'epic-b', 'tickets.toml'), ['next_id = 8  # top-level key', '',
    entry(1, ['after = []', 'owns = ["src/a/**", "src/lib/a.ts"]', 'test = "src/a/a.test.ts"']),
    entry(2, ['after = [1]', 'hitl = true', 'owns = ["src/h.ts"]', 'test = "test/h.test.ts"']).replace('hitl = false\n', ''),
    entry(3, ['after = []']).replace('type = "story"', 'type = "spike"'),
    entry(4, ['after = [5]']),
    entry(5, ['after = []', 'unknown = "Which colour?"', 'references = [', '  "a.md#x",', '  "b.md",', ']']),
    entry(6, ['after = []']),
    entry(7, ['after = [6, 1]', 'unknown = "Resolved: blue."']),
  ].join('\n'))
  fs.writeFileSync(path.join(I, 'epic-b', 'story-dropped-plan.md'), '---\nticket: 6\nstatus: dropped\n---\n')
  fs.writeFileSync(path.join(I, 'epic-a', 'tickets.toml'), [
    entry(1, ['after = ["2.2"]']), entry(2, ['after = [1, "epic-b"]']), entry(3, ['after = []', 'owns = [', '  "src/b.ts",', ']', 'test = "test/b.test.ts"']),
  ].join('\n'))
  fs.writeFileSync(path.join(I, 'epic-c', 'tickets.toml'), [entry(1, ['after = []']), entry(2, ['after = [1]'])].join('\n'))
  return root
}
const run = (root, args) => spawnSync(process.execPath, [path.join(root, 'scripts', 'floor', 'bmad-to-units.mjs'), ...args], { cwd: root, encoding: 'utf8' })
const eq = (a, b, what) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${what}: got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`) }
const ok = (c, what) => { if (!c) throw new Error(what) }
function withFixture(fn) { const root = fixture(); try { fn(root) } finally { fs.rmSync(root, { recursive: true, force: true }) } }

const tests = []
const test = (name, fn) => tests.push({ name, fn })

test('fixture: one unit per live entry, dropped skipped, build order kept', () => withFixture((root) => {
  const r = build(root)
  eq(r.units.map((u) => u.id), ['2.1', '2.2', '2.3', '2.5', '2.4', '2.7', '1.1', '1.2', '1.3', '3.1', '3.2'], 'unit order')
  eq(r.dropped, ['2.6'], 'dropped')
  eq(validate(r.units, r.epics.map((e) => String(e.id))), [], 'validate')
  eq(r.moved, ['2.4 waits on later 2.5'], 'reorder report')
}))

test('fixture: deps from sibling, cross-epic, epic-slug and unpinned epic after', () => withFixture((root) => {
  const by = Object.fromEntries(build(root).units.map((u) => [u.id, u]))
  eq(by['2.2'].deps, ['2.1'], '2.2 sibling')
  eq(by['2.7'].deps, ['2.1'], '2.7 drops dropped 2.6')
  eq(by['1.1'].deps, ['2.2'], '1.1 cross-epic')
  eq(by['1.2'].deps.sort(), ['1.1', '2.2', '2.3', '2.4', '2.7'].sort(), '1.2 epic-b = its sinks')
  eq(by['1.3'].deps, [], '1.3 root stays free: epic 1 pins epic 2 through 1.1')
  eq(by['3.1'].deps.sort(), ['1.2', '1.3'], '3.1 waits on epic-a sinks (unpinned epic after)')
  eq(by['3.2'].deps, ['3.1'], '3.2 sibling only')
}))

test('fixture: human, acceptance, owns, unknown mapping', () => withFixture((root) => {
  const by = Object.fromEntries(build(root).units.map((u) => [u.id, u]))
  for (const id of ['2.2', '2.3']) { ok(by[id].human === true, `${id} human`); eq(by[id].owns, [`(human:${id})`], `${id} owns`); eq(by[id].acceptance[0].test, 'owner-checklist', `${id} test`) }
  ok(!by['2.1'].human, '2.1 not human')
  eq(by['3.1'].acceptance, [{ clause: 'V1 works', test: '', covers: ['R1', 'R2'] }], '3.1 no test -> clause test ""')
  eq(by['3.1'].owns, [], '3.1 no owns -> []')
  eq(by['2.5'].unknown, 'Which colour?', '2.5 unknown')
  ok(!('unknown' in by['2.7']), 'resolved unknown not carried')
  eq(by['2.5'].references, ['a.md#x', 'b.md'], 'multi-line array')
}))

test('fixture: entry owns + test map to floor owns and the clause test', () => withFixture((root) => {
  const by = Object.fromEntries(build(root).units.map((u) => [u.id, u]))
  eq(by['2.1'].owns, ['src/a/**', 'src/lib/a.ts'], '2.1 owns as given (test already inside src/a/**)')
  eq(by['2.1'].acceptance, [{ clause: 'V1 works', test: 'src/a/a.test.ts', covers: ['R1', 'R2'] }], '2.1 clause names its test')
  eq(by['1.3'].owns, ['src/b.ts', 'test/b.test.ts'], '1.3 test file appended to owns')
  eq(by['1.3'].acceptance[0].test, 'test/b.test.ts', '1.3 clause test')
  ok(by['2.2'].human === true, 'hitl with owns stays human')
  eq(by['2.2'].owns, ['(human:2.2)'], 'hitl owns stays the human marker')
  eq(by['2.2'].acceptance[0].test, 'owner-checklist', 'hitl test stays owner-checklist')
  // floor check's rules on every worker unit that has owns + test
  for (const u of Object.values(by).filter((x) => !x.human && x.owns.length)) {
    ok(u.acceptance.length >= 1 && u.acceptance.length <= 5, `${u.id}: 1-5 clauses`)
    ok(u.acceptance.every((a) => typeof a.test === 'string' && a.test), `${u.id}: every clause names a test`)
  }
}))

test('fixture: CLI writes units.json keeping product; --check writes nothing', () => withFixture((root) => {
  const out = path.join(root, '.floor', 'units.json'), before = fs.readFileSync(out, 'utf8')
  const c = run(root, ['--check'])
  eq(c.status, 0, `--check exit (${c.stderr})`)
  eq(fs.readFileSync(out, 'utf8'), before, '--check left units.json alone')
  const w = run(root, [])
  eq(w.status, 0, `write exit (${w.stderr})`)
  const j = JSON.parse(fs.readFileSync(out, 'utf8'))
  eq(j.product, 'Fixture product', 'product kept')
  eq(j.units.length, 11, 'unit count')
  const lines = w.stdout.split(/\r?\n/).map((l) => l.trim())
  for (const id of ['2.2', '2.3']) ok(lines.includes(id), `human ${id} listed`)
  ok(!lines.includes('2.1'), '2.1 not listed as human')
}))

test('fixture: dangling dep fails the CLI', () => withFixture((root) => {
  const f = path.join(root, '_bmad-output', 'init-x', 'epic-c', 'tickets.toml')
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('after = [1]', 'after = [1, "9.9"]'))
  const r = run(root, ['--check'])
  ok(r.status === 1 && /9\.9/.test(r.stderr), `want exit 1 naming 9.9, got ${r.status}: ${r.stderr}`)
}))

test('fixture: dependency cycle fails', () => withFixture((root) => {
  const f = path.join(root, '_bmad-output', 'init-x', 'epic-c', 'tickets.toml')
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('id = 1\ntype = "story"\ntitle = "T1"\nverify = "V1 works"\ncovers = ["R1", "R2"]\nhitl = false\nrisk = "low"\nafter = []', 'id = 1\ntype = "story"\ntitle = "T1"\nverify = "V1 works"\ncovers = ["R1", "R2"]\nhitl = false\nrisk = "low"\nafter = [2]'))
  const r = build(root)
  ok(r.errors.some((e) => /cycle/.test(e)) || validate(r.units).some((e) => /cycle/.test(e)), `no cycle reported: ${JSON.stringify(r.errors)}`)
}))

test('real tree: every entry is exactly one unit; no dangling deps, no cycles, build order respected', () => {
  const r = build(REPO)
  const I = path.join(REPO, r.source)
  const want = []
  for (const e of r.epics) {
    const toml = path.join(I, e.slug, 'tickets.toml')
    if (fs.existsSync(toml)) for (const t of parseToml(fs.readFileSync(toml, 'utf8'), toml)) want.push(`${e.id}.${t.id}`)
  }
  const live = want.filter((id) => !r.dropped.includes(id))
  const got = r.units.map((u) => u.id)
  eq(new Set(got).size, got.length, 'unique unit ids')
  eq([...got].sort(), [...live].sort(), 'units == live entries')
  eq(r.errors, [], 'build errors')
  eq(validate(r.units, r.epics.map((e) => String(e.id))), [], 'validate (deps, cycles, order)')
  for (const u of r.units) {
    ok(u.acceptance.length === 1 && u.acceptance[0].clause, `${u.id}: one clause from verify`)
    if (u.human) eq(u.owns, [`(human:${u.id})`], `${u.id}: human owns`)
    if (u.human) ok(u.acceptance.every((a) => a.test === 'owner-checklist'), `${u.id}: human clause`)
  }
})

let failed = 0
for (const t of tests) {
  try { t.fn(); console.log(`PASS ${t.name}`) } catch (e) { failed++; console.log(`FAIL ${t.name}: ${e.message.split('\n')[0]}`) }
}
console.log(failed ? `${failed} of ${tests.length} failed` : `all ${tests.length} passed`)
process.exitCode = failed ? 1 : 0
