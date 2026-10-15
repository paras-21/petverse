---
type: epic
title: "Log in, hatch and keep a pet alive"
parent: initiative-petverse-mvp1
covers: [CAP-1, CAP-3, CAP-4, CAP-5, CAP-6]
after: []
assignee: ""
risk: high
---

# Log in, hatch and keep a pet alive

## Description

A new player goes from a link to a hatched pet without knowing crypto, then lives the pet's life cycle: feeding keeps
it awake and earns a little, neglect puts it to sleep, waking costs pot points, and long neglect ends it gently with a
Tombstone and a free new egg. This epic builds PetCore as the single ledger (per-pet points, `sleepAt`, status), PetNFT,
the Care module, the voucher-gated free egg, the soulbound badge base of the Cosmetics ERC-1155, and the landing,
login, egg, onboarding and Home screens around the existing 3D pets. Capabilities CAP-1, CAP-3 to CAP-6 in the spec.

## Outcome

A first-time player hatches a pet and finishes onboarding in one sitting without crypto words; the spec's 7-day
retention signal starts here, and the re-hatch-after-death counter-metric becomes measurable.

## Done when

1. On the Vercel app against 46630, a fresh email or Google login lands on Home with a hatched pet (one of 10 species,
   random coat, fixed element) at no cost; a second free egg for the same login or a fresh empty wallet is refused.
2. Onboarding steps 1–3 (feed, dress up with a free item, tutorial bot battle that cannot be lost) each advance on
   doing the task and each can be skipped; step 4 (see the pot) is delivered and checked by epic-pot.
3. Contract tests pin the life cycle at its boundaries: sleep at exactly 3 days after the last feed, dead at exactly
   `deathAt`, wake loses 10% of pot points per day asleep (day 1 10% … day 7 70%), level and lifetime points unchanged,
   new-pet protection for 3 days; the TS status port passes the same shared vectors.
4. A pet left unfed on testnet with shortened test parameters sleeps, is buried by the keeper, its NFT is burned, the
   owner holds a Tombstone and can hatch a free egg.
5. Home shows the timer chip, the hungry window and asleep / passed-away states as in the mocks, dollars first, no
   crypto words.

## Boundaries

The pet life loop: landing, login, hatch, Home, care, sleep, wake, death and the onboarding steps. Not the pot
accounting (epic-pot): the "see the pot" step and the landing pot teaser show epic-pot's views, and the ETH recycle on
death is epic-pot's part of CAP-6; the unpaid-Gold deletion on death is epic-petv's part. Not alerts (epic-alerts),
not the store (epic-store-pass), not tradeable cosmetics (epic-cosmetics-market).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-1, CAP-3, CAP-4, CAP-5, CAP-6
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Core terms, Life cycle
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1, AD-2, AD-6 (tutorial battle has no randomness), AD-15 (vouchers), AD-16, AD-18, AD-22
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Landing, Login sheet, Egg, Home), Onboarding, UJ-1, UJ-3, State Patterns
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mocks .working/key-landing-hatch.html, .working/key-sleep-death.html, .working/key-home-copet.html (Home only)
- decisions — docs/DECISIONS.md, #13, #15, #18, #27

## Notes

- Waits on epic-platform because: tracer path, GameWallet, generated chain module, governance base, Randomness service (random coat), Privy server auth and the schema-per-environment setup; and the spike answers on wallet modes and commit–reveal.
- Decision: 2026-10-14 this epic owns PetCore, PetNFT, the voucher signer and the Cosmetics ERC-1155 base with soulbound badges (Tombstone, the free onboarding item); later epics extend them (recommended default, DECISIONS #31).
- Decision: 2026-10-14 CAP-1, CAP-3 to CAP-6 stay in one epic because PetCore + Care deliver them under one rule (AD-16) and one owner; onboarding is the screen layer over the same loop (recommended default, DECISIONS #31).
- Decision: 2026-10-14 PetCore keeps per-pet counts of care, battle and expedition actions from this epic on (care counted here; epic-battle and epic-play-hub increment theirs), so epic-growth can set the path at Teen for pets that grew up earlier (recommended default, DECISIONS #31).
- Assumption: the onboarding "dress up" step uses one free common, soulbound cosmetic granted with the first hatch (EXPERIENCE Onboarding: "a free cosmetic is put on").
- Decision: 2026-10-14 tracer bullet = entry 1: Privy login → voucher-gated hatch on PetCore / PetNFT on 46630 settled by a Randomness reveal → indexer Pet row → Home renders that pet with the existing PetModel. App and worker run locally; hosting follows in entry 11 (recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain story right after the tracer = entry 2, the PetCore life cycle (AD-16 boundaries, wake cut, TS status port with shared vectors) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 two lanes. Lane A (chain/, worker, indexer, prisma, server voucher route): 1 → 2 → 4 → 5 → 6 → 7 → 11. Lane B (UI): 3 → 9 → 8 → 10; entry 9 owns the route choosing Landing / Egg / Home and entry 8 changes only Home. Lane B runs beside lane A once each UI entry's chain prerequisite is done; entry 7 makes no schema change, so it runs beside 8 and 10. Entries that edit `prisma/schema.prisma`, the Ignition module or PetCore run one after another (1 → 2 → 4 → 5 → 6 → 8 → 10) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 this epic owns the Pet Press UI kit and app shell (entry 3; theme changed from Candy by DECISIONS #58) as the first user-facing epic; the tab bar carries only Home, and each later epic adds its own tab (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the Landing ships without the pot teaser and onboarding ends after step 3 with the closing card; epic-pot adds the teaser and inserts step 4 (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the hungry window shows on Home here; its push and Telegram alerts and the push-permission prompt after the first feed belong to epic-alerts (recommended default, DECISIONS #31).
- Decision: 2026-10-14 Done when 4's shortened timers run on a separate drill instance of the contracts on 46630, so the live game's timelocked timers stay at their defaults (recommended default, DECISIONS #31).
- Decision: 2026-10-14 cosmetic equip is off-chain (AD-1) in a CosmeticEquip row written by the API (entry 10); the level badge on Home comes with epic-pot's CAP-7 (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the food balance lives in PetCore per owner so epic-store-pass and epic-play-hub can credit food later; feed spends one meal (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the open question on skipped onboarding steps is settled by EXPERIENCE Open question 8 (owner, 2026-10-14): skipped steps return as small hints (entry 10) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (entry 12) is included; no closing end-to-end suite, since the spec has no test plan and entry 11 carries the integrated check (recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry `notes` carry the hitl steps and the outside check for high-risk entries, following epic-platform's convention (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the prototype's local-only screens and store (`src/lib/store.ts`, EggScreen, HomeScreen) are replaced by the chain-backed screens; deleting any of them is proposed in the Refactor sweep and needs the owner's OK (CLAUDE.md) (recommended default, DECISIONS #31).
- Assumption: species, coat and element are drawn on-chain from the hatch reveal seed; the coat indexes `SPECIES_PALETTES[species]` in `src/lib/pets.ts`, whose list lengths PetCore mirrors; the element is drawn at random from the five, not fixed per species (entry 1).
- Assumption: the free starter item is one common hat (not a hand item, given the open CAP-18 conflict that babies have no hands); an egg hatched after a death gets the starter meals again but not a second starter item (entries 4, 5).
- Decision: 2026-10-14 PetCore gets in entry 2 the accrued-Gold counter (epic-petv pays and deletes it) and the shield-until field (epic-store-pass sells shields, epic-battle sets them), which the initiative promises those epics (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the KEEPER role and key are created by entry 6; epic-pot uses it (recommended default, DECISIONS #31).
- Open question: is the element random at the reveal or fixed per species, and which common item is the starter? Both assumptions above stand until the owner says otherwise.
- Open question: points per feed, starter meals at hatch, whether free meals refill, and points for the tutorial win (EXPERIENCE copy shows "+20 points" and "2 free meals"; game-rules has no value). Owner decision; entry 4 waits on it.
- Open question: what counts as "a wallet with history" for the free egg (transaction count, age or balance, and on which chains). Owner decision (AD-15); entry 7 waits on it.
- Source conflict: game-rules Growth "Element … sets colour" vs `src/lib/pets.ts`, where the coat is a random palette per species and no element exists. Plan follows CAP-3 ("random coat, element fixed"): element is shown as a badge and does not set the coat.
- Source conflict: EXPERIENCE Onboarding "Not decided: whether skipped steps come back later as hints" vs EXPERIENCE Open question 8 "skipped onboarding steps return as small hints". The resolved Open question is followed.
- Decision: 2026-10-14 integration: entry 2 adds the shield-until field and view and the per-pet care, battle and expedition counters with a GAME_MODULE increment (the counters the earlier Decision promised had no owning entry); the shield setter, paid eggs and the Shield item are epic-store-pass 5.6 only. Entry 5 is the one Cosmetics base (per-id soulbound flag, MINTER role, holdings projection) that epic-cosmetics-market extends without rebuilding. Whole-epic waits on this epic are pinned: 3.1 → 2.11, 3.2 → 2.6, 3.5 → 2.2, 3.9 → 2.10, 6.1 and 6.3 → 2.2 (owner recommended defaults, DECISIONS #31).
