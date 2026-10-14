---
type: epic
title: "Platform baseline, governance and spikes"
parent: initiative-petverse-mvp1
covers: [CAP-30]
after: []
assignee: ""
risk: high
---

# Platform baseline, governance and spikes

## Description

Every later epic builds on one proven path: a player logs in with Privy, gets a smart account on Robinhood Chain
testnet 46630, sends one gas-sponsored contract call, the worker indexes the event into Postgres and the app shows it.
This epic lays that path, the gate, the environments and the deploy pipelines, the governance base that keeps any
single key from changing a rule (CAP-30), and the shared Randomness service. Its four spikes answer, before any game
epic starts, whether the spine's riskiest choices work on this chain: wallet modes, Safe + timelock, the per-owner pot
accumulator, and the commit–reveal worker.

## Outcome

The team can ship any game contract and screen to testnet 46630 through the gate with no single-key admin; the signal
is the tracer action and a Safe-proposed, timelocked parameter change both working live on 46630.

## Requirements

Platform lines cite their source section; only R1 maps to a spec capability.

- R1: Governed admin. Every parameter change and upgrade is proposed by the 2-of-3 Safe through a 1-hour
  `TimelockController`; the Safe can pause or cancel but not change rules or move funds instantly; each server key holds
  one role; stateful contracts are UUPS with ERC-7201 storage. → CAP-30 (AD-3; DECISIONS #11, #30; N1)
- R2: Wallet path. Privy login, `@alchemy/wallet-apis` smart account on 46630 (EIP-7702 on the embedded wallet, ERC-4337
  fallback for external wallets), one Gas Manager policy for the game contracts, transactions only through the
  `GameWallet` port, player identity = Privy DID verified server-side. (spec Constraints, login; AD-7, AD-8; DECISIONS
  #5, #23; LESSONS #1)
- R3: Randomness. One `Randomness` contract, a `RANDOMNESS_SIGNER` commitment route and a revealer job; the 10-minute
  timeout closes a request as a no-op; no chain entropy. (AD-6; DECISIONS #12; N8)
- R4: Worker. One in-repo worker on Render: indexer with a per-contract cursor and idempotent upserts, a job loop for
  later jobs, and a health route. (AD-14, AD-23; DECISIONS #21)
- R5: Data. One Prisma schema with a named writer per model; environments are Postgres schemas (`game`, `dev`,
  `test_<runid>`) chosen only by `DB_SCHEMA`; tests never touch live data. (AD-12, AD-13; DECISIONS #10; NFR-6)
- R6: Gate. Install, typecheck, lint and test for the app and `chain/`, plus the OpenZeppelin upgrade-safety validator
  on build output. (DECISIONS #2, #24; AD-3, AD-20)
- R7: Config and secrets. Chain secrets only through Hardhat `configVariable` / keystore; server keys only in host env;
  no secret in code, logs or chat. (NFR-5; architecture Consistency Conventions, Secrets; CLAUDE.md)
- R8: Deploy. Hardhat Ignition modules deploy and Blockscout-verify contracts on 46630; one generated TS module per
  chainId carries addresses and ABIs into `src/`; the app deploys to Vercel. (AD-3, AD-21; DECISIONS #21)

## Done when

1. On the deployed Vercel app, a fresh email login gets a 7702 smart account on 46630, sends one sponsored contract
   call, and within a minute the page shows the row the Render worker indexed from that call's event.
2. On 46630 a parameter change proposed by the 2-of-3 Safe executes only after the 1-hour delay; the same call from any
   other key reverts; the Safe pauses a module but cannot change a parameter instantly; every deployed contract is
   verified on Blockscout.
3. The gate (install, typecheck, lint, test for app and `chain/`, upgrade-safety validator) passes on the integration
   branch and fails on a planted test failure and on a planted storage-layout break.
4. Tests run only in a `test_<runid>` schema that is created and dropped per run; seed and reset refuse `game`.
5. A randomness request on 46630 is revealed by the worker, and one left unrevealed past 10 minutes is closed as a
   no-op by any caller.
6. Each spike's answer is recorded as a dated decision where its waiting epic reads it: spikes 2, 3 and 5 in this file's Notes, spike 4 in epic-pot.md Notes; every write-up is saved in this epic folder.

## Boundaries

The platform baseline: scaffold, environments, CI gate, deploy pipelines, operations skeleton, governance base and the
shared Randomness service. Not any game rule or screen beyond the tracer page; not the Gas Manager daily cap webhook
(epic-store-pass, CAP-2); not the pot contracts (epic-pot), which the accumulator spike only prototypes; not ops alarms
and runbooks for the full game (epic-launch).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-30 and Constraints
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Anti-bot and admin (N1, Safe), Battles and events (reveal timeout)
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-3, AD-4 (spike), AD-6, AD-7, AD-8, AD-12, AD-13, AD-14, AD-20, AD-21, AD-23, Consistency Conventions, Stack, Structural Seed
- decisions — docs/DECISIONS.md, #1, #2, #4, #5, #10, #11, #12, #21, #23, #24, #30
- lessons — docs/LESSONS.md, #1 (`@account-kit/privy-integration` fails on Robinhood), #2 (no python)
- owner checklist — docs/OWNER-CHECKLIST.md, "Fund testnet deployer wallet and Alchemy Gas Manager policy", "GitHub remote access"

## Notes

- Decision: 2026-10-14 tracer bullet = entry 1: the app (run locally) logs in with Privy, gets a 7702 smart account on 46630, sends one sponsored call to a minimal tracer contract, the worker (run locally) indexes the event into the `dev` schema, and the page shows the row. Hosting on Vercel and Render follows in entries 9 and 10 (recommended default, DECISIONS #31).
- Decision: 2026-10-14 spike order after the tracer, least certain first: wallet modes (2), Safe + timelock on 46630 (3), per-owner pot accumulator invariant (4), commit–reveal worker (5) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the breakdown has 17 entries, above the typical 8–12; it stays one epic because it is one owner and mostly one lane, and a split into "baseline" and "governance + randomness" was considered and not taken (recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" is included; no closing end-to-end suite, since the spec has no test plan and each epic carries its own integrated check (recommended default, DECISIONS #31).
- Decision: 2026-10-14 stories that edit `prisma/schema.prisma` run one after another (1 → 8 → 9 → 11 → 16), so no two lanes touch the schema at once (recommended default, DECISIONS #31).
- Decision: 2026-10-14 every step that needs a person is a hitl step on the first entry that needs it: Privy app, Alchemy app and Gas Manager policy, deployer funding and secrets (1); Safe signers (3); Supabase dashboard (8); Render (9); Vercel (10); the owner's OK and Safe signatures for the testnet governance deploy (15); signer-key funding (16). Every deploy to 46630 waits for the owner's OK (CLAUDE.md) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 "every deployed contract is verified" (Done when 2) counts release contracts; spike test contracts are verified when cheap but are not part of the check (recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry `notes` carry the hitl steps and the outside check for high-risk entries, at the owner's instruction for this run (recommended default, DECISIONS #31).
- Decision: 2026-10-14 role keys are configured by the entry that creates the role (13, 16); entry 7 owns only the deployer key, RPC URLs and the env loader (recommended default, DECISIONS #31).
- Open question: entry 12's tests run below the UI; a UI test tool (React Testing Library or Playwright) is not in DECISIONS #24 and needs the owner if wanted.
- Assumption: the tracer contract is a minimal contract used only to prove the path; it is not a game contract and is not upgradeable.
- Assumption: spike prototypes are kept apart from production contract and source folders, and each spike's write-up is saved in this epic folder.
- Open question: approve `@safe-global/protocol-kit`, or use Safe CLI outside the repo, if the Safe web UI lacks 46630 (initiative Notes). Entry 3 answers whether it is needed.
- Open question: Node version on Render and Vercel must run TypeScript with built-in type stripping (22.18+), or the owner approves a runner. Entries 9 and 10 confirm it.
- Source conflict: AD-13 vs `src/lib/db.ts` (no schema passed) — fixed by entry 8 (initiative Notes).
- Source conflict: DECISIONS #2 vs root `package.json` (no `typecheck` or `test` script) — fixed by entry 6 (initiative Notes).
- Decision: 2026-10-14 owner approved `@safe-global/protocol-kit` and `@openzeppelin/merkle-tree` (DECISIONS #32).
- Decision: 2026-10-14 owner allows tests to create/drop only `test_<run>` schemas on the project Supabase DB (DECISIONS #33). Unblocks entry 8.
- Decision: 2026-10-14 external wallet for the 4337 fallback test = MetaMask (DECISIONS #34). Unblocks entry 2.
- Decision: 2026-10-14 Safe spike uses 3 fresh test keys; owner + 2 teammates swap in before the testnet governance deploy, a hitl step on entry 15 (DECISIONS #35). Unblocks entry 3.
