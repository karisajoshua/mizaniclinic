# Make commissions real and fix the tier progress bar

## What's wrong today

Two confirmed problems:

1. **No commissions are ever created.** The earnings table is completely empty even though 9 people have joined through referral codes. When someone verifies their receipt code and becomes active, nothing pays their sponsor. All 9 referrals are also still marked "pending" — activation never updates them.
2. **The "856/1000" number is invented.** It is a fixed number typed into the code, not real data. Same for the country counts on the dashboard, which never move off zero because activation doesn't update them either.

## What will change

### Commissions paid automatically on activation

When an ambassador verifies their receipt code (pays the $35 activation pack):

- Their referral is marked **active**
- Their sponsor earns **35% = $12.25**
- The sponsor's own sponsor earns **10% = $3.50** (first generation)
- The country's ambassador count goes up by one

Earnings are recorded with the right type (activation pack / first generation) so the dashboard breakdown, the admin payout queue and the totals all show real figures.

### Direct sales 25%

Product sales already have a table but nothing writes commissions. A sale recorded for an ambassador will pay them **25%** of the sale value, and **10%** to their sponsor as first generation.

### Tier progress bar shows real data

"Commission Tier Status" will show the live count of active ambassadors in the user's own country against the limit set in the admin panel (currently 100), e.g. "Tanzania Ambassadors: 3/100", with the bar matching. The country breakdown on the dashboard will also use real counts instead of zeros.

### Backfill

The 9 people who already joined are still pending — they have not paid, so no commissions are owed. Their referrals stay pending; nothing is back-paid. Counts will be recalculated from the real data.

## Technical notes

- Extend `verify_receipt_code` to: set the referral row to `active` with `activated_date`, insert an `earnings` row of type `activation_pack` (35% of 35 USD) for the direct referrer, insert an `earnings` row of type `second_level` (10% of 35 USD) for the referrer's referrer, and increment `country_limits.current_count`. Amounts stored in USD with the local equivalent at the 2500 TZS rate. Existing `ambassador_stats` triggers then recompute totals automatically.
- Add an `AFTER INSERT` trigger on `sales` creating `direct_sales` (25%) and `second_level` (10%) earnings rows.
- Recalculate `country_limits.current_count` from active profiles per country and keep it in sync.
- `src/hooks/useAmbassadorStats.tsx`: replace the hardcoded `ambassadorLimit: 856` with a real query against `country_limits` for the user's country (returning both count and limit), and derive `referralsByCountry` from the actual referral rows using full country names rather than the two-letter codes it currently switches on (which never match).
- `src/types/dashboard.ts`: add the country limit alongside the count.
- `src/components/dashboard/CommissionTierStatus.tsx`: render the live count/limit pair instead of the fixed "/1,000" text.
