# Concept: a hook creates state, it doesn't share it — and there is only one speaker

Thirty people can each hold a remote control. There is still one television.

That sentence is the whole bug this note is about. It cost a week of "sometimes
the audio just stops working, and only restarting fixes it."

---

## A hook hands every caller its own copy

```js
function useAudio() {
  const [playing, setPlaying] = useState(null)
  const playerRef = useRef(null)
  // …play(), stop()
}
```

Read that as a **factory**, not a shared service. Every component that calls it
gets its own `playing`, its own `playerRef`, its own timers. That is not a quirk
to work around — it is the entire point of hooks, and it is right for almost
everything. A form field's draft text, whether a card is flipped, which tab is
open: all of those *should* be private per component.

`AudioButton` called `useAudio()` itself, and the app renders one button per
word:

```
AudioButton "dej"   →  useAudio()  →  player A · playing A · watchdog A
AudioButton "siab"  →  useAudio()  →  player B · playing B · watchdog B
AudioButton "mov"   →  useAudio()  →  player C · playing C · watchdog C
          … × 30 rows in a word set
```

Thirty owners. One speaker.

---

## What goes wrong, in the order you notice it

**1. Nothing stops anything.** Press "siab" while "dej" is playing. B starts a
clip and tears down *its own* previous player — but A's player is not B's, so A
keeps going. Two clips at once, and no code anywhere is wrong when read on its
own.

**2. Handles pile up.** Each press leaves another live native player. A native
player is not a JavaScript object you can forget about; it holds a real decoder
and a real slot in the OS audio pool. On Android that pool is finite, and
exhausting it does not recover inside the process. *That* is the lag followed by
total silence.

**3. The escape hatch cannot reach.** `AudioButton` renders a stop glyph while
playing, and pressing it calls `stop()` — its own `stop()`. The button in front
of you cannot release a player belonging to a row you scrolled past, or a screen
you left. So the only way out is restarting the app.

The cruel part: **the isolation is what let them pile up.** They did not
interfere with each other — they could not SEE each other. Each instance was
behaving perfectly inside a world containing exactly one button.

---

## The fix: move the state, keep the hook

State that must be unique across the whole app lives **outside** the hook, at
module scope. The hook stops being an owner and becomes a window.

```js
// module scope — ONE of each, for the whole app
let player = null
let playingId = null
const listeners = new Set()

function release() { /* …stop, free, notify… */ }

export function useAudio() {
  // a window onto the shared value: re-renders this component when it changes
  const playing = useSyncExternalStore(subscribe, () => playingId)
  return { play, playing, stop: release }
}
```

Three things fall out of it for free, and each one was a separate bug before:

| | before | after |
|---|---|---|
| Starting a clip | released only your own player | releases THE player, whoever started it |
| `playing` | private, so every instance read `null` | one value, true everywhere |
| `stop()` | reached your own player only | any stop glyph in the app is a way out |

The API did not change — `{ play, playing, stop }` — so no call site needed
editing. **Where state lives is invisible to the caller, which is exactly why it
is easy to get wrong and easy to fix.**

### The dead guard this also repaired

`LessonSteps.jsx` had this, to stop a recording from starting while a clip is
sounding (the mic would capture the clip):

```js
const { playing: soundingId } = useAudio()   // a DIFFERENT instance
```

It read a `playing` that only the button's own instance ever set, so it was
always `null` and the guard never fired once. Nothing looked broken, because an
unfired guard produces no error — just a slightly worse recording, sometimes.
**Per-instance state does not announce itself; it just quietly answers "no".**

---

## The same idea in twelve lines, away from audio

Audio drags in native players and watchdogs. Here is the whole lesson with
neither — a counter, in its own file, which is as small as a custom hook gets.

```js
// src/hooks/useCounter.js
import { useState } from 'react'

export function useCounter(start = 0) {
  const [count, setCount] = useState(start)
  const increment = () => setCount((c) => c + 1)
  const reset = () => setCount(start)
  return { count, increment, reset }
}
```

That is all a custom hook is: **a plain function that calls other hooks.** No
registration, no special syntax — the `use` prefix only exists so React's lint
rules know to check the call order.

`start` is the SEED, and React reads it **on the first render only**. After that
the stored value wins and the argument is ignored, which is the classic surprise:

```jsx
useCounter(props.start)   // props.start later changes 0 → 10
                          // count does NOT follow — it was already seeded
```

It earns its keep afterwards anyway, because `reset` closes over it — "back to
where this counter began", not a hardcoded 0.

And `useState` rather than a plain `let count = start`? You need both halves of
what it does: a `let` would be **recreated on every render** (snapping back to
`start` constantly), and reassigning it would **never tell React to re-render**,
so the new number would never reach the screen.

### Render it twice — this is the whole bug, in miniature

```jsx
<Likes />   {/* count: 0, 1, 2… */}
<Likes />   {/* its own count, entirely separate */}
```

Two independent counters, because `useState` ran twice — once per component.
**Perfect for likes. Fatal for a speaker.**

Now the shared version. Same call site, same return shape; the only difference is
where the variable lives:

```js
// one value for the whole app — note: OUTSIDE the function
let count = 0
const listeners = new Set()

export function useSharedCounter() {
  const value = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => count,
  )
  const increment = () => {
    count += 1
    listeners.forEach((l) => l())   // ⚠️ ring the doorbell yourself
  }
  return { value, increment }
}
```

Inside the function: one copy per component, and React tracks it. Outside: one
copy for the app, and **React has no idea it changed** — which is why the
notification is manual. Forget it and you get the nastiest version of this bug:
the value is correct and the screen is stale.

That `listeners.forEach` is `emit()` in `useAudio.js`, and `count` is
`playingId`. Nothing else about the audio fix is different.

**Try it before reading on:** build `useCounter`, render it twice, confirm the
counts are independent. Then move `count` outside the function and watch what
breaks until you add the notification.

---

## The tell, for next time

> If a hook holds a handle to something there is only ONE of —
> the speaker, the microphone, a socket, a native session, a websocket, a
> lock — then per-instance state is a bug waiting for a busy screen.

Ask: *what happens if this component is on screen twenty times at once?*

- "Twenty independent values" → `useState` is right. Keep it in the hook.
- "Twenty handles to one thing" → module scope (or a context), and the hook is a
  window.

### The deliberate exception in this app

The recorders (`usePronunciation`, `usePcmRecorder`) create their own players and
keep their own state, and that is correct: the **microphone and the speaker are
different resources**, and a recorder playing a take back is a different job from
a flashcard sounding a word. What they do share is the audio SESSION, which is why
those files are full of `setAudioModeAsync` calls in `finally` blocks — a shared
resource handed back and forth needs a hand-off, and a hand-off that only happens
on the happy path is the same bug in a different coat.

---

## It happened again — with a preference, not a device (2026-10-24)

The speaker is a device: there is literally one. But the same bug turned up a
month later with something that is not a device at all — a **setting**.

`useVoicePrefs()` was written for the Male/Female voice switch by copying
`readingPrefs.js`, with `useState` inside the hook. Two components called it on
the same screen: the toggle (which WRITES the voice) and `LetterGrid` (which
READS it to choose a clip). Two calls, two private copies. Tapping Female turned
the pill clay and saved to storage — and the grid kept playing the male clip,
because its copy was still the `'male'` it read at mount.

So the tell above needs a second line:

> If a hook holds a handle to something there is only ONE of — **or a value that
> one component writes while another reads it** — per-instance state is a bug.

The question to ask is not "is this a device?" but **"is there one true answer
that several components must agree on?"** One speaker, one microphone, one
chosen voice, one signed-in user — all the same shape.

The fix was the same shape too: the value moved to module scope, and the hook
became a window onto it via `useSyncExternalStore`. Walkthrough:
[second-voice-audio-guide.md](../feature-logic/second-voice-audio-guide.md).

**Why `readingPrefs` is still fine:** one screen reads the text size at a time.
One reader means one copy, and one copy cannot disagree with itself. It becomes
a bug the day a second component needs it while the first is still mounted.

---

## Prove you understand it

1. A list renders 30 `AudioButton`s. Before the fix, how many native players
   could be alive at once, and what releases them?
2. Why did the stop glyph work on the button you were looking at, but not fix the
   app?
3. `LessonSteps` read `playing` and always got `null`. Why is that harder to
   notice than a crash?
4. You add `useCountdown()` for a quiz timer, used by three components. Module
   scope or in the hook? What if it were `useWakeLock()`?
5. After the fix, one instance unmounts while a clip is playing (the row scrolls
   away). Should the clip stop? What does the code do, and why?

<details>
<summary>Answers</summary>

1. Up to 30 — one per button pressed. Only that button's own `play()`, its own
   15s watchdog, or its own unmount released it.
2. `stop()` was that instance's `release`. It could only reach the player its own
   `play()` created; every other instance's player was unreachable from there.
3. A guard that does not fire produces no error and no visible difference — just
   a worse recording now and then. A crash tells you where it is; a silent "no"
   never does.
4. `useCountdown` is per-instance state (three timers are three timers) — keep it
   in the hook. `useWakeLock` is one device-wide resource — module scope, with
   reference counting so the last release actually releases.
5. It should stop, because leaving a screen should silence it — but ONLY if that
   instance started it. The code tags the starter (`owner`) and releases on
   unmount only when `owner === me`, so a recycled list row cannot cut off a clip
   another screen started.

</details>

---

## Where this happened

- `src/hooks/useAudio.js` — the shared player, with the whole argument in its
  header comment
- `src/components/common/AudioButton.jsx` — the per-word caller, unchanged
- `src/lib/voicePrefs.js` — the second time: a shared preference (2026-10-24),
  with the per-component version's failure written into its header
- `notes/2026-09-30-audio-stuck-playback-fix.md` — the watchdog, added when the
  stuck state was first reported. It made a wedged button recover after 15s; it
  could not fix the cause, because the cause was the shape of the state.
