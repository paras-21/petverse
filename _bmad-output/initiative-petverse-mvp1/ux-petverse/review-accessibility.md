---
title: Petverse UX spines: accessibility review
reviewed: DESIGN.md, EXPERIENCE.md, .working/key-*.html (8 mocks)
standard: WCAG 2.2 AA, plus owner asks (big text, reduce motion, keyboard play)
date: 2026-10-14
verdict: PASS WITH FIXES (no blocker to the spine direction; 2 critical gaps must be added to the spine before build)
---

# Accessibility review

## Verdict

**Pass with fixes.** The spines are better than most: the ink-on-candy rule, the reward-underline rule, live regions for
results, reduce-motion behaviour, words-plus-colour for danger, and gentle death copy are all present. But the spine
does **not** define a focus indicator at all, has **no in-app motion switch** for the auto-moving 3D pets (only the OS
setting), and the cooldown button and several small labels fail contrast. The mocks have no focus styles, no
`prefers-reduced-motion`, no ARIA beyond 2 SVG labels, and 3 coloured-text drifts that break the spine's own rule.

## Contrast table (computed with node, WCAG 2.x relative luminance)

Text: 4.5:1 normal, 3:1 large (24px, or 18.66px bold). Non-text UI and states: 3:1.

| Text | background | surface | lemon | lime | sky | orange | pink | cooldown | tints (orange / orange-row / lime / sky) | tracks (sky / orange / pink) | field | chip-neutral | stage-sky | dot | scrim over page |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `ink` | 12.98 | 14.89 | 11.25 | 7.99 | 6.94 | 6.35 | 5.25 | 10.02 | 13.45 / 13.75 / 14.00 / 13.82 | 13.19 / 11.97 / 12.22 | 14.14 | 13.15 | 9.56 | 11.14 | 5.90 |
| `ink-soft` | **4.43** | 5.08 | **3.84** | **2.73** | **2.37** | **2.17** | **1.79** | **3.42** | 4.59 / 4.70 / 4.78 / 4.72 | 4.50 / **4.09** / **4.17** | 4.83 | **4.49** | **3.26** | **3.80** | **2.01** |
| `pink-deep` | 3.72 L | 4.26 L | 3.22 L | **2.29** | **1.99** | **1.82** | **1.50** | **2.87** | 3.85 / 3.94 / 4.01 / 3.95 L | 3.78 / 3.43 / 3.50 L | 4.05 L | 3.76 L | **2.74** | 3.19 L | **1.69** |
| `surface` (white) | 1.15 | - | 1.32 | 1.86 | 2.14 | 2.35 | 2.83 | 1.49 | all < 1.25 | all < 1.25 | 1.05 | 1.13 | 1.56 | 1.34 | 2.52 |

Bold = fails for any text. L = large text only.

Non-text (UI boundaries and state indicators, need 3:1):

| Pair | Ratio | Where it matters |
|---|---|---|
| `dot` border vs `field` / `surface` | 1.27 / 1.34 | Input field boundary (fail) |
| `pink` active vs `surface` | 2.83 | Active tab, active segment, selected cosmetic ring (fail if colour is the only cue) |
| `lime` fill vs `track-pink` | 1.53 | Health bar (fail; numbers "34 / 100" rescue it) |
| `orange` vs `track-pink` / `track-orange` | 1.92 / 1.89 | Low health, hunger bar (fail) |
| `sky` vs `track-sky` | 1.90 | Expedition / boss progress (fail) |
| `lime` vs `orange` | 1.26 | Fed vs hungry timer chip (colour difference not perceivable for many) |
| `lemon` / `lime` vs `background` | 1.15 / 1.62 | Button edge; OK because the label identifies the button (1.4.11 exception) |
| `orange` icon vs `tint-orange` | 2.12 | Danger note heart icon (OK only because the sentence carries the meaning) |
| `cooldown-deep` vs `background` | 1.86 | Waiting-button shadow (decorative) |

## Findings

### Critical

**C1. No focus indicator is defined anywhere.** (DESIGN.md frontmatter `components`, Elevation section; EXPERIENCE.md
Accessibility Floor says "focus is always visible" but no spec; 0 `:focus` rules in all 8 mocks.) WCAG 2.4.7, 2.4.11.
The candy style removes default outlines naturally (white 4px border, pill shapes), and white or pink rings fail
3:1 on the pink page. Fix: add a `focus-ring` token: `outline: 3px solid {colors.ink}; outline-offset: 3px` (ink is
12.98:1 on page, 14.89:1 on white, 5.25:1+ on every candy fill), applied with `:focus-visible` to every button, pill,
tab, segment, tile, row button, avatar, pet chip, wheel, text button and sheet handle. Add a do/don't line: "Never
remove focus outline without the ink ring." Add `scroll-padding-bottom: 110px` (tab bar 70 + 22 margin + slack) so
focus is never hidden under the floating tab bar or a sheet (2.4.11 Focus Not Obscured).

**C2. Auto-moving 3D pets and fights have no in-app pause / reduce-motion switch.** (EXPERIENCE.md Accessibility
Floor, Blob stage; DESIGN.md Brand & Style.) WCAG 2.2.2 Pause, Stop, Hide: the jelly idle wobble runs forever beside
other content, and only the OS `prefers-reduced-motion` setting stops it. Many players never set that, and the owner
asked for reduce motion. Fix: add a "Calm motion" toggle in the avatar menu (default = follow OS), stored per player,
that applies every reduce-motion rule already listed. Add to the Blob stage pattern: "The 3D pet idles for at most
5 s after load or any action, then holds a still pose, unless Calm motion is off." Also add: no flashing more than 3
times a second (crit hits, confetti, hatch burst, wheel lights) (2.3.1).

### High

**H1. Cooldown button and waiting pills fail text contrast.** (DESIGN `button-cooldown` textColor `ink-soft`;
mock `.btn.off` 14px and `.spill.co` 12px.) `ink-soft` on `cooldown` = **3.42:1** at 13-14px (needs 4.5). The DESIGN
contrast table marks it "Pass AA large only", but the button is `button-sm` 13px, so it is not large. These buttons
carry the key info ("Attack in 12m"). Fix: `button-cooldown.textColor: {colors.ink}` (10.02:1) for the whole label,
keep the bold wait; show "waiting" with the flat shadow, no gloss and a clock icon, not by lighter text. Same for
grey status pills.

**H2. Cooldown button "not focusable".** (EXPERIENCE Component Patterns › Cooldown button.) Keyboard and
screen-reader users tabbing through Battle skip the very control that tells them why they cannot act; the spine's
own "hidden reasons for disabled buttons" ban is broken for them. Fix: render as `<button aria-disabled="true">`
that stays in the tab order, with accessible name "Attack, available in 12 minutes"; pressing it does nothing
(or shows the reason). Update the countdown text only on unit change.

**H3. 3D canvas has no screen-reader spec.** (EXPERIENCE Blob stage, Accessibility Floor; DESIGN Blob stage.) The
pet is "the face of the product" but there is no rule for what assistive tech gets. Fix: the canvas is
`aria-hidden="true"`; the blob stage wrapper is `role="img"` with a live-built `aria-label` ("Mochi the bunny, Lv 12,
wearing a leaf hat, hungry"), updated on state or cosmetic change (not on animation). Try-on: "Mochi trying on Star
Hat". Fight arena: `aria-hidden`, with the battle text box as the accessible record (see H4). Egg: a real
`<button>` "Tap to hatch your egg", not a bare SVG with `aria-label="Egg"` (mock key-landing-hatch line 317).

**H4. Fight and live numbers need a precise announcement plan.** (EXPERIENCE Battle text box, Number blob, Timer
chip, Accessibility Floor.) "Results announce via a live region" is good, but per-round health, hit labels, the
ever-changing pot and the sleep timer have no rule, so a build will either spam or say nothing. Fix, add to the
Floor:
- Battle text box: `role="log"`, `aria-live="polite"`, one line per round including both health values ("Round 3.
  Mochi used Carrot Kick. Pudding 34 of 100."). Hit labels `aria-hidden` (their content is in the log).
- "Skip to result" is focused when the fight starts; on result, focus moves to the result heading.
- Pot blob, points blob, timer chip: **not** live regions (pot moves with other players). Announce only the
  player's own changes ("Plus 20 points. 12,500 points.") and threshold events (hungry window starts, 1h to sleep,
  asleep) via one polite region.
- Timers render as words for AT ("2 days 14 hours until Mochi sleeps"), not "2d 14h".

**H5. Wheel and claim keyboard paths are not specified.** (EXPERIENCE Prize wheel, Claim sheet, Bottom sheet.) Fix:
wheel sheet initial focus on the sheet title; Spin is a real button; while spinning focus stays on it with
`aria-busy`; the prize is announced ("You won plus 100 points") and focus moves to the prize card's button. Claim
sheet: initial focus on the sheet title (not on Claim, so a stray Enter does not reset pot points); Tab order
amount → reset box → explainer → Claim → "Not now, keep growing"; focus trapped in the sheet; `Esc` = text button;
after claim, focus returns to the pot blob and the confirmation is announced and stays on screen (no auto-dismiss).
Specify the desktop overlay form (DESIGN Open question 1) as a `role="dialog" aria-modal="true"` with the same
rules.

### Medium

**M1. Small text versus "big text".** Not a WCAG fail, but against the owner ask: `tab-label` 10px, `money-token`
11px, `label` 12px, `caption` 12px, `button-sm` 13px, mock `.it .d` 10px and `.wal small` 10px; 53 font sizes of
9-11px in the mocks. Several are `ink-soft` on page (4.43, fails 1.4.3 at that size). Fix: floor 13px for any text,
14px for `money-token` and `tab-label`, 16px body; `ink-soft` only on `surface`, `field` or a tint at 4.5+ (never on
`background`, `dot`, `track-orange`, `track-pink`, `chip-neutral` or any candy fill). Use rem so 200% browser zoom
works (1.4.4), and test reflow at 320px for `number-xl` "Claim $42.08" and the two-up blobs (1.4.10).

**M2. Hungry vs fed timer chip is colour-led.** (DESIGN Timer chip; EXPERIENCE State Patterns.) Lime to orange is
1.26:1 and the text "3h left!" never says "hungry". Fix: hungry chip reads "Hungry · 3h left" with a different icon
(empty-heart or carrot), and drop the "!" (Voice and Tone bans exclamation marks on bad news). Low health: add the
word "Low" next to "34 / 100".

**M3. Active tab, active segment, selected tile rely on pink (2.83:1 vs white).** Fix: `aria-current="page"` on the
active tab and top-nav pill, `aria-selected` on segments (`role="tablist"`), `aria-pressed` or a check badge on the
selected cosmetic tile, plus a non-colour cue (ink 3px inner ring or bold label + underline).

**M4. Input field boundary invisible.** `dot` border on `field` = 1.27:1 (1.4.11). Fix: border `{colors.ink-soft}`
(4.83 on field) or `pink-deep` 2px; error state adds text + icon, not only colour; label is a visible `<label>`,
not placeholder.

**M5. Target sizes under the 44px preferred size.** Mock `.btn.sm` = about 33px tall (13px + 7px padding + 3px
border); Skip chip about 25px; avatar 42px; reward-track nodes 32px; Revenge `button-trouble` about 35px. All pass
24px (2.5.8) but not the 44px the owner prefers. Fix: min-height 44px for every pressable item via padding or an
invisible hit area; Skip and Revenge at least 44 x 44; space row buttons at least 8px apart.

**M6. Progress bars and health bars under 3:1 fill-to-track.** (1.92-1.53:1.) Rescued by the text values, so make
that a rule: every bar shows its value in words ("62% boss health", "3h 12m left") and has
`role="progressbar"`/`meter` with `aria-valuetext`. Add a 2px `{colors.ink}` edge on the fill end, or deepen the
fill to the `-deep` partner, if bars are ever shown without text.

**M7. Time limits and commit-reveal.** Hunger/sleep timers are an essential game mechanic (2.2.1 exception) and the
push/Telegram warnings are a good mitigation; keep them. Missing: (a) confirm that no sheet, prize card, "Leave
safely?" sheet, confirmation toast or wager acceptance auto-dismisses or auto-advances; add "No sheet or message
closes on a timer" to Interaction Primitives. (b) If commit-reveal (PRD FR-27) or a wager/2v2 match has a deadline
for the player to act, show it as a visible countdown with words, warn at least 1 minute before, and allow
extending where the protocol permits; if the server reveals automatically, say "Nothing for you to do" in the
pending state. (c) The Death Match "Leave safely?" sheet must never time out into "continue".

**M8. Financial error prevention (3.3.4) for market buys.** (EXPERIENCE Market row "small lemon Buy".) Buying from
another player in one tap from a list row has no review step. Store has the try-on step, which works as review.
Fix: market Buy opens a confirm sheet (item, seller, dollar price, token amount, 5% fee, Buy / "Not now"). Same for
the "0 free · small fee" path: the fee confirm already in the spine is good, keep it.

**M9. Mock drift breaks the spine's own colour rule.** key-battle.html line 354 "So close!" in `orange` text at 40px
(about 2.05:1 on the page, fails even large); line 314 "Carrot Kick!" in `pink` text on white (2.83:1);
key-death-match.html line 198 streak multiplier `pink` on white 18px (2.83:1). Spine wins, but fix the mocks so
builders do not copy them: ink text with an orange / pink underline or pill.

### Low

**L1. Tilted numbers.** `number-blob-points` (-1.5deg), `number-blob-pot` (+1.5deg), `timer-chip` (+2deg) and
`result-card` (-2deg) tilt numbers the player must read exactly, which the DESIGN Do/Don't table itself forbids.
Fix: tilt the blob container only and counter-rotate the number, or set those tilts to 0.

**L2. Pushes and Telegram about death need distress care.** Copy is already gentle ("passed away", no all-caps). Add:
quiet hours (no hungry / close-to-death push at night by local time unless the player opts in), a daily cap, and
make the death alert say what is still possible ("Mochi is asleep. Feed Mochi to wake, free, any time in the next
2 days"). On the Tombstone, lead with the pet (name, days lived, wins), then the money line, and give a calm second
action ("Keep Mochi's Tombstone") next to "Hatch your free egg" so a new egg does not read as an instant
replacement.

**L3. Robbery copy.** "Biscuit took 624 points from Mochi. Revenge?" is fine; keep "took" (mock line 380 says
"stole"; align to spine). Avoid stacking robbery + hungry + asleep alerts at once (the one-alert rule covers in-app;
apply it to push too).

**L4. Arrow-key pattern on tab bar / top nav.** Arrow keys inside navigation links are non-standard and conflict with
Tab-only expectations. Fix: top nav and tab bar are plain links in Tab order (`<nav>`, `aria-current`); arrow keys
only inside segmented tabs (`role="tablist"`) and the pet switcher (`role="radiogroup"`).

**L5. Skip to result / Skip onboarding must be first in focus order** of their view, and the step chip's "Step 1 of
4" must be text, not only progress dots (dots `aria-hidden`). Swipe-down to close sheets has non-drag
alternatives (scrim tap, Esc, text button), so 2.5.7 is met; keep the text button mandatory in every sheet.

**L6. Icon-only controls.** The spine requires labels for icons. Make it explicit for: avatar ("Account menu"),
close icons, the "add" egg in the pet switcher ("Start a Co-Pet with a friend"), pet chips ("Play as Mochi, Bunny Lv
12"), confetti and icon tiles (`aria-hidden`). Strike-through "instead of" values on the Pass card need the old
value in words ("was 30 minutes"), since `<s>` is not announced by most screen readers.

## What is already good

Ink text on every candy fill (5.25-11.25:1); reward text in ink with coloured underline; rarity as stars + word;
danger = words + orange; reduce-motion list covers wheel, confetti, hit labels and fights; results via a live
region; countdowns announced on unit change; focus moves into and back out of sheets; `Esc` closes sheets; confirm
sheet for loss actions; gentle death and loss copy with no all-caps; one overlay at a time.
