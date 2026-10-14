#!/usr/bin/env node
// deps-landed <unit>: exit 0 when every dep of <unit> (from .floor/units.json) has landed
// (a `landed` event in .floor/ledger.jsonl), 1 otherwise, printing the deps still missing.
// The gate daemon uses it so a stacked unit is never gated before its parent lands.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const id = process.argv[2]
const units = JSON.parse(fs.readFileSync(path.join(root, '.floor/units.json'), 'utf8')).units
const unit = units.find((u) => u.id === id)
if (!unit) { console.error(`unknown unit ${id}`); process.exit(2) }
// No ledger yet (nothing gated or landed) means nothing has landed.
const ledger = path.join(root, '.floor/ledger.jsonl')
const lines = fs.existsSync(ledger) ? fs.readFileSync(ledger, 'utf8').split('\n').filter(Boolean) : []
const landed = new Set(lines.map((l) => JSON.parse(l)).filter((e) => e.type === 'landed').map((e) => e.unit))
const missing = (unit.deps || []).filter((d) => !landed.has(d))
if (missing.length) { console.log(missing.join(',')); process.exit(1) }
