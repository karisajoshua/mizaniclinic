## System Audit Report — What's Done vs. What's Remaining

### Module status

| Module | Verdict |
|---|---|
| Landing page (`Index.tsx`) | Complete (static marketing) |
| Auth (`useAuth`, SignIn) | Complete |
| Registration → Payment | Partial |
| Dashboard (stats, referrals, earnings) | Partial — real data + fabricated filler |
| Ambassador Tools tab | Non-functional (toast stubs) |
| Appointments (Stripe) | Partial — booking works, confirmation unverified |
| Iris Analysis + Admin Iris Reports | Complete |
| Admin panel (6 of 7 tabs) | Mock only — hardcoded data, console.log handlers |

### What is genuinely finished
- Supabase auth incl. sign-in by referral code; registration writing to `profiles` + `referrals` with server-generated ambassador IDs; receipt-code activation via `verify_receipt_code`.
- Referral/earnings/country-limit data layer (`useAmbassadorStats`, `useReferrals`, `useCountryLimits`) reading live tables.
- Referral code sharing (copy, WhatsApp, QR).
- Iris scan: camera capture, Gemini analysis edge function, save to `iris_analyses`, PDF report, and the admin Iris Reports tab (the only real admin module).
- Appointment booking against `doctor_availability` with real Stripe Checkout.

### What is NOT completed

**1. Admin panel is a shell (biggest gap)**
- Overview metrics ("1,247 users", "$89,450 revenue", "99.8% health"), alerts, pending actions: hardcoded arrays.
- Ambassador Management: 3 fake records; approve / status-change / export handlers only `console.log`.
- Financial Management: fake revenue + payout queue; "Process Payout" does nothing.
- Geographic Management: limit updates, premium toggle, add-country all `console.log` ("in production this would update the database").
- System Configuration: commission tiers, product pricing, security and notification settings never persist.
- Analytics: charts fed entirely by mock arrays; Export/Filter buttons have no handlers.

**2. Dashboard fabricated numbers**
- `ambassadorLimit: 856` hardcoded; QuickStats "+$1 today", "4/6 countries", "$250/2500 next bonus" are literals; RecentReferrals shows a flat "+$0.20" per referral.
- Tools tab: flyer download, training materials, success stories, support centre — all toast-only stubs.

**3. Payment/appointment correctness gaps**
- `confirm-appointment-payment` edge function exists but is never invoked and no Stripe webhook is configured — success is inferred from the redirect URL only, so appointments stay `pending` after real payment.
- `Payment.tsx` dereferences `user.id` on a path where `user` can be null.

**4. Dead / duplicated code**
- `SignUp.tsx` is a second registration flow that only writes to localStorage, diverging from `Register.tsx`; `ApplicationProcessing` page is orphaned (nothing routes to it); `ReferralManagement` and `EarningsBreakdown` are built but not mounted anywhere.
- `useRegistration.tsx` has a debug unfiltered `select('*')` on `profiles` and a large commented-out `ambassador_registrations` block.
- PDF/markdown rendering duplicated between `IrisReport` and `AdminIrisReports`.

**5. Security items (verified against live policies)**
- `profiles` has `SELECT using(true)` for everyone and `UPDATE using(true)` for any authenticated user — any signed-in user can read and modify every other user's profile, including `ambassador_id`, `status` and `payment_status`. This is the most serious issue found.
- `receipt_codes` allows any authenticated user to `UPDATE` and `INSERT`.
- `ambassador_stats`, `earnings`, `team_bonuses` have `ALL ... using(true)` "System can manage" policies open to `public`.
- Admin access is a hardcoded email list in `Admin.tsx` and duplicated in the `iris_analyses` policy — no `user_roles` table / `has_role()` function exists.
- `analyze-iris` runs with `verify_jwt = false`, so anyone can burn AI credits against it.

### Suggested order of work (for when you want to build)
1. Security hardening: `user_roles` + `has_role()`, lock down `profiles` / `receipt_codes` / stats tables, require JWT on `analyze-iris`.
2. Make Admin real, tab by tab (Overview → Ambassadors → Geographic → Financial → Config → Analytics).
3. Fix appointment payment confirmation (Stripe webhook → `confirm-appointment-payment`).
4. Replace fabricated dashboard numbers with real queries; implement or remove the Tools tab.
5. Clean-up: remove dead pages/components, debug queries, duplicated PDF code.

### Technical notes
Everything above is verified against the actual files and the live RLS policy set. No code changes are included in this plan — approving it only means I start on step 1 unless you tell me a different starting point.
