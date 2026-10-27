# 05 — Async: waiting for things

Reading the phone's storage, talking to Supabase, loading audio, asking
RevenueCat whether someone is Pro: none of these finish instantly. JavaScript
**will not wait for them** unless you tell it to. This lesson is about how you
tell it to, and about the bugs you get when you don't.

---

## 1. Start from your code

`src/lib/storage.js`:

```js
export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}
```

`src/hooks/useDailyQuota.js`:

```js
useEffect(() => {
  let active = true
  setReady(false)
  loadJSON(key, null).then((stored) => {
    if (!active) return
    setUsed(stored && stored.date === dayKey() ? stored.count : 0)
    setReady(true)
  })
  return () => { active = false }
}, [key])
```

---

## 2. The restaurant ticket

JavaScript runs **one thing at a time** (one cook). If it stopped and stared at
the storage chip until the data arrived, your whole app would freeze: no
taps, no animation.

So slow operations hand you a **Promise** instead: a ticket at a restaurant
counter.

```
const ticket = AsyncStorage.getItem('kawmhmoob.notebook.guest')
// ticket is a Promise: "your data will be ready later"
// the cook immediately goes on to the next line
```

A Promise is in one of three states:

```
  pending   ──►  fulfilled  (here's your value)
            └─►  rejected   (here's an error)
```

You **can't** read the value off the ticket directly. You have to say "when
it's ready, do this", and there are two ways to say that.

### Way 1: `.then`

```js
loadJSON(key, null).then((stored) => {
  // runs LATER, when the data has arrived
})
// this line runs FIRST, before the callback above
```

### Way 2: `async` / `await`

```js
async function load() {
  const stored = await loadJSON(key, null)   // pause THIS function until ready
  // …use stored
}
```

`await` pauses **only the function it's in**, not the whole app. The cook goes
off and handles taps and animations, then comes back to this line when the
ticket is called.

Both do the same thing. `await` reads top-to-bottom like normal code, so it's
usually clearer. You'll see `.then` in your effects for a reason covered in §6.

---

## 3. Rules of `async` functions

1. **`await` only works inside an `async` function.**
2. **An `async` function always returns a Promise**, even if you `return 5`.
   The caller gets a ticket for 5, not 5.
3. So **whoever calls an async function must `await` it too** (or `.then` it),
   if they need the result.

That's why `consume()` in `useDailyQuota` is `async`, and why its callers write:

```js
const allowed = await consume()
if (!allowed) showWall()
```

### The #1 async bug: forgetting `await`

```js
const allowed = consume()      // ← forgot await
if (!allowed) showWall()       // allowed is a Promise object → always truthy → wall never shows
```

No error, no crash. It's just silently wrong. When an async value "is always
truthy" or prints as `Promise { <pending> }`, look for a missing `await`.

---

## 4. Errors: `try` / `catch`

A Promise that **rejects** (storage full, network down, bad JSON) throws at the
`await`. Catch it like any other error:

```js
try {
  const raw = await AsyncStorage.getItem(key)
  return JSON.parse(raw)          // JSON.parse throws on corrupt text, also caught
} catch {
  return fallback                 // something went wrong → use the safe default
}
```

`loadJSON` turns *every* failure into "use the fallback". `saveJSON` swallows
failures ("storage failures shouldn't crash the UI"). That's a deliberate
choice: for a learning app, a lost save is better than a red screen.

**Unhandled rejections.** If a promise rejects and nobody catches it, you get an
"Unhandled promise rejection" warning, and on some setups a crash. Your
`notes/2026-08-05-unhandled-promise-rejections-hardening.md` is the record of
fixing a batch of these. Rule: **every promise chain ends in a `catch`, or
lives inside a `try`, or calls something (like `loadJSON`) that never rejects.**

---

## 5. One at a time vs all at once

```js
// SEQUENTIAL — the second request doesn't START until the first finishes
const words = await fetchWords()       // 300ms
const tones = await fetchTones()       // 300ms   → 600ms total

// PARALLEL — both start immediately; wait for both
const [words, tones] = await Promise.all([fetchWords(), fetchTones()])   // ~300ms total
```

`app/admin-users.jsx` does exactly this:

```js
const [w, t, u] = await Promise.all([ … three queries … ])
```

Use `Promise.all` when the requests **don't depend on each other**. Use
sequential `await`s when the second needs the first's answer. ⚠️ `Promise.all`
rejects as soon as **any one** fails. If you want all results even if some fail,
use `Promise.allSettled`.

---

## 6. Async + React: the race-condition guard

Why does `useDailyQuota` use `.then` and an `active` flag, instead of just
`await`?

**Reason 1: an effect function can't be `async`.** `useEffect(async () => …)`
is not allowed, because an async function returns a Promise, and React expects
an effect to return either nothing or a cleanup function. So you either use
`.then`, or define an async function **inside** the effect and call it.

**Reason 2: the answer can arrive too late.** Picture this:

```
t=0ms    guest is on the quiz screen → effect starts reading "quota.guest.quiz"
t=5ms    user signs in → key changes to "quota.abc-123.quiz" → effect runs again
t=8ms    the abc-123 read finishes → setUsed(1)        ✅ correct
t=30ms   the OLD guest read finally finishes → setUsed(4)   ❌ overwrites with the wrong user's count!
```

The fix is the `active` flag:

```js
let active = true
loadJSON(key, null).then((stored) => {
  if (!active) return        // ← a newer run has replaced me; throw my result away
  setUsed(…)
})
return () => { active = false }   // ← React calls this before re-running the effect
```

Each run of the effect has **its own** `active` variable (a closure, Lesson 02
§7). When the key changes, React runs the old run's cleanup, which flips the
*old* `active` to false. The late guest result then sees `false` and bails.

> 🧠 You'll see this exact pattern in `NotebookContext.jsx` lines 32–41 too.
> **Any effect that awaits something and then sets state needs it.**

---

## 7. Order of execution: test yourself

What does this print?

```js
console.log('A')
setTimeout(() => console.log('B'), 0)
Promise.resolve().then(() => console.log('C'))
console.log('D')
```

<details>
<summary>Answer</summary>

`A D C B`.

All the plain code runs first (A, D). Then pending promise callbacks (C).
Then timers (B), even a 0ms one. You don't need to memorise the exact
rules; just know that **callbacks never run in the middle of your current code**.
They always wait until it finishes.
</details>

---

## Gotchas

1. **Forgot `await`** → you're holding a Promise, which is always truthy.
2. **`useEffect(async () => …)`** isn't allowed. Use `.then` or an inner async function.
3. **Setting state after an await without a guard** → stale data or a
   "can't update an unmounted component" warning.
4. **`await` inside `.forEach`** doesn't wait. Use `for…of`, or `Promise.all(arr.map(…))`.
5. **Sequential awaits that could be parallel** → slow screens for no reason.
6. **An uncaught rejection** → a warning or crash. End chains with a `catch`.

---

## Practice

```bash
node js-ts-course/practice/p05-async.mjs
```

It gives you a fake `AsyncStorage` that's deliberately slow and sometimes
broken. You'll rebuild `loadJSON`, `saveJSON` and the quota's `consume`, and
then make a slow loader fast with `Promise.all`.

---

## You can now…

- [ ] explain a Promise with the restaurant-ticket analogy
- [ ] convert a `.then` chain to `async`/`await` and back
- [ ] spot a missing `await` from its symptom
- [ ] choose between sequential `await`s and `Promise.all`
- [ ] explain, with a timeline, why `useDailyQuota` has an `active` flag
- [ ] predict `A D C B`
