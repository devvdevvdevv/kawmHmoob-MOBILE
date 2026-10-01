# The reading library is in search now (2026-09-13)

Search indexed the alphabet, 600 vocabulary words, grammar and everyday phrases
— and **not one of the two stories**. Typing `xauv` returned the dictionary
entry for a lock and said nothing about the story named *Ntxawm Lub Xauv*, which
is about one.

`src/components/common/GlobalSearch.jsx` now indexes `src/data/stories.js`.
**22 new items: 2 stories, 20 glossary entries.**

## Two kinds of item per story, on purpose

| kind | label | links to | haystack |
|---|---|---|---|
| `story` | Ntxawm Lub Xauv | `/reading/story/<id>` | title, English title, blurb, level, genre, **every Hmong and English line**, every glossary entry |
| `glossary` | lub xauv | the same story | that entry's Hmong + English only |

The story item is the one that did not exist before: **453 and 572 words folded
into a haystack**, so searching any word a story contains returns the story it
lives in. The dictionary could always tell you what `xauv` means. Nothing in the
app could tell you where to go read it in a sentence.

The glossary items are the precise end. The author wrote those **for that text**,
so they carry the sense the story uses — `rau` is "to, for" in Ntxawm's glossary,
not the dictionary's "to put on footwear". Same principle as rung 1 of the
lookup ladder (`learning/concepts/lookup-ranking-and-fallbacks.md`): the most
specific source is the one that wrote the gloss for this passage.

## The bug I put in and took out an hour later

The glossary haystack first read:

```js
haystack: `${g.hmong} ${g.english} ${story.title}`   // ❌
```

The title was there so `"xauv ntxawm"` could narrow to one story's glossary.
**It does not do that.** The filter is `haystack.includes(query)` — a substring
test on one joined string — so a two-word query only matches when those words
are *adjacent*. The feature was imaginary.

What it did do was real:

```
"xauv"  → 13 hits   the story + ALL TWELVE of its glossary entries
"miv"   →  9 hits   the story + eight entries that mention neither
```

Every glossary row inherited its story's title, so every one of them matched the
title. After removing it:

```
"xauv"  → 2   story: Ntxawm Lub Xauv · glossary: lub xauv
"miv"   → 1   story: Tus Miv
```

> ⚠️ **Putting a parent's name in a child's haystack makes every child match the
> parent.** It reads like added context. It is a same-answer-N-times machine.

## Verified against the real data, not by eye

`scripts/check-notes.mjs` now asserts both halves — that the loop over `stories`
exists, and that the glossary haystack is still the two-field version. The second
is there specifically because re-adding `story.title` looks like an improvement.

The index itself was run against `stories.js` before shipping, the way
`check-reading.mjs` loads it (copy to `.mjs`, import, delete):

```
stories in data: 2
search items:    22 (2 story, 20 glossary)
✅ every item has label/hint/to/haystack
"goat" → story: Ntxawm Lub Xauv, glossary: tus kas
"tag kis" → story: Ntxawm Lub Xauv
"suab soob" → 0        ← the cut drill stays cut
```

That last line matters. `stories` exports **only what is live** — the four cut
drills and the twelve seeded placeholders are commented out inside the data file,
so they cannot reach search. **There is no `ready`/`placeholder` filter in
GlobalSearch, and there should not be one**: a second list of what counts as
shipped is a second thing to forget to update. Compare `speakLessons.js`, which
does need `lessonIsReady()` because its unfinished lessons are live data.

## It does not open a hole in the paywall

Every hit links at the reader, and the reader gates itself — genre `free` flag
plus the daily quota, in `app/reading/story/[storyId]/index.jsx`:

```js
const quotaApplies = !storyGenre?.free && !isPro
```

**Search finds; the reader decides.** Both live stories sit on the free
*Everyday life* shelf today, so nothing is gated in practice — but when a Horror
story lands, its search hit needs no new code to be safe.

## One row change came with it

A glossary hint is a sentence — *"Ntxawm — the girl in this story"* — where every
existing hint was one or two English words. The result row squeezed the label.
The hint now gets `flexShrink: 1`, right alignment and `numberOfLines={2}`; the
label gets `flexShrink: 0` and a 12px gutter, so it never collapses.

## Not done

- **No search box on the reading library itself** (`app/reading/index.jsx`). With
  two stories, browsing is faster than typing. Worth adding at ~10.
- **Genre and level are in the haystack but there is no way to see that** — a
  learner will not guess that typing `beginner` filters stories. A real filter
  UI is the answer, not a hidden keyword.
- **Comprehension questions are not indexed.** Deliberate: finding a story by its
  quiz answer spoils the quiz.
