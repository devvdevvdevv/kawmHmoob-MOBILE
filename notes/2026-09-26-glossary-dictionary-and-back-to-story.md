# Glossary taps show the dictionary + "Back to the story" (2026-09-26)

Two author requests, built on the dictionary switch
(notes/2026-09-26-dictionary-headwords-and-sense-pins.md).

## 1. A glossary answer also shows the dictionary entry, only if it exists

"If there is a dictionary entry for a glossary when tapped, the user would be able
to see it, only if it exists."

- **Word sheet:** when the story's glossary answers a tap (it still leads, since the
  author wrote it for this text), `lookupWord` now attaches `dictionary`: the
  dictionary's entry for the **same headword** (spaced/joined spelling allowed).
  The sheet shows it under **"In the dictionary"** with its numbered definitions.
  Save and "Open in dictionary" act on it. Before, a glossary hit had no card id,
  so it couldn't be saved or opened.
- **Glossary list** (the story's Glossary button): a row with a dictionary entry
  shows **"In the dictionary ›"** and opens that word page. Rows without one are
  unchanged.
- **Same headword only.** The tapped word *inside* a glossed phrase doesn't count.
  That was the old `tus`/`tus xov` bug.
- **Coverage:** 383 of 493 glossary entries across the 6 stories have a
  dictionary entry. Names (Fong, Mai…) correctly get nothing.

Code: `withDictionary()` in `src/lib/wordLookup.js`. In `WordSheet.jsx`, `card`
(the id Save/Open use) and the "In the dictionary" section. In the reader,
the `GlossaryModal` rows.

## 2. From a story, the dictionary's "back" returns to the story

"If the user enters the dictionary from reading a story, the go back button
redirects to the story in that context."

The return-context pattern again (same as `?fromGroup=` / `?fromUnit=`):

1. **Tag the link.** The reader passes `fromStory={story.id}` to the word sheet,
   and "Open in dictionary" pushes `…?fromStory=<storyId>`. Glossary rows do the
   same.
2. **Validate.** `storyReturn(fromStory, hmong)` in `src/data/stories.js` returns
   the story only if the word is really in it (a line or the glossary, whole words,
   consecutive words may be joined). A stale or hand-typed link gets the normal
   set trail.
3. **Build "back".** On the word page (`WordDetail.jsx`) the trail is
   `Home › Reading › <Story> › <word>`, and the button is **Back to the story**.
4. **Pass it on.** "Other meanings of …" links keep `?fromStory=`.

**`router.dismissTo`, not `push`:** the reader is still open underneath, so
`dismissTo` pops back to it with the scroll position and revealed lines intact.
`push` would stack a second reader at the top. If the reader isn't in the stack,
`dismissTo` opens it.

Not done: the **path's Reading step** also has "Open in dictionary"; its word page
still says "Back to <set>". Same pattern with a `fromUnit` guard. It's exercise 5
in the lesson.

## How-to / teaching
- `learning/feature-logic/dictionary-headwords-guide.md`: the whole dictionary
  switch, taught step by step, with try-it-yourself exercises.
- `learning/concepts/navigation-return-context.md`: new "Third example" (story)
  section, `dismissTo` vs `push`, and exercises 5–6.

## Checks
Lint is clean (one pre-existing unused import in the reader). check-undefined-refs,
reading, vocabulary, sense-pins and theme all pass. **Not tested on a device.** Try:
tap a glossary word (e.g. *tos*) and see "In the dictionary". Open it, then "Back to
the story" should land where you were.
