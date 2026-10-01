# Lesson: A/B compare + the everyday-speech lesson script

Two things, in this order: the **A/B compare** control (small, sharp, immediately
useful), then the **lesson script** for everyday speaking phrases.

**You write the code.** This gives you the concepts, the shape, the order, and
the traps. Read `app/speak-lab.jsx` for the existing `hear` and `say` examples.

---

## The decisions this is built on (2026-08-20)

Recorded so you don't re-litigate them mid-build:

| Decision | Why |
|---|---|
| **No gating** — nothing blocks progress | Scoring is absent on level tones and on any phrase without a reference contour. A gate would trap learners on phrases that cannot be scored. |
| **Still show the score + curve** | It is feedback, not a verdict. |
| **Self-assessment + A/B is enough** | Puts a human in the loop exactly where the machine is unreliable. |
| **"Double check"** — key phrases appear TWICE per lesson | Within-lesson spacing. Costs one line of data, biggest retention win available. |
| **No recycling across lessons yet** | Needs a per-word strength model that does not exist. Separate project. |
| **Speech is SEPARATE from vocab** | Speak teaches situations; Words teaches items. Different data, different progress, no cross-imports. |
| **Hardcoded lessons** | Everyday speaking phrases, authored by hand. |

---

# PART 1 — A/B compare

## What we are building

Play the native clip, then your take, then the native clip again. One tap, three
plays, ~5 seconds.

```
   NATIVE  →  YOU  →  NATIVE
   (target)  (attempt) (target again)
```

**Why native FIRST:** auditory pitch memory lasts only a few seconds. If you tap
"play native," hunt for another button, then tap "play mine," the target has
already faded — you are comparing your voice to a memory, not to a sound.

**Why native LAST:** the final thing you hear is what you will imitate on the
next attempt. Ending on your own mistake rehearses the mistake.

**Why three and not four:** ~5–6 seconds, inside working memory. More blurs. An
odd count also ends on the target for free.

**One tap = the whole sandwich.** No infinite auto-loop — a sound with no
obvious stop is hostile.

---

## Section 1 — The concepts, from actual zero

This section assumes nothing. Every idea builds on the one before it. Read it in
order; skipping ahead is what makes Promises feel like magic.

---

### 1.1 A function is a recipe you can run later

Writing a function does **not** run it. It stores instructions under a name.

```js
function greet() {
  console.log('hello')
}
```

Nothing has printed yet. You wrote down a recipe.

**Parentheses are what runs it:**

```js
greet()      // NOW it prints 'hello'
```

Say this out loud, because it comes back later and matters enormously:

> **`greet` is the recipe. `greet()` is cooking it.**

---

### 1.2 Parameters — blanks the caller fills in

```js
function greet(name) {
  console.log('hello ' + name)
}

greet('Devan')    // hello Devan
greet('Pearl')    // hello Pearl
```

`name` is a **parameter** — a blank. `'Devan'` is an **argument** — what you put
in the blank. The blank only exists inside the function.

---

### 1.3 `return` — handing a value back

```js
function double(n) {
  return n * 2
}

const result = double(5)    // result is 10
```

Without `return`, a function hands back `undefined`:

```js
function double(n) {
  n * 2          // computed, then thrown away
}
double(5)        // undefined
```

That is the exact bug from the `.map` lesson — `=> {` with no `return` gives you
a list of `undefined`.

---

### 1.4 Arrow functions — same thing, shorter

These three are the same function:

```js
function double(n) { return n * 2 }      // classic
const double = (n) => { return n * 2 }   // arrow, explicit return
const double = (n) => n * 2              // arrow, implicit return
```

Rules:
- `(n)` — the parameters
- `=>` — "goes to"
- `{ ... }` — a body; you must `return` yourself
- no braces — the expression IS the return value

No parameters? Empty parens:

```js
const sayHi = () => console.log('hi')
```

You will see `() =>` constantly. It means *"a function that takes nothing."*

---

### 1.5 🔑 THE BIG ONE — functions are VALUES

Most people learn functions as "things you call." In JavaScript a function is
also a **value**, like a number or a string. You can store it, pass it around,
and hand it to other code.

```js
const n = 5              // a number in a box
const f = () => 'hi'     // a FUNCTION in a box
```

`f` holds a function. It has not run.

```js
f        // the function itself (not run)
f()      // run it → 'hi'
```

**That distinction is the entire foundation of everything below.**

Because a function is a value, you can pass one INTO another function:

```js
function runItTwice(fn) {     // fn is a parameter holding a FUNCTION
  fn()
  fn()
}

runItTwice(() => console.log('hey'))
// hey
// hey
```

Trace it slowly:
1. `() => console.log('hey')` creates a function. **It does not run.**
2. That function is passed in as `fn`
3. Inside, `fn()` runs it — twice

**Notice you never called it yourself.** You handed it over and let other code
decide when to call it. That is the whole idea of a callback.

#### The mistake everyone makes once

```js
runItTwice(console.log('hey'))    // ✗ WRONG
```

The parens run `console.log('hey')` **immediately**. It prints once, returns
`undefined`, and `undefined` gets passed in. Then `fn()` crashes — you can't call
`undefined`.

> **Rule: parentheses mean RUN IT NOW. No parentheses means HAND OVER THE
> RECIPE.**

This exact mistake appears later with `setTimeout(resolve, ms)` versus
`setTimeout(resolve(), ms)`.

---

### 1.6 Objects — bundles of named values

```js
const dog = { name: 'Pearl', age: 3 }

dog.name      // 'Pearl'
dog.age       // 3
```

`{ }` makes an object. `.name` reads a property.

Objects can hold functions too:

```js
const player = {
  play: () => console.log('playing'),
}
player.play()      // playing
```

That is what `createAudioPlayer()` returns — an object with functions like
`.play()`, `.remove()`, `.addListener()` attached.

**`?.` — the safe dot.** If something might be missing:

```js
status.didJustFinish     // 💥 crashes if status is null
status?.didJustFinish    // undefined if status is null — no crash
```

---

### 1.7 Synchronous code — one line at a time

```js
const a = 2 + 2
const b = a * 10
console.log(b)      // 40
```

Each line completes before the next begins. `a` is definitely `4` by line two.
This is everything you have written so far.

---

### 1.8 Some things CANNOT finish immediately

Playing a 2-second sound takes 2 seconds. If JavaScript froze until it finished,
your entire app would freeze — no taps, no scrolling, nothing drawing.

So JavaScript refuses to wait. It starts the job and moves on:

```js
player.play()          // returns INSTANTLY — sound still playing
console.log('done')    // prints immediately, audio still going
```

> **`play()` returning does NOT mean the sound ended. It means the sound
> STARTED.**

That one fact is the entire problem this feature solves.

---

### 1.9 So how do you learn when it ACTUALLY ends?

You hand the player a function, and **the player calls it for you** when
something happens:

```js
player.addListener('playbackStatusUpdate', (status) => {
  if (status?.didJustFinish) {
    console.log('NOW it really finished')
  }
})
```

Look at what is being passed: `(status) => { ... }` — a function, no parens,
handed over as a value. Exactly §1.5.

You are saying: *"here is a recipe; cook it whenever the status changes."*

That handed-over function is a **callback** — you don't call it, the player
calls you back.

`playbackStatusUpdate` fires many times (loading, position updates, finishing),
so you check `status?.didJustFinish` to catch the one moment you care about.

---

### 1.10 Why callbacks get ugly when you chain them

Three clips in a row, callback-style:

```js
playNative(() => {
  playMine(() => {
    playNative(() => {
      console.log('sandwich done')
    })
  })
})
```

It works. It also marches right across the screen, and every level needs its own
error handling. The nickname is **callback hell**.

We want this instead:

```js
await playNative()
await playMine()
await playNative()
```

Flat. Readable. That is what Promises buy you.

---

### 1.11 A Promise is a buzzer

Restaurant analogy. You order food; they hand you a **buzzer immediately.** The
buzzer is not your food — it is an object that will *tell you* when the food is
ready.

A Promise is that buzzer. Three states:

| State | Meaning |
|---|---|
| **pending** | not finished yet — the starting state |
| **fulfilled** | succeeded — `resolve()` was called |
| **rejected** | failed — `reject()` was called |

It starts pending and changes **exactly once, ever**. After it settles it is
frozen — a second `resolve()` does nothing at all. Remember that; §4.3 uses it.

---

### 1.12 Making one: `new Promise`

```js
const buzzer = new Promise((resolve, reject) => {
  // this code runs IMMEDIATELY
})
```

You pass in one function — called the **executor**. JavaScript hands *it* two
functions: `resolve` and `reject`.

Three things to burn in:

1. **The executor runs right away**, the instant you call `new Promise`.
2. **`resolve` is just a function value** (§1.5). You can hold onto it and call
   it much later, from anywhere.
3. **Nothing settles until you call it.** The Promise sits pending forever
   otherwise.

Smallest real example:

```js
const twoSeconds = new Promise((resolve) => {
  setTimeout(() => {
    resolve()          // buzzer pressed, 2s later
  }, 2000)
})
```

What happened:
- `new Promise` returned instantly, pending
- the executor asked `setTimeout` to run something in 2000ms
- 2 seconds later that inner function ran and called `resolve()`
- the Promise flipped to fulfilled

**`resolve` was called from inside a callback, long after the executor
finished.** That is the whole technique. Everything else is detail.

---

### 1.13 `async` and `await`

`await` means: *pause here until this Promise settles, then continue.*

```js
console.log('before')
await twoSeconds
console.log('after')     // ~2 seconds later
```

Two hard rules:

**1. `await` only works inside a function marked `async`.**

```js
async function demo() {
  await twoSeconds
  console.log('done')
}
```

Without `async` it is a syntax error.

**2. An `async` function ALWAYS returns a Promise** — even if you return a plain
value.

```js
async function demo() { return 5 }
demo()          // a Promise, not 5
await demo()    // 5
```

**`await` does not freeze your app.** It pauses *that one function* while taps,
animations, and everything else keep running. The rest of the app does not care.

---

### 1.14 🔑 THE PATTERN — wrapping a callback in a Promise

Everything so far exists to make this readable.

**You have:** a callback API — "I'll call you when the clip ends."
**You want:** something you can `await`.
**Bridge:** create a Promise, and call `resolve` from inside the callback.

```js
function playToEnd(source) {
  return new Promise((resolve) => {
    const player = createAudioPlayer(source)

    player.addListener('playbackStatusUpdate', (status) => {
      if (status?.didJustFinish) {
        resolve()          // ← the callback presses the buzzer
      }
    })

    player.play()
  })
}
```

Trace it, step by step:

| # | What happens |
|---|---|
| 1 | someone calls `playToEnd(clip)` |
| 2 | `new Promise(...)` runs its executor **immediately** |
| 3 | the executor creates a player |
| 4 | it attaches a listener — handing over a recipe, not running it |
| 5 | it calls `player.play()` — sound starts |
| 6 | the executor is finished; `playToEnd` returns a **pending** Promise |
| 7 | …2 seconds pass, other app code runs freely… |
| 8 | the player fires the callback with `didJustFinish: true` |
| 9 | `resolve()` runs → Promise becomes **fulfilled** |
| 10 | anyone `await`ing it wakes up and continues |

Now chaining is flat:

```js
await playToEnd(native)
await playToEnd(myTake)
await playToEnd(native)
```

Compare that to §1.10. Same behaviour, no nesting.

---

### 1.15 `pause()` — the same trick, smaller

```js
function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

Read it as: make a buzzer, hand the button to `setTimeout`, tell it to press in
`ms` milliseconds.

⚠️ **`setTimeout(resolve, ms)` — no parentheses on `resolve`.** You are handing
over the recipe (§1.5). Writing `setTimeout(resolve(), ms)` would run it
instantly and resolve the Promise before waiting at all.

Then:

```js
await pause(300)      // "stop here for 300ms"
```

---

### 1.16 Check yourself before continuing

If any of these are shaky, reread the section named — the rest of Part 1 assumes
all six.

- [ ] `greet` vs `greet()` — what is the difference? (§1.1)
- [ ] Why does `runItTwice(console.log('hi'))` break? (§1.5)
- [ ] What does `play()` returning actually tell you? (§1.8)
- [ ] What is a callback, in your own words? (§1.9)
- [ ] What are a Promise's three states, and how many times can it change? (§1.11)
- [ ] Where does `resolve` come from, and who calls it? (§1.12, §1.14)

---

## Section 2 — Why you can't just use `useAudio`

Look at [useAudio.js:33-37](../../src/hooks/useAudio.js#L33-L37):

```js
// Tear down the previous one-shot player before starting the next.
if (playerRef.current) {
  try { playerRef.current.remove() } catch {}
  playerRef.current = null
}
```

**`play()` deliberately destroys the previous player every time it is called.**
That is correct for its job — tap a word, hear a word, one at a time. But it
means calling it twice cuts the first clip off mid-sound.

Plus it has no way to tell you when a clip ended — it uses `didJustFinish`
internally to clear its own `playing` state and exposes nothing.

So: your own function. Not a modification of that one.

---

## Section 3 — Two files, and why

Your first attempt put `useState` inside `playToEnd`. That crashes, and the
reason is worth knowing.

**Hooks can only be called during render**, from a component or another hook.
`playToEnd` runs from inside a button press — long after render. React would
throw "Invalid hook call."

The tell: its name doesn't start with `use`, and it takes a `source` argument.

You are actually building two separate things:

| | `playToEnd(source)` | `useAbCompare()` |
|---|---|---|
| what | plain async utility | React hook |
| lives in | `src/lib/playToEnd.js` | `src/hooks/useAbCompare.js` |
| knows React? | **no** | yes |
| owns | one clip's playback | sequence + UI state |
| testable alone? | yes | needs a component |

Same split as `wavDecode.js` (pure logic) versus `usePronunciation.js` (React).
Pure logic in `lib/` is easier to reason about and can be tested in Node.

---


### 3.1 "But shouldn't `playToEnd` be a hook?"

Reasonable instinct, and the answer is: **it can be — but then its shape has to
change.** The version that fails is this one:

```js
export function playToEnd(source) {        // takes a source
  const [playing, setPlaying] = useState(null)   // ✗ hook
  return new Promise(...)                   // returns a Promise
}
```

The problem is not the word "hook." It is that **you would have to call this from
the tap handler**, and hooks can only be called during render. A function that
takes `source` and returns a Promise is inherently called at tap time.

A legitimate hook version splits those two moments apart:

```js
export function usePlayer() {
  const playerRef = useRef(null)

  useEffect(() => {
    return () => { playerRef.current?.remove() }   // cleanup on unmount
  }, [])

  const playToEnd = useCallback((source, opts) => {
    return new Promise((resolve) => { /* … */ })
  }, [])

  return { playToEnd }
}
```

**The hook is CALLED at render; it HANDS BACK a function you call on tap:**

```js
function SayStep({ step }) {
  const { playToEnd } = usePlayer()     // ← render time, legal

  const onCompare = async () => {
    await playToEnd(step.audio)         // ← tap time, also legal
  }
}
```

The hook runs once per render and returns a closure. The closure can run whenever.
That is the move that makes both rules satisfiable at the same time.

### 3.2 Which shape to choose

Both are defensible. The trade is real:

| | plain function in `lib/` | hook in `hooks/` |
|---|---|---|
| unmount cleanup | manual | **automatic via `useEffect`** |
| testable in Node | **yes** | no |
| callable from anywhere | **yes** | only inside components |
| player lifetime | per call | can persist across calls |

**The hook wins on one real thing:** if the user navigates away mid-clip,
`useEffect` cleanup kills the player immediately. With the plain function the
player survives until the clip ends or the timeout fires.

**The plain function wins on testability** — same reason `wavDecode.js` is a plain
module. It can be exercised from a Node script with no React at all.

The scaffolds in this repo use the plain-function split. If you prefer the hook,
`usePlayer()` owning the ref and cleanup is the right shape — `playToEnd` becomes
the function it returns.

### 3.3 The rule underneath all of this

> **Only two things may call hooks: a component, or another hook.**

Not a utility function. Not an event handler. Not a callback.

| | Is it a hook? | May call `useState`? |
|---|---|---|
| `playToEnd(source)` | no — plain function | ❌ |
| `usePlayer()` | yes — starts with `use` | ✅ |
| `useAbCompare()` | yes | ✅ |
| `SayStep()` | it is a component | ✅ |
| the `onPress` handler inside it | no | ❌ |

The `use` prefix is not decoration — it is how React's linter knows which rules to
enforce.

**Why a tap handler fails the test:** React tracks hooks by their call ORDER
during render. A hook called from a tap has no render to attach to, so React
throws "Invalid hook call."

⚠️ Note this is a DIFFERENT constraint from §5.1, where the cancel flag must be a
`useRef` rather than `useState`. That one is about stale closures, not about
whether hooks are allowed. Two separate rules that both happen to involve hooks.

---

## Section 4 — Building `playToEnd`, decision by decision

### 4.1 Resolving the source — the bug you WILL hit

Two kinds of audio go through this function:

- the **native clip**: `'/assets/audio/tones/high.mp3'` — bundled, must be looked
  up in `AUDIO_MAP` via `resolveAudioSrc()`
- **your recording**: `'file:///data/user/0/…/take.wav'` — already a real path,
  must NOT go through `resolveAudioSrc()`

Trace a `file://` uri through [resolveAudioSrc](../../src/lib/audioBase.js#L22):

```
not falsy                            → keep going
it is a string                       → keep going
not http(s)                          → keep going
doesn't start with '/assets/audio/'  →
doesn't start with '/'               → key = '/assets/audio/file:///…/take.wav'
AUDIO_MAP[key] is undefined          →
AUDIO_BASE_URL is ''                 → return null
```

**Returns `null`.** Your own voice silently never plays, no error. Hence a flag:

```js
const resolved = isRecording ? { uri: source } : resolveAudioSrc(source)
```

### 4.2 What if there's nothing to play?

A lesson step may have `audio: ''` (no native recording yet).

**Resolve, don't reject.** A missing native clip should skip that leg of the
sandwich, not blow up the sequence:

```js
if (!resolved) return Promise.resolve()
```

`Promise.resolve()` is an already-fulfilled Promise. `await` on it continues
immediately.

### 4.3 Three ways this can end — and why that needs a flag

| Path | When |
|---|---|
| normal | `didJustFinish` fires |
| timeout | it never fires (bad file, playback error) |
| error | `createAudioPlayer` or `play()` throws |

All three need the same cleanup: clear the timer, remove the player, resolve. So
write **one** `finish()` function and call it from all three.

**But `finish()` can be called more than once.** The clip finishes normally at
2.0s… and the 15-second timer is still armed. At 15s it fires and calls
`finish()` again — removing an already-removed player, which may throw.

So `finish()` guards itself:

```js
let done = false
const finish = () => {
  if (done) return          // ← second and later calls do nothing
  done = true
  clearTimeout(timer)
  try { player.remove() } catch {}
  resolve()
}
```

> The Promise itself already ignores a second `resolve()` (§1.5 — state changes
> once). The flag is for the **cleanup**, not the resolve.

### 4.4 Why cleanup can't live inside the `didJustFinish` block

The TODO asked this. Answer: **the timeout path never enters that block.** If you
wrote:

```js
if (status?.didJustFinish) {
  player.remove()
  resolve()
}
```

…then a clip that never reports finishing leaves the player alive forever. A
leaked native audio object per attempt. `finish()` exists so every exit gets the
same cleanup.

This is the same reasoning as `try/finally`, hand-rolled because you're inside a
Promise executor rather than a try block.

### 4.5 Why `play()` goes LAST

```js
player.addListener(...)   // listen first
player.play()             // then start
```

A very short clip could finish before you attach the listener. Then
`didJustFinish` fires with nobody listening, `resolve()` never runs, and the
Promise hangs until the timeout. Unlikely, but free to prevent.

**General rule: attach listeners before triggering the thing they listen for.**

### 4.6 Picking the timeout

15000 is blunt. To do better you'd need the clip's duration — the player exposes
it once loaded, and `AudioRecording` from `usePcmRecorder` has `durationMs`. A
tighter rule: `duration * 1.5 + 1000`. Fine to start blunt.

---

## Section 5 — Building `useAbCompare`

### 5.1 Why the cancel flag is a `ref`, not state

The sequence runs across several `await`s. It needs to check "should I stop?"
between each. If that flag were state:

```js
const [active, setActive] = useState(false)   // ✗ WRONG
```

…the running function captured `active` at the render where it started. Calling
`setActive(false)` later creates a *new* render with a *new* variable — the
already-running function still sees the old `false`→`true` value forever.

**A ref is one box that never gets recreated.** `activeRef.current` always reads
the current value, even from a function that started three renders ago.

```js
const activeRef = useRef(false)
```

Rule of thumb: **state is for what the UI draws; refs are for what code needs to
read across time.** Here you need both — `running` (a state, so the button
re-renders as "Stop") and `activeRef` (a ref, so the loop can be interrupted).

Same stale-closure family as the `say` step's "score is a separate tap" note.

### 5.2 Checking between every step

```js
if (!activeRef.current) return
```

…before each clip and after each pause. Not once at the top — the user can leave
during the second clip, and you want that to stop the third.

### 5.3 `try/finally` for the reset

`finally` runs whether the block completes, returns early, or throws:

```js
try {
  // the sequence, with early returns
} finally {
  setRunning(false)
  setNowPlaying(null)
  activeRef.current = false
}
```

Without it, an early `return` in the middle leaves `running` stuck `true` and
your button says "Playing…" forever.

### 5.4 Unmount cleanup

```js
useEffect(() => {
  return () => { activeRef.current = false }
}, [])
```

The returned function runs on unmount. If the user navigates away mid-sandwich,
the loop sees `false` at its next check and stops. Same `let active = true`
pattern as the data-fetching lesson.

---

## Section 6 — Wiring it into the app

Both files are scaffolded with TODOs:
`src/lib/playToEnd.js` and `src/hooks/useAbCompare.js`.

### Step 1 — one clip, alone

Before any sandwich. In `/speak-lab`, temporarily:

```js
<Button onPress={async () => {
  console.log('starting')
  await playToEnd(step.audio)
  console.log('ENDED')     // ← must print when the sound stops, not before
}}>test</Button>
```

**If "ENDED" prints immediately, your Promise is resolving too early.** Nothing
else can work until this is right. Test with a step that HAS audio.

### Step 2 — your recording

Same test with the recorded uri and `{ isRecording: true }`. Then deliberately
drop the flag and watch it silently not play — that's §4.1 in the flesh, and
seeing it once will save you an hour later.

### Step 3 — the sandwich

Fill in `useAbCompare`. Test in `SayStep`.

### Step 4 — into `SayStep`

`SayStep` in [app/speak-lab.jsx](../../app/speak-lab.jsx) already has the two
sources you need:

- native: `step.audio`
- your take: `uri` from `usePronunciation()`

Add the hook next to the existing ones:

```js
const { compare, stop, running, nowPlaying } = useAbCompare()
```

Then a button beside "Play my take", enabled only when **both** exist:

```jsx
{uri && step.audio && (
  <Button
    variant="secondary"
    onPress={running ? stop : () => compare(step.audio, uri)}
  >
    {running ? 'Stop' : 'A/B compare'}
  </Button>
)}
```

Note the button does double duty via `running` — same one-button-three-states
pattern as the record button.

### Step 5 — optional: light up the curve

`nowPlaying` is `'native' | 'you' | null`. Pass it to `ToneCurve` and thicken
whichever line is sounding. Connects the sound to the picture.

---

## Section 7 — Checklist

- [ ] "ENDED" logs when the sound stops, not when it starts
- [ ] `finish()` guarded by a `done` flag
- [ ] `clearTimeout` inside `finish()`
- [ ] `player.remove()` on every path
- [ ] listener attached BEFORE `play()`
- [ ] recording passes `{ isRecording: true }`; native clip does not
- [ ] missing audio resolves instead of throwing
- [ ] cancel flag is a **ref**
- [ ] `activeRef.current` checked between every step
- [ ] `try/finally` resets `running`
- [ ] `useEffect` cleanup clears the flag on unmount
- [ ] button toggles to "Stop" while running

## Section 8 — Exercises

**1.** Delete the `if (done) return` guard. Play a clip, let it finish, wait 15
seconds. What happens, and why?

**2.** Move `player.play()` above `addListener`. Does it still work? Why is it
still risky even if it does?

**3.** Change `setTimeout(resolve, ms)` to `setTimeout(resolve(), ms)`. Predict
the result before running.

**4.** Make the cancel flag `useState` instead of `useRef`. Start a sandwich, hit
Stop. Explain exactly why it doesn't stop.

**5.** Point `playToEnd` at a nonexistent path with the timeout removed. How long
is the button stuck? Add the timeout back and confirm recovery.

---

# PART 2 — Speech is separate from vocab

**The decision:** a Speak lesson never imports from `src/data/vocabulary.js`.

**Why it is right:** they answer different questions. Vocabulary answers "what
does `aub` mean?" — an item, drilled with flashcards and SRS, order irrelevant.
Speech answers "how do I greet someone?" — a situation, drilled by saying whole
phrases aloud, order essential.

Forcing one data model to serve both means every phrase needs a word breakdown it
may not have, and every word needs a situation it does not belong to.

**What that means concretely:**

- Speak lesson data holds its OWN phrase text and its OWN audio paths.
- A word appearing in both places is written down twice. **That is fine.**
  Duplication between two systems that change for different reasons is cheaper
  than a shared abstraction that fits neither.
- Progress is tracked separately. Saying `nyob zoo` well does not mark the
  vocabulary entry learned, and vice versa.

Where they MAY touch, later and optionally: a tapped word in a Speak lesson could
deep-link to its dictionary entry. That is a link, not a dependency.

---

# PART 3 — The lesson script for everyday speech

Your lessons are mostly **speech and dialogue**. That changes what step types you
need — `build` (assembling word chips) matters much less than it did in the
generic plan.

## Design it against a REAL lesson

Do not design the schema in the abstract. Pick the actual first lesson —
greetings, or ordering food — write out **every screen a learner will see, in
order, on paper**, then work out what data each screen needs.

The schema falls out of that. Designed the other way round you get fields nothing
uses and missing fields you discover at screen nine.

## Step types you will probably need

```
hear      listen to the whole phrase, before it means anything     ← exists
word      meet one word: Hmong / English / audio                   ← you build
say       record, compare, self-assess                             ← exists (extend it)
dialogue  a short exchange, one turn at a time                     ← you build
```

Note what is missing versus the earlier generic plan: no `build` step. For
everyday speech, going straight from words to the whole phrase matches how people
actually learn a greeting.

## The "double check"

Put important phrases in the script **twice**, separated by other steps:

```
step 3:  say "nyob zoo"
step 4:  word "kuv"
step 5:  say "kuv"
...
step 9:  say "nyob zoo"      ← the same phrase again, ~6 steps later
```

Zero new machinery — the runner does not need to know these are related. The
SPACING is doing the work, and spacing is a property of the script, not the code.

Decide as an authoring rule: how many steps apart, and which phrases earn a
second slot. Write the rule down in the data file so future-you follows it.

## The dialogue step

The closing exchange is where everything gets used at once. Questions to settle
BEFORE building it:

- Does the learner **read both parts**, or only one while the app plays the other?
- Do they **record their turn**, or is this listen-only?
- One turn per screen, or the whole exchange at once with a highlight moving
  through it?

**My suggestion:** app plays speaker A, learner records speaker B, one turn at a
time. It is the closest thing to a real conversation and it reuses `say` almost
unchanged.

---

# PART 4 — Self-assessment, since nothing gates

After a recording, the learner needs to answer "was that right?" — because on
level tones and unreferenced phrases, the machine cannot.

**Keep it to two or three choices.** "Got it / Not sure / Try again" is plenty.
Five-point scales invite deliberation that is not worth the learner's attention.

**Advancing is always allowed** regardless of the answer. The self-assessment is
data about confidence, not a lock.

Where it goes on screen matters: after the score and the curve, so the learner
judges having *seen* the evidence, not before.

⚠️ **Do not compute a "lesson score" out of self-assessments yet.** The moment a
number is shown, people optimize it — and here they would be optimizing a number
they assign themselves.

---

# Build order

1. **`playToEnd()` helper** — one clip, resolves when finished. Test it alone
   with two taps before building anything on top.
2. **The sandwich** — native → you → native, with pauses. Still no UI polish.
3. **Wire it into the `say` step** as one button next to "Play my take."
4. **Self-assessment buttons** under the result.
5. **The `word` step** — smallest new type, proves the switch pattern again.
6. **The `dialogue` step** — after you have decided the three questions above.
7. **Author lesson 1 for real** — real Hmong, real recordings, native-verified.

Do 1 and 2 before anything else. If playback sequencing does not work, nothing
above it matters.

---

# Traps you will actually hit

- **`play()` twice in a row interrupts.** The whole reason `playToEnd` exists.
- **`resolveAudioSrc` on a `file://` uri returns null.** Bundled paths go through
  it; recordings do not. `usePronunciation` has a comment about exactly this.
- **Stale `uri` in a closure.** Same trap the `say` step already documents —
  `stop()` sets state that this render cannot see yet.
- **Hooks before early returns.** If a step returns early for missing audio, the
  return goes below every hook. See [[2026-08-17-page-info-modal-swipe-gesture]].
- **`.map` needs `=> (` not `=> {`** when rendering dialogue turns.
  See [[arrow-function-bodies-and-handlers]].
- **Static style objects only** — never `style={() => ...}`.
  See [[nativewind-function-style-invisible]].
- **Never `key={index}`** on a list whose items reorder. Use a stable id.

---

# Checklist

- [ ] `playToEnd()` resolves on finish AND on timeout
- [ ] Cancellation flag so leaving mid-sandwich stops playback
- [ ] Every player released
- [ ] Native path goes through `resolveAudioSrc`, recording uri does NOT
- [ ] Sandwich is native → you → native, ~300 ms gaps
- [ ] One tap plays it once; no infinite auto-loop
- [ ] Self-assessment appears AFTER the score and curve
- [ ] Advancing works regardless of self-assessment
- [ ] Speak lesson data imports nothing from `vocabulary.js`
- [ ] At least two phrases appear twice in the script, several steps apart
- [ ] Lesson 1 written out on paper before the schema was finalized

---

# Exercises

**1. Prove the interrupt.** Call `play()` twice back to back with two different
clips. Describe exactly what you hear. Now explain it in terms of when `play()`
returns versus when the sound ends.

**2. Break the timeout.** Point `playToEnd` at a nonexistent path. Without a
timeout, what happens to the button? Add the timeout and confirm it recovers.

**3. Test the order claim.** Build both `native → you → native` and
`you → native`. Record a deliberately wrong tone and try each five times. Which
leaves you more able to fix it on the next attempt? **This is a real experiment —
my recommendation is reasoning, not evidence.**

**4. Find the resolution bug on purpose.** Pass your recording's `file://` uri
through `resolveAudioSrc()` and log the result. Why null? Which branch of that
function rejects it?

**5. Author the anti-lesson.** Write a 6-step script that teaches badly — no
repetition, dialogue first, words after phrases. Then say precisely why each
choice is wrong. Knowing the failure mode makes the good version obvious.

---

# PART 5 — What this guide does NOT build (and how to plan each)

The two parts above get you a working A/B compare and a lesson script. Six things
sit between that and a feature real learners can use. **None of them block Part 1
— build the sandwich first.** But each is a decision, so here is enough to plan
them rather than discover them.

---

## 5.1 `SPEAK_ENABLED = false` — the module is switched OFF

`src/lib/launch.js`:

```js
export const SPEAK_ENABLED = false
```

Enforced in five places — `app/(tabs)/speak.jsx` renders `SpeakComingSoon`, and
`speak/[phraseId]`, `speak/group/[groupId]`, `speak/family/[familyId]` all
`<Redirect href="/speak" />`. The home screen hides its daily phrase too.

The comment says *"flip to true once recording + tone scoring work."* **Both now
work.** The flag is stale.

`/speak-lab` bypasses all of it (AdminGate, not the flag), so you can keep
building. But nothing reaches users until this flips.

**To decide:** flipping exposes the EXISTING Speak screens, not your new lesson
flow. Do you flip when the old drills are good enough, or hold until the new
lessons replace them? Those are different dates.

---

## 5.2 Where real lessons live

The lab is a sandbox at an admin route. Real lessons need three things it has none of:

- **A route** — follow the existing shape: `app/speak/lesson/[lessonId].jsx`
- **A list screen** — `app/(tabs)/speak.jsx` already does this for groups
  (`speakGroups.map(...)` around line 126). That is your precedent; read it before
  designing a new one.
- **A place in navigation** — a section on the Speak hub, or its own tab.

**To decide:** do lessons live ALONGSIDE the existing phrase groups, or replace
them? The current hub has daily phrase + word families + groups. Adding a fourth
section is easy; deciding what the hub is *for* is the real question.

---

## 5.3 Progress persistence — decide this SOON

Cheap now, expensive once twenty lessons exist and people have progress in them.

What `ProgressContext` gives you today:

```js
markStepComplete(stepId, { lessonId, lessonComplete })
//   pushes to completedSteps[], +2 XP, bumps the streak
//   with lessonComplete: also pushes to completedLessons[], +10 XP
```

So the machinery exists and is already used by the Learn module. The open
question is **granularity**:

| Option | Consequence |
|---|---|
| One id per LESSON | Simple. No resume — leaving mid-lesson loses everything. |
| One id per STEP | Resume works, XP accrues as you go. `completedSteps` grows fast (20 lessons × ~12 steps). |
| Steps for `say` only | Middle ground: progress on the parts that took effort. |

**My lean: one id per step**, using the existing `stepId` convention from
`src/data/speak.js` (`speak-…` namespaced). It is what `markStepComplete` was
built for, resume is a real quality-of-life win in a 10–15 minute lesson, and the
array is just strings.

⚠️ Whatever you choose, `markStepComplete` is idempotent (`if
(s.completedSteps.includes(stepId)) return s`) — so replaying a step will not
double-count XP. Do not build your own tracking that lacks that property.

---

## 5.4 Quota and Pro gating

Existing drills already do this — copy `app/speak/group/[groupId].jsx`:

```js
const quotaApplies = !group?.free && !isPro
const speakQuota = useDailyQuota('speak', quotaLimit('speak', user.isGuest), {
  enabled: quotaApplies,
  scope: user?.id || 'guest',
})
```

**To decide:** what counts as one unit of quota? A whole lesson, or each
recording? A 10-minute lesson with twelve `say` steps would burn twelve units on
the per-recording reading — almost certainly wrong. **Per lesson is the sane
default.**

Remember `free: true` groups (the tones) are exempt from both quota AND Pro
locks, and `MONETIZATION_ENABLED = false` currently treats everyone as Pro — so
none of this is visible today. It becomes visible the moment that flag flips.

---

## 5.5 Two open items from the scoring work

**Reference contours are still empty.** `src/data/contours.json` is `{}`, so
every phrase returns `reason: 'no-reference'` — the learner sees their own curve
and no number. Fixing it needs the ffmpeg conversion +
`scripts/extract-contours.mjs`. See [[2026-08-18-pronunciation-pipeline-implemented]].

**Level tones cannot be scored at all.** high (`-b`), mid, low (`-s`) differ only
in pitch HEIGHT, and `normalizeContour` deliberately discards height to make
cross-gender comparison work. Contour tones (`-v`, `-j`, `-g`) score fine.

⚠️ **These two interact.** Two of the four candidate fixes for level tones change
what needs storing per reference clip — so **decide the level-tone approach
BEFORE running the extraction**, or you may extract twice. Details and the four
options are in the same note.

This is also why "no gating" was the right call: a gate would trap learners on
exactly the tones the scorer cannot judge.

---

## 5.6 Native audio — the actual long pole

Every phrase in every lesson needs a native recording. Twenty lessons of everyday
phrases is a lot of studio time, and it is the one part of the pipeline that
cannot be done at a keyboard.

The process is already written down in
[[2026-08-18-content-implementation-plan]] under *Content quality pipeline*:
native-speaker audio → natural example sentences → difficulty leveling →
structured review.

**Planning implication:** audio availability, not engine capability, will
determine how fast lessons ship. Author lesson 1 with real recordings before
scripting lessons 2–20, so the true per-lesson cost is measured rather than
guessed.

---

## Planning summary

| # | Decision | Urgency |
|---|---|---|
| 5.3 | Progress granularity | **Decide before authoring lessons** |
| 5.5 | Level-tone approach | **Decide before running extraction** |
| 5.4 | Quota unit | Before `MONETIZATION_ENABLED` flips |
| 5.2 | Lessons alongside or replacing groups | Before the list screen |
| 5.1 | When to flip `SPEAK_ENABLED` | Before users see any of it |
| 5.6 | Recording sessions | Longest lead time — start early |

Nothing here blocks `playToEnd()`. Build that today.
