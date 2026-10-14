---
type: epic
title: "Store, Season Pass, faucet and sponsored actions"
parent: initiative-petverse-mvp1
covers: [CAP-2, CAP-23]
after: []
assignee: ""
risk: high
---

# Store, Season Pass, faucet and sponsored actions

## Description

A player plays free up to a daily cap, keeps playing with test funds past it, and buys items and a Season Pass priced
in dollars and paid in PETV. This epic builds the Gas Manager custom-rules webhook with the per-DID daily cap (10, 20
with the Pass), the unsponsored fallback, the voucher-gated Faucet, the price-source port with the signed testnet
quote, PotConverter, the Store with its item registry (food, eggs, shield first), and SeasonPass with season
boundaries and its perks. Capabilities CAP-2 and CAP-23 in the spec.

## Outcome

Players never hit a dead end for lack of gas or tokens, and store and Pass sales visibly fill the ETH pot.

## Done when

1. On 46630, the first 10 game actions of a UTC day are sponsored (20 with an active Pass), the 11th is refused by the
   webhook (fail closed) and goes through paid from test ETH with the fee shown in dollars first.
2. The faucet pays 0.01 test ETH + 3,120 PETV at sign-up and 0.002 test ETH + 624 PETV once per UTC day, only against
   a voucher per Privy DID.
3. Every store price is set in USD cents and paid in PETV at the signed rate; a quote that moves more than 5% in an hour
   is refused; burn stage is 70% at testnet start; the pot share reaches PotFunder through PotConverter.
4. A Season Pass bought for $7.99 gives +25% points, the 20-action cap and a season skin, with no auto-renew;
   `seasonOf` and `isActive` answer from on-chain season boundaries.
5. Shop › Store (food, eggs, shield; cosmetics and try-on come with epic-cosmetics-market) and Shop › Pass, the Wallet-sheet faucet, and the out-of-free-actions and
   not-enough-PETV states work as in the mocks and spine.

## Boundaries

Paying and being paid for play: sponsorship cap, faucet, price source, PotConverter, Store, SeasonPass. Not the items
other epics register later in the Store (evolution items in epic-growth, cosmetics in epic-cosmetics-market); not the
10-minute attack cooldown itself (epic-battle reads `isActive`); not the season leaderboard (epic-seasons); not
refusing flagged accounts (epic-anti-bot adds it to the webhook and faucet). The season skin item is defined by epic-cosmetics-market and only granted here. The Season Pass reward track's contents
come with epic-seasons.

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-2, CAP-23
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Money, Seasons
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-5 (season boundaries in SeasonPass), AD-7, AD-9 (Faucet), AD-10, AD-11, AD-15 (vouchers), AD-18
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Shop, Wallet sheet, Faucet), State Patterns, UJ-5
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mock .working/key-shop-claim.html
- decisions — docs/DECISIONS.md, #7, #8, #19, #25 (N10, N11, N12)

## Notes

- Waits on epic-petv because: PETV, the faucet allocation and the burn path.
- Waits on epic-pot because: PotFunder for PotConverter output.
- Waits on epic-pet-life because: the voucher signer, and the first items the store sells (food, eggs, shield set on PetCore).
- Waits on epic-platform because: the answer of spike 2 (Gas Manager custom-rules webhook on 46630).
- Decision: 2026-10-14 the sponsorship cap and faucet sit with the store and Pass, not the token, because the cap reads `SeasonPass.isActive` (recommended default, DECISIONS #31).
- Open question: season 1 genesis date (initiative Notes). Entry 13 carries it as its `unknown`; assumed: the Sunday 00:00 UTC on which testnet opens, matching the weekly epoch boundary.
- Decision: 2026-10-14 inception: 14 entries in `tickets.toml`, two above the typical 8–12; kept as one epic because it is one owner and one money path (quote → Store / SeasonPass → PotConverter), and the faucet and gas cap ship with it (the cap reads the Pass). A split into "store and pass" and "faucet and sponsored actions" was considered and not taken (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 tracer bullet = entry 1: on a Hardhat local node a logged-in player buys Food for $1 in Shop › Store at a server-signed rate; the Store burns 70%, queues the pot share in PotConverter, pays the team share and credits a meal in PetCore. What someone sees running: the dollar price, the buy, the meal count going up. The gas webhook is not on this path; it is the next entry (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain story second = entry 2, the gas webhook cap, which rests on spike 1.2's answer and is checked against the live policy on a Vercel preview (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 lanes that never touch the same code: A contracts 1 → 6 (Store, PetCore entry points) and 1 → 9 (PotConverter, keeper job); B quote route 1 → 8; C gas webhook and paid fallback 2 → 3; D Faucet 4 → 5; E SeasonPass 10, then the PetCore multiplier 11 (after 6, the other PetCore edit); F Shop screens 1 → 7 → 12. Only entry 2 edits `prisma/schema.prisma`; each contract has its own Ignition module, composed by entry 13; the generated chain module is regenerated, never hand-edited. Entries 1, 6 and 11 edit PetCore only after epic-pet-life 2.6, epic-pot 3.3 and epic-petv 4.6, the last PetCore edits before those epics deploy (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (entry 14) is included; no closing end-to-end suite, since the spec has no test plan and entry 13 checks the Done when live (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 entry `notes` carry the hitl steps and the outside check for high-risk entries, following epic-platform's convention. hitl: entry 1 (dev quote key), entry 2 (webhook on the policy, signing key in Vercel), entry 13 (deploy OKs, Safe signatures, faucet funding, keys in Vercel and Render, policy allow-list) (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 `IPriceSource` carries `weiPerUsd` beside `petvPerUsd` and `burnStageBps`, and the signed quote carries it too, so PotConverter's minimum-out comes from the price source (AD-11); both rates share the 5%-per-hour bound (assumption, DECISIONS #31; see Source conflict).
- Decision: 2026-10-14 faucet calls are sponsored without counting toward the daily cap, so a player with 0 free actions and no test ETH can still get test funds (Outcome: no dead end) (assumption, DECISIONS #31).
- Decision: 2026-10-14 the sign-up drip is claimed automatically right after the first login, with a retry button in the Wallet sheet; the first daily drip is available from the next UTC day (assumption, DECISIONS #31).
- Decision: 2026-10-14 the Faucet pays the fixed amounts of N11 / N12 (3,120 and 624 PETV); the Wallet sheet button shows the drip's live dollar value instead of a fixed "$2" (assumption, DECISIONS #31; see Source conflict).
- Decision: 2026-10-14 the sponsorship count rises when the webhook approves, not when the operation lands; an unknown sender is refused (assumption, DECISIONS #31).
- Decision: 2026-10-14 epic-pet-life provides only the food balance (2.4), so entry 6 adds PetCore's paid-egg mint with a tier and the shield-until setter, and entry 11 adds the Pass multiplier (assumption, DECISIONS #31; see Source conflict).
- Decision: 2026-10-14 a Season Pass covers only the current season, costs $7.99 whatever week it is bought, one per address per season, and cannot be bought before season 1's genesis (assumption, DECISIONS #31).
- Decision: 2026-10-14 the season skin is a soulbound Cosmetics id per season, a SeasonPass parameter minted on buy through a MINTER grant on epic-pet-life's Cosmetics base (2.5); its look comes with epic-cosmetics-market (assumption, DECISIONS #31; see Source conflict).
- Decision: 2026-10-14 the +25% applies to point awards only (not points moved between pets, not burns), rounded down; for a Co-Pet it applies when the first owner holds the Pass (assumption, DECISIONS #31; see Open question).
- Decision: 2026-10-14 the 20% season-pool share of Pass income is sent as PETV to epic-pot's `seasonPool` stream in the same transaction (AD-11) (assumption, DECISIONS #31; see Open question).
- Decision: 2026-10-14 PotConverter pays the 5% trade tax like any trader (no exemption, so no change to epic-petv's venues); 2% of it returns to the pot anyway (assumption, DECISIONS #31).
- Decision: 2026-10-14 the burn stage's market cap = PETV/USD × 1B total supply, averaged over 30 minutes by the quote service; the $1M and $10M thresholds live in GameConfig and the contract accepts only 7000 / 5000 / 3000 (AD-10) (assumption, DECISIONS #31).
- Decision: 2026-10-14 assumed numbers, each a timelocked parameter or GameConfig row the owner may change (assumption, DECISIONS #31): quote expiry 5 minutes; a market move past 5% in an hour is signed at the bound; the PotConverter keeper runs every 6 hours or when the queue passes $20 at the quote rate, with a 3% slippage allowance on top of the 5% tax; first Faucet top-up 1 test ETH (100 sign-ups); prices in USD cents from game-rules: Food 100, Shield (8h) 100, Egg 299, Lucky egg 999, Pass 799; store split after the burn share 50% pot / 50% team; Pass split 30% pot / 20% season pool / 50% team.
- Open question: what "rare odds" means for the $9.99 Lucky egg (which outcome is rarer and by how much). Assumed: the Lucky egg triples the weight of the rarest coat palettes, a timelocked parameter that entry 6 adds to the hatch reveal from epic-pet-life 2.1; an owner decision.
- Decision: 2026-10-14 Season Pass income has no burn: game-rules Money gives it its own 30/20/50 split, so the store burn stage applies only to Store sales (assumption, DECISIONS #31; see Open question).
- Open question: does the Pass count as "spending" under the store burn stage (game-rules Money, "70% of spending burned")? Assumed: no.
- Decision: 2026-10-14 set check applied: entry 1 cites 2.4 directly; entry 2 waits on 1 (both add keys to platform 1.7's env loader); entry 7 waits on 3 (both add to the top bar); entry 6 sets the Lucky egg's reveal weights; entry 10 registers the skin id as soulbound; entry 13 names the Cosmetics MINTER grant, points the webhook at the live SeasonPass and Faucet, and checks the 11th action refused before the Pass (recommended default, DECISIONS #31).
- Open question: does `EpochDistributor`'s `seasonPool` stream (epic-pot 3.4) take PETV, or only ETH? Entry 10 assumes PETV; if only ETH, the season-pool share goes through PotConverter and AD-11's "same transaction" wording changes.
- Open question: for a Co-Pet, does the Pass bonus need the first owner, either owner, or both to hold the Pass? Assumed: the first owner.
- Resolved: 2026-10-14 whole-epic waits on epic-store-pass are pinned at integration: 6.2 → 5.10; 6.3 → 5.6 and 5.10; 6.11 → 5.7; 7.1 → 5.6 and 5.13; epic-death-match-raid 15.4 (was 9.11) → 5.10; 10.1 and 10.4 → 5.10; 10.6 → 5.12; 13.7 → 5.2 and 5.4.
- Source conflict: AD-10 — the quote signer "signs only (petvPerUsd, burnStageBps, expiry, nonce)" vs AD-11, where PotConverter takes "a minimum-out from IPriceSource", which needs an ETH rate the signed struct does not carry. Plan adds `weiPerUsd` (Decision above); offer the correction to `bmad-architecture`.
- Source conflict: EXPERIENCE Information Architecture and State Patterns — the faucet is "$10 at sign-up and $2 a day" with a "Get today's $2" button at the live price vs AD-9 / N11 / N12 and Done when 2, which fix the PETV amounts (3,120 and 624 PETV are $10 and $2 only at the mock rate $1 = 312 PETV). Plan pays the fixed amounts and labels the button with the live dollar value.
- Source conflict: initiative `tickets.toml` epic 5 `after` — epic-pet-life provides "the items the store sells first (food, eggs, shield on PetCore)" vs epic-pet-life's breakdown, which builds only the food balance (2.4); paid eggs and the shield-until timestamp are added here (entry 6).
- Source conflict: Boundaries — "The season skin item is defined by epic-cosmetics-market and only granted here" vs the initiative's build order (epic-cosmetics-market, epic 7, builds after this epic, epic 5). Plan reserves the soulbound skin id here; epic-cosmetics-market supplies its look.
- Decision: 2026-10-14 paid eggs, the Lucky egg and the Shield item, with PetCore's one extend-only shield setter, are built only by entry 6; epic-pet-life 2.2 adds just the shield-until field and view, and epic-battle 6.3 calls entry 6's setter. Settles the Source conflict on the initiative's epic 5 `after`, whose `needs` now says so (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 season skin: entry 10 builds only SeasonPass's grant-on-buy hook with a timelocked per-season skin id left unset until epic-cosmetics-market 7.5 defines the soulbound skin id and its granter role (granted to SeasonPass in 7.13) and epic-seasons sets the id each season (10.8, 10.10); entry 13 grants no Cosmetics role. The skin part of Done when 4 is checked live once 7.13 and 10.9 are done. Supersedes the earlier skin Decision and settles the skin Source conflict (DECISIONS #50; owner recommended defaults, DECISIONS #31).
