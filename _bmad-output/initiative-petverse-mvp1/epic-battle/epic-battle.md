---
type: epic
title: "Battles: attack, duel, 2v2, wager and dice"
parent: initiative-petverse-mvp1
covers: [CAP-10, CAP-11, CAP-12]
after: []
assignee: ""
risk: high
---

# Battles: attack, duel, 2v2, wager and dice

## Description

Players steal points from pets near their level and hit back when robbed, climb a ranked ladder alone or in pairs, and
stake PETV against each other. This epic builds the Battle module (automatic fights from stats plus luck through the
Randomness service), shields, cooldowns and revenge, ranked duels and 2v2 with off-chain matchmaking re-checked
on-chain, the Wager contract (wager and dice, 5% burn, refund on reveal timeout), the Battle tab and the Play tab shell
with its Dice card. Capabilities CAP-10, CAP-11, CAP-12 in the spec.

## Outcome

Battles give players a reason to come back every day without making new players quit; the counter-metric "at most 40%
of robbed new players leave in week 1" is the signal.

## Done when

1. On 46630 an attack only reaches pets within ±2 levels that are not protected or shielded; a win steals about 5% of
   the target's points; the robbed pet gets a 30-minute shield and one cooldown-free revenge; cooldown is 30 minutes
   (10 with an active Pass); reward and odds show before the tap.
2. Ranked duels and 2v2 run 5 a day each; the winner (or winning team, split evenly) takes 10% of the loser's points;
   rank moves Elo-style from 1,000.
3. Wager and dice: the winner takes the pot minus 5%, which is burned and shows in the burn counter; a stake is
   refunded when a reveal times out; the risk is stated before commit.
4. Contract tests pin every battle default and that the contract re-checks level range, shield, cooldown, protection
   and same-owner ban at settlement; each fight's result checks against its commitment.
5. Battle › Attack / Duel (Ranked / Wager) / 2v2, fight and result screens, and the Play tab's Dice card work as in the
   mocks and spine.

## Boundaries

Player-versus-player fights and stakes. Not Death Match, monsters or Boss Raid (epic-play-hub, which reuses this
engine), not Guild War (epic-social), not robbery alerts (epic-alerts). Owns the Play tab shell; epic-play-hub adds
the other cards.

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-10, CAP-11, CAP-12
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Core terms (similar level, rank), Battles and events
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1, AD-2, AD-4 (settle on transfer), AD-6, AD-18
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Battle, Wager, Play, Fight / Result), Component Patterns (Target row), UJ-2, UJ-5
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mock .working/key-battle.html
- decisions — docs/DECISIONS.md, #9, #12, #20

## Notes

- Waits on epic-pot because: point transfers settle both buckets first.
- Waits on epic-petv because: PETV stakes and burns for wager and dice.
- Waits on epic-store-pass because: `SeasonPass.isActive` for the 10-minute cooldown, and bought shields.
- Handoff: each fight increments the pet's battle count in PetCore (epic-pet-life owns the counters; epic-growth reads them).
- Open question: battle stats and the win-odds formula ("stats plus luck"), and wager and dice stake bounds, are not in the spec; the owner sets them before inception (initiative Notes).
- Decision: 2026-10-14 incepted into 13 entries (`tickets.toml`), one above the typical 8–12; kept as one epic because one owner builds the battle engine and its three modes, and the live testnet step (12) is a separate hitl check (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 tracer bullet = entry 1: one attack on 46630 from a bare Battle › Attack row ("Win +N · X% chance" from a contract view) through commit, reveal and settle to a result line, with 5% of the target's points moved by PetCore and PetRobbed indexed. What someone sees running: a test player robbing another test pet in the app (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 least-certain story second = entry 2: the multi-seat MatchTicket protocol (server-signed ticket, each seat joins on-chain with its own commitment, cancel after expiry) with ranked duels on it; 2v2 (5) and wager (6) reuse it (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 three contracts so lanes never share code: `Battle` (attacks, revenge), `MatchArena` (duel, 2v2, rank), `Wager` (wager and dice; tokens only, never points, AD-2); the pure `BattleMath` library and its TS port are written only by entry 1. Lanes: A Battle 1 → 3; B MatchArena 2 → 5; C Wager 6 → 7; D server queue and match indexing 4; E screens 8 → 9 → 10 → 11; live 12; sweep 13. After the tracer, lanes A, B and E (entry 8) run in parallel; `prisma/schema.prisma` is edited only by 1 then 4; each contract has its own Ignition module (Battle by 1, MatchArena by 2, Wager by 6 then 7) and the generated chain module is regenerated by 1, 2, 6, 7 and 12 in that dependency order; the MatchTicket library is written only by 2 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (13) is included; no closing end-to-end suite, since the spec has no test plan and entry 12 is the integrated live check (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 hitl steps, each on the first entry that needs it, and every deploy to 46630 waits for the owner's OK (CLAUDE.md): entry 1 — owner OKs the Battle deploy to 46630, the Safe grants GAME_MODULE on PetCore and registers Battle with Randomness through the timelock, owner funds two test players; entry 4 — owner creates the MATCHMAKER key and enters it in the local env (never printed); entry 12 — owner OKs the upgrade and new deploys, two Safe signers sign the grants, owner enters the MATCHMAKER key in Vercel's secrets, test players play each mode (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 assumed battle numbers, each a timelocked parameter pinned by tests and an owner economy decision (CLAUDE.md), carried as `unknown` on entries 1 and 6 so they wait for the owner's yes: power = 100 + 10 × level, ×0.85 while hungry, ×0.5 while asleep, ×1.10 when the pet's element beats the opponent's (cycle fire > leaf > stone > spark > water > fire; owner, DECISIONS #55, which replaces the earlier "no element edge" assumption), no species and no Pass edge; attacker win chance = A ÷ (A + D) in bps, clamped 10%–90% (same level = 50%; Lv 12 vs Lv 14 ≈ 48%; vs an asleep Lv 11 ≈ 68%); 2v2 uses each team's summed power; steal = 500 bps of the target's points (the mock's +620 on 12,400); a lost attack costs the attacker no points (mock) (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 rank: Elo-style per pet per season, start 1,000, change = 16 + clamp((loser rank − winner rank) ÷ 25, −15, +15), so ±16 at even odds and 1–31 otherwise, never below 0; keyed by `SeasonPass.seasonOf` so the season reset needs no transaction; only ranked duels move rank, 2v2 and wagers do not (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 wager and dice: stake tiers 312 / 624 / 1,560 / 3,120 PETV (about $1 / $2 / $5 / $10 at the N11 faucet rate, 312 PETV = $1), both seats stake the same tier, the only fee is the 5% burn of the pot, the winner takes 95%; a wager's winner comes from BattleMath (stats plus luck) and is matched by level ±2; dice is a 50/50 roll between two players at one open table; wagers do not count toward the 5 ranked duels a day and never move points or rank (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 attack rules the spec leaves open: cooldown is per attacking pet (AD-2 keeps cooldown timestamps in PetCore) and starts at commit, win or lose; revenge skips the cooldown and the robber's shield, once per robbery, and expires after 24 hours; attacking ends the attacker's own new-pet protection; a target with a fight pending cannot be picked by another attacker; an asleep pet cannot start a fight but can be attacked; a reveal-timeout no-op gives back the cooldown or the day's duel / 2v2 (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 duels, 2v2 and wagers are live matches: the server pairs the oldest waiting players within level ±2 and different owners and signs a MatchTicket; each player joins on-chain; nothing is spent while searching; "Team up with a friend" is an invite link (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 the fight shown is a deterministic script from the revealed seed, both powers and the on-chain winner; the contract alone decides the winner. "Check this result" itself is epic-launch's (its Done when 1); this epic's results expose the request id it needs (assumption, recommended default, DECISIONS #31).
- Decision: 2026-10-14 touch points: epic-play-hub adds the "away pet cannot battle" check to Battle and MatchArena eligibility and reuses entry 8's fight and the Play tab shell from entry 11; epic-social reuses entry 5's 2v2 settle for Guild War; epic-alerts and epic-anti-bot read entry 1's PetRobbed projection (assumption, recommended default, DECISIONS #31).
- Open question: do the assumed battle numbers above stand (odds formula, power, stake tiers)? Entries 1 and 6 carry them as `unknown`; recommended: accept as testnet defaults and tune with testnet data.
- Open question: with server-made matches, the matchmaker knows each player's next commitment secret (AD-6) and could pick pairings by outcome. Recommended: oldest-first pairing logged with each match so epic-launch can check it; a stronger fix (seed mixing a player-chosen salt) would change AD-6 and is the owner's call.
- Open question: does epic-pet-life's tutorial bot battle (FR-5) get its own fight screen before entry 8 exists? Recommended: it does, and entry 8's component replaces it later only if the owner asks.
- Open question: does epic-pet-life's PetCore expose GAME_MODULE setters for the shield and cooldown timestamps and the battle counter? Entries 1 and 3 assume it does.
- Source conflict: EXPERIENCE.md UJ-2 — 2v2 "Team up with a friend (pick from friends)" vs no friend list exists in the spec or architecture before guilds; settled by the invite-link Decision above.
- Source conflict: key-battle.html — same-level targets show 54% and 41% chances vs the assumed formula giving 50% at the same level; the mock's numbers are read as illustrative, and the formula is the owner's call.
- Source conflict: this epic's Notes said the owner sets battle stats, odds and stake bounds before inception vs inception run now; settled by the assumed numbers and the `unknown` on entries 1 and 6.
- Resolved: 2026-10-14 epic-platform and epic-pet-life are declared in epic 6's `after` in the initiative's `tickets.toml`; 6.1 and 6.3 now wait on 2.2 (status, protection, shield-until field, battle counter), 6.2 on 5.10, 6.3 on 5.6 (the one shield setter) and 5.10, 6.11 on 5.7.
- Resolved: 2026-10-14 pinned at integration: 8.7 → 6.9, 8.8 → 6.5, 8.12 → 6.12, 9.1 → 6.11, 9.2 → 6.3 and 6.5, 9.5 → 6.1 and 6.8, epic-death-match-raid 15.1/15.4 → 6.1 and 15.5 → 6.4, 10.1 → 6.2, 12.1 → 6.1, 13.10 → 6.3, 13.11 → 6.1, 14.1 → 6.12.
- Decision: 2026-10-14 the set check (validate.md) was run on the draft; applied: own Ignition modules for MatchArena and Wager, entry 4 after 5 and 6, entry 1 after 3.11, the battle counter in duels and 2v2, wager eligibility checks, the shared MatchTicket library, Wager's local burn-source registration, a season-reset check in entry 2, and Calm motion left out of entry 8 (assumption, recommended default, DECISIONS #31).
- Open question: the in-app Calm motion switch (Avatar menu, EXPERIENCE.md) has no owning entry in any epic; entry 8 honours prefers-reduced-motion only. Recommended: the epic that builds the Avatar menu adds the switch and wires it into entry 8's fight.
- Source conflict: epic-seasons Notes — epic-seasons entry 1 changes Battle to keep rank by `seasonOf` vs this epic's entry 2 keeping rank in MatchArena already keyed by `seasonOf`. Recommended: epic-battle entry 2 owns it and epic-seasons only reads MatchArena's rank views; epic-seasons' file is outside this inception.
