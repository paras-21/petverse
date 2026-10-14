# Petverse owner setup guide

Step-by-step setup of the outside services Petverse needs, in the order the tracer (platform entry 1) and later
entries need them. Machine: Windows, Git Bash, no python.

Sources: `epic-platform/tickets.toml` hitl steps, `epic-platform.md`, `architecture-petverse.md` (AD-3, AD-7, AD-8,
AD-13, hosting), `docs/DECISIONS.md` (#5, #10, #21, #23, #30, #33, #35), `chain/hardhat.config.ts`,
`prisma.config.ts`, `src/lib/db.ts`.

"Check in dashboard" means I could not confirm the exact menu name or setting. Look for it, or something close.

## Security rules (read first)

- Never paste a secret (private key, API key, app secret, DB password, bot token) into chat, an issue, a commit or a
  doc. Not even "just this once".
- Never type a secret as a command argument in Git Bash. It stays in `~/.bash_history`. Use the prompts
  (`npx hardhat keystore set` asks for the value), or paste into a file in an editor.
- `.env*` files are git-ignored (`.gitignore` line 30). Only `.env.example` is committed, and it holds names only.
- Check before every commit: `git status` must not list any `.env` file.
- Use fresh keys for testnet. Never reuse a key that holds real funds.
- If a secret leaks: rotate it in the service dashboard first, then update every place it lives (table in step 5).

---

## 1. Privy app (login)

Needed by: entry 1 (tracer). Decision #5: Privy embedded wallet is the signer; Alchemy builds the smart account.

1. Go to https://dashboard.privy.io and sign in. Click **Create app**. Name: `Petverse testnet`.
2. Open **Login methods** (check in dashboard: may be under **User management > Authentication**).
   - Turn on **Email**.
   - Turn on **Google**. Privy's shared Google keys are fine for testnet; before mainnet, add your own Google OAuth
     credentials.
   - Turn on **External wallets** (wallet login). MetaMask is the 7702-refusing test wallet (decision #34).
   - Leave SMS off.
3. Open **Embedded wallets** (check in dashboard). Set Ethereum embedded wallets to be **created on login for users
   without a wallet**. Do not turn on Privy's own smart wallets; Alchemy does that part (decision #5, LESSONS #1).
4. Open **Domains / Allowed origins** (check in dashboard: often **App settings > Domains**). Add:
   - `http://localhost:3000` (Privy needs the port written out).
   - Later (step 6): your Vercel production URL and preview pattern, e.g. `https://petverse.vercel.app` and
     `https://*-<your-team>.vercel.app` (wildcard works only as a subdomain). Use `https://`, no trailing path.
5. Open **App settings > Basics / API keys** (check in dashboard). Copy:
   - **App ID** → goes to `NEXT_PUBLIC_PRIVY_APP_ID` (public, safe in the browser).
   - **App secret** → goes to `PRIVY_APP_SECRET` (secret, server only).
   - **Verification key** (the ES256 public key used to verify access tokens, AD-8) → goes to
     `PRIVY_VERIFICATION_KEY`. It is public, but keep it in env so it can rotate.
6. Paste them into `.env.local` (see step 5 for the full list). Do not paste them anywhere else yet.

Check it worked: after entry 1 lands, run the app (`npm run dev`), open `http://localhost:3000`, log in with email. The
Privy modal opens with no `invalid_origin` error, and the Privy dashboard **Users** page shows the new user with an
embedded wallet.

## 2. Alchemy app on Robinhood testnet 46630 + Gas Manager policy

Needed by: entry 1. Decisions #5, #23 (7702 for the embedded wallet, 4337 fallback), AD-7 (one policy).

1. Go to https://dashboard.alchemy.com. Click **Create new app**. Name: `Petverse testnet`.
2. Pick chain **Robinhood Chain**, network **Testnet** (chain id 46630). Do not pick mainnet 4663.
   If the app asks which products to enable, include **Smart Wallets / Account Kit** and **Gas Manager** (check in
   dashboard).
3. Copy the **API key** from the app page.
   - It goes to `NEXT_PUBLIC_ALCHEMY_API_KEY` (the browser needs it to talk to the bundler).
   - Build the RPC URL: `https://robinhood-testnet.g.alchemy.com/v2/<API key>`. That full URL is
     `ROBINHOOD_TESTNET_RPC_URL` (Hardhat keystore, step 5) and the worker's RPC URL.
   - Optional (check in dashboard): in the app's **Security / Allowlist** settings, limit the key to `localhost` and your
     Vercel domains, since the key is visible in the browser.
4. Open **Gas Manager** (left menu, may sit under **Wallets** / **Smart Wallets**). Click **Create policy**.
   - Type: **Sponsorship / Gas sponsorship** (check in dashboard).
   - App: the `Petverse testnet` app. Network: Robinhood testnet.
   - Name: `petverse-testnet-game`. This is the **one** policy for all game contracts (AD-7).
   - Spend rules: set a small max spend per user op and a total budget you are happy to lose on testnet. This guide does
     not set economy numbers; the 10/20 daily cap is enforced later by our webhook (decision #19, epic-store-pass).
   - Contract allow-list: add the **tracer contract address** after it is deployed (entry 1, deploy needs your OK).
     Leave the list empty until then, or put a placeholder, as the dashboard allows (check in dashboard).
   - Custom rules webhook: leave **off** for now. Spike 2 (entry 2) points it at a Vercel preview
     `/api/gas/approve` with "approve on failure" **off** (fail closed, AD-7).
   - Save, then make sure the policy is **Active** (new policies may start inactive).
5. Copy the **Policy ID** → `NEXT_PUBLIC_ALCHEMY_POLICY_ID`. A policy ID is not a secret, but keep it in env.
6. Later, when spike 2 turns on the webhook: copy the webhook **signing key** → `ALCHEMY_WEBHOOK_SIGNING_KEY`
   (secret, Vercel only).

Check it worked: the policy shows **Active** with network Robinhood testnet. After the tracer runs, open the tx on
https://explorer.testnet.chain.robinhood.com and see the paymaster paid gas (entry 1 verify line). Policy spend in
the Gas Manager page goes up.

Notes: Robinhood's docs confirm Alchemy is the account-abstraction provider and that the chain supports EIP-7702.
I could not confirm from public docs that 7702 sponsorship on 46630 works with one policy for both modes; spike 2
answers that.

## 3. Test ETH for the deployer

Needed by: entry 1 (tracer deploy). Also on OWNER-CHECKLIST: "Fund testnet deployer wallet".

1. Make a fresh deployer key. Easiest: in MetaMask, **Add account** → a new account used only for Petverse testnet
   deploys. Copy its **address** (public, fine to share).
2. Export its private key only when you do step 5 (MetaMask: account menu → **Account details → Show private key**).
   Do not save it to a file.
3. Get test ETH (any one):
   - Alchemy faucet: https://www.alchemy.com/faucets/robinhood-testnet (about 0.1 ETH per 24h; it may ask that the
     wallet holds a little mainnet ETH, check on the page).
   - Robinhood faucet: https://faucet.testnet.chain.robinhood.com (check on the page).
4. Paste the **address** (never the key) into the faucet. Request funds.
5. Later signer keys (spike 5, entry 16 `RANDOMNESS_SIGNER`) are funded the same way, each its own fresh account.

Check it worked: open `https://explorer.testnet.chain.robinhood.com/address/<deployer address>` and see a non-zero
balance. In MetaMask add the network (chain id 46630, RPC from step 2 or public `https://rpc.testnet.chain.robinhood.com`)
to see it there too.

## 4. Supabase `dev` schema + DATABASE_URL / DIRECT_URL

Needed by: entry 1 (tracer writes into `dev`); entry 8 adds `game`. Decision #10 (hosted DB only; app on :6543,
Prisma CLI on :5432), AD-13 (one DB, schemas per environment), decision #33 (tests may create and drop only their own
`test_<run>` schemas).

1. Go to https://supabase.com/dashboard and open the Petverse project (create one if none: pick a region near your
   users, save the DB password in your password manager, not in a file).
2. Open **SQL Editor → New query**. Run only this (safe, creates nothing destructive):
   ```sql
   create schema if not exists dev;
   create schema if not exists game;
   ```
   (`game` is entry 8's step; making it now is harmless.) Do not run `drop`, `truncate` or `prisma migrate reset` on
   this database.
3. Keep `dev` and `game` **out** of the Data API: open **Project Settings → Data API** (check in dashboard: may be
   **Integrations → Data API → Settings**). Under **Exposed schemas**, make sure `dev`, `game` and any `test_` schema
   are **not** listed. Save.
4. RLS: every table must have RLS on (AD-13). Tables do not exist yet; entry 8 checks this after the first migration.
   Then look at **Table editor** → each table shows "RLS enabled".
5. Click **Connect** (top bar). Under **Connection string → ORMs / URI** (check in dashboard), copy two strings:
   - **Transaction pooler**, port **6543** → `DATABASE_URL` (the app and worker use it, `src/lib/db.ts`).
   - **Session pooler**, port **5432** → `DIRECT_URL` (Prisma CLI and migrations, `prisma.config.ts`).
   - Replace `[YOUR-PASSWORD]` with the DB password. If the password has `@ : / ? # %` in it, URL-encode those
     characters (or reset the password to letters and digits only).
   - Add `?schema=dev` to the end of `DIRECT_URL` (AD-13: the CLI gets the schema this way). If the string already
     has a `?`, use `&schema=dev`.
6. Set `DB_SCHEMA=dev` for local work. It must match the `?schema=` on `DIRECT_URL`. Entry 8 makes `DB_SCHEMA` the only
   source.
7. Where to paste: **`.env`** in the repo root, not only `.env.local`. Reason: `prisma.config.ts` loads only `.env`,
   while Next reads both. Both files are git-ignored.

Check it worked:
- In Git Bash from the repo root: `npx prisma migrate status`. It should connect and say the schema is `dev` (it may say
  no migrations yet). No password is printed.
- In SQL Editor: `select schema_name from information_schema.schemata order by 1;` lists `dev` and `game`.
- After the tracer migration (entry 1), the `dev` schema has the tracer table and `game` is still empty.

## 5. Secrets: where each one goes

Three places, never more:

- **Hardhat keystore** (encrypted file in your home folder) for chain deploy secrets. Read by `chain/hardhat.config.ts`
  through `configVariable`.
- **Local env files** (repo root, git-ignored) for running the app and worker on your machine.
- **Host env** (Vercel for the app and API, Render for the worker) for live testnet. Server role keys live only here
  (AD-3, architecture "Secrets" row).

### 5a. Hardhat keystore

Run in Git Bash from `C:\m0\bits\chain`. Each command prompts for the value; type or paste it at the prompt, not on the
command line. The first time, it asks you to pick a keystore password: save that in your password manager.

```bash
cd /c/m0/bits/chain
npx hardhat keystore set DEPLOYER_PRIVATE_KEY        # deployer key from step 3 (0x... 64 hex)
npx hardhat keystore set ROBINHOOD_TESTNET_RPC_URL   # Alchemy URL from step 2
npx hardhat keystore list                            # shows names only, never values
```

- `ROBINHOOD_MAINNET_RPC_URL` is also referenced in `hardhat.config.ts`. Do not set it now (no mainnet work). If Hardhat
  complains that it is missing when you run a testnet task, tell the agent; do not put a real mainnet value in.
- Do not use `npx hardhat keystore get` in front of anyone, or in a terminal that is being recorded.

Check it worked: `npx hardhat keystore list` shows both names. Later, a testnet task such as a deploy (only after you
OK it) asks for the keystore password and runs.

### 5b. Every variable name and where it goes

Names below are what this guide proposes. Entry 7 writes the names-only `.env.example` and the typed loader; **if a
name in `.env.example` differs, `.env.example` wins.** Fill only the rows the current entry needs.

| Name | What | Secret? | Hardhat keystore | `.env` (local) | `.env.local` (local) | Vercel | Render | First needed |
|---|---|---|---|---|---|---|---|---|
| `DEPLOYER_PRIVATE_KEY` | contract deployer key | yes | yes | no | no | no | no | entry 1 |
| `ROBINHOOD_TESTNET_RPC_URL` | Alchemy RPC URL for 46630 (holds the API key) | yes | yes | no | yes (worker) | no | yes | entry 1 |
| `ROBINHOOD_MAINNET_RPC_URL` | mainnet RPC | yes | later only | no | no | no | no | mainnet work |
| `DATABASE_URL` | Supabase transaction pooler :6543 | yes | no | yes | no | yes | yes | entry 1 |
| `DIRECT_URL` | Supabase session pooler :5432 + `?schema=` | yes | no | yes | no | no (build does not migrate) | no | entry 1 |
| `DB_SCHEMA` | `dev` local, `game` on Vercel/Render, `test_<run>` in tests | no | no | yes | no | yes (`game`) | yes (`game`) | entry 1 / 8 |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID | no | no | no | yes | yes | no | entry 1 |
| `PRIVY_APP_SECRET` | Privy app secret | yes | no | no | yes | yes | if the worker calls Privy (check in entry 9) | entry 1 / 11 |
| `PRIVY_VERIFICATION_KEY` | Privy ES256 verification key | no (public) | no | no | yes | yes | no | entry 11 |
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy API key for the bundler | low (browser-visible) | no | no | yes | yes | no | entry 1 |
| `NEXT_PUBLIC_ALCHEMY_POLICY_ID` | Gas Manager policy ID | no | no | no | yes | yes | no | entry 1 |
| `ALCHEMY_WEBHOOK_SIGNING_KEY` | Gas Manager custom-rules webhook signing key | yes | no | no | only to test locally | yes | no | entry 2 |
| `RANDOMNESS_SIGNER_PRIVATE_KEY` | `RANDOMNESS_SIGNER` role key (commitments on Vercel, reveals in worker) | yes | no | dev key only | dev key only | yes | yes | entry 16 (spike 5 uses a test key) |
| `QUOTE_SIGNER_PRIVATE_KEY` | `QUOTE_SIGNER` role key (price quotes) | yes | no | dev key only | dev key only | yes | no | epic-store-pass |
| `VOUCHER_SIGNER_PRIVATE_KEY` | `VOUCHER_SIGNER` role key (free eggs, faucet) | yes | no | dev key only | dev key only | yes | no | epic-pet-life / store-pass |
| `EPOCH_POSTER_PRIVATE_KEY` | `EPOCH_POSTER` role key (epoch roots) | yes | no | dev key only | dev key only | no | yes | epic-pot |
| `RISK_PRIVATE_KEY` | `RISK` role key (payout holds) | yes | no | dev key only | dev key only | check in epic-anti-bot | yes | epic-anti-bot |
| `KEEPER_PRIVATE_KEY` | `KEEPER` role key | yes | no | dev key only | dev key only | no | yes | later epics |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | web push public key | no | no | no | yes | yes | yes | epic-alerts |
| `VAPID_PRIVATE_KEY` | web push private key | yes | no | no | yes | no | yes | epic-alerts |
| `VAPID_SUBJECT` | `mailto:` contact for push services | no | no | no | yes | no | yes | epic-alerts |
| `TELEGRAM_BOT_TOKEN` | BotFather token | yes | no | no | yes | if the app handles the bot webhook (check in epic-alerts) | yes | epic-alerts |
| `TELEGRAM_BOT_USERNAME` | bot name for `t.me/<bot>?start=` links | no | no | no | yes | yes | yes | epic-alerts |

Rules for this table:
- One key per role (AD-3). Never reuse the deployer key as a role key. Local "dev key only" means a throwaway key that
  never holds the role on 46630.
- Role keys get their on-chain role only through the timelock (Safe proposes, step 9c). Fund each live role key with a
  little test ETH (step 3).
- Which local file the worker reads, and whether it needs `NEXT_PUBLIC_` names, is decided in entry 9 (check there).

Check it worked: after entry 7, starting the app with a value missing fails with an error that **names** the variable
and prints no value (entry 7 verify line). `git status` shows no `.env` file.

## 6. Vercel project (the Next app)

Needed by: entry 10 (spike 2 uses a preview earlier). Decision #21.

1. Go to https://vercel.com, sign in with GitHub. Click **Add New → Project**.
2. **Import** the GitHub repo `paras-21/petverse` (needs step 8 first, so the code is on GitHub).
3. Framework: **Next.js** (auto). Root directory: repo root. Build and install commands: leave the defaults unless entry
   10 says otherwise.
4. **Settings → General → Node.js Version**: pick **22.x or newer** (entry 10 confirms; type stripping needs 22.18+).
5. **Settings → Environment Variables**: add each row marked "Vercel" in step 5b.
   - For **Production**: `DB_SCHEMA=game`, the live role keys.
   - For **Preview**: decide per value; for spike 2 the preview may use `game` or `dev` (check with entry 2). Never point
     a preview at a `test_` schema.
   - Tick **Sensitive** for every secret (check in dashboard), so it cannot be read back in the UI.
   - Do not add `DIRECT_URL` or `DEPLOYER_PRIVATE_KEY` to Vercel.
6. Click **Deploy**. Copy the production URL (e.g. `https://petverse-xxx.vercel.app`) and the preview URL pattern.
7. Go back to Privy (step 1.4) and add both to **Allowed origins**. Also add them to Alchemy's key allowlist if you set
   one (step 2.3).
8. After env changes, **Redeploy** (env values apply only to new deployments).

Check it worked: open the production URL, log in with a fresh email, run the tracer action, and within a minute see the
row indexed by the Render worker (entry 10 verify line). Vercel **Logs** show no secret values.

## 7. Render worker (indexer, reveals, jobs)

Needed by: entry 9. Decision #21: serverless cannot run a poller, so the worker runs on Render.

1. Go to https://render.com, sign in with GitHub, allow access to `paras-21/petverse`.
2. Click **New +**. Pick the service type:
   - **Background Worker** if the worker needs no inbound traffic.
   - **Web Service** if Render must reach its health route (entry 9 adds a health route). Entry 9 decides; check before
     creating. Note: free web services sleep when idle, which breaks an always-on indexer; use a paid instance
     (check prices in dashboard).
3. Repo: `paras-21/petverse`, branch: the one entry 9 names. Runtime: **Node**.
4. Build command and start command: copy them from entry 9's README or `package.json` scripts (they do not exist yet).
5. **Environment**: add each row marked "Render" in step 5b. `DB_SCHEMA=game`. Set Node version through an env value
   `NODE_VERSION=22` (or newer) or an `.nvmrc` (check in dashboard).
6. If a Web Service: set **Health Check Path** to the worker's health route (entry 9 names it).
7. **Create**. Watch the **Logs** tab.

Check it worked: logs show the indexer starting and catching up, with no secret printed. The health route reports lag
under the confirmation depth. Restart the service (**Manual Deploy → Restart**, check in dashboard) mid-sync and
confirm no duplicate or missing rows (entry 9 verify line).

## 8. GitHub remote for CI

Needed by: entry 6 (CI workflow). OWNER-CHECKLIST: "GitHub remote access for pushes". Decision #1: agents never push;
you push.

The remote already exists: `origin = https://github.com/paras-21/petverse.git`.

1. Install GitHub CLI if missing: https://cli.github.com (Windows installer). Reopen Git Bash.
2. Run `gh auth login`. Pick **GitHub.com → HTTPS → Login with a web browser**. Paste the one-time code in the browser.
3. Check: `gh auth status` shows you logged in. `git ls-remote origin` lists branches without asking for a password.
4. Make the repo **private** if it is not (GitHub → repo → **Settings → General → Danger zone**, check in dashboard).
5. When entry 6 adds the workflow, you push the integration branch `floor/mvp1` yourself.
6. CI secrets: tests use a `test_<run>` schema on the live DB (decision #33), so CI may need `DATABASE_URL` and
   `DIRECT_URL` as **repo secrets** (GitHub → **Settings → Secrets and variables → Actions → New repository secret**).
   Add them only if entry 6 says so. No private keys in CI; tests use Hardhat's default test accounts.
7. Optional: turn on **Settings → Code security → Secret scanning / push protection** (check in dashboard).

Check it worked: after your push, the **Actions** tab shows the gate workflow run green, and red on a planted failing
test (entry 6 verify line).

## 9. Later

### 9a. Telegram bot (epic-alerts)

1. In Telegram, open **@BotFather**. Send `/newbot`. Give a name (`Petverse Alerts`) and a username ending in `bot`
   (e.g. `petverse_alerts_bot`).
2. BotFather replies with a **token**. Copy it → `TELEGRAM_BOT_TOKEN` (secret). The username → `TELEGRAM_BOT_USERNAME`.
3. Optional: `/setdescription`, `/setuserpic`. Leave privacy mode on (default).
4. Paste into `.env.local` for local work and Render (and Vercel if the app handles the link webhook, check in
   epic-alerts).
5. If the token leaks: BotFather `/revoke`, then update every place it lives.

Check it worked: open `https://t.me/<username>`, press **Start**; after epic-alerts lands, linking with
`t.me/<bot>?start=<token>` shows your account linked in the app.

### 9b. Web push VAPID keys (epic-alerts)

1. In Git Bash: `npx web-push generate-vapid-keys` (`web-push` is approved, decision #24; npx downloads it once).
   It prints a public and a private key on screen. Do not run it in a recorded terminal.
2. Public key → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`. Private key → `VAPID_PRIVATE_KEY` (secret).
   `VAPID_SUBJECT` = `mailto:` plus a team contact address.
3. Paste into `.env.local`, Vercel (public key) and Render (all three). Then clear the screen (`clear`).
4. Make the keys once and keep them. New keys break every existing push subscription.

Check it worked: after epic-alerts lands, allow notifications in the app and get a test push.

### 9c. Safe signers (spike 3, then entry 15)

Decision #30: 2-of-3 Safe. Decision #35: spike 3 uses 3 fresh test keys; you plus 2 teammates replace them before the
testnet governance deploy (entry 15).

1. Each of the 3 signers makes a fresh MetaMask account for Petverse testnet and shares only the **address**.
2. Fund each signer with a little test ETH (step 3), so they can sign and execute.
3. Go to https://app.safe.global → **Create account**. Pick network **Robinhood Chain testnet** if listed.
   Safe{Wallet} supports Robinhood Chain mainnet; testnet 46630 in the UI is **not confirmed** (check in dashboard).
   If the testnet is not listed, the agent uses Safe Protocol Kit (approved, decision #32) and you sign from scripts
   with your own key at a prompt.
4. Owners: the 3 addresses. Threshold: **2 of 3**. Create and pay the deploy gas.
5. Copy the **Safe address** (public) and give it to the agent for the timelock deploy.
6. For entry 15, the real signers replace the spike's test keys (add owner / remove owner, each a 2-of-3 Safe tx).

Check it worked: the Safe page (or explorer) shows 3 owners and threshold 2. In the spike and the entry 15 drill, two
signers confirm the proposed, executed and cancelled operations on the explorer.

---

## Order summary

1. Privy app → 2. Alchemy app + policy → 3. fund deployer → 4. Supabase `dev` + DB URLs → 5. keystore and `.env`
files → run the tracer locally (entry 1), OK the tracer deploy, add its address to the policy → 8. GitHub auth and push
→ 6. Vercel → 7. Render → 9. Telegram, VAPID, Safe as their entries start.

Every deploy to 46630 waits for your OK (CLAUDE.md). Nothing here touches mainnet.
