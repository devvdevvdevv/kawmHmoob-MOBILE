# 10b — Hooks and libraries: the field guide, then six things to build

Lessons 07–10 taught *how* hooks work. This lesson is the **field guide**:
every hook your app uses, what each is for, the libraries behind them, and
how to pick up a new one from its docs. Then it ends with **six build
projects**: real, new improvements to KawmHmoob that **you code yourself**.

> Do this lesson **after Lesson 10**. The projects use everything from 01–10.

---

# Part A: React's own hooks (the toolbox)

Every hook answers one question. Learn the question, and you'll know which to reach for.

| Hook | The question it answers | In your app | Lesson |
|---|---|---|---|
| `useState` | "I need to **remember** a value, and the screen should update when it changes." | `const [used, setUsed] = useState(0)`: `useDailyQuota.js` | 07 |
| `useEffect` | "I need to **sync with something outside React**: storage, a timer, a listener, the network." | load the notebook when `userId` changes: `NotebookContext.jsx` | 07 |
| `useRef` | "I need to **remember** something **without** re-rendering, or **point at** a real element." | `playerRef` (the audio player): `useAudio.js` | 07, below |
| `useMemo` | "This **value** is costly or must keep the **same reference** until its inputs change." | the notebook context `value` | 07 §5, 09 §5 |
| `useCallback` | Same, but for a **function**. | `saveWord`, `unsaveWord`… | 07 §5 |
| `useReducer` | "Several values change **together**, in named **events**." | `useQuizState.js` | 08 |
| `useContext` | "Give me the value from a **provider above** me." | inside every `useX()`: `useNotebook`, `useAuth` | 09 |

### `useRef` in more depth

A ref is **a pointer to one specific thing, kept across renders**. Two uses:

```js
// 1. Point at a real element (so you can call its methods)
const inputRef = useRef(null)
<TextInput ref={inputRef} />
inputRef.current.focus()          // ← reach in and focus it

// 2. Remember a value WITHOUT causing a re-render
const playerRef = useRef(null)    // useAudio.js: the current audio player
playerRef.current = newPlayer     // changing .current re-renders NOTHING
```

| | `useState` | `useRef` |
|---|---|---|
| Change it with | `setX(…)` | `ref.current = …` |
| Re-renders the screen? | ✅ yes | ❌ no |
| Use for | anything **shown** on screen | timers, players, "latest value" stashes, real elements |

The rule: **if the screen shows it, state; if only your code needs it, a ref.**
(`learning/concepts/useref-vs-usestate.md` goes deeper.)

### The rules, once more (Lesson 10 §3)

1. Only at the **top level** of a component or hook: not in `if`, loops, or after an early `return`.
2. Only from **components or other hooks**.
3. Custom hooks are named **`useSomething`**.

---

# Part B: hooks from libraries (already in your app)

Libraries ship their own hooks. They follow the exact same rules: they're
just functions that call `useState`/`useEffect` inside.

| Hook | From | What it gives you | Example in your app |
|---|---|---|---|
| `useRouter()` | `expo-router` | `router.push('/x')`, `.replace`, `.back()` | `OnboardingGate` in `_layout.jsx` |
| `useLocalSearchParams()` | `expo-router` | the `[blanks]` from the URL | `[genreId].jsx` line 33 |
| `usePathname()` | `expo-router` | the current URL as text | `_layout.jsx` |
| `useFocusEffect(cb)` | `expo-router` | like `useEffect`, but runs each time the screen **comes into view** (returning from another screen too) | `app/subscription.jsx` |
| `useRootNavigationState()` | `expo-router` | is the navigator ready yet? | `_layout.jsx` line 170 |
| `useSafeAreaInsets()` | `react-native-safe-area-context` | how much space the notch / home bar takes | `[genreId].jsx` line 42 |
| `useWindowDimensions()` | `react-native` | screen width/height; updates on rotation | `reading/index.jsx` |
| `useFonts({…})` | `expo-font` | `[loaded, error]` for your fonts | `_layout.jsx` line 50 |
| `useSharedValue`, `useAnimatedStyle` | `react-native-reanimated` | values that animate on the UI thread | the swipe/modal guides in `learning/` |
| `useAuth()`, `useNotebook()`, `useProgress()`… | **your own** `src/context/` | the shared app state | everywhere |

> 🧠 **`useEffect` vs `useFocusEffect`.** In a stack navigator, a screen you
> navigate *away* from often stays **mounted** underneath. A `useEffect([])`
> won't run again when you come back. `useFocusEffect` will. Use it when "the
> screen became visible again" matters (e.g. re-read something another screen changed).

---

# Part C: libraries without hooks (plain functions and objects)

Not everything is a hook. Many libraries are just **functions you call** or
**objects with methods**: use them in handlers, effects, and `lib/` files.

| Library | What you call | Where it lives in your app |
|---|---|---|
| `@react-native-async-storage/async-storage` | `getItem`, `setItem` (async) | wrapped once in `lib/storage.js` |
| `@supabase/supabase-js` | `supabase.auth.…`, `supabase.from('table')…` | `lib/supabase.js`, `AuthContext.jsx` |
| `react-native-purchases` (RevenueCat) | offerings, purchases | `SubscriptionContext.jsx` |
| `expo-audio` | players | `hooks/useAudio.js` |
| `react-native` **built-ins** | `AppState`, `Share`, `BackHandler`, `Keyboard`, `RefreshControl`, `Vibration` | `BackHandler` in `useExitGuard.js`; the others are in the projects below |

**The pattern your app uses, and you should copy:** wrap a library **once**
(`lib/storage.js` wraps AsyncStorage; `useAudio` wraps expo-audio), and let the
rest of the app use your wrapper. If the library changes, one file changes.

## How to pick up a library you've never used

1. **Is it installed?** Look in `package.json`. The `react-native` built-ins always are.
2. **JS-only or native?** A library with native code (camera, haptics, notifications)
   needs `npx expo install <name>` **and a new dev build** before it works. A
   JS-only one works after install + reload. Built-ins need neither.
3. **Find the one function or hook you need** in its docs. Write down its
   **inputs**, its **output**, and whether it's **async**. That's the whole contract.
4. **Try it in your playground first** (`app/playground.jsx`), never straight in a real screen.
5. **Wrap it** if more than one place will use it.

---

# Part D: the build projects (the ending quiz)

Six real improvements to KawmHmoob. **None of them exist in the app yet.**
All six use only libraries you already have: **no installs, no rebuilds.**
They go from easiest to hardest.

> **You write all of it.** Each project gives the goal, why it helps, where it goes,
> the shape, and a "done when" checklist. There's no code to copy. If you're stuck,
> ask for a hint on one specific step.
>
> House rules apply: comment out instead of deleting, try it in the playground
> first, test on a device, and write a dated note in `notes/` when each one ships.

---

## 🛠️ Project 1: Stop AuthContext re-rendering every screen (warm-up)

**Uses:** `useMemo` · **Touches:** `src/context/AuthContext.jsx`

**Why it helps:** the Provider's `value={{ user, loading, … }}` is a **new object
on every render**, so every screen that calls `useAuth()` re-renders whenever
`AuthProvider` does, even when nothing about the user changed. `NotebookContext`
already does this correctly. Copy its pattern, don't copy its code.

**Shape:**
1. Build the value with `useMemo(() => ({ … }), [ … ])` above the `return`.
2. Work out the dependency list yourself: every value that goes into the object.
   (All the functions are already `useCallback`s, so they're stable.)
3. Pass that to `value={…}`.

**Done when:**
- [ ] `npm run lint` shows no `exhaustive-deps` warning for it
- [ ] sign in, sign out, edit your profile: all still update on screen
- [ ] you can explain, in one sentence, why the deps list contains what it does

---

## 🛠️ Project 2: A "Share" button on a word

**Uses:** `Share.share()` from `react-native` (async), `try/catch` · **Touches:** `src/components/vocabulary/WordDetail.jsx`

**Why it helps:** learners can send a word to a friend or family member
(*"aub: dog"*), which is free word-of-mouth for the app.

**Shape:**
1. Read the React Native docs for `Share.share`: what it takes, what it returns,
   and that it returns a **Promise**.
2. Write an `async` handler that builds the message from the word on screen
   (Hmong, English, and the example sentence if there is one), then calls `Share.share`.
3. Wrap it in `try/catch`. A cancelled or failed share must **never** crash the screen (Lesson 05 §4).
4. Add a `Button` (`variant="ghost"`) that calls the handler. Check `Icon.jsx` for a fitting
   icon name; if there isn't one, use a text-only button.

**Done when:**
- [ ] tapping it opens the phone's share sheet with a sensible message
- [ ] cancelling the share sheet does nothing bad (no red screen, no warning)
- [ ] a word with **no** example sentence still shares cleanly (no `undefined` in the text)

---

## 🛠️ Project 3: `useDebouncedValue`, so search stops working on every keystroke

**Uses:** `useState`, `useEffect` with **cleanup**, `setTimeout`/`clearTimeout` · **Touches:** new `src/hooks/useDebouncedValue.js`, `src/components/common/GlobalSearch.jsx`

**Why it helps:** `GlobalSearch` re-filters **all** its items on every letter you type
(`useMemo` on `q`, around line 208). "Debouncing" means *wait until the typing
pauses (~250ms), then search once*. It's smoother on slow phones, and it's the
standard fix for this exact problem.

**Shape:**
1. The hook: `useDebouncedValue(value, delayMs)` returns a value that only catches
   up to `value` after `value` has **stopped changing** for `delayMs`.
2. Inside: a piece of state for the delayed value, plus an effect that starts a timer
   when `value` changes, and whose **cleanup cancels the timer**. That cleanup is the whole trick:
   each new keystroke cancels the previous timer.
3. In `GlobalSearch`: the `TextInput` keeps using `q` (so typing feels instant),
   but the **filtering** uses the debounced version.

**Done when:**
- [ ] typing feels exactly as responsive as before
- [ ] results appear a moment after you **stop** typing, not on every letter
- [ ] clearing the box clears the results
- [ ] you can explain, with a timeline like Lesson 05 §6, what the cleanup prevents

---

## 🛠️ Project 4: Pull-to-refresh on the leaderboard

**Uses:** `RefreshControl` (react-native), state, an async function, **adding a prop to a shared component** · **Touches:** `app/leaderboard.jsx`, `src/components/TabScreen.jsx`

**Why it helps:** today the leaderboard only reloads via its Retry button after an
error. Pulling down to refresh is what every phone user expects on a ranking screen.

**Shape:**
1. Read the `RefreshControl` docs: it goes on a `ScrollView`'s `refreshControl` prop,
   and needs `refreshing` (a boolean) and `onRefresh` (a function).
2. ⚠️ **`TabScreen` doesn't pass extra props to its `ScrollView`** (it only takes
   `children, scroll, fill, background`). Add an **optional** prop to `TabScreen`
   that it forwards to the `ScrollView`. Every other screen must be unaffected
   when they don't pass it.
3. In `leaderboard.jsx`, the existing `load` sets `loading`, which swaps the
   whole list for a spinner. For a pull, you want the list to **stay** while the
   little spinner shows. So you need a **separate** `refreshing` state.
   Decide how `onRefresh` reuses `load` without turning on `loading`.
4. `refreshing` must go back to `false` whether the load **succeeds or fails**.

**Done when:**
- [ ] pulling down shows the spinner, reloads, and the spinner stops
- [ ] the list stays visible during a refresh (no full-screen spinner)
- [ ] a failed refresh (turn off wifi) still stops the spinner and shows the error
- [ ] every other `TabScreen` screen looks and scrolls exactly as before

---

## 🛠️ Project 5: `useAppForeground`, so the app notices a new day

**Uses:** `AppState` (react-native), `useEffect` subscribe + cleanup, **`useRef` for the latest callback** · **Touches:** new `src/hooks/useAppForeground.js`, `src/hooks/useDailyQuota.js`, `app/(tabs)/index.jsx`

**Why it helps:** if you leave the app in the background overnight and reopen it,
nothing re-checks the day. `useDailyQuota` only reloads when its `key` changes, so
yesterday's "0 remaining" can stick, and Home's pick-of-the-day stays yesterday's
until a full restart.

**Shape:**
1. Read the `AppState` docs: the states (`active`, `background`, `inactive`) and
   `AppState.addEventListener('change', …)`, which returns a **subscription** you
   must `.remove()` in cleanup (same idea as `onAuthStateChange` in AuthContext).
2. The hook: `useAppForeground(callback)` calls `callback` whenever the app goes
   **from not-active to `active`**. Keep the previous state in a **ref** to detect that change.
3. ⚠️ **The stale-callback trap** (Lesson 07 §6): if the listener is set up once,
   it would call an **old** `callback`. Fix: store the latest `callback` in a ref
   on every render, and have the listener call `ref.current`. That's a classic
   `useRef` job: remembered, not shown, no re-render.
4. Use it in `useDailyQuota` to re-run the "load today's count" logic on return.
   (Think about how to share that logic between the effect and the foreground callback.)
5. Use it on Home so pick-of-the-day recalculates when the day has changed.

**Something to discover (don't change it, write it in your note):** `dayKey()` in
`lib/daily.js` uses **UTC**. Work out what time of evening the app's "new day"
actually starts where you live, and write down whether that matters for learners.

**Done when:**
- [ ] backgrounding and reopening the app calls your callback once (check with a labelled `console.log`)
- [ ] the listener is removed on unmount (no duplicate logs after leaving and coming back)
- [ ] after the day changes, the quota resets without a restart
- [ ] you can explain why the callback lives in a ref

---

## 🛠️ Project 6: Recently viewed words

**Uses:** a custom hook with **persisted** state (your Lesson 10 `useStoredState`), immutable array updates (Lesson 03), per-user storage keys · **Touches:** new `src/hooks/useRecentWords.js`, `src/components/vocabulary/WordDetail.jsx`, `src/components/common/GlobalSearch.jsx`

**Why it helps:** when the search box is empty, show *"Recently viewed"*, the last few
words you opened, as tappable chips. It's a real quality-of-life feature, and
nothing like it exists in the app yet.

**Shape:**
1. **Storage key per user**, like the notebook: `kawmhmoob.recent.<userId or 'guest'>`.
2. The list holds **word ids**, newest first, **no duplicates**, **max 8**.
   Opening a word that's already in the list moves it to the front.
   Write the "add" step as a **pure function** first (it could live in `lib/`) and test it
   in a practice-style `.mjs` file with `check()`. *Then* wire it into the hook.
3. `useRecentWords()` returns `{ recentIds, addRecent, ready }`.
4. In `WordDetail`, record the word when it's opened. Which hook runs code "when this
   word id appears/changes"? Watch the dependency list.
5. In `GlobalSearch`, when `q` is empty and `ready` is true, look the ids up and show them.
   Skip any id that no longer exists (words get renamed and split. Remember the ids lesson).

**Done when:**
- [ ] open 3 words → they appear in search, newest first
- [ ] reopen an old one → it jumps to the front, with no duplicate
- [ ] open 10 words → only the last 8 show
- [ ] restart the app → the list is still there
- [ ] sign in as another account → a separate list
- [ ] your pure "add" function passes your own `check()` tests

---

## Your project tracker

Copy this into the course README's progress section when you start:

- [ ] Project 1: AuthContext `useMemo`
- [ ] Project 2: Share a word
- [ ] Project 3: `useDebouncedValue` in search
- [ ] Project 4: Pull-to-refresh leaderboard
- [ ] Project 5: `useAppForeground` + new-day refresh
- [ ] Project 6: Recently viewed words

---

## You can now…

- [ ] name the question each of React's 7 hooks answers
- [ ] choose between `useState` and `useRef` with the "is it shown?" rule
- [ ] explain `useEffect` vs `useFocusEffect`
- [ ] read a library's docs for inputs / output / async, and know when an install needs a rebuild
- [ ] explain why your app wraps libraries once (`lib/storage.js`, `useAudio`)
- [ ] ship at least three of the six projects
