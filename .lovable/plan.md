# Fix branding, registration failure, and receipt code verification

## What's wrong (verified against the live database)

1. **Browser tab / favicon label** — `index.html` still says "Mizani Clinic - Referral & Booking System".

2. **Registration doesn't complete** — the two most recent sign-ups (12:49 and 12:52 today) exist in the auth users table but have **no row in `profiles`**. Registration is done client-side in several separate steps (sign up → generate ambassador ID → insert profile → insert referral). If any step after sign-up fails, the account is left half-created: the user exists but has no ambassador ID, so signing in by Ambassador ID reports "user not registered". The current code also hides the real cause behind a generic "Failed to create user profile" message.

3. **Receipt codes "not picking"** — the `verify_receipt_code` database function marks the code used and then updates the user's profile; when no profile row exists (case 2 above) it raises "Failed to update user profile" and the whole thing rolls back. So the receipt code never applies. There are 988 available codes in the table, so the codes themselves are fine — the missing profile is the blocker.

## Fix

### 1. Branding
Update the page title, description, and Open Graph/Twitter tags in `index.html` to "Mizani Health Ambassadors" (keeps the same favicon image).

### 2. Make registration atomic and server-side
Add a `SECURITY DEFINER` database function `register_ambassador(full_name, phone, region, country, referral_code)` that, in one transaction:
- validates the referral code exists (rejects otherwise),
- generates the ambassador ID,
- inserts the `profiles` row for `auth.uid()` (idempotent — if a row already exists it fills in missing fields instead of failing),
- inserts the `referrals` tracking row,
- returns the ambassador ID.

Rewrite `useRegistration` to: sign up → call this one function → navigate to payment. Real error text from the database is shown in the toast instead of a generic message, so future failures are diagnosable.

### 3. Repair receipt verification
- Update `verify_receipt_code` to trim/uppercase-match the code and, if the profile row is missing, create it from the auth user's metadata rather than aborting.
- Return a clear message when a code is already used vs. not found.

### 4. Backfill the two stranded accounts
One-off statement to create profile rows (with ambassador IDs) for the two users registered today who have none, so they can sign in and redeem a receipt code.

## Technical notes
- All new/changed functions keep `SET search_path = public` and are granted execute to `authenticated` only.
- Existing RLS policies stay as they are; the new function runs as definer so the client never needs broader table access.
- No changes to the payment UI beyond error messaging.
