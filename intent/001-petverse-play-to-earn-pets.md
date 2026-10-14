# Intent: Petverse, a cute pet game where play earns a share of real ETH

Author: Paras. Status: review (revised 2026-10-14 with Fren Pet's contracts and the database choice; first accepted
2026-10-14).

## Problem

Fren Pet proved people will raise an on-chain pet when it pays real ETH, but its version is small, fragile and hard to
trust:

1. **The pot depends on one source.** Its ETH pool is filled only by a 4% buy / 4% sell tax on $FP (read live from
   the token contract, 2026-10-14). The team said publicly the revenue *"hasn't been consistent to sustain ourselves"*.
2. **Most players earn nothing.** A 500-point pet was offered 0 ETH for its points; the #1 pet held ~98M points.
3. **Players cannot check the rules.** The game is a Diamond proxy with 34 logic contracts; **30 have no published
   source**. One single-key wallet owns the Diamond and the pet NFT, so one leaked key controls the ~47 ETH pot and
   can swap any rule at any time.
4. **It is thin and plain.** ~$6k of trading liquidity behind a ~$70M headline cap, 2D art, solo play, little content.

There is no cute, social, content-rich version of this game, none whose rules players can verify, and none on
Robinhood Chain.

## Proposed outcome

Keep Fren Pet's proven base, copy what its contracts get right, and fix what they get wrong:

- **Same core:** points are a claim on a real ETH pot; attacks steal points; wager battles; a feed timer, then sleep,
  then death with a paid wake-up.
- **Same pot mechanics:** a staking-style "ETH per point" counter (Fren Pet's `ethAccPerShare` / `rewardDebt`), so
  paying out costs the same gas for 10 players or 1M.
- **Same randomness method:** server commit–reveal (Fren Pet uses it for attacks, wheel, gacha, loot, monsters and
  dice), because neither Chainlink VRF nor Pyth runs on Robinhood Chain.
- **Trust they don't have:** every contract verified and public; a multisig owner; a time delay before any rule
  change takes effect; the randomness signer's role written down and limited.
- **Stronger pot:** filled by the trade tax **and** passes, eggs, market and revive fees.
- **Fairer pot:** a small low-rank pot, points worth less near the top, claim-half option, level-matched attacks.
- **More game:** cute 3D pets (10 species), branching evolution, 1v1 / 2v2 / Death Match (3 lives) / guild war / boss
  raid, Co-Pet (two friends raise one pet), 35 cosmetics in 5 slots (already prototyped), seasons.
- **Own token $PETV:** 1B fixed, dollar-priced store paid in $PETV, burns that shrink supply.
- **Off-chain data** (profiles, cosmetics owned, match lists, indexed events) in Supabase Postgres through Prisma.
- Robinhood Chain testnet first, Privy login, Alchemy smart wallet, 10 free-gas actions a day.

## Affected users and systems

- **Players:** crypto-native pet and idle-game players first (Fren Pet's audience), then casual players who log in
  with email and never see a seed phrase.
- **`src/`** (3D pet app, exists), **`chain/`** (contracts, scaffold only), **Supabase Postgres** (connected through
  Prisma 7.10, empty), a game server for commit–reveal signing (does not exist yet).
- **Treasury and token holders** once $PETV exists.

## Constraints

- **Web / PWA only.** Apple 3.1.1 and Google Play forbid unlocking content with crypto or selling random NFTs for
  money (checked in `pengu/intent/004`, 2026-09-29).
- **Testnet tokens have no value** (Robinhood Chain ToS §2.1), so testnet cannot test whether real ETH motivates people.
- **Real-money payouts, wagers and paid random spins** may count as gambling, and $PETV as a security. Mainnet is
  blocked until a lawyer has looked at it.
- **No on-chain randomness service on Robinhood Chain** (VRF and Pyth both absent). Randomness means trusting our
  server's commit–reveal, so its limits must be public.
- **One hosted database, no local copy** (`docs/DECISIONS.md` #10). Tests run against it, so they need their own schema
  and must never wipe data.

## The premise, and what would kill it

**Premise:**

> *Players will keep caring for, fighting with and paying for a pet because it earns a share of a real ETH pot; we are
> allowed to run that on Robinhood Chain; and it can be built so players don't have to trust us more than they trust
> Fren Pet.*

**What would disprove it**, cheapest first:

> 1. Read Robinhood Chain's terms for a ban on games, gambling or wagering. Free, minutes. *Kills the chain choice.*
> 2. Check that Fren Pet's model is still alive: money in the pot, holders, users. Free, minutes. *Kills the premise
>    if the original is dead.*
> 3. Check that a dollar price feed exists on Robinhood Chain. Free, minutes. *Kills dollar pricing.*
> 4. Read Fren Pet's contracts: is the pot design sound at scale, and is there a randomness method that works without
>    VRF? Free, an hour. *Kills the on-chain build if payouts need loops or randomness has no workable source.*
> 5. Lawyer review of ETH payouts, wagers, paid spins and $PETV in our launch countries. Days and money. *Kills mainnet
>    in those countries.*
> 6. Real-money playtest: a small mainnet pot (or a funded closed beta) and day-7 / day-30 return rates. Weeks.
>    *Kills everything if nobody comes back.*

**Result:**

> **1 — checked 2026-10-13, [ToS](https://docs.robinhood.com/chain/terms-of-service) last updated 2026-02-10.**
> No mention of gambling, games of chance or wagering, and no content rules for what developers deploy. §2.3 bans
> *"any activity that violates or facilitates the violation of applicable laws"*; §2.4 requires *"only those
> transactions and interactions that are lawful in your jurisdiction"*. **Survives**, but legality is entirely on us,
> which makes check 5 the real gate.
>
> **2 — checked 2026-10-13, partly.** Fren Pet's game contract (`0x0e22…443c` on Base) holds **47.53 ETH**
> (`eth_getBalance`, `mainnet.base.org`). $FP has **21,714 holders** (Phantom, 2026-10-01). Peak was **~1.5k users**
> (99Bitcoins, 2024). **Current daily users: not measured** — the free Base RPC rate-limited the log query and
> Blockscout sits behind a Cloudflare challenge. **Survives**: the pot is real money and still funded, but the audience
> was never big, so a straight copy has a low ceiling; our upgrades are what has to grow it.
>
> **3 — checked 2026-10-13.** Chainlink Data Feeds are live on Robinhood Chain **mainnet**
> ([changelog, 2026-07-01](https://dev.chain.link/changelog/data-feeds-expands-to-robinhood-chain-mainnet)). No testnet
> feed found, so testnet uses server-signed price quotes (`docs/DECISIONS.md` #8). **Survives.**
>
> **4 — checked 2026-10-14, from verified source on Sourcify.** The pot is a MasterChef-style accumulator
> (`ethAccPerShare`, `petRewardDebt`, `ethOwed`, `totalScores` in `LibAppStorage.sol`): O(1) per claim, no loops.
> Randomness for attacks, wheel, gacha, loot, monsters and dice is server commit–reveal (`bonkCommit/bonkReveal`,
> `diceJoin` checks a signature from `gameSigner`). Chainlink VRF is not on Robinhood Chain (absent from the
> [VRF v2.5 network list](https://docs.chain.link/vrf/v2-5/supported-networks)). **Survives**: both pieces have a
> working pattern already running with real money. The cost is trust in our signer, which the outcome above limits.
>
> **5 — NOT RUN. Expensive, so it is phase one of the mainnet work**, not something to do later. Testnet build can go
> ahead because testnet tokens have no value.
>
> **6 — NOT RUN. The only check that can end the whole intent**, and it cannot run on testnet. Plan it as the first
> mainnet milestone, after check 5.

## Open questions

- Fren Pet's current daily users. Needs an RPC key (our Alchemy one) or a Dune query. ~30 minutes.
- How far to limit the commit–reveal signer: commit per epoch on-chain, signer key in a KMS, public reveal log?
- Owner setup: which multisig, how many signers, how long the upgrade delay.
- Pons launchpad: the maximum creator tax (`maxCreatorTaxBps`) and the tax after graduation.
- Launch type for $PETV: Pons bonding curve or a traditional sale.
- Which countries we launch in. Drives check 5.
- Death timer: 3 + 7 days (Fren Pet) or 3 + 4 days. (Fren Pet's live status bands: >16h happy, 12–16h hungry, 8–12h
  starving, <8h dying.)
- Name for Gold (the pGOLD-style vault coin). Fren Pet's Gold is an ERC-4626-style vault: stake $FP, get shares.
- How tests use the one hosted database without touching real data (separate schema).

## Evidence

- observed: Fren Pet ETH pot is the Diamond contract's ETH balance; claiming resets score to 0 —
  `web3-pet-research/out/flows/frenpet/FREN-PET-RESEARCH.md` §2, §4
- observed: 500-point pet offered 0 ETH; #1 pet ~98M points — same file §5
- observed: ~$6k liquidity on BaseSwap; 414 pet NFT holders; 1.79M+ game-contract transactions — same file §4
- observed: free actions are gas-sponsored, ~10 a day — same file §5
- observed: team quote *"hasn't been consistent to sustain ourselves"* — same file §7
- observed: 47.53 ETH in the Diamond contract, 2026-10-13 — `eth_getBalance` on Base
- observed: $FP buy and sell tax both 4%, capped at 5% in code — `FrenPetToken.sol` `updateBuyFees`, live read 2026-10-14
- observed: 34 facets, 5 verified; Diamond and NFT owner `0x047f…54b7` is an EOA (no code) —
  `web3-pet-research/frenpet-contracts/CONTRACTS.md`, `facet-functions.json`
- observed: pot accumulator and commit–reveal randomness — `frenpet-contracts/facet-07/src/libraries/LibAppStorage.sol`,
  `DiceFacet.sol`, facet names `bonkCommit`, `bonkReveal`, `wheelCommit`, `gatchaCommit`, `lootCommit`
- observed: pGOLD 1B cap, ~326.9M minted; transfers to contracts blocked unless allow-listed — `PetGold.sol`, live read
- inferred: the audience for a pure copy is small — basis: ~1.5k peak users, 414 pet holders
- observed: 35 cosmetics in 5 slots fit all 10 species — `src/components/three/cosmetics.tsx`, `/gallery`
- observed: Supabase Postgres 17.11 reachable on both poolers, empty — Prisma `db pull` (P4001) and a `select` test,
  2026-10-14
