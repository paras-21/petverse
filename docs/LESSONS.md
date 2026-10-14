# Lessons

Known problems and their fixes. Search here before diagnosing. Add only non-obvious, verified lessons.

| # | Date | Symptom | Cause | Fix |
|---|---|---|---|---|
| 1 | 2026-10-13 | `getChain()` throws "Unsupported chainId" | `@account-kit/privy-integration` has no Robinhood Chain entry | Use `@alchemy/wallet-apis` `createSmartWalletClient` with `robinhoodTestnet` from `@alchemy/common/chains` |
| 2 | 2026-10-13 | `python` not found on this Windows machine | No system Python | Use `node` for scripts; BMad scripts run through `uv run` (uv provisions Python) |
