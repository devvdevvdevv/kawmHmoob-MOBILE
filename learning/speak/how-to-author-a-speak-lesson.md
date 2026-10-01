# How to author a Speak lesson

Everything is data. Adding a lesson means editing **one file** —
`src/data/speakLessons.js` — and no screens, routes, or components change.

---

## The 60-second version

1. Open `src/data/speakLessons.js`
2. Copy an existing lesson object
3. Change the `id`, `title`, `blurb`, `emoji`
4. Write the steps (shape below)
5. Add it to the `speakLessons` array at the bottom

It appears on the Speak hub automatically, with a progress bar.

---

## The lesson shape

Per SET of related words — two words that build one phrase:

```
hear    word 1        meet it
say     word 1        imitate it, Hmong VISIBLE
hear    word 2
say     word 2
──────────────────────────────────
recall  word 1        "How do you say 'hello'?" — Hmong HIDDEN
recall  word 2
recall  the phrase    the two combined
```

Then the next set. Close with a `dialogue`.

**Target: 2-3 sets, 12-18 steps, 5-10 minutes.**

### ⚠️ THE BUILD — the pattern that matters most

Do NOT jump from two words to the full sentence. Each recall adds ONE piece to
the thing just said, so the sentence assembles under the learner:

```
recall  kuv                          I / my
recall  kuv lub npe                  my name
recall  kuv lub npe hu ua Ntxawg     My name is Ntxawg.
```

The jump from isolated words to a whole sentence is where learners fall off —
nothing bridges it. Three small steps cost nothing but data, and every one is a
phrase you could actually say out loud.

**Cost: zero code.** This is authoring.

### Why this order

`say` and `recall` train different skills:

| | shows Hmong? | skill |
|---|---|---|
| `say` | **yes** | IMITATION — can you copy this sound? |
| `recall` | **no** | PRODUCTION — can you retrieve it unaided? |

Recognition is far easier than recall, and **only recall is what speaking
demands.** A lesson that never hides the answer teaches reading aloud.

**The recall block comes after BOTH words, not after each one.** A gap between
meeting a word and being asked for it is what makes retrieval real. Asking
immediately tests short-term echo, not memory.

---

## Step reference

### `intro` — orient before any Hmong appears

```js
{
  id: 'speak-lesson-food-topic',
  type: 'intro',
  emoji: '🍚',
  title: 'Ordering food',
  body: ['Two phrases that get you fed.', 'Both are short.'],
  duration: '5–10 minutes',   // optional
}
```

No audio, no interaction, by design — someone who just opened the app should not
be asked to do anything in the first three seconds.

⚠️ **Only lesson ONE welcomes the learner to Kawm Hmoob.** Every other lesson
opens straight with its own topic card.

### `hear` — meet the phrase

```js
{ id: '…-hear-1', type: 'hear', hmong: 'Nyob zoo', english: 'hello', audio: '' }
```

### `say` — imitate, Hmong on screen

```js
{ id: '…-say-1', type: 'say', hmong: 'Nyob zoo', english: 'hello', audio: '' }
```

Record → play back → A/B compare → self-assess. **No score** — see below.

### `recall` — produce from memory, Hmong hidden

```js
{ id: '…-recall-1', type: 'recall', hmong: 'Nyob zoo', english: 'hello', audio: '' }
```

Shows only "How do you say *hello*?". The `hmong` is still required — it is what
the reveal shows and what the score compares against.

**This is the only step that scores.**

### `listen` — the OPPOSITE direction

```js
{ id: '…-listen-1', type: 'listen', hmong: 'Ua tsaug', english: 'thank you', audio: '' }
```

Plays the Hmong and asks what it MEANS. English hidden until revealed.

|  | shown | learner produces | tests |
|---|---|---|---|
| `recall` | English | Hmong | PRODUCTION — can you say it |
| `listen` | Hmong (+ audio) | English | COMPREHENSION — can you understand it |

A learner who only ever does `recall` can SAY "ua tsaug" but may not recognise it
when a Hmong speaker says it to THEM — the actual failure mode in a conversation,
where you hear before you speak.

**No recording, deliberately.** The answer is in English; scoring an English take
against a Hmong reference is meaningless. It is a self-check: listen, answer in
your head, reveal, be honest. The only step type with no gate.

Put one or two near the end of a lesson, after the phrases have been produced.

### `dialogue` — everything at once

```js
{
  id: '…-dialogue',
  type: 'dialogue',
  turns: [
    { speaker: 'A', hmong: '…', english: '…', audio: '' },
    { speaker: 'B', hmong: '…', english: '…', audio: '', record: true },
  ],
}
```

`record: true` marks the learner's turn. Speaker A plays; B is recorded.

### `word` — DISABLED

Duplicated the `say` card. Commented out in `LessonSteps.jsx` and in the data.
Left in place in case it earns its way back (a word needing a usage note before
practice, which `say` has nowhere to put).

---

## Why only `recall` scores

Changed 2026-08-24. `say` is PRACTICE — the Hmong is on screen, so the learner is
copying something they can see and hear. A number there adds nothing but
something to feel bad about on a step whose whole job is low-stakes repetition.

On `recall` the number means something: the phrase came from memory, so it is
measuring a real attempt rather than a read-aloud.

A/B compare stays on `say`, because hearing yourself against the native clip IS
the right feedback for imitation.

---

## Rules that are not negotiable

**Every step needs a globally unique `id`.** It IS the progress key —
`markStepComplete(step.id)`. Reusing an id across lessons means finishing one
marks the other done.

Convention: `speak-lesson-<topic>-<type>-<n>`.

**`audio: ''` when there is no recording** — not `null`, not omitted. Matches
`src/data/speak.js`.

**A repeat gets its OWN id.** If a phrase returns later, suffix it (`…-again`)
so progress counts it separately.

**Never import from `src/data/vocabulary.js`.** Speech teaches SITUATIONS; Words
teaches ITEMS. A word appearing in both is written down twice, and that
duplication is cheaper than an abstraction that fits neither.

---

## Lesson-level flags

```js
{
  id: 'speak-lesson-food',
  title: 'Ordering food',
  blurb: 'Shown on the hub card.',
  emoji: '🍚',
  free: true,        // exempt from BOTH the daily quota and the Pro lock
  tier: 'pro',       // gate behind the paywall
  steps: [ … ],
}
```

`free: true` is for hooks — lesson one uses it. Quota is spent **per lesson**, on
the first step completed, not per recording.

---

## Adding audio

1. Drop the `.mp3` under `assets/audio/speak/…`
2. Set `audio` to its path
3. **`node scripts/generate-audio-map.js`** ← the step people forget

Skip step 3 and the clip silently will not play: `resolveAudioSrc` returns null
for unmapped paths, which is a deliberate no-op, not an error.

For a phrase to be SCOREABLE it also needs a reference contour — see
`scripts/extract-contours.mjs`. Without one, `recall` shows the curve but no
number (`reason: 'no-reference'`).

---

## Testing what you wrote

**Sandbox:** `/speak-lab` (dev tools) uses `src/data/speakLab.js` — throwaway
script, same engine, no quota or Pro gates.

**Real:** Speak tab → Conversations → your lesson. Needs `SPEAK_ENABLED = true`.

**A typo in `type` is LOUD** — the switch's `default:` renders a dashed "No UI yet
for step type X" card rather than silently nothing. If you see that, check the
spelling.

---

## ⚠️ Content quality

Every line of Hmong currently in `speakLessons.js` is **placeholder**, written to
exercise the flow. Nothing ships without native-speaker verification and a real
recording. See the pipeline in
[[2026-08-18-content-implementation-plan]].

The engine is done. The content is the work.
