# Speak UI → Natulang-style module cards (2026-08-06)

Reworked the Speak hub from a wall of individual phrase buttons into a list of
**lesson cards** (one per group), each opening a module drill. Sets up the plan to
add ~50 Natulang-style lessons without the hub becoming an unusable scroll.

## What changed

- **Hub** (`app/(tabs)/speak.jsx`) — the `speakGroups.map` no longer renders every
  phrase. Each group is now ONE card: title, one-line description, a mini progress
  bar (`practicedInGroup/count`), a Start→/✓, and a ◆ Pro badge when the group
  holds Pro phrases. This is what "condense the 8 tones into one button" means —
  the Eight Tones is a single card now.
- **New module drill** — `app/speak/group/[groupId].jsx`. Steps through one group's
  phrases with an internal index + progress bar + Back/Next, handing each to the
  existing `PronounceStep` (mic + pitch scoring). Mirrors the word-family drill
  (`app/speak/family/[familyId].jsx`). Pro-locked phrases show an "Unlock with Pro"
  → `/paywall` card instead of the recorder.
- **Helper** — `getSpeakGroup(groupId)` added to `src/data/speak.js`.
- Removed now-unused `isPhraseGuestAllowed` / `useAuth` imports from the hub.

## Tones are permanently free

`toneSpeakGroup` in `src/data/speak.js` now has **`free: true`**, meaning: never
Pro-locked AND exempt from the daily speak-practice quota. There's a comment that
every quota/lock check must skip a `free` group. This is the "8 tones must be free"
requirement made durable at the data level. See [2026-08-06-daily-quota-and-signifier].

## Scales to 50 lessons

Adding lesson #4…#50 = append a group to `speakGroups`. Hub renders one more card,
the drill screen handles it automatically — no per-lesson UI. The old design would
have listed hundreds of phrase buttons. (Data schema for ordering/SRS across 50
lessons is still TODO — the flat `speakGroups` will want structure before then.)

## Untouched on purpose

`/speak/[phraseId]` single-phrase route still exists — used by the "Say this today"
daily card.
