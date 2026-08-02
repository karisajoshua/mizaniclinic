# Phase 2: Make the Admin panel real

Replace the remaining hardcoded/mock data in the admin modules with live database data and working actions. RLS already grants admins full read/write on `profiles`, `earnings`, `country_limits`, `referrals`, and `ambassador_stats`, so no schema changes are needed.

## 1. User Management (ambassadors)

- Load real ambassadors from `profiles` joined with `ambassador_stats` (referral counts, earnings) instead of the three fake records.
- Display: full name, Ambassador ID, phone, region/country, referrals, earnings, status, join date. Email is not stored in `profiles`, so the table shows Ambassador ID + phone in place of the fake email column (email lives in auth and is not readable from the client).
- Search/status/region filters operate on the real rows; region options come from the loaded data.
- "Approve" action writes `status = 'active'` (plus `activated_at`) to the profile and refreshes the list.
- "Bulk Approve" approves all currently pending rows with a confirmation step.
- "Export Data" downloads the filtered list as CSV.
- Stats cards above the table compute from the real rows.

## 2. Payout Queue (financial)

- Replace mock payouts with pending/paid rows from `earnings`, showing the ambassador's name and Ambassador ID.
- Status filter (all/pending/paid) queries real statuses.
- Processing a payout marks the earning `paid` with `paid_date = now()` and refreshes metrics.
- "Approve All Pending" in the financial header processes every pending earning, with confirmation.
- Row download button exports that payout's details as CSV.

## 3. Geographic Management

- "Update" on a country limit writes the entered number to `country_limits.ambassador_limit`.
- Premium toggle flips `country_limits.premium_unlocked`.
- Country cards show real counts derived from `profiles` per country rather than fabricated activation/earnings figures.
- "Add New Country" opens a dialog that inserts a new `country_limits` row (code, name, limit).
- Regional analytics numbers come from real per-country aggregates.

## 4. Overview polish

- `RegionalStatusGrid`: replace the hardcoded "+12%" growth with real 30-day signup growth per country, and derive Status from capacity/active flag.
- `SystemAlerts`: generate alerts from real conditions (countries above 80% capacity, pending approvals backlog, pending payout volume) instead of the fixed four messages. Show empty state when nothing is wrong.

## Technical notes

- New hooks in `src/hooks/useAdminData.tsx`: `useAdminAmbassadors`, `useAdminPayouts`, `useAdminCountryStats`, plus mutations for approve/payout/limit updates, all via React Query with cache invalidation of `admin-metrics`.
- Components touched: `AdminAmbassadorManagement`, `AmbassadorDataTable`, `AmbassadorStatsCards`, `AmbassadorFilters`, `AdminFinancialManagement`, `PayoutQueueManagement`, `AdminGeographicManagement`, `CountryManagementCards`, `RegionalAnalytics`, `GeographicOverviewCards`, `RegionalStatusGrid`, `SystemAlerts`.
- Loading skeletons and empty states for every table/grid; toast on every mutation success/failure.
- No migrations, no changes to auth or registration flows.

## Out of scope for this plan

Phase 3 (Stripe appointment webhook), Phase 4 (ambassador dashboard mock data), Phase 5 (cleanup) remain queued.
