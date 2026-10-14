---
type: epic
title: "Points, pot share and claim"
parent: initiative-petverse-mvp1
covers: [CAP-7, CAP-8, CAP-9]
after: []
assignee: ""
risk: high
---

# Points, pot share and claim

## Description

A player sees the ETH pot and their live share in dollars, and claims it; pot points set the share and lifetime points
set a level that never drops. This epic adds the two-level per-owner accumulator to PetCore (AD-4), PotFunder with its
85/15 split, the EpochDistributor with all its streams (small pot now; season pool and trophies for later epics), the
weekly small-pot epoch builder in the worker with its public dataset, and the pot, share, level and claim screens.
Capabilities CAP-7, CAP-8, CAP-9 in the spec.

## Outcome

Players trust and use the pot: they can see "your points = $X now", claim test ETH, and anyone can recompute every
share; the counter-metric "top 5% of pets take at most 50% of payouts" becomes measurable.

## Done when

1. On 46630, ETH sent to PotFunder and flushed is split 85/15; a player's claim pays their pet's share in test ETH,
   sets its pot points to 0 and leaves level and lifetime points unchanged.
2. Contract tests pin the AD-4 balance invariant across award, steal, sleep, wake, bury, claim and flush; an asleep pet
   gains nothing from a flush; splitting points across one owner's pets gives no extra share; a claim's gas does not
   grow with the number of players.
3. A weekly small-pot epoch closes on testnet: the worker posts a root whose dataset (served by a public route)
   rebuilds the same root, pays the bottom half of awake living pets older than 7 days equally, and a pet with
   `sleepAt == snapshotTs` is excluded.
4. The landing pot teaser and onboarding step 4 ("your points = $X now") work for a new player (CAP-1 part).
5. Home and the claim sheet show pot size and live share dollars first, as in the mocks; level shows as 1 + floor(sqrt(lifetime ÷ 100)).
6. On death, the pet's owed and pending ETH returns to the main pot (CAP-6 part), shown by the invariant test and one
   testnet bury.

## Boundaries

Pot accounting and points: PetCore's accumulator, PotFunder, EpochDistributor and the epoch builder, and the pot,
claim and level views, and the read-only ETH/USD display rate every screen uses to show dollars first (epic-petv
adds PETV/USD; the signed payment quote belongs to epic-store-pass, AD-10). Also the CAP-1 parts that show the pot (landing teaser, onboarding "see the pot" step). Not
the inflows (trade tax in epic-petv; store, pass and market income through PotConverter in epic-store-pass); not the
season-pool and trophy payouts (epic-seasons, epic-social, epic-play-hub use the streams built here); not anti-bot
flags and holds (epic-anti-bot).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-7, CAP-8, CAP-9 (and CAP-1, CAP-6 parts)
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Core terms, Pot
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-2, AD-4, AD-5, AD-14 (money reads from views), AD-16, AD-18
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Home, Claim sheet), Voice and Tone, UJ-2
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mock .working/key-shop-claim.html (claim sheet)
- decisions — docs/DECISIONS.md, #15, #17, #25 (N2, N3, N6, N7), #28

## Notes

- Waits on epic-pet-life because: PetCore with per-pet points, sleep / wake / bury hooks and the AD-16 status port.
- Waits on epic-platform because: the answer of spike 4 (per-owner accumulator invariant) is recorded here as a dated decision before inception.
- Decision: 2026-10-14 this epic owns PotFunder and EpochDistributor with every stream (`smallPot`, `seasonPool`, `trophies`); later epics only post into them (recommended default, DECISIONS #31).
- Resolved: Merkle tree library = `@openzeppelin/merkle-tree`, approved by the owner (DECISIONS #32); entry 5 adds it.
- Decision: 2026-10-14 incepted into 13 entries (`tickets.toml`), one above the typical 8–12; kept as one epic because it is one owner and one pot model, and the two live-testnet steps (11, 12) are separate hitl checks of different Done-when items (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 tracer bullet = entry 1: test ETH sent to PotFunder on 46630 is flushed 85/15, PetCore's accumulator credits the pet, Home shows its pending ETH from views, and Claim pays it and sets pot points to 0. What someone sees running: the owner's test ETH reaching a player's wallet through the app (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain story second = entry 2 (every settle path under the balance invariant), built on spike 1.4's prototype and test (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 lanes that never touch the same code: A contracts 1 → 2 → 3 → 4 (PetCore then EpochDistributor, one lane because both edit the Ignition module and regenerate the chain module); C worker epoch builder and dataset route 5 → 6; D app screens 7 → 8 → 9 and 10. Entry 7 runs in parallel from the start, lane C beside entry 8 once 4 is done; `prisma/schema.prisma` is edited only by 5 then 10, in order; the Ignition module and generated chain module only by lane A (1–4) and then 11 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (13) is included; no closing end-to-end suite, since the spec has no test plan and entries 11 and 12 are the integrated live checks (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 inception runs before spike 1.4's answer is recorded here; entries 1 and 2 wait on `1.4` in `after`, and a spike answer that changes AD-4 re-slices entries 1–3 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 hitl steps, each on the first entry that needs it, and every deploy to 46630 waits for the owner's OK (CLAUDE.md): entry 1 — owner OKs the PotFunder / PetCore / EpochDistributor deploy, funds the test with test ETH, the Safe grants KEEPER to the keeper key through the timelock if epic-pet-life has not; entry 7 — owner picks the ETH/USD source and enters any key it needs; entry 11 — owner OKs the upgrade, two Safe signers sign the upgrade and the EPOCH_POSTER grant, owner funds the EPOCH_POSTER key; entry 12 — owner enters the EPOCH_POSTER key in Render's secrets and a test player claims (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the bucket is keyed by a bucket id so a Co-Pet bucket plugs in; opening and closing Co-Pet buckets, the 50/50 Co-Pet claim split and the Co-Pet leave flow (AD-17) are epic-social's, which extends entries 1–2 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 `payoutHold` on claims and the flagged-pet exclusion list are epic-anti-bot's; entry 5 reads an exclusion list that is empty until then (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 lifetime points rise with every point gain (awards and steals won) and never fall (claims, wake cuts, losses, burns); if epic-pet-life's PetCore already stores them, entry 3 adds only the level view and port (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 small-pot leaves come from indexed projections as of the snapshot block, so the public dataset rebuilds from public events; the snapshot block is the last block with timestamp < epoch end; "older than 7 days" counts from hatch to snapshotTs; the bottom half is floor(n ÷ 2) eligible pets, ties at the cut broken by lower petId; division dust and an epoch with no eligible pet roll into the next epoch (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 EpochDistributor pays ETH for `smallPot` here; `seasonPool` (Gold) and `trophies` (cosmetics) get a per-stream payout hook that epic-petv and epic-cosmetics-market set through the timelock (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 Done when 3 is checked on the first real Sunday 00:00 UTC epoch after entry 12 is live; no epoch length (N3) is shortened. The bury in entry 11 uses epic-pet-life's shortened-timer test deploy (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the read-only display rate (entry 7) is a separate port from AD-10's IPriceSource: it never prices a payment and lives only in the app and server, as the initiative Notes assign (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the claim sheet's "Check this result" links to PetCore's public share views on Blockscout; epic-launch owns the fairness sheet and re-points the link to it (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the Avatar menu shell is epic-pet-life's (Home chrome); entry 10 adds the Claims item, creating the menu only if it is missing (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry 1 upgrades the live PetCore from epic-pet-life (UUPS, ERC-7201 storage appended, Safe-proposed through the timelock) rather than redeploying it; the keeper tick calling flush and the shortened-timer test deploy are handoffs epic-pet-life's Notes should also name (assumption, recommended default, DECISIONS #31).
- Open question: which ETH/USD source feeds the testnet dollar display (initiative Notes; DECISIONS #8 names Chainlink for mainnet only)? Entry 7 carries it as `unknown`; recommended: a keyless public spot price fetched server-side and cached, display only.
- Open question: does onboarding's "your points = $X now" mean the pet's claimable ETH (owed + pending, as on Home) or its points' slice of the current pot? Entries 8–9 assume claimable, which reads $0 until the first flush after hatch.
- Open question: does epic-pet-life's PetCore store lifetime points? Entry 3 adapts either way.
- Source conflict: initiative Notes — "Approve `@openzeppelin/merkle-tree` … epic-pot waits on it" is still open vs DECISIONS #32 approving it. This epic follows #32.
- Source conflict: this epic's Notes said spike 1.4's answer is recorded here before inception vs no answer recorded yet; settled by the Decision above (entries wait on `1.4`).
- Decision: 2026-10-14 integration: whole-epic waits on epic-pet-life are pinned: entry 1 → 2.11 (live PetCore to upgrade), 2 → 2.6 (bury), 5 → 2.2 (status port), 9 → 2.10 (onboarding shell) (owner recommended defaults, DECISIONS #31).
