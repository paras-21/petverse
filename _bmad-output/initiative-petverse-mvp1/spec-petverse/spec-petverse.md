---
id: SPEC-petverse
companions:
  - game-rules.md
  - glossary.md
  - ../ux-petverse/DESIGN.md
  - ../ux-petverse/EXPERIENCE.md
  - ../architecture-petverse/architecture-petverse.md
sources:
  - ../prd-petverse/prd-petverse.md
  - ../prd-petverse/addendum.md
  - ../architecture-petverse/owner-numbers.md
  - ../../../docs/DECISIONS.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Petverse release 1 (Robinhood Chain testnet)

## Why

**Vision + pain.** Petverse is a cute 3D pet game on Robinhood Chain where your pet's points are your claim on a real
ETH pot: hatch, feed, dress up, fight; neglect it and it sleeps, then dies. Fren Pet proved the model (points pay ETH,
stealing, wagers, death) but players cannot trust it: one key owns the game, most contracts are unverified, rules change
with no delay, and bots and whales take the pot. Petverse keeps the model and fixes that: every rule checkable on-chain,
a multisig and time delay over every change, a fairer pot, plus 3D pets people want to look at, friends to play with and
deeper content. It serves crypto players who want time to turn into ETH under fair rules, and casual players who want a
pet without learning crypto. Release 1 is the whole game on testnet with test money, so the loop, balance and bugs are
found before real money is at risk. Numbers and rules live in [game-rules.md](game-rules.md); terms in
[glossary.md](glossary.md).

## Capabilities

- **CAP-1** Onboarding and login
  - **intent:** A new player gets from a link to a hatched pet and a first win without knowing crypto.
  - **success:** Landing page with one Play button; login by email, Google or existing wallet before the egg; a smart wallet is made silently (no seed phrase, no gas for sponsored actions); 4 skippable do-it steps (feed, dress up, bot battle, see the pot); the tutorial bot battle cannot be lost; the player sees the pot and "your points = $X now". (FR-1, FR-2, FR-3, FR-5)
- **CAP-2** Sponsored actions and test-funds faucet
  - **intent:** A player plays free up to a daily cap and can keep playing past it with test funds.
  - **success:** The first 10 actions per UTC day (20 with Season Pass) are gas-free; after that the same action is paid from test ETH, with the fee shown in dollars first; the faucet pays at sign-up and once a day. (FR-4)
- **CAP-3** Hatch
  - **intent:** A player's first egg becomes their own pet for free.
  - **success:** Hatching mints a pet NFT at no cost: one of 10 species, random coat, element fixed; it cannot be attacked for 3 days; only one free starter egg per verified login or wallet with history. (FR-6, FR-13)
- **CAP-4** Feed and care
  - **intent:** Feeding keeps the pet awake and earns a little.
  - **success:** A feed resets the sleep timer and gives a few points; food is earned free or bought; the hungry window (last 24h before sleep) shows and alerts. (FR-7)
- **CAP-5** Sleep and wake
  - **intent:** Neglect has a soft, recoverable cost.
  - **success:** Unfed for 3 days the pet sleeps: earns no points, gets no share of either pot, can still be robbed; feeding wakes it at no money cost but takes 10% of pot points per day asleep (day 1: 10% … day 7: 70%), stated before the tap; level, lifetime points and ETH earned before sleep stay. (FR-8, FR-9, FR-10; DECISIONS #27)
- **CAP-6** Death and restart
  - **intent:** Long neglect ends the pet, gently, with a way back.
  - **success:** After 7 days asleep the pet is dead: NFT burned, points removed, unclaimed ETH returned to the pot, unpaid game Gold returned to the vault; owner gets a Tombstone badge and a free new egg. (FR-11, FR-12)
- **CAP-7** Points and level
  - **intent:** Pot points set the pot share; lifetime points set a level that never drops.
  - **success:** Level = 1 + floor(sqrt(lifetime points ÷ 100)); a claim resets only pot points; level, lifetime points, items and friends stay. (FR-16, game-rules Core terms)
- **CAP-8** Main pot share and claim
  - **intent:** A player sees their live share of the ETH pot and claims it.
  - **success:** Home shows pot size and live share; 85% of new pot ETH is shared by per-owner effective points and split across that owner's pets by points; claiming pays the share in ETH and sets the pet's pot points to 0; the pot is filled by the PETV trade tax, store, Season Pass and fees. (FR-14, FR-15, FR-16, FR-17, FR-52)
- **CAP-9** Small pot
  - **intent:** The lower half of pets get a steady share so new and small players are not shut out.
  - **success:** 15% of new pot ETH is shared equally, per weekly epoch, by the bottom half by points of living pets awake at the epoch snapshot, older than 7 days and not flagged; asleep pets get nothing. (FR-15, FR-51; DECISIONS #28)
- **CAP-10** Attack, revenge and shield
  - **intent:** A player steals points from similar pets, and a robbed player can hit back.
  - **success:** Attacks only hit pets within ±2 levels; a win steals about 5% of the target's points; one attack per 30 minutes (Pass: 10); the robbed pet gets a 30-minute shield and one revenge that skips the cooldown; the fight plays automatically from stats plus luck, with reward and odds shown before the tap. (FR-18, FR-19, FR-21, FR-22)
- **CAP-11** Ranked duel and 2v2
  - **intent:** Players climb a ranked ladder alone or in pairs.
  - **success:** Duel: winner gains rank and 10% of the loser's points, 5 a day; 2v2: with a friend or random partner (level ±2), winning team splits 10% of the losing team's points, 5 a day. (FR-23, FR-24)
- **CAP-12** Wager battles and dice
  - **intent:** Players stake PETV against each other.
  - **success:** The winner takes the pot minus 5%, which is burned; a stake is refunded when a reveal times out; the risk is stated before commit. (FR-26)
- **CAP-13** Death Match
  - **intent:** A weekend mode with bigger rewards where the pet can die.
  - **success:** Open Saturday 00:00 – Sunday 23:59 UTC to any adult pet with 3 lives; a loss costs a life; the player can leave safely any time and keeps streak rewards and a Hall of Fame spot; 0 lives = death (CAP-6); lives refill 1 per 7 days of good care; a Co-Pet enters only if both owners agree. (FR-25)
- **CAP-14** Co-Pet
  - **intent:** Two friends own and raise one pet together.
  - **success:** Both can care and play; caring the same day gives the Together bonus; the shared streak grows only if both show up; rewards split 50/50; breeding and Death Match need both approvals; max 3 Co-Pets per player; either owner can leave or end it: the leaver's half of the pet's unclaimed pot is paid to the leaver first, then the pet becomes the other owner's normal pet with the other half still claimable; the leaver gets a memory badge; no sale, buy-out or money between players. (FR-28, FR-29, FR-30; DECISIONS #29)
- **CAP-15** Guilds and Guild War
  - **intent:** Friends form a guild and fight other guilds weekly.
  - **success:** Guilds of up to 10 with one leader who invites and removes; one guild per player; every Sunday guilds paired by average level play a best-of-5 series of 2v2 matches; the winning guild shares a Gold prize. (FR-31, FR-32)
- **CAP-16** Evolution
  - **intent:** The pet grows through stages shaped by how it is played.
  - **success:** Egg → Baby → Teen (Lv 3) → Adult (Lv 6) → Elder → Mythic; the path is set at Teen by the most-done action (battles → Warrior, care → Guardian, expeditions → Explorer); element sets the look; Elder and Mythic need their item, Mythic also a season trophy. (FR-33, FR-34, FR-35, FR-36)
- **CAP-17** Breeding
  - **intent:** Two adults make a new egg.
  - **success:** Own pets or Co-Pets only; each pet breeds at most 5 times, each breed costs double the last; both parents need good care; 1 in 500 eggs is shiny. (FR-37)
- **CAP-18** Cosmetics
  - **intent:** A player dresses the pet and shows it off.
  - **success:** 5 slots (hat, face, neck, back, hand); every item fits all 10 species; 35 items; rarity common/rare/epic/legendary at 60/25/12/3%; rare and above are tradeable NFTs, commons are soulbound; try-on before buy. (FR-39, FR-40)
- **CAP-19** Expeditions
  - **intent:** A player sends the pet away for a sure or risky reward.
  - **success:** 1, 8 or 24 hours; Safe pays a small sure reward; Bold stakes PETV for 3× the reward with a 30% chance to fail and burn the stake; the pet cannot battle while away. (FR-38)
- **CAP-20** Monsters and Boss Raid
  - **intent:** Pets fight the game, not players, for points and Gold.
  - **success:** 3 automatic monster fights a day, scaled to the pet's level, each win gives Gold and points; Boss Raid teams of up to 2 fight the season boss whose health is shared across all raids; damage earns points and Gold; top raid teams get a cosmetic. (FR-50, FR-53)
- **CAP-21** Daily wheel and login streak
  - **intent:** Small daily rewards bring the player back.
  - **success:** One free wheel spin per 24h with the set prize odds; login streak pays points on days 1–6 and an egg-shard on day 7, and resets after a missed day. (FR-48, FR-49)
- **CAP-22** PETV token and burns
  - **intent:** The game has its own token whose burns anyone can see.
  - **success:** 1B fixed supply, no mint after deploy; testnet launch on our Pons-like curve that graduates into our own v2-style pool; 5% trade tax split pot/burn/liquidity/team; store, wager, dice, failed Bold and market burns happen as set; a public burn counter shows the total. (FR-41, FR-45)
- **CAP-23** Store and Season Pass
  - **intent:** A player buys items and a season pass priced in dollars.
  - **success:** Every price is set in USD and paid in PETV at the live rate (food $1, eggs $2.99–$9.99, shields, evolution items, cosmetics); a shortfall shows the gap in dollars and a way to top up; Season Pass $7.99 gives +25% points, 10-minute attack cooldown, 20 free actions a day, a reward track and a season skin, no auto-renew. (FR-42, FR-43)
- **CAP-24** Gold vault
  - **intent:** A player stakes PETV to share in game spending.
  - **success:** Staking PETV gives Gold shares; the vault grows from game spending; swapping back costs 2%; game Gold (living pets, monsters, raids, Guild War) is paid from a funded reserve under a daily cap and never minted. (FR-44)
- **CAP-25** Market
  - **intent:** Players trade rare and better cosmetics.
  - **success:** Only rare-and-above cosmetics list; never pets, eggs, Co-Pets or commons; 5% fee, half burned, half to the ETH pot; buy goes through a review sheet. (FR-46)
- **CAP-26** Seasons and leaderboard
  - **intent:** Players compete in 12-week seasons.
  - **success:** A season leaderboard ranks players; ranks reset each season; top players get a bonus from the season pool, not the ETH pot; top 10% get a season trophy. (FR-47)
- **CAP-27** Alerts
  - **intent:** A player learns about robbery and danger in time to act.
  - **success:** A robbery alert names the attacker and points lost in app, by web push and on Telegram; hungry, asleep and near-death alerts fire on the same channels; one alert at a time; no email. (FR-20)
- **CAP-28** Fairness checks
  - **intent:** Anyone can check every random result and every money number.
  - **success:** Every random result (battle, wheel, dice, wager, monster, expedition, egg, breeding, cosmetic drop) matches a commitment published before it, shown by "Check this result"; points, pot shares and claims are readable on-chain; every contract is verified and public. (FR-27, NFR-1, NFR-2)
- **CAP-29** Anti-bot
  - **intent:** Bots and account farms cannot take the pot.
  - **success:** Free eggs and faucet need a voucher per verified login or wallet with history; many accounts per device or funding wallet, or perfectly regular timing, flag an account; flagged accounts are excluded from pot payouts and gas sponsorship until cleared; a payout hold expires on its own; the four counter-metrics are measured daily. (§4.10 anti-bot, §6)
- **CAP-30** Governed admin
  - **intent:** No single key can change the rules or take funds.
  - **success:** Every parameter change and upgrade is proposed by a Safe multisig and waits out a timelock; the Safe can pause or cancel but not change rules or move funds instantly; each server key holds one narrow role. (NFR-1, DECISIONS #11)

## Constraints

- Release 1 runs on Robinhood Chain testnet 46630 only, with test funds; mainnet 4663 is later (DECISIONS #4).
- Ships all at once: testnet opens only when every FR works; the plan tests the riskiest parts first (PRD §7, §8).
- Login = Privy embedded wallet as signer + Alchemy `@alchemy/wallet-apis` smart wallet + Gas Manager; never `@account-kit/privy-integration`; EIP-7702 on the embedded wallet, ERC-4337 fallback for external wallets (DECISIONS #5, #23).
- 10 sponsored actions per player per UTC day, 20 with Season Pass; then the player pays test ETH (DECISIONS #7, #19).
- Every action that changes points, ETH, PETV, Gold, lives, status, rank, cosmetics held or ownership is a contract call; the server only signs bounded inputs (AD-1; NFR-2).
- Randomness = server commit–reveal, commitment published before the action; no VRF, Pyth or block entropy (DECISIONS #12).
- Prices are fixed in USD and paid in PETV; testnet uses server-signed quotes, mainnet Chainlink ETH/USD + Uniswap v3 30-min TWAP (DECISIONS #8).
- All contracts verified and public; a Safe multisig + timelock own every rule change and upgrade; every economy number is a timelocked parameter and tests pin the current default (DECISIONS #11, #25; AD-3, AD-18).
- Testnet Safe is 2-of-3 team signers; if the Safe web UI lacks 46630, signers use Safe Protocol Kit / CLI (DECISIONS #30; AD-3).
- No pet or Co-Pet selling or buy-out; a pet NFT moves only by mint, burn and the no-payment Co-Pet leave (DECISIONS #14, #29; AD-17).
- Asleep pets get no share of either pot until woken; the small pot counts only pets awake at the snapshot block (DECISIONS #15, #28; AD-5).
- Game Gold comes from a funded reserve under a daily cap; vault shares are never minted for game rewards (DECISIONS #16, #26).
- The effective-points curve applies per owner (sum of a wallet's pets), not per pet (DECISIONS #17).
- Wake costs no money (a feed) but cuts 10% of pot points per day asleep; no paid revive (DECISIONS #18, #27; AD-16).
- Death timer: 3 days to sleep + 7 days asleep (DECISIONS #13).
- Battles are at most 2v2; no Gladiator pet type (DECISIONS #9, #20).
- Paying the pot costs the same per claim for 10 or 1M players: no loops over players (NFR-3).
- Web / PWA only; phone and desktop browsers are equal surfaces (NFR-4).
- Light mode only; dollars first with token or ETH small underneath; no crypto jargon (EXPERIENCE Foundation, Voice and Tone).
- Off-chain data lives in the one hosted Supabase Postgres via Prisma 7.10 + `@prisma/adapter-pg`; tests use `test_` schemas and never touch live data (DECISIONS #10; NFR-6).
- Hosting: Next app on Vercel, always-on worker on Render (DECISIONS #21).
- Testnet PETV uses our own Pons-like curve and our own v2-style pool on 46630, because Pons is mainnet only (DECISIONS #22).
- Only approved dependencies; anything else needs the owner (DECISIONS #24).
- Secrets never appear in code, logs or chat (NFR-5).
- Work process: gate = install, typecheck, lint, test, then reviews; a unit parks after 3 failed gates; agents never push; integration branch `floor/mvp1` (DECISIONS #1–3).

## Non-goals

- Mainnet, real money, and mainnet legal work (launch countries, geo-blocking, age checks).
- iOS / Android store apps.
- Trading or selling pets, eggs or Co-Pets, and Co-Pet buy-out.
- Trading common cosmetics.
- Dark mode.
- VRF, Pyth or any on-chain entropy source.
- Email alerts.
- A Gladiator pet type.
- Paid revive.
- Minting Gold for game rewards.
- Offline action queueing (offline is read-only).

## Success signal

- Testnet opens with all 53 FRs working and stable, no major bugs; it reaches 100+ players with 40%+ of new players still playing after 7 days.
- Counter-metrics stay under their limits: bot accounts take at most 10% of pot payouts; the top 5% of pets take at most 50%; at most 40% of robbed new players leave in week 1; at least 30% of owners whose pet died hatch again.

## Assumptions

- Testnet retention stands in for the real-money premise, which stays untested until mainnet (PRD §8).

## Open Questions

None block release 1.

- Signer key storage (which KMS). Deferred to mainnet.
- Pons `maxCreatorTaxBps` (highest allowed trade tax). Deferred to mainnet.
- Legal: launch countries, geo-blocking and age checks. Deferred to mainnet.
