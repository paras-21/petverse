# scripts/floor

Helpers for the floor CLI (`floor`, from `C:/m0/tools/floor-kit`). Adapted from pengu. Run every `floor` command and
these scripts from the main checkout `C:/m0/bits` unless a line says "worktree".

| File | What it does |
|---|---|
| `install.mjs` | Gate step 1 (worktree). `npm ci` in the root app and `chain/`, with its own TEMP per run so parallel installs never clash. Refuses the main checkout. |
| `unit-db.mjs` | One Supabase schema `test_<unit>` per unit (no local DB, DECISIONS #10). `gate` (worktree): drop + create + `prisma migrate deploy`. `create <unit>`, `drop <unit>`, `list`. Reads `DIRECT_URL` (session pooler :5432) from env, else from `C:/m0/bits/.env`; never prints it. Refuses any schema not matching `^test_[a-z0-9_]+$` (DECISIONS #33) and the :6543 pooler. |
| `gate-queue.sh` | Gates units one after another: `bash scripts/floor/gate-queue.sh [--land] 1.2 1.3`. With `--land` it lands each pass, removes its worktree and drops its schema. Frees each worktree's `node_modules` and build output after its gate. Stops when C: has < 5 GB free. |
| `gate-daemon.sh` | Loop over `.floor/gate-queue.txt`: one gate at a time, waits for deps to land (`deps-landed.mjs`), lands passes, then runs `sync.sh`. Log: `.floor/results/gate-daemon.log`. |
| `deps-landed.mjs` | Exit 0 when all deps of a unit have a `landed` event in `.floor/ledger.jsonl`. |
| `sync.sh` | Merges `floor/mvp1` into the main checkout's branch and fast-forwards `../bits-wt/_integration`. Skips when the main checkout has uncommitted changes. |
| `bmad-to-units.mjs` | Builds `.floor/units.json` from the BMad tickets (see its header). |

## Run the gate daemon

Start it in a window Claude Code did not start (its memory guard kills its own background jobs):

```
C:\m0\bits\.floor\run-gate-daemon.cmd          (restarts the loop if it dies)
echo 1.2 >> .floor/gate-queue.txt              queue a unit
echo STOP >> .floor/gate-queue.txt             stop after the current gate
tail -f .floor/results/gate-daemon.log         watch
```

## Before the first gate

- `DIRECT_URL` must be set (env or `.env`) and point at the session pooler; the db step creates real schemas there.
- Root `typecheck` and `test` scripts come from epic-platform entry 6; until it lands those gate steps fail.
- Drop leftover schemas with `node scripts/floor/unit-db.mjs list` then `drop <unit>`.
