# Review: Verification lens (architecture-petverse.md)

- Reviewer lens: are the committed decisions checked against the web, the repo, or the current packages, rather than taken from memory?
- Date: 2026-10-14
- Method: `npm view` (read only), reading files in `chain/node_modules` and on unpkg, WebSearch/WebFetch of vendor docs. Nothing was installed and no `.env` file was read.

## Verdict

Most of the stack is current and fits the plan. Every version pin matches npm and the repo. But one central rule, the AD-6 seed `blockhash(commitBlock + 1)`, is written for Ethereum and does not hold on Robinhood Chain (Arbitrum Orbit). Three smaller decisions also rest on unconfirmed assumptions. Fix these before the contract and server units start.

## Findings

### F1 (HIGH): AD-6 seed uses Ethereum `blockhash` semantics, which do not hold on Robinhood Chain
- Evidence: the Robinhood docs (docs.robinhood.com/chain/differences-from-ethereum) say `block.number` "returns an estimate of the L1 (Ethereum) block number ... updates only periodically" and that `blockhash(n)` "is only reliable for recent blocks" and should not be used "as a randomness source". The Arbitrum docs (solidity-support) say `blockhash(x)` gives a "cryptographically insecure, pseudo-random hash" only for `block.number - 256 <= x < block.number` (both are L1 estimates) and returns `0` outside that range. `prevrandao` is the constant 1.
- Consequences:
  1. If the commit block is stored as `block.number`, many L2 blocks share it. `commitBlock + 1` is ready only when the L1 estimate moves forward (seconds to minutes), so the "reveal after commit block + 1" timing is wrong.
  2. If the reveal comes more than 256 L1 blocks late (about 51 minutes), `blockhash` returns 0 and the seed quietly becomes `keccak(secret, requestId, 0)`.
  3. If the module stores `ArbSys(0x64).arbBlockNumber()` instead, the plain `blockhash` opcode does not take L2 numbers. You would need `ArbSys.arbBlockHash(n)`, which only covers the last 256 L2 blocks (about 25 to 60 seconds at 100 to 250 ms blocks).
  4. The value comes from the sequencer. That is acceptable only as an extra input next to the server secret, not as the source of entropy.
- Fix: rewrite the AD-6 rule so it states exactly:
  - which block number is stored (pick `arbBlockNumber()` or `block.number`);
  - which hash function reads it (`ArbSys.arbBlockHash` or `blockhash`);
  - that `reveal` reverts if the hash is `0` or the block is out of range, and the request then goes to the no-loss fallback;
  - the reveal-timeout default (Open Question 4), sized to the 256-block window.

  Add a LESSONS entry, and add a contract test that mocks ArbSys at 0x64, since Hardhat's EDR does not have the precompile. AD-20 should list this test.

### F2 (MEDIUM): UUPS upgrades through Ignition alone have no storage-layout check
- Evidence: OZ 5.6.1 `UUPSUpgradeable` (pragma ^0.8.22) and `TimelockController` (^0.8.20) are installed in `chain/node_modules` and compile with 0.8.28/cancun, so the fit is fine. But Hardhat Ignition does not check upgrade safety. The only tool that does, `@openzeppelin/hardhat-upgrades` 4.1.0, supports Hardhat ^3.6 but needs the peers `ethers` and `@nomicfoundation/hardhat-ethers`. That is a new dependency that needs owner approval, and the spine does not list it.
- Fix: add it to the Stack table and Open Question 9, or name a stand-in check: the `@openzeppelin/upgrades-core` CLI `validate` run on build-info, inside `floor gate`. Also state that every module uses ERC-7201 namespaced storage, which the OZ 5.x default needs.

### F3 (MEDIUM): `@alchemy/wallet-apis` 5.x is EIP-7702 first; the spine assumes a separate smart-wallet address
- Evidence: the README for 5.3.0 says "Provides EIP-7702 smart wallet support". `@alchemy/common@5.3.0` ships `robinhoodTestnet` (id 46630) and `robinhoodMainnet` (4663), which confirms LESSONS #1. Alchemy's Robinhood testnet page lists Bundler and Gas Manager as supported. Robinhood's AA docs list ERC-4337 and EIP-7702.
- Consequences:
  - Under 7702, the "smart-wallet address" is the Privy EOA address itself. The gas webhook's `userOperation.sender` and the `User.smartWallet` column then hold the EOA.
  - External wallets (FR-2) often refuse to sign 7702 authorizations, so those players may need a 4337 account, which has a different address.
- Fix: in AD-8, state the account mode (7702 for the Privy embedded wallet; name the fallback for external wallets), which address is the on-chain identity, and that `SponsorshipCount` keys on the `userOperation.sender` the webhook receives.

### F4 (MEDIUM): AD-13 schema-per-environment is not wired into the client, and Supabase exposes `public`
- Evidence:
  - `@prisma/adapter-pg@7.10.0` has `schema?: string` ("The name of the schema to use in generated queries"). But `src/lib/db.ts` builds `new PrismaPg({ connectionString })` with no schema, so every runtime query goes to `public`.
  - A Prisma issue (#28128, adapter-pg) reports that `?schema=` in the URL is ignored by the adapter and that raw queries also need `search_path`.
  - The CLI (`prisma.config.ts`, DIRECT_URL) does respect `?schema=` for migrations.
  - Transaction pooler (:6543): node-postgres uses unnamed statements, so this is likely fine. I found no official Prisma 7 statement on it, so it is unverified.
  - Supabase's Data API (PostgREST) exposes the `public` schema by default. Putting the live game in `public` exposes those tables to the anon key unless RLS is on or the Data API is turned off.
- Fix:
  - AD-13: one `DB_SCHEMA` value goes to both `PrismaPg({ schema })` and the CLI URL `?schema=`, and raw SQL also sets `options=-c search_path=<schema>`. The test guard reads that same value.
  - Add a smoke test that runs one query through :6543 in a `test_` schema.
  - Either move the live game to a schema such as `game`, or require RLS on everything plus Data API off for `public`.

### F5 (LOW): Facts the spine leaves open or out of date
- Open Question 1 (Safe on testnet) is mostly answered: `safe-global/safe-deployments` v1.4.1 `safe_proxy_factory.json` lists `"46630": "canonical"` and `"4663": "canonical"`. Safe's blog says Safe{Wallet} was live at the mainnet launch (1 July 2026). Still open: whether the Safe{Wallet} UI lists the testnet. Protocol Kit/CLI work either way. Update OQ1.
- Privy: `@privy-io/server-auth` is marked deprecated on npm ("use @privy-io/node instead"; latest 0.35.0). AD-8 and OQ9 should name `@privy-io/node` for server token checks. Tokens are ES256 JWTs; verify locally with the dashboard verification key so the check does not depend on the network.
- AD-7 is confirmed. Alchemy Gas Manager "Custom Rules" has a webhook. The payload is `{userOperation, policyId, chainId, webhookData}` and the reply is `200 {approved: bool}`. The fail-closed flag is named `approveOnFailure` (required, default false), not "sponsor on webhook error". Alchemy has no built-in per-day cap and suggests enforcing one in the webhook, which matches AD-7. Use the real flag name. The webhook timeout is not documented, so keep the handler fast.
- AD-3 says contracts are verified on the explorer. The explorer is Blockscout (`explorer.testnet.chain.robinhood.com/api`), which Hardhat-verify does not know. It needs a custom chain descriptor in `chain/hardhat.config.ts`, which has none today. Add it to the deploy unit.
- AD-20: Hardhat 3 toolbox-viem 5.0.7 includes `hardhat-node-test-runner` (node:test, not mocha), `hardhat-ignition-viem`, `hardhat-network-helpers` and `hardhat-viem-assertions`. Say "node:test" so units do not add mocha. Ignition 3.1.8 is current.
- Stack versions all match npm today: hardhat 3.19.0, toolbox-viem 5.0.7, OZ 5.6.1, adapter-pg 7.10.0, wallet-apis 5.3.0, react-auth 3.49.0, web-push 3.6.7, viem 2.57.6. Notes:
  - Next.js latest is 16.4.0, and the npm `latest` tag for Prisma is `8.0.0-rc.22` (7.10.0 is under `prev`). Keep the `^7.10.0` pin; do not move to `latest`. The spine already defers both.
  - `web-push` 3.6.7 was last published in January 2024. It works, but it is unmaintained; worth noting as a risk.
- Telegram deep linking is confirmed (core.telegram.org): `t.me/<bot>?start=<token>`, up to 64 chars of `[A-Za-z0-9_-]`, delivered to the bot as `/start <token>`. State the token format and length in AD-19.

## Checked and fine
OZ pragma fit with 0.8.28; `robinhoodTestnet` chain def in `@alchemy/common`; Alchemy Bundler and Gas Manager on 46630; Gas Manager webhook rules; Safe singleton deployments on 46630 and 4663; adapter-pg `schema` option exists; toolbox-viem bundled plugins; Telegram start parameter; existing `chain/hardhat.config.ts` matches the Stack row (0.8.28, viaIR, cancun, `configVariable`).

## Not verified (no authoritative source found)
- Prisma 7 adapter-pg with the Supavisor transaction pooler (prepared statements).
- Gas Manager webhook timeout value.
- Safe{Wallet} UI support for testnet 46630.
- Exact ArbOS version, and Cancun opcode support (MCOPY/TSTORE) on Robinhood Chain. ArbOS 20+ has them, but this was not confirmed for this chain.
