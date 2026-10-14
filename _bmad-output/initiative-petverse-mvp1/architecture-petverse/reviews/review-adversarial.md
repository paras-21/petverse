# Adversarial review: Petverse architecture spine

- **Reviewed:** `architecture-petverse.md` (draft, 2026-10-14), with `prd-petverse.md` for context
- **Lens:** build two units that each follow every AD to the letter but still don't fit together; find economic and security holes
- **Reviewer:** independent adversarial pass. The spine was not edited.

## Verdict

The paradigm is right: the chain is the write model, there is one ledger hub, and server keys are narrow. But the spine
is **not yet safe to build from**. Four gaps would let two units that each follow every AD ship incompatible or
exploitable code:

1. ETH coming back into the pot has no single path.
2. Epoch time has two homes, one on-chain and one off-chain.
3. Randomness secrets can be withheld or read too early.
4. Signer keys have no on-chain bounds on what they can sign.

All of these can be fixed with rule text. None needs a change of paradigm.

Severity: **Critical** = funds lost or minted wrongly, or a contract cannot integrate. **High** = an exploit or a
divergence that is likely to happen. **Medium** = drift or a nuisance.

---

## A. Unit pairs that obey the ADs and still clash

### A1 [Critical]: PetCore (bury) vs PotFunder: ETH returned to the pot takes two paths

- AD-16 says bury "returns pending ETH to the pot".
- AD-4 says "ETH enters only through `PotFunder.fund()`", which splits 85/15.
- The PetCore unit can legally do either of these:
  - Add the ETH straight into `accEthPerEffPoint`. That is 100% main pot, and it breaks the "only PotFunder" rule.
  - Call `PotFunder.fund()`. Then 15% leaks to SmallPot, and PetCore pays ETH out to PotFunder and gets it back in one
    call, which is a reentrancy surface.
- **Ordering bug:** if bury redistributes *before* it removes the dead pet's `eff` from `totalEffPoints`, the dead pet
  earns a share of its own returned ETH. That ETH is then stranded, because the NFT is burned.
- Claim has the same question: what happens to ETH a co-owner leaves unclaimed?
- **Rule to add (AD-4):** "Recycled ETH (bury, forfeits) never leaves PetCore. `PetCore._recycle(amount)` runs only
  after the pet's `eff` has been removed from `totalEffPoints`, and adds the amount to the main accumulator (100%, no
  small-pot split). If the total is 0, it adds the amount to `undistributed` instead. `PotFunder.fund()` is the only
  entry for *new* ETH. A test checks that the ETH held by PetCore equals Σ`ethOwed` + Σpending + `undistributed`, to
  within the rounding dust (pet count × 1 wei)."

### A2 [Critical]: Small-pot builder vs SmallPot contract: epoch boundaries live in two places

- AD-18 puts "epoch length" in the off-chain `GameConfig`.
- AD-4/AD-5 send 15% of each fund to SmallPot on-chain, and the contract must know which epoch that ETH belongs to.
- So the worker and the contract can cut epochs at different times. The builder posts a `total` that is either larger
  than what SmallPot received for that window (double counting, so the last claimers revert) or smaller (ETH is
  stranded).
- The "older than 7 days" check and "living" are also measured against whatever the builder's clock says.
- **Rule to add (AD-5):**
  - "Epoch length and genesis are on-chain parameters of `SmallPot` (timelocked), not `GameConfig`. SmallPot records
    `epochFunded[e]` from each fund by `block.timestamp`.
  - A posted root must have `total ≤ epochFunded[e] + rolledOver[e]`, and `leafCount × share == total`, with the share
    fixed per epoch (equal shares are enforced on-chain).
  - The snapshot block is the last block with `timestamp < epochEnd(e)`. Age and alive are judged at that block's
    timestamp, using the AD-16 status function.
  - Leaves are `(epoch, petId, amount)`, not addresses. The payout goes to the pet's owner (and co-owner, 50/50) at
    claim time. The pet must not be dead at claim time; if it is, its share rolls over."

### A3 [High]: Battle vs PetCore vs SeasonPass: who applies point multipliers and steals

- The +25% Season Pass bonus (FR-43), the monster +20 points, and the 5% steal are each "a PetCore function gated by
  GAME_MODULE" (AD-2).
- Nothing says *which unit applies the multiplier*. So Battle might apply it, Care might also apply it, Raid might
  forget it, or PetCore might apply it on top of a module that already did.
- A steal done as two calls (`subPoints(victim)` then `addPoints(attacker)`) can be split by a revert in the middle,
  and it settles the two pets in different orders.
- **Rule to add (AD-2):**
  - "PetCore exposes only `awardPoints(petId, basePts, reasonCode)` and
    `transferPoints(fromPet, toPet, bps, reasonCode)`. Modules pass *base* amounts.
  - PetCore alone applies multipliers, reading `SeasonPass.isActive(ownerOf(petId), block.timestamp)`. The pass is
    keyed by wallet, and a co-pet uses the primary owner.
  - `transferPoints` computes the stolen amount from the victim's *raw* points, settles both pets, then updates both
    `eff` values and `totalEffPoints` in one call.
  - No module adds points through a path other than these two."

### A4 [High]: Reentrancy across modules through smart-wallet payouts

- Claims pay ETH to a smart wallet, which is a contract and can run code when it receives ETH.
- From that callback it can call Battle, Care or Wager, which call back into PetCore while the claim is half done.
- Per-contract `nonReentrant` guards do not stop this, because the re-entry comes in through a different contract.
- **Rule to add (AD-2):**
  - "PetCore holds one global reentrancy lock (transient storage, as allowed by cancun). Every GAME_MODULE entry point
    and every claim takes this lock.
  - ETH and $PETV leave a contract only as the last step (checks-effects-interactions). Points and `ethOwed` are zeroed
    before any transfer.
  - Payout is push, falling back to pull: if the transfer fails, the amount is credited to `withdrawable[addr]`. A
    reverting receiver cannot block bury or any keeper call."

### A5 [High]: Bury-on-touch vs module flow: dead target, mid-transaction

- AD-16 says "every function that touches a pet buries it first if due".
- An attack on a pet that is due to die then burns the NFT in the middle of the attack. One Battle unit will revert;
  another will carry on and settle against a deleted pet. The Randomness callback can also land on a pet that has
  since been buried.
- **Rule to add (AD-16):**
  - "`PetCore.touch(petId) returns (Status)` is the only bury-on-touch hook.
  - A module receiving `Dead` must end the action with no state change *for that pet*: any stake is refunded and no
    revert happens, so the bury is kept.
  - A Randomness settle for a buried pet takes the AD-6 no-loss fallback."

### A6 [Medium]: Indexer/notifier vs keeper: time-based alerts have no event

- "Hungry" and "asleep" (AD-19) happen at a timestamp. No event marks them, because they are lazy.
- One notifier unit waits for an event that never comes. Another polls with its own copy of the rule.
- **Rule to add (AD-19):** "Time-based alerts are made by the notifier from the projected `sleepAt`, using the shared
  AD-16 TS status function. They are deduplicated by `(petId, kind, sleepAt)`. Event-based alerts are deduplicated by
  `(chainId, txHash, logIndex)`."

### A7 [Medium]: Gold has two owners

- AD-2 has PetCore storing "per-pet Gold accrual".
- AD-16 has bury "returning Gold to the vault".
- GoldVault owns the Gold shares. Open question 8 (minted shares or a funded reserve) decides whether the accrual is
  shares or $PETV.
- **Rule to add (AD-2):** "PetCore stores accrued-but-unminted Gold only, as a counter. GoldVault is the only contract
  that holds Gold or $PETV balances, through `GoldVault.creditFromGame(to, amount)`, which only PetCore may call.
  'Return to vault' means the counter is deleted; no tokens move. This is blocked until open question 8 is answered."

### A8 [Medium]: PetNFT transfers vs the per-pet ledger

- ETH owed, small-pot leaves and co-owner records all follow `petId`.
- The PRD (§7) says there is no pet trading in release 1, but PetNFT is not told to block transfers. So one unit may
  allow transfers and another may assume a pet's owner never changes.
- **Rule to add:** "PetNFT can only be minted and burned by PetCore in release 1. Transfers are blocked except through
  the PetCore Co-Pet flows (AD-17)."

---

## B. Economic and security holes in the ADs

### B1 [Critical]: Randomness: withholding, early reading, and choosing the secret

- **The signer knows the outcome first.** The signer holds the secret. As soon as `commitBlock+1` is mined, it can work
  out the result and simply *not reveal*. The fallback ("refund / no-loss") then gives a free option to whoever the
  signer colludes with: in PvP, the attacker gets to cancel any loss.
- **Early reading.** `RevealLog` stores secrets *before* the reveal in a hosted DB. So any API unit or anyone who can
  read the DB can see outcomes in advance.
- **Choosing the secret.** The signer can generate many secrets and keep the one it likes. The future blockhash limits
  this, but on an Arbitrum-style L2 the sequencer influences the blockhash.
- **Rule to add (AD-6):**
  - "`requestId = keccak(module, player, playerNonce)` is computed on-chain, never chosen by the server.
  - `secret = HMAC(randomnessKey, requestId)`, worked out inside the signer process. No secret is stored before its
    reveal, and `RevealLog` is written after the reveal.
  - The fallback after the timeout is a symmetric no-op for every party (no points move, both stakes are refunded),
    never a one-sided win.
  - The worker raises a `RiskFlag` and an alert if any request goes past 50% of the timeout without a reveal. The
    rate of withheld requests is a published metric.
  - For PvP wagers, both players add a committed salt."

### B2 [High]: Signer key compromise has no on-chain bounds

- **`QUOTE_SIGNER`** signs `petvAmount` and `burnStageBps` freely. A stolen key gets every store item, egg and pass for
  1 wei. It also sets `minOut` for PotConverter, which makes sandwich attacks possible.
- **`VOUCHER_SIGNER`** can mint unlimited free eggs, and so unlimited sybil small-pot claimants.
- **`RISK`** can re-apply a hold the moment one expires, which freezes a pet forever.
- **`SMALLPOT_POSTER`** can post a root that pays itself. The only defence is the Safe noticing within the window.
- **Rule to add (AD-3 / AD-10 / AD-15):**
  - "Item prices in USD cents live on-chain in each module. The quote signs only the rate `petvPerUsd`, which must stay
    within ±N bps of the last accepted rate per hour. `burnStageBps` must be one of {7000, 5000, 3000}.
  - Each signer role has an on-chain rate limit: maximum vouchers per day, maximum holds per pet per 30 days, and
    maximum quote value per hour.
  - Every signer role uses a separate key, and each key is revocable through a fast path: the Safe `PAUSER` can
    suspend a signer address with no delay. Re-granting goes through the timelock.
  - A posted small-pot root is auto-verified by an independent watcher script (in the repo, run by the owner). If the
    rebuilt root does not match, the watcher raises an alert for the Safe to cancel."

### B3 [High]: Effective-points accumulator: sybil splitting, and the first funder

- `eff` is concave, so a 10K-point player gains by spreading points across N pets with no more than K points each:
  their total share grows by up to √N. Stealing between pets the same person owns does this cheaply. Concavity per
  pet does not cap whales; it rewards sybils.
- When `totalEffPoints` is tiny (just after launch, or after many claims), the first fund can go almost entirely to one
  pet.
- **Rule to add (AD-4):**
  - "Owner decision: either concavity is applied per owner identity (`eff` of the sum of the owner's pets, tracked in
    PetCore per owner), or `K` is set so that the cost of a pet (egg price + upkeep) is higher than the √N gain. A test
    vector shows the break-even point.
  - The pot distributes only while `totalEffPoints ≥ MIN_TOTAL_EFF`; below that, ETH stays in `undistributed`.
  - Steals between pets of the same owner or co-owner revert."

### B4 [High]: Gas sponsorship cap can be bypassed

- The cap is counted per smart-wallet address. One Privy DID can derive many smart wallets by changing the salt, or
  attach external wallets.
- One `executeBatch` user operation can pack 20 game calls into a single "action".
- **Rule to add (AD-7):**
  - "The webhook resolves the sender to a Privy DID through `User` and refuses unknown senders. It counts per DID.
  - It decodes the call data and accepts only a single call to a contract on the game allowlist. Batches are counted
    per inner call or refused.
  - Each DID may register one smart wallet."

### B5 [Medium]: Co-Pet claims and approvals

- Paying a claim 50/50 to two addresses where one is on `payoutHold` is ambiguous: is the whole claim held, or only
  one half?
- An approval given once for a "breed" or "Death Match" can be replayed later.
- **Rule to add (AD-17):**
  - "A hold applies per pet, so the whole claim waits.
  - Co-owner approvals are on-chain structs `(petId, action, nonce, expiry)`, used once, and cancelled by any change
    of ownership."

### B6 [Medium]: Indexer projections vs money reads

- The small-pot builder reads projections (AD-5). That is allowed, but the projections lag by `confirmations` blocks.
  A reorg within that window can change who is eligible.
- **Rule to add (AD-14 / AD-5):** "The builder waits until `epochEnd` + `confirmations` + the indexer has caught up
  past the snapshot block. `datasetHash` includes the snapshot block number and its hash."

---

## C. Smaller notes

- AD-4 says "claim sets points to 0", but it does not say whether `rewardDebt` is reset after `eff` becomes 0. Spell
  out the order: settle, pay, set points to 0, set `eff` to 0, set `rewardDebt` to 0.
- AD-7 asks for an "active pass" check, but there is no on-chain `SeasonPass.isActive(address, ts)` and no on-chain
  definition of season boundaries. Add both, so that the webhook and PetCore read the same thing.
- AD-12 lists "cosmetics owned" as a projection. Cosmetics bought through Store are ERC-1155, which is fine. Confirm
  that commons are not in the DB, or they will have a second writer.
- Wager and Dice change $PETV but are not GAME_MODULEs. That is fine as long as they never touch points. Add that as
  an explicit rule.
