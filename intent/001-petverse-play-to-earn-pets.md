# Intent: Petverse, a cute pet game where play earns a share of real ETH

Author: Paras. Status: review.

## Problem

Fren Pet proved people will raise an on-chain pet when it pays real ETH, but its version is small and fragile:

1. **The pot depends on one source.** Its ETH pool is filled only by a 4–5% tax on $FP trades. The team said publicly
   the revenue *"hasn't been consistent to sustain ourselves"*.
2. **Most players earn nothing.** A 500-point pet was offered 0 ETH for its points; the #1 pet held ~98M points.
3. **It is thin and plain.** ~$6k of trading liquidity behind a ~$70M headline cap, 2D art, solo play only, little
   content.

There is no cute, social, content-rich version of this game, and none on Robinhood Chain.

## Proposed outcome

Keep Fren Pet's proven base and build on top of it (full flow: the "How Petverse Works" doc):

- **Same core:** points are a claim on a real ETH pot; attacks steal points; wager battles; a 3-day feed timer, then
  sleep, then death with a paid wake-up.
- **Stronger pot:** filled by the trade tax **and** passes, eggs, market and revive fees.
- **Fairer pot:** a small low-rank pot, points worth less near the top, claim-half option, level-matched attacks.
- **More game:** cute 3D pets (10 species), 6-stage branching evolution, 1v1 / 2v2 / Death Match (3 lives) / guild
  war / boss raid, Co-Pet (two friends raise one pet), 35 cosmetics in 5 slots (already prototyped), seasons.
- **Own token $PETV:** 1B fixed, dollar-priced store paid in $PETV, burns that shrink supply.
- Robinhood Chain testnet first, Privy login, Alchemy smart wallet, 10 free-gas actions a day.

## Affected users and systems

- **Players:** crypto-native pet and idle-game players first (Fren Pet's audience), then casual players who log in
  with email and never see a seed phrase.
- **`src/`** (the 3D pet app, exists), **`chain/`** (contracts, scaffold only), a game server (does not exist yet).
- **Treasury and token holders** once $PETV exists.

## Constraints

- **Web / PWA only.** Apple 3.1.1 and Google Play forbid unlocking content with crypto or selling random NFTs for
  money (checked in `pengu/intent/004`, 2026-09-29). A store app cannot carry this economy.
- **Testnet tokens have no value** (Robinhood Chain ToS §2.1), so testnet cannot test whether real ETH motivates people.
- **Real-money payouts, wagers and paid random spins** may count as gambling, and $PETV as a security, depending on
  the player's country. Mainnet is blocked until a lawyer has looked at it.
- **No new mainnet money until the legal check passes.** Testnet only.

## The premise, and what would kill it

**Premise:**

> *Players will keep caring for, fighting with and paying for a pet because it earns a share of a real ETH pot, and
> we are allowed to run that on Robinhood Chain.*

**What would disprove it**, cheapest first:

> 1. Read Robinhood Chain's terms for a ban on games, gambling or wagering. Free, minutes. *Kills the chain choice.*
> 2. Check that Fren Pet's model is still alive: money in the pot, holders, users. Free, minutes. *Kills the premise
>    if the original is dead.*
> 3. Check that a dollar price feed exists on Robinhood Chain. Free, minutes. *Kills dollar pricing.*
> 4. Lawyer review of ETH payouts, wagers, paid spins and $PETV in our launch countries. Days and money. *Kills mainnet
>    in those countries.*
> 5. Real-money playtest: a small mainnet pot (or a funded closed beta) and day-7 / day-30 return rates. Weeks.
>    *Kills everything if nobody comes back.*

**Result:**

> **1 — checked 2026-10-13, [ToS](https://docs.robinhood.com/chain/terms-of-service) last updated 2026-02-10.**
> No mention of gambling, games of chance or wagering, and no content rules for what developers deploy. The rules are
> general: §2.3 bans *"any activity that violates or facilitates the violation of applicable laws"*, §2.4 requires
> *"only those transactions and interactions that are lawful in your jurisdiction"*, §5.7 limits securities-style
> marketing. **Survives**, but legality is entirely on us, which makes check 4 the real gate.
>
> **2 — checked 2026-10-13, partly.** Fren Pet's game contract (`0x0e22…443c` on Base) holds **47.53 ETH** right now
> (read with `eth_getBalance` on `mainnet.base.org`). $FP has **21,714 holders** (Phantom, 2026-10-01). Peak was
> **~1.5k users** (99Bitcoins, 2024). **Current daily users: not measured** — the free Base RPC rate-limited the log
> query and Blockscout sits behind a Cloudflare challenge. **Survives**: the pot is real money and still funded. But the
> audience was never big, so the ceiling for a straight copy is small; our upgrades are what has to grow it.
>
> **3 — checked 2026-10-13.** Chainlink Data Feeds are live on Robinhood Chain **mainnet**
> ([changelog, 2026-07-01](https://dev.chain.link/changelog/data-feeds-expands-to-robinhood-chain-mainnet);
> [Robinhood docs](https://docs.robinhood.com/chain/oracles-and-price-feeds)). No testnet feed address found, so
> testnet uses server-signed price quotes (`docs/DECISIONS.md` #8). **Survives.**
>
> **4 — NOT RUN. Expensive, so it is phase one of the mainnet work**, not something to do later. Testnet build can go
> ahead because testnet tokens have no value.
>
> **5 — NOT RUN. The only check that can end the whole intent**, and it cannot run on testnet. Plan it as the first
> mainnet milestone, after check 4.

## Open questions

- Fren Pet's current daily users. Needs an RPC key (our Alchemy one) or a Dune query. ~30 minutes.
- Pons launchpad: the maximum creator tax (`maxCreatorTaxBps`) and the tax after graduation. One on-chain read, once
  we have the factory address.
- Launch type for $PETV: Pons bonding curve or a traditional sale. Changes how strong burns must be.
- Which countries we launch in. Drives check 4.
- Death timer: 3 + 7 days (Fren Pet) or 3 + 4 days.
- Name for Gold (the pGOLD-style vault coin).

## Evidence

- observed: Fren Pet ETH pot is the Diamond contract's ETH balance; claiming resets score to 0 —
  `web3-pet-research/out/flows/frenpet/FREN-PET-RESEARCH.md` §2, §4
- observed: 500-point pet offered 0 ETH; #1 pet ~98M points — same file §5
- observed: ~$6k liquidity on BaseSwap; 414 pet NFT holders; 1.79M+ game-contract transactions — same file §4
- observed: free actions are gas-sponsored, ~10 a day — same file §5
- observed: team quote *"hasn't been consistent to sustain ourselves"* — same file §7
- observed: 47.53 ETH in the Diamond contract, 2026-10-13 — `eth_getBalance` on Base
- inferred: the audience for a pure copy is small — basis: ~1.5k peak users, 414 pet holders
- observed: 35 cosmetics in 5 slots fit all 10 species — `src/components/three/cosmetics.tsx`, `/gallery`
