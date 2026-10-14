---
type: epic
title: "Evolution and breeding"
parent: initiative-petverse-mvp1
covers: [CAP-16, CAP-17]
after: []
assignee: ""
risk: medium
---

# Evolution and breeding

## Description

The pet grows through stages shaped by how it is played, and two adults make a new egg. This epic builds the
Evolution module (stages, the path set at Teen by the most-done action, element look, Elder and Mythic items and the
Mythic trophy check), the Elder and Mythic items in the Store, the Breeding module (own pets or Co-Pets, at most 5
breeds with doubling cost, good care on both parents, 1 in 500 shiny), and the Evolve and Breed sheets. Capabilities
CAP-16 and CAP-17 in the spec.

## Outcome

Players keep investing in one pet over weeks; evolutions and breeds per active player are the signal.

## Done when

1. On 46630 a pet moves Egg → Baby → Teen (level 3) → Adult (level 6); its path is set at Teen by the most-done action
   (battles → Warrior, care → Guardian, expeditions → Explorer); its element sets its look on the 3D stage.
2. Elder needs level 15 and an Elder item; Mythic needs level 30, a Mythic item and a season trophy; both items are
   sold in the Store dollars first.
3. Breeding takes two adults (own or Co-Pet with both approvals), each breeds at most 5 times at 1×, 2×, 4×, 8×, 16×
   of $2.99, both parents need good care, and 1 in 500 eggs is shiny, checkable against its commitment.
4. The Evolve and Breed sheets on the Home pet card work as in the spine.

## Boundaries

Pet growth. Not season trophies (epic-seasons awards them), not Co-Pet approvals (epic-social), not the Store itself
(epic-store-pass). No pet or egg trading (DECISIONS #14).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-16, CAP-17
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Growth
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-2, AD-6, AD-10, AD-17, AD-22
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Evolve sheet, Breed sheet)
- decisions — docs/DECISIONS.md, #14

## Notes

- Waits on epic-seasons because: season trophies for Mythic.
- Waits on epic-social because: two-owner approvals for Co-Pet breeding.
- Waits on epic-play-hub because: expedition counts for the Explorer path (the counters live in PetCore from epic-pet-life; epic-battle and epic-play-hub increment them).
- Decision: 2026-10-14 evolution and breeding come after seasons so Mythic can be checked end to end on testnet (recommended default, DECISIONS #31).
- Open question: what Elder and Mythic stages change besides the look (stats, rewards) is not in the spec; the owner sets it before inception.
