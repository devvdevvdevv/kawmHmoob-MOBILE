# Where the app stands, and what I would do next — 2026-10-23

Asked for directly: *"what do you think of the app currently? what else needs to
be done?"* Measured, not guessed — every number here came from the data this
morning.

## The honest summary

**The engineering is not the problem. The content's trustworthiness is.**

44 path units, 74 lessons, 2,078 dictionary cards, 106 categories, 238 notes, and
six check scripts that assert the data against itself. For a solo project this is
a lot of working machinery, and the discipline around it is unusual — the check
scripts caught three unreachable lessons and two silently-vanishing path units
this week that no amount of clicking around would have found.

What is not ready is the Hmong. Of 2,078 cards, **407 are tagged `reviewed` and
1,107 `unreviewed`** — and 564 carry neither tag, which is worse than either,
because nobody knows which pile they belong in.

### The number that matters most

A brand-new free learner meets **119 cards** across the 7 free units. Of those:

| | count |
|---|---|
| tagged `reviewed` | **12** |
| tagged `unreviewed` | 50 |
| no tag at all | 57 |
| with audio | 64 / 119 |

**Ten percent of what a first-time user sees has been confirmed by anyone.** That
is the single biggest risk in the project, and it is not a code risk: a language
app that teaches a wrong gloss loses the only thing it is selling. `hais = to
stab` sat in the `weapons` set tagged `reviewed` until it was caught by eye —
`hais` is to say.

## What I would do, in this order

### 1. Verify the 119 free cards. Nothing else first.

Not the dictionary — the 119 a free user actually meets. At a few minutes each
that is an evening or two, and it converts the demo from "probably right" to
"checked". Then tag them honestly: the 57 untagged ones are the priority, because
an untagged card is invisible to every count and every script.

A useful side effect: `scripts/check-vocabulary.mjs` already asserts cards against
their own senses, so anything reworded gets checked mechanically.

### 2. Decide what the 564 untagged cards are.

They cannot be left as a third state. Either they were reviewed and the tag was
forgotten, or they were imported and never read. Mark them `unreviewed` as a
default — a pessimistic tag is recoverable, a missing one is not — and the
"unreviewed gloss count" assertion in TODO.md starts telling the truth again.
(It is currently red and over-counts by 61, because the grep sees commented-out
entries.)

### 3. Get the placeholders out of the paid path.

**Seven units open onto a placeholder lesson**, and six of them are Pro:

```
   4   Common Nouns          (FREE — a first-week unit)
  22   Where Things Are
  27   Sentence Particles
  38   Body & Health
  39   Feelings: Siab Second
39.5   Character: Siab First
  41   Clothes & Wearing
```

A paying learner reaching unit 22 and finding a draft is the kind of thing that
produces a refund rather than a bug report. Common Nouns is the urgent one: it is
free, it is unit 4, and it is inside the trial everyone sees.

Note the placeholder BADGE is admin-only, so a learner cannot tell a draft from a
finished lesson. That was the right call for polish and the wrong one for trust;
with seven of them live I would show it to everyone until they are written.

### 4. Audio, where it is actually being sold.

**10% of the dictionary has audio** (211 of 2,078), and 64 of the 119 free cards.
That is fine for a dictionary and not fine for the Speak module, which is the
flagship and the thing the subscription is pitched on. The existing recordings
(371 clips, every one a static `require()`, confirmed offline on 2026-10-14) prove
the pipeline works — it is a recording-hours problem, not an engineering one.

Speak's own scoring still says it is "being tuned", and
`SpeakComingSoon.jsx` is still shipping. Six groups of drills and six stories,
**none of the stories free**, is thin for $7.99/mo. See §6.

### 5. The release blocker that is still open.

**Pro entitlement has never been tested offline** (TODO.md, "Blocking the Play
production release"). Audio is confirmed offline; auth, progress sync and
RevenueCat verification are not. A subscriber on a plane who gets told they are
not Pro is the worst possible failure for a paid app, and it is an afternoon with
airplane mode to rule out.

### 6. Then the pricing question, honestly.

With the daily caps removed today, what is left selling Pro is: path units 8+,
the Pro word sets, the Pro stories, and the sentence-builder cap. That is a real
offer — but **all six stories are Pro and there are only six**, and the Speak
catalogue is six drill groups plus the conversations. Before pushing on price I
would want either more recorded Speak content or one free story, so the paid tier
is demonstrated rather than described.

## What is genuinely good, and worth not breaking

- **The check scripts.** `check-path`, `check-vocabulary`, `check-sense-pins`,
  `check-notes`, `check-undefined-refs`, `build-notes-index` — they have caught
  more real bugs this month than reading the code did. Keep adding assertions
  when a bug escapes; that is how the registration check that found two
  unreachable lessons came to exist.
- **Derived progress.** Nothing stores "unit complete"; it is computed from
  `vocabProgress`, `quizScores` and `completedSteps`. That is why units can be
  inserted mid-path without resetting anyone, and it is why the fractional
  `order` trick is safe.
- **The ⚠️ comments.** They explain the reasoning, not the code, and they have
  repeatedly stopped a change from undoing a decision made for a reason nobody
  would guess. The `interruptionMode` audio comment is the best example — it
  encodes a three-day bug hunt in a paragraph.
- **The notes.** 238 of them. The reason this session could untangle four
  wrong-file pastes quickly is that the previous ones were written down.

## What I would stop doing

**Authoring lessons by pasting into whichever file is open.** It happened four
times on 2026-10-22 alone (family, food, daily-life, siab-feelings), and each
time it produced a dead import, a duplicated id, and a unit pointing at nothing.
The cost was most of a session. `node scripts/where.mjs <id>` names the right file
in one command before the paste, and the ChatGPT prompt in this session's history
already tells the model to preserve ids.

**Adding dictionary entries without an example sentence**, unless the category is
checked first. A sentence-less card in a category that a unit draws WHOLE takes
that unit off the Paths screen entirely — that is what hid Verb + Noun on
2026-10-20 and what forced `no yog` into `yog-to-be` on 2026-10-22.
