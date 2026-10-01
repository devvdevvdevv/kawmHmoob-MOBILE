# 18 lesson skeletons, and the checklist that makes them useful (2026-09-12)

The course went from **3 written lessons + 7 placeholder shells** to **21 lessons
across 7 categories, 576 steps**. Eighteen of them are skeletons: real structure,
the author's own Hmong, draft English, and **no audio at all**.

```
 1. greetings            26 steps  100% audio   FREE
 2. farewells            28 steps  100% audio   FREE
 3. politeness           40 steps  100% audio   FREE
 4-21.  the 18 new ones  ~26 steps each, silent
```

## Why write a lesson before its recordings exist

A `ph()` shell rendered one card saying "this lesson has not been written yet."
It told a learner nothing and — the part that matters — **it told the author
nothing either**. There was no way to know what to record next except by
re-reading a list in a chat window.

A skeleton is different: `node scripts/audio-todo.mjs --write` now emits
**184 clips**, deduped by phrase, grouped by lesson, each with the exact path its
file should land at. That checklist **is** the recording script for the next
session, and it regenerates itself every time the lesson data changes.

That is the whole argument for doing this now rather than after the microphone
comes out.

## The shape, and the one notch it falls short

Each SET teaches its new words (`hear` → `say`), then the phrase they build
(`hear` → `say`). The lesson closes with a recall block over the **phrases**.

⚠️ **The finished lessons also recall each WORD before its phrase, and these do
not.** Doing it here would push several past 50 steps. It is deliberately left
for the pass that splits these into lesson-sized pieces — the recall block is
where the learning happens, so this is a real shortfall, not a style choice.

## Everything here is unreviewed, and that is the headline

The Hmong is the author's list copied verbatim. **The English is drafted from the
word annotations beside it** — not from a recording, not by a fluent speaker.

This is the same exposure that produced the txuas/txaus mis-take the day before
(see `2026-09-12-lesson-audio-wired.md`): every structural check passes, the
lesson renders, and only someone who speaks Hmong can see what is wrong.

### Spellings normalised — each on the authority of `vocabulary.js`, not taste

| author wrote | emitted as | precedent |
|---|---|---|
| `Licas` | `li cas` | `kim npaum li cas?` |
| `Pestawg` | `pes tsawg` | `yog pes tsawg?` |
| `tsaib plab` | `tshaib plab` | `kuv tshaib plab` |
| `yawgtxiv` | `yawg txiv` | spacing only |
| `mob kib` | `mov kib` | `mov` is rice, `mob` is pain |
| `Hmoob zoo` | `Hmoov zoo` | `Hmoob` is the people, `hmoov` is luck |

### Left exactly as written, because nothing in the app backs a correction

`duas las` (dollars) · `tsib caum` (fifty) · `xees` (cents) · `nyiaj nawb` —
possibly `nyiaj ntsuab`, cash · `qe yob` (boiled egg?)

### Questions only the author can answer

- **`family-members` teaches two grandparent pairs** — `yawg txiv / niam tais`
  and `yawg / pog` — in two otherwise identical sentences. If the distinction is
  maternal vs paternal, the English must say so, or the second sentence reads as
  a duplicate of the first.
- **`Kuv tab tom ua kuv tsev kawm ntawv`** reads literally as "I am doing my
  school". Glossed as schoolwork; may want a different noun.
- **`Koj puas yog dawb`** — glossed "Are you White Hmong?", reading `dawb` as the
  dialect rather than the colour.
- **`Kuv xav Nqaij qaib nrog mov`** was missing `tau`; emitted with it to match
  the other `xav tau` sentences.
- **`Kuv muaj (number) nus muag`** was a slot; filled with `ob` (two).
- **`Leej twg …. nug?`** was a template; emitted as `Leej twg nug?`.

## Length: only one lesson hits the file's own target

The target at the top of `speakLessons.js` is 12-18 steps. `everyday-yes-no` is
17. `food-ordering` is **39** — eleven phrases, four of which are the same
request in polite vs question form (`Thov muab…` / `Koj puas muab…`). That
distinction is worth teaching and does not need eleven steps.

Every lesson header carries its step count and says the split is a cut between
two sets. **Splitting was not guessed at** — where a lesson divides is a teaching
decision, and the author grouped these deliberately.

## ⚠️ The Pro lock is now doing real work

No new category carries `free`, so all 18 derive `tier: 'pro'`. **A subscriber
must not reach these in this state** — no clip means no model to imitate and
nothing to score against, which is precisely what they would be paying for.

The TODO item that read "seven Speak lessons are stubs behind the Pro lock" is
now eighteen skeletons. Either they stay locked until recorded, or
`MONETIZATION_ENABLED` stays `false`. This did not get better; it got bigger and
more visible.

## A checker that had been lying, found by making it lie louder

`check-lesson-audio.mjs` matched a lesson id with:

```js
/^\s*id: '(speak-lesson-[a-z]+)',/
```

That worked **only while every lesson id was one unhyphenated word**. Step ids
like `speak-lesson-greetings-hear-1` failed the `[a-z]+` match and were skipped
for free — which looked like correctness and was luck.

The first hyphenated LESSON id broke it: `speak-lesson-price-how-much` also
failed to match, so 300-odd steps were counted against whichever lesson matched
last. The report read:

```
⚠️  speak-lesson-politeness      39/503 clips  8%
```

A wrong number that every check still passed. Now anchored on indentation —
lesson ids at indent 2, step ids at indent 6 — which is what the comment at the
top of that file always claimed it did.

> The transferable bit: **a regex that works because of a property nobody
> declared is a bug with a delay on it.** The property here was "lesson ids never
> contain a hyphen", and nothing anywhere said so.

## `ph()` is retired, not deleted

Nothing calls it now. It is commented out in place with a restore note — the
next batch of planned-but-unwritten lessons will want it, and an unused function
is an eslint warning that someone eventually "fixes" by deleting.

## Files touched

- `src/data/speakLessons.js` — 18 lesson objects, 3 new categories
  (`cat-understanding`, `cat-everyday`, `cat-questions`), `ph()` retired
- `scripts/check-lesson-audio.mjs` — the id regex above
- `notes/audio-todo.md` — regenerated: 7 clips → **184**

## Still open

- **A native review of all 18 before any of them is unlocked.** This is the
  gating item, not the recordings.
- **184 clips.** The checklist is the running order.
- **Splitting the long ones** — `food-ordering` (39), `politeness` (40),
  `family-members` (37), `food-foodstuff` (30).
- **Recall blocks want the word steps back** once the splits happen.
