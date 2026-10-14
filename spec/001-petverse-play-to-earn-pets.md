# Spec: Petverse, a cute pet game where play earns a share of real ETH

Status: draft. Pairs with `intent/001-petverse-play-to-earn-pets.md` (accepted 2026-10-14).

This spec decides **what MVP1 is**, where each piece runs (chain or server), and what is left for later. It is the
input to `.floor/units.json`. Anything it cannot settle is under §8, Areas of concern, and gets resolved before the
unit that depends on it starts.

---

## 1. What is being decided

| Decision | Choice | Why not the alternative |
|---|---|---|
| What MVP1 proves | **The core loop on testnet:** hatch, feed or lose, steal points, claim a share of the pot | Everything else is content on top of a loop nobody has tested yet |
| Where MVP1 runs | **Robinhood Chain testnet (46630) only** | Mainnet waits on the lawyer review (intent check 4). Testnet tokens have no value (ToS §2.1), so no legal exposure |
| What lives on-chain | **Ownership, timers, points, attacks, the pot** | These are what a player's money depends on, so they must be verifiable |
| What lives on the server / client | **3D, animation, cosmetics (common), care feedback, matchmaking lists** | Paying gas for a feed animation adds cost, not trust |
| The token | **No $PETV in MVP1.** The pot is test ETH | A token adds the securities question and a launch decision (Pons vs sale) that MVP1 doesn't need to answer |
| Platform | **Web / PWA** | Apple 3.1.1 and Google Play forbid crypto-unlocked content (intent constraint) |

---

## 2. The rule that governs every later decision

> **A player's points and pot share must be checkable on-chain by anyone, without trusting our server.**

Fren Pet earns its trust this way: the pot is just the game contract's ETH balance, readable by anyone. If a feature
would make points depend on our server's word, it either moves on-chain or it does not touch points.

Consequences:

- Feeding, sleeping, dying, attacking and claiming are contract calls.
- Cosmetics, animations and the gallery never change points.
- The server may **sponsor** a transaction (gas) but may never **decide** its outcome, except for randomness until §8.1
  is settled, where the server's role is published and limited.

---

## 3. MVP1 cut

Every MVP1 item is launch-blocking for the closed testnet beta. Everything else is MVP2 with the reason.

### 3.1 MVP1 (testnet closed beta)

| # | Feature | What "done" means |
|---|---|---|
| 1 | **Login** | Email or Google through Privy; embedded wallet; Alchemy smart wallet; no seed phrase shown |
| 2 | **Free starter pet** | Mint a pet NFT (species + palette from the egg); sponsored gas |
| 3 | **Feed timer** | Contract stores `lastFed`; feed resets it; 3 days to hungry/asleep (`docs/DECISIONS.md` and §8.4) |
| 4 | **Sleep and death** | Asleep after the timer: earns 0, can be robbed. Wake-up costs a fee + a share of points. Dead after the sleep window: NFT burned |
| 5 | **Points** | Earned from care actions and battles; stored per pet on-chain |
| 6 | **Attack (steal)** | Hit a pet of similar level; win = take a share of its points. Shields and revenge in MVP1 only if cheap (§7) |
| 7 | **The ETH pot and claim** | Contract holds test ETH; share = your points ÷ all points; claim resets points (claim-half option) |
| 8 | **10 free actions a day** | Gas Manager policy sponsors 10 actions per player per day; after that the player pays |
| 9 | **3D app on chain data** | The existing app (`src/`) reads pet state from the contract instead of `localStorage` |
| 10 | **Cosmetics (cosmetic only)** | The 35 existing items, equipped client-side, no on-chain state |

### 3.2 MVP2 and later (not built now)

| Feature | Why later |
|---|---|
| **$PETV token, burns, dollar pricing** | Needs the launch-type decision and the lawyer review |
| **Wager battles, paid spins, dice** | Closest to gambling; blocked by the lawyer review |
| **Death Match (3 lives)** | Needs MVP1 death mechanics proven first |
| **2v2, Guild War, Boss Raid** | Needs matchmaking and more players than a closed beta |
| **Co-Pet** | Two-owner NFT rules are new contract work; not needed to prove the loop |
| **Breeding, 6-stage evolution, shiny eggs** | Content and supply design; MVP1 keeps baby → adult |
| **Gold (pGOLD-style vault coin)** | Depends on $PETV existing |
| **Marketplace** | Depends on rare cosmetics being NFTs (MVP2) and Sequence support (§8.6) |
| **Season Pass, Care Pass, store** | No real money on testnet, so nothing to sell |
| **Seasons and leaderboard rewards** | A closed beta is too short for a 12-week season |
| **Small-player pot, diminishing points** | Tuning; needs real distribution data from the beta |

---

## 4. Architecture

```
 browser (Next.js PWA)                      server (Next.js API routes)          Robinhood Chain testnet
 ┌──────────────────────────┐               ┌───────────────────────┐            ┌────────────────────────┐
 │ 3D pets, cosmetics, UI   │──read state──▶│                       │            │ PetverseGame           │
 │ Privy login              │               │ match list (who can I │──reads────▶│  pets (ERC-721)        │
 │ Alchemy smart wallet ────┼──sponsored tx─┼──────────────────────▶│            │  lastFed, points, level│
 │                          │               │ attack) from events   │            │  attack, wake, claim   │
 └──────────────────────────┘               │ randomness signer §8.1│            │  ETH pot = balance     │
                                            └───────────────────────┘            └────────────────────────┘
```

- **One game contract** (`chain/contracts/PetverseGame.sol`) for MVP1, plus the pet NFT. No Diamond proxy: MVP1 is
  small, and an upgrade path is a §8 concern, not a day-one one.
- **The client reads the contract directly** (viem) for its own pet. The server only builds lists that need indexing
  (who is in my level band and attackable).
- **No database in MVP1** if the event index fits in memory or a file; otherwise local Postgres in Docker for tests
  (Phase 0 rule).

---

## 5. Contract state (MVP1)

| Field | Type | Meaning |
|---|---|---|
| `pets[id].species`, `palette` | `uint8` | Look; set at mint |
| `pets[id].lastFed` | `uint64` | Timestamp of the last feed |
| `pets[id].points` | `uint256` | Claim weight on the pot |
| `pets[id].level`, `atk`, `def` | `uint16` | Battle stats (same hit rule as `src/lib/battle.ts`: ATK ÷ (ATK + DEF)) |
| `pets[id].shieldUntil` | `uint64` | Attack immunity after being hit / bought |
| `totalPoints` | `uint256` | Sum of all live pets' points (pot denominator) |
| `address(this).balance` | — | The pot |

State is **derived from time**, not stored: `hungry = now > lastFed + FEED`, `asleep = now > lastFed + FEED`,
`dead = now > lastFed + FEED + SLEEP`. Death becomes final (burn, points removed from `totalPoints`) on the first call
that touches the pet, or through a public `reap(id)` anyone can call.

---

## 6. Actions (MVP1)

| Action | Who | Effect | Gas |
|---|---|---|---|
| `mint()` | player | New pet, `lastFed = now` | sponsored |
| `feed(id)` | owner | `lastFed = now`, + small points | sponsored (counts toward 10) |
| `wake(id)` | owner | Pays fee into pot, loses 25–60% of points by sleep day | player pays fee; gas sponsored |
| `attack(id, target)` | owner | Hit chance from ATK/DEF; win takes a share of target's points | sponsored (counts) |
| `claim(id, half)` | owner | Sends `pot × points ÷ totalPoints`; points → 0 or half | sponsored |
| `reap(id)` | anyone | Burns a dead pet, removes its points | sponsored |

All numbers (feed points, steal share, wake fees, sleep window) are **owner decisions** under `docs/DECISIONS.md`; the
contract reads them from constants set at deploy so tests pin them.

---

## 7. Fairness rules kept in MVP1

- **Level band for attacks:** target level within ±2 of the attacker. Stops whales farming new pets.
- **Shield after a hit:** a pet that was robbed cannot be robbed again for a short window.
- **Revenge, small-player pot, diminishing points:** MVP2 (§3.2). They are tuning, and tuning needs beta data.

---

## 8. Areas of concern

Each must be resolved before the unit that depends on it starts.

### 8.1 Randomness for attacks — needs owner OK

Pyth Entropy is not on Robinhood Chain (checked 2026-10-13). Options:

1. **Chainlink VRF** — **not available.** Checked 2026-10-14: the [VRF v2.5 supported networks](https://docs.chain.link/vrf/v2-5/supported-networks) page lists 18 networks and Robinhood Chain is not one of them (Chainlink there is Data Feeds and CCIP only).
2. **Commit–reveal by the server:** the server publishes a hash of its seed per epoch, reveals it later; anyone can
   check. Server still chooses the seed before seeing attacks, so it cannot target one player, but it is trust.
3. **`block.prevrandao`:** cheap, but on an Arbitrum Orbit chain it is not real randomness. Rejected for anything that
   moves points.

**Recommendation: option 2, commit–reveal by the server**, with the seed hash posted on-chain each epoch so anyone can check it. Owner to confirm, since it means players trust the server not to pick seeds against them.

### 8.2 Hybrid vs full on-chain

Earlier the owner picked "full on-chain". This spec puts **points-affecting actions on-chain and everything visual off
it** (§2). That is still on-chain for everything that matters, but the owner should confirm.

### 8.3 Gas Manager limit of 10 actions per day

Alchemy's Gas Manager policies have spend and count limits, but **per-user-per-day counting is not checked.** If it is
not supported, the server tracks the count and only signs sponsorship for the first 10. Check before unit 8.

### 8.4 Numbers still open

Death timer (3 + 7 or 3 + 4), wake fee and point loss per day, steal share, feed points. Owner fills these in
`docs/DECISIONS.md` before the contract unit; tests pin whatever is chosen.

### 8.5 Upgradability

A plain contract cannot be fixed after deploy. On testnet that is fine (redeploy). For mainnet (MVP2), decide between
a UUPS proxy (`@openzeppelin/contracts-upgradeable` is already installed) and a migration plan.

### 8.6 Marketplace

Sequence does not list Robinhood Chain (checked 2026-10-13). Not an MVP1 blocker; noted for MVP2.

### 8.7 The real premise is still untested

Intent check 5 (do people return when the money is real) cannot run on testnet. MVP1 can measure day-1 / day-7
return with test ETH, which is a weak signal. The beta report must say so, not present it as the answer.

---

## 9. Order of work

These become floor units (`.floor/units.json`), each with ≤ 5 test-named clauses.

1. **Test runner.** Add Vitest so `npm test` exists (the gate needs it). Hardhat tests for `chain/`.
2. **Contract: pet NFT + feed timer + derived state** (§5). Tests: mint, feed, hungry/asleep/dead by time travel.
3. **Contract: points + claim + pot math.** Tests: share math, claim-half, `totalPoints` stays consistent.
4. **Contract: wake + reap.** Tests: fee by sleep day, point loss, burn removes points.
5. **Randomness** (after §8.1). **Contract: attack + level band + shield.** Tests: band rejects, steal share, shield.
6. **Deploy script** (Hardhat Ignition) to a local node; testnet deploy is an owner action.
7. **Login:** Privy + Alchemy smart wallet on `robinhoodTestnet` (`docs/LESSONS.md` #1).
8. **Sponsorship with the 10-a-day cap** (after §8.3).
9. **Client reads chain state:** replace the `localStorage` pet in `src/lib/store.ts` with contract reads.
10. **Attack list:** server endpoint that lists attackable pets in the level band.
11. **Cosmetics** stay as built; add equip state per pet in the client.

Critical path: 1 → 2 → 3 → 4 → 5 → 9. Login (7, 8) runs alongside the contract work.
