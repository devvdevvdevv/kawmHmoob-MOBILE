# The reading library, cut from six stories to two (2026-09-13)

Six stories went in yesterday. Four came out today. The library is now
**Tus Miv** and **Ntxawm Lub Xauv** — 2 stories, 15 questions, 15 glossary
entries.

## The measurement that made the decision

Before arguing about it, count what is actually uncertain. The author marked
their own hedges, so they can be counted:

| story | lines | hedged lines | glosses | hedged glosses |
|---|---|---|---|---|
| **Tus Miv** | 18 | **0** | 7 | **0** |
| **Ntxawm Lub Xauv** | 15 | **0** | 8 | **0** |
| Suab Soob | 16 | 0 | 10 | 0 |
| Tus Noog Pom Tus Kab | 26 | 4 | 8 | 2 |
| Xeev Xwm | 19 | 5 | 9 | 3 |
| Tus Suab | 20 | 3 | 13 | **6** |

⚠️ **Tus Suab was teaching thirteen words with six of them marked "uncertain".**
Nearly half its vocabulary, to a reader paying $7.99.

## But the real reason is form, not accuracy

Suab Soob is the useful case: **zero hedges, clean English, ten solid glosses —
and it was cut anyway.** Accuracy was never the deciding test.

**The reading module cannot do anything with a drill.** Sixteen to twenty-six
unrelated sentences have no plot, and two consequences follow that no amount of
editing fixes:

1. **There is nothing to comprehend.** The quiz can only ask trivia — "which name
   appears", "what colour is the insect". That is a property of the form. I
   rewrote Tus Suab's questions once already, from meta-questions about the
   exercise to questions about its content, and the best available result was
   still a list of isolated facts.
2. **Tap-a-line-to-reveal has no payoff.** That gesture is the entire reader, and
   it pays off because the next line depends on the last. In a drill no line
   depends on any other, so revealing one is just... a sentence.

> **The transferable rule: a reading needs a reason to read the NEXT line.** That
> is the test, and it is not the same as "is the Hmong correct".

## What makes the two keepers work

**Tus Miv** is the best thing in the library. A cat waits three hours for a mouse
that is toying with it, gives up, goes to sleep — and the mouse, celebrating in
the cat's own milk bowl, gets caught in the blink of an eye. It closes on
"paub li mas" — *I should have known*. Setup, reversal, and a last line that
lands. The author supplied the English and the notes explaining the three idioms
that carry it (`lub siab` as intention, `ua ib siab` as resolve, `xis noj` as
delicious).

**Ntxawm Lub Xauv** is a real arc too: a lost thread found, a goat deliberately
not frightened, a father saying "you have the ability to help others."

Both have zero uncertain lines and zero uncertain glosses.

## The four are not deleted, and not waste

Commented out in place with restore instructions, because **the author's English
and glossaries are the expensive part**: 41 glossary entries and 81 translated
lines, most of them supplied directly.

⚠️ **They belong in `wordFamilies.js` → `/speak/family/[id]`**, which already
drills sets of near-identical words with recording and tone scoring. "These words
differ by one letter" is the entire point of that surface, and these texts are
built on exactly that: s against t, l/s/x, h/x/n. Moving them there is a real
feature — a sound-practice module with sentence context — not a dump.

That is the follow-up worth doing, and it is why the block says *do not delete
this to tidy up*.

## Two things still unresolved from yesterday

Both now sit inside the commented block, so they are no longer urgent — but they
are still true:

- **`saj` and `hem`** appear on the author's word lists but nowhere in their
  texts. `check-reading.mjs` rejects a glossary entry whose words are absent.
- **Tus Suab's last line** disagrees between the author's two messages:
  `tus saub tid` in the original, `tus suab` in the translation pass.

## Also

`0 covers` — neither surviving story has art, and with only two stories the
library is now small enough that cover art would change how it reads more than
another story would.

---

## Appendix: the Learn module's own readings are retired too (same day)

There were **two** reading experiences in this app, and only one of them was the
reading module.

`src/data/lessons.js` carried a `readings` unit — three prose lessons
(`readingMim`, `readingGarden`, `readingSchool`) from before `app/reading/`
existed. Now commented out, along with its three imports and its entry in
`units`. The lesson files on disk are untouched.

### Why it went

The reading module replaced it and is not close: a library, per-word lookup with
a four-tier ranking, a glossary sheet, a comprehension quiz, a bookmark, and
adjustable type. The Learn unit was three passages with a reveal. **Two reading
experiences is one more than the app wants**, and the weaker one was still
sitting in the data as if it were a live feature.

### It was already invisible, which is the interesting part

- `app/(tabs)/learn.jsx` — `units.filter((u) => __DEV__ || u.id !== 'readings')`
- `app/learn/[unitId]/index.jsx` — `if (unitId === 'readings' && !__DEV__) return <Redirect/>`

Both guards stay. They now guard nothing, and that is fine: a guard against a
unit that does not exist costs nothing and catches a restore that forgets one of
them.

⚠️ **Hidden is not the same as gone.** It had been hidden behind `__DEV__` since
2026-09-08, which is long enough for anyone reading `lessons.js` to assume it was
live content. Removing the thing beats hiding it once the decision is actually
made.

### The bit that would have rotted quietly

`GlobalSearch.jsx` indexed those readings and pointed every hit at
`/learn/readings`. Also `__DEV__`-only, so **no release build was affected** —
but in a dev build, searching would have returned results leading to a unit that
no longer exists. That is how somebody later concludes search is broken.

Commented out with the unit, and its now-unused `readings` import from
`course.js` with it.

~~⚠️ **NOT a replacement for indexing the reading module.** Stories in
`src/data/stories.js` are still not searchable from GlobalSearch at all. Worth
doing, and a different job.~~

✅ **Done the same day** — `GlobalSearch.jsx` indexes `stories.js`: 2 story items
and 20 glossary items, with every line of every story in the haystack. See
`notes/2026-09-13-stories-are-searchable.md`.

### To restore

Uncomment, in this order: the three imports in `lessons.js`, the `readings` unit
below them, its line in `units`, then the import and the block in
`GlobalSearch.jsx`. Nothing else is wired.
