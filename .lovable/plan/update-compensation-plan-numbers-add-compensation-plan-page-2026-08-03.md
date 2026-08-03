# Update Compensation Plan Numbers + Add Compensation Plan Page

## New official numbers

- Activation Pack price: **$35**
- Activation Pack sponsoring bonus: **35%** (one-time, to sponsor)
- Direct product sales commission: **25%**
- First generation (leadership) commission: **10%** — replaces the old "Second Level 15%"

## 1. Replace old percentages across the app

Old `30% / 25% / 15%` and "Second Level" wording becomes `35% / 25% / 10%` and "First Generation":

- `src/pages/Index.tsx` — hero stat cards (30/25/15 → 35/25/10, "Second Level" → "First Generation"); the "Tshs 88,000 per referral" claims replaced with the new commission language.
- `src/components/dashboard/EarningsOverview.tsx` — three commission descriptions.
- `src/components/dashboard/CommissionTierStatus.tsx` — "Standard (30%–25%–15%)" → "35% – 25% – 10%".
- `src/components/dashboard/EarningsBreakdown.tsx` — "Second Level" label → "First Generation".
- `src/components/admin/AdminAnalytics.tsx` — commission-type label.
- `src/components/admin/AdminSystemConfiguration.tsx` — tier defaults and "Second Level (%)" label; activation pack price fields $20/50,000 TZS → $35 and matching TZS.
- `src/components/MobileHeader.tsx`, `src/components/dashboard/ReferralCodeSharing.tsx`, `src/components/registration/NextStepsInfo.tsx` — earnings claims reworded to "Earn 35% on every Activation Pack".

These are display strings only; no commission-calculation logic exists in the database yet, so nothing else changes.

## 2. New Compensation Plan page

New route `/compensation` (`src/pages/CompensationPlan.tsx`, registered in `src/App.tsx`) presenting the brochure content as six on-brand sections using existing tokens and the navy/green look of the homepage:

1. Header — MIZANI HEALTH AMBASSADOR, "Helping Families Live Healthier Lives", JOIN • USE • SHARE • EARN
2. How to become an Ambassador (5 steps) + Activation Pack Bonus 35%
3. Product Sales Commission — 25% direct, 10% first generation, "no binary, no legs" simplicity note
4. Why Mizani — 8 checkmark benefits
5. Success Formula (JOIN → USE → SHARE → EARN) + Our Values
6. Your Income Opportunity summary, company details, phone/WhatsApp +255 747 100 100, tagline, and a Register CTA

## 3. Links to the page

- Add "Compensation Plan" link in `MobileHeader` navigation.
- Add a link in the homepage footer and a secondary CTA under the hero.

## Technical notes

Frontend-only change: string edits plus one new page and route. No schema, RLS, or query changes.
