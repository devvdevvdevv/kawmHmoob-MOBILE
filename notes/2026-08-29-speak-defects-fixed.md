# Four speak-module defects fixed

**2026-08-29** · `usePronunciation.js`, `usePcmRecorder.js`, `pronounceScore.js`,
`LessonSteps.jsx`, `speakLessons.js`

Everything on the open list that did not need a decision, a recording, or a
device. What remains blocked is listed at the bottom.

---

## 1. Recording had no ceiling

Neither recorder had a `maxDuration` or any timer. Tap Record, pocket the phone,
and it runs until the app dies.

That is not a tidiness problem. 44.1kHz 16-bit mono is **~5MB per minute**, and
`wavDecode` loads the whole file into a single `Float32Array` to analyse it. A
ten-minute accident is a ~26-million-sample array.

```js
const MAX_RECORDING_MS = 15000
```

Deliberately generous — nothing this module teaches is longer than a sentence —
so **hitting the ceiling means something went wrong**, not that someone was being
thorough. `stop()` clears the timer, so it only ever fires when the learner did
not stop themselves; it warns in `__DEV__` when it does.

## 2. Takes were never deleted

`grep -c deleteAsync` was **0** across both hooks. Every recording a learner ever
made stayed in the app sandbox forever — and the app is one that invites you to
record the same phrase repeatedly.

```js
async function discardTake(uri) {
  if (!uri) return
  try { await FileSystem.deleteAsync(uri, { idempotent: true }) } catch {}
}
```

Called on three paths: starting a new recording, `reset()` ("Try again"), and
unmount. `idempotent: true` so an already-replaced file is not an error.

⚠️ The unmount path needs a **ref, not state** — `uriRef` mirrors `uri` — because
the cleanup closure captures the value from the render it was created in and
would otherwise delete a stale path, or nothing at all.

> **Dropping a reference is not releasing a resource.** Setting `uri` to `null`
> made the file invisible to the UI and permanent on disk.

## 3. Microphone denial was a dead end

`status === 'denied'` only set `disabled` on the Record button. No reason, no way
forward.

⚠️ On iOS this is terminal: once refused, the OS **will not ask again**, so an
in-app retry cannot work. The only route back is the system Settings app. That
learner had silently and permanently lost the module.

New `MicDeniedNotice` — used in all three recording steps — explains the state
and offers `Linking.openSettings()`, plus the honest note that playback and
practising aloud still work.

## 4. The score was a bare number

A learner shown `71` cannot know whether that is good. The module has twice
refused to over-claim — no gating on the score, no aggregating it into a streak —
and a naked number quietly contradicts both, because people optimise whatever
number you show them.

`scoreBand()` now returns three coarse buckets: **Close** / **Not far off** /
**Different shape**, each with a one-line next action.

⚠️ **The thresholds are not calibrated.** `contours.json` is still `{}`, so
nothing has been checked against human judgement. They are coarse *for that
reason* — three buckets can be approximately right where two digits cannot.
Re-tune once real contours and real takes exist.

The raw number is kept, small and dimmed, because the scorer is still being
tuned and it is useful while calibrating. It should probably go before release.

---

## Also fixed

**`SayStep` could record its own playback.** The transient guard `RecallStep`
got is now on `SayStep` too — recording while a clip sounds captures that clip
through the mic, and the take is then scored against audio it already contains,
which inflates the score. See [[2026-08-29-recall-lock-deadlock]].

**Two lessons ended on `listen`.** Not by design — the closing dialogue that used
to follow was commented out, and `listen` became the ending by accident. It was
placed late but deliberately *not last*.

Farewells already showed the intended shape, so the other two were moved to
match it:

| | steps | ends on | listen at |
|---|---|---|---|
| Greetings | 18 | `recall` | 12/18 |
| Farewells | 12 | `recall` | 11/12 |
| Thanks & Sorry | 16 | `recall` | 15/16 |

All three now close on **production**, which is the skill speaking actually
demands. Data-only; the steps were moved by walking their `{ … },` block, not by
line number.

---

## Verification

- Babel parse — all six touched files
- `check-undefined-refs.mjs` — 182 files, clean
- `check-lesson-audio.mjs` — all paths resolve
- `pronunciation-selftest.mjs` — ALL PASS
- Runtime: all three lessons end on `recall`

⚠️ **None of this is verified on a device**, and two of these fixes are
specifically device-shaped: the auto-stop timer and file deletion only really
exist at runtime. Worth a pass with:

- record and wait 15s without stopping → does it stop itself?
- record, re-record, leave the lesson → does storage stay flat?
- deny the mic → does the notice appear, and does Settings open?

---

## Still blocked, and on what

| item | blocked on |
|---|---|
| Level-tone approach | **a decision** — and it gates contour extraction, so it is the only item with a deadline |
| Contour extraction (`contours.json` = `{}`) | that decision + ffmpeg |
| Thanks & Sorry at 40% audio | 2 recordings (`Thov txim`, `Tsis ua li cas`) |
| 7 placeholder lessons | real content |
| Paywall testing | `MONETIZATION_ENABLED = false` — a launch flag, so your call |
| Cross-lesson recycling | nothing technical; it is a content/authoring decision |
