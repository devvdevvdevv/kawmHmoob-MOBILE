# 07 — State and effects

Lesson 06 ended with a counter that wouldn't count. The fix is **state**:
memory that survives between renders and tells React to render again when it
changes. Then **effects**: how a component reaches outside itself (storage,
timers, the router) without breaking the "rendering is pure" rule.

Read `learning/concepts/useref-vs-usestate.md` after this lesson; it's the
natural follow-on.

---

## 1. Start from your code

`src/context/NotebookContext.jsx`:

```jsx
const [state, setState] = useState(initialState)
const [hydrated, setHydrated] = useState(false)

// LOAD when the user changes
useEffect(() => {
  let active = true
  setHydrated(false)
  loadJSON(KEY_PREFIX + userId, initialState).then((next) => {
    if (!active) return
    setState({ ...initialState, ...next })
    setHydrated(true)
  })
  return () => { active = false }
}, [userId])

// SAVE whenever state changes (but only after loading)
useEffect(() => {
  if (!hydrated) return
  saveJSON(KEY_PREFIX + userId, state)
}, [userId, state, hydrated])
```

That's a complete "persisted state" system in 20 lines. By the end, you'll be
able to write it from scratch.

---

## 2. `useState`

```jsx
const [count, setCount] = useState(0)
```

- `useState(0)`: "give this component a memory slot, starting at 0."
- It returns a pair (an array, so you destructure **by position**, Lesson 03 §6):
  the **current value** and a **setter**.
- Calling `setCount(5)` does two things: stores 5, and **schedules a re-render**.
  On that next render, `count` is 5.

### State is a snapshot

The most surprising rule:

```jsx
function onPress() {
  setCount(count + 1)
  console.log(count)     // still the OLD value!
}
```

Inside one render, `count` is a **constant** (it's literally a `const`).
`setCount` doesn't change it; it asks for a *future* render with a new value.
Think of each render as a photograph: the variables in it never change.

### Functional updates: when the new value depends on the old

```jsx
setCount(count + 1)
setCount(count + 1)          // both read the same snapshot → +1, not +2 ❌

setCount((c) => c + 1)
setCount((c) => c + 1)       // each gets the latest value → +2 ✅
```

**Rule: if the next state is computed from the previous state, pass a function.**
Every update in `NotebookContext.jsx` does this: `setState((s) => ({ ...s, … }))`.
It's always correct, even when updates pile up or the callback is stale (see §6).

### Objects in state: replace, don't mutate

From Lesson 03 §5: `setState` with the **same object**, even if you changed its
insides, looks like "no change" to React. Always hand it a **new** object:

```jsx
state.notes.push(note); setState(state)                 // ❌ same reference → no re-render
setState((s) => ({ ...s, notes: [note, ...s.notes] }))  // ✅ new object
```

### Derived values: don't store what you can calculate

```jsx
const savedWordCount = Object.keys(state.savedWords).length
```

`NotebookContext` doesn't keep a `count` state. It **derives** it every render.
If it stored both, they could disagree (a word gets saved, someone forgets to
bump the count). `src/lib/pathProgress.js` is built entirely on this idea:
*"COMPLETION IS DERIVED, AND SO IS UNLOCKING… never from a stored flag that
could disagree with it."*

> 🧠 **Before adding a `useState`, ask: can I calculate this from state I
> already have?** If yes, calculate it. This one habit removes a whole family
> of bugs.

---

## 3. `useEffect`: stepping outside

Rendering must be pure. But apps must also *do* things: read storage, hide the
splash screen, redirect to onboarding. Effects are where those go.

```jsx
useEffect(() => {
  // runs AFTER the render has reached the screen
  return () => { /* optional cleanup */ }
}, [dependencies])
```

### The dependency array decides WHEN

| Array | Runs |
|---|---|
| `[userId]` | after the first render, then again whenever `userId` changes |
| `[]` | once, after the first render |
| *(missing)* | after **every** render, which is almost never what you want |

React compares each dependency with its value last render (using `===`).
Changed → re-run the effect.

**The rule: every value from the component that the effect *uses* goes in the
array.** The `react-hooks/exhaustive-deps` lint rule in `eslint.config.js`
checks this for you. The comment there says why: *"The dependency array is where
stale-closure bugs come from."* Don't silence that warning; fix it.

### Cleanup

The function you `return` runs **before the effect runs again** and **when the
component disappears**. Use it to undo what the effect started: flip an
`active` flag (Lesson 05 §6), clear a timer, unsubscribe from a listener.

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)     // otherwise the timer keeps running forever
}, [])
```

### Reading the notebook's two effects

1. **Load effect `[userId]`**: when the user changes (guest → signed in),
   load *that user's* notebook. `hydrated` goes false during the load and true
   after.
2. **Save effect `[userId, state, hydrated]`**: whenever the notebook
   changes, write it. The guard `if (!hydrated) return` is critical: without
   it, the very first render would **save the empty `initialState` over the
   real saved notebook** before the load finished. That's data loss. (See
   `learning/concepts/stored-null-guard-pattern.md`.)

---

## 4. You probably don't need an effect

Effects are for **syncing with things outside React**. They're the wrong tool for:

| Instead of… | Do this |
|---|---|
| an effect that sets state from other state | derive it during render (§2) |
| an effect that runs because a button was pressed | put the code in the `onPress` handler |
| an effect that resets state when a prop changes | give the component a `key` that changes (Lesson 06 §7) |

A useful test: **"Why does this code run?"** If the answer is "because the user
did X", it belongs in X's handler. If it's "because the component is showing
and needs to be in sync with Y", that's an effect.

---

## 5. `useMemo` and `useCallback`: keeping the same reference

Every render re-runs the whole function body. That means every object and
arrow function in it is **brand new** each render, a new reference.

Usually harmless. It matters when that object or function is:
- passed to a context (every consumer re-renders when the value is a new object), or
- listed in another hook's dependency array (the effect re-runs every render).

```jsx
const saveWord = useCallback((wordId) => { … }, [state.savedWords])   // same function until savedWords changes
const value = useMemo(() => ({ ...state, saveWord, … }), [state, saveWord, …])   // same object until a dep changes
```

- `useMemo(() => value, deps)` remembers a **value**.
- `useCallback(fn, deps)` remembers a **function**. (It's `useMemo(() => fn, deps)`.)

Don't sprinkle them everywhere; they have a cost too. Use them for context
values, for functions handed to providers or dependency arrays, and for truly
expensive calculations.

---

## 6. The stale closure

From Lesson 02 §7: a function remembers the variables of the render it was
created in. If it's created once and kept around (by `useCallback` with missing
deps, an empty-deps effect, or a `setInterval`), it keeps seeing **old** state forever.

```jsx
useEffect(() => {
  const id = setInterval(() => setSeconds(seconds + 1), 1000)   // `seconds` is frozen at 0
  return () => clearInterval(id)
}, [])
// shows 1, 1, 1, 1… forever
```

Two fixes:
1. A functional update: `setSeconds((s) => s + 1)`. No need to read `seconds` at all. ✅ Best.
2. Put `seconds` in the deps. That works, but recreates the interval every second.

Look at `saveWord` in `NotebookContext.jsx`: it reads `state.savedWords` directly
(to return true/false immediately), so `state.savedWords` **must** be in its deps,
and it is. `unsaveWord` only uses a functional update, so its deps are `[]`.
Compare the two and you understand stale closures.

---

## Practice (in your playground)

Continue in `app/playground.jsx`:

1. **Fix the counter** from Lesson 06 with `useState`. Add a "+2" button that
   calls the setter twice. Make it actually add 2.
2. **Derived, not stored.** Keep a `words` array in state with a `saved`
   boolean on each. Add a tap-to-toggle on each card (immutable update with
   `.map`, Lesson 03). Show "3 of 5 saved" at the top, **derived** with
   `.filter(…).length`. There's no count state.
3. **An effect with cleanup.** Add a "seconds on this screen" timer with
   `setInterval`. Navigate away and back. Then remove the cleanup and see
   what happens (watch for the warnings and the doubled speed), and put it back.
4. **Persist it.** Save the `words` array with `saveJSON` from `src/lib/storage.js`
   and load it on mount with `loadJSON`, using the **hydrated guard**. Test:
   toggle a word, reload the app (press `r` in Metro), and it should still be toggled.
   Then remove the guard and explain, in a comment, what goes wrong.
5. **Read, don't write.** Open `src/hooks/useDailyQuota.js` and, for each
   `useState` and `useEffect`, write in your notes: *what it stores / when it runs /
   what its cleanup does*.

---

## You can now…

- [ ] explain why `console.log(count)` after `setCount` shows the old value
- [ ] say when to use `setX((prev) => …)` instead of `setX(value)`
- [ ] decide between storing a value and deriving it
- [ ] read any dependency array and say exactly when the effect runs
- [ ] explain why the notebook's save effect needs `if (!hydrated) return`
- [ ] spot and fix a stale closure in a `setInterval`
- [ ] explain what `useCallback` and `useMemo` keep stable, and why a context value wants that
