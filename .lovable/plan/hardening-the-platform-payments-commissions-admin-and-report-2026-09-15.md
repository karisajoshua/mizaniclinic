# Hardening the platform: payments, commissions, admin and reports

This covers ten areas you listed. It is large, so it is grouped into phases that each
leave the app working. Phases 1-3 are the money and security fixes and should go first.

## Phase 1 — Receipt codes and account security

- A receipt code can be redeemed exactly once, even if two people submit it at the same
  second. The second person gets a clear "already used" message instead of a double
  activation.
- Every redemption records who used it and when.
- Remove the "assume paid" shortcut in the app, so nobody reaches the dashboard without a
  verified code.
- Members can no longer change their own payment status, activation status or receipt
  code. Only verification or an admin can.

## Phase 2 — Commissions and payouts

- No duplicate commissions: the same activation or sale can only ever pay once.
- Commissions get three clear states: earned (pending), approved for payment, and paid.
  The dashboard shows each separately instead of treating everything as paid.
- Payout actions in the admin panel move money between those states for real.

## Phase 3 — Dashboard numbers and tiers

- Correct the bonus percentages and the team progress bars, which currently use fixed
  placeholder figures.
- Show Premium status correctly per country, based on the configured ambassador limit.
- Keep clinic revenue (activation packs and product sales) separate from ambassador
  earnings, so the admin revenue figure is no longer a mix of both.

## Phase 4 — Admin panel

- Replace the remaining sample charts and figures in analytics with real records.
- Make system settings and commission-rate changes save to the database and take effect.
- Wire up every button that currently does nothing.

## Phase 5 — Registration IDs

- Ambassador ID generation becomes collision-safe, so simultaneous sign-ups can never get
  the same ID or fail.

## Phase 6 — Appointments

- A booking is only confirmed after payment is actually verified with Stripe.
- Bookings must fall inside the doctor's published availability.
- The same slot cannot be booked twice.

## Phase 7 — Camera capture

- Fix the blank camera preview on the iris capture screen and release the camera when the
  user leaves or closes it.

## Phase 8 — Setup and code health

- Repair the dependency lockfiles so a clean install works.
- Add the missing database setup scripts so a fresh environment can be created.
- Clear the lint errors and add automated checks over the critical flows: receipt
  verification, commission creation, and booking.

## Phase 9 — Iris report claims

- The AI report currently produces health indicators and numeric scores that are not
  clinically validated. I recommend reframing the report as an educational wellness
  observation with a visible disclaimer, and removing the numeric health scores, until a
  clinician signs off on a validated scoring method. Decide this with your medical lead
  before the technical change.

## Technical notes

- Receipt atomicity: `verify_receipt_code` does a conditional `UPDATE ... WHERE
  status = 'available'` and checks the affected row count; add a unique index on
  `upper(trim(code))` and `SELECT ... FOR UPDATE` to serialise concurrent callers.
- Column-level protection on `profiles` (status, payment_status, receipt_code,
  activated_at, payment_verified_at) via a BEFORE UPDATE trigger that rejects changes
  unless `auth.role() = 'service_role'` or `has_role(auth.uid(),'admin')`.
- `earnings`: unique partial index on `(user_id, earning_type, source_transaction_id)`;
  add `status` values `pending|approved|paid` and split totals in
  `calculate_ambassador_stats` into pending/approved/paid columns.
- ID generation: advisory lock or a per-country sequence table inside
  `generate_ambassador_id` instead of MAX()+1.
- Appointments: unique index on `(doctor_name, appointment_date, appointment_time)` where
  status <> 'cancelled'; validate slot against `doctor_availability` in a trigger;
  confirmation set only by `confirm-appointment-payment` after Stripe session check.
- Camera: `getUserMedia` with `playsInline`, `muted`, await `play()`, and stop all tracks
  in the effect cleanup.
