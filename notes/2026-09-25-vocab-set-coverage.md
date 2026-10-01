# Which vocabulary sets are actually filled in — snapshot (2026-09-25)

The question was "what vocab sets already have propagated data?" It was
measured per category from `src/data/vocabulary.js` on three axes:

- **human ex**: example sentences without `source: 'ai'`
- **audio**: `audioFile` set. `check-lesson-audio` confirms every referenced path
  exists in audioMap; nobody listened to them.
- **reviewed**: not tagged `unreviewed`

**A snapshot, not a source of truth — recount before quoting it.** It was taken
before the 9 interrogatives were added the same day.

## Fully done — 100 / 100 / 100
`classifiers` (20), `numbers` (23), `tense-markers` (5).

## Audio + reviewed, examples partly AI
- `verbs` — human examples 82%
- `conjunctions` — 63%
- `money` — 61%
- `timeframes` — 58%
- `descriptions` — 56%
- `pronouns` — 56%
- `yog-to-be` — 43%
- `demonstratives` — 20%
- `reciprocals` — 17%

`greetings` and `politeness` have audio but almost no examples. They are phrase
decks, so they don't need them for path readiness.

## Reviewed, no audio
`wear-verbs`, `quantifiers`, `time-context`, `timeframes-days`, `housing`,
`family-male-perspective`, `family-female-perspective`,
`locations-prepositions`, `clothing`, `relatives`, `days-of-week`, `months`,
`calendar`, `question-words`, `discourse-particles`,
`human-anatomy-internal-organs`.

## Partly reviewed, no audio
`colors` 82%, `tools-household` 88%, `human-anatomy-*` 52–65%,
`household-rooms` 67%, `animals` 40%, `places` 30%.

## Text only — AI examples, no audio, 0–25% reviewed
`food`, `drinks`, `cooking`, `agriculture-foodstuffs`, `buildings`, `weather`,
`nature`, `geography`, `countries`, `ethnicities`, `botany`, `seasons-time`,
`body-health`, `vehicles-travel`, `chores`, `directions`, `arts-culture`,
`war-conflict`, and all 13 `reading-*` groups.

## Empty
`introductions` and `daily-life`: 4 words each, no examples, no audio. Both are
phrase decks, so the path still counts them ready.

## What it means for the path
- **Strong:** You & Me, Numbers, Classifiers, Core Verbs, Joining Words.
- **Partial:** Greetings, Family (no audio), Colors (no audio), Time & Days.
- **Weakest:** Food & Drinks and Daily Life. They draw on unreviewed,
  text-only sets.

Recount with the throwaway script pattern used here: import `categories`, and
per category count `exampleSentence.source !== 'ai'`, `audioFile`, and the
`unreviewed` tag.
