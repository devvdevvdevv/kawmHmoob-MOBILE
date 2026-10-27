# Lessons that could not be reached, and the paste that kept landing in the wrong file — 2026-10-22

A long session of lesson authoring. The content work is below, but the pattern
worth keeping is the FAILURE MODE: a lesson can be written, parse cleanly, and
still be invisible — and nothing in the app says so.

## 1. ⚠️ The same accident four times: a paste into the wrong file

New lessons were authored with ChatGPT and each pasted into a file that already
held a different lesson:

| pasted into | which already held | the id it exported |
|---|---|---|
| `placeholder-family.js` | a byte-identical copy of `family-lesson.js` | `conversational-family` |
| `placeholder-food.js` | a byte-identical copy of `food-lesson.js` | `conversational-food` |
| `daily-life.js` | the Daily Life lesson | `vocab-common-phrases-everyday-greetings` |
| `siab-feelings.js` | `siabFeelings` (`grammar-siab`) | `placeholder-siab` |

Each produced the same three failures at once:

1. **`lessons.js` imported an export that no longer existed** —
   `familyPlaceholder`, `foodPlaceholder`, `dailyLife` — leaving `undefined`
   sitting inside a `lessons: [...]` array.
2. **Two files declared the same lesson id**, so which one the app used depended
   on which was imported.
3. **A path unit pointed at an id that had stopped existing**
   (`placeholder-family`, `placeholder-food`). That is not an error:
   `unitIntro()` returns null and the unit simply shows no introduction.

**The fix was the same every time:** keep the file whose NAME matches the id,
retire the other to an empty signpost (`export {}`) with a comment saying where
the content went, re-point `lessons.js`, re-point the unit's `introLesson`. An
empty signpost beats deleting the file — an old import then fails loudly there
instead of resolving to `undefined` inside an array.

**Daily Life had to be recovered from git HEAD**; the paste had overwritten it.

## 2. ⚠️ Retiring a lesson by commenting out its `export const` line

`siab-feelings.js` stopped parsing with `SyntaxError: Unexpected token ':'`. The
old lesson had been retired like this:

```js
//archive
//export const siabFeelings = {
  id: 'grammar-siab',          // ← still live code
  title: 'Feelings | Lus Siab',
```

Commenting the declaration leaves the object body behind as a syntax error.
**Comment out the whole block, or let git hold it and leave a signpost.**

## 3. ⚠️ Two lessons that existed and could not be reached at all

An audit of every `export const` in `src/data/lessons/` against `lessons.js`
found two never registered:

- **`siabFeelings`** (`grammar-siab`) — never imported. A full lesson,
  unreachable since it was written on 2026-10-15. Retired this session; its
  subject is covered by `placeholder-siab`.
- **`commonNouns`** (`conversational-common-nouns`) — imported nowhere; only
  `placeholder-common-nouns` was registered. Now registered.

**`check-path.mjs` cannot catch this class of bug.** Its registration assertion
only fires for a lesson some PATH UNIT points at, and neither of these had one. A
lesson reachable only from the Learn tab has nothing asserting it exists.

### Two false trails the audit produced first, both tooling

- **A heredoc ate the regex backslashes.** `new RegExp('import\\s*{…')` written
  inside `<<'JS'` arrived as `import\s*{`, and `\s` in a plain string is just
  `s` — so EVERY lesson reported "NOT imported". Write scripts with the file
  tool, not a heredoc, whenever a regex is involved. (The same heredoc problem
  killed this note's first draft.)
- **`grep -P` is unavailable here** ("supports only unibyte and UTF-8 locales"),
  so `grep -oP '^export const \K\w+'` produced nothing, the audit loop ran zero
  times, and it printed a clean bill of health. Use
  `sed -n 's/^export const \([A-Za-z0-9_]*\).*/\1/p'`.

## 4. ⚠️ Recovering a paste I truncated myself

Moving the siab lesson out of `siab-feelings.js`, my extraction stopped at *the
first line whose trim is `}`* — a NESTED closing brace a third of the way in —
and wrote a lesson cut off mid-step. The working-tree content was not in git.

**It came back from VS Code's local history:**
`AppData/Roaming/Code/User/History/<hash>/*.js` holds timestamped copies of every
edited file. `grep -rl "<a distinctive string>"` over that directory found both
revisions, 387 lines each. Worth remembering the next time uncommitted work is
overwritten.

Two rules out of it: **count brace depth from the opening line**, never look for
the first closing brace; and **never put the literal text `export const <name>`
inside a header comment** — my second attempt sliced the file at
`indexOf('export const siabPlaceholder')` and cut its own prose in half.

## 5. Units added, and the shape that lets two units share one word set

| unit | order | cards | why it exists |
|---|---|---|---|
| `u-family-female` | 30.5 | 14 | Hmong kinship terms change with the speaker's gender; the male set stays in `u-family` |
| `u-siab-character` | 39.5 | 12 | `siab + adjective` is character (`siab zoo`, kind); `adjective + siab` is a feeling (`zoo siab`, happy) |

**Both pairs share one vocabulary category and split it with explicit `words`
lists.** That is the shape to reuse: every card stays in exactly one unit — a
word in two units is a check-path failure and makes progress ambiguous — without
moving entries between categories, which would change each card's context tag and
which of its senses display.

**Fractional `order` values** (30.5, 39.5, and 10.5 for `u-muaj` the day before)
put a unit beside its sibling without renumbering the thirty after it.
`check-path` only requires `order` to be numeric and unique. They are
placeholders for the next real renumber.

## 6. ⚠️ Never name the app in learner-facing text

The author: *"never mention the app in the explanations."* Six instances removed,
and **three of them were notes to the AUTHOR left in the learner's text**:

- *"Spelling should be checked against the app's reviewed vocabulary entry."*
- *"This phrase is included in the app's reviewed examples."*
- *"…so the app's exact entry for qhaub cij should be checked with a speaker."*

Those became `// TODO-VERIFY:` comments, which is where a note to yourself
belongs. The rest were rephrased to describe the language instead: *"This order
matches an American date"*, *"The forms taught here are:"*.

I had written this rule into the ChatGPT prompt myself and then broke it in a
gloss an hour later.

## 7. ⚠️ `no yog` went into `yog-to-be`, not `demonstratives`, for a mechanical reason

The author asked for `"no yog" = this is` in the dictionary. It is in `yog-to-be`
because **`u-this-that` draws the whole `demonstratives` category with no
explicit `words` list**, and `unitReadiness` drops a unit out of `livePath()`
unless every card has an `exampleSentence`. There is no attested `no yog`
sentence, so adding it to `demonstratives` would have taken This & That off the
Paths screen — the mechanism that removed Verb + Noun two days earlier.

**Before adding a sentence-less card, check whether its category is drawn whole
by a unit.** `u-yog` lists its words explicitly, so it was safe.

⚠️ The entry contradicts the author's own lesson text, which teaches `Nov yog…`
as the standard and cautions against treating `no yog…` as interchangeable. The
caution is written into the gloss and the question is open — they may have meant
`nov yog`, which has no entry at all, and neither does `nov`.

## 8. Placeholder units are NOT dev-gated

The author asked to "make the placeholder paths available for non dev to see".
They already are: all 44 units are in `livePath()`, and a non-admin sees every
one, its placeholder lesson, and the "Read the full lesson" link. The only
admin-only thing is the orange **Placeholder badge**, hidden from learners at the
author's own request on 2026-09-28.

What makes them look unavailable is **sequential unlocking** —
`isUnitUnlocked` requires the previous unit to be complete, and an admin bypasses
it. Pro makes no difference. Opening them up means raising `ALWAYS_OPEN_UNITS`,
which changes the progression model for every learner, so it was left as the
author's call.

## 9. `scripts/where.mjs` — the lookup that answers "where is this lesson?"

Added because editing one lesson touches four files that never name each other:
the lesson, its import AND its array entry in `lessons.js`, the unit's
`introLesson` in `path.js`, and the `vocab:` category in `vocabulary.js`.

```
node scripts/where.mjs u-muaj            # a unit id — follows introLesson through
node scripts/where.mjs placeholder-food  # a lesson id
node scripts/where.mjs "This & That"     # part of a title
```

It prints `file:line` for every link in the chain. It reads the files as text
because `lessons.js` omits `.js` on its imports and Node cannot load it — the
same constraint `check-path.mjs` works under.

## Also landed

- **`daily-life.js` filled out** — it was a four-phrase stub while `u-daily`
  resolves to 17 cards; the entire `chores` half (12 verbs, each with a reviewed
  sentence) was never introduced. Now 4 steps, and it gained the `vocab` field it
  had always lacked, without which its quiz step could not resolve.
- **`greetings-farewells.js` → `everyday-phrases.js`**, export
  `greetingsFarewells` → `everydayPhrases`, unit retitled "Everyday Phrases". The
  id had been renamed on 2026-10-19 and the file name never caught up, which is
  why "where is the everyday phrases lesson?" kept landing on the archived copy.
  Step ids still read `vocab-greetings-farewells-*` — progress keys.
- **The ChatGPT drafts needed repair on import**: invented step ids (its own
  TODO-VERIFY admitted it had not been given the source), a dropped grammar step,
  and — from a CRLF/LF mismatch in my splice — `},<CR>,`, which JS reads as an
  ARRAY HOLE. `[a,,b]` has three elements with `undefined` in the middle; it
  parses, it imports, and the lesson screen renders a step that is not there.
