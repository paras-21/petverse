---
type: epic
title: "Fairness views, operations and testnet launch"
parent: initiative-petverse-mvp1
covers: [CAP-28]
after: []
assignee: ""
risk: high
---

# Fairness views, operations and testnet launch

## Description

Anyone can check every random result and every money number, the team can see and run the live game, and testnet
opens to players only when everything works. This epic builds "Check this result" and the How it's fair page over the
commitments every module emits, confirms every contract is verified and public, adds the ops alarms (indexer lag,
reveal backlog and late reveals, keeper backlog, signer and Gas Manager balances), writes the admin, timelock and
deploy runbooks (Safe web UI and Protocol Kit / CLI paths), runs the full release-1 deploy on 46630 and opens it.
Capability CAP-28 in the spec, plus the spec's "ships all at once" constraint.

## Outcome

Testnet opens with all capabilities working and checkable; the initiative's success signal starts counting.

## Done when

1. Every random result type (battle, wheel, dice, wager, monster, expedition, egg, breeding, cosmetic drop) shows
   "Check this result", which recomputes it from the published commitment and reveal.
2. Every release-1 contract on 46630 is source-verified on Blockscout, and points, pot shares and claims read from
   public views match the app.
3. The ops alarms fire on a staged indexer stall, an unrevealed request and a low signer balance, and reach the team.
4. The runbooks are followed once end to end by someone other than their author, including a Safe-proposed change and
   a pause.
5. Testnet opens to players only after a full pass of every epic's Done when on the final deployment, with the owner's
   OK.

## Boundaries

Checkability, operations and the launch. Not the game rules (every other epic), not mainnet (spec Non-goals).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-28, Constraints ("ships all at once"), Success signal
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-3, AD-5 (public datasets), AD-6, AD-14, AD-23
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (How it's fair)
- decisions — docs/DECISIONS.md, #11, #12, #30
- owner checklist — docs/OWNER-CHECKLIST.md

## Notes

- Waits on epic-growth because: every game module is deployed, so every random result and money number can be checked.
- Waits on epic-alerts because: its send-to-team-chat function on the Telegram bot delivers the ops alarms.
- Waits on epic-anti-bot because: counter-metrics in `MetricDaily`.
- Decision: 2026-10-14 fairness views join the launch epic because they check results from every module and are the last proof before opening (recommended default, DECISIONS #31).
- Decision: 2026-10-14 opening testnet to players is an owner call at the end of this epic, not automatic (CLAUDE.md: deploys need the owner).
- Decision: 2026-10-14 inception: 15 entries in `tickets.toml`, over the typical 8–12 because the epic holds four lanes plus a closing launch chain that cannot merge without shrinking (assumption, recommended default, DECISIONS #31). Lanes: A fairness route + sheet (1 → 2 → 3 → 6); B launch-check scripts (4 → 5); C ops alarms + team dashboard (7 → 8 → 9); D runbooks + Safe helper scripts (10 → 11); closing 12 → 13 → 14 → 15. A, B, C and D run in parallel; 6 waits on 4 for the contract-list format, 10 on 7 for the alarm list, 11 on 4 for the post-rotation check.
- Decision: 2026-10-14 tracer bullet = entry 1: one battle result's "Check this result" from the Randomness register / reveal events through a public route to the fairness sheet on the Vercel app on 46630 (assumption, DECISIONS #31). Least certain next = spike 2: whether all nine result types can be recomputed from the reveal alone (assumption, DECISIONS #31).
- Decision: 2026-10-14 the Refactor sweep (12) waits on every entry except the closing end-to-end suite (13), the final deploy (14) and the launch opening (15), because the final deployment must carry the swept code and the opening must follow the final deployment (assumption, DECISIONS #31).
- Decision: 2026-10-14 entries name in `after` only the epics the initiative declares for epic-launch (epic-growth, epic-alerts, epic-anti-bot), which wait transitively on the earlier providers; the earlier entries they rely on are named in descriptions as handoffs: 1.3 Safe path and 1.15 governance deploy (entries 4, 10), 1.9 health route (7), 1.16 Randomness (1), 3.6 dataset route and rebuild script, 3.10 Claim projection, 4.7 burn route (5), 3.8 claim-sheet link (3) (assumption, DECISIONS #31).
- Decision: 2026-10-14 "Check this result" covers all nine CAP-28 result types, not only the four EXPERIENCE lists; entry 3 adds the link to monster, expedition, egg-hatch, breeding and cosmetic-drop results (spec wins; assumption, DECISIONS #31).
- Decision: 2026-10-14 the burn counter is built by epic-petv (4.1, 4.8); this epic only reconciles its total with the PETV `Burned` events (entry 5) and shows it on How it's fair (entry 6) (assumption, DECISIONS #31).
- Decision: 2026-10-14 the closing end-to-end suite (13) drives API and contracts through the GameWallet test adapter on a Hardhat local node with `node:test`, no browser runner; screens are checked by hand in entry 15 (assumption, DECISIONS #31; Playwright is not an approved dependency, DECISIONS #24).
- Decision: 2026-10-14 the team ops page (8) reuses epic-anti-bot's reviewer gate and links its /admin/metrics page (13.11) instead of a second gate or metrics view; alarm thresholds are ops config, not economy numbers (assumption, DECISIONS #31).
- Decision: 2026-10-14 the fairness sheet's timed-out state reads "Closed with no change · nothing was spent" (not in DESIGN or EXPERIENCE; assumption, DECISIONS #31).
- Decision: 2026-10-14 set check applied: spike 2 runs beside the tracer; 7 and 10 also wait on epic-growth (per-contract signals, full deploy runbook); 6 builds the timelock-operation indexer handlers; 7 routes 1.16's late-reveal alert instead of a second one (assumption, DECISIONS #31).
- Decision: 2026-10-14 runbooks live in `docs/runbooks/`, launch-check scripts in `scripts/launch/`, Safe helper scripts in `chain/scripts/`, drill records and the launch checklist in this folder (assumption, DECISIONS #31).
- hitl steps: entry 1 — owner OKs the Vercel production deploy. Entry 9 — owner OKs the Render worker deploy with the alarms job and the staged faults on 46630; a teammate confirms the team-chat messages. Entry 11 — a team member who did not write the runbooks runs the drill; two Safe signers sign the parameter change, cancel, pause, unpause and role rotation; the owner updates the rotated key's host secret (never pasted in chat). Entry 14 — owner OKs every 46630 deploy and the Vercel / Render redeploys (CLAUDE.md); owner funds the deployer, every role key, the faucet and the Gas Manager policy with test ETH (OWNER-CHECKLIST); owner verifies on Blockscout by hand any contract the scripted verify fails on; two Safe signers sign the role grants and timelock wiring. Entry 15 — owner and a teammate run the manual phone and desktop pass; owner gives the dated OK to open.
- High risk outside checks: entry 2 — owner accepts the spike answer before entry 3 starts. Entry 3 — adversarial review in the gate on the recompute route (a forged reveal must not show "Matches"). Entry 11 — two Safe signers confirm the drill on the explorer. Entries 13–15 — owner reviews the launch checklist evidence.
- Open question: entry 2 — when a module exposes neither the outcome inputs nor a pure outcome view, the fix goes back to that module's epic as a new entry or into this epic (recommended: the owning epic). Recorded as the entry's `unknown`.
- Open question: entry 7 — how the worker reads the Alchemy Gas Manager policy balance (API or dashboard only); recommended fallback: spend tracked from the gas webhook against an owner-entered budget. Recorded as the entry's `unknown`.
- Open question: entry 14 — fresh deploy of every contract (recommended: clean state, proves the deploy runbook) or the epics' incrementally upgraded deployment; if fresh, which live schema the worker indexes into, since emptying `game` is destructive SQL only the owner may order (CLAUDE.md, DECISIONS #33). Recorded as the entry's `unknown`.
- Open question: what "open to players" means technically — announcement and the production URL shared (assumed), or an in-app sign-up gate lifted. No source defines a gate; none is planned.
- Open question: does the owner want a browser end-to-end runner (Playwright) added to the closing suite? It needs dependency approval (DECISIONS #24).
- Resolved: 2026-10-14 at integration every whole-epic wait was pinned: 14.1 → 6.12 (epic-battle now declared in epic 14's `after`), 14.2, 14.4 and 14.10 → 11.10, 14.7 → 12.11 and 11.10, 14.8 → 13.11, 14.13 also → 12.12 and 13.12. Other earlier providers stay named in descriptions.
- Source conflict: CAP-28 / Done when 1 — nine result types are checkable vs EXPERIENCE "Fairness is checkable" naming battle, wheel, dice, wager and claim only. Settled above by the spec.
- Source conflict: AD-23 — alert on the Gas Manager balance vs no source showing that Alchemy exposes the policy balance to a worker. Entry 7's `unknown`.
