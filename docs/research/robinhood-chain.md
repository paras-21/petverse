# Robinhood Chain: facts for the Petverse spikes

Researched 2026-10-14. Every "seen" date below is 2026-10-14 unless stated. "Probed" means checked live by JSON-RPC
or HTTP from this machine on that date (scratch scripts, not kept). Confidence: **H** = official doc and/or live
probe agree; **M** = one good source or indirect probe; **L** = third-party only / inferred.

Already known in the repo (not repeated as new): Hardhat networks `robinhoodTestnet` 46630 / `robinhoodMainnet` 4663
with `configVariable` RPC URLs and `evmVersion: "cancun"` (`chain/hardhat.config.ts`); LESSONS #1 / DECISIONS #5
(`@account-kit/privy-integration` throws Unsupported chainId; use `@alchemy/wallet-apis` + `robinhoodTestnet` from
`@alchemy/common/chains`).

## 1. Network basics

| Item | Testnet 46630 | Mainnet 4663 | Conf. | Source |
|---|---|---|---|---|
| Chain type | Arbitrum Orbit (Nitro) rollup, parent chain = Ethereum **Sepolia** (L2, not L3) | Arbitrum Orbit (Nitro) rollup on Ethereum mainnet, blobs for DA | H | docs.robinhood.com/chain/connecting; probe: `web3_clientVersion` = `nitro/v3.12.1-rc.2`, block `l1BlockNumber` ~11.9M (Sepolia) / ~26.2M (Ethereum) |
| ArbOS version | 61 (`ArbSys(0x64).arbOSVersion()` returns 116 = 55 + 61) | 61 | M (offset of 55 is Nitro convention) | probe |
| Gas token | ETH (BitGo calls testnet ticker "thoodeth") | ETH | H | docs.robinhood.com/chain/connecting; developers.bitgo.com/docs/robinhood-chain |
| Public RPC | `https://rpc.testnet.chain.robinhood.com` (also `/rpc` path works) | `https://rpc.mainnet.chain.robinhood.com` | H | official docs + probe (`eth_chainId` 0xb626 / 0x1237) |
| Other public RPCs (testnet) | `https://robinhood-sepolia-rpc.publicnode.com`, `https://robinhood-testnet.drpc.org`, `https://api.blockvectra.com/v1/robinhood_testnet/public` | Chainstack, QuickNode, dRPC, Blockdaemon, Validation Cloud, GlobalStake, Pinax | M (not probed) | chainid.network/chain/46630; docs.robinhood.com/chain/connecting |
| Alchemy RPC | `https://robinhood-testnet.g.alchemy.com/v2/{KEY}` (+ `wss://`) | `https://robinhood-mainnet.g.alchemy.com/v2/{KEY}` | H | official docs; also hard-coded in `@alchemy/common@5.3.0` `chainRegistry.js` |
| Sequencer feed | `wss://feed.testnet.chain.robinhood.com` | `wss://feed.mainnet.chain.robinhood.com` (+ delayed feed) | H | docs.robinhood.com/chain/connecting |
| Public RPC limits | "rate-limited", "not for production", no numbers | same | H | docs.robinhood.com/chain/connecting |
| Block time | **~0.11 s** (10,000-block average 0.1107 s; Blockscout says 101 ms) | ~0.10 s (0.1022 s) | H | probe; explorer `/api/v2/stats` |
| Finality | Soft confirm from sequencer in ~100 ms; hard (L1) finality when the batch posts, ~13 min per one guide; 7-day challenge applies only to L2→L1 withdrawals | same | M (13 min = one secondary source) | quicknode.com/guides/robinhood/what-is-robinhood-chain |
| Base fee | 0.01 gwei (10,000,000 wei) | ~0.024 gwei | H | probe `eth_gasPrice` |
| Block gas limit field | `0x4000000000000` (Arbitrum placeholder; real per-tx cap is ArbOS's ~32M) | same | M | probe; Arbitrum convention |
| Launch | Public testnet 2026-02-10 | Public mainnet 2026-07-01 | H | robinhood.com newsroom (2026-02-10); dev.chain.link changelog; safe.global blog |

## 2. Block explorer and verification

| Item | Testnet | Mainnet | Conf. | Source |
|---|---|---|---|---|
| Explorer | `https://explorer.testnet.chain.robinhood.com` | `https://robinhoodchain.blockscout.com` | H | official docs |
| Software | **Blockscout** backend v10.2.6, rust verifier microservice on, solc list up to 0.8.36 | Blockscout | H | probe `/api/v2/config/backend-version`, `/api/v2/smart-contracts/verification/config` |
| Etherscan-style API | `https://explorer.testnet.chain.robinhood.com/api` works (`module=block&action=eth_block_number` answered) | `https://robinhoodchain.blockscout.com/api` returned **Cloudflare 403 challenge** to curl from this machine | H / M | probe |
| Hardhat 3 verify | Blockscout needs no API key; a custom chain needs a `chainDescriptors[46630]` entry with `blockExplorers.blockscout { name, url, apiUrl }` | same | M (shape not tested) | hardhat.org/docs/guides/smart-contract-verification |

## 3. Account abstraction

**EIP-7702 is live on both chains.** Robinhood docs say the chain "supports EIP-7702". Probe: `eth_estimateGas` with
`type: 0x4` and an `authorizationList` succeeded on 46630 (0xb52e gas) and 4663 (0xb53a). ArbOS 61 is past ArbOS 40
(Callisto), the release that brought Pectra/7702 to Arbitrum chains. Conf. **H**.
Source: docs.robinhood.com/chain/account-abstraction.

ERC-4337 and related contracts. Every address below was **probed for bytecode on both 46630 and 4663, and all have
code**. Robinhood's AA page lists the EntryPoints and Safe 4337 module for mainnet only; the testnet presence comes
from the probe. Conf. **H**.

| Contract | Address |
|---|---|
| EntryPoint v0.6.0 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` |
| EntryPoint v0.7.0 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |
| EntryPoint v0.8.0 | `0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108` |
| EntryPoint v0.9.0 | `0x433709009B8330FDa32311DF1C2AFA402eD8D009` |
| Alchemy Modular Account v2 factory | `0x00000000000017c61b5bEe81050EC8eFc9c6fecd` |
| Alchemy Modular Account v2 impl | `0x000000000000c5A9089039570Dd36455b5C07383` |
| Alchemy SemiModularAccount7702 (7702 delegate) | `0x69007702764179f14F51cdce752f4f775d74E139` |
| ZeroDev Kernel v3.3 (7702) | `0xd6CEDDe84be40893d153Be9d467CD6aD37875b28` |
| eth-infinitism Simple7702Account (v0.8) | `0xe6Cae83BdE06E4c305530e199D7217f42808555B` |
| Safe 4337 Module v0.3.0 (EntryPoint v0.7) | `0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226` |
| Safe Module Setup v0.3.0 | `0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47` |
| Multicall3 / Permit2 / CreateX / CREATE2 proxy / Safe singleton factory | `0xcA11…CA11` / `0x0000…8BA3` / `0xba5E…a5Ed` / `0x4e59…956C` / `0x914d…43d7` |

The public RPC does not expose `eth_supportedEntryPoints`; that is a bundler method, so use the Alchemy URL.

### Alchemy on 46630

| Feature | Status | Conf. | Source |
|---|---|---|---|
| RPC + WS | Yes | H | alchemy.com/rpc/robinhood-testnet; probe of registry in `@alchemy/common` |
| Bundler, Gas sponsorship (Gas Manager), ERC-20 gas, BSOs | All ticked for "Robinhood Testnet" and "Robinhood Mainnet"; "Gas sponsorship on Robinhood Mainnet and Testnet is now live!" | H | alchemy.com/docs/wallets/supported-chains |
| Wallet APIs (`@alchemy/wallet-apis`) | Supported; v5 (`5.3.0`, published 2026-10-05) defaults to **7702 mode** (delegates the EOA on first send), `paymaster: { policyId }` on the client, `requestAccount()` for a non-7702 smart account; the docs call v5 beta | H | alchemy.com/docs/wallets/resources/migration-v5; …/transactions/using-eip-7702 |
| Chain object | `robinhoodTestnet` (46630) and `robinhoodMainnet` (4663) exported from `@alchemy/common` `chains.js`; not in `viem/chains` | H | npm tarball read |
| Gas Manager custom-rules webhook | Generic feature: POST per sponsorship request with `userOperation`, `policyId`, `chainId`, optional `webhookData`; reply `{ "approved": bool }`; option "sponsor on error or timeout". **Not yet shown working on 46630** | M | alchemy.com/docs/wallets/low-level-infra/gas-manager/…/conditional-gas-sponsorship |
| Faucet | Alchemy faucet: 0.1 ETH per 24 h; wallet needs ≥ 0.001 ETH and some activity on Ethereum mainnet | H | alchemy.com/faucets/robinhood-testnet |

Not tested live: an actual bundler or paymaster call. That needs an Alchemy key, which this research did not use.

### The repo's lesson (DECISIONS #5): still true

`@account-kit/privy-integration@4.88.5` (latest on npm, last published 2026-08-11) still has a hard-coded `switch`
in `dist/esm/util/getChain.js` with ~45 chains and no Robinhood entry, so it still throws
`Unsupported chainId: 46630`. `@account-kit/infra@4.88.5` also has no Robinhood chain. Account Kit v4 looks frozen,
and Alchemy's work has moved to `@alchemy/*` v5. **Not fixed; keep DECISIONS #5.** Conf. **H** (npm tarballs read).

### Privy

| Item | Finding | Conf. | Source |
|---|---|---|---|
| Robinhood in Privy's preset chains | Not listed | M | docs.privy.io/wallets/overview/chains; third-party guide robinhoodprompts.lovable.app/smart-wallets |
| Custom chain | `defineChain({ id, name, nativeCurrency, rpcUrls, blockExplorers })` from viem, passed in `PrivyProvider` `supportedChains`, and in `defaultChain` too (`defaultChain` must be in `supportedChains`; an empty array throws). The RPC can be overridden with `addRpcUrlOverrideToChain` from `@privy-io/chains`. Using `robinhoodTestnet` from `@alchemy/common` should satisfy this | H | docs.privy.io/basics/react/advanced/configuring-evm-networks |
| 7702 signing | `useSign7702Authorization` / `signAuthorization` on the embedded wallet; signing is local and chain-agnostic. viem's own `signAuthorization` throws for Privy embedded wallets | M | docs.privy.io/wallets/using-wallets/ethereum/sign-7702-authorization; docs.biconomy.io/new/getting-started/enable-mee-eoa-7702 |
| Privy-native gas sponsorship / smart wallets | Chain-dependent; Robinhood not listed. We use Alchemy for these anyway (DECISIONS #5) | M | docs.privy.io/wallets/overview/chains |

## 4. Safe

| Item | Finding | Conf. | Source |
|---|---|---|---|
| Safe v1.4.1 canonical contracts on 46630 and 4663 | All have bytecode: Safe `0x41675C099F32341bf84BFc5382aF534df5C7461a`, SafeL2 `0x29fcB43b46531BcA003ddC8FCB67FFE91900C762`, SafeProxyFactory `0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67`, MultiSend `0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526`, MultiSendCallOnly `0x9641d764fc13c8B624c04430C7356C1C7C8102e2`, CompatibilityFallbackHandler `0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99`, SignMessageLib `0xd53cd0aB83D845Ac265BE939c57F53AD838012c9`, CreateCall `0x9b35Af71d77eaf8d7e40252370304687390A1A52`, SimulateTxAccessor `0x3d4BA2E0884aa488718476ca2FB8Efc291A46199` | H | probe |
| Safe v1.3.0 (canonical and eip155) | Also present on both | H | probe |
| Safe Transaction Service | **Live for both**: `https://api.safe.global/tx-service/robinhood-testnet` (chain 46630, `ROBINHOOD_CHAIN_TESTNET`, synced) and `https://api.safe.global/tx-service/robinhood` (4663). Service v6.11.0. Protocol Kit / API Kit can use these | H | probe `/api/v1/about/` and `/about/ethereum-rpc/` |
| Safe{Wallet} web UI | Live on mainnet from launch day (2026-07-01), per a Safe{Labs} post dated 2026-07-27. A tx-service for testnet strongly suggests the UI supports 46630 too, but this is **not confirmed** (`safe-client.safe.global` returned 403 to curl) | H mainnet / M testnet | safe.global/blog/what-protocols-check-before-deploying-on-your-chain |

## 5. Faucets

| Faucet | Notes | Conf. | Source |
|---|---|---|---|
| Official `https://faucet.testnet.chain.robinhood.com` | Returned HTTP 429 to curl (likely bot protection); use a browser | M | developers.bitgo.com/docs/robinhood-chain; probe |
| Alchemy `https://www.alchemy.com/faucets/robinhood-testnet` | 0.1 ETH / 24 h; needs mainnet ETH ≥ 0.001 and some activity | H | that page |
| Chainstack MCP faucet | `network="robinhood"`, tops up to 1 ETH | L | docs.chainstack.com/changelog/chainstack-updates-july-27-2026 |
| Bridge Sepolia ETH | Parent chain is Sepolia, so the Arbitrum-style native bridge should work. No official bridge URL found | L | inferred from probe |

## 6. DEX (Uniswap)

| Item | Finding | Conf. | Source |
|---|---|---|---|
| Mainnet 4663 | Uniswap v2, v3, v4 and UniswapX live from 2026-07-01. v3: Factory `0x1f7d7550b1b028f7571e69a784071f0205fd2efa`, SwapRouter02 `0xcaf681a66d020601342297493863e78c959e5cb2`, NonfungiblePositionManager `0x73991a25c818bf1f1128deaab1492d45638de0d3`, QuoterV2 `0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7`, UniversalRouter `0x8876789976decbfcbbbe364623c63652db8c0904`. WETH9 (from SwapRouter02) = `0x0Bd7D308f8E1639fAb988df18A8011F41EAcaD73` | H (probed bytecode) | developers.uniswap.org/docs/protocols/v3/deployments/v3-robinhood-chain-deployments |
| Testnet 46630 | **No official Uniswap testnet deployment listed.** The mainnet v3 addresses have no code on 46630, except UniversalRouter. The explorer shows a "Uniswap V3 Positions NFT-V1" at `0xBc82a9aA33ff24FCd56D36a0fB0a2105B193A327` (unverified, 822 positions), whose `factory()` = `0xfeCCB63Cd759d768538458EA56F47eA8004323c1` and `WETH9()` = `0x37E402B8081eFcE1D82A09a066512278006e4691` (verified WETH9). There is also a "Uniswap v4 Positions NFT" at `0x58daec3116aae6D93017bAAea7749052E8a04fA7` and another WETH at `0x33e4191705c386532ba27cBF171Db86919200B94`. Who deployed these is unknown | L | probe + explorer `/api/v2/search` |

## 7. Chainlink

| Item | Finding | Conf. | Source |
|---|---|---|---|
| ETH / USD on 4663 | Proxy `0x78F3556b67E17Df817D51Ef5a990cDaF09E8d3A9`, 8 decimals, heartbeat 86400 s, deviation 0.5 %. Probe: `description()` = "ETH / USD", answer 2478.94, `updatedAt` 2026-10-14T12:33Z. Also BTC, USDC, USDT, LINK / USD; 58 feeds total, including tokenized stocks | H | reference-data-directory.vercel.app/feeds-robinhood-mainnet.json; dev.chain.link changelog "Data Feeds expands to Robinhood Chain mainnet" |
| Flags (official-feed check) | `0xbb601D8e5e568e6464D6D34feE489AA61b8d035A` on 4663 | H | docs.chain.link/data-feeds/llms-full.txt |
| L2 Sequencer Uptime feed | **None.** Chainlink "is no longer expanding L2 Sequencer Uptime Feeds", and Robinhood is absent from that feed list even though Robinhood's docs tell integrators to check one | M | docs.chain.link/data-feeds/l2-sequencer-feeds |
| Testnet 46630 | **No Chainlink price feeds found**: no directory file and no feed at the mainnet address. A LINK token exists on testnet | M | probe |

## 8. Known limits and gotchas

1. **Arbitrum `block.number`**: in Solidity it returns an *L1* block-number estimate, not the L2 block. Use
   `block.timestamp` for timers, or `ArbSys(0x64).arbBlockNumber()`. This matters for the 10-minute reveal timeout,
   72 h holds and the 1 h timelock. (Arbitrum-wide behaviour, conf. H.)
2. Blocks come every ~100 ms, so "N blocks" maps to very short wall time. Never size anything in blocks.
3. Gas estimates include an L1 data-fee part (Arbitrum). Estimates can look high and move with L1 blob prices.
   L2 base fee is tiny (0.01 to 0.024 gwei).
4. There is a single Robinhood-run sequencer. Outages stop all txs. There is no Chainlink sequencer-uptime feed to
   detect this on-chain.
5. Public RPCs are rate-limited, so use Alchemy for the worker and indexer. Historical reads need an archive
   endpoint (Alchemy).
6. A testnet incident (late July 2026) involved transaction-feed divergence: node operators were told to run with
   `--node.transaction-streamer.shutdown-on-blockhash-mismatch=false`. Expect occasional testnet instability.
   Source: status.robinhoodchain.offchain.io history (conf. M).
7. The mainnet Blockscout API sits behind a Cloudflare challenge, so scripted `hardhat verify` against 4663 may
   need retries or a Blockscout API key. Testnet Blockscout answered fine.
8. `viem/chains` lacks Robinhood Testnet, so import `robinhoodTestnet` from `@alchemy/common/chains` (matches
   LESSONS #1).
9. `evmVersion: "cancun"` in the Hardhat config is safe. ArbOS 61 is newer than that, so no change is needed.
10. On Arbitrum, the standard `PREVRANDAO` / `block.difficulty` is constant (difficulty = 1 in block headers), so it
    gives no randomness. This supports the commit–reveal design in AD-6.

## What this means for the spikes (epic-platform entries 1–5)

1. **Entry 1, tracer**: everything it needs exists on 46630: 7702 is active, EntryPoints v0.6–v0.9 are deployed,
   Alchemy's SemiModularAccount7702 delegate is deployed, Alchemy Bundler and Gas Manager are live on testnet,
   Blockscout can verify, and the Alchemy faucet works. Build on `@alchemy/wallet-apis` v5 (7702 default, beta) +
   Privy custom chain (`robinhoodTestnet` from `@alchemy/common`) + Privy `signAuthorization`. Do not use
   `@account-kit/privy-integration`; it is still broken at 4.88.5. Add a Hardhat `chainDescriptors[46630]` Blockscout
   entry with apiUrl `https://explorer.testnet.chain.robinhood.com/api`. Index events with `block.timestamp`, not
   L1-mapped `block.number`.
2. **Entry 2, wallet modes + webhook**: the on-chain pieces for both modes are present: 7702 delegate and MAv2
   factory for the 4337 fallback, on EntryPoint v0.7. The open questions are only Alchemy-side: whether one policy
   sponsors both modes, and whether the custom-rules webhook fires on 46630 with a usable `userOperation.sender` and
   `callData`. In 7702 mode, the sender should be the user's EOA. Keep "sponsor on error or timeout" **off**, so a
   webhook outage cannot drain the policy. MetaMask (DECISIONS #34) refusing 7702 → `requestAccount()` path.
3. **Entry 3, Safe + timelock**: low risk. Safe v1.4.1 contracts are deployed, and the Safe Transaction Service
   for `robinhood-testnet` is live, so Protocol Kit + API Kit will work even if the web UI does not list 46630. Step
   one is to check app.safe.global's network list in a browser. Use `SafeL2` (L2 events) for indexing.
4. **Entry 4, pot accumulator**: chain facts barely matter here, because it runs on Hardhat's in-process network.
   Only note: keep `evmVersion: cancun`, and use `block.timestamp` for the day cut.
5. **Entry 5, commit–reveal worker**: with ~100 ms blocks and sub-second soft confirms, reveal latency will be set
   by the worker and RPC, not the chain. Use an Alchemy endpoint, because the public RPC is rate-limited and would
   skew p99. The timeout must use `block.timestamp`. Expect the occasional testnet incident; log it rather than
   counting it as a design failure. Fund the signer from the Alchemy faucet (0.1 ETH/day is plenty at 0.01 gwei).
   On-chain randomness (PREVRANDAO) is unusable on Arbitrum, which confirms commit–reveal.

**Biggest risk:** Alchemy-side, not chain-side. Nobody has shown the Gas Manager custom-rules webhook and one shared
policy working for both 7702 and 4337 modes on 46630, and `@alchemy/wallet-apis` v5 is beta. Also note for later
epics: there is **no Chainlink feed on testnet** and **no sequencer-uptime feed on mainnet**, so any ETH/USD display
rate on 46630 needs a mock or an off-chain price.
