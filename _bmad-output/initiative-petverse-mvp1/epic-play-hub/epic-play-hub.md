---
type: epic
title: "Play hub: wheel, streak, monsters, expeditions, Death Match, Boss Raid"
parent: initiative-petverse-mvp1
covers: [CAP-13, CAP-19, CAP-20, CAP-21]
after: []
assignee: ""
risk: high
---

# Play hub: wheel, streak, monsters, expeditions, Death Match, Boss Raid

## Description

The Play tab fills with daily reasons to return and bigger weekend risks: a free wheel spin and login streak, three
monster fights a day, expeditions with a sure or a staked reward, the weekend Death Match where the pet can die, and
the season Boss Raid with shared boss health. This epic builds the Wheel, Expedition and Raid modules, the streak in
Care, monsters and Death Match on the battle engine, and their cards and screens. Capabilities CAP-13, CAP-19, CAP-20,
CAP-21 in the spec.

## Outcome

Players return daily and on weekends; daily activity on the Play tab and the 7-day retention signal show it.

## Done when

1. On 46630 the wheel gives one free spin per 24h with the set odds; the login streak pays 10 points on days 1–6 and a
   soulbound egg-shard on day 7 and resets after a missed day.
2. Three monster fights a day scale to the pet's level and each win pays Gold (from the reserve, under the cap) and 20
   points; expeditions run 1, 8 or 24 hours, Safe pays 10 / 40 / 100 points, Bold stakes PETV for 3× with a 30% chance
   to fail and burn the stake, and an away pet cannot battle.
3. Death Match opens Saturday 00:00 – Sunday 23:59 UTC to adult pets with 3 lives; a loss costs a life, 0 lives is
   death; leaving is safe at any time and keeps streak rewards and a Hall of Fame spot; lives refill 1 per 7 days of
   good care; a Co-Pet enters only with both owners' approvals.
4. Boss Raid teams of up to 2 damage a season boss whose health is shared across all raids; damage pays points and
   Gold; the top raid teams get a cosmetic through the trophies stream.
5. Every result above checks against its commitment, and the Play tab cards and sheets work as in the mocks and spine.

## Boundaries

Player-versus-game activities on the Play tab. Not the Play tab shell or Dice (epic-battle), not the Season card and
page (epic-seasons), not alerts for wheel and streak (epic-alerts).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-13, CAP-19, CAP-20, CAP-21
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Battles and events, Growth (expeditions)
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1, AD-2, AD-5 (trophies stream), AD-6, AD-16 (death in Death Match), AD-17 (approvals), AD-18, AD-24
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Play, Wheel sheet), UJ-6, UJ-7, Short flows
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mocks .working/key-play-hub.html, .working/key-death-match.html
- decisions — docs/DECISIONS.md, #9, #20

## Notes

- Waits on epic-battle because: the battle engine and the Play tab shell.
- Waits on epic-cosmetics-market because: cosmetic prizes (wheel, raid) and the soulbound egg-shard item.
- Waits on epic-social because: two-owner approvals for Co-Pet Death Match entry.
- Decision: 2026-10-14 the four play activities stay one epic as the owner suggested, grouped by the Play tab surface and one owner; offer a split (Death Match + Boss Raid apart) at inception if the breakdown passes 12 entries (recommended default, DECISIONS #31).
- Handoff: each expedition increments the pet's expedition count in PetCore (epic-pet-life owns the counters; epic-growth reads them).
- "Adult" here means level 6 or more read from PetCore (game-rules Core terms), so Death Match does not wait on epic-growth.
- Open question: monster and boss stats, boss health per season, Bold stake bounds and egg-shard use are not in the spec; the owner sets them before inception (initiative Notes).
