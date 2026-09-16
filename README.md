# Mizani Clinic Ambassador

React, TypeScript, Vite and Supabase application for ambassador registration, receipt activation, commissions, appointments and administration.

Account activation uses payments collected outside the app. Clinic staff issue a receipt code already recorded in `receipt_codes`; the signed-in ambassador enters that code. The database claims it once, verifies the account and records any referral commissions as pending. Payout approval and recording a completed payout are separate actions.

## Development

Use Node.js 22 or newer and npm. There is one lockfile at the repository root.

```sh
git clone https://github.com/karisajoshua/mizaniclinic.git
cd mizaniclinic
npm ci
npm run dev
```

The client accepts `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Without overrides it uses the existing project. Use the local setup below before testing changes that write records. Never expose service-role credentials in a Vite variable.

```sh
# Docker is required for the local Supabase stack.
npm run db:start
npm run db:env:local
npm run dev
```

`npm run db:reset:local` destroys and recreates only the local database, replaying all migrations and reference-data seeds. `npm run db:types:local` regenerates TypeScript types from that local schema. See [database setup and deployment](docs/developer/database.md) for the first administrator, receipt issuance and production migration order.

## Checks

```sh
npm run check
```

This runs TypeScript, ESLint, UI regression tests, a real PostgreSQL migration/workflow suite through PGlite, the application build and the documentation build. The database suite needs no cloud credentials. It supplies only Supabase-owned auth/storage test schemas, then replays every application migration. CI runs the same checks on pull requests and main.

`npm run docs:dev` serves documentation; `npm run docs:build` builds it.

## Financial records

- Dashboard amounts use USD. Original local amounts and currencies remain on individual earnings.
- Standard and Premium commission rates and activation prices are saved under Admin → Settings. Rates apply to new transactions; earned amounts stay unchanged.
- Premium is determined by the ambassador's country capacity or the administrator's Premium override.
- Payouts progress from pending to approved to paid. Recording payment requires an external payment reference and writes an admin audit entry. The app does not transfer payout funds.
- Revenue comes from receipt amounts, recorded sales and paid consultations. Legacy receipts without recorded amounts are excluded and flagged for reconciliation.
- Motorbike and car progress comes from `team_bonuses`, using the applicable period. Existing program targets remain $400 and $2,400 when no individual target record exists.

## Deployment boundaries

Deploy the bundled branding assets before making storage private. All five shared buckets have a migration that disables public access and enforces owner/admin access. Other applications using those buckets need authenticated downloads or signed URLs; inventory their public assets first. Applying the migration and checking the live Supabase security advisor require project access.

The iris analysis prompt and health scoring are unchanged. Their clinical validity and replacement require the medical lead's decision.
