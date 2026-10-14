# Petverse: floor context index

Read this file first. It is an **index**: it points to the documents and does not repeat them. Load a document only
when the task needs it.

## Where things are
| Need | Read |
|---|---|
| What we build and why; the MVP1 cut | `docs/PRD.md` (not written yet) |
| How it fits the existing code; data model; contracts; security model | `docs/BLUEPRINT.md` (not written yet) |
| The work: units, owns, deps, acceptance clauses and their tests | `.floor/units.json` (`floor status`, `floor ready`) |
| Decisions already made (do not re-litigate) | `docs/DECISIONS.md` |
| Known problems and their fixes (search before diagnosing) | `docs/LESSONS.md` |
| Manual items that are NOT gate items | `docs/OWNER-CHECKLIST.md` |
| How to resume after a restart | `docs/RESUME.md` |
| Planning artifacts (BMad) | `_bmad-output/initiative-petverse-mvp1/` |

## Repo map
- `src/`: Next.js 15 app. 3D pets in `src/components/three/` (`species.tsx`, `PetModel.tsx`, `jelly.tsx`, `Stage.tsx`, `EggModel.tsx`); palettes in `src/lib/pets.ts`.
- `chain/`: Hardhat 3 + viem contracts. Networks: Robinhood testnet 46630, mainnet 4663. Keys only via `configVariable`.
- Windows machine: use Git Bash; no `python` (use `node`, or `uv run` for BMad scripts).

## Autonomy (day-one rules)
**Do without asking:** read anything in the repo; edit files inside your unit's `owns`; run install, typecheck, lint,
tests, local Hardhat node and `floor precheck` / `floor gate`; commit on your unit branch.

**Ask the owner first:**
- adding or upgrading a dependency
- touching files outside your unit's `owns`, or `.floor/`, `prompts/`, `CLAUDE.md`, `.claude/`
- changing any economy number (prices, burns, taxes, timers, reward splits) or anything in `docs/DECISIONS.md`
- deploying anything, even to testnet
- deleting files or branches, rewriting git history

**Never:**
- push, deploy to mainnet, or send real funds / real tokens
- touch any live third-party account other than the project Supabase DB (decision #10); never run destructive SQL (`migrate reset`, `DROP`, `TRUNCATE`) on it without the owner saying so
- print, log, echo, commit or paste secrets (private keys, API keys, `.env*` values, Privy/Alchemy secrets)
- skip hooks or the gate

## Rules for every session
1. Work only inside your unit's worktree and its `owns`.
2. Test first; revert-check every clause; run `floor precheck`, then `floor gate`. The gate is the reviewer.
3. Cheap models read and extract; strong models judge. Run sub-agents in parallel; no cap (owner, 2026-10-14).
4. New verified lesson → `docs/LESSONS.md`. New decision → `docs/DECISIONS.md`, numbered, dated, who decided.
5. Blocked on a human → write `BLOCKED-<UNIT>.md` (exact need + options) and work on something else.
