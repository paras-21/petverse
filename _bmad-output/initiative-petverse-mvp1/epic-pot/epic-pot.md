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
- Open question: Merkle tree library for the epoch builder: approve `@openzeppelin/merkle-tree` or build trees with viem only (initiative Notes).
