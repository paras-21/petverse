---
type: initiative
title: "Petverse release 1: the whole pet game, fair and checkable, on Robinhood Chain testnet"
parent: none
covers: [CAP-1, CAP-2, CAP-3, CAP-4, CAP-5, CAP-6, CAP-7, CAP-8, CAP-9, CAP-10, CAP-11, CAP-12, CAP-13, CAP-14, CAP-15, CAP-16, CAP-17, CAP-18, CAP-19, CAP-20, CAP-21, CAP-22, CAP-23, CAP-24, CAP-25, CAP-26, CAP-27, CAP-28, CAP-29, CAP-30]
after: []
assignee: ""
risk: high
---

# Petverse release 1: the whole pet game, fair and checkable, on Robinhood Chain testnet

## Description

Players hatch, raise, dress up and fight cute 3D pets whose points are a claim on a shared ETH pot, under rules anyone
can check on-chain and that no single key can change. Release 1 is the whole game on Robinhood Chain testnet 46630 with
test money, so the loop, the balance and the bugs are found before real money is at risk. The spec owns the
capabilities, constraints, numbers and non-goals; this initiative delivers all of them and opens testnet only when
every one works.

## Outcome

Testnet players find the game worth coming back to under fair rules: the spec's success signal (100+ players, 40%+ of
new players still playing after 7 days) with the four counter-metrics under their limits.

## Done when

1. Testnet 46630 is opened to players only after every capability CAP-1 to CAP-30 works end to end on the deployed,
   Blockscout-verified contracts, the Vercel app and the Render worker.
2. The testnet run reaches 100+ players, and 40%+ of new players are still playing 7 days after their first session.
3. The four counter-metrics, measured daily, stay under their limits for the whole run: bot accounts take at most 10%
   of pot payouts; the top 5% of pets take at most 50%; at most 40% of robbed new players leave in week 1; at least
   30% of owners whose pet died hatch again.
4. On the live testnet contracts no single key changes a rule, upgrades a contract or moves pot funds: a recorded drill
   shows every change goes Safe 2-of-3 → 1-hour timelock, and the Safe can only pause or cancel.
5. Anyone can rebuild every pot share, claim and epoch root from public views and the published datasets, and every
   random result checks against its commitment.

## Boundaries

The game on testnet 46630: contracts in `chain/`, the Next.js app and API on Vercel, the worker on Render, off-chain
data in the one Supabase Postgres. Not mainnet, real money or mainnet legal work; not store apps; no pet, egg or
Co-Pet trading; no dark mode, email alerts, VRF, paid revive or Gold minting; see the spec's Non-goals. Epics follow
capabilities, one capability or a tightly coupled pair per epic, each owned by one owner; the platform baseline opens.

Tracer path across epics: a new player logs in, hatches a free pet, feeds it, earns points, sees the pot share in
dollars and claims test ETH (epic-platform → epic-pet-life → epic-pot).

- Touch point: Privy dashboard — app, login methods, verification key; owner: epic-platform
- Touch point: Alchemy bundler and Gas Manager policy — app, policy, contract allow-list; owner: epic-platform; custom-rules webhook and daily cap: epic-store-pass
- Touch point: Supabase Postgres — schemas `game`, `dev`, `test_*`, Data API exposure, RLS; owner: epic-platform
- Touch point: Vercel — project, env secrets, deploys; owner: epic-platform
- Touch point: Render — worker service, env secrets; owner: epic-platform
- Touch point: Safe v1.4.1 canonical contracts on 46630 — 2-of-3 Safe created, no code change; owner: epic-platform
- Touch point: Robinhood Blockscout explorer — source verification of every contract; owner: epic-platform (pipeline), epic-launch (final check)
- Touch point: Telegram Bot API — one bot created with BotFather, linked by token; owner: epic-alerts
- Touch point: web push services — VAPID keys, service worker; owner: epic-alerts
- Touch point: existing 3D pets in `src/components/three`, `src/lib/pets.ts` and `src/lib/cosmetics.ts` — consumed for pets, palettes and egg (epic-pet-life) and the 35-item cosmetic catalogue (epic-cosmetics-market)

## References

- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, section Capabilities
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md
- glossary — _bmad-output/initiative-petverse-mvp1/spec-petverse/glossary.md
- constraint — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, sections Constraints, Non-goals and Success signal
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1 to AD-24 (settles every decision more than one epic adopts), Structural Seed, Capability → Architecture Map
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, sections Information Architecture, Key Flows, Onboarding, Notifications
- decisions — docs/DECISIONS.md, #1 to #36
- owner checklist — docs/OWNER-CHECKLIST.md
- prd — _bmad-output/initiative-petverse-mvp1/prd-petverse/prd-petverse.md, for history only

## Notes

Known decisions in force (not re-opened): testnet 46630 first (#4); Privy signer + `@alchemy/wallet-apis` + Gas
Manager, EIP-7702 with ERC-4337 fallback (#5, #23); 10 sponsored actions a day, 20 with Pass (#7, #19); USD prices
paid in PETV with server-signed quotes on testnet (#8); at most 2v2, Death Match 3 lives (#9, #20); Supabase via
Prisma 7.10 (#10); verified contracts, multisig, time delay (#11); commit–reveal randomness (#12); 3 + 7 day death
timer (#13); no pet or Co-Pet selling (#14); asleep pets get no pot share (#15, #28); Gold from a funded reserve with
a daily cap (#16, #26); per-owner effective points (#17); free wake that costs 10% of pot points per day asleep (#18,
#27); Co-Pet leave pays the leaver's half first (#29); Vercel + Render (#21); our own v2-style pool on 46630 (#22);
approved deps (#24, #32); owner numbers N1–N14 (#25, #26); 2-of-3 testnet Safe (#30); recommended defaults accepted (#31); tests may drop only their own `test_<run>` schemas (#33); MetaMask for the 4337 fallback test (#34); spike Safe keys replaced by real signers before the testnet governance deploy (#35).

- Decision: 2026-10-14 release 1 scope = Robinhood Chain testnet 46630 only, test funds only (owner, DECISIONS #4; spec Constraints).
- Decision: 2026-10-14 "production" for every epic = deployed to testnet 46630 with contracts verified on Blockscout, the app on Vercel production and the worker on Render; players are let in only by epic-launch, because the spec ships all at once (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the epic set is cut by the slicing rule (one capability or a tightly coupled pair per epic, one owner, one module). It follows the owner's suggested shape with these changes, each forced by a dependency: PETV and the Gold vault come before battles (wagers stake PETV; monsters, raids and Guild War pay Gold); the store and Season Pass are their own epic with the faucet and the sponsorship cap (the cap reads the Pass); cosmetics and market come before the play hub (wheel and raid prizes are cosmetics); Co-Pet and guilds come before the play hub (Death Match needs Co-Pet consent; Guild War needs 2v2); evolution and breeding come after seasons (Mythic needs a season trophy); seasons, alerts and anti-bot are separate epics; fairness views join the launch epic (recommended default, DECISIONS #31).
- Decision: 2026-10-14 decisions more than one epic must adopt are settled in the architecture spine (AD-1 to AD-24); each epic cites the AD sections it adopts. The opening epic holds the four feasibility spikes (wallet modes, Safe + timelock, pot accumulator, commit–reveal) that later epics wait on through `after` (recommended default, DECISIONS #31).
- Decision: 2026-10-14 shared components belong to the earliest epic that needs them, and later epics extend them: governance base, Randomness, GameWallet, indexer and the generated chain module → epic-platform; PetCore, PetNFT, the voucher signer and the Cosmetics ERC-1155 with its soulbound badges (Tombstone) → epic-pet-life; PotFunder and EpochDistributor (all streams) → epic-pot; PETV and GoldVault → epic-petv; price source, PotConverter and the Store item registry → epic-store-pass; the Play tab shell → epic-battle (Dice card) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 each CAP is in exactly one epic's `covers`; where another epic delivers a part, both envelopes say so: CAP-1 pot teaser and "see the pot" step by epic-pot; CAP-6 ETH recycle at death by epic-pot and Gold-counter deletion by epic-petv; CAP-28 commitments are emitted by every module, the views by epic-launch; CAP-29 free-egg voucher by epic-pet-life (CAP-3) and faucet voucher by epic-store-pass (recommended default, DECISIONS #31).
- Decision: 2026-10-14 only the opening epic (epic-platform) is incepted now; the others keep their envelope and place in the order (owner instruction for this run). Superseded the same day: every epic was then incepted in parallel and integrated below.
- Decision: 2026-10-14 epics are built one at a time in `tickets.toml` order, because nearly every epic edits the same shared files (`prisma/schema.prisma`, the Ignition module, the generated chain module, PetCore); parallel work happens in lanes inside an epic. An epic starts early only when the owner names the shared files it may touch (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the read-only dollar display rate (ETH/USD) belongs to epic-pot, the first epic that shows money in dollars; epic-petv adds PETV/USD; the signed payment quote stays in epic-store-pass (AD-10) (recommended default, DECISIONS #31).
- Decision: 2026-10-14 each epic file keeps `after: []` in its frontmatter because no epic waits on a whole earlier epic as a gate; what each needs is in this folder's `tickets.toml` and in the epic's "Waits on" Notes (recommended default, DECISIONS #31).
- Open question: which ETH/USD source feeds the dollar display on testnet 46630 (DECISIONS #8 names Chainlink for mainnet only). epic-pot waits on it.
- Assumption: dependencies approved in DECISIONS #24 may be added by the epic that first needs them without asking again; `@safe-global/protocol-kit` and `@openzeppelin/merkle-tree` are approved too (DECISIONS #32); anything on neither list (a test runner, a TypeScript runner for the worker) is asked of the owner first (CLAUDE.md).
- Assumption: app, server and worker tests use `node:test` with Node 22's built-in TypeScript type stripping (Node 22.20 on this machine), so no new test dependency is needed.
- Resolved: 2026-10-14 Safe Protocol Kit is approved as `@safe-global/protocol-kit` (owner, DECISIONS #32); epic-platform spike 3 uses it if the Safe web UI lacks 46630.
- Resolved: 2026-10-14 the Merkle library is approved as `@openzeppelin/merkle-tree` (owner, DECISIONS #32); epic-pot entry 5 adds it.
- Open question: economy numbers the spec does not give: battle stats and win-odds formula, monster and boss stats and boss health, Together bonus size, Bold expedition stake bounds, wager and dice stake bounds, Guild War prize size, season-pool bonus split, Elder/Mythic item effects, egg-shard use. Each is an owner decision; epic-battle, epic-social, epic-play-hub, epic-death-match-raid, epic-seasons and epic-growth wait on theirs.
- Open question: season 1 genesis date and boss per season. epic-store-pass (SeasonPass boundaries) and epic-seasons wait on it.
- Open question: final name for Gold (OWNER-CHECKLIST); "Gold" is the working name in every epic.
- Open question: CI host. GitHub Actions needs the owner's remote (OWNER-CHECKLIST, `gh auth login`); until then the gate runs locally through `floor gate`. epic-platform entry 6 writes the workflow either way.
- Open question: how entries map to floor units in `.floor/units.json` (CLAUDE.md says the work lives there; it is empty). The floor operator creates units from these entries; this plan does not touch `.floor/`.
- Source conflict: AD-13 — `DB_SCHEMA` must be passed to `PrismaPg({ schema })` vs `src/lib/db.ts` passes no schema, so every query lands in the default schema. epic-platform entry 8 fixes it.
- Source conflict: DECISIONS #2 — the gate runs typecheck and test for the app and `chain/` vs the root `package.json` has no `typecheck` or `test` script and `chain/` has no tests. epic-platform entry 6 fixes it.
- Source conflict: CAP-18 — "every item fits all 10 species" vs `src/lib/cosmetics.ts` "hand items: adults with arms only (babies have no hands)". epic-cosmetics-market settles it with the owner.
- Source conflict: docs/OWNER-CHECKLIST.md — "Token launch type: Pons bonding curve or traditional ICO" is still open vs DECISIONS #22 and CAP-22 (testnet uses our own Pons-like curve). Release 1 follows #22; the checklist item is read as mainnet only.
- Source conflict: architecture-petverse.md frontmatter `binds: DECISIONS#1-25` vs its body binding #26 to #30. Metadata only; the body is followed.
- Decision: 2026-10-14 split at inception: Death Match and Boss Raid leave epic-play-hub as the new epic-death-match-raid (epic id 15), built right after epic-play-hub and before epic-seasons; it covers CAP-13 and delivers the Boss Raid part of CAP-20, which stays in epic-play-hub's `covers` (monsters). Its entries 1–5 are epic-play-hub 8–12 with content kept; epic-play-hub keeps ids 1–7, 13, 14 and records `next_id = 15` so 8–12 are never reused; every reference to the moved entries now names 15.x (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 integration after all 13 epics were incepted in parallel: every whole-epic wait (`epic-<slug>` in an entry's `after`) is replaced by the entry that delivers it, each checked against the provider's description; the initiative breakdown now declares every epic an entry waits on (epic-platform for epic-petv, epic-battle, epic-play-hub, epic-seasons and epic-alerts; epic-pet-life for epic-battle, epic-play-hub and epic-alerts; epic-pot and epic-petv for epic-seasons and epic-play-hub; epic-battle for epic-seasons and epic-launch; epic-play-hub for epic-alerts), and epic-play-hub no longer waits on epic-social (only Death Match did) (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 overlaps settled so no two entries build the same thing: the Cosmetics ERC-1155 base with its per-id soulbound flag, Tombstone and badges is epic-pet-life 2.5, and epic-cosmetics-market extends it (catalogue 7.3, granted items 7.5, drop 7.6) without a second mechanism; Dice is epic-battle 6.7 and 6.11 only, and the Play hub card registry (9.1) sits in 6.11's Play tab shell; paid eggs and the Shield item with PetCore's one shield setter are epic-store-pass 5.6 only (epic-pet-life 2.2 adds the shield-until field and the care, battle and expedition counters; epic-battle 6.3 calls 5.6's setter); the season skin id is defined by epic-cosmetics-market 7.5, granted on Pass purchase by epic-store-pass 5.10's hook, its granter role given to SeasonPass in 7.13 and the per-season id set by epic-seasons 10.8 and 10.10 (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 the epic-store-pass Done when 4 "season skin" part is checked live once the skin id exists (epic-cosmetics-market 7.13, epic-seasons 10.9), because epic-store-pass is built before epic-cosmetics-market (owner recommended defaults, DECISIONS #31).
- Note: `owner-review.md` in this folder still names the pre-split epic-play-hub ids (9.8–9.12); read 9.8 → 15.1, 9.9 → 15.2, 9.10 → 15.3, 9.11 → 15.4, 9.12 → 15.5.
