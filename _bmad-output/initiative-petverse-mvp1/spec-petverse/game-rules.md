# Petverse game rules and numbers

Every rule value and economy number for release 1, in one place. All are **testnet defaults**: each is a timelocked
parameter (or `GameConfig` row for off-chain values), the owner may change any of them, and tests pin whichever value
is current. Changing one is an owner decision. Sources: PRD §4 and §4.10, owner numbers N1–N14 (DECISIONS #25, #26),
DECISIONS (through #57), EXPERIENCE.md (UX-set values).

## Core terms

| Term | Rule | Source |
|---|---|---|
| Level | 1 + floor(sqrt(lifetime points ÷ 100)). Never drops. A claim resets only pot points. Shown on the pet | §4.10, FR-16 |
| Similar level | Target within ±2 levels of the attacker (attacks, duels, 2v2 matchmaking) | §4.10 |
| Rank | Elo-style, starts 1,000; ±16 per duel at even odds; resets each season | §4.10 |
| Good care | Fed at least once in each 24-hour window | §4.10 |
| Adult | Teen at level 3, Adult at level 6 | §4.10 |
| Bot account | An account flagged by the anti-bot rules below | §4.10 |

## Life cycle

| Rule | Value | Source |
|---|---|---|
| Sleep | 3 days after the last feed | FR-8, #13 |
| Hungry window | Last 24h before sleep; timer turns orange and first alert fires at its start | EXPERIENCE OQ4 |
| Death | 7 days asleep (10 days after the last feed); at exactly the death time the pet is dead | FR-8, #13, AD-16 |
| Wake | Feed; no money cost; loses 10% of pot points per day asleep (day = floor(time asleep ÷ 24h) + 1; day 1 10% … day 7 70%); level, lifetime points and ETH earned before sleep stay; lost points are destroyed | FR-10, #18, #27, AD-16 |
| Asleep pet | Earns no points; no share of either pot until woken; can be robbed | FR-9, #15 |
| On death | NFT burned; points removed; unclaimed ETH back to the main pot; unpaid game Gold stays in the vault; Tombstone + free egg | FR-11, FR-12, FR-44 |
| New-pet protection | Cannot be attacked for its first 3 days | FR-13 |

## Battles and events

| Feature | Rule | Source |
|---|---|---|
| All battles | Automatic: stats + luck; player watches | FR-18 |
| Attack | Win steals ~5% of target's points; 1 per 30 min (Pass: 10 min) | FR-19, FR-43 |
| Shield after robbery | 30 minutes against other attackers | FR-22 |
| Revenge | Once per robbery, on the attacker, skips the cooldown | FR-21 |
| Duel (FR-23) | 5 ranked duels a day; winner +rank and 10% of loser's points; loser −rank | §4.10 |
| 2v2 (FR-24) | Team of 2 pets; winning team splits 10% of losing team's points evenly; 5 a day; matched by level ±2 | §4.10 |
| Death Match (FR-25) | Saturday 00:00 – Sunday 23:59 UTC; any adult pet; 3 lives; loss −1 life; 0 lives = death; leave safely any time; each win +1 Survivor streak; reward per win = 2 × (10% of the opponent's pot points) × min(streak, 5), awarded as new points, not taken from the opponent; lives refill 1 per 7 days of good care, max 3; Co-Pet needs both owners; max 20 fights per pet per weekend | §4.10, #9, #20, #52, #57 |
| Wager / dice (FR-26) | Players stake PETV; 5% of each pot burned | FR-26, FR-45 |
| Daily wheel (FR-48) | 1 free spin per rolling 24h from the last spin (not the UTC day). Prizes: 50% small points (20), 25% food, 15% medium points (100), 8% common cosmetic, 2% rare cosmetic | §4.10, #51 |
| Monsters (FR-50) | 3 fights a day; win = Gold + 20 points; monsters scale to pet level | §4.10 |
| Boss Raid (FR-53) | Up to 2 players vs the season boss; boss health shared across all raids in the season; points + Gold for damage; top raid teams get a cosmetic | FR-53 |
| Login streak (FR-49) | Days 1–6: 10 points each; day 7: free egg-shard; resets after a missed day | §4.10 |
| Reveal timeout | 10 minutes; then anyone can close the request as a no-op (stakes refunded, no points move) | N8, AD-6 |

## Social

| Feature | Rule | Source |
|---|---|---|
| Co-Pet | 2 owners; both care and play; same-day care = Together bonus; streak grows only if both show up; rewards 50/50; breeding and Death Match need both; max 3 per player | FR-28, FR-29 |
| Co-Pet leave / end | Either owner leaves or ends (same action). In order: settle; leaver's half of the pet's unclaimed ETH (and unpaid Gold) paid to the leaver; Co-Pet bucket closed; pet becomes the remaining owner's normal pet in that owner's bucket, other half still claimable; leaver gets memory badge. No sale, buy-out or money between players | FR-30, #14, #29, AD-17 |
| Co-Pet invite | Expires after 7 days | EXPERIENCE OQ15 |
| Guilds (FR-31) | Up to 10 members; one leader who invites and removes; one guild per player | §4.10 |
| Guild War (FR-32) | Weekly, Sunday; guilds paired by average level; best of 5 2v2 matches; winning guild shares a Gold prize through its own weekly `guildWar` stream, paid from the Gold reserve, counting toward the daily cap; not from the season pool | §4.10, #49, AD-5, AD-24 |

## Growth

| Feature | Rule | Source |
|---|---|---|
| Stages | Egg → Baby → Teen → Adult → Elder → Mythic | FR-33 |
| Path (FR-34) | Set at Teen by the action done most in life: battles → Warrior, care → Guardian, expeditions → Explorer | §4.10 |
| Element (FR-35) | Fixed at hatch: fire, water, leaf, spark, stone. Shown as a badge and an accent look (aura or emblem) over the coat; does not set the coat colour. +10% battle power when it beats the target's element: fire > leaf > stone > spark > water > fire | §4.10, #37, #55 |
| Elder / Mythic (FR-36) | Elder: level 15 + 1 Elder item. Mythic: level 30 + 1 Mythic item + season trophy (top 10% finish) | §4.10 |
| Breeding (FR-37) | 2 adults; own pets or Co-Pets only; max 5 breeds per pet; cost 1×, 2×, 4×, 8×, 16× the base egg price ($2.99); both parents need good care; 1 in 500 eggs shiny | §4.10, EXPERIENCE OQ13 |
| Expeditions (FR-38) | 1h / 8h / 24h. Safe: 10 / 40 / 100 points. Bold: stake PETV, 3× reward, 30% chance to fail and burn the stake. No battles while away | §4.10 |
| Species | 10; coat = random palette of the species (`src/lib/pets.ts`); Teen, Elder, Mythic, element and shiny looks are added forms, species shape unchanged; every cosmetic fits all 10 at every stage (babies and armless species use a hand anchor) | FR-6, FR-39, #37, #38 |

## Cosmetics

| Rule | Value | Source |
|---|---|---|
| Slots | hat, face, neck, back, hand | FR-39 |
| Catalogue | 35 items today | FR-39 |
| Rarity split | 60% common, 25% rare, 12% epic, 3% legendary | FR-40 |
| Transfer | Rare+ are NFTs, tradeable. Commons, Tombstones, memory badges, trophies, egg-shards are soulbound | FR-40, AD-22 |

## Pot

| Rule | Value | Source |
|---|---|---|
| Split of new pot ETH | 85% main pot, 15% small pot | FR-15 |
| Main pot | Owner share = owner's effective points ÷ all effective points; split across the owner's pets by points; asleep pets excluded | FR-15, FR-52, #15, #17 |
| Effective points | eff(p) = p for p ≤ K, else floor(sqrt(p × K)); applied per owner bucket; a Co-Pet is its own bucket | FR-52, AD-4 |
| K (N2) | 10,000 points | N2 |
| Small pot | Equal shares to the bottom half by points of pets awake at the snapshot block (snapshot time < sleep time), older than 7 days, not flagged; asleep and dead pets are dropped before the bottom-half cut | FR-51, §4.10, #28, AD-5 |
| Small-pot epoch (N3) | 1 week, ends Sunday 00:00 UTC | N3 |
| Claim | Pays ETH owed; pot points → 0; level and lifetime points stay; Co-Pet split 50/50 | FR-16 |
| Pot inflow | PETV trade tax, store sales, Season Pass sales, market fees | FR-17 |
| Root claim delay (N6) | 1 hour (mainnet hint 24h); Safe can cancel inside it | N6 |
| Unclaimed epoch rollover (N7) | After 4 epochs | N7 |

## Money

| Item | Rule | Source |
|---|---|---|
| PETV supply (N13) | 1B fixed: curve 40%, liquidity 20%, faucet 15%, Gold reserve 15%, team 10%; no mint after deploy | FR-41, N13 |
| Testnet curve | Our Pons-like curve graduates at 4.2 test ETH into our own Uniswap v2-style pool on 46630 | FR-41, #22 |
| Trade tax | 5% on curve and pool, taken in ETH: 2% ETH pot (straight to the pot), 1% burn (PETV bought and burned), 1% liquidity, 1% team | §4.10, #54 |
| Store prices (FR-42) | Food $1; shield (8h) $1; egg $2.99 (common) to $9.99 (rare odds); Elder item $3; Mythic item $5; cosmetics $1–$20 | §4.10 |
| Store income | Burn share by stage (below); of the rest: 50% ETH pot, 50% team | §4.10 |
| Store burn stage | 70% of spending burned; 50% once market cap passes $1M; 30% once it passes $10M (30-minute average) | FR-45 |
| Season Pass (FR-43) | $7.99 per season; +25% points; 10-min attack cooldown (vs 30); 20 free gas actions a day (vs 10); reward track (final node shows the skin); season skin granted at purchase; no auto-renew | FR-43, §4.10, #50 |
| Season Pass income | 30% ETH pot, 20% season pool (PETV), 50% team; no store burn | §4.10, #48 |
| Market fee (FR-46) | 5%: half burned, half to the ETH pot | §4.10 |
| Other burns | 5% of each wager and dice pot; full stake of a failed Bold expedition | FR-45 |
| Gold (FR-44) | Stake PETV → Gold shares; swap back costs 2%, kept in the vault (its only growth in release 1; no spending share); living pet earns 10 Gold a day; game Gold paid from the funded reserve, never minted | §4.10, #16, #53 |
| Gold daily cap (N14) | 0.1% of the reserve per day (~150k PETV); over-cap credit waits for a later day | #26, AD-24 |
| Rate-move bound (N10) | Signed USD quote (`petvPerUsd` and `weiPerUsd`) may move at most 5% per hour each (mainnet hint 2%) | N10, #46 |
| Sponsored actions | 10 per player per UTC day; 20 with Pass | #19 |
| Faucet at sign-up (N11) | 0.01 test ETH + 3,120 PETV (fixed; $10 at the mock rate, UI shows the live dollar value) | N11, #47 |
| Faucet daily (N12) | 0.002 test ETH + 624 PETV (fixed; $2 at the mock rate), once per UTC day | N12, #47 |
| Mock rate | $1 = 312 PETV in mocks only; real amounts follow the live price | EXPERIENCE |

## Seasons

| Rule | Value | Source |
|---|---|---|
| Season length | 12 weeks; ranks reset each season | FR-47 |
| Season pool / trophy epoch (N4) | 1 season | N4 |
| Guild War prize epoch (N5) | 1 week (Sunday) | N5 |
| Season bonus | Top players paid in PETV from the season pool, not the ETH pot | FR-47, #48 |

## Anti-bot and admin

| Rule | Value | Source |
|---|---|---|
| Free starter egg | One per verified login (email or Google) or per wallet with history; not per new empty wallet | §4.10 |
| Small-pot age | Only pets awake at the snapshot and older than 7 days count | §4.10, #28 |
| Flags | Many accounts from one device or funding wallet, or perfectly regular timing, flag an account for review; flagged accounts are left out of epoch payouts (small pot, season pool, trophies, Guild War) and gas sponsorship until a reviewer clears them; main-pot claims are delayed by a payout hold. Confirmed bot pet (Safe-confirmed): unclaimed pot ETH recycled to the main pot (as for a buried pet), points zeroed | §4.10, AD-15, #40, #56 |
| Payout hold (N9) | Expires after 72 hours; RISK cannot re-hold the same pet within 72h, so every back-to-back renewal needs the Safe (no count limit); the Safe renews or clears directly, not through the timelock | N9, #41 |
| Timelock delay (N1) | 1 hour on testnet (mainnet hint 48h) | N1 |
| Safe | Testnet 2-of-3 team signers; proposes and cancels timelocked changes, can pause; Safe Protocol Kit / CLI if the web UI lacks 46630 | #30, AD-3 |

## Alerts

| Rule | Value | Source |
|---|---|---|
| Channels | In app, web push, Telegram; no email | FR-20, EXPERIENCE |
| Kinds | All channels: robbed, hungry, asleep, close to passing away (24h before death), passed away. In app only: claim ready, wheel ready, streak at risk, Co-Pet partner needs to agree / left | #42 |
| One at a time | In-app pill: newest unread. Push and Telegram: most urgent due (close to death > robbed > asleep > hungry > Co-Pet > passed away > partner left > claim ready > wheel / streak) | #43 |
| Push cap | Max 3 a day (close to death counts); per-type opt-outs | EXPERIENCE OQ6, #42 |
| Quiet hours | No pushes 22:00–08:00 local, except close-to-death | EXPERIENCE OQ14 |
| Push permission | Asked after the first feed | EXPERIENCE OQ6 |

## Counter-metric limits

| Warning sign | Problem when |
|---|---|
| Bots win the pot | Bot accounts take more than 10% of pot payouts |
| Whales take the pot | Top 5% of pets take more than 50% of payouts |
| New players quit after a robbery | More than 40% of robbed new players leave in week 1 |
| Deaths drive players away | Fewer than 30% of owners whose pet died hatch again |

## Mainnet notes (not release 1)

- Mainnet uses real Pons: creator tax per launch up to the factory cap `maxCreatorTaxBps` (unknown; use the highest
  allowed), tax continues after graduation via a Uniswap v4 hook, graduation at 4.2 ETH, tax goes to our splitter.
  Active factory `0xA5aA…1feB` has code on 4663, none on 46630 (checked 2026-10-14).
- Mainnet hints: timelock 48h (N1), root delay 24h (N6), rate bound 2%/h (N10); all come back to the owner before mainnet.
