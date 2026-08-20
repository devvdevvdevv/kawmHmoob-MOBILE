# Adding Vocabulary (React Native app)

All vocabulary lives in `src/data/vocabulary.js` — the file `vocabulary.js` line 2
points at. Edit by hand; no build step or migration. Save and Metro hot-reloads.

Adapted from the web app's `instructions/adding-vocabulary.md`. **The schema is the
same; AUDIO is where the two diverge** — see below.

Current state (2026-08-18): **479 words across 38 categories.** Target ~1,500.

---

## Schema

```js
{
  id: 'animals-dog',          // REQUIRED — globally unique. `<categoryId>-<english-slug>`
  hmongRPA: 'aub',            // REQUIRED — Romanized Popular Alphabet. NOT `hmong`.
  english: 'dog',             // REQUIRED
  category: 'animals',        // REQUIRED — must match the parent category's id
  tags: ['mammal', 'pet'],    // REQUIRED — empty array if none

  whiteHmong: 'aub',          // optional — White Hmong spelling (the DEFAULT dialect)
  greenHmong: 'dev',          // optional — Green/Mong Leng spelling
  audioFile: null,            // optional — see Audio below. Path, not bare filename.
  exampleSentence: { hmong: 'Kuv tus aub hu ua Pearl.', english: 'My dog is named Pearl.' },
  image: 'animals-dog.jpg',   // optional, not rendered anywhere yet
}
```

⚠️ **The word key is `hmongRPA`, not `hmong`.** `hmong` is the key *inside*
`exampleSentence`. Grepping for `hmong:` counts sentences, not words.

⚠️ **No runtime validation.** A misspelled field renders as `undefined` rather than
erroring. Case-sensitive: `hmongRPA`, not `hmongRpa`.

**Default dialect is White Hmong** (decided 2026-08-18) — `hmongRPA` should carry the
White Hmong form. Use `greenHmong` only when the Green form actually differs.

---

## Workflow

1. Open `src/data/vocabulary.js`.
2. Find the right `categories[]` entry (or add one — below).
3. Append a word object to its `words: [...]` array.
4. `id` convention: `<categoryId>-<english-keyword>`, hyphenated
   (`family-older-brother`).
5. Save.

### Adding a new category

```js
{
  id: 'colors',
  title: 'Colors',
  description: 'Colors of objects.',
  emoji: '🎨',
  words: [],
}
```

Appears immediately with an empty-state card until you fill in `words`.

---

## Audio — DIFFERENT from the web app

The web app serves audio from `public/`. **The native app BUNDLES it**, because Metro
requires literal `require()` strings — it cannot build a path at runtime.

`audioFile` holds a **path relative to the audio root**, not a bare filename:

```js
audioFile: 'grammar/classifiers/hmong-classifiers-tus.mp3'
```

### Adding a new clip — three steps, and step 3 is the one people forget

1. Drop the `.mp3` under `assets/audio/…` mirroring the web tree.
2. Set `audioFile` to its path in the word object.
3. **Regenerate the map:**
   ```
   node scripts/generate-audio-map.js
   ```
   This rewrites `src/lib/audioMap.js` (AUTO-GENERATED — never edit by hand). Skip it
   and the clip silently won't play: `resolveAudioSrc` returns null for unmapped
   paths, which is a deliberate no-op, not an error.

An unmapped path can still stream if `EXPO_PUBLIC_AUDIO_BASE_URL` is set. Unset, it's
just silent. See `src/lib/audioBase.js`.

### Coverage gap (2026-08-18)

- **291 of 479 words have `audioFile: null`** (61% silent)
- **187 of 479 have no `exampleSentence`** (39%)

Every word added without audio grows the recording backlog. Audio is the only part of
the content pipeline that can't be done at a keyboard — batch the recording sessions.

---

## Bulk import

For a large batch, export a spreadsheet to CSV and convert with a small Node script:

```
csv columns: category,id,hmongRPA,english,whiteHmong,greenHmong,tags,audioFile
```

No such script exists yet — write one when the batch justifies it. Follow the pattern
in `scripts/generate-audio-map.js`.

---

## Checklist for a new word

- [ ] `id` unique, `<categoryId>-<english-slug>`
- [ ] `hmongRPA` (White Hmong form), `english`, `category`, `tags` all present
- [ ] `category` matches the parent category's `id`
- [ ] `exampleSentence` written (don't add to the 187-word backlog)
- [ ] `audioFile` path set, file dropped in `assets/audio/`, **and**
      `node scripts/generate-audio-map.js` run
- [ ] Dictionary entry: definition + usage + example + audio
