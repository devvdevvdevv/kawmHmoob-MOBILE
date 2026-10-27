# A changelog page, from 221 notes (2026-10-19)

*"add a changelog page, within that changelog page, implement a summary of every major
change from the very beginning."*

## Where the history came from

`notes/README.md` — 221 dated notes, 22 July to today:

| month | notes |
|---|---|
| July 2026 | 21 |
| August 2026 | 77 |
| September 2026 | 97 |
| October 2026 | 26 |

⚠️ **A CHANGELOG IS NOT A NOTES INDEX.** 221 entries is a record for the author; a learner
wants the handful they would notice. It came out as **29 entries across 4 periods** — the
notes stay the long version, and the page says so in its footer rather than pretending to
be complete.

## The two files

| file | what |
|---|---|
| `src/data/changelog.js` | the content — periods, each with `items: [{ kind, title, body }]` |
| `app/changelog.jsx` | the screen — grouped, newest first, with New / Better / Fixed chips |

⚠️ **CONTENT AS DATA, NOT MARKUP.** Adding an entry is one object in an array. If the
history lives in JSX it rots there, and the honesty rules below have nowhere to be
written down.

## ⚠️ Grouped by period, not by version number

The app has carried **one version number (1.0.0) since 2026-09-30** while the content grew
every week. A version-numbered changelog would have had one entry and a lie in it. So:

```
October 2026     — (in development)   10 entries
September 2026   v1.0  ← the only real release   8
August 2026      —                     7
July 2026        —                     4
```

Only a real release gets the `version` badge; the current period says **"In development —
these are in the app you are using, not yet in a store release."**

## ⚠️ Two honesty rules, written into the data file's header

1. **Nothing may claim every word or clip was made by a person.** AI-written example
   sentences ship before a speaker reviews them (2026-09-21), which is exactly why those
   claims were removed from the paywall and About. **A changelog is the easiest place for
   one to creep back in** — "every sentence hand-written" is the kind of line that writes
   itself.
2. **No dates for things that have not happened.** "Coming soon" ages badly in a store
   listing and is the sentence a reviewer will hold you to.

A third, implicit: entries are in a learner's words. If it only means something to someone
who has read the code, it is a note, not a changelog entry.

## What the entries actually say

Three kinds — `new` (19), `better` (7), `fixed` (3). Highlights per period:

- **October**: the vowel × tone matrix with audio; Speak's alphabet split; the sentence
  builder following the course; tone scoring flagged experimental; 41 units; one
  dictionary entry per meaning; audio no longer dying until restart; the lesson questions
  that marked themselves wrong; price down to $7.99.
- **September (v1.0)**: the Paths, Spell it out, the reading library, the sentence builder,
  Speak, ~2,000 words, Pro, and About / Privacy / contact.
- **August**: the Speak module and Android PCM recording, quizzes that know what you have
  studied, Vocabulary + Quizzes merged, the notebook, subscriptions and the daily
  allowance, leaderboard and onboarding, SDK 51 → 54.
- **July**: the port from web to React Native, the curriculum and 315 offline clips,
  flashcards and Reference, an accessibility pass.

⚠️ **THE FIXES ARE IN THERE ON PURPOSE** — audio dying until restart, questions
pre-marked wrong, taps that did nothing. A changelog with only features reads like
marketing; the fixes are what tell a user their report went somewhere.

## The door

`/changelog`, reached from **About → "What's new"**.

⚠️ **NOT in the tab bar and NOT in Home's Explore list.** A changelog is looked up once,
usually right after wondering whether the app is still being worked on — and About is
where that question gets asked. The version stamp at the top of About is the other half of
that answer.

## Verified

29 entries, 4 periods, no unknown `kind` values; lint clean on all three files;
`check-undefined-refs` 301 files clean.

## Still open

- **Nobody has seen the page on a device.** The chip-plus-title row is the thing to look
  at on a narrow screen.
- The changelog is hand-curated and will drift unless entries are added as work lands.
  Worth adding to the process playbook's "new unit / new feature" checklists.
- If a store release ever ships from this period, give it a `version` and the badge
  appears on its own.
