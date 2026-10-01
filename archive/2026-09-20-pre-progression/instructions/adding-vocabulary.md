# Adding Vocabulary (React Native app)

All vocabulary lives in `src/data/vocabulary.js` — the file `vocabulary.js` line 2
points at. Edit by hand; no build step or migration. Save and Metro hot-reloads.

Adapted from the web app's `instructions/adding-vocabulary.md`. **The schema is the
same; AUDIO is where the two diverge** — see below.

Current state (2026-09-20): **1,351 words across 77 categories.** Target ~1,500.

⚠️ The 2026-09-20 batches added 467 words with NO `exampleSentence` and NO audio.
Both coverage numbers went DOWN — see notes/2026-09-20-vocab-batch-import.md.

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

---

## ⚠️ Gloss punctuation: `;` vs ` · `

The two separators in `english` mean different things, and `check-vocabulary.mjs`
enforces the difference.

| you write | it means | example |
|---|---|---|
| `;` | **synonyms of one sense** — one answer, spelled several ways | `'big; large'` |
| ` · ` | **distinct senses** — different meanings | `'four · hair'` |

A ` · ` gloss on any category except `misc` / `misc-phrases` **must** declare a
tagged `senses` array (see `src/lib/senses.js`), so the flashcard shows only the
sense its own deck asked about and the reader's long-press still gets the rest:

```js
english: 'garden; enclosed property',        // what the agriculture card shows
senses: [
  { en: 'garden; enclosed property', context: 'agriculture-foodstuffs' },
  { en: 'kingdom', context: 'reading', note: 'of a realm or domain' },
]
```

A `;` stack needs no `senses` array. `'he; she; it'` on a pronouns card is right.

**The test:** would a flashcard in *this* category accept either half as correct?
Yes → `;`. No → ` · ` plus the `senses` array.

> ⚠️ This rule was unwritten until 2026-09-20, when a 472-word import that used
> `;` correctly throughout was misread as 142 hidden defects. See
> `notes/2026-09-20-vocab-batch-import.md`.

---

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

- [ ] `id` unique, `<categoryId>-<english-slug>`, and it MATCHES the headword
      (a batch shipped `bot-tauv-nroj` holding `tauj nroj`; ids cannot be
      changed later without moving saved progress)
- [ ] The headword is Hmong, all of it — no English token left in (`nplej barley`
      shipped as a real entry and its card rewarded answering "barley")
- [ ] `;` for synonyms, ` · ` + `senses` for distinct senses (see above)
- [ ] No other entry in the same category has the SAME `english` — two identical
      glosses are two right answers on one card
- [ ] `node scripts/check-vocabulary.mjs` passes
- [ ] `hmongRPA` (White Hmong form), `english`, `category`, `tags` all present
- [ ] `category` matches the parent category's `id`
- [ ] `exampleSentence` written (don't add to the 187-word backlog)
- [ ] `audioFile` path set, file dropped in `assets/audio/`, **and**
      `node scripts/generate-audio-map.js` run
- [ ] Dictionary entry: definition + usage + example + audio

---

## ⚠️ Before adding a word: three kinds of duplicate that do not look like duplicates

All three were found on 2026-09-20, after an import put them next to each other.
See `notes/2026-09-20-vocab-batch-import.md` §9.1.

**1. Spacing.** `tiam sis` and `tiamsis` are the same word; only one is right.
(A one-character typo hides the same way: `plab jlaub` for `plab hlaub`.)
Check with spaces removed, not as written:

```
grep -o "hmongRPA: '[^']*'" src/data/vocabulary.js | tr -d " " | sort | uniq -d
```

⚠️ Solid is NOT automatically correct. `Teb Chaws Meskas` is right and
`Tebchaws Meskas` is the variant, because `teb` and `chaws` are each words. The
test is **whether the parts are words on their own.**

**2. A classifier is not a variant.** `lub tsheb` and `tsheb` are both worth
having — the classifier is grammatically required in most contexts and this app
teaches that. Do not dedupe these on sight. Drop one only when a catch-all copy
adds no sense and no usage example.

**3. The catch-alls hold copies of real entries.** `misc*` and `reading-*` are
filled from story text, so a word already taught in a deck arrives there again.
Before adding to a reading group, check whether a topical category has it —
and before dropping the copy, check whether it carries an extra sense.

## Where a new word goes

77 categories. Topical decks ask a question and are browsed; the 13 `reading-*`
groups are the reader's dictionary and are not decks. A word that a learner would
study goes in a topical category. A word that only turns up in a story goes in a
reading group.

⚠️ A `reading-*` category must be registered in THREE places or it misbehaves
silently: the `'reading'` domain in `src/lib/senses.js`, `NOT_TOPICAL` in
`scripts/check-vocabulary.mjs`, and a theme in `CATEGORY_THEMES`.
