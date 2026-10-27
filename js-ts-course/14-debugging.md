# 14 — Debugging like you mean it

The difference between a beginner and an experienced programmer isn't that
the experienced one writes fewer bugs. It's that they **find bugs faster**,
with a method instead of guessing. This lesson is the method.

---

## 1. The loop

```
1. REPRODUCE   make it happen on purpose, every time
2. READ        the whole error, every word, and the file:line
3. LOCATE      narrow down WHERE: which file, which line, which value is wrong
4. EXPLAIN     say out loud WHY it's wrong (if you can't, you haven't found it)
5. FIX         change one thing
6. VERIFY      reproduce again: gone? Did anything else break?
7. RECORD      a note in notes/ if it took more than 30 minutes
```

The most-skipped steps are **2** (people read the first five words and start
guessing) and **4** (people change things until it works, without knowing
why, and the bug comes back).

Your `notes/` folder is already step 7. `2026-08-05-picker-modal-invisible-rows.md`
and `2026-08-04-dev-build-crashes-investigation.md` are debugging records. Keep doing that.

---

## 2. Reading the red screen

A React Native red box has three parts:

```
┌──────────────────────────────────────────────────────┐
│ TypeError: Cannot read property 'words' of undefined │ ← 1. WHAT went wrong
│                                                      │
│ This error is located at:                            │
│   in UnitRow (at PathList.jsx:36)                    │ ← 2. WHICH component (read top-down:
│   in PathList (at index.jsx:140)                     │       innermost first)
│   in Home                                            │
│                                                      │
│ src/components/path/PathList.jsx:52:23               │ ← 3. the exact file:line:column
└──────────────────────────────────────────────────────┘
```

Translate part 1 into plain words: *"something.words was read, but
something was undefined."* Then go to the line and ask: **which variable
before `.words` could be undefined, and why?** That's usually a `.find` that
found nothing, a prop that wasn't passed, or data that hasn't loaded yet.

---

## 3. The error dictionary

These cover the large majority of what you'll see:

| Message (roughly) | Usual cause | Lesson |
|---|---|---|
| `Cannot read property 'x' of undefined` / `undefined is not an object (evaluating 'a.x')` | `a` is missing: a failed `.find`, an unloaded value, a missing prop | 01 §5, 11 §6 |
| `x is not a function` | wrong import braces; calling something that isn't a function; a typo | 04 §2 |
| `Element type is invalid… got: undefined` | importing a component with the wrong braces, or a missing export | 04 §2 |
| `Text strings must be rendered within a <Text> component` | raw text or a `0` from `{count && …}` outside `<Text>` | 06 §6 |
| `Too many re-renders` | calling a setter during render, e.g. `onPress={setOpen(true)}` | 02 §6, 07 |
| `Maximum update depth exceeded` | an effect sets state that is in its own deps, every time | 07 §3 |
| `Rendered more hooks than during the previous render` | a hook inside an `if` or after an early `return` | 10 §3 |
| `Unable to resolve module '../x'` | wrong path / wrong number of `../` / a renamed file | 04 §4 |
| `Each child in a list should have a unique "key" prop` | `.map` without `key` | 06 §7 |
| `Possible Unhandled Promise Rejection` | an async error nobody caught | 05 §4 |
| Nothing errors, but the screen doesn't update | mutated state instead of replacing it | 03 §5, 07 §2 |
| Nothing errors, but a value is "always truthy" | forgot `await` | 05 §3 |
| Nothing errors, but the value is old | stale closure / missing dependency | 07 §6 |

The last three are the hardest, because **nothing tells you**. That's what the
linter (`react-hooks/exhaustive-deps`) and TypeScript are for.

---

## 4. Tools, in the order to reach for them

### 1. The linter: `npm run lint`

It catches unused variables, missing hook deps and undefined names before you
even run the app. Your `eslint.config.js` comment says it was added because
those bugs *"showed up as a runtime crash on device"*. **Run it before you
start debugging anything.**

### 2. `console.log`, done well

```js
console.log('saveWord', { wordId, count: savedWordCount, full: isWordLimitReached })
```

- **Always label it** (`'saveWord'`). Five unlabeled logs are useless.
- **Log an object `{ a, b }`**, not separate values. You get the names for free.
- Logs appear in the **Metro terminal** (where you ran `npx expo start`), not on the phone.
- Large objects get truncated; use `JSON.stringify(x, null, 2)` to see everything.
- **Log before and after** the suspicious line, so you know which side breaks.
- Remove them when done (search for `console.log` before committing).

### 3. Divide and conquer

If you don't know where it breaks, **halve the search space**: comment out
half the component (house rule: comment, don't delete). Does the bug survive?
Now you know which half. Repeat. Ten rounds narrows down a 1,000-line file.

### 4. Make it smaller

Reproduce the bug in your playground or a practice-style `.mjs` file, away
from the app. If the problem is in a pure function (and Lesson 02 told you
to keep logic pure), you can test it in Node in seconds. Your
`scripts/check-*.mjs` files are this idea turned into a permanent habit.

### 5. Git as a time machine

The app is a git repo. If something worked yesterday:

```bash
git log --oneline -10          # what changed recently?
git diff HEAD~3 -- src/lib/    # what exactly changed in lib since 3 commits ago?
git stash                      # temporarily put away today's changes: does the bug go away?
git stash pop                  # bring them back
```

"It worked before X" is the most valuable clue in debugging. Small commits
(Lesson 13 §5) make it precise.

### 6. Explain it to someone (or something)

Write out, in a note or to Claude: *what you expected, what happened instead,
what you've ruled out*. Writing that down solves the bug about half the time,
before you even send it. When you do ask for help, those three things are what
a helper needs.

---

## 5. ErrorBoundary: your app's safety net

`app/_layout.jsx` wraps everything in `<ErrorBoundary>` twice (see the comments
on lines 68–70 and 124–126). An error boundary catches a crash in its children
and shows a fallback ("Try again") instead of a white screen. The outer one
catches provider crashes; the inner one keeps the shell alive when a single
screen crashes. When you see the "Try again" screen, the real error is in
the Metro terminal.

---

## Practice: the bug hunt

For each snippet: **find the bug, name the error (or silent symptom), and fix it.**
Answers are below. Don't open them until you've written yours.

```jsx
// 1.
const unit = livePath().find((u) => u.id === unitId)
return <Text>{unit.title}</Text>
```

```jsx
// 2.
<Button onPress={setShowEnglish(!showEnglish)}>Show English</Button>
```

```jsx
// 3.
const [words, setWords] = useState([])
function add(w) { words.push(w); setWords(words) }
```

```jsx
// 4.
useEffect(() => {
  setCount(count + 1)
}, [count])
```

```jsx
// 5.
function Badge({ user }) {
  if (!user) return null
  const [open, setOpen] = useState(false)
  …
}
```

```jsx
// 6.
const allowed = consume()
if (!allowed) return showWall()
```

```jsx
// 7.
{notebook.savedWordCount && <Text>{notebook.savedWordCount} saved</Text>}
```

```js
// 8.
import useAuth from '../context/AuthContext.jsx'
```

<details>
<summary>Answers</summary>

1. `.find` can return `undefined` → **"Cannot read property 'title' of undefined"** for a bad id. Guard: `if (!unit) return <NotFound />`. (TS: "possibly undefined".)
2. Calls the setter **during render** → **"Too many re-renders"**. Fix: `onPress={() => setShowEnglish((v) => !v)}`.
3. Mutates and passes the **same array** → React sees no change and **the screen doesn't update**. Fix: `setWords((ws) => [...ws, w])`.
4. The effect changes `count`, which is a dep, so it re-runs forever → **"Maximum update depth exceeded"**. Fix: don't use an effect for this. Ask *why* this should run and put it in that handler.
5. Hook after an early return → **"Rendered more hooks…"** when `user` changes. Fix: move `useState` above the `if`.
6. Missing `await` → `allowed` is a Promise, always truthy, so **the wall never shows**. Fix: `const allowed = await consume()` (in an async handler).
7. With 0 saved words, renders `0` outside `<Text>` → **"Text strings must be rendered within a <Text>"**. Fix: `savedWordCount > 0 && …`.
8. `useAuth` is a **named** export → `useAuth` is `undefined` → **"useAuth is not a function"**. Fix: `import { useAuth } from …`.
</details>

---

## You can now…

- [ ] follow the 7-step loop instead of guessing
- [ ] read a red box: what, which component, which line
- [ ] match the common messages to their causes without looking them up
- [ ] write labeled, object-style `console.log`s, and find them in Metro
- [ ] use divide-and-conquer and `git diff` / `git stash` to locate a bug
- [ ] get 8/8 on the bug hunt
