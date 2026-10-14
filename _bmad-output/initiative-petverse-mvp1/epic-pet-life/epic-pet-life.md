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
- Open question: do skipped onboarding steps come back later as hints (EXPERIENCE Onboarding, not decided)?
