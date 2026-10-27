# Colors gets a lesson — and a scan that over-counted by five (2026-10-15)

*"If there is no path lesson in a path, create a lesson."*

## ⚠️ FIRST: the scan said six units, and the answer was one

The first pass read lesson ids with a regex that took **only the first `id:` match per
file**:

```js
const m = readFileSync('src/data/lessons/' + f, 'utf8').match(/^\s*id: '([^']+)'/m)
```

`src/data/lessons/placeholders.js` holds **six lessons in one file** (one per path unit
that had none, added 2026-09-28). So five ids that exist and are wired —
`placeholder-common-nouns`, `-particles`, `-family`, `-food`, `-siab` — looked missing.

Five lessons were written before anyone noticed. **One unit genuinely had none: Colors.**

### The lesson, and it is not about regexes

**One lesson per file is a convention, not a rule the data enforces** — and a scan
written against the convention rather than the data will be wrong, silently, in the
direction that makes work for you. The corrected check uses `matchAll` and reports
file-not-imported separately:

```js
for (const m of src.matchAll(/^\s{0,4}id: '([^']+)',?\s*$/gm)) ids.set(m[1], f)
```

⚠️ It still had a false positive — `time.js` line 18 is
`id: 'numbers-time',  // id unchanged — step progress is keyed on it`, and a trailing
comment defeats `,?\s*$`. Verified by hand. **Worth promoting to
`scripts/check-path.mjs`**, which already checks everything else about a unit and should
own "every unit's `introLesson` exists and is imported".

## Colors: the one real gap

Unit 40 had no `introLesson` at all. It borrowed `grammar-adjectives` until Colors was
separated from Describing earlier the same day, and the borrowing was dropped rather than
replaced — correctly, since that lesson belongs to units 20 and 21.

**`src/data/lessons/colors.js` → `grammar-colors`**, wired into the Grammar unit
immediately after `adjectives` (it applies that lesson's rule to one set of words and
reads as nonsense before it), and `u-colors.introLesson` points at it.

Four steps: intro · the colour names · colours in sentences · quiz.

⚠️ `placeholder: true`, per the playbook: Claude wrote it. Built only from settled rules
and reviewed content:

- **Noun first, colour second, and no `yog`** — applied from grammar-adjectives, pointing
  there rather than re-teaching it.
- **The `kob` / `xim` ruling** (author, 2026-10-14): both mean colour, `kob` is native,
  `xim` is the loanword from Thai/Lao and Chinese, and neither goes in front of a colour
  name.
- **Colours named after a thing are correct** (author, 2026-10-15): `nqaij` peach, `kub`
  gold, `nyiaj` silver, `kas fes` brown — taught as normal, with "context tells you which
  is meant. Tsho kas fes is a brown shirt, not a coffee shirt."
- Every Hmong line is copied from the `colors` entries' own reviewed `exampleSentence`.

TODO-VERIFY in the file's header: "Koj nyiam kob dab tsi?" (the category's own sentence
uses `xim`, so the `kob` form is extrapolation from the ruling, nothing more), and whether
`Tsho no liab` wants a classifier when `Lub paj no daj` has one.

Verified: `vocab-colors` resolves to a real 15-question quiz, so the quiz step is not a
dead end; lint clean; `check-path` ✅40 Colors 15/15; `check-undefined-refs` 296 files
clean; `colors.js` parses under `@babel/core`.

## ⚠️ Five unwired drafts are sitting in the repo

`common-nouns.js`, `family-lesson.js`, `food-lesson.js`, `siab-feelings.js`,
`particles.js`. **Nothing imports any of them**, and each carries a `⚠️⚠️ NOT WIRED IN`
header saying why it exists and what to do.

They were kept rather than deleted because they are upgrades, not duplicates: the live
placeholders are intro + quiz, these add examples and sentence steps built from each
unit's own reviewed sentences, plus one settled rule each —

| draft | what it adds |
|---|---|
| common-nouns | the classifier of every noun, and the `nyob` rule for being somewhere |
| family-lesson | that the set is **a man's perspective**, and that the woman's words are deliberately NOT guessed at |
| food-lesson | **`mov` is also food**, so "Koj noj mov tau?" means "have you eaten?"; `noj` vs `haus`; the meals |
| siab-feelings | the **order** contrast as the spine: `zoo siab` happy vs `siab zoo` kind |
| particles | ⚠️ the least worth adopting — the live one covers the same ground with fewer claims, and particles are tone of voice, where guessing costs most |

⚠️ **TO ADOPT ONE, TAKE OVER THE LIVE IDS** (`placeholder-family`,
`placeholder-family-intro`, …) rather than shipping the new ones. Those ids are progress
keys; a new id strands whatever a learner has already done. Then comment out the stub in
`placeholders.js` and import the file in its place in `lessons.js`.

⚠️ **TWO FILENAMES ARE DELIBERATE**: `family-lesson.js` and `food-lesson.js`, not
`family.js` / `food.js` — `src/data/lessons/family-*.js` names are already read by the
recording checklist (`notes/audio-todo.md`), and these are different lessons for the path
units.

## Still open

- Adopt or drop the five drafts.
- Move the "every unit's lesson exists and is imported" check into `check-path.mjs`, with
  the trailing-comment case handled.
- All six lessons touched or written today are `placeholder: true`; the badge shows for
  admins only.
