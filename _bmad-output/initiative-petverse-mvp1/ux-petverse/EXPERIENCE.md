---
title: Petverse experience
status: final
created: 2026-10-14
updated: 2026-10-14
sources:
  - ../prd-petverse/prd-petverse.md
  - .memlog.md
  - ../../../docs/DECISIONS.md
  - imports/reference-extract.md
---

# Petverse — Experience Spine

How Petverse works for release 1 (testnet). Visual identity lives in [DESIGN.md](DESIGN.md); colour tokens are cited by name as `{colors.xxx}` (`{colors.background}`, `{colors.ink}`, `{colors.pink}`, `{colors.lemon}`, `{colors.lime}`, `{colors.sky}`, `{colors.orange}`, `{colors.cooldown}`, `{colors.ink-soft}`; the candy fills and `cooldown` also have `-deep` shadow partners). Mocks are linked at the sections they illustrate; coverage and the conflict rule are in Mock coverage below. Requirement numbers (FR-n), journeys (UJ-n) and decisions (#n, `docs/DECISIONS.md`) are cited, not restated.

Example figures used throughout: Mochi the bunny, **level 12**, Adult, 12,480 points. **Level comes from lifetime points and never drops**; a claim resets only the **pot points** (the points that set your pot share). Pot 4.21 ETH = $9,843, Mochi's share 0.018 ETH = $42.08 (1 ETH = $2,338). Mocks use **$1 = 312 PETV**; real token amounts follow the live price. Owner names in Key Flows are illustrative.

## Foundation

- **Form factor:** web / PWA only (no app stores). Phone browser and desktop browser are **equal** surfaces with two layouts: phone (bottom tab bar) and desktop (top pill nav + right rail).
- **UI system:** none inherited. The Candy "Sticker book" layer in DESIGN.md is the visual reference ([.working/direction-candy.html](.working/direction-candy.html)); this spine is the behaviour. The other `direction-*` and `theme-bold-*` files in `.working/` are superseded explorations, not references.
- **Colour jobs** (behavioural meaning, so the same colour always means the same thing): `{colors.lemon}` = the main thing to press, `{colors.lime}` = points and care, `{colors.sky}` = ETH, pot and claim, `{colors.orange}` = trouble (hungry, robbed, danger, loss), `{colors.pink}` = brand and active tab, `{colors.cooldown}` = waiting / disabled.
- **Fixed:** the glossy 3D jelly pets and their stage come from `src/components/three`; only the UI around them is new.
- **Light mode only** for release 1.
- **Look rules that affect behaviour:** Baloo 2 (display) + Nunito (body); ink text on every candy fill; coloured reward text only inside a pill or underline; custom chunky SVG icons with text labels, no emoji.
- **Login:** email, Google or an existing wallet (Privy-style). Every player gets a smart wallet silently: no seed phrase, no gas for sponsored actions (FR-2, FR-3).

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Landing | Link, logged out | Say what Petverse is; one Play button; live pot teaser (FR-1) |
| Login sheet | Play / Log in | Email, Google, "I already have a wallet" (FR-2) |
| Egg | First login | Tap to hatch the free egg (FR-6) |
| Onboarding steps | After hatch | 4 do-it steps with Skip (see Onboarding) |
| Faucet | Sign-up, then daily | Test PETV worth **$10 at sign-up** and **$2 a day** (#25). Collected in the **Wallet sheet** (avatar → Wallet): a "Get today’s $2" button, a cooldown button with a countdown once used (owner, 2026-10-14). Also linked from every "not enough PETV" note |
| **Home** | Tab 1, app open | Blob stage with the pet, timer chip, points, pot and share, alerts, Feed, Spin, Attack, Dress up, and **Evolve** and **Breed** buttons on the pet card (owner, 2026-10-14). **Pet switcher** lists own pets and Co-Pets; a Co-Pet shows the partner's avatar on the pet card. **Co-Pet lives here**: the Co-Pet card (care, shared share, partner agreement) and the "add" egg to invite a friend to a new Co-Pet (max 3 Co-Pets, FR-29). The Co-Pet card menu holds **Leave Co-Pet** (FR-30); no selling, no buy-out (#14) |
| Evolve sheet | Home › Evolve | Before → after preview, path, item needed, cost dollars first (FR-33, FR-34, FR-36) |
| Breed sheet | Home › Breed | Pick a second adult, egg preview, breeds left, cost dollars first (FR-37) |
| Leave Co-Pet sheet | Home › Co-Pet card menu | Confirm leaving; who keeps the pet; memory badge (FR-30) |
| **Battle** | Tab 2 | Segmented: **Attack** (revenge row + pets near your level) · **Duel** · **2v2**; fight; result. Duel has a **Ranked / Wager** switch (owner, 2026-10-14) |
| Wager | Battle › Duel › Wager | Pick a stake, danger note, find a match, fight, result with the 5% burn and burn counter (FR-26, UJ-5) |
| **Play** | Tab 3 | Activity cards: Daily wheel, Monsters, Expeditions, Dice, Death Match, Boss Raid, **Season** (owner, 2026-10-14) |
| Season page | Play › Season card, Avatar menu › Season | Weeks left, your rank, leaderboard, season pool bonus, Hall of Fame (FR-47; Death Match Hall of Fame) |
| **Shop** | Tab 4 | Segmented: **Store** (items + cosmetics with try-on) · **Pass** · **Market** |
| **Guild** | Tab 5 | Segmented **Guild / War**: your guild (up to 10, invite a friend, members) and the Sunday Guild War. Co-Pet is **not** here (it lives on Home) |
| Avatar menu | Top-right avatar on every page | Profile, Wallet, Claims, Season, Calm motion, Notifications, How it's fair |
| Wallet sheet | Avatar menu › Wallet, wallet chip, "not enough PETV" links | PETV and ETH balances (dollars first), faucet "Get today’s $2", Gold vault (stake, swap back), burn counter |
| How it's fair | Avatar menu, every "Check this result" link | Fairness check sheet for one result; rules page: commit–reveal, public contracts, multisig and time delay, pot readable by anyone (NFR-1, NFR-2, FR-27, #11, #12) |
| Market buy sheet | Shop › Market › Buy | Review before paying: item, seller, dollar price, token amount, 5% fee |
| Claim sheet | Pot blob on Home, or Avatar menu › Claims | Claim your share (FR-16) |
| Wheel sheet | Play › Daily wheel, Home › Spin wheel | Spin and prize |
| Fight / Result | Any battle | Automatic fight, then result |

Navigation: 5 fixed tabs, always visible. Every tab acts on the pet chosen in the pet switcher ("Playing as Mochi · Lv 12"). One overlay at a time; never a sheet on top of a sheet.

## Mock coverage

**DESIGN.md and this spine win on any conflict with a mock, theme file or import.** Known mock drift is listed in Open questions.

Mocked key screens (Candy style, phone + desktop):

| Mock | Surfaces |
|---|---|
| [.working/key-landing-hatch.html](.working/key-landing-hatch.html) | Landing, login sheet, egg, hatch + onboarding step 1 |
| [.working/key-battle.html](.working/key-battle.html) | Battle › Attack (revenge row, target rows, shielded / asleep), fight, result won / lost, cooldown |
| [.working/key-play-hub.html](.working/key-play-hub.html) | Play hub cards, wheel sheet + prize |
| [.working/key-shop-claim.html](.working/key-shop-claim.html) | Shop › Store + try-on, Pass, Market, claim sheet |
| [.working/key-home-copet.html](.working/key-home-copet.html) | Home, pet switcher, Co-Pet card, Co-Pet invite |
| [.working/key-guild.html](.working/key-guild.html) | Guild / War tabs, guild card, members, War board, no-guild state |
| [.working/key-sleep-death.html](.working/key-sleep-death.html) | Hungry, asleep + wake, passed away / Tombstone, push and Telegram alerts |
| [.working/key-death-match.html](.working/key-death-match.html) | Death Match entry warning, run, "Leave safely?" sheet, lobby + Hall of Fame |

`direction-candy.html` is the style source only (its Home frames predate key-home-copet). `share/` is a shareable snapshot for the owner (older copies of the mocks, `petverse-themes.html`, `share/img/`), **not a reference**: build from `.working/` and the spines only.

**Spine-only** (no mock; build from DESIGN.md tokens and this spine): Avatar menu (with Calm motion switch), Wallet sheet (faucet, Gold vault, burn counter), Duel and 2v2 setup and matching, **Duel › Ranked / Wager** switch and wager flow, Monsters fight, Expedition send and return, Dice, Boss Raid fight, onboarding steps 2–4 and closing card, Empty / Loading / Error / Offline states, out-of-free-actions and not-enough-PETV states, **Season card and Season page** (leaderboard, Hall of Fame), **Evolve and Breed buttons and sheets** on the Home pet card, **Co-Pet card menu, Leave Co-Pet sheet and 3-of-3 Co-Pet state**, fairness check sheet and How it's fair page, market buy sheet, notification settings and Telegram linking, focus ring and keyboard states.

## Voice and Tone

Microcopy. Brand posture lives in DESIGN.md › Brand & Style.

**Rules:** short, plain, friendly English. **Dollars first** everywhere, token or ETH amount small underneath; the pot is shown in dollars plus ETH. **No crypto jargon.** **Danger is gentle but clear**: say what happens and when, never shout, no all-caps, no exclamation marks on bad news.

| Do | Don't |
|---|---|
| "Free pet. No crypto needed to start." | "Connect wallet to mint your NFT" |
| "Log in to keep your pet safe. We set up your account for you. Nothing to install." | "Create a smart wallet", "seed phrase" |
| "No passwords to save. No fees to start." | "Gas sponsored by paymaster" |
| "Mochi is yours forever." | "NFT minted to 0x28eb…bf5" |
| "Food $1" with "312 PETV" small underneath | "Ξ$0.000627 (~$1.5)", "OPEN FOR Ξ0.000392" |
| "Prize pot right now: $9,843" over "4.21 ETH" | "Rewards ♦ 0.000000 ETH" |
| "Claim $42.08" over "0.018 ETH" | "Redeem 12,480 pts" |
| "Your pot points go back to 0. Mochi keeps its level, items and friends." | Small grey warning under a disabled button |
| "Not now, keep growing" | "Cancel" |
| "Mochi is very hungry, 6h left before sleep" | "FEED YOUR PET OR IT WILL DIE FOREVER!" |
| "Mochi falls asleep in 3h" | "TOD 0d 3h" |
| "Mochi passed away." | "Your pet was fatalized." |
| "Your pet can pass away at 0 lives." / "Leave safely any time." | "Permadeath mode" |
| "Biscuit took 624 points from Mochi. Revenge?" | "You got bonked" |
| "Pudding kept their points. Mochi lost no points. Mochi just needs a short rest." | "DEFEAT" |
| "Win +620 · 54% chance" | "EV +335" |
| "Attack in 12m", "Next spin in 23h 59m" | A grey button with no reason |
| "Bold: 3x reward, 30% chance to fail and lose your stake." | "High-risk yield strategy" |
| "5% of each pot is burned." | "Deflationary tokenomics" |
| "Players sell rare and better items here. 5% fee on each sale." | "Delta", "Supply", "Approve", "Processing tx…" |
| "85% main pot by points, 15% small pot for the bottom half of pets" | "15% small pot for newer players" (wrong: it is the bottom half of living pets by points, older than 7 days) |

Word list: **points**, **pot points** (what a claim resets), **level** (from lifetime points, never drops), **pot**, **your share**, **claim**, **PETV** (written without a "$" so it never reads as dollars), **Gold** (working name, PRD §9 #5), **shield**, **asleep**, **wake**, **passed away**, **Tombstone**. Avoid: wallet address, gas, mint, tx, approve, LP, swap, NFT (except where a legal or rules page requires it), TOD, bonk-as-jargon.

## Component Patterns

Behavioural. Visual specs live in DESIGN.md › Components under the same names.

| Component | Use | Behavioural rules |
|---|---|---|
| Pill button | Every action | One `{colors.lemon}` main action per view. Full width on phone when it is the main action. At least 44px tall. Press shows the shadow shrinking (sticker pressed). While the action is pending, label changes to a plain verb ("Feeding Mochi…") and the button is not re-pressable. |
| Cooldown button | Any action on a timer | Replaces the action button in place, shows the remaining wait live ("Attack in **12m**") on a `{colors.cooldown}` fill with a `{colors.ink}` label and clock icon; turns back into the action button at 0 without a reload. Stays a real `<button aria-disabled="true">` **in the tab order** with the name "Attack, available in 12 minutes"; pressing it does nothing but keep the reason on screen. Its text updates on unit change only. |
| Text button | Calm exits | Always the last item in a sheet; closes it with no side effect. |
| Sticker card | Explanations, feed card, tips, rails | Static container; tappable only if it has its own button. |
| Number blob | Points (`{colors.lime}`) and pot (`{colors.sky}`) on Home | Tapping the pot blob opens the Claim sheet. Points blob shows pot points and today's change ("+120 today"). Values update live after any action. While the pet is asleep the pot blob says "No pot share while asleep" (#15); while very hungry it warns "Asleep pets get no pot share". |
| Money stack | Every price, share, balance | Dollars first, token or ETH amount underneath. Dollar value recomputes from the live token / ETH price; the token amount is what is actually paid. |
| Timer chip | Home header, every pet surface | Live countdown to sleep ("2d 14h"). In the hungry window it turns orange (`{colors.orange}`), swaps to the empty-heart icon and reads "Hungry · 3h left" (word + icon, not colour alone; no "!"). Same chip everywhere so it is learned once. Screen readers get words: "2 days 14 hours until Mochi sleeps". |
| Pet badge | Under pet name | Species · Lv · stage ("Bunny · Lv 12 · Adult"). Updates on level-up. |
| Blob stage | Home, hero, egg, try-on, fight | Hosts the 3D pet. Shows the pet's state (awake, hungry bubble, asleep). Shadow turns orange when hungry. Try-on shows the selected cosmetic live. |
| Pet switcher | Home (and the pet context on every tab) | Lists own pets and Co-Pets; switching changes the pet every tab acts on. Co-Pet entries show the partner's avatar. The "add" egg starts a Co-Pet invite link (Co-Pet is created from Home, not Guild). |
| Alert pill | Home, top of Battle | One alert at a time, newest first. Robbery alert carries a Revenge button. Dismisses when acted on. |
| Status pill | Play cards, rows | Live status: "Ready", "2 of 3 left today", "Back in 3h 12m", "This weekend", "Next spin 23h". `{colors.cooldown}` when waiting. |
| Icon tile | Cards, items, benefits | Decorative; label always present next to it. |
| Avatar | Top-right on every page | Labelled "Account menu". Opens the Avatar menu (Profile, Wallet, Claims, Season, Calm motion, Notifications, How it's fair). |
| Tab bar | Phone | 5 tabs, always visible, active tab `{colors.pink}` plus an ink bar and `aria-current="page"`. Plain links inside `<nav>`, in Tab order. Tapping the active tab scrolls to top. |
| Top nav | Desktop | Same 5 destinations as the tab bar (plain links, `aria-current="page"`), plus free-actions chip, streak pill, wallet chip, avatar. |
| Segmented tabs | Battle (Attack / Duel / 2v2; Duel has Ranked / Wager), Shop (Store / Pass / Market), Guild (Guild / War), Season (Leaderboard / Hall of Fame) | Switches view in place; second line shows the limit ("5 left today"). `role="tablist"` with `aria-selected`; arrow keys move between segments. |
| Bottom sheet | Login, claim, wheel, wallet, confirmations | Opens from the bottom over a scrim; closes on grab-handle swipe down, scrim tap, `Esc`, or its text button (mandatory in every sheet). One at a time. `role="dialog" aria-modal="true"`, focus trapped inside; initial focus on the sheet title; focus returns to the trigger on close. Never closes on a timer. |
| Step chip | Onboarding | "Step n of 4" (as text; progress dots are `aria-hidden`) + task + Skip. Skip is first in focus order. Advances when the task is done, not on a Next button. |
| Target row | Battle › Attack | Shows **reward and chance before you tap** ("Win +620 · 54% chance"). Only pets within ±2 levels. Asleep targets show a zzz badge and stay attackable; shielded targets show "Safe for now" and a cooldown button with the shield time. Desktop sorts by best chance. |
| Revenge row | Top of Battle › Attack | Appears after a robbery; "Revenge, no wait" skips the 30-minute cooldown, once per robbery. Disappears after use. |
| Nameplate + health bar | Fight | Health counts down per hit; bar turns orange and adds the word "Low" when low. Opponent top, you bottom. `role="meter"` with `aria-valuetext` ("34 of 100, low"). |
| Hit label | Fight | Short labels per hit ("Bonk! −18", "Crit! −32", "Dodge!"). `aria-hidden` (the battle text box carries the same facts). Hidden under reduce motion or Calm motion. |
| Battle text box | Fight | One line per round ("Mochi used **Carrot Kick!**"). `role="log"`, `aria-live="polite"`; each line includes both health values ("Round 3. Mochi used Carrot Kick. Pudding 34 of 100."). It is the accessible record of the fight; the arena canvas is `aria-hidden`. |
| Result card | After a fight | Shows the points won in big type, new total, and your new share in dollars, plus a "Check this result" link. Focus moves to the result heading. Buttons: Share, cooldown button for the next attack, "Back to Battle". Loss: no result card, gentle headline, wait inside the button, one tip. |
| Activity card | Play hub | One per activity with live status pill; phone card opens the activity; desktop card has its own action button. |
| Progress bar | Expeditions, Boss Raid, hunger | Fills live; label next to it always says the time or percent in words ("62% boss health"). `role="progressbar"` with `aria-valuetext`. |
| Lives hearts | Death Match | 3 hearts; a lost life empties one. Lives refill 1 per 7 days of good care. |
| Danger note | Death Match, Bold expedition, wagers | One plain sentence about the risk, paired with the safe option ("Leave safely any time."). Shown **before** the player commits. |
| Prize wheel | Wheel sheet | One free spin a day. Spins, lands, shows the prize card, then the button becomes "Next spin in 23h 59m". Under reduce motion or Calm motion, shows the prize directly. Keyboard: Spin is a real button; while spinning focus stays on it with `aria-busy`; the prize is announced ("You won plus 100 points") and focus moves to the prize card's button. |
| Rarity tag | Cosmetic and market items | Stars + word, never colour alone. |
| Item tile | Store | Tap selects and shows details; Buy happens in the detail / try-on area. |
| Cosmetic tile | Store, dress up | Tap tries the item on your pet in the try-on card; Buy is separate. Selected tile ringed pink with an ink check badge and `aria-pressed="true"`. |
| Try-on card | Store (phone top, desktop right rail) | Shows your current pet wearing the selected item; "Buy for $4" confirms the price in dollars. |
| Pass card | Shop › Pass | One dollar price, benefit rows that say "instead of" with the old value in words ("was 30 minutes"; struck-through text is not read aloud), one CTA, "No auto-renew". |
| Reward track | Pass | Nodes fill as the season progresses; final node is the season skin. |
| Market row | Shop › Market | Rare and better items only; never pets or Co-Pets (#14); fee stated up front; filter by slot (All, Hat, Face, Neck, Back, Hand). "Sell an item · 5% fee" at the bottom. **Buy opens the market buy sheet** (item, seller, dollar price, token amount, 5% fee, lemon Buy, "Not now"); never a one-tap buy from the list. |
| Claim sheet | From pot blob or Avatar menu › Claims | Dollar amount first, ETH second; states "pot points go back to 0" with from → to and "Mochi stays Lv 12" (level never drops); one-line pot explainer with 85/15 bar; lemon Claim; "Not now, keep growing" closes with no change; "Check this result" link to the on-chain share. Keyboard: initial focus on the sheet title (not Claim, so a stray Enter resets nothing); Tab order amount → reset box → explainer → Claim → "Not now, keep growing"; `Esc` = the text button. After claiming, focus returns to the pot blob and the confirmation stays on screen until dismissed. |
| Wallet chip | Shop header, desktop nav | Shows your PETV balance as dollars first. Opens the Wallet sheet. |
| Input field | Login | Email entry with a visible `<label>`; inline error under the field in words + icon, linked with `aria-describedby`. |
| Focus ring | Every focusable item | Ink ring on `:focus-visible` (DESIGN `focus-ring`). Focus is never hidden under the tab bar or a sheet (`scroll-padding-bottom` 110px). |
| Free-actions chip | Top bar, every page | "7 free left"; at 0 "0 free · small fee". Updates after each sponsored action. Announced only when it changes (polite). |
| Streak pill | Desktop top nav | "Day 4 streak"; opens the Season page. Phone placement open (Open questions). |
| Avatar menu | Avatar | Sheet of rows; each row opens its sheet or page. Calm motion is a three-choice row (Follow device / On / Off, `role="radiogroup"`), default Follow device, stored per player. |
| Wallet sheet | Avatar menu › Wallet, wallet chip, shortfall links | Balances dollars first; "Get today's $2" (then a cooldown button with the countdown); Gold vault stake / swap back (stake is a confirm step; "Swapping back costs 2%" shown before); burn counter. |
| Shortfall note | Any price the player cannot pay (Store, Pass, Market, wager stake, Bold expedition, evolve item, breed) | Replaces a dead button: Buy shows as a cooldown-style "Not enough PETV" and the note says the gap in dollars ("You need $1.40 more", PETV under) with "Get today's $2" (or "Open Wallet" once used). After topping up, the player returns to the same item. |
| Burn counter | Wallet sheet, Dice card, wager and Bold expedition results | Shows total burned, dollars first. On a result it ticks up by the amount just burned ("+$0.40 burned"); no animation under Calm motion. Not a live region. |
| Fairness check | Result card, wheel prize card, dice and wager results, claim sheet; How it's fair page | "Check this result" opens a sheet: when the result was locked in, when it was revealed, and "Matches" if they agree, with a link to the public record. While waiting for the reveal: "Being revealed · nothing for you to do". Never blocks the player. |
| Evolve / Breed buttons | Home pet card | Locked buttons stay visible and focusable with the reason ("Evolve at Lv 15", "Breed at Adult", "No breeds left"). Ready buttons open their sheet; cost is shown dollars first before the confirm. |
| Co-Pet card | Home, under the stage for a Co-Pet | Who fed today, Together bonus, 50/50 share, "Needs both to agree: Breed · Death Match". Menu ("Co-Pet options") holds Leave Co-Pet. No sell or buy-out action (#14). |
| Asleep stage | Home, asleep pet | Dimmed stage, "Asleep · day 3 of 7", lime "Feed Mochi to wake · free" with the points cost stated before the tap; day track. |
| Tombstone | Home, after death | Leads with the pet (name, days lived, wins), then the money line, then "Hatch your free egg". |
| Guild screens | Guild tab | Guild / War segments; member rows reuse target rows (no Attack button for your own guild); War board shows 5 match chips with words ("Won", "Lost", "Next"). |
| Prize card | Wheel, Monsters, Expedition return | Shows the prize big; one button to take it. Never auto-dismisses. |
| Progress dots | Onboarding | Decorative copy of "Step n of 4"; `aria-hidden`. |
| Season card / page | Play hub, Avatar menu | Card: "Week 4 of 12", "Your rank #128". Page: your rank row first, then leaderboard (top 100), the season pool line, and a Hall of Fame segment. Ranks reset each season (FR-47). |
| Wager setup | Battle › Duel › Wager | Stake chips in dollars, danger note before the commit, confirm sheet with stake + "5% of the pot is burned", then matching. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Fed | Home | Lime timer chip "♥ 2d 14h" (heart icon); Feed button lime. |
| **Hungry** | Home, push, Telegram | Timer chip reads "Hungry · 3h left" with the empty-heart icon; chip and stage shadow turn `{colors.orange}`; speech bubble "I'm hungry…"; feed card: "Mochi falls asleep in 3h", orange hunger bar, one sentence ("Asleep pets earn no points, get no pot share and can be robbed. One meal keeps Mochi awake for 3 more days."), "Feed now · +20 points", "You have 2 free meals". |
| **Asleep** | Home, target rows | zzz on the pet and avatar; "Mochi is asleep. Asleep pets earn no points, get no pot share and can be robbed." Pot blob: "No pot share while asleep" (#15). Waking is free: **feeding wakes the pet** (#18); one lime "Feed Mochi to wake · free" button, no separate paid revive, with the cost stated before tapping: "Mochi slept 2 days, so Mochi loses 20% of points (2,496)." (FR-10: 10% per day asleep.) As a target: grey zzz badge, still attackable. |
| **Shielded** | Home, target rows | Sky shield badge on the avatar; as a target: row at reduced opacity, "Safe for now", cooldown button with shield + time ("22m"). Own pet: "Safe from attacks for 3 days" (new pet) or the shield time. |
| **Cooldown** | Any timed action | Cooldown button in place of the action, live wait inside ("Attack in 12m", "Next spin in 23h 59m", "Try again in 30m"). Season Pass holders see 10m instead of 30m. |
| Away (expedition) | Home, Play, Battle | "Mochi is away · back in 3h 12m"; Mochi cannot battle; battle buttons become cooldown buttons with that wait. |
| **Dead / Tombstone** | Home | "Mochi passed away." Calm, no orange alarm. Says what happened in one line each: points removed, unclaimed share went back to the pot. Shows the Tombstone badge and a lemon "Hatch your free egg" button. |
| **Claim** | Claim sheet | "Claim $42.08" / "0.018 ETH", "Your pot points go back to 0 · 12,480 → 0", "Mochi stays Lv 12", pot explainer, Claim / "Not now, keep growing". After claiming: points blob shows 0, pet badge keeps Lv 12, a short confirmation with the dollar amount. Zero share: Claim is a cooldown-style disabled button explaining why ("Earn points to get a share"). |
| Robbed | Home alert, Battle revenge row, push, Telegram | Names the attacker and the points lost ("Biscuit took 624 points from Mochi. Revenge?"); Mochi gets a 30-minute shield. |
| Won / lost | Result | Won: "You won!", "+620 points", new total, new share in dollars. Lost: "So close!", "Pudding kept their points.", "Try again in 30m", a tip. |
| Death Match last life | Death Match | At 1 life: sheet "Leave safely?" with streak rewards shown; leaving is the lemon action, continuing is secondary. |
| Co-Pet needs partner | Home (Co-Pet card), Death Match | Actions needing both owners (breed, Death Match) show "Waiting for Priya to agree" and cannot complete alone. |
| **Empty** | Battle list, Market, Guild, own items | One sentence + one action: "No pets near your level right now. Try Monsters while you wait." · "No items for sale in this slot yet." · "You're not in a guild yet. Invite a friend." (copy pattern; exact lines per surface at build). |
| **Loading** | Any surface | Sticker-shaped placeholders tinted `{colors.dot}` on `{colors.background}`, matching the final layout; the blob stage shows the empty scene until the pet loads. Never a blank frame where the pet should be. |
| Pending action | Any on-chain action | Button shows a plain verb ("Hatching…", "Claiming $42.08…"); never "Processing tx…". |
| **Error** | Any action | Says what failed and what to do, keeps the player's place: "Couldn't feed Mochi. Try again." with a retry button. Money actions say nothing was spent when that is true. |
| Offline | Global | Read-only last-known values with "You're offline." *Offline action queueing not decided (Open question 7).* Whatever is decided, an action that fails to send says "Couldn't send. Nothing was spent." |
| Out of free actions | Any sponsored action | 10 free actions a day, 20 with the Season Pass (#19); then the player pays from test ETH. Shown as a small chip in the top bar next to the balance ("7 free left"), always visible. At 0 the chip reads "0 free · small fee" and actions show the fee in dollars before confirming; never say "gas" (owner, 2026-10-14). |
| **Not enough PETV** | Store, Pass, Market, wager stake, Bold expedition, evolve item, breed | Never a dead button. Buy becomes a cooldown-style "Not enough PETV" (focusable, with the reason) and a shortfall note says the gap in dollars first: "You need **$1.40** more" over "437 PETV", with lemon "Get today's $2" (opens the Wallet sheet faucet) or "Open Wallet" if today's $2 is used: "Next free $2 in 9h". |
| **No test ETH** | Any action at "0 free · small fee" when the player has no test ETH for the fee | The fee confirm says "This needs a small fee (shown in dollars) and you have no test ETH." with "Get test ETH" (Wallet sheet) and the free-actions reset time ("10 free actions again in 6h"). Nothing is spent. |
| Evolve locked | Home pet card | Cooldown-style button with lock: "Evolve at Lv 15" (Elder), "Evolve at Lv 30 + season trophy" (Mythic). At level but no item: "Evolve · needs Elder item $3" opens Store on that item. Teen and Adult come by level on their own (no button). |
| Breed locked | Home pet card | "Breed at Adult" before Adult; "No breeds left · 5 of 5 used" after 5; "Mochi needs good care to breed" when care is low. Co-Pet: "Waiting for Priya to agree". |
| Co-Pet limit | Home pet switcher "add" egg | At 3 Co-Pets the add egg shows "3 of 3 Co-Pets" and, when pressed, "Leave a Co-Pet to start a new one". Stays focusable. |
| Co-Pet invite pending / expired | Home pet switcher, invite link | Pending: dashed egg chip "Waiting for Priya" with "Copy link again" and "Cancel invite". Expired or used link: "This invite has ended. Ask your friend for a new one." |
| Co-Pet left | Home, both owners | Confirm sheet first: "Leave Co-Pet Pudding? Pudding goes back to Sam, who hatched it. You keep a memory badge. No money changes hands." After: the pet leaves your switcher; a memory badge appears in Profile; the other owner gets an in-app alert "Priya left Co-Pet Pudding". If the creator leaves, the pet stays with the other owner (FR-30). |
| Matchmaking | Duel, 2v2 random partner, wager, Boss Raid partner | "Finding a match…" with a plain "Stop looking" text button; nothing is spent while searching; if no match comes, the Empty-state line "No one near your level right now. Try again soon." |
| Result being revealed | Any battle, dice or wager result (FR-27) | Grey pill "Being revealed · nothing for you to do"; the fight plays once the reveal lands; no countdown for the player because the server reveals. |
| Push permission denied | Notification settings, after the browser prompt | "Alerts are off in your browser. You can still link Telegram." with steps to turn them on; no repeated prompts. |
| Guild full / leave guild | Guild tab | Invite button becomes "Guild is full · 10 of 10"; Guild card menu holds "Leave guild" with a confirm sheet ("You stop sharing this week's War prize."). Leader removing a member uses the same confirm. |
| Pass owned | Shop › Pass | Card shows "You have the Season Pass · Week 4 of 12" with the reward track; no buy button. |
| Death Match closed | Play › Death Match card | Outside the weekend: status pill "Opens Saturday" and a cooldown-style button "Opens in 2d 6h"; card still explains the rules. |

## Interaction Primitives

- **Tap / click to act.** One main (lemon) action per view.
- **Battles play by themselves** (FR-18). The player watches; "Skip to result" is always available. No tapping during a fight.
- **Reward and odds before commit.** Any action that risks or wins something shows what and how likely before the tap.
- **Confirm sheet for anything that loses something:** claim (points reset), Death Match entry (pet can pass away), Bold expedition and wagers (stake can be lost or burned), market item sale, **market buy**, evolve, breed, Gold vault stake, leave Co-Pet, leave guild. There is no pet or Co-Pet selling or buy-out (#14). Everyday actions (feed, spin, attack, revenge) are one tap, no confirm.
- **Live countdowns** in place; buttons re-enable themselves at 0.
- **Nothing closes on a timer.** No sheet, prize card, confirmation, "Leave safely?" sheet or wager acceptance auto-dismisses or auto-advances. The Death Match "Leave safely?" sheet never times out into "continue". If a match ever needs the player to act by a deadline, it shows a visible countdown in words and warns at least 1 minute before.
- **Can't afford it:** show the gap in dollars and a way to fix it (shortfall note), never a dead button.
- **Fairness is checkable:** every random result (battle, wheel, dice, wager) and every claim has a "Check this result" link (NFR-1, NFR-2, FR-27).
- **Overlays:** bottom sheets on phone, one at a time; close by swipe down, scrim tap, `Esc` or the text button.
- **Try before buy:** selecting a cosmetic previews it on your pet; buying is a separate press.
- **Banned:** centered modals with an (i) icon, carousels for onboarding text, hidden reasons for disabled buttons, wallet addresses on main screens, emoji as icons.

## Accessibility Floor

Behavioural. Visual contrast lives in DESIGN.md › Colors (ink text on every candy fill; coloured reward text only inside a pill or underline).

- **Big readable text for key info:** points, pot, your share, prices, timers and rewards use the large number styles in DESIGN.md › Typography, in `{colors.ink}`. Never shrink them to fit; wrap or stack instead.
- **Text size floor:** no text under 13px; token amounts and tab labels 14px; body 16px; sizes in `rem`, 200% zoom works, layouts reflow at 320px (DESIGN.md › Typography). Every text and background pair passes AA (DESIGN.md › Colors).
- **Reduce motion** (`prefers-reduced-motion`) **or the in-app Calm motion switch**: no tilt or wobble animation, no confetti, no spinning wheel (show the prize), no hit-label pops; the fight shows its round log and final health bars without animation; the 3D pet stays in a still pose. Information is never only in motion.
- **Calm motion** (Avatar menu): "Follow device" (default), "On" or "Off", stored per player; On applies every reduce-motion rule above.
- **Pet idle stops:** the 3D pet's jelly idle runs for at most 5 seconds after load or after any action, then holds a still pose (WCAG 2.2.2). Calm motion Off keeps the idle running.
- **No flashing:** nothing flashes more than 3 times a second (crit hits, confetti, hatch burst, wheel lights).
- **Full keyboard play on desktop:** every action reachable by `Tab` in reading order; `Enter` / `Space` activate; `Esc` closes the top sheet. Top nav and tab bar are plain links in Tab order; arrow keys work only inside segmented tabs (`role="tablist"`) and the pet switcher (`role="radiogroup"`). Disabled-with-reason buttons stay in Tab order (`aria-disabled`). Focus moves into a sheet when it opens (to its title) and back to the trigger when it closes. "Skip to result" and onboarding Skip are first in focus order of their view; "Skip to result" gets focus when a fight starts. Game-specific shortcut keys are not decided.
- **Focus ring:** always visible, 3px `{colors.ink}` outline with 3px offset on `:focus-visible` (DESIGN.md `focus-ring`); `scroll-padding-bottom: 110px` so focus is never under the floating tab bar or a sheet.
- **Targets:** every pressable item at least 44 × 44px; row buttons at least 8px apart.
- **Screen readers:**
  - Every icon-only control has a name: avatar "Account menu", close icons "Close", add egg "Start a Co-Pet with a friend", pet chips "Play as Mochi, Bunny Lv 12", Co-Pet menu "Co-Pet options". Decorative icons, icon tiles and confetti are `aria-hidden`.
  - **Stage:** the 3D canvas is `aria-hidden="true"`; the blob stage wrapper is `role="img"` with a built `aria-label` ("Mochi the bunny, Lv 12, wearing a leaf hat, hungry"), updated on state or cosmetic change, never on animation. Try-on: "Mochi trying on Star Hat". The egg is a real button "Tap to hatch your egg".
  - **Fight:** the arena is `aria-hidden`; the battle text box is `role="log"` (polite), one line per round with both health values. On result, focus moves to the result heading and the result is read once ("You won. Plus 620 points.").
  - **No live region on the pot** (it moves with other players) or on the points blob or timer chip. One polite region announces only the player's own changes, on change: "Plus 20 points. 12,500 points.", "Free actions: 6 left", and timer thresholds (hungry window starts, 1h to sleep, asleep). Countdowns are read on unit change only, never every second.
  - **Timers in words** for assistive tech: "2 days 14 hours until Mochi sleeps", not "2d 14h".
- **Not colour alone:** danger always has words as well as `{colors.orange}`; rarity uses stars + word; states carry words ("Asleep", "Shielded", "Safe for now"). Full colour-blind-safe palette was **not** selected as a floor.

## Key Flows

Journey IDs and names mirror PRD §2.3.

### UJ-1. A new player's first session (Lena, arrives from a friend's link, not logged in)

→ [.working/key-landing-hatch.html](.working/key-landing-hatch.html)

1. Landing: "Raise a cute pet. Battle friends. Share a real prize pot.", lemon **Play**, "Free pet. No crypto needed to start.", pot teaser "$9,843" over "4.21 ETH".
2. Lena taps Play → login sheet "Let's get your egg!": email, Google, "I already have a wallet". She picks Google; her account and smart wallet are made silently.
3. Egg screen: "Your egg is here! Every new player gets one free egg." She taps the egg.
4. It hatches: "Meet Mochi!" (Bunny · Leaf · Baby), "Mochi is yours forever.", lime pill "Safe from attacks for 3 days". Step chip: "Step 1 of 4 · Feed Mochi · Skip".
5. She feeds Mochi (free) → points tick up → Step 2: dresses Mochi in a free cosmetic in the try-on card.
6. Step 3: a tutorial bot battle she cannot lose (FR-5); the fight plays by itself; "You won!".
7. **Climax:** Step 4 shows the pot: "Prize pot $9,843 · Your points = $0.12 now" (dollars first, ETH underneath).
8. Resolution: a closing card says Mochi is safe for 3 days and lists reasons to come back: feed timer, daily wheel, revenge, login streak.

Failure: login fails → error inside the sheet, email kept, retry. Hatch fails → "Couldn't hatch your egg. Try again." The egg stays; nothing is lost.

### UJ-2. A returning player's day (Sam, day 5, Mochi Lv 12, fed)

→ [.working/key-battle.html](.working/key-battle.html), [.working/key-play-hub.html](.working/key-play-hub.html), [.working/key-shop-claim.html](.working/key-shop-claim.html) (claim sheet)

1. Home: timer chip "2d 14h"; Sam taps **Feed** → timer resets, "+20 points".
2. Spin wheel (Play or Home) → wheel sheet → "+100 points", "Next spin in 23h 59m".
3. Battle › Attack: rows for pets Lv 10 to 14. Pudding "Win +620 · 54% chance" → Attack.
4. The fight plays by itself (Round 3 of 5, hit labels) → "You won! +620 points. Mochi now has 13,100 points. Pudding gets a 30-minute shield." Next attack button shows "Next in 30m".
5. He plays a Duel (5 left today) or a 2v2 with a friend or random partner.
   - **Duel (Ranked):** Battle › Duel › Ranked → "Win: +rank and 10% of their points" shown first → "Find a match" → "Finding a match…" → the fight plays → result with rank change.
   - **2v2:** Battle › 2v2 → "Team up with a friend" (pick from friends) or "Random partner" → matching (level ±2) → fight → "Your team won. +310 points each."
6. **Climax:** he taps the pot blob → claim sheet "Claim $42.08 / 0.018 ETH", "Your pot points go back to 0", "Mochi stays Lv 12" → Claim → points blob reads 0; the badge still says Lv 12.

Edge: Biscuit robs Mochi → push + Telegram + Home alert "Biscuit took 624 points from Mochi. Revenge?" → Battle shows the revenge row "Win +550 · 58%", "Revenge, no wait" → one tap, skips the cooldown; Mochi has a 30-minute shield.

Failure: loss → "So close! Pudding kept their points." with "Try again in 30m". Claim fails → "Couldn't claim. Your points are safe. Try again."

### UJ-3. Neglect, sleep and death (Ana, busy week)

→ [.working/key-sleep-death.html](.working/key-sleep-death.html)

1. Day 2: hungry window → timer chip and stage turn orange; push + Telegram: "Mochi is very hungry, 6h left before sleep".
2. Day 3, not fed → Mochi **sleeps**: zzz on Home; "Asleep pets earn no points, get no pot share and can be robbed." The pot blob reads "No pot share while asleep".
3. Ana returns on day 5 (2 days asleep). The feed button states the cost first: "Feed Mochi to wake · free. Mochi loses 20% of points (2,496)."
4. **Climax:** she feeds Mochi → Mochi wakes on the stage, the timer chip turns lime and the pot share is back.

Edge: asleep for 7 days → Home: "Mochi passed away." Points removed; "Mochi's unclaimed share went back to the pot." Ana keeps a **Tombstone** badge and gets "Hatch your free egg" (FR-11, FR-12).

Failure: wake fails → "Couldn't wake Mochi. Try again. No points were taken." (Error state).

### UJ-4. Two friends and their guild (Sam and Priya)

→ [.working/key-home-copet.html](.working/key-home-copet.html), [.working/key-guild.html](.working/key-guild.html)

1. Sam (adult pet) taps the "add" egg in the Home pet switcher and sends Priya a Co-Pet invite link.
2. Priya opens it and they hatch a **Co-Pet** together; it appears in both pet switchers with the partner's avatar on the pet card.
3. Both feed it the same day → "Together bonus" shown on the Co-Pet card; the shared streak grows only if both show up.
4. From Guild › Guild, Sam invites Priya and she joins his guild (up to 10 players).
5. Sunday: Guild › War, best of 5 2v2 matches; they play the deciding match together.
6. **Climax:** they win the deciding 2v2; the guild shares a Gold prize.

Edge (PRD, FR-30): Priya wants to stop. She opens the Co-Pet card menu → "Leave Co-Pet" → confirm sheet: "Pudding goes back to Sam, who hatched it. You keep a memory badge. No money changes hands." → Leave. Pudding leaves her switcher; she gets the memory badge; Sam gets an in-app alert. There is no selling and no buy-out (#14).

Edge: Sam already has 3 Co-Pets → the add egg reads "3 of 3 Co-Pets" → "Leave a Co-Pet to start a new one" (FR-29).

Edge: Priya asks to enter the Co-Pet in Death Match → "Waiting for Sam to agree" → Sam declines → nothing happens; Priya sees "Sam said no to Death Match".

### UJ-5. Spending and risking $PETV (Kai, holds test PETV from the faucet, $10 at sign-up and $2 a day, and claims)

→ [.working/key-shop-claim.html](.working/key-shop-claim.html) (store), [.working/key-play-hub.html](.working/key-play-hub.html) (dice, expeditions)

1. Shop › Store: "Food $1" over "312 PETV"; Kai buys food and an Elder item ($3).
2. Stakes some PETV in the **Gold vault** (Wallet sheet, from the avatar).
3. Battle › Duel › **Wager**: picks a $5 stake (PETV small under); the danger note says "You can lose your stake. 5% of the pot is burned." → confirm sheet with the stake → "Finding a match…" → "Being revealed · nothing for you to do" → the fight plays.
4. **Climax:** he wins the wager and takes the pot minus the 5% burned; the **burn counter** on the result ticks up ("+$0.50 burned"); "Check this result" shows the result matched what was locked in before the fight.
5. Resolution: he sends Mochi on a **Bold expedition** with the rest; the danger note warned "3x reward, 30% chance to fail and lose your stake"; it fails and the stake is burned: "The expedition failed. Your 500 PETV stake was burned. Mochi is home safe."

Failure: he loses a wager → "So close. You lost your $5 stake. 5% of the pot was burned." with the burn counter and "Try again"; Mochi keeps all points. Not enough PETV for a stake or item → shortfall note "You need $1.40 more" with "Get today's $2" (Wallet sheet); nothing is spent.

### UJ-6. A Death Match weekend (Ana, Saturday, adult pet with 3 lives)

Any adult pet can enter; there is no special "Gladiator" pet type (#20).

→ [.working/key-play-hub.html](.working/key-play-hub.html) (Death Match card)

1. Play › Death Match card: 3 lives, "Your pet can pass away at 0 lives.", "Leave safely any time."
2. Enter → confirm sheet with the same warning → Enter Death Match.
3. Wins twice → "Survivor streak 2".
4. Loses → 2 lives. Loses again → 1 life → "Leave safely?" sheet.
5. **Climax:** she leaves with the streak rewards and a Hall of Fame spot.

Edge: a player who keeps going and loses at 1 life sees "Mochi passed away.", keeps a Tombstone and gets a free egg. A Co-Pet needs both owners to agree before entering.

### UJ-7. A Boss Raid (Sam and Priya)

→ [.working/key-play-hub.html](.working/key-play-hub.html) (Boss Raid card)

1. Play › Boss Raid: "Team of 2", season boss health bar "62%".
2. "Find a partner" → Sam teams up with Priya.
3. The fight plays by itself.
4. Boss health drops across all teams' raids this season ("you dealt 1,240 damage").
5. **Climax:** both get points and Gold for the damage dealt; top raid teams this season get a cosmetic.

Failure: no partner found → card stays on "Find a partner" with the Empty-state pattern; nothing is spent. Fight fails to start → Error state.

### Short flows (owner placements, 2026-10-14; spine-only, no mock)

**Evolve (FR-33, FR-34, FR-36).** Home pet card → **Evolve** (locked until level: "Evolve at Lv 15") → at Lv 15 the button reads "Evolve · needs Elder item $3" → Store opens on the Elder item → buy → back on Home, **Evolve** → Evolve sheet: Mochi now → Mochi Elder, "Warrior path (mostly battles)", item ticked → lemon Evolve → the stage shows the new look; badge reads "Bunny · Lv 15 · Elder". Failure: "Couldn't evolve Mochi. Try again. Your item is safe."

**Breed (FR-37).** Home pet card → **Breed** (locked: "Breed at Adult") → Breed sheet: pick a second adult (own pets; a Co-Pet needs the partner to agree), egg preview, "Breed 1 of 5 · each breed costs double the last", cost dollars first ("$2.99" over the PETV amount, illustrative), "1 in 500 eggs is shiny" → lemon Breed → a new egg appears in the pet switcher. Edge: "No breeds left · 5 of 5 used". Not enough PETV → shortfall note.

**Season (FR-47).** Play › **Season** card ("Week 4 of 12 · Your rank #128") → Season page: your rank row, Leaderboard / Hall of Fame segments, "Top players share the season pool (not the ETH pot)", "Ranks reset when the season ends". Death Match Hall of Fame spots (UJ-6) show here.

**Leave Co-Pet (FR-30).** See UJ-4 edge.

## Onboarding

Short **do-it** steps right after hatching, with **Skip** on every step (decision). Taught by doing, not by reading.

| Step | Task | Done when |
|---|---|---|
| 1 of 4 | Feed Mochi | First feed |
| 2 of 4 | Dress up | A free cosmetic is put on |
| 3 of 4 | Bot battle | Tutorial bot fight finished (cannot lose, FR-5) |
| 4 of 4 | See the pot | Pot and "your points = $X now" shown |

Step chip on top + progress dots; the step advances when the task is done. Skip ends the tutorial and lands on Home. Not decided: whether skipped steps come back later as hints.

## Notifications

Outside alerts are **browser push (PWA)** and a **Telegram bot**. **No email.** In-app alerts use the alert pill on Home.

| Event | Source | In app | Push | Telegram |
|---|---|---|---|---|
| Robbed: names attacker and points lost | FR-20 | Yes | Yes | Yes |
| Hungry / about to sleep ("6h left before sleep") | UJ-1 reasons to return, UJ-3 | Yes | Yes | Yes |
| Fell asleep; close to passing away | UJ-3 | Yes | Yes | Yes |
| Daily wheel ready; login streak at risk | UJ-1 reasons to return | Yes | Not decided | Not decided |
| Co-Pet partner needs to agree (breed, Death Match); partner left a Co-Pet | UJ-4, FR-30 | Yes | Not decided | Not decided |

Copy follows Voice and Tone (dollars first, gentle danger). The one-alert-at-a-time rule applies to push too: never stack robbery + hungry + asleep at once; send the most urgent. Not decided: when to ask for push permission, how a player links Telegram, per-event opt-outs and a daily cap. On iPhone, web push only works after the player adds the PWA to the Home Screen.

## Inspiration & Anti-patterns

From [imports/reference-extract.md](imports/reference-extract.md) (Fren Pet captures and the Petverse prototype).

- **Lifted from Fren Pet:** one heart **timer chip** used on every pet surface; the **cooldown inside the disabled button**; **reward + odds on battle rows** before you tap; a readable battle frame (nameplates, health bars, text box); a **live status pill per mini-game card**; **onboarding by doing** with progress and Skip; the pass sold with **one dollar price and short benefit rows**; **item preview on your pet** before buying; social login with no wallet step up front.
- **Kept from the Petverse prototype:** the pastel glossy jelly 3D pets and readable cosmetics; the sky-and-hill stage.
- **Superseded from the prototype keep-list:** pixel font and pixel-frame buttons. Candy's heavy rounded type and glossy pills replace them.
- **Rejected:** crypto jargon ("$FP", "Gold LP", "Delta", "Supply", "Approve", "Processing tx…", wallet addresses on main screens); three-plus currencies on one screen and ETH as "0.000000"; mixed price strings ("Ξ$0.000627 (~$1.5)"); unlabeled stat strips; copy-heavy modals with (i) icons; a punishing hidden claim reset (we state the reset plainly with from → to); harsh death wording ("die forever", "TOD"); a plain-text gacha win with no prize moment; a tiny or missing pet; shop and money screens only reachable as pushed pages (Shop is a tab).

## Responsive & Platform

| Layout | Navigation | Notes |
|---|---|---|
| Phone (mocked at 390px) | Floating bottom tab bar, 5 tabs | One column; overlays are bottom sheets; main action full width. |
| Desktop (mocked at 1280px) | Top pill nav with streak, wallet chip and avatar | Main column + right rail (pot, points, claim, try-on, mode cards). Play hub 3 columns; Shop 6-column items, 5-column cosmetics. Full keyboard play. |

- Web / PWA only; installable to the Home Screen. Not decided: when to show an install prompt.
- Breakpoint width between layouts, tablet behaviour, and the desktop overlay form are not set (DESIGN Open questions).

## Open questions

1. **Resolved, Gold name** (owner, 2026-10-14): keep "Gold".
2. **Resolved, Gold vault location** (owner, 2026-10-14): Wallet sheet from the avatar, with balances and the faucet. The 5 tabs stay.
3. **Resolved, unplaced surfaces** (owner, 2026-10-14): wager = Battle › Duel › Ranked / Wager; Evolve and Breed = Home pet card buttons; Season + leaderboard + Hall of Fame = Play › Season card → Season page; Co-Pet leave + 3 max = Co-Pet card menu on Home; faucet = Wallet sheet. Still open: see 11.
4. **Resolved, Hungry threshold** (owner, 2026-10-14): the hungry window is the last 24h before sleep; timer chip turns orange and the first alert fires at its start. Copy examples with 3h / 6h are just moments inside that window.
5. **Resolved, Out of free actions** (owner, 2026-10-14): top-bar chip, see State Patterns.
6. **Resolved, Notifications** (owner, 2026-10-14): ask push permission after the first feed; Telegram link in Settings; max 3 pushes a day; per-type opt-outs in Settings.
7. **Resolved, Offline** (owner, 2026-10-14): read-only; any action shows "Couldn't send. Nothing was spent."
8. **Resolved, Keyboard** (owner, 2026-10-14): standard keys only (Tab / Enter / Esc / arrows); skipped onboarding steps return as small hints.
9. **Resolved, mock drift** (2026-10-14): Co-Pet Sell removed, wake = feed, no pot share while asleep, pot-points wording, 312 PETV per $1, pink-deep headings and Guild / War fixed in all 8 key mocks. `direction-candy.html` stays a style source only (Lv 6, ETH-first, emoji are not rules).
10. **Resolved, Level after a claim** (owner, 2026-10-14): level comes from lifetime points and never drops; a claim resets only pot points. PRD §4.10 wording needs a matching update (outside this spine).
11. **Resolved, Login streak on phone** (owner, 2026-10-14): flame chip in the top bar next to the free-actions chip.
12. **Resolved, Wager** (owner, 2026-10-14): Ranked / Wager switch inside the Duel segment; Battle stays Attack / Duel / 2v2.
13. **Resolved, Breeding** (owner, 2026-10-14): only your own pets and Co-Pets; breeding base price = the $2.99 egg.
14. **Resolved, Push quiet hours** (owner, 2026-10-14): no pushes 22:00–08:00 local time, except close-to-death alerts; daily cap 3 (see 6).
15. **Resolved, Co-Pet invite expiry** (owner, 2026-10-14): 7 days, then "This invite has ended".
16. **Resolved, mock drift** (2026-10-14): "So close!" now orange-deep, "Carrot Kick!" and the Death Match multiplier now pink-deep. Mock small-text sizes are below the new floor; spines win.
17. **Resolved, PRD sync** (2026-10-14): PRD UJ-5 updated to 312 PETV per $1.
