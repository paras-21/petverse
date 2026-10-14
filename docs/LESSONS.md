# Lessons

Known problems and their fixes. Search here before diagnosing. Add only non-obvious, verified lessons.

| # | Date | Symptom | Cause | Fix |
|---|---|---|---|---|
| 1 | 2026-10-13 | `getChain()` throws "Unsupported chainId" | `@account-kit/privy-integration` has no Robinhood Chain entry | Use `@alchemy/wallet-apis` `createSmartWalletClient` with `robinhoodTestnet` from `@alchemy/common/chains` |
| 2 | 2026-10-13 | `python` not found on this Windows machine | No system Python | Use `node` for scripts; BMad scripts run through `uv run` (uv provisions Python) |

- 2026-10-14: `@account-kit/privy-integration` still throws Unsupported chainId on Robinhood Chain in 4.88.5 — keep DECISIONS #5 (Privy signer + `@alchemy/wallet-apis`). Source: docs/research/robinhood-chain.md.
- 2026-10-14: Robinhood testnet 46630 = Arbitrum Orbit on Sepolia, ~0.1s blocks, EIP-7702 live, EntryPoints v0.6–v0.9 and Safe v1.4.1 deployed, Blockscout verification works, no Chainlink feed and no official Uniswap on testnet (matches DECISIONS #8, #22). Source: docs/research/robinhood-chain.md.
