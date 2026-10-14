---
title: Petverse release 1 — owner review pack
created: 2026-10-14
status: for owner review
---

# Owner review pack

> **Start here**
> - **97 numbers** to review (part 1). 16 settled today, see "Settled today".
> - **45 questions** left (part 2). 14 settled today.
> - **139 human tasks** (part 3): accounts, secrets, test ETH, deploy OKs, Safe signs, checks.
> - **Do now (platform tracer 1.1):** 1) create Privy app (email + Google + external wallet) · 2) create Alchemy app + one Gas Manager policy · 3) get test ETH for the deployer and put the key + secrets into Hardhat keystore and local env (never in chat).
> - **Death Match + Boss Raid is now its own epic (15)** (death-match-raid, built after play-hub). Old play-hub ids map: 9.8 → 15.1, 9.9 → 15.2, 9.10 → 15.3, 9.11 → 15.4, 9.12 → 15.5; deploy 15.6, refactor sweep 15.7.

Three lists: numbers I guessed, questions still open, things only you can do.
Already decided items (DECISIONS #1–#57, owner numbers N1–N14, game-rules values) are left out.
Ticket refs: `3.7` = epic 3, entry 7. Epics: 1 platform · 2 pet-life · 3 pot · 4 petv · 5 store-pass · 6 battle ·
7 cosmetics-market · 8 social · 9 play-hub · 15 death-match-raid · 10 seasons · 11 growth · 12 alerts · 13 anti-bot · 14 launch.

Fast path: reply "accept all numbers + all recommended answers" and the build goes on with them as testnet defaults.
Every number is a timelocked parameter or a GameConfig row, so it can change later.

---

## Settled today (#37–#57)

No need to review these. Decision number in brackets.

**Numbers**
- Trade tax: taken in ETH; 2% pot share goes to PotFunder as ETH; 1% burn by buying PETV (#54)
- Gold vault: grows only from the 2% swap-back fee in release 1 (#53)
- Pass 20% season pool: PETV; seasonPool stream holds and pays PETV, no Gold (#48)
- Guild War Gold: own weekly guildWar stream, under the daily Gold cap (#49)
- Element edge: +10% battle power if your element beats the target's; fire > leaf > stone > spark > water > fire (#55)
- Element does not set coat colour; badge + accent look only (#37)
- Hand items: babies and winged pets get a hand anchor (#38)
- Death Match reward: 2 × (10% of opponent's pot points) × min(streak, 5), as new points (#52)
- Death Match cap: 20 fights per pet per weekend (#57)
- Wheel reset: rolling 24h from last spin; caps and faucet stay on UTC day (#51)
- Hold: 72h, ends by itself; RISK can't re-hold within 72h; Safe renews or clears directly, no limit (#41)
- Alerts: close to death 24h before; skips quiet hours but counts toward 3-a-day cap (#42)
- In-app only alerts: claim ready, wheel ready, streak at risk, Co-Pet alerts (#42)
- Urgency order for push/Telegram: close to death > robbed > asleep > hungry > Co-Pet > passed away > partner left > claim > wheel/streak; pill shows newest (#43)
- Faucet pays fixed PETV; UI shows live $ value (#47)
- Season skin: soulbound per-season item given when Pass is bought; track node 12 only shows it (#50)

**Questions** (old numbers)
- Q7 Element edge in battle → yes, +10% (#55)
- Q9 Trade tax currency → ETH (#54)
- Q12 Spending feeds Gold vault → no (#53)
- Q15 Season pool in PETV → yes (#48)
- Q28 Death Match cap → 20 fights per pet per weekend (#57)
- Q30 Wheel reset → rolling 24h (#51)
- Q39 Partner alerts on push → no, in-app only (#42)
- Q40 Close to death bypasses cap → no (#42)
- Q41 Claim ready on push → no (#42)
- Q42 Close-to-death 24h before → yes (#42)
- Q44 Bot's unclaimed pot ETH → recycled into main pot; points zeroed (#56)
- Q45 Safe renews holds directly → yes (#41)
- Q50 Gas Manager balance → track webhook spend vs your budget in GameConfig (#45)
- Q59 AD-5 / AD-10 content → settled (#46, #48, #49); architecture doc text still to update

---

## 1. Numbers I assumed

### Care / pet life
| Number | Value | Epic | Why |
|---|---|---|---|
| Points per feed | not set (mock copy shows +20) | pet-life 2.4 | Spec has no value; see Q4 |
| Starter meals at hatch | not set (mock copy shows 2) | pet-life 2.4 | Spec has no value; see Q4 |
| Free starter cosmetic | 1 common hat, once per player (not again after a death) | pet-life | Onboarding "dress up" step; hats fit babies |
| Element at hatch | random 1 of 5, not tied to species | pet-life | Spec says "element fixed at hatch" |
| Gold earned per day | 10 Gold, asleep pets included | petv 4.6 | Rules say "living pet"; asleep is living |
| Lucky egg ($9.99) | 3× weight on the rarest coat palettes | store-pass 5.6 | Rules say "rare odds" only |

### Pot
| Number | Value | Epic | Why |
|---|---|---|---|
| Small pot "bottom half" | floor(n ÷ 2) pets; ties go to lower petId | pot 3.5 | Rebuildable from public data |
| Small pot snapshot | last block before Sunday 00:00 UTC | pot 3.5 | Matches weekly epoch |
| "Older than 7 days" | counted from hatch to snapshot | pot 3.5 | Simple, public |
| Leftover dust / empty epoch | rolls into next epoch | pot 3.5 | No ETH lost |

### PETV / Gold
| Number | Value | Epic | Why |
|---|---|---|---|
| PETV faucet 15% | goes to timelock, then to Faucet | petv 4.9 | Faucet is built later |
| PETV team 10% + team tax | to the testnet Safe | petv 4.9 | No single key |

### Store / Season Pass
| Number | Value | Epic | Why |
|---|---|---|---|
| Price quote life | 5 min | store-pass 5.8 | Short = safe |
| PotConverter keeper | every 6h or when queue > $20 | store-pass 5.9 | Fewer swaps |
| PotConverter slippage | 3% on top of 5% tax | store-pass 5.9 | Thin testnet pool |
| PotConverter tax | pays 5% like anyone (no exemption) | store-pass 5.9 | No venue change; 2% comes back to pot |
| Faucet first top-up | 1 test ETH (~100 sign-ups) | store-pass 5.13 | 0.01 ETH each (N11) |
| Faucet calls | do not use the 10 free actions | store-pass 5.4 | No dead end for new players |
| Free-action count | +1 when webhook approves | store-pass 5.2 | Fail closed |
| Season Pass | $7.99 any week, 1 per address per season, not before season 1 | store-pass 5.10 | Simple |
| Pass +25% | point awards only, rounded down | store-pass 5.11 | Not on steals or burns |
| Pass on a Co-Pet | counts if first owner has Pass | store-pass 5.11 | See Q16 |
| Pass burn | none (only 30/20/50 split) | store-pass 5.10 | Rules give Pass its own split |
| Burn stage market cap | PETV/USD × 1B, 30-min average | store-pass 5.8 | Rules name $1M / $10M steps |

### Battle
| Number | Value | Epic | Why |
|---|---|---|---|
| Power | 100 + 10 × level | battle 6.1 | Simple, level matters |
| Power when hungry / asleep | ×0.85 / ×0.5 | battle 6.1 | Care matters |
| Species / Pass edge | none | battle 6.1 | Simple |
| Element edge (settled #55) | +10% power if your element beats the target's; fire > leaf > stone > spark > water > fire | battle 6.1 | Used in A ÷ (A + D); not for review |
| Win chance | A ÷ (A + D), clamped 10–90% | battle 6.1 | Same level = 50% |
| 2v2 power | sum of both pets | battle 6.5 | Simple |
| Steal on win | 5% (500 bps) of target's points | battle 6.1 | Rules say ~5% |
| Lost attack | costs attacker nothing | battle 6.1 | Mock |
| Rank change | 16 + clamp((loser − winner) ÷ 25, ±15) → 1 to 31, never below 0 | battle 6.2 | ±16 at even odds |
| What moves rank | ranked duels only | battle 6.2 | Not 2v2 or wagers |
| Wager / dice tiers | 312 / 624 / 1,560 / 3,120 PETV (~$1/$2/$5/$10) | battle 6.6 | Faucet rate 312 = $1 |
| Wager payout | winner gets 95%, 5% burned, no other fee | battle 6.6 | Rules burn 5% |
| Dice | 50/50 between two players | battle 6.7 | Simple |
| Attack cooldown | per pet, starts at commit, win or lose | battle 6.3 | Stops spam |
| Revenge | skips cooldown + shield, once, expires 24h | battle 6.3 | Rules say once per robbery |
| Wagers vs 5 duels/day | do not count | battle 6.6 | Separate mode |

### Cosmetics / market
| Number | Value | Epic | Why |
|---|---|---|---|
| Catalogue | 35 items: 14 hats, 5 faces, 6 necks, 6 backs, 4 hands | cosmetics 7.3 | Items in `src/lib/cosmetics.ts` |
| Rarity count | 21 common / 9 rare / 4 epic / 1 legendary | cosmetics 7.3 | 60/25/12/3% of 35 |
| Mock rarities kept | common: frog hat, star glasses, strawberry hat · rare: bunny ears, propeller cap, heart glasses · epic: chef hat, balloon · legendary: crown | cosmetics 7.3 | From mocks; rest assigned in 7.3 for your review |
| Price bands | common $1–2 · rare $3–4 · epic $8–10 · legendary $20 | cosmetics 7.3 | Inside $1–$20 rule |
| Named prices | frog hat $1, star glasses $1, strawberry hat $2, bunny ears $3, propeller cap $4, heart glasses $3, chef hat $8, balloon $10, crown $20 | cosmetics 7.3 | From mocks; others take band's low value |
| Drop odds | 60/25/12/3% (6000/2500/1200/300 bps), then any item of that rarity | cosmetics 7.6 | Rules |
| Market fee | 5% of price: half burned (rounded down), rest to pot | cosmetics 7.4 | Rules |
| Market listing | seller sets PETV price; no expiry, no min/max; cancel any time | cosmetics 7.4 | Simple |
| Season skin | a per-season coat palette | cosmetics 7.11 | See Q20 |

### Play hub
| Number | Value | Epic | Why |
|---|---|---|---|
| Monster fights | 3 per pet per UTC day | play-hub 9.5 | Rules |
| Monster strength | pet's level, 90% of average power (~60% win) | play-hub 9.5 | Feels fair |
| Monster win | 20 points + 10 Gold; loss costs nothing | play-hub 9.5 | Gold under daily cap |
| Bold expedition reward | 3× Safe points (30 / 120 / 300), stake back on success | play-hub 9.6 | Rules say 3× |
| Bold stake | 100–5,000 PETV | play-hub 9.6 | Not in spec |
| Expedition | 1 trip at a time, no recall; away pet can still be attacked | play-hub 9.6 | Trip is not a free shield |
| Death Match runs | 1 per pet per weekend (max 20 fights, #57) | death-match-raid 15.1 | Not in spec |
| Life refill | 1 life per 7 good-care windows in a row, max 3 | play-hub 9.2 | Rules "1 per 7 days" |
| Boss health | 5,000,000 per season | death-match-raid 15.4 | Not in spec |
| Raids | 1 per pet per UTC day; teams of 1–2 | death-match-raid 15.4 | Not in spec |
| Raid rewards | 1 point per 10 dmg, 1 Gold per 100 dmg | death-match-raid 15.4 | Not in spec |
| Raid top prize | top 10 teams: 1 epic cosmetic each | death-match-raid 15.5 | Rules say "top teams" |
| Login streak | per player per UTC day | play-hub 9.4 | Simple |

### Co-Pet / guild
| Number | Value | Epic | Why |
|---|---|---|---|
| Together bonus | +10% points rest of UTC day once both fed; adds to Pass +25% | social 8.4 | Not in spec |
| Shared streak | display only, pays nothing | social 8.4 | See Q24 |
| Co-Pet egg | free, voucher-gated | social 8.1 | See Q23 |
| Two-owner approval | expires 24h | social 8.3 | Not in spec |
| Guild name | 3–24 chars, unique | social 8.6 | Not in spec |
| Guild invite link | 7 days | social 8.6 | Same as Co-Pet invite |
| Guild average level | mean of each member's best living pet | social 8.6 | For pairing |
| Guild War min size | 4 members with a living pet | social 8.9 | Need 2v2 lineups |
| Guild War schedule | rosters freeze Sun 00:00 UTC; 5 matches at 12, 14, 16, 18, 20 UTC; lineups lock 10 min before | social 8.9 | Not in spec |
| Guild War play | each member max 2 matches; first to 3 wins; no points move | social 8.9 | See Q25 |
| Guild War prize | 5,000 Gold per winning guild, split equally | social 8.10 | Mock shows 4,800 |
| Guild War weekly budget | 50,000 Gold (10 winning guilds) | social 8.10 | Counts toward daily cap |

### Growth
| Number | Value | Epic | Why |
|---|---|---|---|
| Breeding cooldown | 24h per parent | growth 11.2 | Not in spec |
| Breeding cost | $2.99 × 2^(higher parent's breed count) | growth 11.2 | Rules 1×,2×,4×… |
| Inheritance | species and element: 45% parent A / 45% parent B / 10% any | growth 11.2 | See Q38 |
| Shiny | seed mod 500 = 0 (1 in 500) | growth 11.2 | Rules |
| Breeding parents | awake, level 6+, fed this care window | growth 11.2 | "Good care" |
| Elder / Mythic effect | look + badge only, no stats | growth 11.3 | See Q35 |
| Path tie-break | Guardian > Warrior > Explorer | growth 11.1 | Gentle default |
| Mythic trophy | any season trophy the caller holds, not used up | growth 11.3 | See Q37 |

### Seasons
| Number | Value | Epic | Why |
|---|---|---|---|
| Season 1 start | Sun 2027-01-03 00:00 UTC (ends 2027-03-28), or first Sunday after testnet opens if later | seasons 10.10 | Lines up with weekly pot and Guild War |
| Leaderboard order | season Elo rank; ties: who got there first, then lower petId | seasons 10.1 | Rank resets each season |
| Trophy "top 10%" | ceil(10% of pets with ≥1 ranked duel) | seasons 10.3 | Rules |
| Season-pool bonus | top 1% of ranked pets (min 10, max 100), linear by place | seasons 10.2 | See Q32 |
| Reward track | 12 weekly nodes; 1–11 alternate 50 points / common cosmetic; 12 shows skin | seasons 10.4 | See Q33 |

### Anti-bot
| Number | Value | Epic | Why |
|---|---|---|---|
| Device flag | 3+ accounts on one device id in 30 days | anti-bot 13.1 | Not in spec |
| Funding flag | 3+ accounts first funded by one wallet in 30 days (faucet, team, Safe, curve, pool ignored) | anti-bot 13.5 | Not in spec |
| Timing flag | 30+ actions in 24h with gap variation (CV) < 0.1 | anti-bot 13.4 | Not in spec |
| IP address | not a flag alone | anti-bot 13.1 | Shared Wi-Fi |
| Reviewers | you + 2 Safe teammates; review within 48h | anti-bot 13.9 | Close inside one 72h hold |
| Flag scope | whole account, all its pets incl. Co-Pets and new pets | anti-bot 13.6 | See Q46 |
| Metrics day | UTC day, job after 00:30 UTC | anti-bot 13.11 | Counter-metrics |
| Churn window | robbed in first 7 days, no action days 8–14 | anti-bot 13.11 | Counter-metric 3 |
| Re-hatch window | hatch again within 7 days of a death | anti-bot 13.11 | Counter-metric 4 |

### Alerts
| Number | Value | Epic | Why |
|---|---|---|---|
| Daily cap of 3 | one alert counts once across push + Telegram, per local day | alerts 12.8 | UX rule |
| Telegram link token | 32 random bytes, single use, short-lived | alerts 12.2 | Safe |

---

## 2. Questions still open

My recommended answer after the arrow. Old numbers kept so "see Qn" refs still work.

**Big picture**
1. Accept all numbers in part 1 as testnet defaults? → Yes; tune with testnet data.
2. Confirm numbers before build starts, not just before go-live? → Yes; wrong rules mean contract rewrites.

**Care / pot / money**
3. ETH/USD source for testnet dollars (3.7)? → Free public spot price, fetched server-side, cached, display only.
4. Points per feed, starter meals, free meal refill, tutorial win points (2.4)? → +20 per feed, 2 starter meals, no refill (buy food), tutorial win +20.
5. "Wallet with history" for the free egg (2.7)? → 5+ txs and 30+ days old on Ethereum or Robinhood mainnet.
6. Element random at hatch (not per species)? Starter item a common hat? → Yes and yes.
8. Onboarding "your points = $X now": claimable ETH or slice of pot? → Claimable ETH (as planned).
10. Who graduates the live curve (4.2 test ETH), and test ETH for rehearsal? → Team buys to graduation before opening; budget ~10 test ETH total.
11. In-app PETV trade screen? → No in release 1.
13. Lucky egg "rare odds" = 3× weight on rarest coats? → Yes.
14. Does the Pass count as "spending" for the store burn? → No.
16. Co-Pet Pass bonus needs which owner? → First owner (as planned).

**Battle / cosmetics / play**
17. Matchmaker could rig pairings (knows secrets). → Oldest-first pairing, logged and checked at launch; stronger fix later.
18. Tutorial bot battle gets its own simple fight screen? → Yes.
19. Who builds the Calm motion switch? → Epic that builds Avatar menu (pot 3.10).
20. Season skin look? → Per-season coat palette.
21. Other random drop sources (mystery box)? → None in release 1.
22. What is an egg-shard for? → 4 shards = 1 free common egg.
23. Co-Pet egg free? → Yes.
24. Co-Pet shared streak pays anything? → No, display only.
25. Guild War matches move points? → No, Gold only.
26. Join another guild right after leaving? → Yes.
27. Split epics? → Keep social as one; split play-hub: Death Match + Boss Raid is now its own epic, death-match-raid (15).
29. Daily check-in uses one of the 10 free actions? → No, free like faucet.

**Seasons / growth**
31. Season 1 start date? → Sun 2027-01-03 00:00 UTC, or first Sunday after opening if later.
32. Season-pool bonus winners and split? → Top 1% (10–100 pets), linear by place.
33. Reward-track nodes 1–11? → Alternate 50 points / common cosmetic; node 12 shows skin.
34. SeasonPass needs setters for each new season's skin id. → Yes, store-pass adds timelocked setters.
35. Elder/Mythic change look only? → Yes.
36. Breeding numbers (24h cooldown, cost doubling, 45/45/10)? → Accept.
37. Season trophy tied to pet or owner? → Owner (any trophy held).
38. Bred species: parents only, or any of 10? → 45/45/10 (10% surprise).

**Alerts / anti-bot**
43. Who creates the GameConfig table? → store-pass 5.8; later epics cite it.
46. Co-Pet with one flagged owner: hold whole pet? → Yes on testnet.
47. Privacy wording for device id and funding links? → One plain line at sign-up + privacy page; you approve text.
48. Tell players why paused; let them ask for review? → Calm copy + "Ask for review" button.

**Launch / platform**
49. A module has no outcome view for "Check this result": fix where? → Back in the owning epic.
51. Final deploy fresh or upgraded? → Fresh, indexed into a new schema (no DROP needed).
52. "Open to players" means? → Share the production URL; no sign-up gate.
53. Add Playwright / UI test tool? → No for release 1.
54. Node 22.18+ on Render and Vercel? → Yes, pin Node 22.
55. CI host? → GitHub Actions once you run `gh auth login` and add the remote.
56. How tickets map to floor units? → One unit per ticket entry.
57. Gold final name? → Keep "Gold" (UX already says so); record in DECISIONS.
58. Fix cross-epic `after` gaps in the initiative `tickets.toml` (many `undeclared_after`)? → Yes, one cleanup pass.

---

## 3. Things only you can do

Build order. "2 signers" = 2 of the 3 Safe signers.

### Accounts and dashboards
- [ ] 1.1 Supabase: create `dev` schema
- [ ] 1.1 Privy: create app (email + Google + external wallet)
- [ ] 1.1 Alchemy: create app + one Gas Manager policy; allow-list tracer contract
- [ ] 1.2 Vercel preview of tracer branch; point policy custom rules at it
- [ ] 1.3 Three signers create the 2-of-3 Safe
- [ ] 1.6 GitHub remote: `gh auth login`, add remote (for CI)
- [ ] 1.8 Supabase: create `game` + `dev`, keep out of Data API, turn on RLS
- [ ] 1.9 Render: create account + worker service
- [ ] 1.10 Vercel: create project, link repo, add domains to Privy allowed origins
- [ ] 2.1 Gas Manager: allow-list PetCore
- [ ] 2.11 Gas Manager: allow-list Care, Cosmetics
- [ ] 5.2 Gas Manager: set webhook URL, approveOnFailure OFF
- [ ] 5.13 Gas Manager: allow-list Store, Faucet, SeasonPass; point production webhook at Vercel
- [ ] 12.2 Telegram: create bot with BotFather
- [ ] 12.11 Telegram: create team group, add bot
- [ ] 13.1 Name reviewer Privy DIDs (you + 2 teammates)

### Keys and secrets (never paste in chat)
- [ ] 1.1 Deployer key + all secrets into Hardhat keystore and local env
- [ ] 1.9 Render env secrets
- [ ] 1.10 Vercel env secrets
- [ ] 1.16 RANDOMNESS_SIGNER key into Render
- [ ] 2.1 Create VOUCHER_SIGNER key; local env + host
- [ ] 2.11 KEEPER + voucher keys into Render and Vercel
- [ ] 3.7 Key for ETH/USD source (if it needs one)
- [ ] 3.12 EPOCH_POSTER key into Render
- [ ] 5.1 Dev QUOTE_SIGNER key into local env
- [ ] 5.2 Webhook signing key into Vercel preview env
- [ ] 5.13 QUOTE_SIGNER into Vercel; KEEPER into Render
- [ ] 6.4 Create MATCHMAKER key; local env
- [ ] 6.12 MATCHMAKER key into Vercel
- [ ] 8.12 GUILD_WAR signer key into Render
- [ ] 12.1 Make VAPID key pair; local env
- [ ] 12.2 Bot token + username into local env
- [ ] 12.11 Team chat id into local env + Render
- [ ] 12.12 VAPID, bot token, chat id into Render + Vercel
- [ ] 13.12 Create RISK key; into Render
- [ ] 14.11 Update the rotated key's host secret after the drill

### Funding (test ETH)
- [ ] 1.1 Deployer
- [ ] 1.5 Spike signer key
- [ ] 1.16 RANDOMNESS_SIGNER
- [ ] 2.1 VOUCHER_SIGNER
- [ ] 3.1 Test ETH into PotFunder for the tracer
- [ ] 3.11 EPOCH_POSTER key
- [ ] 4.2 Deployer for curve rehearsal (~4.2 test ETH + gas)
- [ ] 4.9 Deployer for token layer
- [ ] 5.13 Faucet (1 test ETH first top-up); QUOTE_SIGNER and KEEPER gas
- [ ] 6.1 Two test players
- [ ] 10.9 Shortened-season `seasonPool` stream + test players
- [ ] 13.12 RISK key
- [ ] 14.14 Deployer, every role key, Faucet, Gas Manager policy

### Deploy OKs (every deploy to 46630)
- [ ] 1.1 Tracer contract
- [ ] 1.3 Test timelock
- [ ] 1.5 Reveal spike test contract
- [ ] 1.15 Governance base
- [ ] 1.16 Randomness
- [ ] 2.1 PetCore + PetNFT
- [ ] 2.11 Pet-life upgrades; Vercel + Render
- [ ] 3.1 PotFunder, PetCore, EpochDistributor
- [ ] 3.11 Pot upgrades
- [ ] 4.2 Curve rehearsal (throwaway)
- [ ] 4.9 Token layer
- [ ] 5.13 Store, Pass, Faucet
- [ ] 6.1 Battle
- [ ] 6.12 Battle upgrades + MatchArena, Wager
- [ ] 7.1 Cosmetics upgrade + Store item
- [ ] 7.13 Cosmetics upgrade + Market
- [ ] 8.1 PetCore upgrade (Co-Pet)
- [ ] 8.12 PetCore, Battle, EpochDistributor, GoldVault upgrades + CoPetApprovals
- [ ] 9.13 Wheel, Monster, Expedition + PetCore, Care upgrades
- [ ] 15.6 DeathMatch, Raid
- [ ] 10.9 Battle upgrade + SeasonRewards
- [ ] 11.1 PetCore upgrade + Evolution
- [ ] 11.5 Breeding + Evolution v2
- [ ] 12.3 Vercel preview with VAPID key
- [ ] 12.12 Render + Vercel production
- [ ] 13.12 Anti-bot hold upgrade
- [ ] 14.1 Vercel production
- [ ] 14.9 Render worker with alarms + staged faults
- [ ] 14.14 Full final deploy + Vercel/Render redeploys
- [ ] 14.15 Dated OK to open testnet to players

### Safe signers (2 of 3)
- [ ] Before 1.15: you + 2 teammates replace the 3 test keys (DECISIONS #35)
- [ ] 1.3 Sign spike propose / cancel / execute
- [ ] 1.15 Sign governance drill
- [ ] 1.16 Grant Randomness role
- [ ] 2.1 GAME_MODULE / VOUCHER_SIGNER wiring
- [ ] 2.11 Upgrade + role grants
- [ ] 3.1 KEEPER grant (if not done in pet-life)
- [ ] 3.11 Upgrade + EPOCH_POSTER grant
- [ ] 4.9 PetCore upgrade + role grants
- [ ] 5.13 Role grants, PetCore upgrade, faucet PETV transfer, season 1 genesis
- [ ] 6.1 GAME_MODULE + Randomness registration for Battle
- [ ] 6.12 Battle grants
- [ ] 7.1 Cosmetics upgrade + item registration
- [ ] 7.13 Cosmetics upgrade, Market, granter roles
- [ ] 8.1 PetCore upgrade
- [ ] 8.12 Social timelock proposals
- [ ] 9.13 Play-hub deploys, upgrades, roles
- [ ] 15.6 Death Match + Raid role grants
- [ ] 10.9 Battle upgrade + SeasonRewards
- [ ] 10.10 Season 1 genesis calls
- [ ] 11.1 PetCore upgrade
- [ ] 11.5 Role grants + item registration
- [ ] 13.12 Upgrade, RISK grant, drill renew + clear
- [ ] 14.11 Drill: param change, cancel, pause, unpause, role rotation
- [ ] 14.14 Final role grants + timelock wiring

### Reviews and checks
- [ ] 1.1 Repeat login + tracer on your phone; confirm tx on explorer
- [ ] 1.2 Confirm both sponsored txs; approve wallet-mode answer
- [ ] 1.3 Two signers confirm executed + cancelled ops on explorer
- [ ] 1.4 Accept pot accumulator answer (before pot epic)
- [ ] 1.8 List live DB schemas after tests; confirm `game` untouched
- [ ] 1.15 You + 1 signer confirm drill on explorer
- [ ] 1.16 Confirm one live reveal on explorer
- [ ] 2.1 Hatch on your phone; confirm hatch + reveal
- [ ] 2.11 Set drill timers; run onboarding on phone; confirm bury, burn, Tombstone
- [ ] 4.2 Confirm rehearsal graduation + pool swap
- [ ] 4.9 You + 1 signer confirm deploy, split, Gold claim
- [ ] 5.13 Confirm drips, buys, and 11th / 21st action refused
- [ ] 6.12 Test players play every battle mode
- [ ] 7.2 Approve Gallery contact sheet (all items on all species)
- [ ] 7.11 Approve season skin contact sheet
- [ ] 7.13 Walk Shop against the mocks
- [ ] 8.1 Two testers run a Co-Pet invite
- [ ] 8.12 Two players run Co-Pet + Guild War drill
- [ ] 9.13 Confirm play-hub numbers before live
- [ ] 15.6 Set + restore shortened Death Match window; two test players run the raid
- [ ] 10.10 Confirm season 1 start date
- [ ] 11.4 Approve 3D looks (Teen, Elder, Mythic, elements, shiny)
- [ ] 11.10 Sign off growth live checklist
- [ ] 12.1 See push on your desktop
- [ ] 12.2 Link your Telegram; get staged robbery
- [ ] 12.3 Install PWA on your iPhone (iOS 16.4+); confirm push
- [ ] 12.12 You + 1 teammate get robbery alert on push and Telegram
- [ ] 13.2 Accept funding-wallet spike answer + ignore list
- [ ] 13.9 A teammate clears one seeded flag
- [ ] 13.12 You + 1 signer confirm anti-bot drill
- [ ] 14.2 Accept "check this result" spike answer
- [ ] 14.9 A teammate confirms team-chat alarm messages
- [ ] 14.11 A teammate who did not write the runbooks runs the drill
- [ ] 14.13–14.15 Review launch checklist evidence
- [ ] 14.15 You + a teammate do the manual phone + desktop pass
