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
- Decision: 2026-10-14 incepted into 10 entries in `tickets.toml` without a conversation; every choice below is a recommended default marked as an assumption (DECISIONS #31). The owner's "set Elder/Mythic effects before inception" note above is answered by an assumption, not by the owner.
- Decision: 2026-10-14 tracer = entry 1: a PetCore upgrade fixes the path at the level-3 crossing, a new Evolution module's `stageOf` view gives Baby / Teen / Adult from level, the indexer projects it, and Home shows "Species · Lv · Stage" with the path and the existing baby or adult 3D form. Demo: a test pet levelled on 46630 shows Teen with its path, then Adult (assumption, DECISIONS #31).
- Decision: 2026-10-14 least certain next = entry 2 (Breeding: Co-Pet approvals, doubling price, commit–reveal egg, inheritance, shiny). Lanes after the tracer: contracts Breeding (2) ∥ contracts Evolution Elder/Mythic (3) ∥ 3D looks (4); then deploy (5) → indexer and read (6) → Evolve sheet (7) → Breed sheet (8, shares the pet-card button row with 7) → Refactor sweep (9) → live Done-when pass on 46630 (10, closing end-to-end check). Entry 2 waits on 1 only because both may touch PetCore (assumption, DECISIONS #31).
- Decision: 2026-10-14 Baby, Teen and Adult are not stored: `stageOf` derives them from level, so they need no transaction (EXPERIENCE: "Teen and Adult come by level on their own"); Elder and Mythic are stored in Evolution and set by an `evolve` call (AD-1) (assumption, DECISIONS #31).
- Decision: 2026-10-14 the path is stored in PetCore and fixed in the same call that first takes the pet to level 3, from the care, battle and expedition counters (epic-pet-life Notes); a tie goes Guardian, then Warrior, then Explorer; pets already past level 3 when the upgrade lands get their path on their next touch. The path changes only the label, not the look (assumption, DECISIONS #31).
- Decision: 2026-10-14 Elder and Mythic change the look and the badge only; no stat, points or reward change in release 1 (assumption, DECISIONS #31). Evolution needs an awake pet; either owner of a Co-Pet may evolve it alone (the spec names only breeding and Death Match as two-owner actions).
- Decision: 2026-10-14 the Elder ($3) and Mythic ($5) items are soulbound ids in the Cosmetics ERC-1155, minted by the Store on purchase and burned one at a time by Evolution; a failed evolve keeps the item (assumption, DECISIONS #31; prices from game-rules Store prices, unchanged).
- Decision: 2026-10-14 Mythic's trophy check: the caller holds a season trophy of any finished season (a trophy-category Cosmetics id), not used up by evolving; it may have been won by any of the caller's pets (assumption, DECISIONS #31).
- Decision: 2026-10-14 breeding numbers not in the spec, proposed as testnet defaults and timelocked parameters (AD-18) (assumption, DECISIONS #31): cooldown 24 hours per parent after each breed; cost = $2.99 × 2^(the higher parent's breed count), so two fresh parents pay $2.99; each breed counts for both parents; species and element each 45% parent A / 45% parent B / 10% any; coat random among the species' palettes as at hatch; shiny when seed mod 500 = 0, independent of the rest; path, level and points are not inherited; the bred egg hatches like any egg (epic-pet-life) and gets new-pet protection.
- Decision: 2026-10-14 breeding rules (assumption, DECISIONS #31): both parents awake, level 6+, fed in the current 24-hour care window ("good care"); each parent is the caller's own pet or a Co-Pet the caller co-owns, and a Co-Pet parent needs its partner's one-use approval (AD-17); a friend's solo pet cannot be used. The caller pays in PETV through the price source (AD-10) with the Store's egg payment split, and the egg goes to the caller. A timed-out reveal refunds the PETV and counts nothing (AD-6).
- Decision: 2026-10-14 the element look is an accent (aura, particles or emblem per fire, water, leaf, spark, stone) on top of the random coat, and Teen / Elder / Mythic / shiny are added forms and finishes; no species' existing geometry changes, and the owner approves the looks on the Gallery page (entry 4) (assumption, DECISIONS #31).
- Decision: 2026-10-14 a closing Refactor sweep (entry 9) is kept by default; the live Done-when pass on 46630 (entry 10) is the closing end-to-end check after it.
- Handoff: entry 1 maps stage to the existing `adult` boolean in PetModel; entry 4 replaces that with a `stage` prop. Entry 7 adds the Evolve and Breed button pair with Breed locked; entry 8 opens it. Entry 2's `breedOutcome(seed, parents)` TS port is what entry 10 and epic-launch's "Check this result" recompute with.
- hitl: entry 1 — owner OKs the PetCore upgrade and Evolution deploy to 46630 and two Safe signers sign the timelocked upgrade (CLAUDE.md); entry 4 — owner approves the 3D looks; entry 5 — owner OKs the Breeding and Evolution v2 deploy, Safe signers sign the role grants and Store item registration; entry 10 — owner signs off the live checklist.
- Waits on (not declared in the initiative's `after` for this epic, met by the one-epic-at-a-time build order): epic-platform 1.16 Randomness (entry 2), 1.6 local-node fixture (entry 6); epic-pet-life PetCore counters, egg mint, Cosmetics base and element at hatch (entries 1–4); epic-battle battle counter increments (entry 1); epic-store-pass price source, Store item registry and egg payment split (entries 2, 3, 5); epic-cosmetics-market trophy item category and the shortfall/try-on UI pieces (entries 3, 7). Kept out of `after` so `tickets.py status` shows no `undeclared_after`; the initiative owner may add them to the initiative's `after` for epic 11.
- Resolved: 2026-10-14 epic-launch now waits on 11.10 (the live growth pass, which follows every earlier deploy) for 14.2, 14.4, 14.7 and 14.10, and 14.1 on epic-battle 6.12; this epic's 11.1 waits on 9.13, 11.2 on 8.3 and 11.8 on 8.5.
- Open question: confirm Elder and Mythic change only the look and badge (no stats or rewards). Entries 3 and 4 follow the assumption.
- Open question: confirm the breeding numbers above (24-hour cooldown, cost from the higher parent's count, 45/45/10 inheritance). Entry 2 follows the assumption; each is a timelocked parameter.
- Open question: is a season trophy tied to the pet that won it (then only that pet can go Mythic) or to the owner? epic-seasons 10.3 ranks pets but mints to a wallet. Entry 3 follows "any trophy the caller holds".
- Open question: does a bred egg's species pick from both parents' species only, or can it be any of the 10? Entry 2 follows 45/45/10.
- Source conflict: CAP-3 / game-rules Growth — "random coat" at hatch and "element sets colour" vs `src/lib/pets.ts` picking a random palette per species with no element. Entry 4 follows: coat stays random, element adds an accent.
- Source conflict: DESIGN.md / EXPERIENCE.md — "the glossy 3D jelly pets are fixed" vs CAP-16 needing Teen, Elder, Mythic, element and shiny looks, while `src/components/three/species.tsx` has only baby and adult forms. Entry 4 adds forms without changing species geometry; the owner approves.
- Decision: 2026-10-14 the stage levels (Teen 3, Adult 6, Elder 15, Mythic 30) are timelocked parameters in Evolution (AD-18); live drills on 46630 (entries 1, 7, 10) lower them through the Safe and timelock and restore them after, as epic-seasons uses shortened test seasons, because Lv 15 and Lv 30 need about 19,600 and 84,100 lifetime points. No test-only point grant is added. PetCore's level-3 path hook reads the Teen level from Evolution (assumption, DECISIONS #31).
- Handoff: entry 7 opens the Store sheet on the Elder or Mythic item; epic-store-pass's Store must support opening on an item id and list the two ids entry 5 registers. If it does not, entry 7 adds the deep link in the Store sheet.
- Handoff: entry 7, not entry 4, wires the Home blob stage's PetModel to the projected stage, element and shiny; entry 4 builds the looks and the Gallery only.
