# In-app Privacy Policy + Data Safety page (2026-08-12)

Added `app/privacy.jsx` (route `/privacy`) — a human-readable privacy policy tailored
to what Kawm Hmoob actually does, plus a "Data safety at a glance" card that mirrors
the Google Play → Data safety form answers.

## Content is accurate to the app
- Collects: account (email, username, display name, dialect) + learning progress (XP,
  streak, lessons, quiz scores, saved words/notes). No location/contacts, no ad or
  analytics trackers.
- Guests: progress stored on-device only, never uploaded.
- Backend/processor: Supabase (RLS-scoped). Not sold, not shared with advertisers.
- Microphone: framed as a future pronunciation feature; app doesn't record audio yet.
- Deletion: Account → Delete my account (matches the real feature + `delete_user` RPC).
- Encrypted in transit (HTTPS/TLS).

## Linked in-app from 3 spots
- ProfilePage (logged-in) — footer link.
- ProfilePage (guest card) — footer link.
- RegisterForm — "By creating an account you agree to our Privacy Policy" under the
  Create Account button (the consent point).

## ⚠️ Still TODO before submit
- **Fill `CONTACT_EMAIL`** in `app/privacy.jsx` (currently a placeholder).
- **Host the SAME text at a public URL** and put THAT url in the Play listing — Google
  requires a hosted privacy-policy URL; the in-app page is additional, not a
  substitute. (Keep the two in sync; update `LAST_UPDATED` on changes.)
- **Play Console → Data safety**: use the "at a glance" card as your answer key —
  Personal info (email, username) + App activity (progress); purpose = app
  functionality/account; not sold; encrypted in transit; deletion supported.

Related: [2026-08-06-launch-prep-account-readings-quiz-eas] (delete flow + RPC).
