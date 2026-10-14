---
title: Petverse owner numbers (testnet defaults)
status: accepted
created: 2026-10-14
---

# Owner numbers: testnet defaults

Answers architecture Open Question 4. These are suggested values for testnet 46630. Each one is a timelocked contract
parameter (AD-3), so it can change later. Mainnet values come back to the owner before mainnet.

| # | Number | Testnet default | Mainnet hint | Why |
| --- | --- | --- | --- | --- |
| N1 | Timelock delay | 1 hour | 48 hours | Fast fixes on testnet; players get time to react on mainnet (DECISIONS #11) |
| N2 | `K` (effective-points knee, per owner, DECISIONS #17) | 10,000 points | revisit with testnet data | A normal player's first weeks stay fully linear; only big hoards shrink |
| N3 | Small-pot epoch | 1 week, ends Sunday 00:00 UTC | same | Weekly rhythm, matches Guild War |
| N4 | Season-pool and trophy epoch | 1 season (12 weeks, FR-47) | same | Pays at season end |
| N5 | Guild War prize epoch | 1 week (Sunday, FR-32) | same | Matches the weekly war |
| N6 | Root claim delay (Safe can cancel inside it) | 1 hour | 24 hours | Time to catch a bad root |
| N7 | Unclaimed epoch rolls over after | 4 epochs | same | About a month to claim |
| N8 | Reveal timeout | 10 minutes | same | Long enough for a slow worker, short enough not to stall play |
| N9 | Payout hold expiry | 72 hours; one back-to-back renewal needs the Safe | same | Enough time to look at a flagged pet without freezing it forever |
| N10 | Rate-move bound (USD quote) | 5% per hour | 2% per hour | Stops one bad quote from repricing the store |
| N11 | Faucet at sign-up | 0.01 test ETH + 3,120 PETV ($10) | none (testnet only) | Enough to play past the 10 free actions |
| N12 | Faucet daily drip | 0.002 test ETH + 624 PETV ($2) | none | Keeps casual testers playing |
| N13 | $PETV supply (1B, fixed) | curve 40% · liquidity 20% · faucet 15% · Gold reserve 15% (DECISIONS #16) · team 10% | revisit before mainnet | The curve sells most supply; the reserve funds game Gold without minting |

| N14 | Daily cap on game Gold paid from the reserve (DECISIONS #16) | 0.1% of the reserve per day (about 150k PETV) | same | Reserve lasts years; easy to raise |

Already set elsewhere, not repeated here: tax split 2% pot · 1% burn · 1% liquidity · 1% team (AD-9); prices (PRD §4.10);
death timer (DECISIONS #13); sponsored actions (DECISIONS #19).
