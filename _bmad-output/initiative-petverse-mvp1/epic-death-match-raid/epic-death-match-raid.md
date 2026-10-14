---
type: epic
title: "Weekend events: Death Match and Boss Raid"
parent: initiative-petverse-mvp1
covers: [CAP-13]
after: []
assignee: ""
risk: high
---

# Weekend events: Death Match and Boss Raid

## Description

The Play tab gets its two big-risk events: the weekend Death Match, where a pet with 3 lives can die, and the season
Boss Raid, where teams of up to 2 wear down one boss whose health every raid shares. This epic builds the DeathMatch
and Raid modules on epic-battle's fight engine and epic-play-hub's PetCore play hooks, their cards, run and raid
screens, the Death Match leaderboard and Hall of Fame, and the top-raid-team leaves for the trophies stream.
Capability CAP-13 in the spec, plus the Boss Raid part of CAP-20 (CAP-20 is covered by epic-play-hub).

## Outcome

Players come back on weekends and through the season for bigger, riskier rewards; weekend Play-tab activity and the
7-day retention signal show it.

## Done when

1. On 46630 Death Match opens Saturday 00:00 – Sunday 23:59 UTC to adult pets with 3 lives; a loss costs a life, 0
   lives is death (the AD-16 bury path); leaving is safe at any time and keeps streak rewards and a Hall of Fame spot;
   lives refill 1 per 7 days of good care; a Co-Pet enters only with both owners' approvals.
2. Boss Raid teams of up to 2 damage a season boss whose health is shared across all raids; damage pays points and
   Gold (from the reserve, under the cap); the top raid teams' leaves name their cosmetic for epic-seasons' trophies
   root.
3. The Death Match leaderboard and Hall of Fame are served from one public route that epic-seasons' Season page reads.
4. Every Death Match and raid fight checks against its commitment, and the Death Match and Boss Raid cards, sheets and
   screens work as in the mocks and spine.
5. DeathMatch and Raid are deployed through the Safe and timelock, verified on Blockscout, and run live on testnet 46630
   with the app on Vercel and the worker on Render.

## Boundaries

The two weekend / season events on the Play tab, one owner. Not the PetCore play hooks (lives, inDeathMatchRun,
awardGold, loseLife) or the play module interfaces and read models (epic-play-hub 9.2, 9.3, which this epic builds on);
not wheel, streak, monsters or expeditions (epic-play-hub); not the Play tab shell, Dice or the fight engine
(epic-battle); not Co-Pet approvals (epic-social 8.3, consumed here); not the trophies epoch or the Season page
(epic-seasons); not the "Check this result" sheet (epic-launch).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-13, CAP-20 (Boss Raid part)
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Battles and events
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1, AD-2, AD-5 (trophies stream), AD-6, AD-16 (death in Death Match), AD-17 (approvals), AD-18, AD-24
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Play), UJ-6, UJ-7
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mocks .working/key-play-hub.html, .working/key-death-match.html
- split from — _bmad-output/initiative-petverse-mvp1/epic-play-hub/epic-play-hub.md (entries 8–12 and the DeathMatch / Raid part of 13)
- decisions — docs/DECISIONS.md, #9, #20

## Notes

- Waits on epic-play-hub because: PetCore play hooks (lives, inDeathMatchRun, awardGold, loseLife), the module interfaces and read models, and the live PetCore play upgrade (9.2, 9.3, 9.13).
- Waits on epic-battle because: the battle engine, MatchQueue and the fight view (6.1, 6.4, 6.8).
- Waits on epic-social because: Co-Pet two-owner approvals for Death Match entry, live (8.3, 8.12).
- Waits on epic-store-pass because: `SeasonPass.seasonOf` for the season boss (5.10).
- Waits on epic-cosmetics-market because: the raid prize item from the catalogue (7.3).
- Waits on epic-platform because: the Randomness service (1.16).
- Decision: 2026-10-14 split at inception: Death Match and Boss Raid leave epic-play-hub as this epic, because the play-hub breakdown passed 12 entries and these two events are one weekend / season risk surface; entries keep their content and take new ids 1–5 (epic-play-hub 8 → 1, 9 → 2, 10 → 3, 11 → 4, 12 → 5); entry 6 takes the DeathMatch / Raid part of epic-play-hub 13 and entry 7 is this epic's Refactor sweep (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 this epic covers CAP-13; CAP-20 stays in epic-play-hub's `covers` (monsters), and this epic delivers its Boss Raid part (entries 4, 5, 6), as both envelopes say (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 tracer bullet = entry 1 (the DeathMatch module on the fight engine with lives and death through epic-play-hub 9.2's hooks); least certain = entry 4 (shared season boss health). Lanes: A Death Match 1 → 2 → 3; B Boss Raid 4 → 5; live 6; Refactor sweep 7. No closing end-to-end suite: the source has no test plan and entry 6 checks the Done when live (owner recommended defaults, DECISIONS #31).
- Decision: 2026-10-14 Death Match rules (assumption, DECISIONS #31, carried from epic-play-hub): window Saturday 00:00:00 – Sunday 23:59:59 UTC as timelocked parameters; one run per pet per weekend; the opponent is another pet in a run this weekend within ±2 levels, chosen by the player from a list and re-checked on-chain, and only the challenger's lives and streak change; reward = 2 × (10% of the opponent's pot points) × min(streak, 5), awarded as new points on each win (not taken from the opponent); leave is allowed between fights; the keeper closes open runs as safe exits after the window; a pet in a run cannot go on an expedition.
- Decision: 2026-10-14 Boss Raid numbers (assumption, DECISIONS #31, carried from epic-play-hub): one boss per season with 5,000,000 health; teams of 1 or 2 formed on-chain when the invited or matched partner joins; one raid per pet per UTC day; each pet earns 1 point per 10 damage and 1 Gold per 100 damage; raids close for the season once health is 0; the top 10 raid teams by season damage get one epic-rarity raid cosmetic per member, its item id a timelocked Raid parameter chosen from epic-cosmetics-market's catalogue (7.3), paid through epic-seasons' trophies root (10.3).
- Handoff: entry 3's Hall of Fame route is what epic-seasons 10.5 reads; entry 5's top-raid-team leaves function is what epic-seasons 10.3 adds to the trophies root; entries 1 and 4 increment the PetCore battle counter (epic-growth reads it).
- Decision: 2026-10-14 Death Match cap = 20 fights per pet per weekend, a timelocked parameter enforced by entry 1 (owner, DECISIONS #57); the win reward formula is DECISIONS #52.
- Open question: every other number above is an assumption until the owner confirms it; entry 6 carries this as its `unknown`.
- Source conflict: game-rules Death Match "reward = 2× ranked duel points × streak (max 5×)" vs ranked duel = winner takes 10% of the loser's points: at 5× a transfer would take all of the loser's points, so the reward is read as new points awarded, not taken (assumption above).
- Source conflict: CAP-20 Done when "top raid teams get a cosmetic through the trophies stream" vs epic-seasons owning the trophies epoch (10.3); this epic delivers the leaves (entry 5) and epic-seasons checks the live claim.
