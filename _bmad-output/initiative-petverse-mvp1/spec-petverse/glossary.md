# Petverse glossary

| Term | Meaning |
|---|---|
| Pot points | A pet's points that set its pot share. Not tradeable. A claim resets them to 0. Shown as "points" |
| Lifetime points | All points a pet ever earned. Set its level. Never drop |
| Level | From lifetime points (game-rules.md). Never drops |
| Effective points | An owner's summed pot points after the curve: linear up to K, then slower. Stops whales and point-splitting |
| K | The effective-points knee (10,000 points on testnet) |
| Bucket | One pot-share unit: one per owner (all their solo pets), one per Co-Pet |
| ETH pot | Test ETH held by the game contracts, shared by points: 85% main pot, 15% small pot |
| Main pot | 85% share, by per-owner effective points |
| Small pot | 15% share, equal to the bottom half of awake living pets older than 7 days, paid per epoch |
| Epoch | A fixed payout period for a stream (small pot weekly, season pool and trophies per season, Guild War prize weekly) |
| Claim | Taking a pet's ETH share; resets pot points, keeps level |
| PETV | Petverse's own token (written without "$" in the UI). 1B fixed supply |
| Gold | Gold vault share coin: stake PETV, get Gold; also earned in game from a funded reserve |
| Gold reserve | The 15% PETV allocation held in the vault to pay game Gold under a daily cap |
| Burn counter | Public total of PETV burned, dollars first |
| Sponsored action | One gas-free game action; 10 a day, 20 with Season Pass |
| Faucet | Testnet-only source of test ETH and test PETV, at sign-up and daily |
| Season Pass | $7.99 per-season pass with play perks |
| Season | 12-week competition period with a leaderboard and season pool |
| Season pool | Funds for season bonuses and Guild War prizes; separate from the ETH pot |
| Season trophy | Award for a top-10% season finish; needed for Mythic |
| Good care | Fed at least once in each 24-hour window |
| Hungry | The last 24h before sleep |
| Asleep | Unfed for 3 days; earns nothing, no pot share, robbable; wake by feeding, losing 10% of pot points per day asleep |
| Dead / passed away | 7 days asleep; pet burned, Tombstone kept |
| Tombstone | Soulbound badge left when a pet dies |
| Protection | A new pet's 3 days safe from attacks |
| Shield | Time a pet cannot be attacked (30 min after a robbery, or bought) |
| Cooldown | Wait between attacks: 30 minutes (10 with Pass) |
| Revenge | One cooldown-free attack back on the robber |
| Similar level | Within ±2 levels |
| Rank | Elo-style duel rating; resets each season |
| Adult | Level 6 or more |
| Co-Pet | One pet owned and raised by two friends |
| Creator | The Co-Pet owner who hatched it; no special leave rights: whoever stays keeps the pet |
| Together bonus | Extra reward when both Co-Pet owners care on the same day |
| Memory badge | Soulbound badge for the owner who leaves a Co-Pet |
| Co-Pet leave | Leaver gets their half of the pet's unclaimed pot; the pet becomes the other owner's normal pet |
| Guild | Group of up to 10 players with one leader |
| Guild War | Sunday best-of-5 2v2 series, guild vs guild |
| Death Match | Weekend mode with 3 lives where the pet can die |
| Survivor streak | Death Match wins in a row; multiplies rewards |
| Hall of Fame | Season page list of Death Match survivors |
| Expedition | Sending a pet away 1/8/24h; Safe (sure reward) or Bold (staked, can fail) |
| Boss Raid | Up to 2 players vs the season boss, whose health is shared by all raids |
| Egg-shard | Login-streak day-7 reward; soulbound |
| Commitment / reveal | The server publishes a hash of a secret before an action and reveals the secret after; the result comes from the secret and can be checked |
| Payout hold | A temporary block on a flagged pet's claims; expires after 72h |
| Flagged / bot account | An account marked by anti-bot rules; excluded from payouts and sponsorship until cleared |
| Safe | The 2-of-3 multisig that proposes rule changes and can pause |
| Timelock | The enforced delay before any rule change or upgrade takes effect |
| Dollars first | UI rule: dollar amount large, token or ETH amount small underneath |
