# Dashboard professional clean-up

The member dashboard still has made-up figures, wrong percentages and some unprofessional wording. This plan replaces all of it with real numbers and consistent, polished text.

## What is wrong today
- **Overview cards are fake:** "+$1 today", "+3 this week", "Countries 4/6", "Next Bonus $0 USD" and "Growing globally" are fixed text, not real data.
- **Amounts are rounded to whole dollars**, so $12.25 shows as "$12". The rounding is also done in a confusing way behind the scenes.
- **Earnings tab ("5 Ways"):** motorbike and car progress use the wrong targets (1,000 / 6,000 instead of $400 / $2,400). The payment notes ("Paid after every 5 referrals", "Paid immediately") don't match how payouts actually work.
- **Team tab:** every active referral shows "+$0.20", but the real commission is $12.25. The text also says "100 max per country" even though each country has its own limit.
- **Bonuses tab:** the Premium perks list 70% and 35–75%, which are not in your compensation plan.
- **Header:** everyone is shown as "Ambassador Level 2".
- **Sharing message:** it still says "Mizani Clinic" and uses too many emojis.
- **Account safety:** a leftover fallback can show some members the admin's ID (MAP-T1001DSM) and let them in as if they had paid.
- **Missing view:** there is no view of individual commission records with their status (earned / approved / paid).

## Changes
1. **Overview: four real cards**
   - Total Earned, with the TZS amount underneath.
   - Awaiting Payment: earned and approved commissions not yet paid.
   - Paid Out.
   - Team: active members, with the pending count underneath.
   - Amounts are shown with cents, e.g. $12.25 and TZS 30,625.
2. **Overview: next step towards the motorbike:** how much is left to reach $400, with a progress bar.
3. **Earnings tab**
   - Correct percentages and targets.
   - Honest payout note: "Paid after admin approval."
   - A new "Commission history" list showing each commission's date, type, amount and status (Earned / Approved / Paid).
4. **Team tab**
   - Each active referral shows the real commission earned from them.
   - Country cards use the real limit for each country.
5. **Bonuses tab**
   - Premium status comes from the country's live count and limit. "Unlocked" shows once the limit is reached.
   - Perks text is removed until you confirm the real Premium rates.
6. **Header:** shows the member's real Ambassador ID, city and "Active Ambassador" status. It no longer uses stored browser data or the admin fallback. Members without a verified payment go to the payment screen.
7. **Wording:** "Mizani Health" everywhere, consistent headings, emojis removed from cards and the sharing message, and clear empty and loading messages.

## Question for you
- What are the real Premium tier commission rates? If you don't know yet, I'll just show "Premium unlocked" without percentages.

## Technical details
- `useAmbassadorStats` returns plain USD, including new pending, approved and paid values from `ambassador_stats`. Remove all `*2500` / `/2500` handling and use one `formatUSD`/`formatTZS` helper (rate 2,500).
- Team progress = sum of the team's non-cancelled earnings (the member plus their direct referrals), computed in the hook. This replaces the empty `team_bonuses` table.
- `useReferrals` joins earnings by `source_transaction_id = referred_id` to show each referral's commission.
- `Dashboard.tsx`: load the profile from Supabase only. Access requires `status = 'active'`. Remove the localStorage and default-account fallbacks.
- Reuse the existing `EarningsBreakdown` component with status labels in the Earnings tab.
