# Decisions in force

Numbered and dated, with who decided. Newest at the bottom. A decision is changed only by a new numbered entry that
says which one it supersedes. Agents read this file before proposing anything that might contradict it.

| # | Date | Decided by | Decision | Why |
|---|---|---|---|---|
| 1 | 2026-10-13 | owner | Integration branch is `floor/mvp1`; agents never push | Humans own releases |
| 2 | 2026-10-13 | owner | Gate = install, typecheck, lint, test (app + `chain/`), then code, security and adversarial reviews | Proven units only |
| 3 | 2026-10-13 | owner | A unit parks after 3 failed gates; it is retried with a recorded reason | Stops infinite loops |
| 4 | 2026-10-13 | owner | Game is Petverse on Robinhood Chain: testnet 46630 first, mainnet 4663 later | Chain choice |
| 5 | 2026-10-13 | owner | Login = Privy embedded wallet as signer + Alchemy `@alchemy/wallet-apis` smart wallet + Gas Manager. Not `@account-kit/privy-integration` (throws Unsupported chainId on Robinhood) | Verified incompatibility |
| 6 | 2026-10-13 | owner | Economy = Fren Pet base model (points claim real ETH pot, steal points, wagers, death + paid revive) with Petverse upgrades. Source: "How Petverse Works" doc | Proven model, improved |
| 7 | 2026-10-13 | owner | Only the first 10 actions per player per day are gas-sponsored | Caps gas cost, slows bots |
| 8 | 2026-10-13 | owner | Store prices are fixed in USD and paid in $PETV; mainnet pricing = Chainlink ETH/USD + Uniswap v3 30-min TWAP; testnet = server-signed quotes | Stable prices, manipulation-resistant |
| 9 | 2026-10-13 | owner | Battle teams are at most 2v2; Death Match uses 3 lives, any adult pet, no Gladiator pets | Owner call |
| 10 | 2026-10-14 | owner | Database = Supabase Postgres via Prisma 7.10 (`@prisma/adapter-pg`). Hosted DB only, no local DB. App uses the transaction pooler (`DATABASE_URL`, :6543); Prisma CLI and migrations use the session pooler (`DIRECT_URL`, :5432) | Owner call; supersedes the Phase 0 "local Docker test DB" plan |
| 11 | 2026-10-14 | owner | Trust: all contracts verified and public, a multisig owns the game, and a time delay before any rule change takes effect | Fixes Fren Pet's single-key owner and unverified facets |
| 12 | 2026-10-14 | owner | Randomness = server commit–reveal (same as Fren Pet); no VRF or Pyth on Robinhood Chain | Only workable source on this chain |
| 13 | 2026-10-14 | owner | Death timer = 3 days to sleep + 7 days asleep, then death (same as Fren Pet) | Owner call |
| 14 | 2026-10-14 | owner | No pet or Co-Pet selling in release 1 (drops PRD FR-29 "Co-Pet selling"; matches PRD §7 "no trading pets") | Resolves PRD conflict |
| 15 | 2026-10-14 | owner | Asleep pets get no pot share until woken | Rewards care; hurts idle and bot farms |
| 16 | 2026-10-14 | owner | Game-earned Gold is paid from a funded reserve with a daily payout cap; no minting of vault shares | Stakers are not diluted |
| 17 | 2026-10-14 | owner | Effective-points curve is applied per owner (sum of a wallet's pets), not per pet | Splitting points across pets gives no gain |
| 18 | 2026-10-14 | owner | Waking an asleep pet is free (feed it). Supersedes the "paid revive" part of #6 | PRD wins; gentle tone |
| 19 | 2026-10-14 | owner | 10 gas-sponsored actions per player per day; 20 with Season Pass. Amends #7 | Keeps #7 cap, adds Pass perk |
| 20 | 2026-10-14 | owner | No "Gladiator pet" type in release 1; Death Match = any adult pet, 3 lives. Amends #9 | Term was never defined |
| 21 | 2026-10-14 | owner | Hosting: Next app on Vercel; always-on worker (indexer, reveals, webhooks) on Render | Serverless cannot run a poller |
| 22 | 2026-10-14 | owner | Testnet PETV graduates into our own Uniswap v2-style pool deployed on 46630 | No known DEX on testnet |
| 23 | 2026-10-14 | owner | Account mode: EIP-7702 on the Privy embedded wallet; external wallets that refuse 7702 fall back to an ERC-4337 smart account | Cheaper, same address; keeps external wallets working |
| 24 | 2026-10-14 | owner | Approved deps: `@privy-io/react-auth`, `@privy-io/node`, `@alchemy/wallet-apis`, `viem` (root app), `web-push`, OZ upgrade-safety validator (dev-only, runs in tests and gate) | Needed for login, gas, contracts, alerts |
| 25 | 2026-10-14 | owner | Testnet owner numbers N1–N13 accepted as listed in `_bmad-output/initiative-petverse-mvp1/architecture-petverse/owner-numbers.md` (timelock 1h, K 10,000, weekly small pot, PETV split 40/20/15/15/10, faucet amounts, etc.) | Testnet defaults; all timelocked |
| 26 | 2026-10-14 | owner | Daily game-Gold payout cap (N14) = 0.1% of the Gold reserve per day (about 150k PETV) | Reserve lasts years |
| 27 | 2026-10-14 | owner | Waking is free in money but costs 10% of points per day asleep (PRD FR-10). Clarifies #18 | Care has a real cost; matches PRD and mocks |
| 28 | 2026-10-14 | owner | Small pot (15%) is shared only by awake living pets in the bottom half by points | Consistent with #15 |
| 29 | 2026-10-14 | owner | Co-Pet leave: the leaver's half of unclaimed pot is paid out first, then the pet becomes the other owner's normal pet. No sale, no money between players | Fits #14 |
| 30 | 2026-10-14 | owner | Testnet Safe is 2-of-3 team signers. If the Safe web UI does not support 46630, use Safe Protocol Kit / CLI | One lost key is not fatal |
| 31 | 2026-10-14 | owner | Owner accepts recommended defaults for planning choices; Claude records each and reports it | Fewer questions |
