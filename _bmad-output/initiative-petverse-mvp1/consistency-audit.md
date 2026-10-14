# Petverse planning docs: consistency audit (after DECISIONS #37–#57)

Date: 2026-10-14. This is a read-only audit. Ticket files were skipped. The rule is that DECISIONS wins, and a later row wins over an earlier one.
Paths are relative to `_bmad-output/initiative-petverse-mvp1/`. PRD = `prd-petverse/prd-petverse.md`, GR = `spec-petverse/game-rules.md`,
SPEC = `spec-petverse/spec-petverse.md`, GL = `spec-petverse/glossary.md`, ARCH = `architecture-petverse/architecture-petverse.md`,
ON = `architecture-petverse/owner-numbers.md`, EXP = `ux-petverse/EXPERIENCE.md`, DES = `ux-petverse/DESIGN.md`.

Count: **wrong rule 14 · wrong number 2 · wording / stale 20** (36 total).

## A. Wrong rule (a doc contradicts a decision, or a build-source doc is missing a decision)

| # | Where | Other side | Right per | Fix |
|---|---|---|---|---|
| R1 | SPEC:183 lists "a confirmed bot's accrued pot ETH; a Death Match fight cap per weekend" as open owner calls | DECISIONS #56, #57 | #56, #57 | Remove both items from Open Questions |
| R2 | GR:41 Death Match row has no fight cap | DECISIONS #57 | #57 | Add "max 20 fights per pet per weekend (#57)" |
| R3 | SPEC:72 CAP-13 has no fight cap | DECISIONS #57 | #57 | Add "at most 20 fights per pet per weekend" to success; cite #57 |
| R4 | ARCH:452–453 AD-18 battle parameters have no Death Match cap | DECISIONS #57 | #57 | Add "Death Match: 20 fights per pet per weekend, timelocked param" |
| R5 | GR:132 Flags row / GR:28 On death: no rule for a confirmed bot's ETH | DECISIONS #56 | #56 | Add "confirmed bot pet (Safe-confirmed): unclaimed pot ETH recycled to main pot, points zeroed" |
| R6 | ARCH:387–393 AD-15 and ARCH:205 AD-4 "Recycled ETH" cover only buried pets | DECISIONS #56 | #56 | Add a Safe-gated `recycleBotPet(petId)`: recycle owed + pending to the main accumulator, as bury does, and zero its points |
| R7 | SPEC:120 CAP-29 has no bot ETH outcome | DECISIONS #56 | #56 | Append "a confirmed bot pet's unclaimed ETH goes back to the main pot and its points are zeroed (#56)" |
| R8 | ARCH AD-18 (ARCH:452) / AD-6: no element edge in battle math; binds list ARCH:11 stops at #54 | DECISIONS #55; GR:65 | #55 | Add "win chance = A ÷ (A + D); +10% A when attacker's element beats target's; cycle fire>leaf>stone>spark>water>fire" |
| R9 | PRD:253 FR-35 "sets the colour and a +10% damage edge against one other element"; PRD:172 "element sets its look" | GR:65, DECISIONS #37, #55 | #37, #55 | "Badge + accent look, not coat colour; +10% battle power vs the element it beats (cycle per #55)" |
| R10 | PRD:246 Guild War "Gold prize from the season pool" | GR:57, ARCH:219, DECISIONS #49 | #49 | "…from the Gold reserve via the weekly `guildWar` stream, under the N14 cap" |
| R11 | PRD:103 glossary Gold "the vault grows from game spending"; PRD:191 FR-44 same | GR:109, SPEC:105, ARCH:527, DECISIONS #53 | #53 | "vault grows only from the 2% swap-back fee in release 1" |
| R12 | PRD:279 Flags "excluded from pot payouts until cleared" | GR:132, SPEC:120, DECISIONS #40 | #40 | "excluded from epoch payouts and sponsorship until cleared; main-pot claims only delayed by a 72h payout hold" |
| R13 | DES:736, DES:737 "Get today's $2" / "today's $2 is used" | EXP:37, EXP:161, DECISIONS #47 | #47 | "Get today's PETV · $X" (live dollar value); "once today's PETV is used" |
| R14 | EXP:209 Death Match states / EXP:144: no state when the weekend cap is reached | DECISIONS #57 | #57 | Add state "20 of 20 fights this weekend · Opens Saturday" plus a fights-left status pill |

## B. Wrong number

| # | Where | Other side | Right per | Fix |
|---|---|---|---|---|
| N1 | EXP:181, EXP:288 "Mochi slept 2 days, so loses 20%" | GR:26, ARCH:404 (day = floor(time asleep ÷ 24h) + 1 → 2 full days = day 3 = 30%); DES:730 shows day 3 = keeps 70% | #27 / AD-16 | Use "Asleep · day 2 → loses 20%" (asleep 24–48h), or keep "2 days" and say 30% (3,744) |
| N2 | ARCH:450–451 AD-18 "Testnet defaults are N1–N13" | ON:28 N14, DECISIONS #26 | #26 | "N1–N14 (DECISIONS #25, #26)" |

## C. Wording / stale / placement

| # | Where | Other side | Right per | Fix |
|---|---|---|---|---|
| W1 | PRD:236 FR-25 "reward = 2× ranked duel points × streak (max 5×)" | GR:41, SPEC:72, DECISIONS #52 | #52 | "2 × (10% of opponent's pot points) × min(streak, 5), new points, not taken" |
| W2 | PRD:202 FR-48 "one free spin a day"; PRD:237 "per 24h" | GR:43, ARCH:538, DECISIONS #51 | #51 | "one free spin per rolling 24h from the last spin" |
| W3 | EXP:146 Prize wheel "One free spin a day" | GR:43, DECISIONS #51 | #51 | "One free spin every 24h from your last spin" |
| W4 | PRD:270 faucet "($10)" / "($2)"; ON:24–25 same | GR:113–114, DECISIONS #47 | #47 | "($10 / $2 at the mock rate; UI shows live value)" |
| W5 | PRD:102 glossary "$PETV launched on the Pons bonding curve" | PRD:186 FR-41, DECISIONS #22 | #22 | "testnet: our Pons-like curve; mainnet: Pons" |
| W6 | PRD:105 glossary Cooldown "30 minutes" | GR:36, GL:36 | FR-43 | "30 minutes (10 with Season Pass)" |
| W7 | PRD:192 FR-44 Gold sources "monsters and living pets" | SPEC:105 (also raids, Guild War) | #49, FR-53 | Add "Boss Raid and Guild War" |
| W8 | PRD:337 §9 Q5 "Name for Gold" open | EXP:412 OQ1 resolved, GL:17 | UX OQ1 | Mark resolved: "Gold" |
| W9 | PRD:339–341 §9 Q7, Q8, Q9 open | ARCH AD-4 (curve, Co-Pet own bucket), AD-16 (boundary is dead) | ARCH | Mark resolved, citing AD-4 / AD-16 |
| W10 | PRD:15 "DECISIONS #1–25" | DECISIONS to #57 | — | "#1–57" or drop the range |
| W11 | ARCH:11 binds `DECISIONS#1-30, #40-54` | #37, #38, #55–57 apply | — | Add #37–39, #55–57 |
| W12 | GR:6 "DECISIONS (through #55)" | #56, #57 now apply | — | "through #57" |
| W13 | SPEC:81 CAP-16 / SPEC:63 CAP-10: element shown, but no +10% edge | GR:65, DECISIONS #55 | #55 | Add "+10% battle power vs the element it beats" to CAP-16 |
| W14 | SPEC:114 CAP-27 in-app-only list has only "claim ready" | GR:142, DECISIONS #42 | #42 | Add "wheel ready, streak at risk, Co-Pet alerts in app only" |
| W15 | GL:13 Small pot omits "awake at the snapshot" and "not flagged"; EXP:107 "bottom half of living pets" omits "awake" | GR:88, DECISIONS #28, #40 | #28 | Add "awake at snapshot, not flagged" |
| W16 | EXP:109 "Gold (working name, PRD §9 #5)" | EXP:412 OQ1, GL:17 final name | UX OQ1 | "Gold (final name)" |
| W17 | EXP:159 and DES:734 streak pill "phone placement open" | EXP:422 OQ11 resolved (flame chip in phone top bar); DECISIONS #39 | #39 | "Phone: flame chip in top bar next to free-actions chip" |
| W18 | EXP:414 OQ3 "Still open: see 11"; EXP:421 OQ10 "PRD §4.10 wording needs update" (already done, PRD:223); EXP:235 "shortcut keys are not decided" vs OQ8 | EXP:419–422 | #39 | Delete the stale clauses |
| W19 | DES:697 / EXP:124 pet badge "Bunny · Lv 12 · Adult" (no element); EXP:257 "Bunny · Leaf · Baby"; DES has no element badge or accent component | DECISIONS #37 (element shows as a badge) | #37 | Define the element badge in DES Components; pick one pet-badge format, e.g. "Bunny · Leaf · Lv 12 · Adult" |
| W20 | DES:649 phone Home lists only Spin/Attack/Feed; it omits Dress up, pet switcher, Co-Pet card, Evolve/Breed | EXP:38 Home; DES:728, 729, 740 | EXP (owner placements) | Add the pet switcher above the stage, Evolve/Breed on the pet card, the Co-Pet card under the stage, and Dress up to the action row |

## Checked and consistent

These areas were checked and need no fix. Asleep pets get no share of either pot (#15). Wake is free with a 10%-per-day loss (#18, #27). The small-pot rule is the same in GR, SPEC, ARCH and PRD (#28). The Co-Pet leave flow is the same in PRD:161, SPEC:75, GR:54, ARCH AD-17 and EXP:203 (#29, #39). No pet selling anywhere (#14). The hand anchor matches (#38). The N9 hold matches (#41). Alert channels and priority match in ARCH, GR and EXP (#42, #43). "Check this result" covers all nine types (#44). The seasonPool is PETV (#48). The skin is granted at purchase (#50). The tax is taken in ETH (#54). The economy numbers (prices, splits, timers, caps, odds) agree across PRD §4.10, GR and ON, except the items above.
