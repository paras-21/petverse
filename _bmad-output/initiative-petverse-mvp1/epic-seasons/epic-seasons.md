---
type: epic
title: "Seasons and leaderboard"
parent: initiative-petverse-mvp1
covers: [CAP-26]
after: []
assignee: ""
risk: medium
---

# Seasons and leaderboard

## Description

Players compete in 12-week seasons: a leaderboard ranks them, ranks reset each season, top players get a bonus from
the season pool (not the ETH pot) and the top 10% get a season trophy. This epic builds the leaderboard projection,
the season-end payouts through the `seasonPool` and `trophies` streams, the Season Pass reward track contents, and
the Season card and page with the Death Match Hall of Fame. Capability CAP-26 in the spec.

## Outcome

Players have a season-long goal; season participation and trophy holders are the signal.

## Done when

1. A season boundary on 46630 (with shortened test parameters) resets ranks and posts season-pool and trophy roots
   whose published datasets rebuild the same roots.
2. Top players claim their season bonus from the season pool, never from the ETH pot; the top 10% receive a
   soulbound season trophy.
3. The Season card and page show weeks left, the player's rank, the leaderboard, the season-pool bonus and the Hall of
   Fame, as in the spine.
4. The Season Pass reward track pays its rewards during the season.

## Boundaries

Season scoring and payouts. Not season boundaries themselves (SeasonPass, epic-store-pass), not the trophy item
(epic-cosmetics-market), not Death Match (epic-play-hub produces the Hall of Fame data).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-26
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Seasons, Core terms (rank)
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-5, AD-14, AD-18
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Season page), UJ-6
- decisions — docs/DECISIONS.md, #25 (N4)

## Notes

- Waits on epic-store-pass because: on-chain season boundaries in SeasonPass.
- Waits on epic-cosmetics-market because: the soulbound season trophy item.
- Waits on epic-play-hub because: Death Match Hall of Fame data and raid results for the trophies stream.
- Open question: what decides leaderboard order (rank, points or a season score), the season-pool bonus split and the reward-track contents are not in the spec; the owner sets them before inception (initiative Notes).
