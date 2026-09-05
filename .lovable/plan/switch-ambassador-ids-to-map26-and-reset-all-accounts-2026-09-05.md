# Switch Ambassador IDs to MAP26 and reset all accounts

## Goal
Every ambassador code changes from the `MCA25-...` style to `MAP26-...`, all member accounts and their activity are cleared, and the two admin accounts stay so you can start fresh.

## What will change

### 1. New ID format
- The ID generator now produces `MAP26-T0001DSM` (same country letter + 4-digit number + region code, new prefix and year).
- Numbering restarts at 0001 per country since all previous accounts are removed.

### 2. Clean slate
- All accounts are deleted except `admin@mizaniclinic.com` and `tessangelika@gmail.com`.
- Cleared: profiles, referrals, earnings, ambassador stats, team bonuses, sales, notifications, iris analyses, appointments.
- All receipt codes reset to "available" (nothing marked used).
- Country counters reset to zero.

### 3. Root sponsor code
- The kept admin account gets the code `MAP26-T0001DSM` so new sign-ups have a valid sponsor code to enter.

### 4. App updates
- Sign-in accepts the new code format (`MAP26-...`) — old-format codes will no longer exist.
- Placeholders and example text on the sign-in page, referral code field, dashboard fallback, and sample data updated to the new format.

## Technical notes
- Migration rewrites `generate_ambassador_id` with the `MAP26-` prefix and updates its regex scan accordingly.
- Data reset runs as a separate statement: delete child rows first (earnings, referrals, stats, bonuses, sales, notifications, iris_analyses, appointments), then profiles, then the corresponding `auth.users` rows excluding the two admin emails; `receipt_codes` set back to `status='available'` with `used_by`/`used_at` nulled; `country_limits.current_count = 0`.
- Admin profile row is upserted with `ambassador_id` and `user_referral_id` = `MAP26-T0001DSM`, status `active`.
- Frontend edits: `src/hooks/useAuth.tsx` (regex), `src/pages/SignIn.tsx`, `src/components/registration/ReferralCodeField.tsx`, `src/pages/Dashboard.tsx`, `src/utils/regionCodes.ts`, `src/utils/eastAfricaData.ts`.
