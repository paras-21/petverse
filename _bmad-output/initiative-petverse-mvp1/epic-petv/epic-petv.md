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
