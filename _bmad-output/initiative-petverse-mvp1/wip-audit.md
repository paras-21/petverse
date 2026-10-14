# WIP audit: uncommitted work on `main` vs integration worktree

Date: 2026-10-14. Read-only audit. Repo `C:\m0\bits` (main, HEAD cbeda55) vs `C:\m0\bits-wt\_integration` (floor/mvp1 = cbeda55).
Nothing was changed, staged or installed. Typecheck (`tsc --noEmit --incremental false`) and `eslint` were run in `C:\m0\bits` (WIP tree) and both pass.

## 1. What each change is

### Modified (tracked)
| File | Change |
|---|---|
| `.gitignore` | +ignores `.claude/skills/` (absolute-path symlinks), `.claude/settings.local.json`, `_bmad/custom/*.user.toml`, `src/generated/` (Prisma client). |
| `package.json` | `dev` → `next dev --turbopack`; new scripts `postinstall: prisma generate`, `db:migrate`, `db:studio`. **New deps:** `@prisma/client ^7.10.0`, `@prisma/adapter-pg ^7.10.0`; **devDep** `prisma ^7.10.0`. |
| `package-lock.json` | +148 packages, all from Prisma (pg, pglite, @prisma/studio-core with radix/d3/lodash, etc.). In sync with package.json (`npm ls --package-lock-only` clean). |
| `chain/package.json` | **New dep** `@openzeppelin/contracts-upgradeable ^5.6.1`; devDep `typescript` **downgraded** `^7.0.2` → `^5.9.3`. |
| `chain/package-lock.json` | Matches: adds contracts-upgradeable 5.6.1, drops TS 7 native platform packages, TS 5.9.3. In sync. |
| `src/components/Gallery.tsx` | Cosmetics preview UI: per-slot buttons (hat/face/neck/back/hand), mix/shuffle, turn-around, URL presets. |
| `src/components/three/PetModel.tsx` | New `loadout` prop, wraps view in `LoadoutContext`. |
| `src/components/three/species.tsx` | Moves `Crown`/`Bow` to cosmetics.tsx; adds cosmetic materials; places Hat/Face/Neck/Back/Hand slots on every species; hides built-in hats/collars when a cosmetic is worn. |

### Untracked
| Path | What |
|---|---|
| `src/components/three/cosmetics.tsx` (595 lines), `src/lib/cosmetics.ts` (66) | Cosmetics models + catalog. **Required** by the modified Gallery/PetModel/species. |
| `src/lib/db.ts` | Prisma client singleton (adapter-pg, `DATABASE_URL`). Imports `@/generated/prisma/client`. |
| `prisma.config.ts` | Prisma 7 config; `datasource.url = env('DIRECT_URL')`; loads `.env` if present. |
| `prisma/schema.prisma` | Generator (output `src/generated/prisma`) + postgres datasource; no models yet. |
| `chain/hardhat.config.ts` | Hardhat 3 config: solc 0.8.28, viaIR, cancun; networks 46630/4663 via `configVariable` (no secrets in file). |
| `chain/tsconfig.json` | node16 TS config for chain. |
| `chain/contracts/`, `chain/ignition/modules/`, `chain/test/` | Exist but empty (git ignores them). |
| `.env.example` | Not ignored (`!.env.example`). **Not inspected**: `.claude/settings.json` denies reading `.env.*`. Owner must eyeball it for real values before committing. |
| `.floor/` | `config.json` (gate), `units.json` (empty units), `.gitignore` (`results/`), `results/`. |
| `.claude/settings.json` | Project permission denies (env reads, floor config edits, git push). `.claude/skills/` = symlinks, already ignored. |
| `.agents/skills/` | BMad skill sources (real dirs) that `.claude/skills/*` symlink to. |
| `skills-lock.json` | Lock of `npx skills add` BMad skills (source + hashes). |
| `_bmad/` | BMad install: `config.toml`, `core-tools/`, `method/`, `scripts/` (py), `custom/config.user.toml` (already ignored). |

## 2. Are the deps approved in docs/DECISIONS.md?
- `prisma`, `@prisma/client`, `@prisma/adapter-pg`: **yes**, decision #10 (Prisma 7.10 + adapter-pg, Supabase).
- `@openzeppelin/contracts-upgradeable`: **not explicitly approved.** #24 approves only the "OZ upgrade-safety validator"; #24/#32 list no upgradeable contracts lib. Needs an owner decision (or confirm it is covered by the architecture's upgradeable-contract choice).
- chain `typescript` 7 → 5.9.3: a version change of an existing dep; no decision or lesson records it. Probably needed for tooling, but per CLAUDE.md it is an "ask the owner" item. Record it (decision or lesson).

## 3. Gate on the integration worktree WITHOUT these changes
| Step | Result | Why |
|---|---|---|
| `npm ci` | pass | lock matches package.json at cbeda55 |
| `npm --prefix chain ci` | pass | lock matches (TS 7.0.2) |
| `npx tsc --noEmit` | pass (expected) | no chain/prisma TS files at cbeda55 |
| `npm run lint` | pass (expected) | |
| `npm test` | **FAIL** | no `test` script in root package.json (also missing in WIP; no test runner chosen/installed) |
| `npx --prefix chain hardhat compile` | **FAIL** | no `chain/hardhat.config.ts` in git |
| `npx --prefix chain hardhat test` | **FAIL** | same |

## 4. Gate WITH the changes committed (new risks)
- **`npm ci` will likely FAIL in a worktree without `.env`:** `postinstall` runs `prisma generate`, which loads `prisma.config.ts`; Prisma's `env('DIRECT_URL')` throws `PrismaConfigEnvError` when the var is unset (verified in `node_modules/@prisma/config/dist/index.js`). Worktrees have no `.env`. Fix options: use `process.env.DIRECT_URL ?? ''`-style lookup so generate works without a URL, or export `DIRECT_URL` in the gate env. Then `tsc` would also fail (`src/lib/db.ts` imports the ungenerated client).
- `npm test` still fails: add a `test` script (needs a runner dep = owner approval) or have the gate treat it as N/A.
- Hardhat compile/test with empty `contracts/` and `test/`: expected to pass (nothing to do). `configVariable` is lazy, so no keys needed.
- Root `tsc` includes `chain/hardhat.config.ts` and `prisma.config.ts` (`include: **/*.ts`). Fine because gate installs chain before typecheck; passes in the WIP tree today.

## 5. Must commit vs junk

**Must commit before the dry run** (one logical set; the code pieces depend on each other):
- `.gitignore`, `package.json`, `package-lock.json`
- `chain/package.json`, `chain/package-lock.json`, `chain/hardhat.config.ts`, `chain/tsconfig.json`
- `prisma.config.ts` (after the `env()` fix), `prisma/schema.prisma`, `src/lib/db.ts`
- `src/components/Gallery.tsx`, `src/components/three/PetModel.tsx`, `src/components/three/species.tsx`, `src/components/three/cosmetics.tsx`, `src/lib/cosmetics.ts` (all-or-nothing: modified files import the new ones)
- `.env.example`, only after the owner confirms it holds placeholder values only
- `.floor/config.json`, `.floor/units.json`, `.floor/.gitignore` (the floor reads them from the integration worktree)
- `.claude/settings.json` (shared deny rules)

**Owner choice (tooling, commit or ignore, not needed by the gate):** `_bmad/` (minus `custom/*.user.toml`), `.agents/`, `skills-lock.json`. Committing keeps BMad reproducible; note `_bmad/scripts/` is Python and harmless to eslint/tsc.

**Junk / local (keep ignored):** `.claude/skills/` (symlinks), `.claude/settings.local.json`, `_bmad/custom/*.user.toml`, `src/generated/`, `.floor/results/`, `node_modules/`, `.env*` (except `.env.example`). All already covered.

## 6. .gitignore coverage
| Pattern | Covered? |
|---|---|
| `.env*` | yes (`.env*`, with `!.env.example`) |
| `.floor/results` | yes, via `.floor/.gitignore` (`results/`), not the root file |
| `node_modules` | yes (`node_modules/`, covers `chain/node_modules`) |
| `scripts/.db` | **no** (no rule; `scripts/` does not exist yet). Add `scripts/.db` if the floor will create it. |

Note: `.floor/config.json` `junk` lists `.claude/` entirely; if the floor rejects any `.claude/` path in a diff, committing `.claude/settings.json` on a unit branch may trip it (commit it on main/integration instead).
