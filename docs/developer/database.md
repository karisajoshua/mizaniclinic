# Database setup and deployment

## Recreate the local database

Install Node.js 22+, Docker and repository dependencies with `npm ci`.

```sh
npm run db:start
npm run db:env:local
npm run dev
```

The local environment script writes only the local API URL and public anon key. It refuses to overwrite `.env.local`. To rebuild an existing local database, run `npm run db:reset:local`; this deletes local data. Run `npm run db:types:local` after changing schema.

The February 1 bootstrap migration restores the schema omitted from the original repository. It runs before the existing migrations and is a no-op when `public.profiles` already exists. The original migration history is retained. A partial or incompatible existing schema must be reconciled explicitly, not reset in production.

`supabase/seed.sql` seeds the six existing program countries for local development. It creates no fake financial records, receipt codes, accounts or administrator passwords.

## First administrator and sponsor

Create the administrator in Supabase Auth first. Then run the explicit bootstrap script with a trusted database connection:

```sh
psql "$DATABASE_URL" -v admin_email='your-admin@example.com' -f scripts/bootstrap-admin.sql
```

The script requires that exact Auth account, grants its admin role and creates a pending ambassador profile if absent. Existing profile values are preserved. The resulting ambassador ID can sponsor the first registrations. Activate the account through the normal receipt workflow. Do not enable public role assignment.

The registration flow derives an internal email from the supplied phone number. Its current sign-up design requires email confirmations to be disabled for these accounts; configure Auth deliberately for the target environment. No email-confirmation settings are changed by migrations.

## Issue a receipt after collecting payment

An administrator or trusted service records a unique receipt code only after the clinic receives the payment. The database snapshots the current pack price when a code is issued. Include explicit amounts for a receipt with a different original price:

```sql
INSERT INTO public.receipt_codes(code,amount_usd,amount_local,currency)
VALUES ('YOUR-UNIQUE-RECEIPT',35,87500,'TZS');
```

The ambassador submits the code to `verify_receipt_code`; only the signed-in account can claim it. A repeated submission by the same account is idempotent. A second account cannot claim it, and an activated account cannot consume another receipt. Referral earnings retain their original rates and begin pending.

Older commission records marked paid without an external reference are flagged in the payout queue for reconciliation. Their stored status is preserved.

Used historical receipts with no amount stay unvalued. The revenue report excludes them and shows the count requiring reconciliation. Staff must use original records to supply amounts; the migration does not backfill today's prices into historical revenue.

## Upgrade an existing hosted project

1. Back up the database, check deployed migration history and review the SQL diff. Do not run `db reset` against a hosted project.
2. Inspect all five shared storage buckets and applications that use them. Move intentional public assets to application hosting; this repository now includes the clinic logo and download graphic. Private consumers must use authenticated downloads or short-lived signed URLs. Files without an `owner_id` need administrator access or an explicitly reviewed owner assignment.
3. Apply the missing bootstrap-history entry (it is a no-op on the existing schema) and `20260916101215_dashboard_admin_workflows.sql`. Deploy the matching frontend so its RPCs and static assets are available together. Do not deploy the frontend against a database missing these RPCs.
4. After all shared-bucket consumers are ready, apply `20260916101218_private_storage_access.sql`. This changes the five buckets to private, removes the old broad policies and adds restrictive owner/admin boundaries. It deletes no objects. If another application still needs public assets, finish moving those assets before applying this migration.
5. Regenerate database types from the target schema, run the checks, test real sign-in/receipt activation, and verify admin settings and payout recording. Check the live Supabase advisor and confirm anonymous access to a known private object fails.

Use the Supabase CLI's migration list and dry-run facilities to inspect pending migrations before applying them. Because the bootstrap migration predates recorded history, an existing project may require `supabase db push --include-all`; inspect its dry-run first. Apply the two new workflow/storage stages separately if other storage consumers are still being updated. The repository test suite does not prove that hosted migrations have been applied.

## Regression coverage

`npm run db:test` replays every checked-in migration in PGlite PostgreSQL, then tests role checks, profile-write guards, receipt idempotency and theft protection, commission settings, amount snapshots, payout transitions and references, report totals, and storage RLS even when a legacy broad policy exists. Supabase-owned auth/storage schemas are test fixtures. Storage HTTP behavior and concurrent requests on the hosted service must also be verified during rollout.

The iris report's medical content is not changed by this deployment.
