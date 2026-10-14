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
- Open question: the exact thresholds for "many accounts" and "perfectly regular timing", and who reviews flags, are not in the spec; the owner sets them before inception. Inception (2026-10-14) proceeded on the assumed values below; the owner may change any of them in GameConfig before entry 12.

### Inception (2026-10-14, facilitator without conversation, owner instruction: recommended defaults)

- Decision: 2026-10-14 tracer = entry 1: on a local node a device-sharing farm is flagged by the worker, RISK holds its pet's claim on PetCore, and a reviewer sees the flag on /admin/risk; it proves auth capture → worker → DB → contract → admin UI connect (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain work goes next as spike 2 (funding-wallet lookup on 46630, which funders to ignore); it runs beside the tracer and only entry 5 waits on it (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 lanes: A chain (1 → 3 → 12), B worker detector (1 → 4 → 5 → 6), C server refusals (7), D epoch exclusion (8), E admin review (9), F metrics (11); closing 10 → 12 → 13 Refactor sweep. 13 entries, one past the typical range, because the epic spans contract, worker, server and admin UI with one owner; no split proposed (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry 1 adds every model this epic needs (LoginSeen = auth API, RiskFlag = worker risk job, RiskReview = admin API, PayoutHold = indexer, MetricDaily = metrics job) in one migration so later lanes never edit the schema in parallel (AD-12; assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 one shared `isFlagged(did)` port in `src/server/risk` is the only answer to "is this account flagged" for the gas webhook, voucher routes, epoch builder and metrics: an account is flagged while it has a RiskFlag with no later clearing RiskReview (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 thresholds live off-chain in GameConfig (AD-18), pinned by tests; GameConfig is created by entry 1 if no earlier epic has created it (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 assumed thresholds (assumption, recommended default, DECISIONS #31): device = a random first-party id the app stores and sends, hashed server-side; 3 or more Privy DIDs on one device id within 30 days flag all of them. Funding wallet = 3 or more accounts whose first funding came from one wallet within 30 days flag all of them; Faucet, team, Safe, curve and pool are ignored (final list from spike 2). Regular timing = 30 or more game actions in a rolling 24 h with a coefficient of variation of the gaps under 0.1. IP address is not a flag on its own.
- Decision: 2026-10-14 reviewers = the owner and the two Safe teammates (DECISIONS #35), listed by Privy DID in GameConfig; target: every flag reviewed within 48 h so it closes inside one 72 h hold (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 hold reading of N9: RISK sets a hold that ends by itself at 72 h; RISK cannot set a new hold on the same pet within 72 h after the last one ended; the Safe renews or clears directly (not through the timelock, because a hold only delays a claim and moves no funds); RISK may lift a hold it set (only shortens a delay). The hold also blocks the pet's EpochDistributor small-pot claim, and a Co-Pet's whole claim (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 a flag is per account; every pet the account owns or co-owns is held and excluded, including pets hatched after the flag (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 counter-metric definitions (assumption, recommended default, DECISIONS #31): day = UTC day, job after 00:30 UTC; bot share = pot ETH paid (PetCore claims + small-pot claims) that day to accounts with an open or confirmed flag ÷ all pot ETH paid that day; top-5% share = share of pot ETH paid to the top 5% of pets over the trailing 7 days; robbed-new-player churn = of players robbed within 7 days of their first session, those with no game action in days 8–14 after it; re-hatch = of owners whose pet was buried, those who hatched again within 7 days. Cohort metrics are written for the day their window closes.
- Decision: 2026-10-14 entry 10 pins, rather than rebuilds, the counters other epics own: the same-owner / co-owner battle ban (epic-battle, AD-2) and the per-owner curve (epic-pot, DECISIONS #17); this epic adds no new battle or curve rule (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 vouchers themselves stay in epic-pet-life (2.1, 2.7) and epic-store-pass (faucet); this epic only makes those routes and the gas webhook refuse flagged accounts (entry 7), as both envelopes say (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 player copy for a refused or held account is calm and names no accusation ("Free actions are paused while we check your account", "Claims paused for a check · back by <time>"); EXPERIENCE has no such state yet (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 Refactor sweep closes the epic (entry 13); no separate end-to-end suite beyond entry 10's seeded-farm test (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 entries name only prerequisites in epics this epic declares (epic-pot, epic-store-pass, epic-battle). What they also use from epic-platform (1.11 Privy auth, 1.12 wallet modes, 1.13 governance roles, 1.15 deployed governance) and epic-pet-life (2.1 and 2.7 voucher routes, 2.6 PetBuried) is done earlier because epics are built one at a time in order (initiative Decision); descriptions name them. Open question for the initiative owner: add epic-platform and epic-pet-life to epic 13's `after` in the initiative breakdown so these can be pinned (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 after epic-store-pass and epic-battle were incepted, entries pin their real providers: 7 waits on 5.2 (gas webhook) and 5.4 (faucet), 10 on 6.3 (same-owner / co-owner ban), 11 on 6.1 (PetRobbed projection), 1 on 5.8 (first GameConfig use); entry 1 owns the worker job registration and the /admin layout and guard so lanes 4–6, 9 and 11 do not collide; the Co-Pet claim path held by entry 3 is epic-social 8.2 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the frontmatter keeps `after: []`, as the initiative Decision for every epic says; what this epic needs is in the initiative breakdown and the "Waits on" Notes (assumption, recommended default, DECISIONS #31).
- Resolved: 2026-10-14 epic-launch 14.8 now waits on 13.11, and 14.13 on 13.12.
- hitl steps (entry 1): the owner names the reviewer DIDs. (Entry 2): the owner accepts the spike answer and ignore list. (Entry 9): a team reviewer clears one seeded flag on the dev deploy. (Entry 12): the owner OKs the upgrade on 46630 (CLAUDE.md), two Safe signers sign the upgrade, the RISK role grant and the drill's renew and clear, the owner creates and funds the RISK key and enters it in Render secrets.
- High risk: entries 1, 3, 7, 9 and 12. Outside check = the adversarial review in the gate (DECISIONS #2) on the RISK role and hold paths; for 12, the owner and one other Safe signer confirm the drill on the explorer.
- Decision: 2026-10-14 a confirmed bot pet's unclaimed pot ETH is recycled into the main pot (the buried-pet path) and its points zeroed once the Safe confirms the flag (owner, DECISIONS #56): entry 3 adds the Safe-only confirmBot, entry 9 prepares the Safe transaction on a reviewer's confirm, entry 12 drills it.
- Open question: the Safe renewing or clearing a hold directly, outside the timelock, is read as allowed because it changes no rule and moves no funds (AD-3 lets the Safe act instantly only to pause or cancel); the owner confirms, or renewals go through the 1-hour timelock.
- Open question: a Co-Pet where only one owner is flagged; assumed the whole pet is held and excluded, which also delays the honest partner's half.
- Open question: storing a device id and funding links is personal data; the owner confirms the privacy wording before entry 12.
- Open question: whether players are told why sponsorship or a claim is paused beyond the calm copy, and whether they can ask for review in app.
- Source conflict: CAP-29 / game-rules Flags — "flagged accounts are excluded from pot payouts … until cleared" vs AD-15 / N9 — the on-chain hold expires by itself after 72 h, so main-pot claims resume after 72 h unless the Safe renews. Followed AD-15; entry 6 surfaces renewal requests to reviewers.
- Source conflict: owner-numbers.md N9 — "one back-to-back renewal needs the Safe" vs AD-15 — "cannot be renewed back-to-back without the Safe" (no limit on Safe renewals). Read as: every back-to-back renewal needs the Safe, with no count limit.
- Source conflict: epic Boundaries — "not vouchers" vs CAP-29 "free eggs and faucet need a voucher"; settled by the initiative Decision that the vouchers are epic-pet-life's and epic-store-pass's, and by epic-store-pass Boundaries giving the flagged-account refusal to this epic (entry 7).
