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
