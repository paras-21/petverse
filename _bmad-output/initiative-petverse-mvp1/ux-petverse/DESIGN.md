---
title: Petverse design
status: final
created: 2026-10-14
updated: 2026-10-15
sources:
  - ../prd-petverse/prd-petverse.md
  - .memlog.md
  - ../../../docs/DECISIONS.md
  - https://claude.ai/artifact/SL5RMr25HwAxzUAUUKMTZy
name: Petverse Pet Press
description: 'Pet Press UI layer for Petverse release 1 (DECISIONS #58): squishy 3D jelly pets printed into a comic book. Riso-ink paper UI, 3px ink outlines, hard diagonal ink shadows, square print-cut panels, halftone shade, collectible die-cut cards, pixel numbers. Battle, Death Match and raid screens use the "Night Arcade" skin. Light mode for release 1. The glossy 3D jelly pet species are fixed and sit inside it; stage, element and shiny looks are added on top (DECISIONS #37).'
colors:
  # Base (day: Pet Press)
  background: '#FFF4F1'        # paper
  dot: '#F6E1DA'               # loading placeholders, skeletons (decorative only; never a boundary). Was the Candy polka dot.
  surface: '#FFFFFF'           # panels, cards, sheets, window bodies
  ink: '#24131C'               # text, outlines, hard shadows, focus ring
  ink-soft: '#6B5A63'          # secondary text, token amounts (light grounds only)
  # Colour jobs (each fill has a deep partner; text and icons on every fill are ink)
  pink: '#FF4F9A'              # brand, active tab, secondary (riso) shadow, misregister
  pink-deep: '#D93D80'         # large pink text on light grounds only (logo word, "Season Pass")
  lemon: '#FFD43B'             # act: the main thing to press, buy
  lemon-deep: '#E0B400'
  lime: '#4CC968'              # points, care, feed, "you won"
  lime-deep: '#3A9E50'
  sky: '#3DA9F5'               # ETH, pot, claim, trips
  sky-deep: '#1E85CC'
  orange: '#FF7A2F'            # trouble: hungry, robbed, revenge, danger, loss
  orange-deep: '#D9661C'
  cooldown: '#D9D2D6'          # disabled / waiting fill, sold out
  cooldown-deep: '#B9AFB4'
  mint: '#9BE8C8'              # stage ground: pet stage panel, egg case, try-on ground
  # Tints and tracks
  tint-orange: '#FFF1E6'       # danger note background
  tint-orange-row: '#FFF4EC'   # revenge row background
  tint-lime: '#F1FBEC'         # "pot points go back to 0, level stays" box
  tint-sky: '#EEF8FE'          # pot explainer box
  track-sky: '#E3F4FC'         # progress bar track (trips)
  track-orange: '#FFE1CC'      # hunger / boss bar track
  track-pink: '#FFE1EC'        # health bar track (day)
  field: '#FFFFFF'             # text input fill
  chip-neutral: '#F6EFF2'      # Skip chip
  # Stage
  stage-sky: '#9BE8C8'         # = mint; UI stage panel behind the 3D pet
  stage-sky-top: '#BFE0FB'     # 3D island / egg scene only (may keep its own sky)
  stage-sky-horizon: '#E4F3FF' # 3D island / egg scene only
  stage-hill: '#4CC968'        # ground hill on the stage panel (= lime, ink top line)
  # Print effects
  halftone: '#24131C'          # halftone dots and screentone lines (= ink, used at opacity)
  holo-1: '#FFD6EC'            # holo foil stops (Rare+ cards, rare eggs)
  holo-2: '#D6F2FF'
  holo-3: '#E8FFD6'
  holo-4: '#FFF3C4'
  # Night Arcade (battle, Death Match, raid only)
  night-bg: '#020C11'
  night-panel: '#0E2023'
  night-line: '#55726F'        # panel lines, secondary button borders (3.22:1 on panel)
  night-dither: '#1E313B'      # checker dither borders (decorative)
  night-mint: '#88F495'        # HP, go, win, main action
  night-pink: '#FF6FB5'        # enemy, Death Match title, night shadow
  night-text: '#EAF2EE'        # text, night focus ring
  # Overlays
  scrim: '#24131C61'           # ink at 38%
typography:
  display-hero:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 54px
    fontWeight: '800'
    lineHeight: '0.98'
    letterSpacing: -2px
  display-hero-mobile:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 30px
    fontWeight: '800'
    lineHeight: '1.04'
    letterSpacing: -1px
  pet-name:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 34px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: -1px
  pet-name-desktop:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 46px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: -1.5px
  screen-title:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 30px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: -1px
  screen-title-desktop:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 44px
    fontWeight: '800'
    lineHeight: '1'
    letterSpacing: -1.5px
  number-xl:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1'
  number-result:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1'
  number-lg:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 28px
    fontWeight: '400'
    lineHeight: '1.1'
  number-lg-desktop:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 36px
    fontWeight: '400'
    lineHeight: '1.1'
  headline:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -1px
  sheet-title:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 26px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -1px
  window-title:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 17px
    fontWeight: '800'
    lineHeight: '1.1'
  money-usd:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 22px
    fontWeight: '400'
    lineHeight: '1'
  money-usd-sm:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1'
  money-token:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.3'
  timer:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.2'
  stat-tag:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.2'
  pixel-title:
    fontFamily: 'Silkscreen, ui-monospace, "Courier New", monospace'
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.1'
  title-md:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 20px
    fontWeight: '800'
    lineHeight: '1.05'
  title-sm:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '800'
    lineHeight: '1.1'
  button:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 18px
    fontWeight: '800'
    lineHeight: '1'
  button-hero:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 22px
    fontWeight: '800'
    lineHeight: '1'
  button-sm:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: '800'
    lineHeight: '1'
  label:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: '700'
    lineHeight: '1.3'
  tab-label:
    fontFamily: '"Bricolage Grotesque", "Arial Black", "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: '800'
    lineHeight: '1.2'
  body:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.45'
  body-strong:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.45'
  body-lg:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 17px
    fontWeight: '400'
    lineHeight: '1.5'
  caption:
    fontFamily: 'Figtree, "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.35'
rounded:
  none: 0px        # print cut: panels, windows, buttons, chips, tags, tabs, bars, sheets, inputs
  full: 9999px     # circles only: avatars, pet chips, reward-track nodes, progress dots
  blob: '46% 54% 42% 58% / 48% 46% 54% 52%'        # pets, pet frames, ground shadow
  blob-wide: '44% 56% 40% 60% / 30% 34% 66% 70%'   # wide organic ground (fight arena floor, hill)
  egg: '50% 50% 46% 46% / 58% 58% 42% 42%'         # eggs in the egg case and cards
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  gutter-phone: 16px        # side padding on phone
  stack-gap: 16px           # vertical gap between panels on phone (room for the 6px shadow)
  gutter-desktop: 26px      # side padding on desktop
  column-gap-desktop: 24px  # gap between main column and right rail
  rail-desktop: 370px       # right rail width (380px on Battle)
  grid-gap-desktop: 22px    # Play hub card grid
  tabbar-height: 70px
  outline: 3px              # ink outline: panels, buttons, cards, chips, title-bar rule
  outline-sm: 2px           # small tags (RARE, LV 7), stage labels
  outline-stage: 4px        # hero spots: stage pet outline, collectible card, result card
  shadow-offset: 6px        # panels, windows, cards: 6px 6px 0
  shadow-offset-button: 5px # buttons (4px on phone grid buttons)
  shadow-offset-sm: 3px     # chips, balance chip, small tags
  shadow-pressed: 2px       # pressed: translate(2px, 2px) + 2px shadow
  halftone-grid: 7px        # halftone dot pitch
  halftone-dot: 1.5px       # halftone dot radius
  screentone-pitch: 7px     # 135° line tone pitch, 1.5px lines
  misregister: 3px          # pink text-shadow offset on big titles
  scroll-padding-bottom: 96px   # tab bar 70 + slack, so focus is never under the tab bar
  target-min: 44px          # min height and width of anything pressable
components:
  focus-ring:                # every focusable item, via :focus-visible
    outline: '3px solid {colors.ink}'
    outlineOffset: 3px
    rounded: follows the item's own shape
  focus-ring-night:          # Night Arcade surfaces
    outline: '3px solid {colors.night-text}'
    outlineOffset: 3px
  button-primary:            # lemon = act
    backgroundColor: '{colors.lemon}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    pressed: 'translate(2px, 2px); 2px 2px 0 {colors.ink}'
    typography: '{typography.button}'
    padding: 12px 20px
    minHeight: 52px
  button-hero:
    backgroundColor: '{colors.lemon}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    typography: '{typography.button-hero}'
    padding: 14px 28px
  button-care:               # lime = feed, care, "Yay!"
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    typography: '{typography.button}'
  button-brand:              # pink = dress up, share, social, Evolve
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    typography: '{typography.button}'
  button-eth:                # sky = team up, money, claim
    backgroundColor: '{colors.sky}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    typography: '{typography.button}'
  button-trouble:            # orange = revenge
    backgroundColor: '{colors.orange}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.ink}'
    typography: '{typography.button-sm}'
    padding: 8px 14px
    minHeight: '{spacing.target-min}'
  button-ghost:              # white secondary: Later, Log in, Google, wallet, Back, Breed
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.pink}'   # riso second ink
    typography: '{typography.button}'
  button-cooldown:           # disabled with the wait inside
    backgroundColor: '{colors.cooldown}'
    textColor: '{colors.ink}'          # 11.93:1
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    icon: clock                        # "waiting" = flat (no offset shadow) + clock, never lighter text
    rounded: '{rounded.none}'
    shadow: none
    typography: '{typography.button-sm}'
    minHeight: '{spacing.target-min}'
  button-text:               # calm exit, e.g. "Not now, keep growing"
    textColor: '{colors.ink}'
    underlineColor: '{colors.pink}'    # 3px underline
    typography: '{typography.button}'
  window-panel:              # Duelo-style window; job variants via title bar colour
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    titleBarBackground: '{colors.sky}'   # = the panel's job colour
    titleBarRule: '3px solid {colors.ink}'
    titleTypography: '{typography.window-title}'
    metaTypography: '{typography.timer}'
    closeTarget: '{spacing.target-min}'
  sticker-card:              # name kept; now a plain print panel. Job variants: see Components › Job variants
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    padding: 16px
  collectible-card:          # die-cut card for pets, eggs, cosmetics
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline-stage}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.pink}'
    art: 'holo foil (Rare+) or mint ground, 3px ink frame'
    tierTag: '{components.rarity-tag}'
    tilt: '-3deg to 3deg'
  number-blob-points:        # name kept; now a points window
    backgroundColor: '{colors.surface}'
    titleBarBackground: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    typography: '{typography.number-lg}'
  number-blob-pot:           # name kept; now the pot big-number window
    backgroundColor: '{colors.surface}'
    titleBarBackground: '{colors.sky}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    typography: '{typography.number-lg}'
    rankUnderline: '3px {colors.sky}'
  money-stack:
    amountTypography: '{typography.money-usd}'
    tokenTypography: '{typography.money-token}'
    tokenColor: '{colors.ink-soft}'
  timer-chip:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    typography: '{typography.timer}'
  timer-chip-hungry:
    backgroundColor: '{colors.orange}'
    textColor: '{colors.ink}'
  pet-badge:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.none}'
    typography: '{typography.stat-tag}'
  element-badge:             # DECISIONS #37: badge + accent, never coat colour
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    iconColor: '{colors.ink}'      # emblem: fire flame, leaf, stone, spark bolt, water drop
    borderWidth: '{spacing.outline-sm}'
    rounded: '{rounded.none}'
    typography: '{typography.label}'
  pet-name:
    textColor: '{colors.ink}'
    textShadow: '3px 3px 0 {colors.pink}'   # misregister (print effects); plain ink when off
    typography: '{typography.pet-name}'
  blob-stage:                # name kept; now a square stage panel with an organic ground
    backgroundColor: '{colors.mint}'
    groundColor: '{colors.stage-hill}'
    groundRule: '4px solid {colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    texture: 'screentone on the top 45% at 10% (print effects)'
    petGroundShadow: 'halftone ellipse, {rounded.blob}, 55% opacity'
  name-tag:
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    tilt: -3deg
  speech-bubble:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    tail: 'square ink-outlined tail'
    tilt: -3deg
  alert-pill:                # name kept; now a white strip
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.orange}'
  status-pill:               # name kept; square chip
    textColor: '{colors.ink}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    typography: '{typography.label}'
    backgroundColor: '{colors.lime}'   # job variants: see Components › Job variants
    padding: 4px 10px
  icon-tile:
    iconColor: '{colors.ink}'
    size: 48px
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    backgroundColor: '{colors.lime}'   # job variants
  avatar:
    size: 42px
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.full}'
  tab-bar:                   # full-width bottom bar
    backgroundColor: '{colors.surface}'
    height: '{spacing.tabbar-height}'
    borderTop: '3px solid {colors.ink}'
    rounded: '{rounded.none}'
  tab-active:
    backgroundColor: '{colors.pink}'
    textColor: '{colors.ink}'
    typography: '{typography.tab-label}'
    indicator: '3px {colors.ink} bar under the label'   # non-colour cue
    divider: '3px solid {colors.ink}'
  top-nav-pill:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.ink}'
    activeBackground: '{colors.pink}'
    activeText: '{colors.ink}'
    activeIndicator: '3px {colors.ink} bar under the label'
  segmented-tabs:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    activeBackground: '{colors.pink}'
    activeText: '{colors.ink}'
    activeIndicator: '3px {colors.ink} bar under the label'
  bottom-sheet:
    backgroundColor: '{colors.surface}'
    borderTop: '3px solid {colors.ink}'
    rounded: '{rounded.none}'
    shadow: '0 -6px 0 {colors.pink}'
    scrim: '{colors.scrim}'
    handleColor: '{colors.ink}'
  step-chip:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.ink}'
    counterBackground: '{colors.lemon}'
    skipBackground: '{colors.chip-neutral}'
  progress-dots:
    on: '{colors.pink}'
    off: '{colors.surface}'
    border: '2px solid {colors.ink}'
    width: 28px
    height: 8px
  target-row:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    rewardColor: '{colors.ink}'
    rewardUnderline: '{colors.lime}'   # colour only in the 3px underline, never the text
  revenge-row:
    backgroundColor: '{colors.tint-orange-row}'
    shadow: '5px 5px 0 {colors.orange}'
    rewardColor: '{colors.ink}'
    rewardUnderline: '{colors.orange}'
  nameplate:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.ink}'
  health-bar:
    track: '{colors.surface}'
    border: '3px solid {colors.ink}'
    fill: '{colors.lime}'
    fillLow: '{colors.orange}'
    rounded: '{rounded.none}'
    height: 14px
  hit-label:                 # day; Night Arcade uses hit-word
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    textColor: '{colors.ink}'
  result-card:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-stage}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
    typography: '{typography.number-result}'
    tilt: -2deg
  progress-bar:
    track: '{colors.surface}'
    border: '3px solid {colors.ink}'
    fill: '{colors.sky}'
    rounded: '{rounded.none}'
  lives-hearts:
    color: '{colors.pink}'
    outline: '2px {colors.ink}'
    size: 24px
  danger-note:
    backgroundColor: '{colors.tint-orange}'
    borderWidth: '{spacing.outline}'
    iconColor: '{colors.ink}'          # icon sits on an orange square
    iconBackground: '{colors.orange}'
    rounded: '{rounded.none}'
    typography: '{typography.body}'
  prize-wheel:
    slices: '{colors.lime} {colors.lemon} {colors.sky} {colors.pink} {colors.orange}'
    labelColor: '{colors.ink}'
    dividers: '{colors.ink}'
    rim: '4px solid {colors.ink}'
    shadow: '6px 6px 0 {colors.ink}'
  prize-card:
    backgroundColor: '{colors.lime}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline-stage}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.ink}'
  rarity-tag:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline-sm}'
    textColor: '{colors.ink}'
    rounded: '{rounded.none}'
    typography: '{typography.stat-tag}'  # word in caps: COMMON, RARE, EPIC, LEGENDARY
  rarity-tag-legendary:
    backgroundColor: '{colors.lemon}'
    textColor: '{colors.ink}'
  item-tile:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
  egg-case:                  # shop vending grid
    window: '{components.window-panel}'
    titleBarBackground: '{colors.lemon}'
    gridBackground: '{colors.mint}'
    columns: 3
    slotBackground: '{colors.surface}'
    slotBorder: '3px solid {colors.ink}'
    slotSelected: '0 0 0 3px {colors.pink}'
    priceTypography: '{typography.timer}'
    soldOut: '{colors.cooldown} fill + "Sold out" in ink'
  cosmetic-tile:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
    selectedRing: '0 0 0 3px {colors.pink}; 5px 5px 0 {colors.pink}'
  try-on-card:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.pink}'
  pass-card:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '6px 6px 0 {colors.pink}'
  reward-track:
    track: '{colors.cooldown}'
    fill: '{colors.lime}'
    nodeDone: '{colors.lime}'
    nodeFinal: '{colors.pink}'
    nodeBorder: '3px solid {colors.ink}'
  market-row:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '5px 5px 0 {colors.ink}'
  claim-sheet:
    shadow: '0 -6px 0 {colors.sky}'
    amountTypography: '{typography.number-xl}'
    resetBox: '{colors.tint-lime}'
    potBox: '{colors.tint-sky}'
  input-field:
    backgroundColor: '{colors.field}'
    borderColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    typography: '{typography.body}'
  wallet-chip:
    backgroundColor: '{colors.surface}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.ink}'
    amountTypography: '{typography.money-usd-sm}'
  free-actions-chip:         # top bar "7 free left"
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.lime}'
    shadowAtZero: '3px 3px 0 {colors.cooldown-deep}'
    typography: '{typography.label}'
  streak-pill:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.lime}'
    typography: '{typography.label}'
  shortfall-note:            # "You need $1.40 more"
    backgroundColor: '{colors.tint-orange}'
    textColor: '{colors.ink}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    typography: '{typography.body}'
  burn-counter:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    iconColor: '{colors.ink}'      # flame on an orange square; meaning carried by the words
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '3px 3px 0 {colors.orange}'
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
  # Night Arcade (battle, Death Match, raid only)
  night-panel:
    backgroundColor: '{colors.night-panel}'
    textColor: '{colors.night-text}'
    borderColor: '{colors.night-line}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    edge: 'checker dither band in {colors.night-dither}, 6px cells (decorative, never behind text)'
    glow: 'radial {colors.night-mint} at 22% under the pets'
  night-button-primary:
    backgroundColor: '{colors.night-mint}'
    textColor: '{colors.night-bg}'
    borderColor: '{colors.night-text}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    shadow: '4px 4px 0 {colors.night-pink}'
    typography: '{typography.button}'
    minHeight: 52px
  night-button:
    backgroundColor: '{colors.night-panel}'
    textColor: '{colors.night-text}'
    borderColor: '{colors.night-line}'
    borderWidth: '{spacing.outline}'
    rounded: '{rounded.none}'
    typography: '{typography.button}'
    minHeight: 52px
  night-hp-bar:
    track: '{colors.night-panel}'
    border: '2px solid {colors.night-mint}'
    fill: '{colors.night-mint}'        # you
    fillEnemy: '{colors.night-pink}'   # opponent
    valueText: '{colors.night-text}'   # "62 / 100" always shown
  night-title:
    textColor: '{colors.night-pink}'
    typography: '{typography.pixel-title}'
  night-chip:
    backgroundColor: '{colors.night-mint}'
    textColor: '{colors.night-bg}'
    typography: '{typography.timer}'
    rounded: '{rounded.none}'
  hit-word:
    textColor: '{colors.lemon}'
    textShadow: '3px 3px 0 {colors.night-pink}'
    typography: '{typography.headline}'
    size: 40px
    tilt: -6deg
  icon:
    style: custom chunky SVG, 24x24 grid, filled shape in currentColor with a 2px ink outline look, square-ish cuts (print style)
---

# Petverse — Design Spine

Visual identity for release 1. Behaviour lives in [EXPERIENCE.md](EXPERIENCE.md). Mocks are references only; which surfaces are mocked, and the rule for conflicts, are in EXPERIENCE.md › Mock coverage.

- **Chosen theme: Pet Press** (owner, 2026-10-15, DECISIONS #58). Replaces Candy "Sticker book".
- Style tile: [.working/direction-pet-press.html](.working/direction-pet-press.html) (source of every hex, font, line and shadow here).
- Visual canvas (style tile + Home, Shop, Night Arcade battle phone mocks): https://claude.ai/artifact/SL5RMr25HwAxzUAUUKMTZy (its "C · Diorama" board is rejected; ignore it).
- Key screens: the 8 `key-*.html` mocks in `.working/` were drawn in Candy. Their **layout and content** still hold; their **look** follows this file. See EXPERIENCE.md › Mock coverage.

## Brand & Style

Petverse is a cute 3D pet game where your pet earns you a share of a real prize pot. One line: **squishy 3D jelly pets, printed into a comic book.** The UI is riso-ink on paper: thick ink outlines, flat fills in a few owned inks, hard diagonal shadows with no blur, halftone dots on the shadow side, and collectible die-cut cards. Numbers are pixel type, like an arcade score. It is for the casual, social, share-a-screenshot player who comes for cute pets and stays for friends.

Ideas borrowed, then remixed: Pallet (one thick ink outline, 2-tone flat fills); Duelo (every panel is a window with a title bar and hard shadow); pixel games (pixel type for numbers, a lit vending case shop); Azuki / Doodles (print texture, small owned palette).

The **glossy jelly 3D pets** (`src/components/three`: `species.tsx`, `PetModel.tsx`, `jelly.tsx`, `Stage.tsx`, `EggModel.tsx`) keep their jelly material, species and palettes. Pet Press adds two things only: an **ink outline** (inverted hull, about `{colors.ink}`) and a **halftone dot ground-shadow decal** under the feet. **No post-processing passes** on the 3D canvas (keeps phones fast). The pet is the face of the product and is never small or hidden behind economy UI.

Light mode for release 1. **Night Arcade** (below) is a skin for battle, Death Match and raid screens only; it is not a dark mode.

Superseded (not to be built): Candy "Sticker book" (`.working/direction-candy.html`), the cozy, bold and premium directions, and the six `theme-bold-*` themes.

## Colors

Every colour has **one job**. A colour that means "points" never decorates a money button, and so on. Max 2–3 inks per screen besides ink and paper.

| Job | Fill | Deep partner | Used for | Never for |
|---|---|---|---|---|
| Brand | `{colors.pink}` `#FF4F9A` | `{colors.pink-deep}` `#D93D80` | Logo, active tab, active segment, name tag, secondary (riso) shadow, misregister, Dress up / Share / Evolve | Money or danger |
| Act | `{colors.lemon}` `#FFD43B` | `{colors.lemon-deep}` `#E0B400` | The main thing to press: Feed, Play, Spin, Attack, Buy, Claim; shop window bar | Status or decoration |
| Points and care | `{colors.lime}` `#4CC968` | `{colors.lime-deep}` `#3A9E50` | Points window, feed, timer chip (fed), "You won", stage hill, reward track | ETH |
| ETH | `{colors.sky}` `#3DA9F5` | `{colors.sky-deep}` `#1E85CC` | Pot window, your share, claim sheet, expeditions, 2v2 team up | Points |
| Trouble | `{colors.orange}` `#FF7A2F` | `{colors.orange-deep}` `#D9661C` | Hungry, robbed alert, Revenge, Death Match, boss bar, "So close!", low health | Celebration |
| Waiting | `{colors.cooldown}` `#D9D2D6` | `{colors.cooldown-deep}` `#B9AFB4` | Disabled buttons that show their wait, sold out, unreached nodes | Anything pressable |
| Stage | `{colors.mint}` `#9BE8C8` | — | Pet stage panel, egg case grid, try-on ground | Text grounds for `ink-soft` |

Base: page `{colors.background}` `#FFF4F1` (paper); panels in `{colors.surface}` `#FFFFFF`; text, outlines and shadows in `{colors.ink}` `#24131C`; secondary text and token amounts in `{colors.ink-soft}` `#6B5A63`. `{colors.dot}` `#F6E1DA` is now the loading placeholder tint (was the Candy polka dot). Deep partners are no longer shadows (shadows are ink or pink); they stay for small marks such as pressed fills and chart edges, never as text. `stage-sky` = mint for the UI stage; `stage-sky-top` / `-horizon` stay for the 3D island and egg scene only. Sheets dim the page with `{colors.scrim}` (ink at 38%).

**Contrast (measured with node, WCAG 2.x, 2026-10-15). 0 failures.**

| Pair | Ratio | Status |
|---|---|---|
| `ink` on `background` / `surface` | 16.42 / 17.72 | Pass AA |
| `ink` on `lemon` / `cooldown` / `mint` / `lime` | 12.43 / 11.93 / 12.47 / 8.32 | Pass AA |
| `ink` on `sky` / `orange` / `pink` | 6.91 / 6.82 / 5.77 | Pass AA |
| `ink` on `dot`, every tint and track, `chip-neutral` | 14.09 / 14.26+ / 15.65 | Pass AA |
| `ink` on holo stops (`holo-1`..`holo-4`) | 13.57+ | Pass AA |
| `ink-soft` on `background` / `surface` / `dot` | 5.96 / 6.43 / 5.11 | Pass AA |
| `ink-soft` on tints / tracks / `chip-neutral` | 5.81–6.04 / 5.17–5.70 / 5.68 | Pass AA |
| `pink-deep` on `background` / `surface` | 3.95 / 4.26 | Pass AA large only |
| `ink-soft` on `cooldown` / `mint` | 4.33 / 4.52 | Not used (too close to the floor) |
| `surface` (white) on `pink` | 3.07 | Not used for text |
| `pink` on `background` | 2.85 | Not used for text |
| Focus ring / outline `ink` vs `background` / `mint` / `pink` | 16.42 / 12.47 / 5.77 | Pass 3:1 non-text |
| Night: `night-text` on `night-bg` / `night-panel` / `night-dither` | 17.34 / 14.75 / 11.83 | Pass AA |
| Night: `night-bg` on `night-mint` / `night-pink` | 14.50 / 7.71 | Pass AA |
| Night: `night-mint` on `night-bg` / `night-panel` | 14.50 / 12.34 | Pass AA |
| Night: `night-pink` on `night-bg` / `night-panel` | 7.71 / 6.56 | Pass AA |
| Night: `lemon` hit word on `night-panel` | 11.79 | Pass AA large |
| Night: `night-line` vs `night-bg` / `night-panel` | 3.78 / 3.22 | Pass 3:1 non-text |
| Night: focus ring `night-text` vs `night-panel` | 14.75 | Pass 3:1 non-text |

**Text rule:** every text and background pair in the product is in the passing rows above. `ink-soft` is only for text on `background`, `surface`, `field`, `chip-neutral`, `dot`, a tint or a track; never on `cooldown`, `mint` or a colour fill.

**Rule (owner, 2026-10-14):** all text and icons on a colour fill (pink, lime, sky, orange, lemon, mint) are `{colors.ink}`, never white. Pink text on a light ground (logo word, "Season Pass") uses `{colors.pink-deep}` and must be large (18.66px bold or more). White is for panel bodies only.

**Reward text (owner, 2026-10-14):** coloured reward, points or loss text on white or a pale tint is `{colors.ink}`; the colour job moves into a chip fill, a 3px underline or an icon square next to it (e.g. "**Win +620**" in ink with a `{colors.lime}` underline). Never `lime-deep`, `orange-deep` or `sky-deep` as text colour.

**Non-text cues:** the active tab, nav item and segment add a 3px `{colors.ink}` bar under the label. A selected tile adds an ink check badge. Bars (health, hunger, trips, boss) always show their value in words next to them ("34 / 100 · Low", "62% boss health").

### Night Arcade

A skin for **battle, Death Match and raid screens only** (DECISIONS #58). Same type, same outline and hard-shadow grammar, same colour jobs; only the ground goes dark.

| Token | Hex | Job |
|---|---|---|
| `night-bg` | `#020C11` | Page |
| `night-panel` | `#0E2023` | Arena, panels, secondary buttons |
| `night-line` | `#55726F` | Panel lines, secondary button borders, dashed "winner takes" box |
| `night-dither` | `#1E313B` | Checker dither band at the top of the screen and arena floor (decorative) |
| `night-mint` | `#88F495` | Your HP, go, win, main move button, round chip |
| `night-pink` | `#FF6FB5` | Enemy HP, "DEATH MATCH" pixel title, shadow on the main button |
| `night-text` | `#EAF2EE` | All text, outline on the main button, focus ring |

- Pets are the light source: a soft radial `night-mint` glow under the arena. 3D pets still get the ink outline (use `night-bg` as hull colour) and a halftone ground shadow.
- Title in `pixel-title` (Silkscreen 20px) in `night-pink`. Hit words ("BONK!") are `hit-word`: Bricolage 800 40px lemon with a 3px `night-pink` offset, −6°, only when motion is allowed.
- Text on `night-mint` or `night-pink` fills is `night-bg`. Lemon, sky, orange keep their jobs on night as fills with `night-bg` text.
- Focus ring on night is `focus-ring-night` (3px `night-text`).
- Leaving the fight (result, claim, back to Home) returns to the day theme.

## Typography

Three free families, loaded with `next/font/google` (self-hosted at build, no runtime call to Google). Drops Baloo 2 and Nunito.

- **Display:** `"Bricolage Grotesque"` 800, fallbacks `"Arial Black", "Segoe UI", sans-serif`. Pet names, titles, buttons, tabs, window titles. Letter-spacing −1 to −3px at large sizes (≥26px).
- **Body:** `Figtree` 400 / 600 / 700, fallback `"Segoe UI", sans-serif`. Explaining sentences, labels, help lines, token amounts.
- **Numeric (pixel):** `Silkscreen` 400, fallback `ui-monospace, "Courier New", monospace`. Money (dollars), timers, stats, level tags and rarity tags **only**. Never under 14px; main money 16px or more. Every Silkscreen amount has a plain-text accessible label (e.g. `aria-label="4 dollars 20 cents"` or visible words next to it), because pixel glyphs are harder to read for some players.

| Role | Token | Size | Font | Where |
|---|---|---|---|---|
| Landing hero | `display-hero` / `display-hero-mobile` | 54 / 30px | Bricolage | "Raise a cute pet. Battle friends. Share a real prize pot." |
| Pet name | `pet-name` / `pet-name-desktop` | 34 / 46px | Bricolage | Home header, ink with pink misregister |
| Screen title | `screen-title` / `screen-title-desktop` | 30 / 44px | Bricolage | Battle, Play, Shop |
| Claim amount | `number-xl` | 48px | Silkscreen | "Claim $42.08" amount |
| Result number | `number-result` | 48px | Silkscreen | "+620" |
| Window number | `number-lg` / `number-lg-desktop` | 28 / 36px | Silkscreen | Points, pot, your share |
| Headline | `headline` | 28px | Bricolage | "Mochi beat Pudding" |
| Sheet title | `sheet-title` | 26px | Bricolage | "Let's get your egg!" |
| Window title | `window-title` | 17px | Bricolage | "Weekly pot", "Egg case" |
| Dollar amount | `money-usd` / `money-usd-sm` | 22 / 16px | Silkscreen | Prices, shares, balance chip |
| Token amount | `money-token` | 14px | Figtree 600 | "1,310 PC", "0.018 ETH" under dollars |
| Timer, stat, tags | `timer` / `stat-tag` | 14px | Silkscreen | "05:13:24", "LV 7", "RARE", "12 DAYS" |
| Night title | `pixel-title` | 20px | Silkscreen | "DEATH MATCH" |
| Card title | `title-md` / `title-sm` | 20 / 16px | Bricolage | Collectible card name, activity cards |
| Buttons | `button-hero` / `button` / `button-sm` | 22 / 18 / 14px | Bricolage | Play / most / row buttons |
| Labels | `label` | 13px | Figtree 700 | Badges, status chips, captions on windows |
| Tab label | `tab-label` | 14px | Bricolage | Tab bar |
| Body | `body` / `body-strong` / `body-lg` / `caption` | 16 / 16 / 17 / 13px | Figtree | Explaining sentences; caption for fine print |

Rules: numbers use tabular figures (`font-variant-numeric: tabular-nums`); thousands use a comma ("12,480"). Money is always dollars first in the bigger size and the token or ETH amount underneath in `money-token`. No all-caps in sentences; caps only inside Silkscreen tags ("RARE", "LV 7"). **Size floor:** no text under 13px anywhere; Silkscreen never under 14px; token amounts and tab labels 14px; body 16px. Sizes are set in `rem` so 200% browser zoom works, and layouts reflow at 320px wide. Big readable text for key info (points, pot, share, prices, timers) is an accessibility floor, not a style choice.

## Layout & Spacing

Scale `{spacing.1}`–`{spacing.5}` (4 / 8 / 12 / 16 / 24px). Hard shadows take room: leave at least the shadow offset (6px) plus 8px between panels. Two layouts, equally important:

- **Phone (mocked at 390px wide):** one column, `{spacing.gutter-phone}` side padding, panels stacked with `{spacing.stack-gap}`. Two-up and three-up button grids use a 12px gap. A full-width tab bar (`{spacing.tabbar-height}` tall, 3px ink top rule, 3px ink dividers) sits at the bottom. The page sets `scroll-padding-bottom: {spacing.scroll-padding-bottom}` so a focused item is never hidden under the tab bar or an open sheet.
- **Desktop (mocked at 1280px wide):** top nav, then a two-column grid: main column + `{spacing.rail-desktop}` right rail, `{spacing.column-gap-desktop}` apart, `{spacing.gutter-desktop}` side padding. Play hub uses a 3-column card grid (`{spacing.grid-gap-desktop}`); Shop uses the egg case plus 6-column item and 5-column cosmetic grids.

Home on phone, top to bottom: top bar (logo word, trouble chip, balance chip) → pet switcher → stage panel (mint, LV tag, pet, halftone ground shadow) → pet name + mood line → stat bars in words (Food, Joy) → Co-Pet card (Co-Pets only) → points and pot windows → alert strip (if any) → action row (Feed in lemon, then white secondary buttons) → Evolve / Breed. Home on desktop: pet switcher above the stage → header with Feed inline → wide stage with Evolve and Breed on the pet card, Co-Pet card under it → actions in the main column; alert, points window and pot window with Claim in the right rail.

Every pressable item is at least `{spacing.target-min}` (44px) tall and wide (main buttons 52px), including `button-sm`, Skip, Revenge, window close X and reward-track nodes; row buttons sit at least 8px apart.

Breakpoint values between the two layouts are not set yet (see Open questions).

## Elevation & Depth

There is no blur shadow anywhere. Depth is a **hard diagonal offset shadow, no blur**, like a misprinted second plate:

| Level | Shadow | Used on |
|---|---|---|
| Panel | `6px 6px 0 {colors.ink}` | Windows, stage panel, cards, result card |
| Button | `5px 5px 0 {colors.ink}` (4px on phone grids) | Colour-fill buttons |
| Secondary | same offset in `{colors.pink}` (riso second ink) | White buttons, collectible cards, try-on, pass card |
| Chip | `3px 3px 0 {colors.ink}` | Balance chip, nav items, step chip, nameplate |
| Job accent | `3px 3px 0` or `5px 5px 0` in the job colour | Alert strip (orange), free-actions and streak (lime), burn counter (orange) |
| Pressed | `transform: translate(2px, 2px)` + `2px 2px 0` | Any pressable on `:active` |
| Waiting | no shadow (flat) | Cooldown buttons: flat = not pressable |
| Sheet | `0 -6px 0 {colors.pink}` (claim and fairness: `{colors.sky}`) | Bottom sheets, shadow goes up |

Other depth cues: a 3px ink outline (`{spacing.outline}`) around every panel, button, card and chip (4px `{spacing.outline-stage}` on pets and cards in hero spots); the halftone shade on the shadow side (see Print effects); small tilts (−3° to +3°) on collectible cards, name tags and result cards. On phone, overlays are bottom sheets over a `{colors.scrim}`; there are no centered modals.

**Focus ring:** `focus-ring` = `outline: 3px solid {colors.ink}; outline-offset: 3px`, shown with `:focus-visible` on every button, chip, tab, segment, tile, row button, avatar, pet chip, wheel, text button, link, window close and sheet handle. It follows the item's shape (square, circle). Ink passes 3:1 on every day ground (paper 16.42, white 17.72, mint 12.47, pink 5.77). On Night Arcade use `focus-ring-night` (3px `night-text`, 14.75 on panel). The 3px offset keeps the ring clear of the ink outline and hard shadow.

## Shapes

- **Square (print cut)** (`{rounded.none}`) for every panel, window, button, chip, tag, tab, bar, input and bottom sheet.
- **Organic blob** (`{rounded.blob}`, `{rounded.blob-wide}`, `{rounded.egg}`) only for living things and ground: pets, pet frames, eggs, the stage hill and the pet ground shadow. The pet stage is a square mint panel with a blob ground inside; never a plain rectangle hugging the pet itself.
- **Circle** (`{rounded.full}`) for avatars, pet chips, reward-track nodes and progress dots.
- **Window**: square white body, coloured title bar with a 3px ink rule under it, title left (`window-title`), Silkscreen timer or meta right, optional close X (44px target). Title bar colour = the panel's job colour (sky pot, lemon shop, pink brand, orange trouble, lime points).
- **Collectible card**: die-cut card with a 4px ink outline, art window with a 3px frame, name + tier tag; may tilt −3° to +3°.

## Print effects

All print textures sit behind the **Settings › "Print effects"** switch, default **On**. Off = flat colour; outlines and hard shadows stay.

| Effect | Spec | Where | Never |
|---|---|---|---|
| **Halftone shade** | `{colors.halftone}` dots, `{spacing.halftone-dot}` radius on a `{spacing.halftone-grid}` grid, masked to the shadow side only (diagonal mask, transparent 35–45% → solid 85–90%) | Pet shadow side (2D art), card shadow side, egg shading, pet ground shadow (ellipse, ~55% opacity) | Behind any text |
| **Screentone** | 135° line tone, 1.5px lines every `{spacing.screentone-pitch}`, ~10% opacity | Top of the stage panel (sky), empty states | Behind any text |
| **Misregister** | `text-shadow: {spacing.misregister} {spacing.misregister} 0 {colors.pink}` | Big display titles only (26px and up): logo word, pet name, screen titles, "WIN" | Body, labels, buttons, numbers |
| **Holo foil** | 4-stop pastel gradient `{colors.holo-1}` → `{colors.holo-2}` → `{colors.holo-3}` → `{colors.holo-4}` at 120°, optional halftone at 10–12% | Rare+ collectible cards, rare eggs | Without a text tier label (RARE / EPIC / LEGENDARY) |
| **Holo tilt** | Card tilts toward pointer / device | Rare+ cards | When reduced motion or Calm motion is on |

**Rule:** no pattern behind any text. Text always sits on a solid plate (white, a fill, or a tint).

**3D pets:** the ink outline (inverted hull) and the halftone ground-shadow decal are geometry/decals, not post-processing. No outline pass, bloom or any other post-processing pass on the 3D canvas.

**Motion:** reduced motion / Calm motion rules in EXPERIENCE.md stay; in addition they stop holo tilt, misregister jitter and the Night Arcade hit-word pop.

## Components

Visual specs. Behaviour of each lives in EXPERIENCE.md › Component Patterns under the same name. Component names from Candy are kept so EXPERIENCE.md and the epics still match; their look is now Pet Press.

**Icons.** A custom set of chunky SVG icons on a 24×24 grid, filled in `currentColor`, with square-ish cuts that read as printed marks. **No emoji anywhere.** The set: home, battle, play, shop, guild, heart, heart-outline, carrot, shield, wheel, monster, compass, dice, flame, crown, egg, bolt, clock, mail, Google "G", wallet, star, sparkle, gift, trophy, potion, shirt, lock, revenge, coin, diamond, arrow, check, close, zzz, users, hand, tag.

**Job variants.** `sticker-card`, `status-pill`, `icon-tile` and `window-panel` come in one variant per colour job, named `-brand`, `-act`, `-points`, `-eth`, `-trouble`, `-waiting` (e.g. `icon-tile-eth`). `status-pill` and `icon-tile` fill = the job's Fill column; `window-panel` title bar = the job's Fill; `sticker-card` stays white with an ink shadow and takes the job colour only in a small icon square. Outline and text are always `{colors.ink}`.

| Component | Anatomy and look |
|---|---|
| **Button** | `button-primary` (lemon) for the main action; `button-care` (lime), `button-brand` (pink), `button-eth` (sky), `button-trouble` (orange, smaller); all ink text, 3px ink outline, square, `5px 5px 0` ink shadow. `button-ghost`: white with a pink shadow for secondary. `button-hero` for Play and Tap the egg. Pressed: shifts 2px, shadow 2px. Icon left of the label. Full-width on phone when it is the screen's main action. |
| **Cooldown button** | `button-cooldown`: grey fill, ink outline, **ink** label (11.93:1) with the wait in bold ("Attack in **12m**"), clock icon, **no shadow** (flat). Waiting is shown by flatness and the clock, never by lighter text. |
| **Text button** | `button-text`: ink text with a 3px pink underline. Calm exit only. |
| **Window panel** | `window-panel`: white body, coloured title bar (3px ink rule), title left, Silkscreen meta right, optional 44px close X; 6px ink shadow. The main container for pot, points, shop sections, explainers. |
| **Sticker card** | Plain print panel: white, 3px ink outline, 6px ink shadow. Holds explanations, feed card, tips, rails. |
| **Collectible card** | `collectible-card`: die-cut card for pets, eggs and cosmetics. 4px ink outline, pink shadow, art window (holo for Rare+, mint otherwise), name in `title-sm`, tier tag in Silkscreen. Tilt −3° to +3°. |
| **Number blob** (points / pot) | Now windows: `number-blob-points` (lime bar "Points") and `number-blob-pot` (sky bar "Weekly pot", Silkscreen time left). Big Silkscreen amount, then one plain line ("0.41 ETH · top 100 pets share it"), your rank underlined in sky ("Mochi: #38"). Points window shows **pot points** (reset by a claim); the level comes from lifetime points and never drops. Asleep or very hungry: sub-line "No pot share while asleep" (asleep: `{colors.cooldown}` bar). |
| **Money stack** | Silkscreen dollars, then `money-token` amount in `ink-soft` (in `ink` on a colour fill). Prices, shares, wallet chip. Accessible label in words. |
| **Timer chip** | Square lime chip, ink outline, heart icon + Silkscreen countdown (`timer-chip`). Hungry (`timer-chip-hungry`): orange, empty-heart icon and the word: "Hungry · 3h left". |
| **Pet badge** | Small white tag, 2px outline, Silkscreen: "LV 12 · BUNNY" on the stage; full line "Bunny · Leaf · Lv 12 · Adult" in `label` under the name. |
| **Element badge and accent** | `element-badge` (DECISIONS #37): ink emblem (flame, leaf, stone, bolt, drop) + the element word. Accent: same emblem as a small mark on the pet in the stage. Never sets coat colour. Word + icon, never colour alone. |
| **Blob stage** | `blob-stage`: square mint panel, 3px ink outline, 6px ink shadow, screentone on the top, lime blob hill with a 4px ink top line, LV tag top-left, 3D pet centred with halftone ground shadow. Hungry: orange shadow instead of ink. Pink **name tag** (−3°, ink text) optional; white **speech bubble** ("I'm hungry…") with ink outline. |
| **Alert pill** | White strip, ink outline, orange shadow; message left, small trouble button right. |
| **Status pill** | Square chip in a job colour, ink outline, ink icon + text ("Ready", "2 of 3 left today"); grey when waiting. |
| **Icon tile** | 48px square in a job colour, ink outline, one ink icon. |
| **Avatar** | 42px circle, 3px ink ring, pet face crop. Top-right on every page. |
| **Tab bar (phone)** | Full-width white bar, 3px ink top rule; 5 tabs; active tab is a pink cell with ink label, ink dividers, and a 3px ink bar under the label. |
| **Top nav (desktop)** | Logo word (misregister), 5 `top-nav-pill`s (square, ink outline; active = pink + ink bar), free-actions chip, streak chip, wallet chip, avatar. |
| **Segmented tabs** | White strip with ink outline; active segment pink with ink text and a 3px ink bar; optional second line in `label`. |
| **Bottom sheet** | White, square, 3px ink top rule, ink grab handle, pink shadow upward; over a scrim. |
| **Step chip** | White chip, ink outline: lemon counter ("Step 1 of 4"), task text, grey Skip. Paired with **progress dots** (pink = done/current, white = to do, ink ring). |
| **Target row** | White row, ink outline, ink shadow: round pet avatar (sky shield or grey zzz badge), name + LV tag + element badge, points line, "**Win +620** · 54% chance" (ink with lime underline), Attack button. Element edge: lime chip "Leaf beats Stone · +10%"; the chance already includes it (DECISIONS #55). **Revenge row**: orange tint, orange shadow, reward with orange underline, orange Revenge button "no wait". **Shielded row**: 75% opacity, "Safe for now", cooldown button with shield + time. |
| **Nameplate + health bar** | Day: white plate, ink outline, 3px ink shadow; square bar with ink border, lime fill (orange when low), "34 / 100" and "Low". Night: see Night Arcade parts. |
| **Hit label** | Day surfaces: square tilted chip, ink text: orange "Bonk! −18", pink "Crit! −32", sky "Dodge!". Night: `hit-word`. |
| **Battle text box** | White box, ink outline, pink shadow: "Mochi used **Carrot Kick!**" then a body line. Night: `night-panel` with `night-text`. |
| **Result card** | Lime card, 4px outline, ink shadow, Silkscreen "+620" over "points", −2°; round pet frame and confetti icons above. "WIN" in misregister. Loss: "So close!" in ink with orange underline, no result card. |
| **Activity card** (Play) | Window panel with job-colour title bar: icon tile + status chip, title, one line, optional bar/chips, button on desktop. |
| **Progress bar** | Square bar, ink border, white track, job fill: sky for trips, orange for boss health and hunger; value in words. |
| **Lives hearts** | Up to 3 pink hearts with ink outline; lost life = outline only. |
| **Death Match fights pill** | Status chip: "14 of 20 fights left this weekend". At the cap: grey chip "20 of 20 fights this weekend · Opens Saturday" and a cooldown button (DECISIONS #57). On night screens: `night-chip`. |
| **Danger note** | Orange tint box, ink outline, ink icon on an orange square, one plain sentence. Paired with a lime check line for the safe option. |
| **Prize wheel** | 5 slices (lime, lemon, sky, pink, orange), ink dividers, ink labels, 4px ink rim, ink pointer, 6px ink shadow. **Prize card**: lime, 4px outline, Silkscreen "+100". |
| **Rarity tag** | Square white tag, 2px ink border, Silkscreen word (COMMON, RARE, EPIC, LEGENDARY) + 1–4 stars. Legendary is lemon. Holo is always paired with this tag. Never colour alone. |
| **Egg case** (Shop) | `egg-case`: window with lemon bar "Egg case" + Silkscreen "RESTOCK 05:13"; mint 3×3 grid of white slots, each an egg (halftone shade) + Silkscreen price. Selected slot: pink ring. Sold out: cooldown fill + "Sold out" in words. |
| **Item tile** | White tile, ink outline and shadow: icon tile, name, one-line effect, dollar price, token price; optional lemon "Rare odds" tag. |
| **Cosmetic tile** | White tile with a pet crop wearing the item, rarity tag, price. Selected: pink ring + pink shadow + ink check. |
| **Try-on card** | White card, pink shadow, mint stage with your pet wearing the item, "Trying it on Mochi · Hat", name, rarity, Silkscreen price, token price, lemon Buy. Desktop: right rail. |
| **Pass card** | White card, pink shadow: skin preview stage ("Season skin is yours when you buy"; DECISIONS #50), "Season Pass" in pink-deep (large), season chip, `$7.99 per season`, benefit rows, reward track, lemon CTA, fine print. |
| **Reward track** | Grey line with lime progress; circle nodes with ink ring (lime + check when got, white + gift when not, larger pink final node showing the season skin; DECISIONS #50). |
| **Market row** | White row, ink outline and shadow: item crop, name, rarity tag, "Sold by Biscuit", money stack, small lemon Buy. |
| **Claim sheet** | Bottom sheet with sky shadow: coin tile + "Claim Mochi's share of the pot", Silkscreen `number-xl` amount, sky "0.018 ETH" chip, lime-tint reset box ("Your pot points go back to 0", "12,480 → 0", "Mochi stays Lv 12"), sky-tint pot explainer with an 85/15 split bar, lemon Claim, text button exit. |
| **Wallet chip** | White square chip, ink outline, 3px ink shadow: Silkscreen "$4.20" over "1,310 PC". |
| **Input field** | Square, white fill, 3px ink border, body font, visible label above (never placeholder only). Error: ink message + orange alert icon. |
| **Pet switcher** (Home) | Row of round pet chips with ink rings: own pets, then Co-Pets (partner's small avatar on the chip), then a dashed ink "add" egg. Active chip: pink ring outside the ink ring. |
| **Co-Pet card** (Home) | Sticker card: who fed today (two avatars with lime checks), shared pot share split 50/50 as two money stacks, "Needs both to agree: Breed · Death Match". No sell action. |
| **Asleep stage** | Stage panel greyed (cooldown ground), zzz icon, grey timer chip "Asleep · day 3 of 7", lime "Feed Mochi to wake · free", keep-bar "Mochi keeps 8,736 of 12,480", day track. |
| **Tombstone** | Calm white card that leads with the pet: Tombstone badge, pet name, Lv / wins / days lived in ink; "share went back to the pot", lemon "Hatch your free egg". No orange, no misregister. |
| **Focus ring** | 3px ink (night: `night-text`) outline, 3px offset, follows the item's shape. Never removed without this ring. |
| **Free-actions chip** | White chip, bolt icon, "7 free left", lime shadow; at 0: "0 free · small fee", grey shadow. |
| **Streak pill** | White chip, flame icon, "Day 4 streak", lime shadow. Desktop top nav; phone top bar (DECISIONS #39). |
| **Avatar menu** | Bottom sheet: rows for Profile, Wallet, Claims, Season, Calm motion (Follow device / On / Off), **Print effects (On / Off)**, Notifications, How it's fair. White rows, ink outline, icon tile + label, 44px+ tall. |
| **Wallet sheet** | Bottom sheet: money stacks for PETV and ETH, lemon "Get today's PETV · $X" (DECISIONS #47; cooldown with countdown once used), Gold vault window (sky bar, staked money stack, Stake / Swap back, "Swapping back costs 2%"), burn counter. |
| **Shortfall note** | Orange tint box: "You need **$1.40** more" (dollars first, PETV small under) and a lemon "Get today's PETV · $X" button, or "Open Wallet" link once used. Buy stays visible as a cooldown button "Not enough PETV". |
| **Burn counter** | White chip, flame on an orange square, "Burned so far", money stack; ticks up with "+$0.40 burned". |
| **Fairness check** | "Check this result" link (ink, sky underline, shield-check icon) on every random result and the claim sheet (DECISIONS #44). Sheet (sky shadow): "Locked in before the fight", "Revealed after", lime "Matches" chip, "See it on the public record". Pending: grey chip "Being revealed · nothing for you to do". |
| **Evolve and Breed buttons** | On the Home pet card, side by side: pink **Evolve** and white **Breed**. Locked: cooldown button with lock and reason ("Evolve at Lv 15"). Costs dollars first ("Breed · $2.99"). Breeds left as a status chip. |
| **Evolve sheet / Breed sheet** | Bottom sheets. Evolve: before → after on two small stage panels, path badge, item needed, money stack, lemon Evolve, text button. Breed: pick a second adult, egg preview, "Breed 2 of 5 · costs double the last one", money stack, lemon Breed, text button. |
| **Co-Pet card menu** | Three-dot icon button ("Co-Pet options") opens a small sheet: "Leave Co-Pet" (ink text, orange icon) and the text button. |
| **Season card and page** | Play hub window (sky bar): trophy icon, "Week 4 of 12", "Your rank #128". Page: weeks left, your rank row, leaderboard rows (target-row look), season pool money stack, Hall of Fame segment. |
| **Wager setup** | Battle › Duel, Wager: stake chips ("$1 · $5 · $10"), danger note, burn line "5% of the pot is burned", lemon "Find a match". |
| **Guild screens** | Guild tab with segmented **Guild / War**: guild window, member rows, War scoreboard (5 match chips, ink scores with lime/orange underlines), Gold prize money stack. |
| **Night Arcade parts** | `night-panel` (arena: panel fill, night-line border, dither band at floor, mint glow), `night-button-primary` (mint, night-bg text, night-text outline, pink shadow), `night-button` (panel fill, night-text label, night-line border), `night-hp-bar` (mint you / pink enemy, "62 / 100" always shown), `night-title` (Silkscreen pink "DEATH MATCH"), `night-chip` ("ROUND 2/3"), `hit-word`, dashed night-line "Winner takes $1.80" box with Silkscreen mint amount. |

## Do's and Don'ts

| Do | Don't |
|---|---|
| One art style everywhere; 2–3 inks per screen max; crypto quiet | Neon purple gradients, gold coin heroes, glassmorphism |
| Give every colour one job (lemon act, lime points/care, sky ETH, orange trouble, pink brand, mint stage) | Use sky for points, lime for ETH, or orange to celebrate |
| Hard diagonal shadow, no blur, in ink or pink | Blurry or grey drop shadows |
| 3px ink outline on panels, buttons, cards, chips | White sticker outlines or gloss strips (old Candy) |
| Square print-cut panels; blobs only for pets, eggs, ground | Rounded pill buttons or polka dots (old Candy) |
| Halftone on the shadow side only; text on solid plates | Dots or tone behind any text; CRT or full-screen dither |
| Ink outline + halftone decal on 3D pets | Post-processing passes on the 3D canvas |
| Silkscreen for money, timers, stats, tags at 14px+, with a plain-text label | Silkscreen for sentences, buttons or under 14px |
| Misregister on big titles (26px+) only | Misregister on body, labels or numbers |
| Holo foil always with a text tier label | Rarity by colour or foil alone |
| Night Arcade only on battle, Death Match, raid | A dark mode for the whole app in release 1 |
| Put the wait inside the disabled button ("Next spin in 23h 59m") | Hide a button or grey it out with no reason |
| Dollars big, token or ETH small underneath | ETH-first prices, "Ξ", 6-decimal zeros |
| Custom chunky SVG icons | Emoji or mixed icon styles |
| Keep the pet big on a mint stage | Economy UI that shrinks the pet |
| Ink text and icons on every colour fill | White text on a colour fill |
| Reward and points text in ink; colour only in a chip, underline or icon square | `lime-deep` / `orange-deep` / `sky-deep` text |
| Pink text in `pink-deep`, large only | Plain `pink` text on paper or white |
| Say claiming resets pot points; level stays | Copy or art that shows the level dropping after a claim |
| Bottom sheets for overlays on phone | Centered modals with an (i) info icon |
| 3px focus ring on every focusable item (ink day, night-text night) | Removing the focus outline |
| `ink-soft` only on light grounds | `ink-soft` or `pink-deep` on `cooldown`, `mint` or a colour fill |
| Text 13px+; 14px tokens, tabs and Silkscreen; 16px body | 9–12px labels or captions |
| Active tab / segment = pink + ink bar under the label | Pink fill as the only "you are here" cue |
| Bursts that flash at most 3 times a second; holo tilt and hit pops off under reduced motion | Strobing crit, confetti, hatch or wheel lights |
| "Print effects" switch keeps outlines and shadows when off | Losing structure when textures are off |

## Open questions

1. **Breakpoints and desktop overlays:** phone and desktop layouts are mocked at 390 and 1280px; the switch-over width, tablet behaviour, and whether desktop overlays are bottom sheets, side panels or centered dialogs are not set. Whatever the form, it is `role="dialog" aria-modal="true"` with the sheet focus rules in EXPERIENCE.md.
2. **Spine-only surfaces** (no mock; build from the tokens above): see EXPERIENCE.md › Mock coverage. The 8 `key-*.html` mocks still show Candy styling; their layout holds, the look follows this file until they are redrawn.
