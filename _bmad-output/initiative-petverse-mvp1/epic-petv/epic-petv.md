---
type: epic
title: "PETV token, trade tax, burns and Gold vault"
parent: initiative-petverse-mvp1
covers: [CAP-22, CAP-24]
after: []
assignee: ""
risk: high
---

# PETV token, trade tax, burns and Gold vault

## Description

The game gets its own fixed-supply token whose burns anyone can see, a trade venue on testnet, and a Gold vault that
shares game spending with stakers and pays game Gold from a funded reserve without minting. This epic deploys PETV
with its fixed allocations, our Pons-like curve that graduates into our own v2-style pool on 46630, the 5% trade tax
through TaxSplitter (pot share into PotFunder), the `Burned` event and public burn counter, and GoldVault with the
reserve, the daily cap and `creditFromGame` from PetCore. Capabilities CAP-22 and CAP-24 in the spec.

## Outcome

Players can trade and stake PETV on testnet and see every burn; the trade tax visibly feeds the ETH pot.

## Done when

1. On 46630, PETV's total supply is 1B with allocations 40/20/15/15/10 and no mint function after deploy; the curve
   graduates at 4.2 test ETH into our v2-style pool.
2. Every curve and pool trade takes 5% split 2% pot / 1% burn / 1% liquidity / 1% team; the pot share reaches PotFunder
   and the burn shows in the public burn counter, dollars first.
3. Staking PETV mints Gold shares, swapping back costs 2%; a living pet's accrued Gold pays from the reserve through
   `creditFromGame`; tests pin the 0.1%-of-reserve daily cap and that no share is minted for game rewards.
4. On death, the pet's unpaid Gold counter is deleted and the Gold stays in the reserve (CAP-6 part).
5. The Wallet sheet shows PETV and Gold balances dollars first, stake and swap back, and the burn counter.

## Boundaries

Token-layer contracts and their Wallet-sheet screens, and the PETV/USD display rate added to epic-pot's display-rate service (payment quotes stay with epic-store-pass). Not the faucet (epic-store-pass, CAP-2), not price quotes or
PotConverter (epic-store-pass), not wager, dice, store or market burns (each epic emits `Burned` into this counter).
Mainnet Pons integration is out of scope (spec Non-goals, game-rules Mainnet notes).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-22, CAP-24 (and CAP-6 part)
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Money
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-2, AD-3 (PETV not upgradeable), AD-9, AD-18, AD-22 (Gold transfer rule), AD-24
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Wallet sheet), UJ-5
- decisions — docs/DECISIONS.md, #16, #22, #25 (N13), #26 (N14)

## Notes

- Waits on epic-pot because: PotFunder receives the trade-tax pot share.
- Waits on epic-pet-life because: PetCore's accrued-Gold counter pays through `GoldVault.creditFromGame`.
- Decision: 2026-10-14 the Gold vault sits with the token, not with growth, because the reserve is a PETV allocation minted at deploy and monsters, raids and Guild War pay Gold (recommended default, DECISIONS #31).
- Open question: final name for Gold (OWNER-CHECKLIST); "Gold" is the working name.
- Decision: 2026-10-14 inception: 10 entries in `tickets.toml`. Tracer bullet = entry 1 (PETV burn on a Hardhat local node → own Ignition module → generated chain module → worker burn projection → Wallet sheet burn counter); the 46630 deploy waits for entry 9 because PETV's allocations are fixed at deploy and need every recipient contract (recommended default, DECISIONS #31; assumption).
- Decision: 2026-10-14 sequencing: entry 2 (curve graduation into our own v2-style pool, with a throwaway rehearsal on 46630) follows the tracer as the least-certain story; lanes A token and venues (1 → 2 → 3), B Gold vault (4 → 5), C PetCore Gold (6), D rates and burn API (7), E Wallet sheet (8) run side by side where their `after` allows; entry 9 deploys everything live; entry 10 is the Refactor sweep. No closing end-to-end suite: the source has no test plan and entry 9 checks the Done when live (recommended default, DECISIONS #31; assumption).
- Decision: 2026-10-14 PETV allocation recipients (assumption, DECISIONS #31): curve 40% and liquidity 20% → PonsLikeCurve (it seeds the pool at graduation); Gold reserve 15% → GoldVault's reserve deposit; faucet 15% → the TimelockController, which moves it to epic-store-pass's Faucet by a timelocked transfer; team 10% → the testnet Safe. The team tax share also goes to the Safe.
- Decision: 2026-10-14 the 5% trade tax is taken in ETH on both venues (as Pons takes creator tax), so the 2% pot share reaches PotFunder as ETH without PotConverter; TaxSplitter buys PETV tax-free through the venue with a minimum-out for the 1% burn and pairs the 1% liquidity share into the pool (held until graduation) (assumption, DECISIONS #31; see Open question below).
- Decision: 2026-10-14 the curve and GoldVault are UUPS behind the timelock (AD-3); the v2-style pair is immutable like Uniswap v2; PETV is not upgradeable. Each entry adds its own Ignition module file, composed by entry 9, so lanes do not edit one deploy file (assumption, DECISIONS #31).
- Decision: 2026-10-14 the 2% swap-back fee stays in GoldVault, raising the share price for remaining stakers; PetCore pays accrued Gold on an explicit Gold claim; `creditFromGame` stays PetCore-only here, and the capped Guild War payer path through EpochDistributor (AD-24) is epic-social's addition (assumption, DECISIONS #31).
- Decision: 2026-10-14 the PETV/USD display rate is the curve price before graduation and the pool spot price after, times epic-pot's ETH/USD rate; display only, never used for payment (assumption, DECISIONS #31).
- Decision: 2026-10-14 later epics that burn (wager, dice, store, market, Bold expedition) emit `Burned(source, amount)` and register their contract as a burn source in the generated chain module; entry 1's indexer reads every listed source (recommended default, DECISIONS #31).
- Open question: Done when 1 says the curve graduates on 46630 at 4.2 test ETH; entry 2 proves it on a throwaway rehearsal and in tests. Does the team buy the live curve to graduation before testnet opens (needs about 4.2 test ETH), or let players graduate it? And how much test ETH can the owner provide for the rehearsal?
- Open question: tax currency and the burn/liquidity mechanics above are assumed; the owner confirms ETH-side tax with buy-and-burn, or prefers taking the tax in PETV (then the pot share must go through PotConverter, AD-11).
- Open question: no in-app trade screen is in Done when or EXPERIENCE (which avoids "swap"); players trade PETV on testnet only through the contracts (explorer or scripts) unless the owner wants a screen.
- Decision: 2026-10-14 neither epic-pet-life's envelope nor its entries build the accrued-Gold counter (its entry 2.6 only leaves a Gold-counter delete point), so entry 6 adds the counter and its 10 Gold a day for every living pet, asleep included ("living pet" in game-rules Money), as a timelocked parameter (assumption, DECISIONS #31).
- Decision: 2026-10-14 epic-pot's entry 3.10 owns the avatar menu shell (Avatar menu › Claims); entry 1 adds the Wallet item to it. The Wallet sheet also shows the ETH balance dollars first (EXPERIENCE Wallet sheet), in entries 7 and 8 (assumption, DECISIONS #31).
- Decision: 2026-10-14 after epic-pot and epic-pet-life were incepted, whole-epic `after` refs were replaced by their entries: 2.3 (UI kit and shell), 2.6 (bury), 2.11 (pet-life live), 3.1 (PotFunder), 3.2 (settle paths), 3.7 (display-rate port), 3.10 (avatar menu), 3.11 (pot live).
- Source conflict: CAP-24 — "the vault grows from game spending" vs game-rules Money, where no trade-tax, store, pass or market split sends anything to GoldVault; only the 2% swap-back fee grows it. Entry 4 adds an open add-PETV path so a split can be routed later; the owner decides whether any spending feeds the vault.
- Source conflict: Gold name — this epic's and the initiative's Notes and OWNER-CHECKLIST keep "final name for Gold" open vs EXPERIENCE.md Open Questions 1 "Resolved, Gold name (owner, 2026-10-14): keep Gold".
- Source conflict: initiative `tickets.toml` epic 4 `after` — epic-pet-life provides "PetCore accrued-Gold counter" vs the epic-pet-life envelope, whose Description and Done when do not name the counter or its 10-a-day accrual.
- Resolved: 2026-10-14 epic-platform is declared in epic 4's `after` in the initiative's `tickets.toml` (1.1, 1.6, 1.9, 1.10, 1.13, 1.14, 1.15).
