# Vocabulary: themes you enter, and a mobile contrast pass (2026-08-29)

Follow-up to notes/2026-08-29-vocabulary-quiz-merge. The merge put everything on one
page; this makes that page navigable on a phone.

## Why

After the quiz merge, `/vocabulary` listed all **46 categories** in one column, each
a tall card (emoji, title, description, study bar, quiz footer). On a phone that's
roughly a dozen screens of scrolling with no landmarks — you couldn't find "Family"
without swiping past Animals, Colors, and Numbers. Everything was also cream-50 on
cream-200 borders: beige on beige, low contrast in daylight.

## The shape now

```
/vocabulary                     10 theme cards  →  People & Family, Home & Places, …
/vocabulary/group/<themeId>     that theme's categories, as rows
/vocabulary/<categoryId>        the word deck (unchanged)
/vocabulary/<categoryId>/<wordId>
```

The themes are not new — `categoryGroups` has grouped categories in the data for a
while (the retired quiz menu used them as section headers). They just weren't
navigable. Nothing was regrouped or renamed; all 46 categories are reachable and
none is orphaned (the leftovers group, "More", catches anything unassigned).

| Group | Categories | Words |
|---|---|---|
| People & Family | 3 | 59 |
| Home & Places | 6 | 63 |
| Nature & Food | 3 | 21 |
| Clothing | 3 | 34 |
| Time, Numbers & Money | 9 | 114 |
| Describing | 3 | 51 |
| Grammar & Function Words | 9 | 85 |
| Everyday Speech | 6 | 48 |
| The Body | 4 | 48 |

## The "More" bucket is gone

`categoryGroups` sweeps anything unassigned into a trailing "More" group so no
category is unreachable. Four categories were living there; all four now have a
real home, so the bucket disappears on its own (`leftovers.length === 0`):

| Category | Words | Went to | Why |
|---|---|---|---|
| `human-anatomy-upper-body` | 10 | The Body | shoulder, arm, elbow, hand |
| `human-anatomy-lower-body` | 11 | The Body | belly, hip, thigh, knee |
| `human-anatomy-internal-organs` | 12 | The Body | heart, liver, lung, kidney |
| `clothing` | 26 | **Clothing** | shirt, pants, shoes — garments, not body parts |

The Body's blurb was rewritten ("Head to foot, inside and out") since it's no longer
just the face. Clothing lists the noun category first, then the wearing verbs.

Two categories also had `emoji: ''`, which rendered as a blank circle in the new row
chips: `clothing` → 👗 and `classifiers` → 🏷️. No category is emoji-less now.

## Routing

`app/vocabulary/group/[groupId].jsx` — a **static** `group` segment sitting beside
the dynamic `[categoryId]` routes. Static segments outrank dynamic ones, so
`/vocabulary/group/people` resolves to the theme page, not to
`[categoryId]/[wordId]` with `categoryId="group"`. This is the same arrangement
`app/speak/group/[groupId].jsx` already has next to `app/speak/[phraseId].jsx`.

## Files

| File | Role |
|---|---|
| `VocabCategoryGrid.jsx` | Rewritten as the THEME index: quiz-progress strip, 10 group cards, drills |
| `VocabGroup.jsx` | **New** — one theme's categories as rows |
| `QuizChip.jsx` | **New** — the shared quiz affordance (score / open / locked) |
| `app/vocabulary/group/[groupId].jsx` | **New** route |
| `src/data/vocabulary.js` | `getCategoryGroup(id)` helper |
| `src/data/pageInfo.js` | `/vocabulary` help now describes themes |

## Mobile / contrast decisions

- **Rows, not blocks — but generous ones.** A category row is ~104pt tall with a
  64pt emoji chip and a 64pt quiz chip: easy to see while scrolling and comfortable
  to hit with a thumb. Four fit on a phone screen (the old tall cards managed two).
  The study bar only appears once you've marked something — an empty bar on every
  untouched row is noise.
- **Borders `cream-200` → `cream-300`.** cream-200 (236,220,192) on cream-50
  (251,246,236) is nearly invisible — the cards didn't read as cards.
- **Progress tracks `cream-200` → `cream-300`**, fill stays `clay-600`.
- **Secondary text is `stone-600`, not `stone-500`.** stone-500 on cream-50 is about
  4.5:1 — borderline for 12px. stone-600 is ~7:1.
- **The quiz chip is FILLED, not tinted** — `success-700` for a pass, `clay-600` for
  an untried quiz. A pale pill on a cream card on a seafoam page reads as decoration;
  this has to read as a control.
- **Two tap targets per row, both ≥44pt**: the row opens the deck, the chip opens
  the quiz. A locked chip is deliberately NOT pressable — the meta line says
  "study N more to unlock", so the button would only lead to a wall.
- Group cards show a 3-emoji strip from their first categories. It says
  "Animals, Nature, Food" faster than any label, and missing emojis are filtered out
  (a couple of categories have none).

## Verify

- `/vocabulary` is one screen: the quizzes-taken strip, then 10 theme cards.
- A theme card shows its blurb, `N categories · M words`, and a studied bar.
- Tapping "People & Family" opens `/vocabulary/group/people` with 3 category rows.
- A row's chip: green % when passed, cream % when scored under 80, clay ⚡ when
  unlocked and untried, flat lock when the deck isn't studied enough.
- Breadcrumb trail reads Home / Vocabulary / People & Family.
- `/vocabulary/animals` and `/vocabulary/animals/animals-dog` still resolve — the
  static `group` segment didn't shadow them.
- Drills (Tone Markers, Tone Drill, Pronouns, Greetings) still sit at the bottom of
  the index.
