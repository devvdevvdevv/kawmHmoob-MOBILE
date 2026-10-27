# 02 — Functions

A function is a **recipe with a name**: ingredients go in (parameters), a dish
comes out (the return value). Almost every line in your app is either
*defining* a function or *calling* one, and React components are functions too.

---

## 1. Start from your code

`src/lib/leveling.js`:

```js
export function totalForLevel(level) {
  const L = Math.max(1, Math.min(level, MAX_LEVEL))
  let sum = 0
  for (let i = 1; i < L; i++) sum += BASE + (i - 1) * GROWTH
  return sum
}

export function levelFromPoints(points = 0) {
  const p = Math.max(0, points)
  // …
  return { level, into, needed: span, remaining: Math.max(0, span - into), /* … */ }
}
```

`src/hooks/useDailyQuota.js`:

```js
const storageKey = (scope, name) => `kawmhmoob.quota.${scope || 'global'}.${name}`

export function useDailyQuota(name, limit, { enabled = true, scope = '' } = {}) {
```

---

## 2. Three ways to write the same function 

```js
// 1. function declaration
function double(n) { return n * 2 }

// 2. arrow function with a body
const double = (n) => { return n * 2 }

// 3. arrow function, short form: the expression IS the return value
const double = (n) => n * 2
```

They all work. The house style in your app:

- **Exported, named things** (`totalForLevel`, `NotebookProvider`, every
  component) use `function`. They read like headings.
- **Small helpers and callbacks** use arrows: `storageKey`, and everything
  passed to `.map`, `.filter`, `onPress`.

> 🪤 **The object trap.** `() => { level: 1 }` returns **undefined**: the
> `{` is read as a function body, not an object. To return an object from a
> short arrow, wrap it in parentheses: `() => ({ level: 1 })`. Your
> `learning/concepts/arrow-function-bodies-and-handlers.md` goes deep on this.

---

## 3. Parameters: defaults and destructuring

### Defaults

```js
export function levelFromPoints(points = 0) { … }
function newId(prefix = 'note') { … }           // NotebookContext.jsx
```

If the caller passes nothing (or `undefined`), the default is used.
`levelFromPoints()` works and means `levelFromPoints(0)`.

⚠️ Defaults apply to `undefined` **only**. `levelFromPoints(null)` passes
`null` through, which is why the next line does `Math.max(0, points)`.

### Destructuring: unpacking an object right in the parameter list

#### What it actually is

Destructuring is **pattern matching on the shape of a value.** You write a
pattern that looks like the thing you are unpacking, and JavaScript walks it,
pulling values out into variables.

```js
const word = { hmongRPA: 'siab', english: 'liver', audioFile: null }

const { hmongRPA, english } = word
// exactly the same as:
//   const hmongRPA = word.hmongRPA
//   const english  = word.english
```

Three technical facts that explain almost every surprise:

1. **Objects bind by KEY NAME, not position.** `const { english, hmongRPA } = word`
   gives the same result — the names are the lookup. (Arrays are the opposite:
   `const [first, second] = list` binds by **position**, because that is what an
   array has.)
2. **A missing key is `undefined`, not an error.** `const { nope } = word` is
   legal and gives you `undefined`. Destructuring only throws when the thing
   being unpacked is `null` or `undefined` — you cannot read a key off nothing.
3. **Numbers get copied. Arrays and objects get shared.** (Rewritten 2026-10-14.)

   A **number, string or boolean** is copied into your new variable. After that,
   the two are independent:
    
   ```js
   const example = { count: 5 }
   const { count } = example
   example.count = 52
   count                  // still 5 ✅ your copy doesn't follow the source
   ```

   An **array or object** is *not* copied. Your variable points at **the same one**,
   so a change *inside* it shows up through both names:

   ```js
   const word = { senses: ['liver'] }
   const { senses } = word
   word.senses.push('heart')
   senses                 // ['liver', 'heart'] ❗ one array, two names
   ```

   | The value is… | Destructuring gives you | Source changes later? |
   |---|---|---|
   | number, string, boolean | its **own copy** | your variable stays the same |
   | array, object | a **pointer to the same one** | changes *inside* it show up in both |

   Same rule as Lesson 03 §5 (references), and the reason React wants new arrays
   instead of `.push` on old ones.

#### In a parameter list

The pattern goes exactly where the parameter name would:

```js
function describe({ hmongRPA, english }) { … }
describe(word)              // hand it the whole object
```

`Button.jsx` does this with props, and adds a default per key:

```js
const Button = forwardRef(function Button({
  children,
  icon,
  onPress,
  variant = 'primary',     // unpack AND default in one go
  size = 'md',
  disabled = false,
  className = '',
  ...rest                  // "everything else I didn't name"
}, ref) {
```

**What actually happens (rewritten 2026-10-14).** When a screen writes:

```jsx
<Button variant="ghost" onPress={save} accessibilityLabel="Save">Save</Button>
```

React gathers everything into **one object** and calls `Button` with it:

```js
Button({ variant: 'ghost', onPress: save, accessibilityLabel: 'Save', children: 'Save' })
```

and the parameter list unpacks it, line by line:

```js
  children,               // → 'Save'        passed (the text between the tags)
  icon,                   // → undefined     not passed, no default
  onPress,                // → save          passed
  variant = 'primary',    // → 'ghost'       passed, so the default is ignored
  size = 'md',            // → 'md'          NOT passed, so the default fills in
  disabled = false,       // → false         not passed, default
  className = '',         // → ''            not passed, default
  ...rest                 // → { accessibilityLabel: 'Save' }   everything left over
```

Three jobs in one list: **unpack** each named prop, **default** the ones that
weren't passed (`undefined` only), and **collect the rest**. Button then spreads
`{...rest}` onto its `<Pressable>`, so props like `accessibilityLabel` or `testID`
reach the real button without Button having to list every possible prop.

Without destructuring, every line in the body would read `props.variant || 'primary'`,
and `||` is not the same thing as a default (see the gotcha below).

#### The three moves worth memorising

```js
const { english: gloss } = word          // RENAME: gloss === 'liver'
const { hmongRPA, ...others } = word     // REST: others = everything else
const { exampleSentence: { hmong } = {} } = word   // NESTED, with a default
```

- **Rename with `:`.** `{ english: gloss }` reads "take the key `english`, call it
  `gloss` here". Full explanation in the next section.
- **`...rest` collects the leftovers** into a new object.
- **Nested patterns** reach deeper, but a missing middle level throws, which is
  why `= {}` appears in the middle there.

#### Nested destructuring: `{ exampleSentence: { hmong } = {} }` (added 2026-10-14)

Read it in three layers, outside in:

```js
const { exampleSentence: { hmong } = {} } = word
//      ───────┬───────  ────┬────  ─┬─
//             │             │       └── ③ if exampleSentence is MISSING, use {} instead
//             │             └────────── ② then, inside it, take `hmong`
//             └──────────────────────── ① go into word.exampleSentence
```

> **"Go into `word.exampleSentence` and take its `hmong`. If the word has no
> example sentence, don't crash; give me `undefined`."**

It's the short form of:

```js
const sentence = word.exampleSentence || {}
const hmong = sentence.hmong
```

Checked in Node:

| The word | `hmong` becomes |
|---|---|
| `{ exampleSentence: { hmong: 'Kuv mob siab.' } }` | `'Kuv mob siab.'` ✅ |
| no `exampleSentence` key | `undefined` ✅ (the `= {}` stepped in) |
| no `exampleSentence` key, **without** `= {}` | 💥 `Cannot read properties of undefined (reading 'hmong')` |
| `exampleSentence: null` | 💥 crash **even with** `= {}`. A default only fills in `undefined` |

- **`= {}` is the crash guard:** without it, a word with no example means "take `hmong`
  from nothing".
- **`null` defeats it**, the same rule as `audioFile = 'none'` above. If the value could
  be `null`, use `word.exampleSentence?.hmong` instead; `?.` handles both.
- **Only `hmong` is created.** There's no variable called `exampleSentence` afterwards; it's
  just the path, like `english` in `{ english: gloss }`.

#### Renaming: what `:` really does (added 2026-10-14)

```js
const word = { english: 'liver' }
const { english: gloss } = word
//      ──┬───   ──┬──
//   the KEY to   the NEW variable
//   look up      you get
```

> **Look up the key `english` in the object, and store its value in a new
> variable called `gloss`.**

`english` is a **key**, not a variable, and nothing about the object changes.
You get one new variable, `gloss`, holding the **value**:

```js
gloss          // ✅ 'liver': the value, under the new name
word.english   // ✅ 'liver': the object is untouched
english        // ❌ ReferenceError: english is not defined (no variable by that name was made)
```

**A common mix-up:** `gloss` holds the *value* (`'liver'`), not the word `'gloss'`,
and not the word `'english'`. A string comes back letter for letter, exactly as stored.

And the value side needs quotes if it's text:

```js
const word = { english: liver }     // ❌ ReferenceError: liver is a variable that doesn't exist
const word = { english: 'liver' }   // ✅ a string
```

#### Why would you ever rename?

**1. Two things with the same name: a collision.** This is the big one.
`app/settings.jsx` reads **two** preference hooks, and **both** return `prefs`
and `setPref`:

```js
const { prefs, setPref } = useQuizPrefs()                                    // line 30
const { prefs: readingPrefs, setPref: setReadingPref } = useReadingPrefs()   // line 31
```

Without the rename, line 31 would try to create a second `prefs`, which is an error
(`Identifier 'prefs' has already been declared`). The rename lets both live
side by side: `prefs.direction` for the quiz, `readingPrefs.textSize` for reading.

`AuthContext.jsx` does the same with Supabase, where every call returns `{ data, error }`:

```js
const { data: sessData } = await supabase.auth.getSession()
const { error: profileError } = await supabase.from('profiles').upsert(…)
```

Two calls, two `data`s and two `error`s, so each gets its own name.

**2. The key's name is too vague where you use it.** A hook names things for
*itself*; you name them for *your screen*.

> 🏷️ **The name tag.** A hook is used by many files, so it hands out a general
> tag, **"Theme"**. In a small room that's enough. In a big room full of themes and
> colours (the 1,200-line story reader, with genre colours, reading preferences and text
> sizes), a tag that just says "Theme" gets mixed up, so you write **"Reader's theme"**
> on it. The value is identical (`'light'` or `'dark'`). Only the label changes, so the
> line `genreCoverColor(genre?.cover, readerTheme)` explains itself without scrolling
> 600 lines up. **In a large codebase, renaming makes a piece of information's label
> distinct in the file that uses it.**
 `useTheme()` returns `theme`; the reader
calls it `readerTheme`, the quiz calls it `quizTheme`, the genre page calls it
`genreTheme` (`[genreId].jsx:37`). `useWindowDimensions()` returns `width`; the
reading library renames it `screen` (`reading/index.jsx:321`), because "screen" says
what it's the width *of*.

**3. Something else already has that name.** `app/words/typing.jsx:97`:

```js
const { unit: unitParam } = useLocalSearchParams()       // the raw text from the URL
const pathUnit = unitParam ? getUnit(String(unitParam)) : null   // the real unit object
```

The URL gives a *string*; the screen also wants a variable for the real unit
*object*. Calling the string `unitParam` keeps "the URL text" and "the unit" from
being confused.

> **Rule of thumb:** keep the original name when it's clear and unique in your
> file. Rename when it would clash, or when a more specific name says more.

#### ⚠️ The gotcha: defaults fire on `undefined` only

This is the same rule as plain parameter defaults, and it bites hardest here:

```js
const { size = 'md' } = { size: null }       // size === null   ← NOT 'md'
const { count = 10 } = { count: 0 }          // count === 0     ← NOT 10
const { label = 'hi' } = { label: '' }       // label === ''    ← NOT 'hi'
```

A default means "this key was **absent**", not "this key was falsy". `||` means
the opposite:

```js
const size = opts.size || 'md'               // 'md' for null, 0, '' AND undefined
```

Neither is wrong — they answer different questions. Reach for `??` when you want
"absent or null, but keep 0 and ''":

```js
const size = opts.size ?? 'md'
```

**Try it:** in a scratch `.mjs` file, make
`const word = { hmongRPA: 'siab', english: 'liver' }` (**no `audioFile` key yet**).
Destructure `{ hmongRPA, english: gloss, audioFile = 'none' }` out of it and print
`hmongRPA`, `gloss` and `audioFile`. You should see the default, `'none'`. Then add
`audioFile: null` to the object, run it again, and work out why the default
stopped applying. Finally, try `console.log(english)` and read the error.

<details>
<summary>What you should see</summary>

- First run: `'siab'`, `'liver'`, `'none'`. The key is missing (`undefined`), so the default fills in.
- With `audioFile: null`: `audioFile` is `null`. `null` is a real, deliberately set value, and a default only fills in `undefined`.
- `console.log(english)` → `ReferenceError: english is not defined`. The rename made `gloss`, not `english`.

First attempt (2026-10-14): `'siab'` ✅ · `english` → `'gloss'` ❌ (it's a ReferenceError; `gloss` holds `'liver'`) ·
`null` ✅ · the "why" was right, but called null "an acceptable object". It isn't an object, it's a deliberate value.
</details>

### The options-object pattern

#### Start with the problem

Imagine `useDailyQuota` took its settings as plain arguments:

```js
function useDailyQuota(name, limit, enabled, scope) { … }

useDailyQuota('quiz', 5, false, 'abc-123')   // ← what is `false`?
```

You cannot read that call. Worse, you cannot write it without scrolling back to
the definition to count positions. And if you only want to set `scope`, you have
to pass something for `enabled` first:

```js
useDailyQuota('quiz', 5, true, 'abc-123')    // `true` only because it has to be there
```

That `true` is noise the caller is forced to type. Every boolean you add makes it
worse.

#### The fix: give the settings names

Bundle the optional settings into **one object**, so the caller labels them:

```js
useDailyQuota('quiz', 5, { scope: 'abc-123' })
```

Now it reads itself, order inside the object does not matter, and anything you
leave out keeps its default. Here is the real call from `QuizEngine.jsx`:

```js
const quota = useDailyQuota('quiz', quotaLimit('quiz', user.isGuest), {
  enabled: !isPro && !pathUnitId,
  scope: user?.id || 'guest',
})
```

You can tell what every value is for without opening the hook.

#### Now the signature, one layer at a time

```js
export function useDailyQuota(name, limit, { enabled = true, scope = '' } = {}) {
```

There are **three** separate things in that third parameter, and they are easy to
confuse because they all use `=`:

| piece | what it does |
|---|---|
| `{ enabled, scope }` | destructuring — unpack those two keys into local variables |
| `enabled = true` | a default for **one key**, used when that key is missing |
| `= {}` (the outer one) | a default for **the whole object**, used when the argument is missing |

So `enabled = true` fills a hole *inside* the object, and `= {}` covers the case
where there is no object at all.

#### Why the outer `= {}` is not optional

Leave it off and the function works fine — until someone calls it with two
arguments:

```js
function f(a, { b = 1 }) { … }
f('x')
// TypeError: Cannot read properties of undefined (reading 'b')

function g(a, { b }) { … }        // no inner default
g('x')
// TypeError: Cannot destructure property 'b' of 'undefined' as it is undefined.
```

(Two different messages for the same mistake, which is why it is worth
recognising both. Both were run to check the exact wording.)

JavaScript tried to reach *inside* a missing argument. `= {}` hands it an empty
object to unpack instead, and then every inner default does its job:

```js
function f(a, { b = 1 } = {}) { … }
f('x')        // b === 1  ✅
f('x', {})    // b === 1  ✅
f('x', { b: 9 })  // b === 9
```

**Rule of thumb: if you destructure a parameter, give it `= {}`.** It is two
characters and it removes a whole class of crash.

#### Where else this shows up in the app

```js
export function playToEnd(source, { isRecording = false, timeoutMs = 15000 } = {}) {
```

Same shape: one required thing by position (`source`), the optional knobs by
name. So both of these are valid, and the first is the common case:

```js
await playToEnd(clip)
await playToEnd(take, { isRecording: true })
```

#### When to reach for it

- **Two or more optional settings** → options object.
- **Any boolean setting** → options object, even if it is the only one.
  `doThing(true)` is unreadable; `doThing({ force: true })` is not.
- **Required arguments stay positional.** `playToEnd` without a `source` is
  meaningless, so it is a plain parameter. Options are for what *can* be left out.

**Try it:** write `greet(name, { excited = false, times = 1 } = {})` that returns
the greeting repeated `times`, with a `!` when excited. Then call it as
`greet('Mai')`, `greet('Mai', { times: 3 })`, and `greet('Mai', { excited: true })`
— and finally delete the `= {}` and see which call breaks.

### `...rest`: collecting leftovers

In `Button`, `...rest` gathers every prop not named above (`accessibilityLabel`,
`testID`, …), and then `{...rest}` passes them all down to the `Pressable`.
Same three dots, two jobs: **collect** in a parameter list, **spread** at a
call or in an object.

---

## 4. Return: one value, but it can be a big one

A function returns exactly one thing. When you need several, **return an
object**. `levelFromPoints` returns
`{ level, into, needed, remaining, progress, maxed, points }`.

The comment above it explains why:

> *"Returning the whole shape means no page has to re-derive the bar width and
> get it subtly different from the next page's."*

That's a design principle: **compute it once, in one place, and hand back
everything the callers need.**

Shorthand: `{ level }` is the same as `{ level: level }` when the variable name
matches the key.

### Guard clauses: return early

`lib/access.js`:

```js
export function isLessonGuestAllowed(lessonId) {
  if (!GUEST_GATING_ENABLED) return true      // ← get the easy case out of the way
  const i = lessonOrder().indexOf(lessonId)
  return i > -1 && i < GUEST_LESSON_LIMIT
}
```

Handle the special cases at the top and `return`. The main logic then reads
without deep `if` nesting. Your code does this everywhere (`if (!active) return`,
`if (!navState?.key) return`).

---

## 5. Pure functions vs side effects

A **pure** function:
1. Gives the same output for the same input, every time.
2. Changes nothing outside itself (no storage, no state, no network, no `console.log`).

`totalForLevel`, `levelFromPoints`, `quizUnlock`: **pure**. You could call
them a million times and nothing in the world changes.

`saveJSON`: **not pure**. It writes to the phone. `newId`: not pure either.
It reads the clock and `Math.random()`, so it's different every call.

**Why care?** Pure functions are trivially testable (that's what the practice
files do), safe to call during rendering, and impossible to break by calling
them in the wrong order. **Push as much logic as you can into pure functions
in `src/lib/`**. Your codebase already does this, and it's why `lib/` is the
healthiest folder.

---

## 6. Functions are values

You can store a function in a variable, put it in an object, pass it to another
function, or return it from one.

```js
// passing a function TO a function: .filter calls yours once per word
category.words.filter((w) => vocabProgress[w.id])

// a function stored as a prop: Button calls it when tapped
<Button onPress={() => router.push('/path')}>Paths</Button>
```

Notice the difference:
- `onPress={goHome}` passes the function, and it's called *later*, on tap. ✅
- `onPress={goHome()}` **calls it right now**, during render, and passes its
  *result*. ❌ Classic bug.

---

## 7. Closures: functions remember where they were born

A function can use variables from the place it was *written*, even after that
place has finished running.

```js
function makeCounter() {
  let count = 0
  return () => { count += 1; return count }
}
const next = makeCounter()
next()  // 1
next()  // 2   ← `count` survived, because the arrow "closed over" it
```

Your app relies on this constantly. In `useDailyQuota`, the effect's
`.then((stored) => { if (!active) return … })` callback runs *later*, after
the storage read finishes, but it still sees the `active` variable from the
render that created it. That's a closure, and Lesson 07 shows how it can bite
(the "stale closure").

---

## Gotchas

1. `() => { a: 1 }` returns `undefined`. Use `() => ({ a: 1 })`.
2. `onPress={fn()}` calls it immediately. Use `onPress={fn}` or `onPress={() => fn(x)}`.
3. Defaults don't replace `null`, only `undefined`.
4. Destructuring a missing object crashes. Hence `= {}` at the end of `{ enabled = true } = {}`.
5. Forgetting `return` in a `{ }` arrow body silently returns `undefined`.

---

## Practice

```bash
node js-ts-course/practice/p02-functions.mjs
```

**Eighteen exercises, three per topic**, in the order this lesson teaches them:

| group | what it drills | exercises |
|---|---|---|
| **A. Shapes** | declaration · block arrow · short arrow · returning an object | `clamp` · `toneOf` · `compose2` |
| **B. Parameters** | defaults · destructuring · options object | `buttonClasses` · `sensesFor` · `resolvePrefs` |
| **C. Return** | one value, but a big one · guard clauses | `totalForLevel` · `levelFromPoints` · `quizUnlock` |
| **D. Purity** | return new data, never mutate the argument | `sortedByBest` · `answerQuestion` · `applyStatusFilter` |
| **E. Functions as values** | taking and returning functions | `applyTwice` · `onceOnly` · `memoize` |
| **F. Closures** | private state that survives between calls | `makeIdMaker` · `makeStore` · `makeSpeaker` |

They get harder inside each group, and the third in most groups is the one worth
the time. **Eleven of them rebuild something that really runs in this app** —
`sensesFor` is the rule that stops a family flashcard teaching that `txiv` means
fruit, `onceOnly` is the latch that stops one finished quiz being filed twice,
`makeStore` is the shape behind `useAudio`, and `makeSpeaker` is the fix that
finally stopped the app's audio dying.

**How to work them:**

1. The stub comment is the spec; the checks are the exact contract. Read both
   before writing anything.
2. **Do not open the real file first.** The comment names it so you can compare
   *after*. Reading it first turns the exercise into typing.
3. Stuck for more than 15 minutes? Open the real one, read it, close it, and
   write yours from memory.

The traps are deliberate, and each one is a bug that happened here:

- **B3** — a default fires on `undefined`, not on `null`. A stored blob holding
  `null` must still get the default, while `''` survives.
- **D1, D2** — the checks assert your argument came back **unchanged**. `.sort()`
  mutates.
- **D3** — filtering to nothing must hand back the full set, not an empty one.
- **E3** — a cached `undefined` is still a cache hit, so `if (cache[key])` is wrong.
- **F3** — a late release from a preempted owner must not clear the claim
  belonging to whoever replaced it.

---

## You can now…

- [ ] write the same function as a declaration, a block arrow, and a short arrow
- [ ] explain why `() => ({})` needs parentheses
- [ ] read `{ enabled = true, scope = '' } = {}` aloud and say what each part does
- [ ] say why a default does **not** fire on `null`, and when to reach for `??` instead
- [ ] rename a key while destructuring, and say why `{ a: b }` means the opposite
      in an object literal
- [ ] say whether a function is pure, and why that matters
- [ ] write a function that returns a copy instead of mutating its argument
- [ ] explain the difference between `onPress={go}` and `onPress={go()}`
- [ ] write a function that takes a function and returns a new one
- [ ] explain what a closure is with the counter example
- [ ] get 18/18 on `p02-functions.mjs`
