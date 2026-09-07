# New ID format + 3-step sign-up

## 1. Ambassador ID becomes MAP-…

Drop the "26" everywhere. Numbering stays 4 digits from 1001 per country.

- Old: MAP26-T1001DSM
- New: MAP-T1001DSM

Changes:
- The ID generator builds `MAP-` codes and counts existing `MAP-` codes per country (floor still 1001).
- The two admin accounts are renumbered: admin@mizaniclinic.com to MAP-T1001DSM, tessangelika@gmail.com to MAP-T1002DSM.
- Sign-in accepts the new format (and still accepts an old MAP26 code so nobody is locked out).
- Every sample code shown in the app (sign-in box, referral code box, dashboard, demo data) is updated.

## 2. Registration in 3 steps

One question group per screen with a Next button, a Back button, and a progress bar showing "Step X of 3". Each step only advances when its fields are filled.

```text
Step 1  Name            -> Next
        Phone number

Step 2  Country         -> Back / Next
        City

Step 3  Referral code   -> Back / Complete Registration
        Password
```

The order matches your list: Name, Phone, Country, City, Referral code, Password.

## 3. No email asked

You asked to collect exactly those six things, so the sign-up screen will no longer ask for an email. Accounts still need one internally, so the system quietly creates a private one from the phone number (for example 255747100100@ambassadors.mizanihealth.app). It is never shown, and people sign in with their Ambassador ID and password as they do today.

One consequence worth knowing: without a real email there is no "forgot password" reset by mail — password resets would have to be done by an admin. Say the word if you would rather add an optional email field to keep self-service resets.

## Technical notes

- Migration: rewrite `generate_ambassador_id` with the `MAP-` prefix and matching regex `^MAP-<country><4 digits><region>$`; UPDATE the two admin rows in `profiles`.
- `register_ambassador` / `lookup_referrer` referral matching is prefix-agnostic, no change needed.
- `src/hooks/useAuth.tsx`: referral-code regex to `/^MAP(26)?-[A-Z0-9]+$/`; `signUp` receives the synthesized email.
- `src/components/registration/RegistrationForm.tsx`: add step state, per-step validation, Back/Next; split `PersonalInfoFields` into name+phone (email/password removed from it) and a new password step; reuse `LocationFields` and `ReferralCodeField`.
- `useRegistration.tsx`: derive email from phone (digits only) before `signUp`; drop the email form field.
- Text updates in `regionCodes.ts`, `eastAfricaData.ts`, `ReferralCodeField.tsx`, `SignIn.tsx`, `Dashboard.tsx`.
