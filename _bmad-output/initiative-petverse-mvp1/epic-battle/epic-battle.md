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
