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
- Open question: the Together bonus size and the Guild War prize size are not in the spec; the owner sets them before inception (initiative Notes). Inception went ahead with the assumed values below; the owner confirms or changes them before entries 4 and 10 start.

### Inception (2026-10-14, facilitator without conversation, DECISIONS #31)

- Decision: 2026-10-14 tracer bullet = entry 1: a 7-day Co-Pet invite link hatches a shared egg on 46630 and shows in both pet switchers, cutting through API (invite row), voucher signer, PetCore (coOwner, Co-Pet bucket, ownershipEpoch, max 3), indexer and Home UI (assumption, DECISIONS #31).
- Decision: 2026-10-14 the least-certain story comes second: entry 2, the 50/50 claim and the one-transaction leave with the AD-4 invariant extended (assumption, DECISIONS #31).
- Decision: 2026-10-14 lanes: PetCore Co-Pet code 1 → 2 → 4 (4 waits on 2 only because both edit PetCore); CoPetApprovals 3 (its own contract, so approvals never collide with PetCore work); Home screens 5; guild API 6 → Guild segment 7; Battle Guild War mode 8; worker War job 9 → prize 10 → War segment 11; live drill 12; Refactor sweep 13 closes the epic. Entries 6–7 run beside 2–5, and 8 beside everything once epic-battle is done (assumption, DECISIONS #31).
- Decision: 2026-10-14 entry 1 owns every Prisma model this epic adds (CoPetInvite, Guild, GuildMember, GuildInvite, GuildJoinRequest, GuildWar, GuildWarMatch) in one migration, so the lanes never edit `prisma/schema.prisma` at the same time; 6 and 9 wait on it for that reason (assumption, DECISIONS #31).
- Decision: 2026-10-14 13 entries, one past the typical 8–12. A split is offered: epic-social-copet (entries 1–5, 12 Co-Pet half) and epic-guild-war (entries 6–11, 12 War half), each with its own sweep. Recommended default: keep one epic, because one owner, one PetCore-plus-worker footprint and one testnet drill deliver both and the split would add a second sweep and drill (assumption, DECISIONS #31). The owner may still ask for the split.
- Decision: 2026-10-14 no closing end-to-end suite: the source has no test plan; entry 12's testnet drill is the integrated check (assumption, DECISIONS #31).
- Decision: 2026-10-14 hitl steps: entry 1, owner OKs the PetCore upgrade on 46630 through the Safe and timelock (CLAUDE.md: deploys need the owner) and two testers run the invite; entry 12, owner OKs the upgrades of PetCore, Battle, EpochDistributor, GoldVault and the CoPetApprovals deploy, the Safe signers sign the timelock proposals, the owner adds the GUILD_WAR signer key to the Render secret store, and two players run the drill (assumption, DECISIONS #31).
- Decision: 2026-10-14 a Co-Pet is a new egg the two friends hatch together (invite mock: "you hatch a new egg together"); an existing pet cannot become a Co-Pet. The egg is free and voucher-gated like the starter egg; the inviter holds the NFT and the friend is `coOwner` (assumption, DECISIONS #31).
- Decision: 2026-10-14 Co-Pet invites are off-chain rows (AD-1); acceptance goes on-chain only through a voucher-signed `hatchCoPet` input bound to both addresses and the invite id, with a 7-day expiry (EXPERIENCE OQ15) (assumption, DECISIONS #31).
- Decision: 2026-10-14 two-owner approvals live in a separate CoPetApprovals contract that reads PetCore's `ownershipEpoch`; AD-17's "voided by any ownership change" = an approval recorded under an older epoch is void. Approval expiry 24 hours (assumption, DECISIONS #31).
- Decision: 2026-10-14 Together bonus = +10% on the points the Co-Pet earns for the rest of a UTC day once both owners have fed it that day, applied by PetCore (AD-2), additive with the Season Pass +25% (assumed number, DECISIONS #31; owner decision per AD-18).
- Decision: 2026-10-14 shared streak = consecutive UTC days on which both owners fed the Co-Pet; a missed day resets it to 0; it is shown on the Co-Pet card and pays nothing extra in release 1 (assumption, DECISIONS #31).
- Decision: 2026-10-14 guilds: names 3–24 characters, unique; guild invite links expire after 7 days; a guild's average level = mean of each member's highest living pet level; a leaving leader passes the lead to the longest-standing member; the last member leaving closes the guild (assumed values, DECISIONS #31).
- Decision: 2026-10-14 Guild War: rosters freeze and guilds pair at Sunday 00:00 UTC; a guild needs at least 4 members with a living pet; pairing sorts by average level and pairs neighbours, the odd one gets a bye; 5 match slots at 12:00, 14:00, 16:00, 18:00, 20:00 UTC, lineups lock 10 minutes before, an empty lineup forfeits; each member plays at most 2 matches; first to 3 wins; War matches move no points and do not count toward the 5-a-day 2v2 limit (assumed values, DECISIONS #31; owner decision per AD-18).
- Decision: 2026-10-14 Guild War prize = 5,000 Gold per winning guild (mock shows an illustrative 4,800), shared equally by the frozen roster; the `guildWar` stream's weekly allowance is 50,000 Gold (up to 10 winning guilds); payouts count toward the N14 daily cap and over-cap Gold stays claimable on a later day (assumed numbers, DECISIONS #31; owner decision per AD-18).
- Decision: 2026-10-14 Guild War Gold uses its own weekly `guildWar` stream in EpochDistributor, not `seasonPool` (see Source conflict below), and this epic builds the capped GoldVault payer path that epic-petv left to it (epic-petv Notes) (assumption, DECISIONS #31).
- Decision: 2026-10-14 the key-guild mock's "Join" on near-level guilds sends a join request the leader accepts, so the leader still controls membership (FR-31) (assumption, DECISIONS #31).
- Source conflict: AD-5 / glossary — Guild War Gold is in the `seasonPool` stream, whose epoch is one season (N4) vs N5 and game-rules: the Guild War prize epoch is weekly. Resolved by assumption above (separate weekly `guildWar` stream); spine AD-5 should be updated.
- Source conflict: game-rules Social / glossary "Season pool: funds for … Guild War prizes" vs AD-24 "Guild War Gold prizes come from the same reserve". Resolved by assumption: the Gold comes from the Gold reserve; Season Pass income's 20% season-pool share is not used for Guild War.
- Source conflict: key-home-copet.html shows "Together bonus +2 hearts" vs AD-2 (a PetCore points multiplier). Assumed the multiplier; the card copy shows the bonus as points.
- Source conflict: EXPERIENCE "Co-Pet left" copy "Pudding goes back to Sam, who hatched it" vs the invite mock ("you hatch a new egg together") and glossary "Creator: no special leave rights". Copy should read "Pudding stays with Sam".
- Source conflict: key-guild.html shows "Join" buttons on near-level guilds vs CAP-15 "one leader who invites". Resolved by the join-request assumption above.
- Source conflict: epic-pot Notes say epic-petv sets the `seasonPool` Gold payout hook vs epic-petv Notes say the capped Guild War payer path is epic-social's. This epic builds it (entry 10).
- Open question: is the Co-Pet egg free (assumed) or a paid store egg, and who pays?
- Open question: should the shared streak pay anything (assumed: display only)?
- Open question: does a Guild War 2v2 move points like a normal 2v2 (assumed: no points, Gold prize only)?
- Open question: may a player join another guild straight after leaving one (assumed: yes; frozen rosters stop prize hopping)?
- Decision: 2026-10-14 entry 1 needs epic-pet-life (PetCore, voucher signer, soulbound badge base) but cites only 3.2, which itself waits on the whole of epic-pet-life; this keeps `after` inside the epics the initiative declares for epic-social (assumption, DECISIONS #31).
- Decision: 2026-10-14 set check applied: entry 1 waits on 4.6 and entry 4 on 3.3 (PetCore edits), entry 5 on 3.8 (Home pot blob), entry 7 on epic-battle (target row) and owns the Guild tab shell; entry 1 states either owner may feed, play and battle; handoffs (CoPetLeft event, average-level and eligibility rule, signed match struct, prize proofs) named in both entries. Entry 4 keeps `after = [2]` only to serialize PetCore edits (assumption, DECISIONS #31).
- Open question: entry 1 is a heavy tracer (contract, API, voucher, indexer, UI, all 7 models); kept as one story by default; the owner may split "models" out.
- Resolved: 2026-10-14 pinned at integration: epic-death-match-raid 15.1 (was 9.8) and 11.2 → 8.3, 11.8 → 8.5, 12.6 → 8.2 and 8.3; this epic's 8.7 → 6.9, 8.8 → 6.5 and 8.12 also waits on 6.12 (Battle upgraded live).
