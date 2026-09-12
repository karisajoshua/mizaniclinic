# Fix "record new has no field referrer_id" on receipt verification

## What's happening

Receipt verification now tries to pay commissions, and that insert fires an old
database trigger that recalculates ambassador totals. That trigger was written only
for the referrals table — it looks for a "referrer_id" field, which the earnings
records don't have. So the whole verification fails and nothing is saved.

This blocks every activation, including SAMUEL MNIKO's code L4T0MP.

## The fix

Make the recalculation trigger aware of which table it was fired from: use the
sponsor field on referral rows and the ambassador field on earning rows. Nothing
else changes — commissions, referral activation and country counts stay exactly as
designed.

## After the fix

- Re-run the activation backfill that was interrupted: mark referrals active for the
  ambassadors who already paid, create their missing 35% and 10% commissions, and
  recalculate everyone's totals so "Total Earned" on the overview shows real money.
- Confirm a receipt code verifies end to end without error.

## Technical notes

- Rewrite `public.trigger_update_ambassador_stats()` to branch on `TG_TABLE_NAME`:
  `referrals` uses `NEW.referrer_id` / `OLD.referrer_id`, `earnings` uses
  `NEW.user_id` / `OLD.user_id`, then calls `calculate_ambassador_stats` on that id.
- Backfill via data statements: update `referrals` to `active` where the referred
  profile is active; insert `activation_pack` (12.25 USD) rows for each direct
  sponsor and `second_level` (3.50 USD) rows for the sponsor's sponsor, skipping any
  already recorded for that ambassador; run `calculate_ambassador_stats` for all
  profiles; refresh `country_limits.current_count`.
