# PRD Quality Review: Petverse

- **PRD:** `_bmad-output/initiative-petverse-mvp1/prd-petverse/prd-petverse.md` (+ `addendum.md`)
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Stakes:** public launch, release 1 on Robinhood testnet, all 52 FRs ship at once (owner choice).
- **Cross-checked against:** `.memlog.md`, `docs/DECISIONS.md`, `src/lib/cosmetics.ts`, `src/lib/pets.ts`.

## Overall verdict

The vision, the three journeys and the owner's numbers (timers, steal %, burns, prices) are clear and match the memlog,
so the game's shape is easy to see. But the core money rule contradicts itself (FR-15 "points ÷ all points" against the
small-player pot, diminishing points and top-player bonus shares), and about half the FRs are one-line feature names
with no testable outcome. That matters most here because nothing ships until all 52 are "done".
The PRD lists one open question, so it looks finished. It is not: many rules a builder needs (wheel prizes, guild
rewards, monster rewards, revenue split, how a no-crypto player gets $PETV or gas) are still undecided.

## Decision-readiness: adequate

The owner's decisions are stated as decisions, with numbers: 30-minute cooldown (FR-19), ~5% steal, 10%/day wake loss
(FR-10), 3 + 7 day death timer (FR-8), 5% wager burn (FR-26), 60/25/12/3 rarity split (FR-40). §7 names the big trade-off
honestly ("The owner chose this over shipping in waves or cutting features") and §8 names its cost ("52 requirements
shipping at once is a long build"). §8 is also honest that testnet cannot test the real-money premise.

What is missing is the trade-off between the "fairer pot" promise and the reward rules. FR-47 (top players get bonus
pot shares), FR-51 (10–15% reserved for lower-ranked pets) and FR-52 (diminishing points) pull in different directions,
and FR-15 promises a plain points ÷ all points share. No section says which rule wins or how they combine. There are no
`[NOTE FOR PM]` callouts anywhere, even at real tensions like this one, the testnet-only "own bonding curve" (FR-41) and
the gas limit for email players (FR-4).

### Findings
- **critical** Pot share rule contradicts itself (§4.3 FR-15, FR-47, FR-51, FR-52; NFR-3) — FR-15 says "A pet's share = its points ÷ all points", but FR-51 carves out 10–15% for "lower-ranked pets", FR-52 bends the points curve, and FR-47 adds "bonus pot shares" for top players. NFR-3 ("same cost per claim for 10 or 1M players") and the addendum's MasterChef accumulator only work for a simple linear share; a rank-based sub-pot needs rank at claim time. This is the main money rule and the "fair, checkable" thesis rests on it. *Fix:* write one pot formula: what share goes to the main pool, the small-player pool and the season bonus; the exact curve for FR-52; what "lower-ranked" means; and confirm NFR-3 still holds. Rewrite FR-15 to match.
- **high** Revenue split is not defined (§4.3 FR-17, §4.8 FR-45, addendum "splitter (pot / burn / team)") — FR-17 says store and pass sales fill the pot, FR-45 says 70/50/30% of store spending is burned, and the addendum adds a team cut. Nobody says what % of each income goes to pot, burn and team, or what happens to Season Pass money. *Fix:* add a money-flow table: each income source → % pot / % burn / % team / % Gold vault, per market-cap stage.
- **medium** No `[NOTE FOR PM]` at real tensions (whole PRD) — e.g. FR-41 testnet curve vs real Pons, FR-4 paid gas vs casual players, FR-45 market-cap stages on a test token. *Fix:* add callouts at these points.

## Substance over theater: adequate

Little furniture. The Vision is specific to this product (Fren Pet base + 3D + friends + fair pot); it could not be
swapped into another PRD. The two player types each drive a decision (wallet login and email login in FR-2; no seed
phrase in FR-3). Counter-metrics have real limits (§6 table).

The NFRs are the weak part. NFR-4 "works on phone browsers" has no bound, which is a real gap for a 3D game on phones
(load time, frame rate, low-end devices). NFR-5 ("keys and passwords never in code, logs or chat") is a team rule, not a
product requirement. There is no NFR for contract safety beyond verification (tests, review before mainnet), and none
for anti-cheat or anti-bot, even though "bots win the pot" is the first counter-metric.

### Findings
- **high** No anti-bot / anti-farm requirement (§5, §6 counter-metric "Bot accounts take more than 10% of pot payouts"; FR-6, FR-12, FR-51) — free mint, a free new egg on every death, free gas and a reserved small-player pot together reward making many accounts. The PRD measures bots but no FR or NFR stops them, and does not define "bot account". *Fix:* add an FR/NFR for account limits (one free egg per verified login, sybil checks, rate limits) and define how a bot account is detected for the metric.
- **medium** NFR-4 has no bounds (§5 NFR-4) — "works on phone browsers" is an adjective. *Fix:* name target devices/browsers, first-load size or time, and a minimum frame rate for the 3D scene.
- **low** NFR-5 is a team rule (§5 NFR-5) — already in `CLAUDE.md`. *Fix:* move it out or replace it with a product security NFR (e.g. contract test coverage, no admin key that can take the pot).

## Strategic coherence: adequate

There is a thesis: keep Fren Pet's proven loop, and win on looks, friends, depth, a fairer pot and checkable rules (§1).
The release thesis is also clear: find loop, balance and bugs on testnet before real money (§1, §7). Counter-metrics
match the thesis well (whales, bots, new players quitting after a robbery, deaths).

Two weak spots. First, "fairer pot" is a headline promise but FR-47 pays extra to top players, which works against it
(see the critical finding above). Second, the success metrics barely test the thesis: "100+ players" and "40% day-7"
measure activity, and the main done-gate is "All release 1 features work and are stable, no major bugs", which is not
measurable. The "play with friends" pillar (Co-Pet, 2v2, guilds) has no metric at all. Scope kind is "experience",
which fits a testnet balance run, but "ship all 52 at once" means no part of the loop can be tested with players early.

### Findings
- **medium** "Done when" is not measurable (§6 "All release 1 features work and are stable, no major bugs") — this is the release gate for an all-at-once launch. *Fix:* define it: every FR's acceptance test passes, zero open critical/high bugs, N days of testnet soak with no pot accounting mismatch.
- **medium** Friends pillar has no metric (§1 "play with friends", §6) — *Fix:* add e.g. "% of active players in a Co-Pet, guild or 2v2 in week 1".
- **low** Metric sources not named (§6) — how "still playing" and "robbed new players leave" are measured is not said. *Fix:* one line per metric on the event that counts.

## Done-ness clarity: broken

This is the weakest dimension and it matters most, because all 52 FRs must be done before testnet opens. The care, death
and attack FRs (FR-7 to FR-13, FR-16, FR-19 to FR-22) are mostly testable. Many others are just a feature name:

- FR-31 "**Guilds** of up to 10 players." What does a guild do, how do you join or leave, any rewards?
- FR-32 "**Guild War:** a weekly series of 2v2 matches." Who is matched, how is a winner picked, what is won?
- FR-24 "**2v2:** two friends with one pet each, or a random matched partner." What is at stake? Points, rank, nothing?
- FR-48 "**Daily wheel:** one free spin a day." No prizes or odds. §8 also mentions "paid spins", which no FR describes.
- FR-49 "**Login streak** reward for days in a row." No reward, no reset rule.
- FR-50 "**Monsters (PvE):** ... earn Gold and points." How much, how often, any limit?
- FR-35 "The pet's element sets its look." Elements are not listed or defined anywhere.
- FR-34 "mostly battles → Warrior" — "mostly" has no threshold or time window.
- FR-19 "a pet of similar level" — "level" is never defined (stages in FR-33 are not levels).
- FR-23 "winner gains rank" and FR-25 "rewards are bigger than ranked" — rank system and "ranked" mode are not defined.
- FR-25 "Lives return 1 a week with good care" — "good care" is not defined.
- FR-37 "each breed costs more" — no costs. FR-42 eggs "\$2.99–\$9.99" — what differs between eggs?
- FR-36 "evolution items" — which items, how earned. FR-43 "faster attacks", "more free gas" — by how much?
- FR-38 Expeditions "small sure reward" / "bigger reward" — no amounts or failure odds.
- FR-41 "our own bonding curve that behaves like Pons" — the testnet tax rate is not set, so FR-17's main pot income has no number.
- FR-47 "top players get bonus pot shares" — how many players, how big.

Several FRs also miss edge rules a builder must decide: can a pet in its 3-day safe period (FR-13) attack others? Can an
asleep pet (FR-9) be robbed during its shield (FR-22)? What happens if the server never reveals a battle (FR-27)? Who
picks buyout vs return-to-creator in a Co-Pet split (FR-30)?

### Findings
- **critical** About 20 FRs have no testable outcome (§4.4–4.9: FR-23, 24, 25, 31, 32, 34, 35, 36, 37, 38, 41, 42, 43, 47, 48, 49, 50, plus "level"/"rank") — with an all-at-once release, each of these blocks launch and an engineer cannot tell when it is done. Story creation will have to invent the game design. *Fix:* for each, add the numbers and one "done when" line (e.g. FR-48: prize table with odds; FR-31: create/join/leave, guild reward; FR-35: list of elements and how one is assigned). If the owner has not decided, mark each as an open question.
- **high** Testnet $PETV curve not specified (§4.8 FR-41, §8, §9) — §9 says the Pons tax cap "does not block testnet", but our own curve still needs a tax rate, curve shape and graduation point, and the pot (FR-17) depends on them. *Fix:* set the testnet tax rate, curve and graduation target in FR-41, or open a question that blocks testnet.
- **medium** Market-cap burn stages meaningless on testnet (§4.8 FR-45 "as market cap passes \$1M and \$10M") — a test token's "market cap" comes from server-signed quotes (addendum). *Fix:* say how the stage is picked on testnet (fixed stage, or a test switch).
- **medium** Edge rules missing (FR-9/FR-22, FR-13, FR-21, FR-27, FR-30) — see list above. *Fix:* add one line each.
- **medium** "Paid spins" appear only in §8 (§8 Legal) — no FR. *Fix:* add an FR or remove the mention.
- **low** FR-20 Telegram alert needs a Telegram link step that no FR or UJ covers. *Fix:* add an FR for linking Telegram and turning on push.

## Scope honesty: thin

§7 states the all-at-once choice and lists what is out (mainnet, real money, store apps, pet/egg trading, common
cosmetic trading). §2.2 non-users is clear. That part is honest.

But open-items density is misleadingly low. §9 has one open question, there are zero `[ASSUMPTION]` tags and zero
`[NOTE FOR PM]` callouts, and still the PRD leaves many rules undecided (see Done-ness). On a green-light-to-build PRD
a hidden gap is worse than a listed one. The memlog says the first draft had "8 open questions listed"; they were
answered, but new gaps were not listed.

Two player-access gaps are real blockers. FR-4: after 10 sponsored actions "the player pays", but an email/Google
player (the "casual player" in §2.1, who must not need "to learn crypto first") has no test ETH. And nothing says how any
player gets $PETV on testnet to use the store (FR-42), Season Pass (FR-43), wagers (FR-26), Bold expeditions (FR-38) or
Gold (FR-44): no faucet, starter grant or in-app buy.

### Findings
- **high** Casual players cannot pay gas or get $PETV (§2.1 casual JTBD; FR-3, FR-4, FR-42, FR-43; UJ-1) — "After that the player pays" assumes the player holds test ETH; nothing gives a new email player test ETH or $PETV. UJ-1 alone (mint, feed, play, dress, battle) may use most of the 10 free actions. *Fix:* add an FR for a testnet faucet or starter grant of test ETH and $PETV, say which actions count against the 10, and say what a player with no gas sees.
- **high** Hidden open items (§9 has 1 item; 0 `[ASSUMPTION]`, 0 `[NOTE FOR PM]`) — the PRD reads as complete but many rules are open (Done-ness list, revenue split, anti-bot). *Fix:* move every undecided number into §9 as an open question, and tag inferred rules (e.g. "similar level" matching) as `[ASSUMPTION]` with an index.
- **medium** No risk plan for all-at-once (§7, §8 "the plan should test the riskiest parts first") — the PRD does not say which parts are riskiest. *Fix:* name them (pot math, commit–reveal, bonding curve, Co-Pet ownership) so architecture and tickets order work by risk.

## Downstream usability: thin

This PRD is chain-top (UX, architecture, spec and tickets read it, §0), so this dimension counts. FR IDs 1–52 and
NFR 1–6 are contiguous and unique; UJ refs on FRs resolve. The glossary has only 6 terms, while many domain nouns used
in FRs are not defined: shield, revenge, rank/ranked, level, element, adult (stage), shiny, Tombstone, Together bonus,
Season Pass, Death Match, Guild War, expedition, Safe/Bold, monster, small-player pot, market cap stage. Many FRs are not
traced to any journey: the whole of §4.5 Social (Co-Pet, guilds, Guild War), breeding, evolution, expeditions, store,
Season Pass, Gold, marketplace, wagers, Death Match. That is most of the build with no journey to design UX from.

### Findings
- **high** No journey for social and economy features (§2.3 vs §4.5–4.9) — "play with friends" is a core pillar (§1, §2.1 "Both") but no UJ shows making a Co-Pet, joining a guild, buying in the store, staking for Gold, or a wager. UX cannot design these flows. *Fix:* add UJs for (a) two friends making and raising a Co-Pet, (b) a player buying $PETV and spending it in the store/pass, (c) a wager or Death Match run.
- **medium** Glossary too thin (§3) — see list above. *Fix:* add those terms with one-line meanings; define "level" and "rank" carefully as matching depends on them.

## Shape fit: adequate

Consumer game with meaningful UX, so journeys are load-bearing; the PRD has them, with entry, path, climax and edge
cases. The technical stack is correctly kept in the addendum. It is brownfield: the cosmetics claim checks out
(`src/lib/cosmetics.ts` has 14 hats + 5 faces + 6 necks + 6 backs + 4 hands = 35 items over 5 slots; `src/lib/pets.ts`
has 10 species). But the code notes hand items are for "adults with arms only (babies have no hands)", so FR-39 "every
item fits all 10 species" is not quite true across life stages. Existing vs new screens (e.g. the current Gallery) are
not separated.

### Findings
- **medium** Journeys have no named protagonist (§2.3 UJ-1 "A new player", UJ-2 "A returning player", UJ-3 none) — and they do not say crypto vs casual. *Fix:* name a persona per UJ (e.g. "Mia, casual, email login") so UX knows which login and wallet path to design.
- **low** FR-39 overstates fit (§4.7 FR-39 vs `src/lib/cosmetics.ts` "babies have no hands") — *Fix:* "fits all 10 species; hand items only from the stage that has arms".
- **low** Existing vs new not marked (brownfield) — *Fix:* one line on what exists today (3D pets, cosmetics, gallery) vs new.

## Mechanical notes

- **DECISIONS drift:** `DECISIONS` #6 says "death + paid revive"; FR-10 and the memlog say wake-up is free. #7 says "only the first 10 actions"; FR-4 adds "Season Pass holders get more". Neither change has a new numbered entry in `docs/DECISIONS.md` (project rule 4). Several other owner calls in the memlog (dead pet's ETH to pot, claim resets to 0, 5% steal, 12-week seasons, burns) are also not in DECISIONS.
- **Count drift:** memlog says "49 FRs" and "all 16 features"; PRD has 52 FRs. §8 says 52, correct.
- **Term drift:** "battles" vs "ranked" (FR-25); "level" (FR-19) vs stages (FR-33); "pot share" vs "bonus pot shares" (FR-47); "free cosmetic" (UJ-1) vs rarity tiers (FR-40) — which tier is the free one?
- **Assumptions index:** none exists; no inline `[ASSUMPTION]` tags either, so the roundtrip is trivially clean but hides inferences.
- **Cross-refs:** "intent check 6" (§8) and "intent §Proposed outcome" (NFR-2) point outside the PRD; fine, but give the file path once.
- **Addendum:** "Testnet availability not checked" (addendum, Pons) is stale; §8 says it was checked 2026-10-14 and Pons is not on testnet.
- **NFR-6 vs test rule:** "one hosted Supabase database; tests never touch real data" plus DECISIONS #10 "no local DB" leaves open how DB tests run (architecture, not PRD; note it).
