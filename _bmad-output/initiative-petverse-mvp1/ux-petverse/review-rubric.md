# Spine Pair Review — Petverse

## Overall verdict
The pair is a strong, consistent contract for the core loop (hatch, feed, battle, claim, sleep/death, Co-Pet, guild): every PRD journey UJ-1..7 has a Key Flow with a named player, numbered steps and a climax, and every `{colors.*}` token referenced from EXPERIENCE.md resolves. The gaps sit at the edges: several PRD FRs with a real screen have no IA home (wager battles, evolution/breeding, seasons, Co-Pet leave, fairness check), money states miss "not enough PETV / test ETH", and one measured contrast pair (cooldown label) fails AA at the size it is used.

## 1. Flow coverage — adequate
Checked UJ-1..7 from PRD §2.3 against EXPERIENCE.md › Key Flows; checked FRs with a user surface against IA.
### Findings
- **high** Wager battles (FR-26, UJ-5 step 3) have no IA home: Battle segments are Attack / Duel / 2v2 and Play lists Dice only. A consumer cannot tell where a wager battle starts (EXPERIENCE.md › Information Architecture, UJ-5). *Fix:* add a "Wager" entry (Battle segment or Play card) and its stake / matching / result steps.
- **high** FR-30 (leave or end a Co-Pet, memory badge) is the PRD's UJ-4 edge case but the spine replaced it with a Death Match edge; no surface or flow for leaving exists. FR-29 "max 3 Co-Pets" also has no state (EXPERIENCE.md › UJ-4, Co-Pet card). *Fix:* add "Leave Co-Pet" to the Co-Pet card with a confirm sheet, and a "3 of 3 Co-Pets" state on the add egg.
- **high** Evolution, evolution path, Elder/Mythic items, breeding (FR-33–37), seasons + leaderboard (FR-47) and login streak on phone (FR-49) are listed as unplaced (Open Q3 / Mock coverage spine-only) with no IA row. *Fix:* give each an IA home (e.g. pet badge → Pet profile sheet for evolution/breeding; Play or avatar → Season page) before story slicing.
- **medium** Fairness / verify surface for NFR-1, NFR-2 and FR-27 (commit–reveal, on-chain checkable pot) has no home; the trust promise is invisible in UX. *Fix:* add a "How it's fair / Check this result" link on result card, wheel prize and claim sheet, plus a rules page.
- **medium** UJ-5 has no failure path for a lost wager and no step for the burn counter (climax beat) — the burn counter is not a component anywhere. Duel (FR-23 rank) and 2v2 random matchmaking (FR-24) get one line in UJ-2 step 5 with no steps. *Fix:* add burn counter component + home; short sub-flows for Duel and 2v2 matching.
- **low** UJ-5 step 1 PRD text says "Food $1 = 240 PETV"; spine uses 312 PETV per memlog. Fine, but PRD should be updated to match.

## 2. Token completeness — adequate
All 41 colour tokens have hex; light-only so no dark pairs needed. All `{path}` refs in components and prose resolve.
### Findings
- **high** `button-cooldown` label is `ink-soft` on `cooldown` = 3.42:1 (DESIGN.md › Colors contrast table) but uses `typography.button-sm` (13px bold, not "large"). Fails AA for the most common disabled-with-reason pattern. *Fix:* label `{colors.ink}` (10.02:1), keep wait in bold, or darken `cooldown`.
- **medium** `money-token` (11px) in `ink-soft` is AA on `surface` (5.08) but only AA-large on `background` (4.43). *Fix:* rule "token amounts only on white", or ink on page background.
- **medium** Non-token placeholders `<colour job>` / `<deep of its colour job>` in `sticker-card`, `status-pill`, `icon-tile` shadows don't resolve. *Fix:* split into per-job variants or document a mapping table.
- **low** Raw radii outside `rounded` scale (20, 18, 24, 22, 30px in speech-bubble, nameplate, item-tile, cosmetic-tile, try-on-card, prize-card). *Fix:* add tokens or snap to scale.
- **low** EXPERIENCE intro says "and their `-deep` partners" for every listed colour; `ink-soft-deep`, `background-deep` don't exist. *Fix:* reword.

## 3. Component coverage — adequate
### Findings
- **medium** In DESIGN only (no behaviour row): Co-Pet card, Asleep stage, Tombstone, Guild screens, Prize card, Progress dots. In neither: free-actions chip ("7 free left"), streak pill, Wallet sheet, Avatar menu, burn counter. *Fix:* add rows both sides (Wallet sheet holds faucet + Gold vault, so it needs real rules).
- **low** Battle text box has a DESIGN prose row but no frontmatter token.

## 4. State coverage — thin
Global Empty / Loading / Error / Offline and the pet life states are well covered.
### Findings
- **high** No "not enough PETV" state for Store / Pass / Market / wager / Bold expedition, and no "no test ETH" state when free actions hit 0 (FR-4). This is the first wall a casual player meets. *Fix:* state row: show shortfall in dollars + "Get today's $2" (Wallet sheet) link; never a dead button.
- **medium** Missing per-surface states: push permission denied; 2v2 / Duel / wager matchmaking "searching"; Co-Pet invite pending / expired; guild full 10/10 and leave guild; Pass already owned; Death Match outside weekend (only a status pill). *Fix:* add rows.
- **medium** Offline action behaviour undecided (Open Q7) yet it decides how pending on-chain actions behave on drop. *Fix:* decide read-only + "Couldn't send, nothing spent" before build.

## 5. Visual reference coverage — adequate
Mock coverage table links all 8 key mocks; spines-win rule stated once; superseded directions named; `imports/reference-extract.md` linked.
### Findings
- **medium** `share/` holds older copies of the key mocks (differ from `.working/`), `petverse-themes.html` and `share/img/*.png`; none referenced. A consumer may build from a stale copy. *Fix:* mark `share/` as a shareable snapshot (not a reference) in Mock coverage, or refresh it.
- **low** `.working/key-shop-claim.html` and other mocks are referenced per flow but UJ-3 and UJ-4 do not link key-sleep-death / key-home-copet / key-guild at the flow. *Fix:* add the arrow links.

## 6. Bloat & overspecification — strong
Voice table is long but each row is a load-bearing copy rule. Minor: DESIGN component table repeats frontmatter values (padding, tilts).

## 7. Inheritance discipline — adequate
Sources resolve. UJ names match PRD §2.3. Glossary consistent (pot points, level, PETV without "$").
### Findings
- **medium** Spine overrides PRD UJ-1 climax ("your points = X ETH now") with dollars-first, and FR-16/§4.10 level wording was already fixed in PRD; fine, but the UJ-4 edge change (FR-30 dropped) is a silent divergence. *Fix:* restore the PRD edge or log it in .memlog as a decision.
- **low** Name drift: IA says "Avatar menu … wallet", Open Q2 says "Wallet sheet", Component says "avatar menu wallet". *Fix:* one name.

## 8. Shape fit — strong
DESIGN sections in canonical order; EXPERIENCE has all required defaults plus Inspiration and Responsive (both triggered). Onboarding, Notifications and Mock coverage earn their place. Breakpoint and desktop-overlay form are open (DESIGN Q1) and block desktop sheets; flag for owner.

## Mechanical notes
- No Mermaid in either file.
- `ux-petverse.md` index lists only PRD in sources; spines also cite DECISIONS and memlog.
- EXPERIENCE Open Q numbering keeps resolved items in place (2, 4, 5, 9, 10); fine but could move to a Resolved list.
- DESIGN frontmatter `progress-dots.size: 28px x 8px` is not a valid single dimension.
