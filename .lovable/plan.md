# Fix "User already registered" when adding someone under you

## What's going wrong
Each account is tied to the new member's phone number. The error means that phone number already has an account. The records back this up. Every account has a profile, so nothing is half-created. That leaves two likely causes:
- The number was typed in a format that matches an existing account (for example, the sponsor's own number or someone who already joined).
- The same person was registered twice with the number written differently (`0624...` vs `255624...`). The records already show this happening, which means duplicates can get through in one format and be blocked in the other.

The screen just shows a vague "User already registered" message, so the sponsor can't tell what to do next.

## Changes
1. **Treat phone numbers the same way every time.** `0712...`, `+255 712...` and `255712...` all become one standard format before the account is created. The same person can't get two accounts, and the check becomes reliable.
2. **Check the number before creating the account.** If the number is already registered, show a clear message: "This phone number already has an account (MAP-T10xxDSM). Ask them to sign in, or use a different number." The member's password is never shown.
3. **Sponsor signed in on the same phone.** Before creating the new member's account, sign the sponsor out. The new member then starts with their own session instead of mixing with the sponsor's. Afterwards, show a note that the sponsor needs to sign back in.
4. **Sign-in uses the same number format**, so members who registered with `0...` can still sign in with either format.

## Technical details
- Add a `normalizePhone()` helper that strips non-digits, turns a leading `0` into `255`, and keeps a `255` prefix. Use it in `useRegistration.tsx` (internal email) and in the phone sign-in path in `useAuth`/`SignIn`.
- Add a security-definer RPC `phone_registered(p_phone text) returns text` (it returns the ambassador_id or null) that checks the normalized and legacy `0...` internal emails in `auth.users`. Grant it to anon/authenticated and call it before `signUp`.
- Map Supabase's "User already registered" error to the same friendly message as a fallback.
- Call `supabase.auth.signOut()` before `signUp` when a session exists.
- Existing accounts stay unchanged. Legacy `0...` emails are still recognised through the dual lookup.
