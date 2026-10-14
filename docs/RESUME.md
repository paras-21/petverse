# Resume checklist (after a shutdown, crash or new machine)

Work through it top to bottom. Each step has a check.

1. **State is intact.** `floor status` lists the same landed and in-progress units as before. Worktrees are in
   `git worktree list`.
2. **Snapshot first.** If anything is uncommitted in a worktree, commit it on that unit's branch as a WIP before you
   restart sessions: `git -C <wt> add -A && git -C <wt> commit -m "wip: resume snapshot"`.
3. **Prune context.** Run `floor-prune`, so old transcripts don't slow down session start.
4. **Sessions.** Run `floor-sessions`. It restarts only the dead windows and leaves live ones alone. Check that every
   window shows a working Claude session.
5. **Brief.** Use `floor-say <name> "RESUME: <unit>, <state>, <next step>"` for each worker, and confirm it says
   `sent+verified`.
6. **Watch loop.** Re-create the timer or cron entry for `floor watch` (every 15 minutes) and `floor-prune` (hourly).
7. **Gates.** Re-run `floor gate` for any unit that was mid-gate, then look at `floor watch` output for LAND ME,
   PARKED and READY items.
8. **Record.** Add one line to `docs/DECISIONS.md` or `docs/LESSONS.md` if the shutdown taught you anything.

## State at 2026-10-14 (planning done)
- PRD, UX (final), architecture, spec (final) and tickets are committed on `main` (last: release 1 tickets).
- Tickets: `_bmad-output/initiative-petverse-mvp1/tickets.toml` = 14 epics in build order. Only `epic-platform` is incepted (17 entries; tracer first, then 4 spikes).
- Next: build `epic-platform` entry 1 (tracer). Its hitl steps (Privy app, Alchemy app + Gas Manager policy, test ETH, secrets, deploy OK) need the owner first.
- Open for later epics: battle odds, monster/boss stats, bonuses, stake bounds, season 1 start date, ETH/USD display source, CI remote, UI test tool.
