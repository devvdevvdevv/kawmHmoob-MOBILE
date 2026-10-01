# Pro vocabulary sets, locked sentence-builder groups, and lessons that return to the path (2026-09-25)

These are two requests from the author, done together.

## 1. Only the essentials are free

> "we need greetings, pronouns, classifiers, vocab, and adjectives to be free,
> everything else lock behind paywall. Same for the sentence builder categories."

**The rule lives in one file: `src/lib/vocabAccess.js`.** It is plain JS and is
read by every surface.

`FREE_CATEGORY_IDS` = `greetings`, `pronouns`, `classifiers`, `verbs`, `descriptions`.

- ⚠️ **"vocab" was read as `verbs`**, the fourth member of the grammar core the
  path now leads with. Nothing else in the request fits "vocab".
- **"adjectives" is `descriptions`**, the set the Adjectives lesson teaches.
  `colors` is **not** free.
- Change either reading in that file and every surface follows.

### What is locked (free users; Pro sees no change)

| Surface | What happens |
|---|---|
| `/vocabulary/<set>` | Upgrade card instead of the word list. **Spends no daily view.** |
| `/vocabulary/<set>/<word>` | Upgrade card too, so search and deep links can't get round the lock |
| Theme page rows (`VocabGroup`) | **Pro** badge; the quiz chip is hidden; the row still opens the upgrade card |
| Vocabulary search rows | **Pro** badge |
| `vocab-<set>` quizzes (`quizzes.js`) | `tier: 'pro'` unless the set is free; QuizEngine's PaywallGate does the rest. Free: 5 quizzes. Pro: 72 |
| Sentence builder | see below |

### Sentence builder

The builder's groups are themes and grammar patterns. **Each one mixes free and
locked sets**, so a group can't just be "on" or "off". The rule is:

- **A free user drills only sentences from the free sets** (`exercisesInGroup(g, { freeOnly })`).
- **A group is Pro when its free sentences can't fill a 5-sentence session**
  (`groupOpenFor`). It shows a **Pro** badge in the hub, and its screen shows
  the upgrade card without spending quota.
- Hub counts show what a free user can actually drill.

Measured on 2026-09-25, for free users:
- **Mixed:** 46 of 221 sentences.
- **Open by topic:** *Grammar words* (38) and *Describing* (7). The other 7
  topics are Pro.
- **Open by grammar:** *Pronouns* (24), *Classifiers* (10) and *Numbers* (15).
  The other 13 patterns are Pro.

### ⚠️ Deliberately NOT locked

- **The reader's long-press lookup** (`lib/wordLookup.js`) reads vocabulary.js
  directly. Locking it would make every story unreadable for free users.
- **The beginner path.** Units keep their own `free` flag. The free Greetings
  unit still works in full even though it borrows `politeness` and
  `introductions`, which are now Pro sets.
- **Learn lesson prose.** Only a lesson's generated vocab quiz is gated. For
  example, the Conjunctions lesson's quiz is now Pro.

`path.js`'s old line "Reference stays fully open on all 77 categories" was kept
as a `Was:` inside a SUPERSEDED note.

## 2. A lesson opened from the path returns to the path

> "if a user access a lesson from the path, when they return from the lesson,
> they go back into the path … but only if the user accessed the lesson from the
> relevant path."

- `src/lib/pathIntro.js`: the unit screen's "Read the full lesson" link now
  carries `?fromUnit=<unitId>`.
- `app/learn/[unitId]/[lessonId].jsx`: `pathReturnUnit(fromUnit, lessonId)`
  honours it **only if that unit's `introLesson` is this lesson**. That is the
  "relevant path" rule: a stale or hand-typed `fromUnit` can't reroute an
  unrelated lesson. When it applies:
  - **Finish** (the celebration's button) goes to `/path/<unit>`.
  - **Breadcrumbs** read Home › Path › *Unit* › lesson.
  - The quiz step's **Finish lesson** and the mini-quiz's **Back to …** go to
    the unit.
- Opened from Learn, nothing changes. Every old target is kept in a `Was:`
  comment.

The phone's own back gesture already returned to the path, because it pops the
stack. This change fixes the in-screen buttons, which were hard-coded to Learn.

## Checks

Lint is clean on every touched file, except three old apostrophe errors in the
lesson screen's existing text ("isn't", "doesn't", "you've"), which were left
alone. All check scripts pass: refs, notes, path, theme, vocabulary, reading.

## ⚠️ Not verified — try on a device

- **Free account:** open Animals (upgrade card, no view spent); open Verbs
  (works); the sentence hub shows Pro badges; a Pro topic opens the upgrade card.
- **Pro account:** nothing is locked anywhere.
- **Lesson return:** open a unit, then "Read the full lesson", then Finish. It
  should land on the unit. The same lesson opened from Learn should land on
  Learn.

## Open

- Confirm the "vocab = verbs" reading. Also decide whether `colors`,
  `conjunctions` (a path-core set) or `yog-to-be` (in the free You & Me unit)
  should be free.
- The upgrade card's copy is generic ("extended quizzes, full reading library…").
  It may want a line about word sets.

---

## ⚠️ Update, same day: THE FUNDAMENTALS ARE ALWAYS FREE

The author, emphatically: "NO PAYWALL for PRONOUNS or the basics … we need the
fundamentals to always be free." The first free list was applied too literally,
and it left walls around the basics:
- `yog-to-be` was locked **inside the free You & Me unit**.
- Core Verbs, Classifiers, Joining Words and Questions were **Pro path units**.
  The free wall sat at unit 3.
- The conjunctions and question-words **lesson quizzes** were Pro.
- Most **grammar drills** were Pro, because their sentences come from topic sets.
- Even the pronoun drill ended in a 5-sentence taste + **See Pro**.

**Now:**
- **Path units 1–6 are `free: true`**: Greetings, You & Me, Core Verbs,
  Classifiers, Joining Words, Questions. The wall is at Numbers (unit 7).
- **`FREE_CATEGORY_IDS`** is the whole grammar core plus the greeting basics:
  greetings, politeness, introductions, pronouns, yog-to-be, demonstratives,
  classifiers, verbs, tense-markers, question-words, conjunctions, reciprocals,
  grammar, descriptions. That makes 14 free quizzes; 63 are Pro.
- **Every grammar drill (gp-\*) is free with every sentence.** `freeOnly` no
  longer narrows grammar groups.
- **`isFundamentalsGroup`** covers every grammar drill and each all-free topic
  group (grammar-words, everyday). These get a **full session, no See Pro, and
  no daily quota**, the same as a free path unit.
- The `/path` info page now says the fundamentals are free.

**Pro is for topics:** numbers, family, food, body, places, reading, Speak.
Never grammar. This is saved as a standing rule in memory.

---

## ⚠️ Update 2026-09-26: a single word's page is free again

**The author:** "need you to fix the dictionary, lots of words still without
definitions, like tshawb."

**What was actually wrong:** `tshawb` *was* defined (`rw-tshawb`, added on
09-25), and the reader's lookup showed it. But it lives in a `reading-*` group,
and yesterday's lock covered **word pages** too. So on a free account **every
search result and every "Open in dictionary"** for ~500 story words landed on the
upgrade card, and the dictionary looked empty.

**The new line:**
- **Definitions are free:** a word's own page
  (`app/vocabulary/[categoryId]/[wordId].jsx`, gate commented out with a restore
  block), like the reader's long-press lookup.
- **Study is Pro for topic sets:** the set/deck page, its flashcards, and its
  quiz, as before.
- **Save stays Pro** (WordDetail's own rule).
- `lib/vocabAccess.js`'s "not locked" list now names the word page.

**A real gap, filled at the same time:** a full tap scan of every path reading
and story found **5 words resolving to nothing**. Four were added:
- **Hmoob**: Hmong, the people and the language. It was missing entirely, and
  *"Kuv yog Hmoob."* is in You & Me.
- **mais**: miles.
- **kg**: kilograms.
- **da dej**: to bathe. Tapping *da* in "lub dab da dej" now resolves.

Each example is its own course line. The fifth word, **Mim**, is a name, so it
stays out of the dictionary by the house rule.

**Result:** of all the words learners can tap in path readings and stories,
only *Mim* is undefined. The TODO unreviewed count is now 787.
