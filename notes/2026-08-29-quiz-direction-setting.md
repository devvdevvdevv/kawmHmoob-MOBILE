# Quiz direction setting — Hmong→English and English→Hmong (2026-08-29)

Quizzes could only ever ask one way: show the Hmong, pick the English. There is now
a **Quiz direction** preference in Settings that flips it.

## Why this was a small change

Every adapter in `getQuizDataset()` already returns the same shape:

```js
{ prompt, answer, audio?, blurb? }
```

So reversing a quiz is swapping two fields. `orientDataset(dataset, direction,
config)` in `src/data/quizzes.js` does exactly that, and `audio`/`blurb` ride along
untouched — they describe the ITEM, not a side of it.

## Direction is a property of the DATA, not a preference

Each quiz def now carries `reversible`. A quiz without it is returned unchanged no
matter what the setting says.

| quiz | reversible | why |
|---|---|---|
| `vocab-*` | ✅ | Hmong word ↔ English gloss, both real questions |
| `alphabet-tones` | ✅ | marker ↔ tone name, one-to-one |
| `grammar-pronouns` | ✅ | one-to-one |
| `everyday-greetings` | ✅ | one-to-one |
| `tone-drill` | ❌ | **many-to-one** |

`tone-drill` is the important one. Reversed, its prompt becomes a tone name ("Low")
and dozens of words answer it correctly — every option would be right. **A
many-to-one dataset can only be asked in the many→one direction.** That is the rule
to apply when adding a quiz, not a special case for this one.

## The ambiguity guard (a real bug this exposed)

Distractors used to be "every distinct answer except this item's":

```js
.filter((a) => a !== item.answer)
```

That misses items that share a PROMPT. English *because* maps to both `vim` and
`vim hais tias`; asked in reverse, the question could offer **both** and mark one
wrong. Now:

```js
const alsoCorrect = new Set(dataset.filter((d) => d.prompt === item.prompt).map((d) => d.answer))
const distinctWrong = [...new Set(dataset.map((d) => d.answer))].filter((a) => !alsoCorrect.has(a))
```

Measured first: **8 of 476** English glosses map to more than one Hmong word — rare,
but silently unfair when it hits. Mostly genuine synonyms (*because* → vim / vim
hais tias, *or* → los yog / lossis, *if* → yog / yog hais tias).

Verified by simulation over a deliberately ambiguous dataset: 2800 generated
questions in each direction, **every one showing exactly one correct option**.

## Why the setting lives in Settings

The quiz screen has **no start screen** — `QuizEngine` auto-starts the moment its
effect sees a config, so there is nowhere to put a per-run choice without inventing
one. It is a stored preference instead, read on mount.

`dirReady` is load-bearing. The read is async, and without gating the auto-start on
it, questions would be built in the default direction before the stored preference
arrived — the setting would appear to do nothing on the first quiz after launch.
Same shape as the existing `quota.ready` gate right next to it.

Stored device-local (`kawmhmoob.quiz.direction`), NOT in the synced progress row:
it's a study preference, not progress, and losing it on reinstall costs nothing.

## Known rough edges, not fixed

- **A reversed prompt can repeat.** With `because → vim` and `because → vim hais
  tias` both in the set, the English prompt "because" is asked twice in one quiz
  (different expected answers each time, and the guard keeps each question fair).
  Collapsing them would mean never testing the second word. 8 glosses out of 476 —
  left alone deliberately.
- **Quiz audio is dead**, and was before this. `buildQuestions` drops `audio` and
  `blurb` from the question object, and `MultipleChoice` renders
  `<AudioButton audioSrc={null} …>` — hardcoded null. The adapters carefully pass
  both and nothing consumes them. Worth fixing separately; note that when it IS
  fixed, playing the Hmong clip in English→Hmong mode would **give away the
  answer**, so it must be gated on direction.
- **The `matching` question type hardcodes** "Match each Hmong term to its meaning."
  It's disabled everywhere (every quiz is `['multiple-choice']`), so it's dead code,
  but it would need direction-aware copy if revived.

Related: [2026-08-04-quiz-distinct-options], [2026-08-08-quizengine-how-it-works].
