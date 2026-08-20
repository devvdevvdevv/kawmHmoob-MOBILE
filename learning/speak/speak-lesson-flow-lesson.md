# Lesson: build the Natulang-style Speak flow (in a sandbox)

Goal: build the lesson runner from the content plan — hear a phrase, meet its
words, say them, recombine, end on a dialogue — WITHOUT touching the Speak module
that already ships.

**You write the code.** This guide gives you the shape, the concepts, and the order.

A REFERENCE scaffold exists at `app/speak-lab.jsx` + `src/data/speakLab.js`
(route `/speak-lab`, linked from `/dev`). It implements the runner, the switch,
and TWO worked examples — `hear` (the simplest possible step) and `say` (the full
record → score → curve pipeline). Read both to see the pattern, then build the
remaining step types — `word`, `build`, `dialogue` — yourself. That is where the
learning is.

Nothing existing gets edited except the one link in `app/dev.jsx`.

---

## 0. What you already have (do NOT rebuild these)

Half the hard parts exist. Read them before writing anything:

| Piece | Where | What it gives you |
|---|---|---|
| Recorder | `src/hooks/usePronunciation.js` | `{ status, uri, start, stop, playTake, playing }` |
| Native clip playback | `src/components/common/AudioButton.jsx` | `audioSrc` + `wordId` |
| A working listen→record→compare unit | `src/components/speak/PronounceStep.jsx` | the one-button-three-states pattern |
| A stepper | `app/speak/group/[groupId].jsx` | index + progress bar + Back/Next |
| Admin-only route guard | `src/components/common/AdminGate.jsx` | wrap the sandbox in it |

**Pitch SCORING now EXISTS** (built 2026-08-18 — this section used to say it
didn't). `scoreTake(uri, audioPath)` in `src/lib/pronounceScore.js` returns
`{ score, ref, user, reason }`, and `ToneCurve.jsx` draws the overlay. The `say`
step in the lab is already wired to both — read it as the second worked example.
Full explanation + exercises: [[f0-and-tone-scoring-guide]].

⚠️ **But do NOT design around a score being available.** It is absent more often
than present:
- **Android returns `unsupported-format`** — the OS cannot record raw PCM at all.
- **Most phrases return `no-reference`** — reference contours must be extracted
  offline and `src/data/contours.json` is still empty.

So the content plan's fallbacks (self-assessment, "try again", skip) are STILL
what you build against. Treat a score as a bonus that sometimes appears, never as
a gate on progress.

---

## 1. The one concept: a lesson is a SCRIPT of TYPED steps

Your current Speak is **one array, one index, every item the same kind**:

```js
phrases[index]   // always a phrase -> always the same UI
```

The Natulang flow differs in exactly one way: **the items are different kinds of
things.** Hearing a phrase, meeting a word, saying a word, and running a dialogue
are four different interactions in one ordered list.

So the data becomes a *script*, and the screen becomes a **switch on `step.type`**.

```
{ type: 'hear',     ... }  listen to the whole phrase before it means anything
{ type: 'word',     ... }  meet ONE word (English vs Hmong + definition)
{ type: 'say',      ... }  record yourself
{ type: 'build',    ... }  assemble known words into a phrase
{ type: 'dialogue', ... }  the closing mini-conversation
```

**Why this shape:** adding an interaction later = one new type + one new branch.
The stepper never changes. And 20 lessons become 20 pieces of DATA, not 20 screens.
That's the difference between a lesson engine and 20 hand-built pages.

This mirrors the detailed lesson structure in
[[2026-08-18-content-implementation-plan]] under Speak — the script IS that
structure, written as data.

---

## 2. Design your step schema (do this on paper first)

Before any JSX, write out ONE lesson as data. Decide:

- What fields does every step share? (`type` at minimum)
- What does each type need on top? (`hear` needs audio; `build` needs the parts)
- How does a step say "the user finished me"? Or does the runner just allow Next?

Follow the conventions already in `src/data/speak.js`:
- `id` globally unique, namespaced
- `audio: ''` when no recording exists (not `null` — match the existing file)
- `tier: 'pro'` if it should be paywalled

Put it in a NEW file, e.g. `src/data/speakLab.js`. Do not touch `src/data/speak.js`.

⚠️ Use placeholder Hmong while wiring, and MARK it as placeholder. Verify with a
native speaker before any of it becomes real lesson content.

---

## 3. The sandbox route

File-based routing: creating `app/speak-lab.jsx` creates `/speak-lab`. Follow the
existing throwaway-screen convention (`app/spike.jsx`, `app/tone-eval.jsx`):

- Wrap the whole screen in `<AdminGate>`. Hiding the link is not enough — a deep
  link walks straight past a hidden menu item. Guard the destination.
- Add an entry to the `TOOLS` array in `app/dev.jsx` so it's reachable.
- Header comment saying what it is and that it's throwaway.

**Isolation check:** when you're done, `app/(tabs)/speak.jsx`, `src/data/speak.js`,
`app/speak/group/[groupId].jsx`, and `PronounceStep.jsx` should contain ZERO
references to anything you added. Grep for it.

---

## 4. Build the runner

Three separate things. Keeping them separate is the whole trick:

**The runner** owns exactly ONE piece of state: which step you're on. Index,
progress bar, Back/Next. Nothing else. Steal the shape from
`app/speak/group/[groupId].jsx` — you already wrote this once.

**The switch** takes a step and returns the right component for `step.type`.

**Each step component** takes ONLY `step` and renders. No state. No navigation.

> **Keep step components dumb.** The moment a step manages its own "am I done"
> logic, you have state in two places and the bugs start. If a step truly needs
> internal state (`build` will), it stays LOCAL to that step — the runner still
> owns the index.

**Make unknown types LOUD.** Your `default:` branch should render a visible
placeholder, not `null`. A typo in your data should shout, not silently render
nothing. (Same lesson as [[arrow-function-bodies-and-handlers]] — the silent
failures cost the most time.)

---

## 5. Order to build in

Smallest first, so you feel the pattern before the hard parts:

1. **`hear`** — text + `AudioButton`. No state. Proves the switch works.
2. **`word`** — nearly identical, smaller. Proves adding a type is cheap.
3. **`say`** — ALREADY BUILT in the lab as a second worked example: record →
   score → curve, wired to `scoreTake()` and `ToneCurve`. Read it rather than
   rewriting it, and note the one-button-three-states pattern it shares with
   `PronounceStep.jsx`.
   **Then answer the product question it raises:** what counts as done? Can the
   learner advance without recording? Since a score is absent on Android and
   absent for any phrase without a reference contour, the answer is almost
   certainly yes — with self-assessment. Decide it deliberately, because it
   determines whether the runner needs per-step "done" state or just an index.
4. **`build`** — parts as tappable chips, assembled in order. First step with real
   internal state.
5. **`dialogue`** — map the turns, alternate alignment by speaker.

Do 1, then STOP and run it. Do not build all five before looking at the screen.

---

## 6. Gotchas you'll hit

- **`usePronunciation` needs a real mic** → dev build only. Web and the Play Store
  testing APK both prove nothing here.
- **Hooks before early returns.** If the runner returns early for an empty script,
  that return goes BELOW every hook — see
  [[2026-08-17-page-info-modal-swipe-gesture]], same trap.
- **Static style objects, never `style={() => ...}`** — NativeWind drops the
  function form on native and the element renders invisible.
  See [[nativewind-function-style-invisible]].
- **`.map` must RETURN the row** (`=> (` not `=> {`) when rendering dialogue turns
  or build chips. See [[arrow-function-bodies-and-handlers]].
- **Quota + Pro gating**: the real Speak screens use `useDailyQuota` +
  `quotaLimit` + `enabled: !isPro`. The sandbox does NOT need them — but remember
  `free: true` groups (the tones) are exempt from both.

---

## Checklist

- [ ] Read `usePronunciation.js`, `PronounceStep.jsx`, `group/[groupId].jsx` first
- [x] `hear` and `say` exist in the lab as worked examples (built 2026-08-18)
- [ ] Step schema written out as data, one full lesson
- [ ] `src/data/speakLab.js` created — `src/data/speak.js` untouched
- [ ] `app/speak-lab.jsx` created, wrapped in `<AdminGate>`
- [ ] Linked from the `TOOLS` array in `app/dev.jsx`
- [ ] Runner owns the index and nothing else
- [ ] `default:` branch renders a LOUD placeholder
- [ ] `hear` working and viewed on screen before writing type #2
- [ ] Step components take only `step` — no navigation, no shared state
- [ ] Grep confirms zero references from the real Speak module
- [ ] Placeholder Hmong marked as unverified
