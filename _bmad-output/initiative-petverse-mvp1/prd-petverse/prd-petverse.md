---
title: Petverse PRD
status: final
created: 2026-10-14
updated: 2026-10-14
---

# PRD: Petverse

## 0. Document Purpose

This PRD is for the owner and for the next BMad steps (UX, architecture, spec, tickets). It turns the accepted
`intent/001-petverse-play-to-earn-pets.md` into requirements for **release 1 on Robinhood Chain testnet**. Every
answer the owner gave is logged in `.memlog.md` next to this file. Decisions made before this PRD live in
`docs/DECISIONS.md` (#1–25) and are not repeated in full. Technical choices go in `addendum.md`, not here. Open items are in §9.

## 1. Vision

Petverse is a cute 3D pet game where your pet earns you a share of a real ETH pot. You hatch a pet, keep it fed,
dress it up, fight other pets, and the points you collect are your claim on the pot. Neglect it and it sleeps; leave it
asleep and it dies.

It keeps the base that Fren Pet proved works (points that pay ETH, stealing points, wagers, death) and adds what
Fren Pet lacks: 3D pets people want to look at, play with friends, deeper content, a fairer pot, and rules anyone can
check on-chain.

Release 1 is the whole game on testnet, with test money, so the loop, the balance and the bugs can be found before any
real money is at risk.

## 2. Target User

### 2.1 Jobs To Be Done

- **Crypto player:** "Give me a game where my time turns into ETH, and where I can see the rules are fair."
- **Casual player:** "Give me a cute pet to look after and show off, without learning crypto first."
- **Both:** "Give me a reason to open the app every day, and something to do with my friends."

### 2.2 Non-Users (release 1)

- Players on iOS or Android app stores: Petverse is web / PWA only (store rules forbid crypto-unlocked content).
- Anyone expecting real money: release 1 is testnet; all tokens and ETH are test funds with no value.

### 2.3 Key User Journeys

- **UJ-1. A new player's first session.**
  - **Entry state:** arrives from a link, not logged in.
  - **Path:** landing page → **Play** → logs in with email, Google or a wallet (a smart wallet is made; no seed
    phrase, no gas) → taps the egg → it hatches and the pet is minted as an NFT, free → feeds and plays → dresses it
    with a free cosmetic → fights a tutorial bot it cannot lose.
  - **Climax:** sees the ETH pot and "your points = X ETH now".
  - **Resolution:** learns the pet is safe from attacks for 3 days. Reasons to return: feed timer, daily wheel,
    revenge, login streak.

- **UJ-2. A returning player's day.**
  - **Entry state:** day 5, logged in, pet fed.
  - **Path:** feeds and cares (timer resets, small points) → spins the daily wheel → attacks a pet of similar level,
    once per 30 minutes → plays a 1v1 duel or 2v2 with a friend or random partner.
  - **Climax:** checks the pot and claims ETH; points reset to 0.
  - **Edge case:** gets attacked and loses ~5% of points → alert says who → **revenge** button hits back, skipping the
    cooldown → pet gets a short shield.

- **UJ-3. Neglect, sleep and death.**
  - **Path:** not fed for 3 days → pet **sleeps** (earns nothing, gets no pot share, can be robbed) → player returns and **wakes it for
    free** but loses points, more the longer it slept.
  - **Edge case:** asleep for 7 days → pet **dies**: NFT burned, points gone, unclaimed ETH returns to the pot.
  - **Resolution:** player keeps a **Tombstone** badge and gets a **free new egg**.

- **UJ-4. Two friends and their guild.**
  - **Entry state:** a player with an adult pet; a friend who just joined.
  - **Path:** sends the friend an invite link → they make a **Co-Pet** together → both feed it the same day and get the
    Together bonus → the friend joins their **guild** → on Sunday the guild plays its **Guild War**, a best-of-5 series
    of 2v2 matches.
  - **Climax:** they win the deciding 2v2 together and the guild shares a Gold prize.
  - **Resolution:** both come back daily to keep the shared streak alive. **Edge case:** one friend wants to stop; they
    leave the Co-Pet (FR-30). Pets cannot be sold in release 1.

- **UJ-5. Spending and risking $PETV.**
  - **Entry state:** a player holding test $PETV from the faucet and from claims.
  - **Path:** opens the **store**, sees "Food $1 = 312 PETV", buys food and an Elder item → stakes some $PETV in the
    **Gold vault** → enters a **wager battle**, staking $PETV.
  - **Climax:** wins the wager and takes the pot minus the 5% that is burned; sees the burn counter tick up.
  - **Resolution:** sends the pet on a **Bold expedition** with the rest; it fails and the stake is burned.

- **UJ-6. A Death Match weekend.**
  - **Entry state:** Saturday; an adult pet with 3 lives.
  - **Path:** enters **Death Match** after a "your pet can die" warning → wins twice (Survivor streak 2) → loses once
    (2 lives left) → loses again (1 life) and sees the "leave safely?" prompt.
  - **Climax:** chooses to leave with the streak rewards and a Hall of Fame spot.
  - **Edge case:** a player who keeps going and loses at 1 life sees the pet die, keeps a Tombstone and gets a free egg.

- **UJ-7. A Boss Raid.**
  - **Path:** two players team up against the **season boss** → the fight plays automatically → the boss loses health
    across all teams' raids during the season.
  - **Climax:** both get points and Gold for the damage they dealt; the season's top raid teams get a cosmetic.

## 3. Glossary

| Term | Meaning |
|---|---|
| Points | A pet's claim weight on the ETH pot. Not tradeable. |
| ETH pot | Test ETH held by the game contract, shared by points. |
| $PETV | Petverse's own token, launched on the Pons bonding curve. |
| Gold | Vault share coin: stake $PETV, get Gold; the vault grows from game spending. |
| Co-Pet | One pet owned and raised by two friends. |
| Cooldown | Wait between attacks: 30 minutes. |

## 4. Features and Functional Requirements

### 4.1 Onboarding and account

- **FR-1** A landing page explains the game and has a Play button. *(UJ-1)*
- **FR-2** Players log in with email, Google or an existing wallet, before getting their egg. *(UJ-1)*
- **FR-3** Every player gets a smart wallet; they never see a seed phrase or pay gas for sponsored actions.
- **FR-4** Each player gets 10 gas-sponsored actions a day (Season Pass: 20). After that the player pays gas from test
  ETH, which the faucet gives at sign-up and daily (§4.10).
- **FR-5** A tutorial battle against a bot that the player cannot lose. *(UJ-1)*

### 4.2 Pet, care and life cycle

- **FR-6** Hatching the first egg mints a pet NFT for free (one of 10 species, random coat). *(UJ-1)*
- **FR-7** Feeding resets a feed timer and gives a few points. Food is free (earned) or bought in the store.
- **FR-8** Status follows the timer: fed → hungry → asleep after 3 days → dead after 7 more days. *(UJ-3)*
- **FR-9** An asleep pet earns no points, gets no pot share until it is woken, and can be robbed.
- **FR-10** Waking is free but costs 10% of points per day asleep (day 1: 10% … day 7: 70%). *(UJ-3)*
- **FR-11** A dead pet's NFT is burned, its points removed, and its unclaimed ETH returned to the pot. *(UJ-3)*
- **FR-12** On death the owner gets a Tombstone badge and a free new egg. *(UJ-3)*
- **FR-13** New pets cannot be attacked for their first 3 days. *(UJ-1)*

### 4.3 Points and the ETH pot

- **FR-14** Home shows the pot size and the player's live share. *(UJ-1)*
- **FR-15** The ETH pot has two parts. **Main pot (85%):** an owner's share = their *effective points* ÷ all effective
  points, where effective points grow more slowly than raw points at high totals (FR-52); the owner's share is split
  across their pets by points. **Small pot (15%):** shared by the bottom half of awake living pets by points (FR-51).
  Asleep pets count in neither pot until woken. Anyone can check both on-chain.
- **FR-16** Claiming pays the share in ETH and resets the pet's pot-share points to 0; its level and lifetime points stay. *(UJ-2)*
- **FR-17** The pot is filled by the $PETV trade tax, store sales, Season Pass sales and fees.

### 4.4 Battles

- **FR-18** All battles are automatic: stats plus luck decide, the player watches the fight.
- **FR-19** **Attack:** hit a pet of similar level; a win steals about 5% of its points. One attack per 30 minutes. *(UJ-2)*
- **FR-20** A robbed player gets an alert (in app, push, Telegram) naming the attacker and the points lost. *(UJ-2)*
- **FR-21** A robbed player can take **revenge** on the attacker once, skipping the cooldown. *(UJ-2)*
- **FR-22** A robbed pet gets a 30-minute shield against other attackers.
- **FR-23** **1v1 duel:** the winner gains rank and takes 10% of the loser's points.
- **FR-24** **2v2:** two friends with one pet each, or a random matched partner.
- **FR-25** **Death Match:** weekend event; any adult pet; 3 lives; a loss costs 1 life; the player can leave safely at
  any time; the pet dies at 0 lives; rewards are bigger than ranked. Lives return 1 a week with good care. A Co-Pet
  needs both owners to agree.
- **FR-26** **Wager battles and dice:** players stake $PETV; 5% of each pot is burned.
- **FR-27** Battle randomness uses server commit–reveal, with the commitment published before the battle.

### 4.5 Social

- **FR-28** **Co-Pet:** two friends own one pet; both can feed and play; caring on the same day gives a Together bonus;
  the streak only grows if both show up; rewards split 50/50.
- **FR-29** Co-Pet breeding and Death Match need both owners to approve. Max 3 Co-Pets per player. *(Co-Pet selling
  removed: no pet or Co-Pet selling in release 1, `DECISIONS` #14.)*
- **FR-30** Ending a Co-Pet: either owner can leave or end it; the pet returns to its creator and the other keeps a
  memory badge. *(Buy-out removed: it is a sale, `DECISIONS` #14.)* [ASSUMPTION] If the creator leaves, the pet stays
  with the other owner; no money changes hands.
- **FR-31** **Guilds** of up to 10 players.
- **FR-32** **Guild War:** a weekly series of 2v2 matches, guild against guild.

### 4.6 Growth

- **FR-33** **Evolution:** Egg → Baby → Teen → Adult → Elder → Mythic.
- **FR-34** Play style picks the path: mostly battles → Warrior, mostly care → Guardian, mostly expeditions → Explorer.
- **FR-35** The pet's element sets its look.
- **FR-36** Elder and Mythic need evolution items; Mythic also needs a season trophy.
- **FR-37** **Breeding:** two adults make an egg; each pet can breed 5 times; each breed costs more; 1 in 500 eggs is shiny.
- **FR-38** **Expeditions:** send a pet out for 1, 8 or 24 hours. Safe gives a small sure reward; Bold risks $PETV for a
  bigger reward, and the stake is burned if it fails.

### 4.7 Cosmetics

- **FR-39** Pets wear cosmetics in 5 slots (hat, face, neck, back, hand); every item fits all 10 species. 35 exist today.
- **FR-40** Cosmetics have rarity: common, rare, epic, legendary. Rare and above are NFTs.
  Split: 60% common, 25% rare, 12% epic, 3% legendary.

### 4.8 Token, store and pass

- **FR-41** **$PETV** launches on testnet through our own bonding curve that behaves like Pons (curve, graduation to our
  own Uniswap v2-style pool on testnet, creator tax to our splitter), because Pons is mainnet only. Mainnet uses real Pons with the highest tax it allows.
- **FR-42** **Store:** items are priced in dollars and paid in $PETV (food \$1, eggs \$2.99–\$9.99, shields, evolution
  items, cosmetics). The token amount follows the token price.
- **FR-43** **Season Pass** (\$7.99 per season): +25% points, faster attacks, more free gas, a reward track and a season skin.
- **FR-44** **Gold:** stake $PETV into a vault to get Gold shares; the vault grows from game spending; swapping back
  costs 2%; Gold is also earned from monsters and living pets, paid from a funded reserve with a daily payout cap, never newly
  minted, so stakers are not diluted (`DECISIONS` #16); a dead pet's Gold returns to the vault.
- **FR-45** Burns: store spending is burned at 70% / 50% / 30% as market cap passes $1M and $10M (30-minute
  average); 5% of each wager and dice pot; the full stake of a failed Bold expedition; half of the market fee.

### 4.9 Market, seasons and daily rewards

- **FR-46** **Marketplace:** trade rare-and-above cosmetics only. 5% fee, half burned.
- **FR-47** **Seasons** last 12 weeks, with a leaderboard; top players get a bonus paid from a separate season pool,
  not from the ETH pot; ranks reset each season.
- **FR-48** **Daily wheel:** one free spin a day. *(UJ-2)*
- **FR-49** **Login streak** reward for days in a row. *(UJ-1)*
- **FR-50** **Monsters (PvE):** pets fight AI monsters to earn Gold and points; automatic like other battles.
- **FR-51** **Small pot:** 15% of the ETH pot is shared by the bottom half of awake living pets by points.
- **FR-52** **Effective points:** each extra point counts a little less at high totals, so a few whales cannot take
  most of the main pot. The curve is applied per owner to the sum of all their pets' points, so splitting points
  across many pets gives no gain (`DECISIONS` #17). The exact curve is set in architecture and pinned by tests.
- **FR-53** **Boss Raid:** up to 2 players fight the season boss together, automatically; the boss's health is shared
  across all raids in the season; players earn points and Gold for damage, and the top raid teams get a cosmetic.

### 4.10 Default rules

Starting values written by Claude on the owner's instruction (2026-10-14), so every feature has a testable "done".
Each is marked **default**: the owner may change any of them, and testnet tuning may move them. Tests pin whichever
value is current.

**Core terms**

| Term | Default rule |
|---|---|
| Level | From lifetime points (all points ever earned): level = 1 + floor(sqrt(lifetime points ÷ 100)). Never drops; claiming ETH resets only the pot-share points (FR-16). Shown on the pet. |
| Similar level (attacks, duels) | Target level within ±2 of the attacker's. |
| Rank | Elo-style rating starting at 1,000; +/−16 per duel at even odds. Resets each season. |
| Good care | Fed at least once in each 24-hour window. |
| Adult | Baby reaches Teen at level 3, Adult at level 6. |
| Bot account (for the counter-metric) | An account flagged by the anti-bot rules below. |

**Battles and events**

| Feature | Default rule |
|---|---|
| FR-23 Duel | 5 ranked duels a day; winner +rank and 10% of loser's points; loser −rank. |
| FR-24 2v2 | Team of 2 pets; winning team splits 10% of the losing team's points evenly; 5 a day. Matchmaking pairs by level ±2. |
| FR-25 Death Match | Runs Saturday 00:00 – Sunday 23:59 UTC. Each win +1 Survivor streak; reward = 2× ranked duel points × streak (max 5×). Lives refill 1 per 7 days of good care, max 3. |
| FR-48 Daily wheel | One free spin per 24h. Prizes: 50% small points (20), 25% food, 15% medium points (100), 8% common cosmetic, 2% rare cosmetic. |
| FR-50 Monsters | 3 monster fights a day; each win gives Gold and 20 points; monsters scale to the pet's level. |
| FR-49 Login streak | Day 1–6: 10 points each; day 7: a free egg-shard; streak resets after a missed day. |

**Social**

| Feature | Default rule |
|---|---|
| FR-31 Guilds | Up to 10 members; one leader who can invite and remove; a player is in at most one guild. |
| FR-32 Guild War | Weekly, Sunday. Guilds paired by average level. Best of 5 2v2 matches. Winning guild shares a Gold prize from the season pool. |

**Growth**

| Feature | Default rule |
|---|---|
| FR-34 Evolution path | At Teen, the path is the action the pet did most in its life: battles → Warrior, care → Guardian, expeditions → Explorer. |
| FR-35 Element | Fixed at hatch, one of 5 (fire, water, leaf, spark, stone); sets the colour and a +10% damage edge against one other element. |
| FR-36 Elder / Mythic | Elder: level 15 + 1 Elder item. Mythic: level 30 + 1 Mythic item + a season trophy (top 10% finish). |
| FR-37 Breeding | Cost doubles each breed: 1×, 2×, 4×, 8×, 16× the base egg price. Both parents need good care. |
| FR-38 Expeditions | Safe: 10 / 40 / 100 points for 1h / 8h / 24h. Bold: 3× the reward, 30% chance to fail and burn the stake. Pet cannot battle while away. |

**Money**

| Item | Default rule |
|---|---|
| FR-41 Testnet $PETV | 1B fixed supply. Our curve graduates at 4.2 test ETH (Pons's value) into our own Uniswap v2-style pool on 46630; 5% trade tax on curve and pool. |
| Tax split | Of the 5% tax: 2% ETH pot, 1% burn, 1% liquidity, 1% team. |
| Store income | Burn share by stage (FR-45); of the rest: 50% ETH pot, 50% team. |
| Season Pass income | 30% ETH pot, 20% season pool, 50% team. |
| Market fee (FR-46) | 5%: half burned, half to the ETH pot. |
| FR-42 Store prices | Food $1, shield (8h) $1, egg $2.99 (common) to $9.99 (rare odds), Elder item $3, Mythic item $5, cosmetics $1–$20. |
| FR-43 Season Pass | 10-minute attack cooldown (vs 30); 20 free gas actions a day (vs 10). |
| FR-44 Gold | Living pet earns 10 Gold a day; vault swap-back fee 2%. Game-earned Gold is paid from a funded reserve with a daily payout cap; none is minted. |
| Test funds | New players get test ETH and test $PETV from our faucet, so casual players can keep playing after the 10 free actions: at sign-up 0.01 test ETH + 3,120 PETV ($10); once a day 0.002 test ETH + 624 PETV ($2). |
| Asleep pets | No share of either pot until woken (FR-9). |

**Anti-bot (counter-metric)**

| Rule | Default |
|---|---|
| One free starter egg | Per verified login (email or Google) or per wallet with history; not per new empty wallet. |
| Small pot | Only awake pets older than 7 days count for the small pot. |
| Flags | Many accounts from one device or funding wallet, or perfectly regular timing, flag an account for review; flagged accounts are excluded from pot payouts until cleared. |

## 5. Non-Functional Requirements

- **NFR-1 Trust:** every contract is verified and public; a multisig owns the game; rule changes wait behind a time
  delay; the randomness signer's role and limits are public, and every random result (battles, wheel, monsters,
  expeditions, eggs, breeding, cosmetic drops) can be checked against its published commitment (`DECISIONS` #11, #12).
- **NFR-2 Verifiable money:** points, pot shares and claims are readable on-chain by anyone (intent §Proposed outcome).
- **NFR-3 Scale:** paying out the pot costs the same per claim for 10 or 1M players.
- **NFR-4 Platform:** web / PWA; works on phone browsers.
- **NFR-5 Privacy of secrets:** keys and passwords never in code, logs or chat.
- **NFR-6 Data:** off-chain data in the one hosted Supabase database; tests never touch real data (`DECISIONS` #10).

## 6. Success Metrics

| Metric | Target for release 1 (testnet) |
|---|---|
| Players | 100+ |
| Still playing after 7 days | 40%+ of new players |
| Done when | All release 1 features work and are stable, no major bugs |

**Counter-metrics (warning signs):** bots win most of the pot; a few top players take most of the pot; new players quit
in their first week after being robbed; many pets die and their owners do not come back.

| Warning sign | Problem when |
|---|---|
| Bots win the pot | Bot accounts take more than 10% of pot payouts |
| Whales take the pot | The top 5% of pets take more than 50% of payouts |
| New players quit after a robbery | More than 40% of robbed new players leave in week 1 |
| Deaths drive players away | Fewer than 30% of owners whose pet died hatch again |

## 7. Scope

**Release 1 ships all at once:** testnet opens only when every feature in §4 works. The owner chose this over shipping
in waves or cutting features.

**Not in release 1:** mainnet, real money, iOS/Android store apps, trading pets or eggs, common-cosmetic trading.

## 8. Constraints and Risks

- **Legal:** ETH payouts, wagers, dice, paid spins and $PETV may count as gambling or a security. Mainnet waits for a
  lawyer, launch countries, geo-blocking and age checks (§9 #4). Testnet is allowed because test funds have no value.
- **Pons is mainnet only.** Checked 2026-10-14: the active Pons factory `0xA5aA…1feB` has code on Robinhood Chain
  mainnet (4663) and none on testnet (46630) ([Mobula Pons guide](https://docs.mobula.io/almanac/robinhood-launchpads/pons)).
  So testnet uses our own Pons-like curve (FR-41). The tax-cap getter name is not public, so the mainnet cap is still unknown.
- **Size:** 53 requirements shipping at once is a long build; the plan should test the riskiest parts first.
- **Real-money premise untested:** testnet cannot show whether real ETH keeps people playing (intent check 6).

## 9. Open Questions

None of these blocks the testnet build. Each has an owner and the point at which it must be answered.

| # | Question | Owner | Answer before |
|---|---|---|---|
| 1 | Pons's maximum trade tax (`maxCreatorTaxBps`); the getter is not public | Owner (ask Pons) | Mainnet token launch |
| 2 | Multisig: which product, how many signers, how long the rule-change delay | Owner | First contract deploy |
| 3 | Randomness signer: key storage and how often commitments are published | Architecture | First contract deploy |
| 4 | Which countries we launch in; geo-blocking and age checks | Owner + lawyer | Mainnet |
| 5 | Name for Gold | Owner | UX step |
| 6 | How tests use the one hosted database without touching real data (separate schema) | Architecture | First database unit |
| 7 | Exact effective-points curve (FR-52) | Architecture | Contract unit for the pot |
| 8 | Rule for the edge where a pet dies at exactly 7 days asleep vs a wake on day 7 (FR-10) | Architecture | Contract unit for life cycle |
| 9 | How a Co-Pet's points count in the per-owner curve (FR-52, `DECISIONS` #17): half to each owner? | Architecture | Contract unit for the pot |
