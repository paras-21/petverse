---
type: epic
title: "Play hub: wheel, streak, monsters and expeditions"
parent: initiative-petverse-mvp1
covers: [CAP-19, CAP-20, CAP-21]
after: []
assignee: ""
risk: high
---

# Play hub: wheel, streak, monsters and expeditions

## Description

The Play tab fills with daily reasons to return: a free wheel spin and login streak, three monster fights a day and
expeditions with a sure or a staked reward. This epic builds the Wheel and Expedition modules, the streak in Care,
monsters on the battle engine, their cards and screens, and the PetCore play hooks (lives, away, game Gold, death in
Death Match) and play module interfaces that epic-death-match-raid builds on. Capabilities CAP-19, CAP-20 and CAP-21 in
the spec; the Boss Raid part of CAP-20 and all of CAP-13 are delivered by epic-death-match-raid.

## Outcome

Players return daily; daily activity on the Play tab and the 7-day retention signal show it.

## Done when

1. On 46630 the wheel gives one free spin per 24h with the set odds; the login streak pays 10 points on days 1–6 and a
   soulbound egg-shard on day 7 and resets after a missed day.
2. Three monster fights a day scale to the pet's level and each win pays Gold (from the reserve, under the cap) and 20
   points; expeditions run 1, 8 or 24 hours, Safe pays 10 / 40 / 100 points, Bold stakes PETV for 3× with a 30% chance
   to fail and burn the stake, and an away pet cannot battle.
3. PetCore on 46630 carries the play hooks epic-death-match-raid needs: every pet has 3 lives refilled 1 per 7 days of
   good care, a last life lost runs the AD-16 bury path, and game Gold is paid from the reserve under the cap.
4. Every result above checks against its commitment, the Play tab cards and sheets work as in the mocks and spine, and
   the Wheel, Monster and Expedition modules run deployed and verified on 46630 with the app on Vercel and the worker
   on Render.

## Boundaries

Daily player-versus-game activities on the Play tab. Not the Play tab shell or Dice (epic-battle 6.7, 6.11; the card
registry of entry 1 sits in that shell), not Death Match or Boss Raid (epic-death-match-raid), not the Season card and
page (epic-seasons), not alerts for wheel and streak (epic-alerts).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-19, CAP-20, CAP-21 (CAP-13 lives hooks for epic-death-match-raid)
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Battles and events, Growth (expeditions)
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1, AD-2, AD-5 (trophies stream), AD-6, AD-16 (death in Death Match), AD-17 (approvals), AD-18, AD-24
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Play, Wheel sheet), UJ-6, UJ-7, Short flows
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mocks .working/key-play-hub.html, .working/key-death-match.html
- decisions — docs/DECISIONS.md, #9, #20

## Notes

- Waits on epic-battle because: the battle engine and the Play tab shell.
- Waits on epic-cosmetics-market because: the random cosmetic drop for wheel prizes and the soulbound egg-shard item.
- Waits on epic-platform because: worker, Vercel app, upgrade-safety validator, live governance base and the Randomness service.
- Waits on epic-pet-life because: UI kit, Care and food balance, burial path, Home screen and the live pet-life deploy.
- Waits on epic-petv because: PETV for Bold stakes and burns, PetCore Gold counter payment and the live token layer.
- Decision: 2026-10-14 the four play activities stay one epic as the owner suggested, grouped by the Play tab surface and one owner; offer a split (Death Match + Boss Raid apart) at inception if the breakdown passes 12 entries (recommended default, DECISIONS #31).
- Handoff: each expedition increments the pet's expedition count in PetCore (epic-pet-life owns the counters; epic-growth reads them).
- "Adult" here means level 6 or more read from PetCore (game-rules Core terms), so Death Match does not wait on epic-growth.
- Open question: monster and boss stats, boss health per season, Bold stake bounds and egg-shard use are not in the spec; the owner sets them before inception (initiative Notes). At inception the owner was not asked (run instruction): recommended values are recorded below as assumptions and entry 13 holds the live deploy until the owner confirms them.
- Decision: 2026-10-14 inception: 14 entries in `tickets.toml` (assumption, DECISIONS #31). Tracer bullet = entry 1: one daily wheel spin on a Hardhat local node through the Wheel module → Randomness (1.16) → PetCore points / food / cosmetic drop → own Ignition module → generated chain module → WheelSpun projection → Play hub Wheel card, wheel sheet and prize card; it also lays the Play hub card registry (one file per card in epic-battle's shell, 6.11) that later entries fill. The tracer stays local; entry 13 takes everything to 46630.
- Decision: 2026-10-14 sequencing (assumption, DECISIONS #31): entry 2 (PetCore play hooks: lives and care refill, awayUntil checked by Battle and MatchArena, game Gold through the unpaid counter, death in Death Match through the AD-16 bury path) follows the tracer as the least-certain story, because it changes PetCore storage and the death path every later module relies on. Entry 3 then fixes the shared boundary (module interfaces and events, every Prisma read model in one migration, empty handlers, the usePetAvailability hook) so lanes never touch the same file. Lanes after 3, side by side: A streak (4); B monsters (5); C expeditions (6 → 7); D Death Match (8 → 9 → 10); E Boss Raid (11 → 12). Entry 13 deploys everything live (hitl); entry 14 is the Refactor sweep. Each module adds its own Ignition module file, composed by entry 13 (as epic-petv). No closing end-to-end suite: the source has no test plan and entry 13 checks the Done when live.
- Decision: 2026-10-14 split (assumption, DECISIONS #31): the breakdown passes 12 entries, so a split is recommended: a new epic "Weekend events: Death Match and Boss Raid" taking CAP-13 and the Boss Raid half of CAP-20 (entries 8–12 and their part of 13), this epic keeping wheel, streak, monsters and expeditions (entries 1–7, 13, 14). Entries 2 and 3 stay here and the new epic waits on them. Done at integration the same day (see the split Decision below).
- Decision: 2026-10-14 Dice stays in epic-battle (6.7, 6.11) as this epic's Boundaries and the initiative's shared-components decision say; this epic does not cover CAP-12 (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the "Check this result" sheet is epic-launch's (its entry 3 adds the link to monster, expedition and wheel results); this epic emits each result's requestId and pins every result to its revealed seed in contract tests (recommended default, DECISIONS #31).
- Decision: 2026-10-14 the wheel resets on a rolling 24h per player (spec CAP-21 "per 24h", mock "Next spin in 23h 59m"), not at UTC midnight; prizes go to the pet chosen in the switcher (assumption, DECISIONS #31; see Source conflict below).
- Decision: 2026-10-14 the login streak is per player and per UTC day, checked in by one sponsored call the app sends on the player's first open of the day; 10 points go to the chosen pet on days 1–6, day 7 mints the egg-shard, then a new 7-day cycle starts; a missed UTC day resets to day 1 (assumption, DECISIONS #31).
- Decision: 2026-10-14 monster numbers (assumption, DECISIONS #31): 3 fights per pet per UTC day; the monster has the pet's level and 90% of the BattleMath power of an average pet at that level (about 60% win odds); a win pays 20 points + 10 Gold (Gold through the unpaid counter, under the daily cap); a loss costs nothing; a monster fight counts as a battle action.
- Decision: 2026-10-14 expedition rules (assumption, DECISIONS #31): one trip per pet at a time, no recall; Bold "3× the reward" = 3× the Safe points (30 / 120 / 300) with the stake returned on success; Bold stake bounds 100–5,000 PETV (timelocked); the fail roll's commitment is revealed at send and applied at return; an away pet cannot attack, duel, play 2v2, fight monsters, raid or enter Death Match, but can still be attacked (so a trip is not a free shield).
- Decision: 2026-10-14 Death Match rules (assumption, DECISIONS #31): window Saturday 00:00:00 – Sunday 23:59:59 UTC as timelocked parameters; one run per pet per weekend; the opponent is another pet in a run this weekend within ±2 levels, chosen by the player from a list and re-checked on-chain, and only the challenger's lives and streak change; reward = 2 × (10% of the opponent's pot points) × min(streak, 5), awarded as new points on each win (not taken from the opponent), so a safe leave or a loss above 0 lives keeps them and death removes them with the pet; leave is allowed between fights; the keeper closes open runs as safe exits after the window; a pet in a run cannot go on an expedition; lives are stored as lives lost so every pet starts at 3; a life comes back after 7 consecutive good-care windows, up to 3, and a missed window restarts the count.
- Decision: 2026-10-14 Boss Raid numbers (assumption, DECISIONS #31): one boss per season with 5,000,000 health; teams of 1 or 2 formed on-chain when the invited or matched partner joins; one raid per pet per UTC day; each pet earns 1 point per 10 damage and 1 Gold per 100 damage; raids close for the season once health is 0; the top 10 raid teams by season damage get one epic-rarity raid cosmetic per member, its item id a timelocked Raid parameter chosen from epic-cosmetics-market's catalogue (7.3), paid through epic-seasons' trophies root (10.3).
- Handoff: entry 2's awardGold adds to PetCore's unpaid Gold counter that epic-petv 4.6 pays through creditFromGame under the daily cap; entry 5 calls it (and epic-death-match-raid 15.4, was 11). Entry 5 (and 15.1 and 15.4, were 8 and 11) increments the battle counter and entry 6 the expedition counter (epic-pet-life owns the counters; epic-growth 11.1 reads them).
- Handoff: epic-death-match-raid 15.3's (was 10) Hall of Fame route is what epic-seasons 10.5 reads; 15.5's (was 12) top-raid-team leaves function is what epic-seasons 10.3 adds to the trophies root; entry 1's WheelSpun and entry 4's StreakChecked projections are what epic-alerts 12.6 reads for "wheel ready" and "streak at risk".
- Resolved: 2026-10-14 whole-epic waits on epic-play-hub are pinned: 10.3 → 15.5 and 10.5 → 15.3 (moved with the split), 11.1 → 9.13 (expedition counters and the live PetCore play upgrade), 12.6 → 9.1 and 9.4.
- Resolved: 2026-10-14 epic-platform, epic-pet-life and epic-petv are declared in epic 9's `after` in the initiative's `tickets.toml`; epic-store-pass and epic-social are no longer needed here (only the moved Death Match and Boss Raid entries used them; they are declared for epic-death-match-raid).
- Open question: every number above is an assumption until the owner confirms it; entry 13 carries this as its `unknown` so nothing goes live on assumed numbers. Also open: a cap on Death Match fights per weekend (each win at streak 5 awards 100% of the opponent's pot points as new points, which dilutes the pot fast)? Does the daily check-in count toward the 10 sponsored actions? What is the egg-shard used for (initiative open question)?
- Source conflict: CAP-21 / game-rules "1 free spin per 24h" and key-play-hub.html "Next spin in 23h 59m" vs architecture Consistency Conventions "'day' = UTC day for caps, faucet and wheel". Followed the spec (rolling 24h); the owner confirms.
- Source conflict: game-rules Death Match "reward = 2× ranked duel points × streak (max 5×)" vs ranked duel = winner takes 10% of the loser's points: at 5× a transfer would take all of the loser's points, so the reward is read as new points awarded, not taken (assumption above).
- Source conflict: AD-2 "PetCore alone stores … lives" vs epic-pet-life's breakdown, which adds no lives; entry 2 adds them.
- Source conflict: Done when 4 "top raid teams get a cosmetic through the trophies stream" vs epic-seasons owning the trophies epoch (10.3); this epic delivers the leaves (entry 12) and epic-seasons checks the live claim.
- Decision: 2026-10-14 set check (independent validator) applied (assumption, DECISIONS #31): entry 11 pinned to 5.10; an inDeathMatchRun flag in PetCore (entry 2) set by DeathMatch (8) and checked by Expedition (6); entry 3 owns every new contract's generated-chain-module entry and wires usePetAvailability into the Play card slot and the Home and Battle buttons, so entry 7 adds only expedition copy; random raid partners reuse epic-battle 6.4 MatchQueue with a raid mode (entry 12), which also gained the UJ-7 Empty and Error states; entry 1 gained the Prize wheel reduce-motion rule; entry 13 also waits on 2.11 and 5.13. Its ASK items (owner numbers before lanes start, a Death Match fight cap, egg-shard use, the split, the wheel reset, check-in vs the sponsored cap) are the open questions above.
- Open question: should the owner confirm the assumed numbers before entries 2–12 start, not only before entry 13? Wrong game rules (not just values) would mean contract rewrites.
- Decision: 2026-10-14 split at inception, as recommended above: entries 8–12 (Death Match module, card and run, leaderboard and Hall of Fame, Boss Raid module, Boss Raid card and top-team leaves) move with their content to the new epic-death-match-raid as 15.1–15.5, with the DeathMatch / Raid part of entry 13 becoming 15.6; CAP-13 moves with them, CAP-20 stays here (monsters) with its Boss Raid part delivered there. This epic keeps ids 1–7, 13 and 14, leaves the gap 8–12 (`next_id = 15` in `tickets.toml`), entry 13 deploys only Wheel, Monster and Expedition with the PetCore play upgrade, and the Refactor sweep (14) waits on 1–7 and 13; entries 2 and 3 stay here and epic-death-match-raid waits on them (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 the Death Match and Boss Raid numbers and Source conflicts above moved with the split and are kept in epic-death-match-raid.md Notes; they stay here only as history (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 entry 2's awayUntil check edits Battle and MatchArena, so it waits on epic-battle's Refactor sweep (6.13) and entry 13 upgrades both on 46630 with PetCore (tree check, owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 the Play hub card registry (entry 1) is wired into epic-battle 6.11's Play tab shell, which owns the Dice card; this epic has no dice entry (owner recommended defaults, DECISIONS #31).
