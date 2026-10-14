---
type: epic
title: "Anti-bot flags, payout holds and counter-metrics"
parent: initiative-petverse-mvp1
covers: [CAP-29]
after: []
assignee: ""
risk: high
---

# Anti-bot flags, payout holds and counter-metrics

## Description

Bots and account farms cannot take the pot. This epic builds off-chain risk detection (many accounts per device or
funding wallet, perfectly regular timing) into `RiskFlag`, the narrow on-chain `payoutHold` that expires after 72
hours, exclusion of flagged accounts from epoch snapshots and gas sponsorship, the review and clear flow, and the
daily metrics job that stores the four counter-metrics. Capability CAP-29 in the spec; the free-egg voucher is
CAP-3's (epic-pet-life) and the faucet voucher is epic-store-pass's.

## Outcome

Bot accounts take at most 10% of pot payouts, measured daily; the other three counter-metrics are measured too.

## Done when

1. A seeded farm of accounts sharing a device or funding wallet, or acting on perfectly regular timing, is flagged;
   flagged accounts get no gas sponsorship and are left out of the next small-pot snapshot.
2. On 46630 the `RISK` key sets a payout hold that only delays claims, expires by itself after 72 hours, cannot be
   renewed back to back without the Safe, and the Safe can clear it; the `RISK` key cannot move funds.
3. `MetricDaily` stores the four counter-metrics every day from projections.
4. A flagged account is cleared through a recorded review and regains payouts and sponsorship.

## Boundaries

Bot detection and its consequences. Not vouchers (epic-pet-life, epic-store-pass), not ops alarms (epic-launch).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-29, Success signal
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Anti-bot and admin, Counter-metric limits
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-5, AD-7, AD-15, AD-23
- decisions — docs/DECISIONS.md, #25 (N9)

## Notes

- Waits on epic-pot because: claims and the small-pot epoch builder exclude flagged pets.
- Waits on epic-store-pass because: the gas webhook and faucet refuse flagged accounts.
- Waits on epic-battle because: `PetRobbed` projections feed the robbed-new-player churn metric.
- Open question: the exact thresholds for "many accounts" and "perfectly regular timing", and who reviews flags, are not in the spec; the owner sets them before inception.
