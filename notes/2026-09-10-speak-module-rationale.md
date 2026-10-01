# Speak: the module rationale — what was built, and why (2026-09-10)

A design record, not a change log. Nothing shipped on this date; this writes down
the reasoning that was only living in file headers, so the next person to touch
Speak (including me in six months) does not re-litigate settled decisions.

Existing notes cover the *implementation*. This covers the *intent*:
[2026-08-29-speak-tone-breakdown-and-scoring],
[2026-08-29-speak-lesson-categories-and-gating],
[2026-08-06-speak-module-ui-restructure].

## The origin: replicating Natulang

The module started as "do what Natulang does." The important realisation was that
**Natulang's trick is not the recording — it is the ordering.** Plenty of apps let
you record yourself. What Natulang does is make you *produce* a phrase from memory
before it lets you feel finished with it.

Everything below follows from that one sentence.

The original goal, as written down: ~5 phrases per lesson, teach the individual words
first, then the phrase they build into, then pronunciation.

## ⚠️ Two flows, and they get confused constantly

Name them separately or every conversation about Speak goes sideways:

| | route | what it is |
|---|---|---|
| **Conversations** | `/speak/lesson/[lessonId]` | the Natulang clone — a guided lesson script |
| **Pronunciation drills** | `/speak/[phraseId]`, `/speak/group/[groupId]`, `/speak/family/[familyId]` | one phrase, record, tone score. A rep, not a lesson. |

They share `useRecorder` and the scoring pipeline. They share nothing else. A note or
a bug report that says "the speak screen" is ambiguous.

## Decision 1 — a lesson is DATA, not a screen

`src/data/speakLessons.js` holds a script of **typed steps**; `LessonSteps.jsx` is a
switch on `step.type`. Adding lesson #40 is adding data. No new screen, no new route.

Adding a new *interaction* later is one new type plus one new branch — so 200 lessons
stay 200 pieces of data rather than 200 components.

Types: `intro`, `hear`, `say`, `recall`, `listen`, `dialogue`.
(`word` is disabled — it duplicated the `say` card.)

## Decision 2 — the step order IS the pedagogy

Per set of related words:

```
hear   word 1        meet it
say    word 1        imitate it        — Hmong ON SCREEN
hear   word 2
say    word 2
──────────────────────────────────────
recall word 1        "how do you say hello?"  — Hmong HIDDEN
recall word 2
recall the phrase    the two words combined
```

**`say` and `recall` are different skills, and only the second is speaking.**
Showing the Hmong the whole time teaches reading aloud. That is the trap, and it is
invisible while you build it, because a lesson full of `say` steps *feels* like it is
working.

⚠️ **The recall block comes after BOTH words, not after each one.** The gap between
meeting a word and being asked for it is what makes the retrieval real. Tightening
that gap to feel more responsive would quietly delete the thing the lesson is for.

The "words first, then the phrase" shape is literal — Greetings runs
`Nyob zoo` → `Koj` → `Koj puas nyob zoo?`. The phrase is *assembled* from pieces the
learner already owns, rather than arriving whole.

⚠️ **The 5-phrase target is not what the file says.** The header in
`speakLessons.js` states the target as "2–3 sets per lesson, 12–18 steps, 5–10
minutes." Greetings does land at ~5 distinct phrases, so the original intent holds in
practice — but the number written down is *sets*, not phrases. If 5 phrases is the
real spec, the header should say so, because the next lesson author will build to
whatever is written there.

## Decision 3 — a chat scroll, not a pager

`LessonScroll.jsx` reveals steps one at a time but **keeps them on screen**, stacking
downward like a conversation.

Language learning is cumulative. Seeing the earlier sentence still above you while
you practise the next one is the point, not clutter — and scrolling back to rehear
something is one gesture instead of five taps backwards.

The pager still exists as `LessonRunner.jsx`, archived rather than deleted. It may be
the better fit for a timed drill, or a quiz where seeing previous answers is
cheating. Both presentations import the same step components, so they cannot rot into
disagreeing about what a step looks like.

### ⚠️ The auto-advance rule

Passive steps advance themselves (`intro` 7s, `hear` 6s). **Active steps never do** —
`say`, `recall`, `listen`, `dialogue` are all `null`. A timer firing mid-recording
would cut off a take, and would be infuriating in a way that is hard to report as a
bug.

The active card lands at **22% down the viewport**, not the bottom. `scrollToEnd`
would pin the phrase to the bottom edge, and on a phone held at chest height that
means reading with your eyes cast down — the worst spot on the screen.

## Decision 4 — no gating on pronunciation score

Nothing blocks progress on a score, ever. Not a softness — a correctness issue:
scoring is **absent** for level tones and for any phrase without a reference contour,
so a pass-gate would trap learners on phrases the machine physically cannot judge.

Self-assessment and A/B compare carry the feedback where the scorer cannot reach.

## Decision 5 — DTW, because timing is not tone

People speak at different speeds. Comparing two pitch contours index-to-index would
punish **timing** as if it were **tone** — a correct but slow reading would score
badly, which is the opposite of the lesson.

Dynamic Time Warping stretches time to line the two curves up and returns the
leftover distance. That residual is the actual tone error. Score is
`100 · exp(−d / SCORE_K)` with `SCORE_K = 3`: 0 semitones → 100, ~2st → 51, ~4st →
26, never negative.

`SCORE_K` is the one knob. See [2026-08-29-tone-scoring-unblocked] — the pass
thresholds still have not been calibrated against human judgement.

⚠️ **`@siteed/audio-studio` is load-bearing.** Android AAC cannot be pitch-tracked;
scoring needs raw PCM, and `@siteed` is what provides it. iOS uses expo-audio. This
is not a dependency to trim. See
[2026-08-13-siteed-audio-studio-build-break-version-pin].

## Decision 6 — derive everything derivable

- **Gating**: a category declares `free: true`; lessons inherit `free` and get
  `tier: 'pro'` otherwise. A lesson never hand-writes its own tier — two places
  recording one fact is two places to disagree, and the disagreement would be silent.
  These fields are *overwritten*, not merged, on purpose.
- **Lesson numbers are GLOBAL**, computed from array position. Category 2 starts at
  Lesson 4, not Lesson 1 — the number says how far into the whole course you are.
  Never write one by hand.
- **`FREE_LESSON_COUNT`** is derived, so "first N free" copy cannot go stale.

## Audio is bundled and offline

315 clips under `assets/audio/`, keyed in `src/lib/audioMap.js` with **literal
`require()` strings**. Metro reads source at build time; a path assembled at runtime
resolves to nothing and fails silently. Same constraint as `src/data/storyCovers.js`.

⚠️ `EXPO_PUBLIC_AUDIO_BASE_URL` is a fallback for unbundled paths only. Do not "fix"
offline audio by adding a host.

A typo in an audio path is a silent no-op rather than an error, which is why
`scripts/check-lesson-audio.mjs` asserts every one.

## Honest content status (2026-09-10)

| category | status |
|---|---|
| greetings | ✅ 100% real native-speaker audio |
| farewells | ✅ 100% real native-speaker audio |
| politeness | ⚠️ partial — `Thov txim` and `Tsis ua li cas` have no recording |
| price / family / food | ⚠️ **placeholders** — intro card only, no real content |

The placeholder categories exist to exercise the locking path with more than one
category, so the paywall could be tested before ~200 real lessons are written.
Replacing one is swapping `ph(...)` for a real lesson object; numbering, gating and
progress are all derived and need no edit.

## What I would question next

1. Reconcile the 5-phrases-vs-2-3-sets target in the `speakLessons.js` header.
2. Calibrate `scoreBand()`'s 80/60 thresholds now that 137 real contours exist.
3. Decide whether `recall` should ever escalate. Right now the hardest thing a lesson
   asks is "produce this phrase," and it only ever asks within the lesson that taught
   it. Natulang re-asks old phrases in *later* lessons; nothing here does that yet.
   That is the biggest remaining gap between this module and the thing it was copying.

Related: [2026-08-29-speak-lessons-real-audio],
[2026-08-29-speak-reveal-panels-and-practiced-gate],
[2026-08-29-speak-defects-fixed],
[2026-08-06-v1-launch-flags-speak-locked-monetization-off].
