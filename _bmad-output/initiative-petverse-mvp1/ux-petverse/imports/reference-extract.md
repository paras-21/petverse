# Reference extract: Fren Pet UI and Petverse prototype

Source screenshots were viewed one by one. Tags: **[O]** = observed in the named file. **[I]** = inferred (my reading, not shown directly).
Path roots: `FP/` = `C:\m0\bits\web3-pet-research\out\flows\frenpet\`, `CP/` = `C:\m0\bits\web3-pet-research\cosmetics-preview\`.
Every Fren Pet capture is mobile 390 px wide unless the name says 1440.

---

## 1. Fren Pet: screen inventory

| # | Screen | File |
|---|---|---|
| 1 | Landing / welcome (desktop: phone column in the middle, pixel art on both sides) | `FP/landing-page/evidence/FP-LP-001/screenshots/full-1440.png` |
| 2 | Landing (mobile) | `FP/layout/evidence/FP-LAY-001/screenshots/full-375.png` |
| 3 | Privy login modal (email, Google, Twitter, Apple, More options) | `FP/landing-page/evidence/FP-LP-002/screenshots/privy-modal-1440.png` |
| 4 | Onboarding 1: "Mint your first Frenpet" | `FP/monetization/evidence/FP-MON-008/screenshots/shared-FP-UF-003-01-mint-intro-390.png` |
| 5 | Onboarding 3: "Keep your Frenpet alive!" (timer explained) | `FP/features/evidence/FP-FEAT-002/screenshots/01-tod-hibernation-tutorial-390.png` |
| 6 | Onboarding 4: "Level Up your Pet" + wheel modal, spin result | `FP/ui-ux/evidence/FP-UX-005/screenshots/01..03-*.png` |
| 7 | Onboarding 4b: gacha intro, machine modal, "Processing tx...", result | `FP/ui-ux/evidence/FP-UX-006/screenshots/01..04-*.png` |
| 8 | Onboarding 5: "Battle for rewards and glory!" + battle result modal | `FP/ui-ux/evidence/FP-UX-008/screenshots/01-battle-tutorial-390.png`, `02-battle-won-390.png` |
| 9 | My Pets (home) | `FP/ui-ux/evidence/FP-UX-001/screenshots/01-pet-home-390.png`, `FP/layout/evidence/FP-LAY-003/screenshots/full-390.png` |
| 10 | Feed modal | `FP/monetization/evidence/FP-MON-003/screenshots/01-feed-confirm-1.5usd-BLOCKED-390.png` |
| 11 | Upgrade / stake modal "Supercharge Your Pet!" | `FP/ui-ux/evidence/FP-UX-013/screenshots/01-upgrade-stake-tiers-BLOCKED-390.png` (same as `FP/monetization/evidence/FP-MON-009/...stake-390.png`) |
| 12 | Premium Pass page | `FP/monetization/evidence/FP-MON-001/screenshots/01-petpass-15usd-BLOCKED-390.png` |
| 13 | Battle tab: arena list (Bonk targets) | `FP/ui-ux/evidence/FP-UX-008/screenshots/03-battle-arena-list-390.png` |
| 14 | Battle tab: Leaderboard sub-tab | `FP/ui-ux/evidence/FP-UX-011/screenshots/01-leaderboard-390.png` |
| 15 | Playground hub (list of mini-games) | `FP/ui-ux/evidence/FP-UX-PLAYGROUND/screenshots/01-playground-full-390.png` |
| 16 | Playground: potion empty-state modal | `FP/ui-ux/evidence/FP-UX-PLAYGROUND/screenshots/02-evolution-potion-opensea-390.png` |
| 17 | Playground: loot box modal | `FP/monetization/evidence/FP-MON-002/screenshots/01-lootbox-1usd-BLOCKED-390.png` |
| 18 | Playground: dice game (capture broken: tiled render) | `FP/monetization/evidence/FP-MON-016/screenshots/01-dice-game-wager-0.2fp-BLOCKED-390.png` |
| 19 | Shop: item detail + icon grid (Shield, Insurance) | `FP/ui-ux/evidence/FP-UX-014/screenshots/01-shop-shield-6fp-full-390.png`, `FP/monetization/evidence/FP-MON-005/screenshots/01-insurance-780fp-BLOCKED-390.png` |
| 20 | Shop: trade modal (Buy/Sell toggle, Approve) | `FP/monetization/evidence/FP-MON-007/screenshots/01-trade-buy-320fp-BLOCKED-390.png` |
| 21 | Quests (Explorer Points) | `FP/ui-ux/evidence/FP-UX-010/screenshots/01-quests-explorer-points-full-390.png` |
| 22 | Swap: Buy FP sub-tab | `FP/monetization/evidence/FP-MON-010/screenshots/01-buy-fp-swap-BLOCKED-390.png` |
| 23 | Swap: Rewards sub-tab (redeem points as ETH) | `FP/ui-ux/evidence/FP-UX-012/screenshots/01-rewards-claim-499pts-0eth-390.png` |
| 24 | Account: wallet / Settings / Advanced | `FP/ui-ux/evidence/FP-UX-016/screenshots/01..03-*.png` |
| 25 | Account: fund (capture broken: tiled render) | `FP/monetization/evidence/FP-MON-012/screenshots/shared-FP-UF-016-01-fund-account-deposit-BLOCKED-390.png` |
| 26 | Docs site (Docusaurus) and V2 blog post | `FP/layout/evidence/FP-LAY-002/screenshots/full-390.png`, `FP/layout/evidence/FP-LAY-005/screenshots/full-390.png` |

## 2. Navigation model

- **[O]** The bottom tab bar has 5 fixed tabs: **Battle · Playground · My Pets · Quests · Account**. Each tab has a dark pixel-art icon above a text label. The active tab sits in a light green filled tile (`FP-UX-001/01-pet-home-390.png`, `FP-UX-011/01-leaderboard-390.png`, `FP-UX-016/01-account-wallet-390.png`).
- **[O]** My Pets is the center tab and the home screen (`FP-UX-001`).
- **[O]** Every tab page has a top-right **pet switcher dropdown** ("Research-pet ▾"), so the page always acts on one chosen pet (`FP-UX-008/03`, `FP-UX-010`, `FP-UX-014`).
- **[O]** Second-level navigation uses **segmented pill tabs** under the title: Battle | Leaderboard | Activity; Buy FP | Gold Swap | Gold LP | Rewards; Account | Settings | Advanced | Resources; Available | Completed (`FP-UX-008/03`, `FP-MON-010`, `FP-UX-016/01`, `FP-UX-010`).
- **[O]** Shop and Swap are not tabs. They are pushed pages with a "← Shop" back arrow, reached from home buttons (`FP-UX-014`, `FP-UX-012`). **[I]** This makes the money screens hard to find again.
- **[O]** Most actions open a **centered white modal** with a close (X) at top right and an (i) info icon at top left (wheel, gacha, loot box, feed, trade).
- **[O]** Onboarding is a 5-step full-screen carousel: a progress dash bar, "Stop Music" and "Skip Tutorial" pills, and one big green pill CTA at the bottom (`FP-MON-008`, `FP-FEAT-002`, `FP-UX-005/01`).

## 3. Home (My Pets), top to bottom

Source: `FP-UX-001/01-pet-home-390.png`, `FP-LAY-003/full-390.png` **[O]**
1. Row: pet switcher dropdown (left). Balances on the right: a carrot icon "0.0722" and a lightning icon "0.000 $FP".
2. Row: big **"500 points"** (bold number, small grey unit) on the left. A "Rewards ♦ 0.000000 ETH" chip on the right.
3. **Pet stage card** (pixel sky + grass scene). Inside it: a heart TOD countdown chip "♥ 2d 23h 54m 1s" at top left, a mail icon, "Photo" and "Feed Pet" buttons at top right, and ATK "12" / DEF "10" chips at bottom left. The pet sprite is not shown here (empty frame). **[I]** The pet sprite failed to load.
4. 3-cell stat strip: shield icon "0/0", star "0", hourglass "0". There are **no labels**. **[I]** The meaning is unclear (shields, stars, eggs?).
5. 3 outline buttons: "Upgrade Pet", "Buy $FP", "Buy Pet Pass".
6. Segmented tabs "My Activity | Collect". Below them is an activity feed: icon, text with the green bold result ("won **500 points**"), and relative time.
7. A floating dashed-border toast, **"Ready to bonk!"**, sits above the tab bar.
8. Bottom tab bar.

## 4. How status, timer, points and ETH are shown

- **Timer [O]:** a heart icon plus a live countdown "2d 23h 54m 1s" in a rounded chip. The same chip appears in onboarding and on home (`FP-FEAT-002`, `FP-UX-001`). The copy explains it: "Feed your pet to restart the timer before it gets to 0 ... 7 days to be revived or they will die forever!" (`FP-FEAT-002`).
- **Points [O]:** the largest number on home ("500" in bold dark green). On the leaderboard, points are big green numbers with a space as the thousands separator ("98 282 771 pts") (`FP-UX-011`).
- **ATK/DEF [O]:** a sword icon and a shield icon with numbers. They show on home, on the battle header ("12 ⛉10") and on battle nameplates.
- **ETH [O]:** shown in many places, often as 0 with 6 decimals: "Rewards ♦ 0.000000 ETH", Account balance "♦ 0", loot box "OPEN FOR Ξ0.000392", feed "Feed for Ξ$0.000627 (~$1.5)" (`FP-UX-001`, `FP-UX-016/01`, `FP-MON-002`, `FP-MON-003`).
- **Cooldowns [O]:** a disabled button shows the wait, e.g. "NEXT SPIN 23h 59m 56s" and "NEXT GACHA IN 800 points" (`FP-UX-005/03`, `FP-UX-006/04`). Playground cards show status pills: "23h 54m 26s", "300 pts to next", "0/18 - World 1", "No wins", "Play now" (`FP-UX-PLAYGROUND/01`).
- **Shielded state [O]:** on the leaderboard, a shielded pet shows a greyed shield button with its countdown in place of "Bonk" (`FP-UX-011`).

## 5. Battle (bonk) flow

1. **[O]** Tutorial card: "Battle for rewards and glory!" Odds depend on ATK/DEF. CTA "Start a Battle" (`FP-UX-008/01`).
2. **[O]** The result opens as a modal in the style of a Game Boy / Pokémon battle. The enemy nameplate (name, HP bar, ATK/DEF) is at top right. The two pixel sprites face each other. My nameplate is at bottom left. A monospace text box says "Research-pet won the battle!" There is one "Close" CTA (`FP-UX-008/02`).
3. **[O]** Arena list (Battle tab): a header with the pet switcher, ATK/DEF, and a chip "ready to battle -" with a fuel-can icon. A "Collect stars" toggle and a filter icon. Then rows: rank tile "#1", name with a grey "id: 84226", **"win +8 pts · 31% odds"**, and an outline **"Bonk"** button with a hammer icon. Paged with ← → arrows. Some rows have a red-outlined rank or a "zzz" sleep icon (`FP-UX-008/03`).
4. **[I]** The fuel icon and red rank borders are never explained on screen.
- **[O]** The Leaderboard sub-tab reuses the same row component, showing total points and either Bonk or a shield countdown (`FP-UX-011`).

## 6. Wheel and gacha

- **Wheel [O]:** a white modal titled "Spin the wheel". It has a 6-slice wheel in mint green with thick dark borders and a top pointer. Slice labels are in a typewriter monospace font (1 point, 200, Shield, 100, 500, Shield). There is a full-width dark-green CTA. After the spin, the CTA turns sage and disabled: "NEXT SPIN / 23h 59m 56s" (`FP-UX-005/02`, `03`). **[O]** The result shows up on home as an activity row "spin and won 500 points" (`FP-UX-001`).
- **Gacha [O]:** a pixel gumball machine in the modal. "PLAY NOW" → "Processing tx..." (disabled) → text "won +2 attack points!" → "NEXT GACHA IN 800 points" (`FP-UX-006/02..04`). **[I]** The reveal is thin: one line of plain text, with no prize art or animation in the capture.
- **Loot box [O]:** the modal states "$1 in ETH/open. 1 in 10 chance to win +2 ATK/DEF". It shows two greyed chest icons (ATK, DEF) and the CTA "OPEN FOR Ξ0.000392" (`FP-MON-002`).

## 7. Shop and pass presentation

- **Shop [O]:** a split card on top. Left half: item name, "rare" tag, then Price / Delta / Owned / Supply ("56230/100000"). Right half: a preview of the pet wearing the item. Below that, one bold line of effect: "Can't be bonked for 24 hours", "Own one at a time. Auto equips." Then a **4-column grid of square icon tiles**; the selected tile is filled dark green. One full-width "Trade" CTA (`FP-UX-014`, `FP-MON-005`).
- **Trade modal [O]:** a Buy/Sell toggle, a preview of the pet with the item, a stats block, "Buy 1 pay 320 $FP", and an "Approve" CTA (`FP-MON-007`). **[I]** The words "Delta" and "Approve" are trading/ERC-20 terms, not game words.
- **Premium Pass [O]:** a full-screen pixel landscape background (clouds, grass). Title card "Premium Pass". "Upgrade to premium for Just $15!" Then 4 benefit rows with pixel icons: Play More (bonk timeout 10 min vs 30), Earn Faster (10X points), Win Big (2000 pts chance on spins), Instant Bonus (3 free loot boxes). CTA "Buy 30 Day Pass for $15". The text link "Close" is below the card (`FP-MON-001`). **[I]** This is the cleanest sales screen in the app: a dollar price, short benefit headers, one CTA.
- **Upgrade/stake modal [O]:** a rocket emoji with "Supercharge Your Pet!", a bullet list with emoji, two paragraphs about staking, then a table of 5 tiers ("75 Points and get 0.0137 $FP/h | 10 $FP"), and "Buy $FP" (`FP-UX-013`). **[I]** Dense: a buy decision, staking maths, and an hourly rate all on one screen.
- **Feed modal [O]:** "Feed your pet to extend its life". A progress bar "Progress to next free Shroom: ? 0/10 Bonks". A big card "Feed your pet → Get 3 days life +5 pts". CTA "Feed for Ξ$0.000627 (~$1.5)" (`FP-MON-003`).
- **Buy FP [O]:** a white card with 5 preset rows (5/10/50/100/1000 FP, each with its ETH price), "Your balance: ... ETH • ... FP", and the link "Buy/sell custom amounts →" (`FP-MON-010`).

## 8. Quests

- **[O]** Title "Quests", a pet avatar, the pet name, a "0 Explorer Points ✨" chip, a disclaimer paragraph ("off-chain points ... experimental feature that may have future in-game utility"), and Available/Completed tabs. Cards have a bold title, a grey subtitle, a green "+100 EP", a "Daily Quest" blue tag, a dark green "Claim 100 EP" button, and a pale-yellow "★ Ready!" bar (`FP-UX-010`).
- **[I]** "Ready!" plus the Claim button says the same thing twice.

## 9. Landing page

- **[O]** Desktop: a 500 px phone-width column centered on a full-bleed pixel landscape (tree, mountains, clouds; teal and mint). In the column: a pixel scene with a sun and a cat sprite on grass, "Welcome To Frenpet!" in green, the line "Raise, train, and battle on your journey through the world of Frenpet.", one pill CTA "Log in or sign up", and footer links Read Docs / Join Discord / Follow Twitter / Basescan (`FP-LP-001`, `FP-LAY-001/full-375.png`).
- **[O]** Login is the stock Privy modal: email, Google, Twitter, Apple, More options, and "Protected by privy" (`FP-LP-002`).
- **[I]** The landing page shows no gameplay, prices, or proof. It is one line of copy and a login button.

## 10. Visual style (Fren Pet)

- **Palette [O, hex approximate]:** page background mint `#DFF9E7`; cards a paler `#EEFBF2` with thin sage borders `#A9C7B3`; primary CTA dark forest green `#186A3B` with white bold text; disabled CTA sage `#8BB59A`; headline text dark green `#0F3D22`; scene grass `#B3D3BF`; modal scrim grey-green. The Playground cards are the exception: pastel blue, pink, teal, peach, yellow, lilac and green fills with matching borders (`FP-UX-PLAYGROUND/01`).
- **Type [O]:** a clean grotesk (Inter-like) for all UI. Monospace typewriter text appears only in game-like spots (wheel labels, battle text box). Big bold sans for tutorial headlines.
- **Art [O]:** 1-bit/2-tone pixel sprites (black outline, mint fill), a dithered sun, pixel grass. Emoji-style 3D icons on the Playground list. **[I]** Three art styles mix (pixel, 3D emoji, Discord logo), and the playground looks like a different app.
- **Components [O]:** buttons have a slight bottom offset shadow (a pressable look). Segmented tabs; rounded 8–12 px corners; pill-shaped onboarding CTAs.

## 11. What feels good (to borrow)

1. **[O]** One timer chip (heart + countdown) used on every pet surface. It is easy to learn (`FP-FEAT-002`, `FP-UX-001`).
2. **[O]** Cooldown shown inside the disabled CTA ("NEXT SPIN 23h 59m 56s"). You never wonder why you can't press it (`FP-UX-005/03`).
3. **[O]** Bonk list rows show **reward + odds** before you commit ("win +8 pts · 31% odds") (`FP-UX-008/03`).
4. **[O]** The Pokémon-style battle result frame is instantly readable and nostalgic (`FP-UX-008/02`).
5. **[O]** Playground hub: one colored card per mini-game, with a live status pill on the right (`FP-UX-PLAYGROUND/01`).
6. **[O]** Onboarding that teaches by doing: each step makes you actually spin, gacha and battle, with a progress bar and skip (`FP-UX-005/01`, `FP-UX-006/01`, `FP-UX-008/01`).
7. **[O]** The pass sells with a USD price and 4 short benefit headers (`FP-MON-001`).
8. **[O]** The shop previews the item on your pet before you buy (`FP-UX-014`, `FP-MON-007`).
9. **[O]** Social login via Privy with no wallet step up front (`FP-LP-002`).

## 12. What feels bad or confusing (to avoid)

1. **[O]** Crypto jargon everywhere: "$FP", "Gold LP", "Gold Swap", "Delta", "Supply", "Approve", "Processing tx...", "Basescan", wallet address "0x28eb...bf5" on top of Swap and Account (`FP-UX-012`, `FP-UX-014`, `FP-MON-007`, `FP-UX-016/01`).
2. **[O]** Three-plus currencies on one screen (points, carrot value, $FP, ETH, pGold, EP), plus ETH shown as "0.000000" (`FP-UX-001`, `FP-UX-016/01`, `FP-UX-010`).
3. **[O]** Weird mixed price strings: "Ξ$0.000627 (~$1.5)", "OPEN FOR Ξ0.000392" (`FP-MON-003`, `FP-MON-002`).
4. **[O]** Unlabeled stat strip on home (0/0, 0, 0 with tiny icons) (`FP-UX-001`).
5. **[O]** Copy-heavy modals: the stake modal has 2 paragraphs, 4 bullets and a 5-row rate table; Quests carries a legal-ish disclaimer; the loot box says "See full info by clicking the 'i' icon" (`FP-UX-013`, `FP-UX-010`, `FP-MON-002`).
6. **[O]** Redeeming rewards burns your score and resets the pet level to 0. It is shown as a small warning under a disabled button, and it says "Receive 0 ETH" for 499 points (`FP-UX-012`). **[I]** This feels punishing.
7. **[O]** Death language: "they will die forever!", "+5 days TOD if fatalized" (`FP-FEAT-002`, `FP-MON-005`). **[I]** It is harsh for a cute pet game, and "TOD" is undefined.
8. **[O]** Typos and casual errors in copy: "dont", "Lets try it", "player's" (`FP-UX-005/01`, `FP-UX-PLAYGROUND/02`).
9. **[I]** The pet itself is small and sometimes missing (empty frame on home and Quests). The economy UI overwhelms the creature.
10. **[O]** The gacha win is just plain text. There is no prize moment (`FP-UX-006/04`).
11. **[I]** The Playground mixes 9 features, including "Player's Treasury" and "Dice Game" wagers, so the core loop gets diluted.

---

## 13. Petverse prototype (current gallery UI)

Files: `CP/01_mix_1.png`, `CP/07_hat_5-adult_1.png`, `CP/20.png`, `CP/26.png`, `CP/33.png` (all **[O]**, desktop about 1000 px wide).
- **Layout [O]:** title "Pet gallery" at top left. Toggle buttons at top right ("Show adults/babies", "Next coat"). One or two rows of option buttons ("Hat: Bunny ears", "Face: Heart glasses", "Neck: Flower lei", "Back: Balloon", "Hand: Sunflower", "Mix all", "Turn around", "Clear"). Below them, a large framed 3D viewport. Caption: "Front row: blob, pup, drako, cat, bunny. Back row: bear, frog, penguin, fox, hamster."
- **Buttons [O]:** pixel-frame style. White fill, about 3 px dark navy border (`~#2A2F45`), and a hard offset grey drop shadow below. "Label: Value" text pattern. **[I]** They read as retro game UI and fit beside Fren Pet's pixel vibe, but stay ours.
- **Font [O]:** a pixel/bitmap display font (Press Start / Silkscreen-like) for the title, buttons and caption. **[I]** It is hard to read at small sizes (the caption) and for long copy.
- **Page background [O]:** very light blue-grey `~#EEF2F8` with a faint graph-paper grid.
- **Scene [O]:** a sky gradient (light blue `~#A9D4FA` to near-white at the horizon) above a curved green hill `~#9ED67F`, with soft contact shadows. Bright, daytime, toy-like.
- **Pets [O]:** pastel, glossy, rounded "jelly" 3D creatures (peach blob, orange pup/fox/cat/hamster, brown bear, green frog, black/peach penguin, white bunny). Big black eyes with white highlights, pink blush cheeks, small smiles. Babies are rounder (`01_mix_1`); adults are taller with bellies, arms and feet (`20`, `26`).
- **Cosmetics [O]:** they stack per slot (hat, face, neck, back, hand) and read clearly even at small size: party hat, top hat, beanie, crown, flower, bunny ears, propeller cap, sunglasses, heart glasses, round glasses, bow tie, lei, headphones, red balloon, sunflower. "Mix all" shows variety across the group (`01_mix_1`, `33`).
- **Dev chrome [O]:** a Next.js "N" badge at bottom left (dev-mode only).

### What to keep
1. **[O→keep]** The pastel jelly 3D pets and readable cosmetics. They beat Fren Pet's 1-bit sprites on charm, and they are the product's face.
2. **[O→keep]** The sky + green hill scene as the home "stage". It mirrors Fren Pet's sky/grass stage card in a warmer, friendlier tone.
3. **[O→keep]** Pixel-frame buttons with hard offset shadows, as the signature component (CTAs, chips, tabs).
4. **[I→adjust]** Keep the pixel font for headings, buttons and numbers only. Use a clean rounded sans for body copy, which avoids the readability problem of an all-pixel font.
5. **[I→adjust]** Turn "Label: Value" cycling buttons into a slot picker (tile grid like Fren Pet's shop grid, with a live preview on the pet).
6. **[I→add]** Borrow from Fren Pet: the heart timer chip, cooldown-in-button, reward + odds on battle rows, the classic battle result frame, the onboarding-by-doing carousel, and USD-only pass pricing. Drop: wallet addresses, ETH decimals, the token-swap tabs, and "die forever" wording.
