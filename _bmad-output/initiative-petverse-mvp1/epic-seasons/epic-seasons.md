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
- Waits on epic-death-match-raid because: Death Match Hall of Fame route (15.3), top raid team leaves for the trophies stream (15.5) and both modules live (15.6); it was epic-play-hub before the 2026-10-14 split.
- Open question: what decides leaderboard order (rank, points or a season score), the season-pool bonus split and the reward-track contents are not in the spec; the owner sets them before inception (initiative Notes).
- Decision: 2026-10-14 incepted into 11 entries (`tickets.toml`) without the owner in the loop; every choice below is an assumption under DECISIONS #31 (recommended defaults) and is reported to the owner.
- Decision: 2026-10-14 tracer bullet = entry 1: epic-battle 6.2's ranked-duel event (season + new rank) is projected as `SeasonRank`, `seasonStandings` orders it, `/api/season` serves it and a bare Play › Season card shows week and rank; what someone sees running: on the local node, two ranked duels put a pet at #1 and a 1-hour test season boundary shows season 2 with the pet back at 1,000 (assumption, DECISIONS #31).
- Decision: 2026-10-14 least-certain story second = entry 2 (season-pool bonus root and its PETV payer path), because its split is unsettled; it carries the split as `unknown` (assumption, DECISIONS #31).
- Decision: 2026-10-14 leaderboard order = the season's Elo rank (game-rules Core terms: rank resets each season), ties by who reached it first, then lower petId; rows are pets and a player's rank row is their best pet; `seasonStandings(season, block)` from entry 1 is the one ordering that entries 2, 3 and 5 reuse (assumption, DECISIONS #31).
- Resolved: "ranks reset each season" is already delivered by epic-battle 6.2 (MatchArena keys rank by `SeasonPass.seasonOf`, a new season starts at 1,000); this epic makes no Battle change and entry 1 waits on 6.2. Handoff: 6.2's ranked-duel event must carry the season and the new rank (set check, 2026-10-14).
- Decision: 2026-10-14 top 10% = ceil(10% of pets with at least one ranked duel that season), by `seasonStandings` at the season-end snapshot; flagged and held pets are excluded through epic-pot's exclusion list; the trophies root of a season also carries epic-play-hub's top raid teams, so one root per season holds both (assumption, DECISIONS #31).
- Decision: 2026-10-14 the reward track is a new upgradeable `SeasonRewards` module (12 weekly nodes per season, contents as timelocked parameters, claimable by `SeasonPass.isActive` holders once the week starts) rather than code inside epic-store-pass's `SeasonPass` (assumption, DECISIONS #31).
- Decision: 2026-10-14 season rollover = each season gets new trophy and season-skin item ids and reward-track contents, proposed through the Safe and timelock before the boundary by an admin script (entry 8); the season skin itself is still granted by epic-store-pass at purchase (assumption, DECISIONS #31).
- Decision: 2026-10-14 lanes that never touch the same code: A contract 4 (SeasonRewards; the only Ignition edit before deploy entries 9, 10); B worker season-end jobs 1 → 2 → 3 → 8 (`prisma/schema.prisma` edited only in this lane); C app screens 5 (after 1), 6 (after 4), 7 (after 2, 3). Entries 4 and 5 run beside lane B (assumption, DECISIONS #31).
- Decision: 2026-10-14 hitl steps, each on the first entry that needs it, every deploy waiting for the owner's OK (CLAUDE.md): entry 9 — owner OKs the Battle upgrade and SeasonRewards deploy on 46630, two Safe signers sign them, owner funds the shortened-season test deploy's seasonPool stream and provides test players; entry 10 — owner confirms the season 1 start date and two Safe signers sign the genesis calls (assumption, DECISIONS #31).
- Decision: 2026-10-14 recommended season 1 start = Sunday 2027-01-03 00:00 UTC (ends Sunday 2027-03-28 00:00 UTC), or the first Sunday 00:00 UTC after testnet opens if that is later, so season weeks line up with the weekly small-pot epoch (N3) and Guild War Sunday; the owner confirms it in entry 10 (assumption, DECISIONS #31).
- Decision: 2026-10-14 Done when 1 and 2 are checked on a shortened-season test deploy (1-hour season) on 46630 in entry 9; the live 12-week season (N4) is never shortened (assumption, DECISIONS #31).
- Decision: 2026-10-14 a closing "Refactor sweep" (11) is included; no closing end-to-end suite, since the spec has no test plan and entry 9 is the integrated live check (assumption, DECISIONS #31).
- Decision: 2026-10-14 entries 4, 6 and part of 9 cite CAP-23 for the reward track, which epic-store-pass's Boundaries hand to this epic (Done when 4); the initiative breakdown lists only CAP-26 for this epic (assumption, DECISIONS #31).
- Handoff: entry 1's `seasonStandings` is the only leaderboard ordering; entries 2, 3 and 5 call it and never sort on their own.
- Handoff: epic-growth's Mythic check waits on 10.9 (trophies live on 46630), which follows entry 3 (trophy mint) and entry 8 (one trophy id per season).
- Decision: 2026-10-14 the season-pool bonus pays PETV: epic-store-pass 5.10 sends 20% of Pass income to the `seasonPool` stream, and epic-social moved Guild War Gold to its own weekly `guildWar` stream, so `seasonPool` now only holds PETV; entry 2 builds the PETV payout hook for it, which nobody else builds (assumption, DECISIONS #31).
- Open question: how many top pets share the season-pool bonus, and in what split? Entry 2 carries it as `unknown`; recommended: the top 1% of ranked pets, at least 10 and at most 100, weighted linearly by position. It is an economy number, so the owner sets it.
- Open question: what do reward-track nodes 1–11 pay? Entry 4 carries it as `unknown`; recommended: alternating 50 points and a common cosmetic, with node 12 showing the season skin.
- Resolved: 2026-10-14 epic-store-pass 5.10 now has a timelocked per-season skin id on SeasonPass (unset until set), which entries 8 and 10 set through the Safe; epic-cosmetics-market 7.5 defines each skin id (DECISIONS #50).
- Resolved: 2026-10-14 epic-platform, epic-pot, epic-petv and epic-battle are declared in epic 10's `after` in the initiative's `tickets.toml`; entries 3, 5 and 9 now wait on epic-death-match-raid 15.5, 15.3 and 15.6.
- Source conflict: AD-5 / glossary / epic-pot Notes — `seasonPool` carries Guild War Gold and pays Gold vs game-rules Money "Season Pass income: 20% season pool" (PETV) and epic-social's separate `guildWar` stream. Settled for this epic by the PETV Decision above; spine AD-5 should be updated.
- Source conflict: DESIGN.md Reward track — "final node is the season skin" vs CAP-23 / epic-store-pass Done when 4, where the Pass gives the season skin at purchase. Assumption: epic-store-pass grants it at purchase and the final node only shows it.
