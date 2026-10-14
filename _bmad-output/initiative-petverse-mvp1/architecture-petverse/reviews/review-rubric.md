# Review: architecture-petverse.md (rubric review)

Reviewer: independent sub-agent, 2026-10-14. Spine not edited.
Inputs read: spine; PRD + addendum; docs/DECISIONS.md; intent/001; frenpet CONTRACTS.md; chain/hardhat.config.ts,
chain/package.json, package.json, prisma.config.ts, prisma/schema.prisma, src/lib/db.ts. No .env read.

## Verdict

Strong, well-shaped spine (CQRS-with-chain paradigm, single-ledger hub, one randomness/price/pot path, one writer per
table) that ratifies the brownfield code, but **not yet ready to bind units**: it leaves season-end/ranked reward
distribution and the testnet faucet undecided, the test-schema mechanism under-specified against the real pooler, and
several divergence points sitting in Deferred or unstated.

## Checklist scores

| Check | Result |
| --- | --- |
| Fixes the real divergence points, misses none | Partial: misses ranked/season reward distribution, faucet, transferability of PetNFT/commons, equip state, ABI/address sharing, upgrade-storage discipline |
| Every AD Rule enforceable and prevents its divergence | Mostly. AD-13 is not enforceable as written (no selection mechanism); AD-7 "one action = one user op" is gameable with batched calls; AD-6 relies on block semantics that may differ on an Arbitrum-based chain |
| Nothing under Deferred lets units diverge | Fails on "storage layout ... decided per contract unit" |
| Ratifies, does not contradict, brownfield | Yes (Hardhat 3 config, Ignition script names, prisma.config.ts on DIRECT_URL, db.ts on DATABASE_URL). AD-13 will need a db.ts change that the spine does not name |
| Covers FR-1..53, NFR-1..6 | Map covers all FR numbers, but FR-36 (season trophy), FR-47 (season pool bonus), FR-32 (Guild War prize), FR-53 (top raid teams), FR-12/FR-30 badges, FR-49 egg-shard have no settlement mechanism; NFR-4 (PWA/service worker) only implied |
| Altitude dimensions (deploy & envs, infra/provider, operations) | Environments decided (table); hosting = open question (ok); operations for testnet (liveness of revealer/keeper, alerting, key rotation) neither decided nor deferred nor open |
| No AD contradicts DECISIONS #1-13 | No hard contradiction of intent, but AD-7 (20 with pass) and AD-16 (free wake) diverge from the literal text of #7 and #6 without a superseding DECISIONS entry; #9 "no Gladiator pets" not carried |

## Findings

### F1 (HIGH) Ranked / season-end rewards have no mechanism

FR-47 season pool bonus to top players, FR-36 "season trophy (top 10% finish)" which the on-chain Evolution module must
check, FR-53 "top raid teams get a cosmetic", FR-32 Guild War Gold prize "from the season pool", FR-25 Hall of Fame.
All need a sort over all players at season end, which is O(n) on-chain, exactly the problem AD-5 solves for the small
pot only. Worse, Guild War prizes are paid on-chain to *guild members*, but AD-1 puts guild membership off-chain, so a
contract would have to trust DB data, breaking the paradigm ("signers never read projections ... except the small-pot
builder"). Two units (Seasons, Raid, Guild War, Evolution) will each invent their own answer.

*Fix:* generalise AD-5 into one "EpochDistributor" pattern: any ranked or periodic reward (small pot, season pool,
trophies, raid top teams, Guild War prize) is a Merkle root posted by `SMALLPOT_POSTER`-style role, with published
dataset, cancel window, O(1) claims; trophies as a non-transferable on-chain record minted by claim. Either put guild
rosters for a war on-chain (snapshot committed at war start) or name guild membership as a second published input
allowed to the distributor.

### F2 (HIGH) Testnet faucet and $PETV supply allocation missing

PRD §4.10 "Test funds" (faucet gives test ETH and test $PETV at sign-up and daily), UJ-5, FR-4. Not in any AD, the
module list, the map or the roles. AD-9 says PETV is minted once with no mint, but does not allocate any of the 1B to
the curve, faucet, liquidity or team, so the faucet has no source. A faucet run from a hot server key holding funds
would contradict AD-3's "server keys hold only narrow roles". This is also the main bot-farming surface (AD-15 covers
only free eggs).

*Fix:* add an AD: `Faucet` contract holding a fixed $PETV allocation and test ETH, drip paid only against a
`VOUCHER_SIGNER` voucher (one per Privy DID per UTC day, same anti-bot rule as the free egg), amounts as timelocked
params; add the initial supply split to AD-9 (owner numbers go to open question 4).

### F3 (HIGH) AD-13 schema isolation is not enforceable as written

The rule names schemas and a guard but not *how* a process selects its schema. The app runs on Supabase's
transaction-mode pooler (:6543, DECISIONS #10), where a session `search_path` does not persist across transactions,
and `src/lib/db.ts` today takes no schema at all, so every unit will pick its own way (URL `?schema=`, `options=-c
search_path`, adapter option) and some will silently land in `public`. Also `package.json` `db:migrate` runs `prisma
migrate dev`, which needs a shadow database on the hosted server.

*Fix:* state it: one env var (e.g. `DB_SCHEMA`) is the only source; `db.ts` passes it to `PrismaPg` (adapter `schema`
option) so every query is schema-qualified; migrations for `test_*`/`dev` run `prisma migrate deploy` over
`DIRECT_URL` with the same schema; the guard reads `DB_SCHEMA` and throws unless `test_` in tests and unless not
`public` in seed/reset. Name the `db.ts` change as part of the first database unit.

### F4 (MEDIUM) Divergence points left in Deferred or unstated

- **Upgrade storage:** Deferred says storage layout is "decided per contract unit". With UUPS and Hardhat 3 (no
  `@openzeppelin/hardhat-upgrades` support assumed), units will diverge on storage discipline and break upgrades.
  *Fix:* mandate ERC-7201 namespaced storage in every upgradeable contract and an `@openzeppelin/upgrades-core
  validate` step (owner approval for the dep) in `chain/` tests.
- **Transferability:** PRD §7 "no trading pets or eggs, no common-cosmetic trading". The spine never says PetNFT,
  eggs, common cosmetics, Tombstone/memory badges, trophies or Gold are non-transferable (Fren Pet's pGOLD blocks
  transfers to contracts). Transferable PetNFT also breaks the co-owner model, the 3-Co-Pet cap and per-DID vouchers.
  *Fix:* AD "Transfer rules": PetNFT transfers only via PetCore (Co-Pet split/buyout); commons, badges, trophies
  soulbound; Cosmetics rare+ tradeable only via `Market`.
- **Commons and equip state:** Cosmetics is "ERC-1155, rare+", but the wheel (on-chain) and the store (on-chain) grant
  commons, and the UJ-1 free cosmetic exists. Where commons live and whether "worn" state is on-chain is undecided.
  *Fix:* commons are on-chain soulbound balances in the same contract; equip is on-chain (or explicitly off-chain
  profile data in AD-1).
- **Contract addresses and ABIs from `chain/` to `src/`:** separate packages; no rule for how the app, worker and
  signers get addresses per chain and typed ABIs. *Fix:* one generated `src/lib/contracts.ts` (or similar) produced
  from Ignition `deployed_addresses.json` + artifacts per chainId; nothing else hard-codes an address.

### F5 (MEDIUM) AD-6 assumes Ethereum-style block semantics

Robinhood Chain is Arbitrum-based (verify). On Arbitrum chains `block.number` returns the parent-chain block number
(many L2 blocks share it) and `blockhash` is documented as not cryptographically secure; `blockhash` also returns 0
after 256 blocks, which the reveal-timeout must respect. "commit block + 1" may wait far longer than intended or add no
entropy. *Fix:* verify on 46630; specify `ArbSys.arbBlockNumber()` (or timestamp) for the commit point, treat the
blockhash term as optional entropy, and require reveal timeout < 256 blocks of whatever number is used.

### F6 (MEDIUM) DECISIONS drift not routed to a superseding entry

AD-16 (free wake with point loss) vs #6 "death + paid revive"; AD-7 cap 20 with Season Pass vs #7 "only the first 10";
#9 "no Gladiator pets" absent. Owner superseded these in the PRD memlog, but DECISIONS has no new numbered entries
(CLAUDE.md rule 4: a decision changes only by a new entry). The Inherited table lists #7 with a PRD note but treats it
as settled. *Fix:* add an open question / blocker: owner logs #14 (free wake supersedes paid revive in #6), #15 (pass
raises cap to 20, amends #7), and a ruling on "Gladiator" for #9; until then mark AD-7 and AD-16 as provisional.

### F7 (MEDIUM) Testnet operations and a few security edges

- No decision, deferral or open question for testnet ops: alerting when revealer or keeper stalls (AD-6 timeouts and
  AD-16 bury depend on them), signer key rotation via timelock, gas-tank balance for Gas Manager, counter-metric
  measurement (bot share of payouts, top-5% share, D7 retention) which needs telemetry tables. Deferred puts
  "observability" on mainnet only. *Fix:* one AD or open question for testnet ops: health endpoint + alert for worker
  lag, revealer backlog, Gas Manager balance; a metrics job reading projections for the four counter-metrics.
- AD-7: "one action = one user operation" is gameable by batching many calls in one user op. *Fix:* webhook approves
  only user ops whose calldata is a single call to an allow-listed game contract.
- AD-8 verifies Privy tokens, but `/api/gas/approve` is called by Alchemy: *Fix:* require Alchemy webhook signature
  verification on that route.
- AD-12 + AD-1: the indexer owns projections, but the small-pot builder and gas webhook also write; fine, but say the
  `Notification` writer (worker) vs `NotificationSettings` writer (API) explicitly in the schema comments rule.

### F8 (LOW) Smaller gaps

- OQ 9 dependency list misses `viem` in the root app (only in `chain/`), a Privy server-side verification package,
  and the upgrades-validate tool (F4). `zustand` (present in root) is not in Stack.
- "Good care" (fed in each 24h window) drives Death Match life refills, breeding eligibility, Co-Pet Together bonus
  and shared streak, but AD-16 tracks only `sleepAt`; say PetCore also stores the care-window counter.
- Duel / 2v2 / wager: whether the opponent must consent on-chain (wager stakes do) is unstated; matchmaking "level ±2"
  should be re-checked on-chain at settlement.
- NFR-4 PWA: service worker is required for web push (AD-19); name its owner unit.
- `RevealLog ||--o| BattleRecord` in the ER diagram implies randomness only for battles; wheel, eggs, breeding,
  expeditions, drops also seed from it (NFR-1).

## Reconcile-inputs: quiet requirements that did not land

| Source | Requirement | Status in spine |
| --- | --- | --- |
| PRD §4.10 Test funds, UJ-5, FR-4 | Faucet of test ETH + $PETV, sign-up and daily | Missing (F2) |
| PRD FR-47, FR-36, FR-53, FR-32, FR-25 | Season pool top-player bonus, top-10% trophy, raid top teams, Guild War prize, Hall of Fame | Mapped but no mechanism (F1) |
| PRD §7 | No trading pets/eggs/commons | Missing (F4) |
| PRD FR-12, FR-30, FR-49 | Tombstone badge, memory badge, egg-shard | Tombstone via event only; memory badge and egg-shard have no home |
| PRD §6 counter-metrics | Measurable bot share, whale share, retention | No telemetry/metrics decision (F7) |
| DECISIONS #9 | No Gladiator pets in Death Match | Missing (F6) |
| DECISIONS #6, #7 | Paid revive; 10 sponsored actions | Changed by PRD; no superseding entry (F6) |
| Intent "Stronger pot" | Revive fees into pot | Dropped with free wake (owner-superseded in memlog; fine once logged) |
| Intent "Fairer pot" | Claim-half option | Owner-superseded (memlog L22); fine |
| Intent OQ | Signer key in KMS, public reveal log | Reveal event + RevealLog: landed; KMS is OQ 5 |
| PRD OQ 3, 6, 7, 8 | Randomness publication cadence, test DB, eff-points curve, day-7 boundary | Answered by AD-6, AD-13, AD-4, AD-16 (AD-13 needs F3) |

## What is good (keep)

- Paradigm table + allowed-dependency diagram gives units a crisp boundary test.
- AD-2 single ledger with settle-before-change, AD-4 accumulator with `undistributed`, AD-10 price port with burn stage
  from the source, AD-11 single ETH entry point: these close the highest-risk money divergences.
- AD-16 resolves PRD OQ 8 with a shared TS port and test vectors; AD-14 cursor + idempotent upsert keyed by
  `(chainId, txHash, logIndex)`.
- Open questions are scoped with what they block; Stack versions match the lockfiles.
