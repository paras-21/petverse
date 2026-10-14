# Addendum: Petverse PRD

Technical choices and background that belong to architecture, not the PRD.

## Stack already decided (docs/DECISIONS.md)

- Robinhood Chain testnet 46630 (mainnet 4663 later). Hardhat 3 + viem in `chain/`.
- Login: Privy embedded wallet as signer + Alchemy `@alchemy/wallet-apis` smart wallet + Gas Manager.
  Not `@account-kit/privy-integration` (throws "Unsupported chainId" on Robinhood).
- Database: Supabase Postgres via Prisma 7.10 (`@prisma/adapter-pg`); app on the transaction pooler, CLI on the session pooler.
- Randomness: server commit–reveal (no VRF or Pyth on Robinhood Chain).
- Prices: mainnet = Chainlink ETH/USD + Uniswap v3 30-minute average; testnet = server-signed quotes.

## Patterns to copy from Fren Pet's contracts (read 2026-10-14)

- Pot payout: MasterChef-style accumulator (`ethAccPerShare`, per-pet `rewardDebt` + `ethOwed`, `totalScores`).
- Pet state from one timestamp (`timeUntilStarving`); status bands derived from time left.
- Randomness: server signs a commitment; reveal settles (`bonkCommit/bonkReveal`, `diceJoin`).
- Gold: ERC-4626-style vault shares; pGOLD blocks transfers to unlisted contracts.
- Source and notes: `web3-pet-research/frenpet-contracts/CONTRACTS.md`.

## What Fren Pet does that we will not

- Single-key owner wallet; 30 of 34 facets unverified; no upgrade delay.
- Paying a dead pet's unclaimed ETH to its owner (we return it to the pot, owner decision).
- Paid wake-up (ours is free with a point loss, owner decision).

## Pons (bonding-curve launchpad)

Creator tax is set per launch up to a factory cap (`maxCreatorTaxBps`, value unknown); the tax continues after
graduation through a Uniswap v4 hook; graduates at 4.2 ETH. The tax goes to one creator address, which should be our
splitter contract (pot / burn / team). **Mainnet only:** the active factory `0xA5aA…1feB` has code on chain 4663 and none
on 46630 (checked 2026-10-14). Testnet uses our own Pons-like bonding curve (PRD FR-41).
