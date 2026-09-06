# Start Ambassador ID numbering at 1001

## Goal
Ambassador IDs keep the `MAP26-<country letter><number><region code>` shape, but the number now starts at **1001** per country instead of 0001 — so the first new ambassador in Tanzania is `MAP26-T1001DSM`, then `T1002`, `T1003`, and so on.

## What will change

### 1. Database (migration)
- Rewrite `generate_ambassador_id` so the per-country counter floors at 1000: if the highest existing number for a country is below 1000, the next ID is `1001`; above that it just increments normally.
- Renumber the two existing admin accounts to match the new scheme so the root sponsor codes stay consistent:
  - `admin@mizaniclinic.com` → `MAP26-T1001DSM`
  - `tessangelika@gmail.com` → `MAP26-T1002DSM`
  (both their `ambassador_id` and `user_referral_id` fields)

### 2. App text updates
- Sample/placeholder IDs updated from `...T0001DSM` style to `...T1001DSM` style in:
  - `src/utils/eastAfricaData.ts` (test ambassador examples)
  - `src/utils/regionCodes.ts` (placeholder generator)
  - `src/pages/SignIn.tsx` and `src/components/registration/ReferralCodeField.tsx` (input placeholders/examples, if they show a sample ID)
  - `src/pages/Dashboard.tsx` (fallback code display, if present)

## Technical notes
- Migration uses `CREATE OR REPLACE FUNCTION` with `GREATEST(MAX(...), 1000) + 1` logic on the same regex scan (`^MAP26-<letter>\d{4}[A-Z]{3}$`), then an `UPDATE profiles ... SET ambassador_id, user_referral_id` for the two admin rows. No other data changes — tables were already reset.
- Existing sign-in and referral-code lookups work unchanged since they match on the full ID string, not the number.
