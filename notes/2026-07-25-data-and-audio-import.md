# Importing the full curriculum data + wiring audio (2026-07-25)

Follows the design-system alignment (`2026-07-25-design-system-alignment.md`).
Aligns the RN app's **content** to the canonical web repo
(`KawmHmoob/Hmong-Language-App`, same commit `887dfd4`), and wires **audio** for
native. The web repo's `src/data/` is the source of truth.

Two independent jobs:
- **Data import** — sync the data files that had drifted (below).
- **Audio** — the data references clips by web URL path; native needs a remote
  host + a prefix step (below). Delivery method chosen by the user: **remote URL**.

---

## Part 1 — Data import

### What was stale, and what changed

| File | Before (RN) | After (from web repo) |
|---|---|---|
| `src/data/lessons.js` + `src/data/lessons/` | a **stub**: 1 unit, 1 lesson (Pronouns), ~4 steps | **26 lesson files + an assembler**: 5 units, ~114 steps |
| `src/data/vocabulary.js` | 391 words / 28 categories | **460 words / 41 categories** |
| `src/data/quizzes.js` | 6 quizzes | 7 (adds `alphabet-double-consonants`) |
| `src/data/toneDrill.js` | tone names **hardcoded** | tone names **derived** from `reference.js` (see below) |

`reference.js`, `speak.js`, `wordFamilies.js`, `access.js`, `daily.js`,
`leveling.js`, `leaderboard.js`, `battlepass.js` were already imported in earlier
passes.

### The lessons restructure (the big one)

The web app split the old monolithic `lessons.js` into **`src/data/lessons/`**
— one file per lesson (`pronouns.js`, `consonants.js`, `vowels.js`, `tones.js`,
`action-verbs.js`, `adjectives.js`, `readings-*`, …) — plus a thin
**`lessons.js` assembler** that imports each lesson and composes the Units.

- The assembler still exports the **same API** the RN screens already used:
  `units`, `getUnit`, `getLesson`, `allStepIds`, `lessonProgress`. So the Learn
  hub, Unit page, and lesson player kept working with zero import changes.
- Each lesson file imports only from `../reference.js` (`singleVowels`,
  `doubleVowels`, `tones`) — already present in RN. No other cross-imports, and
  Metro resolves the extension-less `./lessons/foo` imports fine.
- Units now use **groups** (Foundations is split into word-structure →
  consonants → vowels → tones). The Unit page already had a `groups` branch, so
  this renders correctly.

### `toneDrill.js` — why the web version is better

The old RN file **hardcoded** each word's tone name. The web version imports
`tones` from `reference.js` and **derives** the name from the word's final RPA
letter (`b j v s g m d`, or none = mid) via a new `toneOf(word)` helper — so a
tone rename in `reference.js` can't leave the drill out of sync. It still exports
the same `toneDrillWords` array `quizzes.js` consumes, so it's a drop-in upgrade.

### New lesson STEP KINDS the renderer had to learn

This was the one part that wasn't pure data. The old RN lesson player
(`app/learn/[unitId]/[lessonId].jsx`) rendered only `intro / examples /
practice / mini-quiz`. The imported curriculum also uses **five more** kinds;
without renderers those steps show blank. All five are now ported, faithful to
the web `Lesson.jsx`:

- **`letters`** `{ title, intro, items }` — a grid of consonants/vowels (`items`
  come from `reference.js`), each with an audio button. New `LetterGrid` helper.
- **`tones`** `{ title, intro, items }` — the tone rows (marker / name /
  description / audio). New `ToneRows` helper.
- **`reading`** `{ title, level, intro, hmong, english, glossary[] }` — a
  passage. The English translation starts **hidden** behind a "Reveal
  translation" button (so the eye attempts the Hmong first); the glossary stays
  visible.
- **`speak-drill`** `{ title, familyId, blurb }` — a card that hands off to the
  Speak word-family practice (`/speak/family/{familyId}`), via `getWordFamily`.
- **`quiz`** `{ title }` — the **study→quiz flow** (see next). Distinct from
  `mini-quiz` (which points at an explicit `step.quizId`).

Icons are emoji (🎤 🔒 ✓) since RN has no icon module; `LetterGrid`/`ToneRows`
are small inline components (the web pulls these from `components/reference/`).

### The study→quiz flow (`quiz` kind)

Ported the web's gating exactly:

1. On the **examples** step of a lesson that has a `vocab` category, a
   `StudyHandoff` block renders: *"Study the N words →"*. Tapping it calls
   `markStepComplete(studiedFlag(lesson))` — a synthetic completed-steps entry
   `"<lessonId>-studied"` that is NOT a real step (so it doesn't affect lesson
   completion) — then navigates to `/vocabulary/{vocab}`.
2. The **quiz** step is **locked** until that studied flag exists: it shows
   "🔒 Study the words first" with the same study button.
3. Once studied, it unlocks: links to `/quiz/vocab-{category.id}` (the same quiz
   the Words section uses) and, after a score exists, a "Finish lesson" link.
4. The player's auto-complete effect now derives the quiz id for BOTH kinds:
   `mini-quiz` → `step.quizId`; `quiz` → `vocab-{lesson.vocab}`. Taking the quiz
   on its own page auto-completes the step.

The shared Back/Continue bar is hidden for the self-driven kinds:
`practice`, `mini-quiz`, and `quiz`.

---

## Part 2 — Audio (remote URL)

### The problem

315 mp3s (~11MB) live in the web repo's `public/assets/audio/`. The data (in
`reference.js`, `speak.js`, `wordFamilies.js`) references ~80 of them by **web
path**, e.g. `/assets/audio/vowels/double-vowels/hmong-double-vowels-aa.mp3`.
Those paths resolve on the web (served from `public/`) but are meaningless in a
native bundle — so audio was a silent no-op.

### The chosen design: prefix a remote base URL

Nothing is bundled. At play time we prefix the stored path with a configured
host and let `expo-av` stream it. New file **`src/lib/audioBase.js`**:

```js
export const AUDIO_BASE_URL = (process.env.EXPO_PUBLIC_AUDIO_BASE_URL || '').replace(/\/$/, '')

export function resolveAudioSrc(src) {
  if (!src) return null                       // no clip
  if (typeof src !== 'string') return src      // a require()'d local asset
  if (/^https?:\/\//i.test(src)) return src    // already absolute
  if (!AUDIO_BASE_URL) return null             // host not configured → no-op
  return AUDIO_BASE_URL + (src.startsWith('/') ? src : '/' + src)
}
```

Wiring:
- **`useAudio.play`** runs its `src` through `resolveAudioSrc` before handing a
  `{ uri }` to `expo-av`. If it resolves to `null` (no clip, or path with no host
  set) it's a graceful no-op with a dev warning.
- **`AudioButton`** computes `enabled = Boolean(resolveAudioSrc(audioSrc))`, so a
  button is only "lit" (and tappable) when the clip is actually playable.

### What YOU need to do to turn audio on

1. **Host the audio.** Put the web repo's `public/assets/audio/` tree on a host
   that serves it over https — a CDN, Supabase Storage, GitHub Pages, S3, or the
   deployed web app itself. The `/assets/audio/...` path structure must be
   preserved so the full URL resolves.
2. **Point the app at it.** Set an env var the app reads at build time:
   ```
   EXPO_PUBLIC_AUDIO_BASE_URL=https://your-host.example.com
   ```
   (Expo inlines `EXPO_PUBLIC_*` vars. Put it in a `.env` file at the project
   root, or your EAS/build env.) Example resolved URL:
   `https://your-host.example.com/assets/audio/vowels/double-vowels/hmong-double-vowels-aa.mp3`
3. Restart the bundler. Audio buttons across Speak, the alphabet, and the new
   `letters`/`tones`/`examples` lesson steps will light up and play.

Until step 2, everything still runs — audio is just inert.

---

## Verify

```bash
npx expo start --clear --port 8214
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:8214/node_modules/expo-router/entry.bundle?platform=web&dev=true"   # 200
# lesson with new step kinds:
#   /learn/foundations/foundations-double-vowels   (letters + speak-drill)
#   /learn/foundations/foundations-tones           (tones)
#   readings unit lessons                           (reading)
```

Last verified 2026-07-25: web bundle 200 with no data/lessons resolution errors
(bundle grew ~0.16MB from the added content). New lesson step kinds render.
Device/Expo Go pass still recommended — and audio needs a host set (Part 2).

## Watch out
- The `quiz` step needs the lesson to declare `vocab: '<category-id>'` and that
  category to exist in `vocabulary.js`; otherwise it shows a "no word set yet"
  fallback.
- Don't run `npm audit fix --force` (see `notes/2026-07-22-boot-fix.md`).
