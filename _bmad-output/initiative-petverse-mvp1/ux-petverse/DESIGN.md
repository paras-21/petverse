---
title: Petverse design
status: final
created: 2026-10-14
updated: 2026-10-14
sources:
  - ../prd-petverse/prd-petverse.md
  - .memlog.md
  - ../../../docs/DECISIONS.md
name: Petverse Candy
description: 'Candy "Sticker book" UI layer for Petverse release 1: bubblegum polka dots, white-outlined sticker cards with coloured candy shadows, blob stage, glossy pill buttons, heavy rounded type. Light mode only. The glossy 3D jelly pet species are fixed and sit inside it; stage, element and shiny looks are added on top (DECISIONS #37).'
colors:
  # Base
  background: '#FFEAF3'        # bubblegum blush page
  dot: '#FFD3E6'               # polka dots, avatar rings (decorative only; never a boundary)
  surface: '#FFFFFF'           # sticker cards, sheets, outlines
  ink: '#3A1F2B'               # cherry-brown text (no navy, no purple); focus ring
  ink-soft: '#6B5A63'          # secondary text, token amounts, input border (was #7A6A72; now 5.60:1 on page)
  # Colour jobs (each fill has a deep partner for its candy shadow; text on every fill is ink)
  pink: '#FF5FA2'              # brand, active tab (pet name uses pink-deep)
  pink-deep: '#D93D80'         # pink shadow; also pet name and pink text on light grounds
  pink-shadow: '#F2B8D1'       # neutral sticker shadow on white pills, rows, tiles
  lemon: '#FFDF3D'             # act: the main thing to press
  lemon-deep: '#E0B400'
  lime: '#74D44F'              # points, care, feed, "you won"
  lime-deep: '#4FA92F'
  sky: '#3DBDF5'               # ETH, pot, claim, trips
  sky-deep: '#1E95CC'
  orange: '#FF8A3D'            # trouble: hungry, robbed, revenge, danger, loss
  orange-deep: '#D9661C'
  cooldown: '#D9D2D6'          # disabled / waiting fill
  cooldown-deep: '#B9AFB4'
  # Tints and tracks
  tint-orange: '#FFF1E6'       # danger note background
  tint-orange-row: '#FFF4EC'   # revenge row background
  tint-lime: '#F1FBEC'         # "pot points go back to 0, level stays" box
  tint-sky: '#EEF8FE'          # pot explainer box
  track-sky: '#E3F4FC'         # progress bar track (trips)
  track-orange: '#FFE1CC'      # hunger / boss bar track
  track-pink: '#FFE1EC'        # health bar track
  field: '#FFF7FB'             # text input fill
  chip-neutral: '#F6EFF2'      # Skip chip
  # Stage (the scene behind the 3D pet)
  stage-sky: '#A9D4FA'
  stage-sky-top: '#BFE0FB'
  stage-sky-horizon: '#E4F3FF'
  stage-hill: '#9ED67F'
  # Overlays
  scrim: '#3A1F2B61'           # ink at 38%
  gloss: '#FFFFFF8C'           # white at 55%, button shine strip
typography:
  display-hero:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 54px
    fontWeight: '700'
    lineHeight: '1.02'
  display-hero-mobile:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 29px
    fontWeight: '700'
    lineHeight: '1.08'
  pet-name:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 34px
    fontWeight: '700'
    lineHeight: '1'
  pet-name-desktop:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 46px
    fontWeight: '700'
    lineHeight: '1'
  screen-title:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1'
  screen-title-desktop:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 44px
    fontWeight: '700'
    lineHeight: '1'
  number-xl:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 60px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -1px
  number-result:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1'
  number-lg:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.1'
  number-lg-desktop:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.1'
  headline:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.1'
  sheet-title:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.1'
  money-usd:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1'
  money-token:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.3'
  title-md:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.05'
  title-sm:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1.1'
  button:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '700'
    lineHeight: '1'
  button-hero:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1'
  button-sm:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1'
  label:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1.3'
  tab-label:
    fontFamily: '"Baloo 2", ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  body:
    fontFamily: 'Nunito, "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.45'
  body-lg:
    fontFamily: 'Nunito, "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: 'Nunito, "Trebuchet MS", "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.35'
rounded:
  sm: 9px          # bars, health bars, grab handle
  md: 16px         # icon tile, danger note
  lg: 26px         # number blob, list rows, activity cards
  xl: 28px         # sticker card
  2xl: 32px        # result card, pass card
  sheet: 38px      # bottom sheet top corners
  full: 9999px     # pills, buttons, chips, tab bar, avatars
  blob: '46% 54% 42% 58% / 38% 40% 60% 62%'        # stage on phone, hero, try-on
  blob-wide: '44% 56% 40% 60% / 30% 34% 66% 70%'   # stage on desktop, fight arena
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  gutter-phone: 16px        # side padding on phone
  stack-gap: 12px           # vertical gap between stickers on phone
  gutter-desktop: 26px      # side padding on desktop
  column-gap-desktop: 24px  # gap between main column and right rail
  rail-desktop: 370px       # right rail width (380px on Battle)
  grid-gap-desktop: 22px    # Play hub card grid
  tabbar-height: 70px
  outline: 4px              # sticker white outline (buttons, blobs)
  outline-sm: 3px           # chips, small buttons, timer
  outline-stage: 5px        # stage and result outline
  candy-drop: 6px           # candy shadow offset on buttons and cards
  scroll-padding-bottom: 110px  # tab bar 70 + 22 margin + slack, so focus is never under the tab bar
  target-min: 44px          # min height and width of anything pressable (padding or invisible hit area)
components:
  focus-ring:                # every focusable item, via :focus-visible
    outline: '3px solid {colors.ink}'
    outlineOffset: 3px
    rounded: follows the item's own shape
  button-primary:            # lemon = act
    backgroundColor: '{colors.lemon}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.full}'
    shadow: '0 6px 0 {colors.lemon-deep}'
    typography: '{typography.button}'
    padding: 12px 16px
  button-hero:
    backgroundColor: '{colors.lemon}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    shadow: '0 6px 0 {colors.lemon-deep}'
    typography: '{typography.button-hero}'
    padding: 14px 16px
  button-care:               # lime = feed, care, "Yay!"
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 6px 0 {colors.lime-deep}'
    typography: '{typography.button}'
  button-brand:              # pink = dress up, share, social
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 6px 0 {colors.pink-deep}'
    typography: '{typography.button}'
  button-eth:                # sky = team up, money
    backgroundColor: '{colors.sky}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 6px 0 {colors.sky-deep}'
    typography: '{typography.button}'
  button-trouble:            # orange = revenge
    backgroundColor: '{colors.orange}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.orange-deep}'
    typography: '{typography.button-sm}'
    padding: 8px 14px
  button-ghost:              # white: Log in, Google, wallet, Back, Skip to result
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    shadow: '0 5px 0 {colors.pink-shadow}'
    typography: '{typography.button}'
  button-cooldown:           # disabled with the wait inside
    backgroundColor: '{colors.cooldown}'
    textColor: '{colors.ink}'          # 10.02:1; was ink-soft (3.42:1, failed at 13px)
    icon: clock                        # "waiting" = flat shadow + no gloss + clock, never lighter text
    rounded: '{rounded.full}'
    shadow: '0 2px 0 {colors.cooldown-deep}'
    typography: '{typography.button-sm}'
    gloss: none
    minHeight: '{spacing.target-min}'
  button-text:               # calm exit, e.g. "Not now, keep growing"
    textColor: '{colors.ink}'
    underlineColor: '{colors.dot}'
    typography: '{typography.button}'
  sticker-card:              # job variants: see Components › Job variants
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.xl}'
    shadow: '0 6px 0 {colors.pink-shadow}'
    padding: 14px
  number-blob-points:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.lg}'
    shadow: '0 6px 0 {colors.lime-deep}'
    typography: '{typography.number-lg}'
    tilt: -1.5deg
  number-blob-pot:
    backgroundColor: '{colors.sky}'
    textColor: '{colors.ink}'
    borderColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.lg}'
    shadow: '0 6px 0 {colors.sky-deep}'
    typography: '{typography.number-lg}'
    tilt: 1.5deg
  money-stack:
    amountTypography: '{typography.money-usd}'
    tokenTypography: '{typography.money-token}'
    tokenColor: '{colors.ink-soft}'
  timer-chip:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.lime-deep}'
    tilt: 2deg
  timer-chip-hungry:
    backgroundColor: '{colors.orange}'
    textColor: '{colors.ink}'
    shadow: '0 4px 0 {colors.orange-deep}'
  pet-badge:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 3px 0 {colors.pink}'
    typography: '{typography.label}'
    tilt: -3deg
  element-badge:             # DECISIONS #37: badge + accent, never coat colour
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    iconColor: '{colors.ink}'      # emblem: fire flame, leaf, stone, spark bolt, water drop
    rounded: '{rounded.full}'
    typography: '{typography.label}'
  pet-name:
    textColor: '{colors.pink-deep}'   # 3.72:1 on background, AA large; pink fails
    textShadow: '3px 3px 0 {colors.surface}'
    typography: '{typography.pet-name}'
  blob-stage:
    backgroundColor: '{colors.stage-sky}'
    borderColor: '{colors.surface}'
    borderWidth: '{spacing.outline-stage}'
    rounded: '{rounded.blob}'
    shadow: '0 7px 0 {colors.pink}'
  name-tag:
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.full}'
    tilt: -4deg
  speech-bubble:
    backgroundColor: '{colors.surface}'
    rounded: 20px
    tilt: -5deg
  alert-pill:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 5px 0 {colors.orange}'
  status-pill:
    textColor: '{colors.ink}'          # on every job fill; never white
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.full}'
    typography: '{typography.label}'
    backgroundColor: '{colors.lime}'   # job variants: see Components › Job variants
    shadow: '0 3px 0 {colors.lime-deep}'
  icon-tile:
    iconColor: '{colors.ink}'          # on lime, sky, orange, pink, lemon
    size: 48px
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.md}'
    backgroundColor: '{colors.lime}'   # job variants: see Components › Job variants
    shadow: '0 4px 0 {colors.lime-deep}'
  avatar:
    size: 42px
    borderColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 3px 0 {colors.pink}'
  tab-bar:
    backgroundColor: '{colors.surface}'
    height: '{spacing.tabbar-height}'
    rounded: '{rounded.full}'
    shadow: '0 5px 0 {colors.pink}'
  tab-active:
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    typography: '{typography.tab-label}'
    indicator: '3px {colors.ink} bar under the label'   # non-colour cue; pink vs white is only 2.83:1
  top-nav-pill:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.pink-shadow}'
    activeBackground: '{colors.pink}'
    activeText: '{colors.ink}'
    activeShadow: '0 4px 0 {colors.pink-deep}'
    activeIndicator: '3px {colors.ink} bar under the label'
  segmented-tabs:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.pink-shadow}'
    activeBackground: '{colors.pink}'
    activeText: '{colors.ink}'
    activeIndicator: '3px {colors.ink} bar under the label'
  bottom-sheet:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.sheet} {rounded.sheet} 0 0'
    shadow: '0 -6px 0 {colors.pink}'
    scrim: '{colors.scrim}'
    handleColor: '{colors.cooldown}'
  step-chip:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.lemon}'
    counterBackground: '{colors.lemon}'
    skipBackground: '{colors.chip-neutral}'
  progress-dots:
    on: '{colors.pink}'
    off: '{colors.surface}'
    width: 28px
    height: 8px
  target-row:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.lg}'
    shadow: '0 5px 0 {colors.pink-shadow}'
    rewardColor: '{colors.ink}'
    rewardUnderline: '{colors.lime}'   # colour only in the 4px underline, never the text
  revenge-row:
    backgroundColor: '{colors.tint-orange-row}'
    shadow: '0 5px 0 {colors.orange}'
    rewardColor: '{colors.ink}'
    rewardUnderline: '{colors.orange}'
  nameplate:
    backgroundColor: '{colors.surface}'
    rounded: 18px
    shadow: '0 4px 0 {colors.pink}'
  health-bar:
    track: '{colors.track-pink}'
    fill: '{colors.lime}'
    fillLow: '{colors.orange}'
    rounded: '{rounded.sm}'
  hit-label:
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.full}'
    textColor: '{colors.ink}'
  result-card:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-stage}'
    rounded: '{rounded.2xl}'
    shadow: '0 7px 0 {colors.lime-deep}'
    typography: '{typography.number-result}'
    tilt: -2deg
  progress-bar:
    track: '{colors.track-sky}'
    fill: '{colors.sky}'
    rounded: '{rounded.full}'
  lives-hearts:
    color: '{colors.pink}'
    size: 24px
  danger-note:
    backgroundColor: '{colors.tint-orange}'
    iconColor: '{colors.orange}'
    rounded: '{rounded.md}'
    typography: '{typography.body}'
  prize-wheel:
    slices: '{colors.lime} {colors.lemon} {colors.sky} {colors.pink} {colors.orange}'
    labelColor: '{colors.ink}'
    dividers: '{colors.surface}'
    shadow: 'drop-shadow(0 6px 0 {colors.pink-deep})'
  prize-card:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-stage}'
    rounded: 30px
    shadow: '0 7px 0 {colors.lime-deep}'
  rarity-tag:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.dot}'
    starColor: '{colors.pink-deep}'
    rounded: '{rounded.full}'
  rarity-tag-legendary:
    backgroundColor: '{colors.lemon}'
    starColor: '{colors.ink}'
    shadow: '0 2px 0 {colors.lemon-deep}'
  item-tile:
    backgroundColor: '{colors.surface}'
    rounded: 24px
    shadow: '0 5px 0 {colors.pink-shadow}'
  cosmetic-tile:
    backgroundColor: '{colors.surface}'
    rounded: 22px
    shadow: '0 5px 0 {colors.pink-shadow}'
    selectedRing: '0 0 0 4px {colors.pink}, 0 7px 0 4px {colors.pink-deep}'
  try-on-card:
    backgroundColor: '{colors.surface}'
    rounded: 30px
    shadow: '0 6px 0 {colors.pink}'
  pass-card:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.2xl}'
    shadow: '0 7px 0 {colors.pink}'
  reward-track:
    track: '{colors.cooldown}'
    fill: '{colors.lime}'
    nodeDone: '{colors.lime}'
    nodeFinal: '{colors.pink}'
  market-row:
    backgroundColor: '{colors.surface}'
    rounded: 24px
    shadow: '0 5px 0 {colors.pink-shadow}'
  claim-sheet:
    shadow: '0 -6px 0 {colors.sky}'
    amountTypography: '{typography.number-xl}'
    resetBox: '{colors.tint-lime}'
    potBox: '{colors.tint-sky}'
  input-field:
    backgroundColor: '{colors.field}'
    borderColor: '{colors.ink-soft}'    # 6.10:1 on field; was dot (1.27:1, failed 3:1)
    borderWidth: 2px
    rounded: '{rounded.full}'
    typography: '{typography.body}'
  wallet-chip:
    backgroundColor: '{colors.surface}'
    rounded: 18px
    shadow: '0 4px 0 {colors.pink-shadow}'
  free-actions-chip:         # top bar "7 free left"
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    shadow: '0 3px 0 {colors.lime}'
    shadowAtZero: '0 3px 0 {colors.cooldown-deep}'
    typography: '{typography.label}'
  streak-pill:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.full}'
    shadow: '0 3px 0 {colors.lime}'
    typography: '{typography.label}'
  shortfall-note:            # "You need $1.40 more"
    backgroundColor: '{colors.tint-orange}'
    textColor: '{colors.ink}'
    rounded: '{rounded.md}'
    typography: '{typography.body}'
  burn-counter:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    iconColor: '{colors.orange}'   # flame icon; meaning carried by the words
    rounded: '{rounded.full}'
    shadow: '0 4px 0 {colors.orange}'
    amountTypography: '{typography.money-usd}'
    tokenTypography: '{typography.money-token}'
  fairness-check:
    linkColor: '{colors.ink}'
    linkUnderline: '{colors.sky}'
    linkTypography: '{typography.label}'
    sheetShadow: '0 -6px 0 {colors.sky}'
    matchPill: '{colors.lime}'       # ink check + "Matches"
  evolve-breed-buttons:      # Home pet card
    evolve: '{components.button-brand}'
    breed: '{components.button-ghost}'
    locked: '{components.button-cooldown}'
  icon:
    style: custom chunky rounded SVG, 24x24 grid, filled shape in currentColor, cut-outs in the fill colour behind it
---

# Petverse — Design Spine

Visual identity for release 1. Behaviour lives in [EXPERIENCE.md](EXPERIENCE.md). Mocks are references only; which surfaces are mocked, and the rule for conflicts, are in EXPERIENCE.md › Mock coverage.

- Chosen direction: [.working/direction-candy.html](.working/direction-candy.html) (source of every hex, font stack, radius and shadow here).
- Key screens in this style (8): see EXPERIENCE.md › Mock coverage.

## Brand & Style

Petverse is a cute 3D pet game where your pet earns you a share of a real prize pot. The UI is a **sticker book**: every surface is a sticker with a thick white outline, a coloured "candy" shadow underneath and, often, a small tilt. Pets stand on a blob-shaped stage. Buttons are fat glossy pills. Numbers are big and rounded so the screen feels like a toy. It is for the casual, social, share-a-screenshot player who comes for cute pets and stays for friends.

The **glossy jelly 3D pets** (`src/components/three`: `species.tsx`, `PetModel.tsx`, `jelly.tsx`, `Stage.tsx`, `EggModel.tsx`) are fixed. This spine replaces only the UI layer around them (buttons, colours, type, cards, icons). The pet is the face of the product and is never small or hidden behind economy UI.

Light mode only for release 1. A night candy version may come later.

Superseded explorations (not to be built): the cozy, bold, premium directions and the six bold themes in `.working/` (`direction-cozy.html`, `direction-bold.html`, `direction-premium.html`, `theme-bold-*.html`). The owner first leaned to Bold, then chose Candy, which supersedes the Bold shortlist.

## Colors

Every colour has **one job**. A colour that means "points" never decorates a money button, and so on.

| Job | Fill | Candy shadow | Used for | Never for |
|---|---|---|---|---|
| Brand | `{colors.pink}` `#FF5FA2` | `{colors.pink-deep}` `#D93D80` | Logo, pet name, active tab, active segment, name tag, stage shadow, Dress up / Share | Money or danger |
| Act | `{colors.lemon}` `#FFDF3D` | `{colors.lemon-deep}` `#E0B400` | The main thing to press: Play, Spin, Attack, Buy, Claim | Status or decoration |
| Points and care | `{colors.lime}` `#74D44F` | `{colors.lime-deep}` `#4FA92F` | Points blob, feed button, timer chip (fed), "You won", wheel prize, reward track | ETH |
| ETH | `{colors.sky}` `#3DBDF5` | `{colors.sky-deep}` `#1E95CC` | Pot blob, your share, claim sheet, expeditions, 2v2 team up | Points |
| Trouble | `{colors.orange}` `#FF8A3D` | `{colors.orange-deep}` `#D9661C` | Hungry, robbed alert, Revenge, Death Match, Boss bar, "So close!" loss, low health | Celebration |
| Waiting | `{colors.cooldown}` `#D9D2D6` | `{colors.cooldown-deep}` `#B9AFB4` | Disabled buttons that show their wait, unreached reward nodes | Anything pressable |

Base: page `{colors.background}` `#FFEAF3` with `{colors.dot}` `#FFD3E6` polka dots (3px dots on a 28px grid, 2.5px on 22–24px inside device frames); stickers in `{colors.surface}` `#FFFFFF`; text in `{colors.ink}` `#3A1F2B` (cherry-brown; no navy, no purple); secondary text, token amounts and input borders in `{colors.ink-soft}` `#6B5A63` (darkened from `#7A6A72` so it passes AA on every light ground). Neutral white pills, rows and tiles use `{colors.pink-shadow}` `#F2B8D1` as their candy shadow. Pale tints (`tint-*`, `track-*`) sit behind notes and bars of the matching job. The stage scene is `{colors.stage-sky}` `#A9D4FA` (egg scene: `{colors.stage-sky-top}` → `{colors.stage-sky-horizon}` over a `{colors.stage-hill}` `#9ED67F` hill). Sheets dim the page with `{colors.scrim}` (ink at 38%).

**Contrast (measured, WCAG 2.x):**

| Pair | Ratio | Status |
|---|---|---|
| `ink` on `background` | 12.98 | Pass AA |
| `ink` on `surface` | 14.89 | Pass AA |
| `ink` on `lemon` | 11.25 | Pass AA |
| `ink` on `cooldown` | 10.02 | Pass AA |
| `ink` on `lime` | 7.99 | Pass AA |
| `ink` on `sky` | 6.94 | Pass AA |
| `ink` on `orange` | 6.35 | Pass AA |
| `ink` on `pink` | 5.25 | Pass AA |
| `pink-deep` on `background` (pet name) | 3.72 | Pass AA large (pet name is 34px+ bold) |
| `pink-deep` on `surface` | 4.26 | Pass AA large only |
| `ink` on `stage-sky` / `dot` / any tint or track | 9.56 / 11.14 / 11.97+ | Pass AA |
| `ink-soft` on `surface` | 6.43 (was 5.08) | Pass AA |
| `ink-soft` on `background` | 5.60 (was 4.43) | Pass AA |
| `ink-soft` on `field` / `chip-neutral` | 6.10 / 5.68 | Pass AA |
| `ink-soft` on tints (`tint-orange` / `tint-lime` / `tint-sky`) | 5.81 / 6.04 / 5.97 | Pass AA |
| `ink-soft` on tracks (`track-sky` / `track-orange` / `track-pink`) | 5.70 / 5.17 / 5.27 | Pass AA |
| `ink-soft` on `dot` | 4.81 | Pass AA |
| `ink-soft` on `cooldown` / `stage-sky` / any candy fill | 4.33 / 4.13 / ≤3.9 | Fails: never used there (cooldown label is `ink`) |
| `pink-deep` on `cooldown` / `stage-sky` / candy fills | 2.87 / 2.74 / ≤2.3 | Fails: never used there |
| `surface` (white) on `pink` / `orange` / `sky` / `lime` | 2.83 / 2.35 / 2.14 / 1.86 | Fails: not used for text |
| `pink` on `background` | 2.47 | Fails: not used for text |
| Focus ring `ink` vs `background` / `surface` / `stage-sky` | 12.98 / 14.89 / 9.56 | Pass 3:1 non-text |
| Input border `ink-soft` vs `field` / `surface` | 6.10 / 6.43 | Pass 3:1 non-text (was `dot` 1.27) |

**Text rule:** every text and background pair in the product is in the passing rows above. `ink-soft` is only for text on `background`, `surface`, `field`, `chip-neutral`, `dot`, a tint or a track; never on `cooldown`, `stage-sky` or a candy fill. Ratios computed with node (WCAG 2.x relative luminance), 2026-10-14.

**Non-text cues:** the active tab, active nav pill and active segment add a 3px `{colors.ink}` bar under the label (pink vs white is 2.83:1, so pink alone is not enough). A selected cosmetic tile adds an ink check badge. Bars (health, hunger, trips, boss) always show their value in words next to them ("34 / 100 · Low", "62% boss health"), because fill-to-track contrast is under 3:1.

**Rule (owner, 2026-10-14):** all text and icons on a candy fill (pink, lime, sky, orange, lemon) are `{colors.ink}`, never white. The fills themselves are unchanged. The pet name is `{colors.pink-deep}` with the 3px white text shadow (3.72:1 on the page, 4.26:1 against its own shadow); pink text on a light ground (logo, "Season Pass") uses `{colors.pink-deep}` and must be large (18.66px bold or more). White stays for outlines, gloss and dividers only.

**Reward text (owner, 2026-10-14):** coloured reward, points or loss text on white or a pale tint is `{colors.ink}`; the colour job moves into a pill fill, a 4px underline or an icon/dot next to it (e.g. "**Win +620**" in ink with a `{colors.lime}` underline; revenge reward with an `{colors.orange}` underline). Never `lime-deep`, `orange-deep` or `sky-deep` as text colour.

## Typography

Two free hosted families, loaded with `next/font/google` (self-hosted at build, no runtime call to Google, same look on every device). Owner decision 2026-10-14.

- **Display (heavy rounded):** `"Baloo 2"`, weight 700, then `ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Trebuchet MS", "Segoe UI", sans-serif` as fallbacks. Used for everything a player scans: pet names, titles, numbers, money, buttons, labels, tabs.
- **Body:** `Nunito`, weight 400, then `"Trebuchet MS", "Segoe UI", sans-serif`. Used only for explaining sentences (`{typography.body}`, `{typography.body-lg}`, `{typography.caption}`).
- **Why Baloo 2 + Nunito, not Nunito for both:** Baloo 2's fat, soft strokes match the chunky sticker numbers and pill buttons; Nunito at 700 reads too thin for that, but its open shapes are the calmer choice for small explaining text.

| Role | Token | Size | Where |
|---|---|---|---|
| Landing hero | `display-hero` / `display-hero-mobile` | 54 / 29px | "Raise a cute pet. Battle friends. Share a real prize pot." |
| Pet name | `pet-name` / `pet-name-desktop` | 34 / 46px | Home header, in `{colors.pink-deep}` with a 3px white text shadow |
| Screen title | `screen-title` / `screen-title-desktop` | 32 / 44px | Battle, Play, Shop |
| Claim amount | `number-xl` | 60px | "Claim $42.08" |
| Result number | `number-result` | 56px | "+620" |
| Number blob | `number-lg` / `number-lg-desktop` | 28 / 36px | Points, your share |
| Headline | `headline` | 28px | "Mochi beat Pudding" |
| Sheet title | `sheet-title` | 26px | "Let's get your egg!" |
| Dollar amount | `money-usd` | 22px | Prices, shares |
| Token amount | `money-token` | 14px | "312 PETV", "0.018 ETH" under dollars |
| Card title | `title-md` / `title-sm` | 20 / 16px | Try-on item, activity cards |
| Buttons | `button-hero` / `button` / `button-sm` | 24 / 16 / 13px | Play / most / row buttons |
| Labels | `label` | 13px | Badges, status pills, blob captions |
| Tab label | `tab-label` | 14px | Under tab icons only |
| Body | `body` / `body-lg` / `caption` | 16 / 17 / 13px | Explaining sentences; caption for fine print |

Rules: numbers use tabular figures (`font-variant-numeric: tabular-nums`); thousands use a comma ("12,480"). Money is always dollars first in the bigger size and the token or ETH amount underneath in `money-token`. No all-caps. **Size floor:** no text under 13px anywhere (mocks with 9–12px text are drift); token amounts and tab labels 14px; body 16px. Sizes are set in `rem` so 200% browser zoom works, and layouts reflow at 320px wide ("Claim $42.08" and the two-up blobs stack). Big readable text for key info (points, pot, share, prices, timers) is an accessibility floor, not a style choice.

## Layout & Spacing

Scale `{spacing.1}`–`{spacing.5}` (4 / 8 / 12 / 16 / 24px). Two layouts, equally important:

- **Phone (mocked at 390px wide):** one column, `{spacing.gutter-phone}` side padding, stickers stacked with `{spacing.stack-gap}`. Two-up grids (number blobs, action pairs, Play cards) use a 12px gap. A floating pill tab bar (`{spacing.tabbar-height}` tall, 12px side margin, 22px bottom margin) sits at the bottom. The page sets `scroll-padding-bottom: {spacing.scroll-padding-bottom}` (110px) so a focused item is never hidden under the tab bar or an open sheet.
- **Desktop (mocked at 1280px wide):** a pill top nav, then a two-column grid: main column + `{spacing.rail-desktop}` right rail, `{spacing.column-gap-desktop}` apart, `{spacing.gutter-desktop}` side padding. Play hub uses a 3-column card grid (`{spacing.grid-gap-desktop}`); Shop uses 6-column item and 5-column cosmetic grids.

Home on phone, top to bottom: pet switcher → header (pet name + pet badge + timer chip) → blob stage → pet card with Evolve and Breed → Co-Pet card (Co-Pets only) → points and pot blobs → alert pill (if any) → action row (Spin wheel, Attack, Dress up) → Feed button. Home on desktop: pet switcher above the stage → header with Feed inline → wide stage with Evolve and Breed on the pet card, Co-Pet card under it → 3 actions (Spin, Attack, Dress up) in the main column; alert, points blob and pot blob with Claim in the right rail.

Every pressable item is at least `{spacing.target-min}` (44px) tall and wide (padding or an invisible hit area), including `button-sm`, Skip, Revenge and reward-track nodes; row buttons sit at least 8px apart.

Breakpoint values between the two layouts are not set yet (see Open questions).

## Elevation & Depth

There is no blur shadow anywhere. Depth is a **hard, solid, coloured drop straight down** (the "candy shadow"), as if the sticker is a thick piece of candy:

| Level | Shadow | Used on |
|---|---|---|
| Button | `0 6px 0 <deep>` (4px on small / trouble buttons) | Pill buttons |
| Sticker | `0 5–6px 0 <job colour>` | Cards, rows, alert, tab bar |
| Stage | `0 7px 0 {colors.pink}` | Blob stage, result card, prize card |
| Chip | `0 2–4px 0 <deep>` | Status pills, timer, badges, tabs |
| Waiting | `0 2px 0 {colors.cooldown-deep}` | Disabled buttons (flatter = not pressable) |
| Sheet | `0 -6px 0 {colors.pink}` (claim: `{colors.sky}`) | Bottom sheets, shadow goes up |

Other depth cues: a 4px white outline (`{spacing.outline}`) around fills; a `{colors.gloss}` shine strip (6px tall, inset 14% left and right, 4px from the top) on every pressable pill except waiting buttons; a 3px white text shadow on the pet name and logo (both `{colors.pink-deep}`); small tilts (−5° to +6°) on badges, tags, blobs, hit labels and prize cards. On phone, overlays are bottom sheets over a `{colors.scrim}`; there are no centered modals.

**Focus ring:** `focus-ring` = `outline: 3px solid {colors.ink}; outline-offset: 3px`, shown with `:focus-visible` on every button, pill, tab, segment, tile, row button, avatar, pet chip, wheel, text button, link and sheet handle. It follows the item's shape (pill, blob, circle). Ink passes 3:1 on every ground the ring can sit on (page 12.98, white 14.89, stage 9.56). The desktop overlay form is not mocked yet (see Open questions).

## Shapes

- **Pill** (`{rounded.full}`) for every button, chip, tab, tab bar, input and avatar.
- **Fat rounded rectangle** for stickers: `{rounded.lg}` 26px for rows and blobs, `{rounded.xl}` 28px for cards, `{rounded.2xl}` 32px for result and pass cards, `{rounded.md}` 16px for icon tiles.
- **Blob** (`{rounded.blob}`, `{rounded.blob-wide}`): an uneven organic shape for every stage that shows a pet (home, hero, egg, try-on, fight arena). Never a plain rectangle around a pet.
- **Sheet**: `{rounded.sheet}` 38px top corners, square bottom, with a grab handle.
- Circles for pet avatars, result pet frame and reward-track nodes.

## Components

Visual specs. Behaviour of each lives in EXPERIENCE.md › Component Patterns under the same name.

**Icons.** A custom set of chunky rounded SVG icons on a 24×24 grid, drawn as filled shapes in `currentColor` with cut-outs filled with the colour behind them (so they read as stickers). **No emoji anywhere** (consistent across platforms). The set in the key-screen mocks: home, battle, play, shop, guild, heart, heart-outline, carrot, shield, wheel, monster, compass, dice, flame, crown, egg, bolt, clock, mail, Google "G", wallet, star, sparkle, gift, trophy, potion, shirt, lock, revenge, coin, diamond, arrow, check, close, zzz, users, hand, tag. The emoji in `direction-candy.html` are placeholders replaced by this set.

**Job variants.** `sticker-card`, `status-pill` and `icon-tile` come in one variant per colour job, named `-brand`, `-act`, `-points`, `-eth`, `-trouble`, `-waiting` (e.g. `icon-tile-eth`). The variant takes its colours from the Colors job table: `status-pill` and `icon-tile` fill = the job's Fill column, shadow = its Candy shadow column; a `sticker-card` stays white and its shadow is the job's Fill colour. Neutral (no job) = `{colors.pink-shadow}`. Text and icons are always `{colors.ink}`.

| Component | Anatomy and look |
|---|---|
| **Pill button** | `button-primary` (lemon, ink text) for the main action; `button-care` (lime), `button-brand` (pink), `button-eth` (sky), `button-trouble` (orange, smaller) for their colour job, all with ink text; `button-ghost` (white, pink-shadow) for secondary; `button-hero` for Play and Tap the egg. 4px white outline, gloss strip, candy shadow. Icon on the left of the label. Full-width on phone when it is the screen's main action. |
| **Cooldown button** | `button-cooldown`: grey fill, **ink** label (10.02:1) with the wait in bold ("Attack in **12m**"), clock icon, flat 2px shadow, no gloss. "Waiting" is shown by the flat shadow, missing gloss and clock, never by lighter text. Same for grey status pills (ink text). |
| **Text button** | `button-text`: ink text with a thick `{colors.dot}` underline. Calm exit only. |
| **Sticker card** | White, `{rounded.xl}`, candy shadow in its job colour. Holds explanations, feed card, tips, rails. |
| **Number blob** | `number-blob-points` (lime, −1.5°) and `number-blob-pot` (sky, +1.5°); the tilt is on the blob only and the number inside is counter-rotated to 0°: caption in `label`, value in `number-lg`, optional sub-line ("+120 today", "is your share"). Points blob shows **pot points** (reset by a claim); the level in the pet badge comes from lifetime points and never drops. When the pet is asleep or very hungry, the pot blob carries a sub-line "No pot share while asleep" (asleep: value shown as paused, `{colors.cooldown}` fill). |
| **Money stack** | `money-usd` amount, then `money-token` amount in `ink-soft` on the next line (in `ink` when the stack sits on a candy fill such as a number blob or claim pill). Used in prices, shares, wallet chip. |
| **Timer chip** | Heart icon + countdown in ink on a lime pill, +2° tilt on the pill, text upright (`timer-chip`). Hungry (`timer-chip-hungry`): orange, empty-heart icon and the word: "Hungry · 3h left" (lime vs orange is only 1.26:1, so the word and icon carry it). |
| **Pet badge** | White pill, pink shadow, −3°: "Bunny · Leaf · Lv 12 · Adult" (species · element · level · stage). The element part is the element badge. |
| **Element badge and accent** | `element-badge` (DECISIONS #37): ink emblem icon (flame, leaf, stone, bolt, drop) + the element word, inside the pet badge and on target rows. Accent: the same emblem as a small aura or emblem on the pet in the blob stage. The element never sets the coat colour (coat stays the random species palette). Word + icon, never colour alone. |
| **Blob stage** | `blob-stage`: 3D pet scene inside a blob with a 5px white outline and pink shadow (orange when hungry). Pink **name tag** (−4°, ink text) on top; optional white **speech bubble** ("I'm hungry…"). |
| **Alert pill** | White pill with an orange shadow; message on the left, small trouble button on the right. |
| **Status pill** | Small pill in a job colour with ink icon + ink text ("Ready", "2 of 3 left today", "Back in 3h 12m"); grey when waiting. |
| **Icon tile** | 48px rounded square (42–54px by context) in a job colour holding one ink icon. |
| **Avatar** | 42px circle, white ring, pink shadow, pet face crop. Top-right on every page. |
| **Tab bar (phone)** | White floating pill, 5 tabs (icon over 14px label), active tab is a pink pill with ink text and a 3px ink bar under the label. |
| **Top nav (desktop)** | Logo, then 5 `top-nav-pill`s (icon + label; active = pink + ink bar), free-actions chip, streak pill (lime shadow), wallet pill, avatar pill on the right. |
| **Segmented tabs** | White pill track, active segment pink with ink text and a 3px ink bar under the label; optional second line in `label` 13px ("1 every 30m"). |
| **Bottom sheet** | White, 38px top corners, grab handle, shadow upward; over a scrim. |
| **Step chip** | White pill with lemon shadow: lemon counter ("Step 1 of 4"), task text, grey Skip on the right. Paired with **progress dots** (pink = done/current, white = to do). |
| **Target row** | White row: round pet avatar (with sky shield or grey zzz badge), name + level chip + element badge, points line, "**Win +620** · 54% chance" (reward in ink with a lime underline), Attack button. When your element beats theirs, a small lime pill "Leaf beats Stone · +10%" sits by the chance; the chance already includes it (DECISIONS #55). **Revenge row**: orange-tinted, orange shadow, reward in ink with an orange underline, orange Revenge button labelled "no wait". **Shielded row**: 75% opacity, "Safe for now", cooldown button with shield + time. |
| **Nameplate + health bar** | White plate (pink shadow for the opponent, lime for you) with name, level and a pill health bar (lime, orange when low) plus "34 / 100", and the word "Low" when low. |
| **Hit label** | Tilted pill over the arena, ink text: orange "Bonk! −18", pink "Crit! −32" (bigger), sky "Dodge!". |
| **Battle text box** | White rounded box, pink shadow: "Mochi used **Carrot Kick!**" then a body line. |
| **Result card** | Lime card, 5px outline, ink `number-result` "+620" over "points", −2°; above it a round pet frame and confetti icons (star, sparkle, heart). Loss: title "So close!" in ink with an orange underline, pet frame shadow orange, no result card. |
| **Activity card** (Play) | Sticker card in its job colour: icon tile + status pill on top, title, one line, optional bar/chips, action button on desktop. |
| **Progress bar** | Pill bar, white outline and job-colour ring: sky for trips, orange for boss health and hunger. |
| **Lives hearts** | Up to 3 pink filled hearts; a lost life is a pink outline heart. |
| **Death Match fights pill** | Status pill on the Death Match card and run screen: "14 of 20 fights left this weekend". At the cap: grey pill "20 of 20 fights this weekend · Opens Saturday" and a cooldown button (DECISIONS #57). |
| **Danger note** | Orange-tinted rounded box with an outline-heart icon in orange and one plain sentence. Paired with a lime check line for the safe option. |
| **Prize wheel** | 5 slices (lime, lemon, sky, pink, orange) with white dividers and ink labels on every slice, white hub with pink centre, ink pointer, pink-deep drop shadow. **Prize card**: lime, 5px outline, big ink "+100". |
| **Rarity tag** | White pill with a dot border: 1–4 stars + the word (Common, Rare, Epic, Legendary). Legendary is lemon with ink stars. Never colour alone. |
| **Item tile** | White tile: icon tile, name, one-line effect, dollar price, token price; optional lemon "Rare odds" tag tilted on the corner. |
| **Cosmetic tile** | White tile with a pet crop wearing the item, rarity tag, price. Selected: pink ring + pink-deep drop. |
| **Try-on card** | White card with a blob stage showing your pet wearing the item, "Trying it on Mochi · Hat", item name, rarity, big dollar price, token price, lemon Buy button. Desktop: in the right rail. |
| **Pass card** | White card: skin preview stage ("Season skin is yours when you buy"; DECISIONS #50), "Season Pass" in pink-deep, season pill, `$7.99 per season`, benefit rows (icon tile + header + "instead of" line + struck-through old value), reward track, lemon CTA, fine print. |
| **Reward track** | Grey line with lime progress; nodes are circles (lime with check when got, white with gift when not, larger pink final node that shows the season skin the Pass granted at purchase; DECISIONS #50). |
| **Market row** | White row: square item crop, name, rarity tag, "Sold by Biscuit", money stack, small lemon Buy. |
| **Claim sheet** | Bottom sheet with sky top shadow: coin tile + "Claim Mochi's share of the pot", `number-xl` "Claim $42.08", sky "0.018 ETH" pill, lime-tinted reset box ("Your pot points go back to 0", "12,480 → 0", then "Mochi stays Lv 12": level comes from lifetime points and never drops), sky-tinted pot explainer with an 85/15 split bar, lemon Claim button, text button exit. |
| **Wallet chip** | White rounded chip, money stack ("$12.40" over "3,869 PETV"; mocks use $1 = 312 PETV). |
| **Input field** | Pill, `{colors.field}` fill, 2px `{colors.ink-soft}` border (6.10:1), body font, visible label above (never placeholder only). Error: ink message + orange alert icon under the field. |
| **Pet switcher** (Home) | Row of round pet chips above the stage: own pets, then Co-Pets (each with the partner's small avatar on the chip), then a dashed pink "add" egg. Active chip has a pink ring. Mock: key-home-copet. |
| **Co-Pet card** (Home) | Sticker card under the stage: who fed today (two avatars with lime checks), the shared pot share split 50/50 as two money stacks, and "Needs both to agree: Breed · Death Match". No sell action (no pet or Co-Pet selling in release 1). |
| **Asleep stage** | Blob stage dimmed, zzz icon, grey timer chip "Asleep · day 3 of 7", lime "Feed Mochi to wake · free" button, keep-bar "Mochi keeps 8,736 of 12,480", day track (Day 1 → Day 7). Mock: key-sleep-death. |
| **Tombstone** | Calm white card that leads with the pet: Tombstone badge, pet name, Lv / wins / days lived in ink; then one-line "share went back to the pot", lemon "Hatch your free egg". No orange. Mock: key-sleep-death. |
| **Focus ring** | `focus-ring`: 3px `{colors.ink}` outline, 3px offset, follows the item's shape. On every focusable item. Never removed without this ring. |
| **Free-actions chip** | `free-actions-chip`: small white pill in the top bar next to the balance, bolt icon, "7 free left" in ink, lime shadow; at 0: "0 free · small fee", grey shadow. |
| **Streak pill** | `streak-pill`: white pill, flame icon, "Day 4 streak" in ink, lime shadow. Desktop top nav; phone: flame chip in the top bar next to the free-actions chip (DECISIONS #39). |
| **Avatar menu** | Bottom sheet (phone) from the avatar: rows for Profile, Wallet, Claims, Season, Calm motion (Follow device / On / Off), Notifications, How it's fair. White rows with pink-shadow, icon tile + label, 44px+ tall. |
| **Wallet sheet** | Bottom sheet from Avatar menu › Wallet or the wallet chip: money stacks for PETV and ETH balances, lemon "Get today's PETV · $X" (live dollar value; DECISIONS #47; cooldown button with countdown once used), Gold vault card (sky shadow, staked money stack, Stake / Swap back, "Swapping back costs 2%"), burn counter at the bottom. |
| **Shortfall note** | `shortfall-note`: orange-tinted box under a price: "You need **$1.40** more" (ink, dollars first, PETV small under) and a lemon "Get today's PETV · $X" button (live dollar value), or a text link "Open Wallet" once today's PETV is used. The Buy button stays visible as a cooldown-style button "Not enough PETV". |
| **Burn counter** | `burn-counter`: white pill, orange flame icon, "Burned so far" label, money stack (dollars first, PETV under). On a wager, dice or Bold result it ticks up by the amount just burned with a "+$0.40 burned" line. |
| **Fairness check** | `fairness-check`: a "Check this result" text link (ink, sky underline, shield-check icon) on every random result (battle, wheel, dice, wager, monster, expedition, egg hatch, breeding, cosmetic drop) and the claim sheet (DECISIONS #44). Opens a sheet (sky top shadow): "Locked in before the fight" with time, "Revealed after", a lime "Matches" pill with ink check, and a "See it on the public record" link. Pending: grey pill "Being revealed · nothing for you to do". |
| **Evolve and Breed buttons** | On the Home pet card under the stage, side by side: pink **Evolve** and white **Breed**. Locked: cooldown button with lock icon and the reason ("Evolve at Lv 15", "Breed at Adult"). Ready: plain "Evolve"; if the evolution item is missing, the cost shows dollars first ("Evolve · needs Elder item $3"), token amount under it in the sheet. Breed shows its cost the same way ("Breed · $2.99"). Breeds left as a status pill ("3 of 5 breeds left"). |
| **Evolve sheet / Breed sheet** | Bottom sheets. Evolve: before → after preview on two small blob stages, path badge (Warrior / Guardian / Explorer), item needed with a tick or "Get it in Store", money stack, lemon Evolve, text button. Breed: pick a second adult (pet chips), egg preview, "Breed 2 of 5 · costs double the last one", money stack, lemon Breed, text button. |
| **Co-Pet card menu** | Three-dot icon button ("Co-Pet options") at the top right of the Co-Pet card; opens a small sheet with "Leave Co-Pet" (ink text, orange icon) and the text button. |
| **Season card and page** | Play hub card (sky job): trophy icon tile, status pill "Week 4 of 12", "Your rank #128". Season page: weeks left, your rank row (ink, lime underline on rank change), leaderboard rows (target-row look, no Attack button), "Top players share the season pool" money stack, and a Hall of Fame segment (Death Match). |
| **Wager setup** | Battle › Duel with the `Ranked / Wager` switch on Wager: stake chips ("$1 · $5 · $10", money stack under), danger note, burn line "5% of the pot is burned", lemon "Find a match". |
| **Guild screens** | Guild tab with segmented tabs **Guild / War**: guild card (name, members x/10, Invite a friend), member rows (reuse target row), War scoreboard (5 match chips, ink scores with lime/orange underlines), Gold prize money stack. Mock: key-guild. |

## Do's and Don'ts

| Do | Don't |
|---|---|
| Give every colour one job (lemon act, lime points/care, sky ETH, orange trouble, pink brand) | Use sky for points, lime for ETH, or orange to celebrate |
| Solid coloured candy shadows straight down | Blurry or grey drop shadows |
| White sticker outline + gloss strip on pressable pills | Gloss on waiting (cooldown) buttons |
| Put the wait inside the disabled button ("Next spin in 23h 59m") | Hide a button or grey it out with no reason |
| Dollars big, token or ETH small underneath | ETH-first prices, "Ξ", 6-decimal zeros, mixed strings like "Ξ$0.0006 (~$1.5)" |
| Custom chunky rounded SVG icons | Emoji, pixel art, mixed icon styles |
| Blob stage around every pet; keep the pet big | Rectangle frames, or economy UI that shrinks the pet |
| Rarity as stars + word | Rarity by colour alone |
| Small playful tilts on badges, tags, blobs | Tilting body text, buttons in a row, or numbers you must read exactly |
| Light mode only | A dark mode in release 1 |
| Ink text and icons on every candy fill (pink, lime, sky, orange, lemon) | White text on a candy fill (fails WCAG AA at 1.86–2.83:1) |
| Reward and points text in ink; colour only in a pill, underline or dot | `lime-deep` / `orange-deep` / `sky-deep` text on white |
| Pet name and other pink text in `pink-deep`, large only | Plain `pink` text on the page or on white |
| Say claiming resets pot points; level stays (lifetime points) | Copy or art that shows the level dropping after a claim |
| Bottom sheets for overlays on phone | Centered modals with an (i) info icon (the Fren Pet pattern) |
| 3px ink focus ring on every focusable item | Removing the focus outline without the ink ring |
| `ink-soft` only on light grounds (page, white, field, tints, tracks, dot) | `ink-soft` or `pink-deep` on `cooldown`, `stage-sky` or a candy fill |
| Text 13px or larger; 14px tokens and tab labels; 16px body | 9–12px labels or captions |
| Active tab / segment = pink + ink bar under the label | Pink fill as the only "you are here" cue |
| Bursts that flash at most 3 times a second | Strobing crit, confetti, hatch or wheel lights |

## Open questions

1. **Breakpoints and desktop overlays:** phone and desktop layouts are mocked at 390 and 1280px; the switch-over width, tablet behaviour, and whether desktop overlays are bottom sheets, side panels or centered dialogs are not set. Whatever the form, it is `role="dialog" aria-modal="true"` with the sheet focus rules in EXPERIENCE.md.
2. **Spine-only surfaces** (no mock; build from the tokens above): see EXPERIENCE.md › Mock coverage.
