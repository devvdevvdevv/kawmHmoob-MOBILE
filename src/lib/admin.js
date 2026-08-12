// Who can open the dev tools (/dev, /spike).
//
// ⚠️ THIS IS UI HIDING, NOT SECURITY. The list below ships inside the JS bundle,
// so anyone who unpacks the APK can read it, and `user.email` comes from the
// local profile row. That's fine for dev tools — they only expose screens, not
// data or privileged writes. If an admin screen ever performs a privileged
// ACTION, the check must move server-side (a Supabase RLS policy / an `is_admin`
// column), because a client-side check can always be bypassed.
//
// Same lesson as the quiz study-gate: the menu is a suggestion, the route guard
// is the enforcement — and neither is a security boundary. See notes/…quiz-study-gate.

export const ADMIN_EMAILS = [
  'tomatohater777@gmail.com',
  'techkage@proton.me',
  'devanlee2nd@gmail.com',
]

// Case/whitespace-insensitive — emails are stored however the user typed them.
export function isAdmin(user) {
  if (!user || user.isGuest || !user.email) return false
  return ADMIN_EMAILS.includes(user.email.trim().toLowerCase())
}
