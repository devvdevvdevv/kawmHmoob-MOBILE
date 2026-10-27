# 10 — Custom hooks

A **custom hook** is a function whose name starts with `use` and that calls other
hooks. That's the whole definition. It lets you take a chunk of stateful logic
(state + effects + handlers) out of a component and reuse it in any screen.
`src/hooks/` is full of them: `useDailyQuota`, `useAudio`, `useQuizState`,
`useExitGuard`.

---

## 1. Start from your code

`src/hooks/useDailyQuota.js` is the best-commented file in the project. Its
outline:

```js
export function useDailyQuota(name, limit, { enabled = true, scope = '' } = {}) {
  const [used, setUsed] = useState(0)          // state
  const [ready, setReady] = useState(false)

  const key = storageKey(scope, name)          // derived

  useEffect(() => { /* load today's count, with the active guard */ }, [key])   // effect

  const remaining = enabled ? Math.max(0, limit - used) : Infinity             // derived
  const exhausted = enabled && used >= limit

  const consume = useCallback(async () => { /* re-read, check, increment, save */ },
    [key, limit, enabled])                                                       // handler

  return { used, remaining, exhausted, ready, consume }                          // the interface
}
```

**Every lesson so far is in this one function.** Options-object params (02),
template strings (01), `useState` (07), an effect with a race guard (05, 07),
derived values (07), `async` + `useCallback` (05, 07), and a returned object
(02 §4). If you can read this file top to bottom and explain every line, you've
mastered Lessons 01–07.

---

## 2. Why hooks are a big deal

Before hooks, sharing stateful logic between components was awkward. Now:

```jsx
// in any screen:
const { remaining, exhausted, consume } = useDailyQuota('quiz', limit, { scope: user?.id || 'guest' })
```

One line, and the screen has a fully working daily quota: loading, resetting at
midnight, guarding races, persisting. The screen doesn't know or care how.

**A custom hook is to stateful logic what a function is to a calculation.**
It names it, hides the details, and makes it reusable.

---

## 3. The rules of hooks (and why they exist)

1. **Only call hooks at the top level** of a component or another hook. Never
   inside `if`, loops, nested functions, or after an early `return`.
2. **Only call hooks from components or other hooks**, not from plain functions in `lib/`.
3. **Name custom hooks `useSomething`.** The linter uses the name to apply rules 1–2.

**Why rule 1?** React doesn't know your hooks by name. It knows them **by
call order**: "the 1st `useState` in this component, the 2nd `useState`, the
1st `useEffect`…". If an `if` skips a hook on some renders, every hook after it
shifts one slot, and they all get each other's state. So:

```jsx
if (!user) return null
const [open, setOpen] = useState(false)   // ❌ only called when there's a user, so the order changes
```

Move every hook **above** the early return. You'll see `_layout.jsx`'s
`RootLayout` does exactly that: `useFonts` and `useEffect` come first, and
`return null` only after.

---

## 4. Designing a hook: think about the interface first

Before writing a hook, write down **how a screen will use it**. That's its
interface.

`useDailyQuota`'s interface:

| Goes in | Comes out |
|---|---|
| `name`: which feature | `used`, `remaining`: numbers for a badge |
| `limit`: how many per day | `exhausted`: a boolean to gate on |
| `{ enabled, scope }`: Pro? whose? | `ready`: don't trust the numbers until true |
| | `consume()`: spend one, tells you if allowed |

Notice the `ready` flag. Storage is async (Lesson 05), so on the first render
`used` is `0` *before it's actually been loaded*. Without `ready`, a screen
would flash "5 remaining", then jump to "1 remaining". **Every hook that
loads something async should expose a loading/ready flag.**

### Hook vs `lib/` function vs context

| If the logic… | It's a… |
|---|---|
| needs no React (pure calculation) | `lib/` function |
| needs state/effects, and **each** user of it gets its **own** copy | custom hook |
| needs state, and every screen must share **one** copy | context (+ a `useX` hook to read it) |

Two screens calling `useDailyQuota('quiz', …)` each get **separate** `used`
state. They stay consistent only because `consume()` re-reads storage (see the
comment on line 83). If they needed to share live state, it would have to be a
context.

---

## 5. Keep the logic out of the hook when you can

A good hook is a **thin React shell around pure logic**. `useDailyQuota` keeps
the "is it a new day?" rule tiny (`stored.date === today`) and gets `dayKey()`
from `lib/daily.js`. `useQuizState` keeps all its logic in a pure reducer.
The pure parts are testable in Node (like your practice files); the hook only
wires them to React.

---

## Practice

1. **Annotate.** Copy `useDailyQuota.js` line by line into your notes, from memory
   where you can, and label every line with the lesson number it uses.
2. **Write `useToggle`.** In your playground:
   `const [on, toggle] = useToggle(false)`. Return an array like `useState`
   does. `toggle` must be stable (`useCallback`) and must use a functional
   update. Use it for the "show English" switch on your word cards.
3. **Write `useStoredState(key, initial)`.** It works like `useState`, but it
   persists, using everything from Lesson 07 practice step 4:
   - returns `[value, setValue, ready]`
   - loads from `loadJSON` on mount and when `key` changes, with the `active` guard
   - saves on change, with the `hydrated` guard
   Then replace the persistence code in your playground with one line:
   `const [words, setWords, ready] = useStoredState('playground.words', START_WORDS)`.
   Notice how much shorter the screen got. That's the point of hooks.
4. **Break rule 1.** Put a `useState` after an `if (…) return` in your
   playground and read the lint warning (`npm run lint`) and the runtime error.
5. **Stretch.** Read `src/hooks/useAudio.js`. It uses `useRef` for the player
   and the timer. Explain in a comment why those are refs and not state
   (`learning/concepts/useref-vs-usestate.md` will help).

---

## You can now…

- [ ] say what makes a function a custom hook
- [ ] explain *why* hooks can't go inside an `if` (call order)
- [ ] design a hook's interface before writing it, including a `ready` flag
- [ ] choose between a `lib/` function, a hook, and a context
- [ ] write `useStoredState` yourself, from a blank file
