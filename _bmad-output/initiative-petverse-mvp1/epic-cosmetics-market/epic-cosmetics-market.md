---
type: epic
title: "Cosmetics and market"
parent: initiative-petverse-mvp1
covers: [CAP-18, CAP-25]
after: []
assignee: ""
risk: medium
---

# Cosmetics and market

## Description

A player dresses the pet in five slots, tries items on before buying, and trades rare-and-better items with other
players. This epic adds the 35-item catalogue with its rarity split to the Cosmetics ERC-1155 (commons soulbound, rare
and above tradeable), registers cosmetics in the Store with try-on, keeps equip off-chain and visual only, and builds
the Market with its 5% fee (half burned, half to the ETH pot through PotConverter) and review-before-buy sheet. It also defines the items other epics hand out: the soulbound season trophy
(epic-seasons), the soulbound egg-shard (epic-play-hub) and the Season Pass season skin (granted by epic-store-pass).
Capabilities CAP-18 and CAP-25 in the spec.

## Outcome

Players spend on looks and trade rare items, and market fees visibly reach the pot and the burn counter.

## Done when

1. On 46630 the catalogue holds 35 items over hat, face, neck, back and hand, each fitting all 10 species on the 3D
   stage; drops follow 60/25/12/3%; try-on works before buying.
2. A common item, Tombstone or badge cannot be transferred; a rare-or-better item can.
3. The Market lists only rare-and-better cosmetics, never pets, eggs, Co-Pets or commons; a sale takes 5%, half burned
   and half to the ETH pot; the buy goes through a review sheet showing item, seller, dollar price, token amount and
   fee.
4. Shop › Store cosmetics with try-on and Shop › Market work as in the mocks.
5. The season trophy, egg-shard and season skin items exist on 46630 with their transfer rule, ready for the epics that grant them.

## Boundaries

Cosmetic items, equip and their trade. Not the soulbound badge base (epic-pet-life built it); not prizes that hand out
cosmetics (wheel and raid in epic-play-hub, trophies in epic-seasons use this contract); not pet trading (DECISIONS #14).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-18, CAP-25
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Cosmetics, Money (market fee)
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1 (equip off-chain), AD-6 (drops), AD-11, AD-22
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Shop, Market buy sheet)
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mock .working/key-shop-claim.html
- decisions — docs/DECISIONS.md, #14

## Notes

- Waits on epic-store-pass because: the Store item registry and PotConverter.
- Waits on epic-pet-life because: the Cosmetics ERC-1155 base with soulbound badges.
- Source conflict: CAP-18 — "every item fits all 10 species" vs `src/lib/cosmetics.ts` "hand items: adults with arms only (babies have no hands)". Settle with the owner before inception.
- Decision: 2026-10-14 CAP-18 wins over the code comment: babies and armless (winged) species get a hand anchor so every hand item shows on every species and stage; entry 2 builds it and the owner approves the contact sheet. Settles the source conflict above (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 incepted into 13 entries (`tickets.toml`), one above the typical 8–12; kept as one epic because it is one owner and one contract pair (Cosmetics, Market), and entries 5, 6 and 11 are the hand-out items other epics wait on (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 tracer bullet = entry 1: one rare hat (Propeller cap, $4) is added to the live Cosmetics on 46630, bought in the Store, recorded by epic-pet-life's holdings projection, equipped through epic-pet-life's equip route and worn on Home. What someone sees running: a test player's pet wearing a bought hat on the Vercel app (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain story second = entry 2 (every item fits all 10 species in baby and adult form); it runs beside the tracer from the start (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 lanes that never touch the same code: A contracts, the Ignition module and the generated chain module 1 → 3 → 4 → 5 → 6 (one lane because all edit Ignition and regenerate the chain module); B 3D in `src/components/three` 2 → 11; C Shop and Home screens 7 → 8, then 10 (7 owns the shared cosmetic tile and rarity tag); D worker indexer and market read API 9, after 8 so only one of them touches the loadout and schema at a time; 11 waits on 8 because both change what the pet renders. `prisma/schema.prisma` is edited only by 9 (MarketListing; 8 makes no schema change); `src/lib/cosmetics.ts` only by 3; entry 1 does not edit `src/components/three` (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (12) is included; no separate end-to-end suite because the spec has no test plan; entry 13 is the integrated live check of Done when 1–5 on 46630 after the sweep (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 hitl steps, each on the first entry that needs it, and every deploy to 46630 waits for the owner's OK (CLAUDE.md): entry 1 — owner OKs the Cosmetics upgrade and the Store item registration, two Safe signers sign them through the timelock; entry 2 and 11 — owner approves the Gallery contact sheet; entry 13 — owner OKs the Cosmetics upgrade and Market deploy, two Safe signers sign them and the granter-role grants, owner walks Shop against the mocks (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 epic-pet-life owns the holdings projection (2.5) and the off-chain equip route with CosmeticEquip (2.10); this epic extends them and does not rebuild them (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 catalogue = the 35 visual items already in `src/lib/cosmetics.ts` (14 hats, 5 faces, 6 necks, 6 backs, 4 hands), with rarity counts 21 common / 9 rare / 4 epic / 1 legendary (60/25/12/3% of 35, rounded); mock rarities are kept (common: frog hat, star glasses, strawberry hat; rare: bunny ears, propeller cap, heart glasses; epic: chef hat, balloon; legendary: crown) and the rest are assigned by entry 3 for owner review. epic-pet-life's starter item keeps its token id as a common (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 "drops follow 60/25/12/3%" = a commit–reveal random drop (entry 6) that picks rarity at 6000/2500/1200/300 bps, then an item uniformly within that rarity; a granter may fix the rarity (the wheel's "common cosmetic" / "rare cosmetic" prizes) (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 Market listings are priced in PETV by the seller; the review sheet shows the dollar price at the read-only display rate; fee = 500 bps of the price, burn = fee ÷ 2 rounded down, pot share = the rest, seller gets price − fee; no listing expiry, minimum or maximum; cancel any time; an item in escrow is not held, so it drops off the pet (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 season trophy, egg-shard and season skin are soulbound and minted only by a granter role the timelock gives to the granting contract (EpochDistributor trophies stream, Care streak, SeasonPass; Wheel and Raid call the drop) (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry 8 equips only pets the player owns; equip on a Co-Pet (either owner, items they hold) is left to epic-social, which builds Co-Pet ownership (assumption, recommended default, DECISIONS #31).
- Assumption (economy numbers, owner confirms before entry 3 starts): store prices per rarity within the spec's $1–$20 band: common $1–$2, rare $3–$4, epic $8–$10, legendary $20, using the mock's price where the mock names the item (frog hat $1, star glasses $1, strawberry hat $2, bunny ears $3, propeller cap $4, heart glasses $3, chef hat $8, balloon $10, crown $20); other items take the band's lower value.
- Open question: what is a season skin visually (coat palette, full-body overlay or a sixth slot)? Entry 11 carries it as `unknown`; recommended: a per-season coat palette over the species' colours.
- Open question: which contracts call the random drop besides the wheel and raid prizes (for example a mystery box in the Store)? Entry 6 builds the call; the spec names no other drop source.
- Open question: egg-shard use is unset (initiative Notes); entry 5 only defines the soulbound item.
- Source conflict: key-shop-claim.html — Store and Market show "Headphones" vs `src/lib/cosmetics.ts` has no Headphones item (headphones are the adult pup's built-in prop in `species.tsx`); the mock also tags Headphones Epic in the Store and Rare in the Market. The catalogue follows `src/lib/cosmetics.ts`; the mock is read as illustrative.
- Source conflict: epic-store-pass Done when 4 — a $7.99 Pass "gives a season skin" vs the skin item is defined here (entry 5), and epic-store-pass is built before this epic. epic-store-pass grants it once entry 5 is live, or its Done when 4 is checked after this epic.
- Source conflict: envelope References cite AD-1 for off-chain equip and AD-6 for drops; the CosmeticEquip writer rule is AD-12. Both are followed.
- Resolved: 2026-10-14 pinned at integration: 9.1 → 7.6; 9.4 → 7.5; epic-death-match-raid 15.5 (was 9.12) → 7.3; 10.3 → 7.5; 10.4 → 7.5 (7.3 through it).
- Decision: 2026-10-14 entries cite epic-platform work (1.15 governance base, 1.16 Randomness) in their descriptions, not in `after`: this epic's initiative `after` names only epic-pet-life and epic-store-pass, and epic-pet-life already waits on 1.15 and 1.16, so `tickets.py status` stays free of `undeclared_after` (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 set check run on the draft by a separate validator; changes made: assumptions marked in entries 3, 4, 5 and 10; handoffs named on both sides (1→3–6, 2→11, 3→7/10, 4→8, 7→10); entry 10 verify covers the slot filter, the empty state, the not-enough-PETV state and no one-tap buy; entry 13 verify covers live drop weights and granted-item transfer reverts; collisions fixed by 9 after 8 and 11 after 8; `epic-store-pass` dropped from 4 and 7 because 1 already reaches it (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the "Check this result" view for a cosmetic drop is epic-launch's (CAP-28 views); entry 6 only emits the commitment and reveal events (assumption, recommended default, DECISIONS #31).
- Open question: owner confirms the catalogue's rarity assignment and the 35 store prices before entry 3 starts (CLAUDE.md: economy numbers need the owner).
- Decision: 2026-10-14 this epic extends epic-pet-life 2.5's Cosmetics base (per-id soulbound flag, MINTER role, holdings projection) and never rebuilds it: entry 3 sets each item's flag through 2.5, entry 5 adds the narrow granter roles. Entry 5 defines the season skin id and now waits on 5.10 (SeasonPass, the skin's granter); entry 13 grants that role to the live SeasonPass. Settles the skin Source conflict above (DECISIONS #50; owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 entry 1 now names its real store-pass providers (5.6 registry, 5.13 Store live) instead of the whole epic (owner recommended defaults, DECISIONS #31).
