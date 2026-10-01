// THE DIALECT LIST — one source for all four places it appears.
//
// ⚠️ WHY THIS FILE EXISTS: the list was copied into four files, and by
// 2026-09-12 they had already drifted. `app/onboarding.jsx` offered Dananshan;
// Settings, Profile and Register offered two options and silently could not
// save the third. A learner who chose Dananshan while signing up would find the
// Settings picker showing something they never picked.
//
// ── THE THREE PLACES A DIALECT VALUE HAS TO MATCH ───────────────────────────
//
//   1. here
//   2. the web app — KawmHmoob/src/components/common/DialectSelect.jsx
//   3. ⚠️ THE DATABASE — the CHECK constraint on profiles.dialect_preference,
//      in KawmHmoob/instructions/supabase-schema.sql
//
// (3) is the one that bites. The constraint currently reads:
//
//     check (dialect_preference in ('white', 'green', 'dananshan'))
//
// If the UI offers a value the constraint rejects, the signup trigger's INSERT
// fails and Supabase reports the generic "Database error saving new user" —
// the real cause visible only in the Postgres logs. Adding a dialect means
// adding it in all three, and running the migration against the live project,
// not just editing the .sql file.
//
// ── WHY THE AVAILABILITY WARNING ────────────────────────────────────────────
// `dialectPreference` is stored and persisted, but nothing READS it yet: every
// lesson, recording and prompt in the app is White Hmong (Hmoob Dawb).
// Offering another dialect with no content behind it would silently hand that
// learner the wrong thing, so every picker says so plainly.
//
// Keep the field when the warning goes — it is also corpus metadata. A
// recording has to be labelled with its speaker's dialect, and mixing them
// silently is the specific failure this is guarding against.

export const DIALECTS = [
  // `available` drives the "not yet available" suffix, nothing else. Flip it
  // when content in that dialect actually ships.
  {
    value: 'white',
    label: 'White Hmong (Hmoob Dawb)',
    short: 'White Hmong',
    available: true,
  },
  {
    value: 'green',
    label: 'Green Hmong (Moob Leeg)',
    short: 'Green Hmong',
    available: false,
  },
  {
    // Added to the mobile app 2026-09-12 to match the web app, which has
    // offered it since the schema's three-value constraint landed. Dananshan is
    // the standard variety of Hmong in China — a different romanisation and a
    // different set of tones, which does not map onto RPA sound-for-sound. So
    // "not yet available" is doing more work here than it does for Green.
    //
    // ⚠️ AND IT IS THE BIGGEST GROUP, NOT AN EDGE CASE. Roughly 4.5 million
    // people speak the Chinese Hmong cluster — more than every other Hmong
    // community combined. This app teaches White Hmong and says so; this option
    // is what keeps that a stated scope rather than a quiet assumption about who
    // counts. See notes/2026-09-12-why-this-app-exists.md.
    value: 'dananshan',
    label: 'Dananshan Hmong (Chinese Hmong)',
    short: 'Dananshan Hmong',
    available: false,
  },
]

/** The sentence every picker shows under it. One string, so it cannot drift. */
export const DIALECT_NOTE =
  'Only White Hmong content exists today — the rest saves your preference for later.'

/**
 * Options for a <Picker>, with the unavailable ones labelled as such.
 *
 * ⚠️ The suffix is added HERE, at render time, not stored in `label`. A label
 * that carries its own caveat ends up in a database row or a quiz prompt the
 * day someone reuses it.
 */
export function dialectOptions() {
  return DIALECTS.map((d) => ({
    value: d.value,
    label: d.available ? d.label : `${d.label} — not yet available`,
  }))
}
