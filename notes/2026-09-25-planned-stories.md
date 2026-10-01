# Planned stories — two more true crime, one about the Hmong bobtail dog (2026-09-25)

**The author:** "I'm gonna write some stories, and implement them into the app. 2
more true crime stories, one about the Hmong bobtail dog, and that's it."

**Status: planned. The author is writing them.** This note is the checklist for
putting each one into the app. Nothing here is built.

## The three stories

| # | story | shelf (`genre`) | notes |
|---|---|---|---|
| 1 | True crime #2 | `true crime` | mature; needs a `warning` (see below) |
| 2 | True crime #3 | `true crime` | same |
| 3 | The Hmong bobtail dog | suggest `society` (culture) or `life` | a real breed from the northern Vietnam highlands; not a warning story |

**Bobtail dog, a data rule to remember:** dog is **`aub`** in this app. That is
the author's ruling from 2026-09-21, and `dev` was removed from every teaching
sentence. A likely title shape is *aub Hmoob tw luv* ("Hmong short-tail dog").
Check the name with a fluent speaker; don't take it from this note.

After these three there will be **8 live stories**: Ntxawm, Tus Miv, Zong Vang,
the two Society stories, and these three.

---

## Checklist — adding one story

Full build guide: `learning/reading/01-the-library-guide.md`. The rule at the top
of `src/data/stories.js` still holds: **adding a story touches that file and
nothing else.**

**1. The object.** Add it to `stories` in `src/data/stories.js`:

```js
{
  id: 'story-<slug>',            // permanent — progress keys on it (storyStepId)
  title: '<Hmong title>',
  english: '<English title>',
  genre: 'true crime',           // must match an id in GENRES
  level: 'beginner' | 'intermediate' | 'advanced',
  minutes: 8,
  blurb: '<one line — for true crime, the warning goes here too>',
  warning: { title, body, includes: [ … ] },   // true crime only; omit = no gate
  paragraphs: [ [ { hmong, english }, … ], … ],
  glossary: [ { hmong, english }, … ],
  questions: [ { id, prompt, options, answer, because }, … ],
}
```

- **Put it at the right level of the array.** On 2026-09-24 a whole story was
  found pasted *inside another story's `questions`*. `check-reading` catches it
  as "no prompt / needs at least 2 options".
- **Question `id`s must be unique across the app** (`q-<short>-1`…).
  **Options in English** is the house rule, so no invented Hmong distractors.

**2. The glossary.**
- **Names, places and English loans go here and never in vocabulary.js.**
  vocabulary.js feeds quizzes and SRS, and a learner must never be quizzed on
  "what does <name> mean?".
- **A word whose general meaning is wrong in this text** also goes here. The
  story's glossary outranks the dictionary (tier 1). An example is
  Ntxawm's `rau`.
- **List each word once.** A second entry is unreachable, and `check-reading`
  flags it.

**3. Hmong rules this app has already been burned on.** Each is in the memory
notes:
- Age: **`muaj <n> xyoos`**, even in lists where English drops the verb.
- Roads: **`txoj kev <name>`**. Watch for `kev` doubling.
- Places: **`Lub Nroog <city>`, `Xeev <state>`**, but not inside an institution's
  name.
- **`tsis txhob`**, never `txhob tsis`.
- `mov` is food in general, not only rice. Read an entry's example before
  trusting its gloss.
- No stray apostrophes. RPA uses none. The Tus Miv story had several.

**4. True crime, specifically** (lessons from Zong Vang, `notes/2026-09-13-zong-vang.md`):
- **`warning`:** list what is actually in the text. If the text grows, the
  warning grows with it. "A content warning that describes an earlier draft is
  worse than none."
- **Living people:** anything that can go stale (where someone is imprisoned,
  their age now) needs an **as-of anchor in the Hmong** ("raws li … xyoo 2026").
  It also needs a **"re-check before every release"** line in
  `notes/TODO.md`, like the Zong Vang one.
- **Minors who were never charged:** initials only (Jeffrey P., Amanda G.). This
  was deliberate in Zong Vang.
- **Facts must come from the record**, and the story says where. The English
  lines are what a reader will quote.

**5. After writing, run these and fix what they say:**
```
node scripts/check-reading.mjs        # shape, duplicates, questions
node scripts/check-theme.mjs          # e.g. a genre cover class that doesn't exist
```
Then run a **word-by-word scan**, the one done on 2026-09-25
(`notes/2026-09-25-story-vocab-scan.md`). Every token that returns "no entry
yet" becomes either a glossary line (names, story-specific senses) or a
dictionary word (general vocabulary). Tap-to-define and long-press then work
automatically: the story reader and the shared WordSheet read the glossary and
dictionary with no extra wiring.

**6. A native speaker reads it before it ships.** Every check here is the
floor, not the ceiling. `choj` once shipped as "the Wisconsin Constitution"
through four green checks; it means *bridge*.

**7. Publishing remotely (optional):**
```
node scripts/export-stories.mjs
node scripts/publish-story.mjs story-<slug> --dry
node scripts/publish-story.mjs story-<slug>
```
`publish-story` refuses to upload if the sweep fails. It deliberately has no
`--force`. It uses the service-role key from your shell, never an
`EXPO_PUBLIC_` one.

## Access

Reading is **free** for every shelf, `free: true` on each genre since
2026-09-15. The new stories inherit that. A story about the Hmong bobtail dog
is a natural free showcase.
