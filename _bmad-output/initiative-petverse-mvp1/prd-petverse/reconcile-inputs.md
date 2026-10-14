# Reconcile: PRD vs its inputs

Checked 2026-10-14. PRD = `prd-petverse.md` + `addendum.md`. Inputs = `intent/001-petverse-play-to-earn-pets.md`,
`docs/DECISIONS.md`, `docs/OWNER-CHECKLIST.md`, `web3-pet-research/frenpet-contracts/CONTRACTS.md`.
Owner decisions in `.memlog.md` override older inputs; those are listed in Part B as "input doc now stale", not gaps.
The PRD was not edited.

## Part A: Gaps (PRD drops or contradicts an input)

Ranked by severity.

### A1. Randomness signer limits are dropped; commit–reveal covers battles only (HIGH, trust)
- Intent, Proposed outcome: "the randomness signer's role written down and limited". Intent, Constraints: "Randomness
  means trusting our server's commit–reveal, so its limits must be public." Intent open question: commit per epoch
  on-chain, signer key in a KMS, public reveal log?
- PRD: NFR-1 lists only verified contracts, multisig, time delay (3 of the trust measures). The 4th (limited, documented
  signer) is gone. FR-27 applies commit–reveal to **battles only**, but the PRD also has random outcomes in the daily
  wheel (FR-48), monsters (FR-50), expeditions (FR-38), breeding/shiny 1-in-500 (FR-37), egg coat/species (FR-6), dice
  (FR-26), cosmetic rarity drops (FR-40). Fren Pet uses commit–reveal for attacks, wheel, gacha, loot, monsters, dice
  (CONTRACTS.md). The signer open question is not in §9.
- Fix: add an NFR "randomness signer: role public and limited" and widen FR-27 to every random outcome.

### A2. Legal follow-ups: geo-blocking, age checks, launch countries (HIGH, legal)
- OWNER-CHECKLIST: lawyer review covers "geo-blocking, age checks". Intent open question: "Which countries we launch
  in. Drives check 5."
- PRD §8 mentions the lawyer gate for mainnet but has no requirement or open question for geo-blocking, age gating, or
  launch countries. Even on testnet, wagers/dice/claims UX is being built now; if geo/age gates are needed later they
  touch login (FR-2) and wager flows.
- Fix: add launch countries / geo / age to §9, or state explicitly that release 1 has no geo or age gate.

### A3. Open questions collapsed from 8 to 1 (MEDIUM, process)
- `.memlog.md` event says "8 open questions listed"; PRD §9 now has 1 (Pons tax cap).
- Silently dropped from intent open questions / OWNER-CHECKLIST:
  - Multisig choice, number of signers, length of the upgrade delay (NFR-1 depends on it).
  - Randomness signer limits (see A1).
  - Launch countries (see A2).
  - Name for Gold (OWNER-CHECKLIST, still unchecked; PRD just uses "Gold").
  - How tests use the one hosted DB (separate schema). NFR-6 says "tests never touch real data" but drops the
    intent's "own schema and must never wipe data" detail.
  - Fren Pet current daily users (minor, research).
- Token launch type (Pons vs ICO) is resolved by memlog (Pons, own Pons-like curve on testnet) — fine, but
  OWNER-CHECKLIST still shows it open (stale, Part B).

### A4. Boss raid silently dropped (MEDIUM, scope)
- Intent "More game": "1v1 / 2v2 / Death Match (3 lives) / guild war / **boss raid**".
- PRD has no boss raid FR and does not list it under §7 "Not in release 1". Monsters (FR-50) are PvE but solo.
- Fix: either add it or list it as out of scope.

### A5. Token economics numbers missing: $PETV supply and the tax split (MEDIUM, economy)
- Intent: "$PETV: 1B fixed". PRD never states supply or that it is fixed (glossary/FR-41 silent). Burns (FR-45) only
  make sense against a fixed supply.
- Addendum: tax goes to "our splitter contract (pot / burn / team)". PRD FR-17 says the pot is filled by the trade tax
  but gives no split, and never mentions a team share. Marketplace fee (FR-46): half burned, the other half's
  destination (pot? team?) is not stated. Intent lists "market ... fees" as pot sources.
- These are economy numbers (CLAUDE.md: owner must decide), so they belong in §9 if undecided.

### A6. DECISIONS #9 "no Gladiator pets" in Death Match is dropped (LOW)
- DECISIONS #9: "Death Match uses 3 lives, any adult pet, no Gladiator pets". PRD FR-25 says "any adult pet" with no
  exception, and "Gladiator" appears nowhere in the PRD. Either the term is obsolete (then DECISIONS needs a
  superseding entry) or FR-25 is missing the exclusion.

### A7. Fren Pet weakness "thin liquidity" not addressed (LOW, fairness/trust)
- Intent Problem 4: "~$6k of trading liquidity behind a ~$70M headline cap". The PRD vision promises fixes for
  Fren Pet's problems but has no liquidity target for $PETV (graduation at 4.2 ETH is in the addendum only). FR-45
  burn tiers key off market cap ($1M/$10M), the very number the intent called misleading when liquidity is thin.
- Consider: burn tiers or claims keyed to liquidity, or a stated liquidity floor / counter-metric.

### A8. Casual player and gas after 10 actions (LOW, tone/onboarding)
- Intent: casual players "never see a seed phrase"; PRD JTBD: "without learning crypto first". FR-4: after 10 sponsored
  actions "the player pays". A casual email player has no ETH, so action 11 is a crypto wall. Not contradicted by an
  input directly (DECISIONS #7 caps sponsorship) but the PRD does not say what a casual player sees or how they get
  test ETH. OWNER-CHECKLIST "Fund testnet deployer wallet and Alchemy Gas Manager policy" is an unlisted dependency.

### A9. Qualitative ideas thinly carried (LOW)
- "Cute" is in the vision but no requirement or NFR covers 3D quality/performance on phone browsers (NFR-4 only says
  "works"). Intent and PRD both rely on 3D pets as the main edge over Fren Pet.
- "Level-matched attacks" (intent fairness list) is in FR-19 as "similar level", but level itself is never defined
  (Fren Pet derives level from score; with claims resetting points to 0, a score-based level would drop on claim).
  Worth an open question.

### Covered (no gap)
Pot accumulator O(1) (NFR-3), verified contracts + multisig + time delay (NFR-1), 3+7 death timer (FR-8), 10 sponsored
actions (FR-4), USD store prices in $PETV (FR-42, oracle detail in addendum), web/PWA only (NFR-4, §2.2), testnet cannot
test real-money premise (§8), small-player pot and diminishing points (FR-51/52), 35 cosmetics/5 slots (FR-39),
max 2v2 (FR-24), Supabase/Prisma (NFR-6, addendum), Privy+Alchemy (addendum).

## Part B: Input docs now stale (owner decided later in `.memlog.md`)

- **Claim-half option** (intent "Fairer pot") — replaced: claiming resets points to 0 (FR-16).
- **Paid wake-up / paid revive** (intent "Same core"; DECISIONS #6 "death + paid revive") — replaced: wake-up is free
  but costs 10%/day of points (FR-10).
- **Revive fees into the pot** (intent "Stronger pot") — gone with free wake-up.
- **Dead pet's unclaimed ETH** — returns to the pot, unlike Fren Pet (FR-11).
- **Token launch type** (OWNER-CHECKLIST, intent open question) — Pons on mainnet; own Pons-like curve on testnet (FR-41).
- **Pons on testnet** (addendum "Testnet availability not checked") — checked: mainnet only (PRD §8). Addendum line is stale.
- **DECISIONS.md** has no entries for any of the above owner decisions (claim reset, free wake-up, pot return, all-16
  release, testnet curve, etc.). Per CLAUDE.md rule 4 they should be logged as numbered entries, with #6 superseded.
