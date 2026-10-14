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
