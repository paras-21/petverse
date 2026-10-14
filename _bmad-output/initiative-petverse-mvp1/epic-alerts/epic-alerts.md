---
type: epic
title: "Alerts in app, by web push and on Telegram"
parent: initiative-petverse-mvp1
covers: [CAP-27]
after: []
assignee: ""
risk: medium
---

# Alerts in app, by web push and on Telegram

## Description

A player learns about robbery and danger in time to act. This epic builds the notifier job in the worker (alerts from
indexed events and from time-based states through the AD-16 status port, deduped), web push through the app's service
worker with VAPID, the Telegram bot and its one-time-token linking, notification settings with per-type opt-outs, the
daily cap and quiet hours, and the in-app alert pill. Capability CAP-27 in the spec.

## Outcome

Players act on danger in time; fewer deaths from neglect and faster revenge after robbery are the signal.

## Done when

1. On testnet, a robbery produces one alert naming the attacker and the points lost, in app, by web push and on
   Telegram; hungry, asleep and near-death alerts fire on the same channels at the right moments.
2. Only one alert is sent at a time (the most urgent), pushes stay within 3 a day and per-type opt-outs, and no push is
   sent 22:00–08:00 local except close-to-death.
3. Push permission is asked after the first feed; Telegram links through a one-time token; no email exists.
4. A failed delivery is retried and logged and never shows as a game error.

## Boundaries

Alert delivery. Not the events themselves (each game epic emits them), not ops alarms (epic-launch); it hands epic-launch a send-to-team-chat function on the same Telegram bot for those alarms.

## References

- parent — _bmad-output/initiative-petverse-mvp1/initiative-petverse-mvp1.md
- spec — _bmad-output/initiative-petverse-mvp1/spec-petverse/spec-petverse.md, CAP-27
- rules — _bmad-output/initiative-petverse-mvp1/spec-petverse/game-rules.md, Alerts
- architecture — _bmad-output/initiative-petverse-mvp1/architecture-petverse/architecture-petverse.md, AD-12, AD-16, AD-19
- experience — _bmad-output/initiative-petverse-mvp1/ux-petverse/EXPERIENCE.md, Notifications, UJ-3
- design — mock _bmad-output/initiative-petverse-mvp1/ux-petverse/.working/key-sleep-death.html (push and Telegram alerts)
- decisions — docs/DECISIONS.md, #24 (`web-push`)

## Notes

- Waits on epic-battle because: `PetRobbed` events.
- Waits on epic-social because: Co-Pet request events.
- Open question: whether wheel-ready, streak-at-risk and Co-Pet-partner alerts go to push and Telegram (EXPERIENCE Notifications, "not decided").
