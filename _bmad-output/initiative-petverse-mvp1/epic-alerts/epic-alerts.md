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

### Inception (2026-10-14, facilitator without conversation; owner accepts recommended defaults, DECISIONS #31)

- Decision: 2026-10-14 tracer bullet = entry 1: one indexed robbery → notifier → one `Notification` row → bare alert pill on Home and one desktop web push, on a local node. It proves worker, DB, API, service worker and UI connect; Telegram and iPhone are the least certain parts and come next (entries 2 and 3) (assumption, DECISIONS #31).
- Decision: 2026-10-14 lanes: A worker notifier (1 → 5 → 6 → 8 → 10), B Telegram transport (2 → 11), C PWA and push permission (3 → 4), D settings (7), E alert pill (9); 2, 3 and 5 can run in parallel after 1. Stories that edit `prisma/schema.prisma` run in one chain 1 → 2 → 7 → 8 → 10; entries 5 and 6 add no model because entry 1's `Notification.dedupeKey` holds both `(chainId, txHash, logIndex)` and `(petId, kind, sleepAt)` keys (assumption, DECISIONS #31).
- Decision: 2026-10-14 Telegram uses plain HTTPS Bot API calls with `fetch`; no bot library, so no new dependency (assumption, DECISIONS #31).
- Decision: 2026-10-14 the bot reads updates by long polling `getUpdates` in the always-on Render worker, not a webhook, so no public bot endpoint or webhook secret is needed and only one process consumes updates (assumption, DECISIONS #31).
- Decision: 2026-10-14 Telegram buttons are inline URL buttons that deep-link into the app ("Open Petverse", "Revenge", "Feed Mochi"); no callback buttons act in chat, because feed and revenge are player-signed contract calls (AD-1) (assumption, DECISIONS #31).
- Decision: 2026-10-14 the link token is 32 random bytes in base64url (43 characters, within AD-19's 64), single use, short-lived and stored hashed; `/stop` or Settings › Unlink removes the link (assumption, DECISIONS #31).
- Decision: 2026-10-14 the VAPID subject is the app's https URL, not a `mailto:`, so no email address exists anywhere in alerts (assumption, DECISIONS #31).
- Decision: 2026-10-14 "close to passing away" fires 24h before `deathAt`, mirroring the 24h hungry window (EXPERIENCE OQ4); "passed away" is sent on all three channels from `PetBuried` (AD-19 "died") (assumption, DECISIONS #31).
- Decision: 2026-10-14 urgency order for "one alert at a time": close to death > robbed > asleep > hungry > Co-Pet partner needs to agree > passed away > partner left > claim ready > wheel ready / streak at risk. The in-app pill shows the newest unread (EXPERIENCE Component Patterns); push and Telegram send only the most urgent due in a tick (assumption, DECISIONS #31).
- Decision: 2026-10-14 the daily cap of 3 counts one alert once across push and Telegram, per player per local day; quiet hours 22:00–08:00 apply to push and Telegram alike, in the IANA time zone the browser reports (UTC until one is saved); close to death is exempt from quiet hours but counts toward the cap; in-app alerts are never capped or held (assumption, DECISIONS #31).
- Decision: 2026-10-14 per-type opt-outs are one toggle per kind that applies to both push and Telegram (assumption, DECISIONS #31).
- Decision: 2026-10-14 wheel ready, streak at risk, Co-Pet partner needs to agree, partner left and claim ready are in-app only until the owner decides (entry 6); flipping one on is a settings-free template change (assumption, DECISIONS #31).
- Decision: 2026-10-14 PWA icons are rendered from an existing 3D pet model at 180/192/512 px (assumption, DECISIONS #31).
- Decision: 2026-10-14 the cap and quiet-hour values live in `GameConfig` rows written by the admin script (AD-18); entry 8 adds the rows, and the table too if no earlier epic created it (assumption, DECISIONS #31).
- Decision: 2026-10-14 a closing Refactor sweep (entry 13) is included; no closing end-to-end suite is added because the source has no test plan and entry 12 runs the Done when live (assumption, DECISIONS #31).
- Open question: should close-to-death also bypass the 3-a-day cap? Default chosen: it counts toward the cap (Done when 2 reads "pushes stay within 3 a day").
- Open question: should "claim ready" (AD-19 "claimable") go to push and Telegram? Default chosen: in-app only.
- Open question: is 24h before `deathAt` the right "close to passing away" moment? Default chosen above.
- Resolved: 2026-10-14 epic-platform, epic-pet-life, epic-pot and epic-play-hub are now declared in epic 12's `after` in the initiative's `tickets.toml` with their `needs`.
- Resolved: 2026-10-14 epic-launch 14.7 now waits on 12.11, and 14.13 on 12.12.
- Open question: who creates the `GameConfig` table? epic-store-pass 5.8 already reads thresholds from it and epic-anti-bot 13.1 says it creates it if missing; entry 8 here does the same. The owner or the earliest epic (5.8) should own it, and later epics name that entry in `after`.
- Decision: 2026-10-14 after the set check, cross-epic `after` is pinned to entries (6.1, 2.2, 2.4, 2.6, 2.8, 2.11, 3.5, 6.9, 8.2, 8.3, 9.1, 9.4); `Notification.kind` is a string so entries 5 and 6 add kinds without a migration; entry 8 adds `sentOutsideAt` for the cap; timed alerts run live on epic-pet-life's drill instance (2.11), because testnet timers are timelocked (assumption, DECISIONS #31).
- Source conflict: EXPERIENCE.md Notifications — "Not decided: when to ask for push permission, how a player links Telegram, per-event opt-outs and a daily cap" vs EXPERIENCE.md Open questions 6 and 14, which resolve all four (owner, 2026-10-14). The resolved answers are used.
- Source conflict: architecture AD-19 — time-based alerts are "hungry, asleep" and event alerts "robbed, died, claimable, Co-Pet request" vs spec CAP-27 and EXPERIENCE Notifications, which add close-to-death and do not list died or claimable. Close to death is added as a time-based kind (entry 5); died is sent as "passed away"; claimable is in-app only (entry 6).
- Source conflict: EXPERIENCE Component Patterns — the alert pill shows "one alert at a time, newest first" vs EXPERIENCE Notifications "send the most urgent". Read as: the pill orders by newest, push and Telegram by urgency.
