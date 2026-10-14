---
type: epic
title: "Store, Season Pass, faucet and sponsored actions"
parent: initiative-petverse-mvp1
covers: [CAP-2, CAP-23]
after: []
assignee: ""
risk: high
---

# Store, Season Pass, faucet and sponsored actions

## Description

A player plays free up to a daily cap, keeps playing with test funds past it, and buys items and a Season Pass priced
in dollars and paid in PETV. This epic builds the Gas Manager custom-rules webhook with the per-DID daily cap (10, 20
with the Pass), the unsponsored fallback, the voucher-gated Faucet, the price-source port with the signed testnet
quote, PotConverter, the Store with its item registry (food, eggs, shield first), and SeasonPass with season
boundaries and its perks. Capabilities CAP-2 and CAP-23 in the spec.

## Outcome

Players never hit a dead end for lack of gas or tokens, and store and Pass sales visibly fill the ETH pot.

## Done when

1. On 46630, the first 10 game actions of a UTC day are sponsored (20 with an active Pass), the 11th is refused by the
   webhook (fail closed) and goes through paid from test ETH with the fee shown in dollars first.
2. The faucet pays 0.01 test ETH + 3,120 PETV at sign-up and 0.002 test ETH + 624 PETV once per UTC day, only against
   a voucher per Privy DID.
3. Every store price is set in USD cents and paid in PETV at the signed rate; a quote that moves more than 5% in an hour
   is refused; burn stage is 70% at testnet start; the pot share reaches PotFunder through PotConverter.
4. A Season Pass bought for $7.99 gives +25% points, the 20-action cap and a season skin, with no auto-renew;
   `seasonOf` and `isActive` answer from on-chain season boundaries.
5. Shop › Store (food, eggs, shield; cosmetics and try-on come with epic-cosmetics-market) and Shop › Pass, the Wallet-sheet faucet, and the out-of-free-actions and
   not-enough-PETV states work as in the mocks and spine.

## Boundaries

Paying and being paid for play: sponsorship cap, faucet, price source, PotConverter, Store, SeasonPass. Not the items
other epics register later in the Store (evolution items in epic-growth, cosmetics in epic-cosmetics-market); not the
10-minute attack cooldown itself (epic-battle reads `isActive`); not the season leaderboard (epic-seasons); not
refusing flagged accounts (epic-anti-bot adds it to the webhook and faucet). The season skin item is defined by epic-cosmetics-market and only granted here. The Season Pass reward track's contents
come with epic-seasons.

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-2, CAP-23
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Money, Seasons
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-5 (season boundaries in SeasonPass), AD-7, AD-9 (Faucet), AD-10, AD-11, AD-15 (vouchers), AD-18
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Shop, Wallet sheet, Faucet), State Patterns, UJ-5
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mock .working/key-shop-claim.html
- decisions — docs/DECISIONS.md, #7, #8, #19, #25 (N10, N11, N12)

## Notes

- Waits on epic-petv because: PETV, the faucet allocation and the burn path.
- Waits on epic-pot because: PotFunder for PotConverter output.
- Waits on epic-pet-life because: the voucher signer, and the first items the store sells (food, eggs, shield set on PetCore).
- Waits on epic-platform because: the answer of spike 2 (Gas Manager custom-rules webhook on 46630).
- Decision: 2026-10-14 the sponsorship cap and faucet sit with the store and Pass, not the token, because the cap reads `SeasonPass.isActive` (recommended default, DECISIONS #31).
- Open question: season 1 genesis date (initiative Notes).
