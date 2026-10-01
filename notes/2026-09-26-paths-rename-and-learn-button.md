# "Beginner path" → "Paths", and a Paths button at the top of Learn (2026-09-26)

**The author:** rename "Beginner Paths" to "Paths"; don't say "beginner path"; put
a direct **Paths** button at the very top of the Learn tab so users can reach
every path. The new /path header is **"Learning Paths"**, with the subtitle
*"Understand the Hmong language structure, and expand your vocabulary in
structured paths"*, and **"X of Y done" in colour**.

## Changes (every old string is kept in a `Was:` comment)

| where | was | now |
|---|---|---|
| `app/path/index.jsx` header | eyebrow "Beginner path", title "Your course", "One unit at a time. Each has five short steps — finish one to open the next. 2 of 19 done." | title **Learning Paths**, the author's subtitle, and **"{done} of {total} done"** on its own line in `text-clay-700 font-semibold` |
| `app/(tabs)/learn.jsx`, **top** | *(nothing; the only link to /path was a footer card)* | a **Paths** card above the "One step at a time" masthead: award icon, "Every path, in order — structure first, then vocabulary.", and a coloured "{done} of {total} done". It links to `/path` |
| `app/(tabs)/learn.jsx`, footer | "The whole beginner path" | **"All paths"** (kept: some units, like Family and Food, appear in no Learn chapter) |
| Home quick link (`app/(tabs)/index.jsx`) | "Beginner path" / "The course, one unit at a time." | **"Paths"** / "Grammar first, then vocabulary — one unit at a time." |
| `ContinueCard.jsx` (everything-done state) | eyebrow "Beginner path" | **"Paths"** |
| `pageInfo.js` `/path` slide 1 | "Your path" / "The beginner course, …" | **"Paths"** / "Learning paths, one unit at a time. …" |
| Breadcrumbs (unit, flashcards, reading, lesson-from-path, sentence builder, typing, quiz) | "Path" | **"Paths"** |

- **The old "five short steps" claim is gone with the old line.** It had been
  untrue since the Tones step was switched off (4 steps).
- **Code comments still say "beginner path"** in places. They describe the
  history and aren't shown to users.
- **Unchanged:** the story reader's "BEGINNER" is a story's reading level, not
  the path.

## Checks
Lint is clean on the changed files; the one warning is the pre-existing unused
`Footer` import on Home. Refs, notes, theme and path checks pass. **Not seen on a
device.**
