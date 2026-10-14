#!/usr/bin/env node
// bmad-to-units: build the floor's .floor/units.json from the BMad ticket tree, so the plan has one source.
//
//   node scripts/floor/bmad-to-units.mjs              write .floor/units.json, print a summary
//   node scripts/floor/bmad-to-units.mjs --check      print the summary only (writes nothing)
//   node scripts/floor/bmad-to-units.mjs --done <ID>  owner closes a human unit (appends `landed` to .floor/ledger.jsonl)
//
// Source: _bmad-output/<active initiative>/tickets.toml ([[epic]] tables in build order) and each epic folder's
// tickets.toml ([[entry]] tables in build order). Adapted from pengu's scripts/floor/bmad-to-units.mjs.
//
// Mapping
//   id          "<epic id>.<entry id>", the BMad cross-epic name (e.g. "2.3").
//   deps        entry `after`: a bare number is a sibling; "N.M" an entry in epic N; "epic-<slug>" that whole epic
//               (its sinks). Epic gates: the epic file's own `after` holds every entry; an initiative `after`
//               ({ epic = N }) that no entry of the epic pins puts the epic's root entries behind epic N's sinks.
//   acceptance  an entry's own `acceptance = [{ clause, test }]` when it has one; else one clause
//               { clause: verify, test: entry.test, covers } -- test "" when the entry has no `test`, which
//               `floor check` names.
//   owns        entry.owns (globs); entry.test is appended when no owns glob covers it. [] -> `floor check` names it.
//   human       hitl = true or type = "spike": owner work, never picked up by `floor ready`/`floor start`.
//               owns ["(human:<id>)"], acceptance = verify with test "owner-checklist" (as in pengu).
//   dropped     an entry (plan or leaf file status/tracker_status "dropped") or epic (epic file status) is
//               skipped; deps on it are removed with a warning.
//   unknown     an unresolved `unknown` (not starting "Resolved") is carried on the unit as `unknown`; floor
//               itself does not read it, so the summary lists them.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// ---------- tiny TOML reader for the subset bmad-ticket writes ----------
// [[entry]] / [[epic]] tables of strings, numbers, booleans, arrays (incl. inline tables), multi-line arrays.
// Top-level keys before the first table (e.g. next_id) are ignored. Anything else is a hard error.
export function parseToml(text, file) {
  const tables = []; let cur = null
  const lines = text.split(/\r?\n/)
  for (let i = 0; i < lines.length; i++) {
    const line = stripComment(lines[i]).trim()
    if (!line) continue
    if (line === '[[entry]]' || line === '[[epic]]') { cur = {}; tables.push(cur); continue }
    if (/^\[/.test(line)) { cur = null; continue }
    const m = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.*)$/)
    if (!m) throw new Error(`${file}:${i + 1}: cannot read: ${line}`)
    let val = m[2]; const at = `${file}:${i + 1}`
    while (unbalanced(val) && i + 1 < lines.length) val += ' ' + stripComment(lines[++i]).trim()
    if (cur) cur[m[1]] = value(val, at)
  }
  return tables
}
function stripComment(s) { let q = null; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '\\' && q === '"') i++; else if (c === q) q = null } else if (c === '"' || c === "'") q = c; else if (c === '#') return s.slice(0, i) } return s }
function unbalanced(s) { let d = 0, q = null; for (let i = 0; i < s.length; i++) { const c = s[i]; if (q) { if (c === '\\' && q === '"') i++; else if (c === q) q = null } else if (c === '"' || c === "'") q = c; else if (c === '[' || c === '{') d++; else if (c === ']' || c === '}') d-- } return d > 0 }
function value(v, at) {
  let i = 0
  const fail = () => { throw new Error(`${at}: unsupported value near: ${v.slice(i, i + 40)}`) }
  const ws = () => { while (i < v.length && /\s/.test(v[i])) i++ }
  const read = () => {
    ws(); const c = v[i]
    if (c === '"') { let s = ''; i++; while (i < v.length && v[i] !== '"') { if (v[i] === '\\') { const n = v[++i]; s += { n: '\n', t: '\t', '"': '"', '\\': '\\' }[n] ?? n } else s += v[i]; i++ } if (v[i++] !== '"') fail(); return s }
    if (c === "'") { const e = v.indexOf("'", i + 1); if (e < 0) fail(); const s = v.slice(i + 1, e); i = e + 1; return s }
    if (c === '[') { i++; const a = []; for (;;) { ws(); if (v[i] === ']') { i++; return a } a.push(read()); ws(); if (v[i] === ',') i++; else if (v[i] !== ']') fail() } }
    if (c === '{') { i++; const o = {}; for (;;) { ws(); if (v[i] === '}') { i++; return o } const k = v.slice(i).match(/^[A-Za-z0-9_-]+/)?.[0] ?? fail(); i += k.length; ws(); if (v[i++] !== '=') fail(); o[k] = read(); ws(); if (v[i] === ',') i++; else if (v[i] !== '}') fail() } }
    const m = v.slice(i).match(/^(true|false|-?\d+(\.\d+)?)/) ?? fail(); i += m[0].length
    return m[1] === 'true' ? true : m[1] === 'false' ? false : Number(m[1])
  }
  const out = read(); ws(); if (i < v.length) fail(); return out
}

// ---------- markdown frontmatter (leaf files, plans, epic files) ----------
function frontmatter(file) {
  const t = fs.readFileSync(file, 'utf8')
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return {}
  const fm = {}
  for (const line of m[1].split(/\r?\n/)) {
    const k = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/); if (!k) continue
    let v = stripComment(k[2]).trim()
    if (v.startsWith('[')) v = v.replace(/^\[|\]$/g, '').split(',').map((x) => x.trim().replace(/^["']|["']$/g, '')).filter(Boolean).map((x) => (/^\d+$/.test(x) ? Number(x) : x))
    else if (v === 'true' || v === 'false') v = v === 'true'
    else v = v.replace(/^["']|["']$/g, '')
    fm[k[1]] = v
  }
  return fm
}

// Per-entry overrides from the epic folder: leaf file (`id`, `after`, `hitl`, `status`, `tracker_status`) and plan
// (`ticket`, `status`; a plan's status wins over its leaf file's), as bmad-ticket's tickets.py reads them.
function folderState(folder) {
  const leaf = {}, byFile = {}, plans = []
  for (const name of fs.readdirSync(folder).filter((n) => n.endsWith('.md'))) {
    const fm = frontmatter(path.join(folder, name))
    if (['story', 'spike', 'bug'].includes(fm.type) && fm.id !== undefined && fm.id !== '') { leaf[String(fm.id)] = fm; byFile[name.replace(/\.md$/, '')] = String(fm.id) }
    else if (fm.ticket !== undefined && fm.ticket !== '') plans.push(fm)
  }
  const state = {}
  for (const [id, fm] of Object.entries(leaf)) state[id] = fm.tracker_status || fm.status || ''
  for (const p of plans) { const id = /^\d+$/.test(String(p.ticket)) ? String(p.ticket) : byFile[p.ticket]; if (id && p.status) state[id] = leaf[id]?.tracker_status || p.status }
  return { leaf, state }
}

// floor.mjs's own owns-glob matcher (kept identical so "is the test file inside owns" agrees with floor precheck)
const floorGlob = (g) => new RegExp('^' + g.replace(/\/$/, '/**').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\/?/g, '\u0000').replace(/\*/g, '[^/]*').replace(/\u0000/g, '.*') + '$')
// ---------- build ----------
export function build(root) {
  const cfgFile = path.join(root, '_bmad', 'custom', 'config.user.toml')
  const initiative = (fs.existsSync(cfgFile) && fs.readFileSync(cfgFile, 'utf8').match(/active_initiative\s*=\s*"([^"]+)"/)?.[1]) || 'initiative-petverse-mvp1'
  const I = path.join(root, '_bmad-output', initiative)
  const epics = parseToml(fs.readFileSync(path.join(I, 'tickets.toml'), 'utf8'), 'tickets.toml')
  const warn = [], errors = []
  const raw = [] // { epic, entry, id, after(raw), ... }
  const droppedIds = new Set(), slugOf = {}, droppedEpics = []
  for (const e of epics) {
    const eid = String(e.id); slugOf[e.slug] = eid
    const folder = path.join(I, e.slug ?? '')
    const toml = path.join(folder, 'tickets.toml')
    if (!e.slug || !fs.existsSync(toml)) { warn.push(`epic ${eid} (${e.slug}): no tickets.toml, no units`); continue }
    const efile = path.join(folder, `${e.slug}.md`)
    const efm = fs.existsSync(efile) ? frontmatter(efile) : {}
    const epicDropped = efm.status === 'dropped'
    if (epicDropped) droppedEpics.push(eid)
    const { leaf, state } = folderState(folder)
    for (const t of parseToml(fs.readFileSync(toml, 'utf8'), path.relative(root, toml))) {
      const key = String(t.id), id = `${eid}.${key}`
      if (epicDropped || state[key] === 'dropped') { droppedIds.add(id); continue }
      const lf = leaf[key] ?? {}
      raw.push({ eid, slug: e.slug, t, id, state: state[key] || '',
        after: Array.isArray(lf.after) ? lf.after : (t.after ?? []), hitl: typeof lf.hitl === 'boolean' ? lf.hitl : t.hitl === true,
        epicAfter: Array.isArray(efm.after) ? efm.after : [] })
    }
  }
  const ids = new Set(raw.map((r) => r.id))
  const ofEpic = (eid) => raw.filter((r) => r.eid === eid)
  const resolve = (r, a) => { // -> list of unit ids
    const s = String(a)
    if (/^\d+$/.test(s)) return [`${r.eid}.${s}`]
    if (/^\d+\.\d+$/.test(s)) return [s]
    if (s.startsWith('epic-')) { const eid = slugOf[s]; if (!eid) { errors.push(`${r.id}: after names unknown epic ${s}`); return [] } return sinks(eid) }
    errors.push(`${r.id}: cannot read after ${JSON.stringify(a)}`); return []
  }
  const localDeps = new Map()
  for (const r of raw) localDeps.set(r.id, (r.after ?? []).filter((a) => /^\d+$/.test(String(a))).map((a) => `${r.eid}.${a}`))
  function sinks(eid) { // entries of the epic nothing else in the epic waits on
    const es = ofEpic(eid), used = new Set(es.flatMap((x) => localDeps.get(x.id)))
    return es.map((x) => x.id).filter((x) => !used.has(x))
  }
  const units = []
  for (const r of raw) {
    let deps = r.after.flatMap((a) => resolve(r, a))
    for (const g of r.epicAfter) deps.push(...resolve(r, g)) // epic file gate holds every entry
    deps = [...new Set(deps)].filter((d) => {
      if (droppedIds.has(d)) { warn.push(`${r.id}: dep ${d} is dropped; removed (repoint it in tickets.toml)`); return false }
      if (!ids.has(d)) { errors.push(`${r.id}: dep ${d} names no entry`); return false }
      return true
    })
    const t = r.t, isHuman = r.hitl || t.type === 'spike'
    const covers = (t.covers ?? []).map(String)
    const u = { id: r.id, title: t.title, epic: r.slug, type: t.type ?? 'story', risk: t.risk ?? 'low', mvp: 1, deps, covers,
      description: t.description ?? '', references: t.references ?? [] }
    if (t.notes?.length) u.notes = t.notes
    const unknown = typeof t.unknown === 'string' && !/^resolved\b/i.test(t.unknown.trim()) ? t.unknown : null
    if (unknown) u.unknown = unknown
    if (r.state) u.bmad_state = r.state
    if (isHuman) Object.assign(u, { human: true, owns: [`(human:${r.id})`], acceptance: [{ clause: t.verify ?? t.title, test: 'owner-checklist', covers }] })
    else {
      // entry.owns -> owns; entry.test (one test file proving verify) -> the clause's named test. The test file
      // joins owns when no owns glob covers it, since floor precheck refuses changes outside owns.
      const owns = [...(t.owns ?? []).map(String)], test = typeof t.test === 'string' ? t.test : ''
      if (test && !owns.some((g) => floorGlob(g).test(test))) owns.push(test)
      Object.assign(u, { owns, acceptance: t.acceptance ?? (t.verify ? [{ clause: t.verify, test, covers }] : []) })
    }
    u._eid = r.eid; units.push(u)
  }
  // initiative-level epic prerequisites that no entry of the epic pins: the epic's root entries wait on them
  const unpinned = []
  for (const e of epics) {
    const eid = String(e.id), mine = units.filter((u) => u._eid === eid)
    for (const pre of (e.after ?? []).map((a) => String(typeof a === 'object' ? a.epic : a))) {
      if (!ofEpic(pre).length) continue
      if (mine.some((u) => u.deps.some((d) => d.startsWith(`${pre}.`)))) continue
      unpinned.push(`${eid}<-${pre}`)
      for (const u of mine.filter((x) => !x.deps.length)) u.deps.push(...sinks(pre))
    }
  }
  for (const u of units) delete u._eid
  // the table order is the build order; an entry that waits on a later sibling moves just after it (stable topo
  // sort, build order breaks ties) and is reported, since BMad means the tables to already be in a buildable order
  const pos = new Map(units.map((u, i) => [u.id, i])), done = new Set(), sorted = [], moved = []
  for (const u of units) for (const d of u.deps) if (pos.get(d) > pos.get(u.id)) moved.push(`${u.id} waits on later ${d}`)
  while (sorted.length < units.length) {
    const next = units.find((u) => !done.has(u.id) && u.deps.every((d) => done.has(d) || !pos.has(d)))
    if (!next) { errors.push('dependency cycle among: ' + units.filter((u) => !done.has(u.id)).map((u) => u.id).join(', ')); sorted.push(...units.filter((u) => !done.has(u.id))); break }
    done.add(next.id); sorted.push(next)
  }
  return { moved, units: sorted, initiative, source: path.relative(root, I).split(path.sep).join('/'), epics, warn, errors, unpinned, dropped: [...droppedIds], droppedEpics }
}

// structural checks the floor and the build order need; returns a list of problems
export function validate(units, epicOrder) {
  const bad = [], idx = new Map(units.map((u, i) => [u.id, i]))
  if (idx.size !== units.length) bad.push('duplicate unit ids')
  for (const u of units) for (const d of u.deps) {
    if (!idx.has(d)) bad.push(`${u.id}: dangling dep ${d}`)
    else if (idx.get(d) >= idx.get(u.id)) bad.push(`${u.id}: dep ${d} comes later in build order`)
  }
  const seen = new Set(), stack = new Set(), by = Object.fromEntries(units.map((u) => [u.id, u]))
  const visit = (id) => { if (stack.has(id)) { bad.push(`cycle through ${id}`); return } if (seen.has(id) || !by[id]) return; seen.add(id); stack.add(id); by[id].deps.forEach(visit); stack.delete(id) }
  units.forEach((u) => visit(u.id))
  if (epicOrder) { const pos = (u) => epicOrder.indexOf(u.id.split('.')[0]); for (let i = 1; i < units.length; i++) if (pos(units[i]) < pos(units[i - 1])) bad.push(`${units[i].id} is out of epic build order`) }
  return bad
}

// ---------- CLI ----------
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
  const OUT = path.join(ROOT, '.floor', 'units.json')
  const args = process.argv.slice(2)
  if (args[0] === '--done') {
    const id = args[1] ?? (console.error('usage: --done <UNIT>'), process.exit(2))
    fs.appendFileSync(path.join(ROOT, '.floor', 'ledger.jsonl'), JSON.stringify({ ts: new Date().toISOString(), type: 'landed', unit: id, human: true }) + '\n')
    console.log(`${id}: marked done (human)`); process.exit(0)
  }
  const r = build(ROOT)
  const bad = [...r.errors, ...validate(r.units, r.epics.map((e) => String(e.id)))]
  const human = r.units.filter((u) => u.human), work = r.units.filter((u) => !u.human)
  const noOwns = work.filter((u) => !u.owns.length).length, noTest = work.filter((u) => !u.acceptance.length || u.acceptance.some((a) => !a.test)).length
  console.log(`initiative ${r.initiative} | epics ${r.epics.length} | units ${r.units.length} (human ${human.length}, worker ${work.length}) | dropped ${r.dropped.length}`)
  console.log(`worker units still needing owns: ${noOwns} | needing a named test per clause: ${noTest}`)
  if (r.moved.length) console.log(`reordered (entry waits on a later sibling in tickets.toml): ${r.moved.join('; ')}`)
  if (r.unpinned.length) console.log(`epic prerequisites no entry pins (root entries gated on the prerequisite's sinks): ${r.unpinned.join(', ')}`)
  const unk = r.units.filter((u) => u.unknown)
  if (unk.length) console.log(`open unknowns (settle before starting; floor does not read this): ${unk.map((u) => u.id).join(', ')}`)
  for (const w of r.warn) console.log(`warn: ${w}`)
  if (human.length) { console.log('human units (owner closes with --done; workers never start them):'); for (const u of human) console.log(u.id) }
  if (bad.length) { console.error('FAIL\n- ' + bad.join('\n- ')); process.exit(1) }
  if (!args.includes('--check')) {
    let product = 'Petverse'
    try { product = JSON.parse(fs.readFileSync(OUT, 'utf8')).product || product } catch {}
    fs.writeFileSync(OUT, JSON.stringify({ product, source: r.source, units: r.units }, null, 2) + '\n')
    console.log(`wrote ${path.relative(ROOT, OUT)}`)
  }
}
