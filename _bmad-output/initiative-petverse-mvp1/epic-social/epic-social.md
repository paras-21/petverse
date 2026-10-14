---
type: epic
title: "Co-Pet, guilds and Guild War"
parent: initiative-petverse-mvp1
covers: [CAP-14, CAP-15]
after: []
assignee: ""
risk: high
---

# Co-Pet, guilds and Guild War

## Description

Two friends own and raise one pet together, and friends form a guild that fights other guilds every Sunday. This epic
adds on-chain Co-Pet ownership to PetCore (its own pot bucket, 50/50 claims, two-owner approvals, the leave flow that
pays the leaver's half first), guild membership off-chain, and the weekly Guild War as a best-of-5 series of 2v2
matches whose Gold prize is paid from the reserve through the season-pool stream. Capabilities CAP-14 and CAP-15 in
the spec.

## Outcome

Players bring friends and play together; Co-Pet and guild activity is the signal the social loop works.

## Done when

1. On 46630 two players share a Co-Pet: both can care and play, same-day care gives the Together bonus, claims pay
   50/50, at most 3 Co-Pets per player; the Co-Pet has its own pot bucket.
2. Either owner leaves in one transaction: the leaver gets exactly half of the unclaimed ETH and Gold, the pet becomes
   the other owner's normal pet with the other half still claimable, the leaver gets a memory badge; no sale, buy-out
   or payment path exists; the AD-4 invariant holds.
3. Two-owner approvals are used once, expire, and are voided by any ownership change.
4. A guild of up to 10 with one leader invites and removes; one guild per player; on Sunday guilds paired by average
   level play best of 5 2v2 matches and the winning guild's Gold prize is paid from the reserve under the daily cap.
5. The Co-Pet card, invite, Leave Co-Pet sheet and the Guild / War tabs work as in the mocks and spine.

## Boundaries

Shared ownership and groups. Not breeding or Death Match themselves (epic-growth and epic-play-hub use the approvals
built here); not Co-Pet alerts delivery (epic-alerts). Co-Pet lives on Home, guilds on the Guild tab (EXPERIENCE IA).

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-14, CAP-15
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Social
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-1 (guild membership off-chain), AD-4 (Co-Pet bucket), AD-5 (Guild War dataset), AD-17, AD-22, AD-24
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Information Architecture (Home Co-Pet, Leave Co-Pet sheet, Guild), UJ-4
- design — _bmad-output/initiative-petverse-mvp1/ux-petverse/DESIGN.md, Components; mocks .working/key-home-copet.html, .working/key-guild.html
- decisions — docs/DECISIONS.md, #14, #17, #29

## Notes

- Waits on epic-battle because: 2v2 matches for the Guild War series.
- Waits on epic-pot because: per-bucket accounting for the Co-Pet bucket and the `seasonPool` stream for Guild War prizes.
- Waits on epic-petv because: the Gold reserve and daily cap.
- Decision: 2026-10-14 Co-Pet and guilds come before the play hub so Death Match can use the two-owner approvals directly (recommended default, DECISIONS #31).
- Open question: the Together bonus size and the Guild War prize size are not in the spec; the owner sets them before inception (initiative Notes).
