
# Concept: `useRef` vs `useState` — the photocopy and the whiteboard

Both survive across renders. The difference is **what your code is holding onto.**

---

## `useState` hands each render its own photocopy

```js
const [active, setActive] = useState(true)
```

Render #1 creates a variable holding `true`. Any function created during render
#1 captures **that** variable, forever.

`setActive(false)` does not change it. It triggers render #2, which creates a
**brand new** variable holding `false`. Render #1's function is still looking at
render #1's copy — and it says `true` for the rest of its life.

## `useRef` is one shared whiteboard

```js
const activeRef = useRef(true)
// activeRef is literally: { current: true }
```

There is exactly ONE box, and every render gets the same box.
`activeRef.current = false` erases the whiteboard and writes the new value.
Anyone who looks — whenever they look — sees what is on it **now**.

---

## Why the `.current` hop exists

The box has to stay the same object forever; that is what makes it shared. If the
ref WERE the value, `activeRef = true` would just repoint your local variable and
nobody else would see it.

**The box never changes. The contents do.**

```js
activeRef.current              // read
activeRef.current = true       // write
```

⚠️ **Forgetting `.current` on a read is silent.** `activeRef` is an object, and
objects are always truthy:

```js
if (activeRef) return          // ✗ ALWAYS true
if (activeRef.current) return  // ✓ reads the boolean
```

---

## The case that forced this: `useAbCompare`

`compare()` starts, then sits at an `await` for two seconds. The user hits Stop.

```js
// with state — BROKEN
await playToEnd(native)
if (!active) return        // reads the photocopy from when compare() STARTED.
                           // Still true. Never stops.
```

```js
// with a ref — WORKS
await playToEnd(native)
if (!activeRef.current) return   // looks at the whiteboard NOW. Sees false. Stops.
```

**The function outlives the render that created it.** That is the entire problem,
and it is the same family as the stale-closure note in the `say` step (`stop()`
sets `uri`, but this render's closure still holds the old one).

---

## The decision rule

**Ask: does the screen need to redraw when this changes?**

- **yes** → `useState`
- **no** → `useRef`

Then one follow-up that catches the rest:

**Does code need to read the latest value AFTER an `await`, a timer, or a later
event?**

- **yes** → must be `useRef`. State would be stale.

### Worked examples from this repo

| Value | Which | Why |
|---|---|---|
| `running` (useAbCompare) | state | button redraws "A/B compare" → "Stop" |
| `nowPlaying` | state | curve thickens the sounding line |
| `activeRef` | **ref** | read after `await` |
| `playerRef` (usePronunciation) | **ref** | teardown later; screen doesn't care |
| `index` (LessonRunner) | state | progress bar + step must redraw |
| `alreadyFinished` (playToEnd) | plain `let` | lives inside ONE call, never crosses a render |

That last row matters: if a value does not need to survive between renders at
all, **you do not need a hook.** A plain `let` is correct.

### When you need BOTH

`useAbCompare` holds the same concept twice: `running` (state, for the button)
and `activeRef` (ref, for the loop). Two consumers, two representations — one
draws, one reads later.

It feels redundant right up until you hit the bug.

---

## The one-liner

> **State is what the screen saw. A ref is what's true now.**

They agree most of the time. They diverge exactly when a function outlives the
render that made it — every `await`, every `setTimeout`, every stored handler.

---

## Why `useAbCompare` is a hook at all

Because the UI has to SEE the sequence. Two lanes, opposite directions:

```
state  →  React reads it    →  screen updates
ref    ←  the loop reads it  ←  is it still true after the await?
```

If only the ref were needed, it would not have to be a hook — a plain object
would do. **It is a hook because of the state half.**

Useful rule for future hooks: **if no component needs to re-render because of it,
it probably should not be a hook.** Make it a plain function or module —
`playToEnd` and `wavDecode` are exactly that.

---

# Exercises

**1. Watch the photocopy go stale.**
In `useAbCompare`, swap `activeRef` for `useState`. Start a sandwich, hit Stop.
Add a log inside the loop printing the value it sees. Explain why it never
changes.

**2. Forget `.current`.**
Change `if (activeRef.current) return` to `if (activeRef) return` in the
double-tap guard. Predict what happens BEFORE running: does A/B compare work,
never work, or always work?

**3. Make a ref that should be state.**
Change `running` from state to a ref. Does the loop still work? Does the button
still say "Stop"? Explain which half broke and why.

**4. Find the value that needs no hook.**
`alreadyFinished` in `playToEnd` is a plain `let`. What would break if it were
`useState`? (Two reasons — one about hooks rules, one about renders.)

**5. Audit the codebase.**
Grep for `useRef` across `src/`. For each one, decide in a sentence whether it is
there for "read later" or for "hold a native object I must tear down." Both are
valid; naming which is which is the skill.
