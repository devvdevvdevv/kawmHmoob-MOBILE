# 01 — Values, variables, and the truth

Everything a program does is *move values around*. Before functions, React or
types, you need to know exactly what a value is, and which values JavaScript
secretly treats as "false". Most beginner bugs live here.

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

`src/context/NotebookContext.js6x`, line 28:

```js
const userId = user?.id || 'guest'
```

`app/_layout.jsx`, line 119:

```js
const bg = THEME_BG[theme] || THEME_BG.light     
```

Three lines, four ideas: `const`, `== null`, `?.`, and `||`. Let's take them apart.

---

## 2. The seven kinds of value you actually use

| Kind | Examples from the app | `typeof` says |
|---|---|---|
| string | `'aub'`, `'kawmhmoob.notebook.'` | `'string'` |
| number | `25`, `0.5`, `Infinity` | `'number'` |
| boolean | `true`, `GUEST_GATING_ENABLED` | `'boolean'` |
| undefined | a variable you never set; a missing object key | `'undefined'` |
| null | "deliberately nothing": `startedAt: null` in the quiz state | `'object'` ⚠️ (a famous JS bug, never fixed) |
| object | `{ savedWords: {}, notes: [] }` | `'object'` |
| array | `['mammal', 'pet']` | `'object'` (use `Array.isArray(x)` instead) |

Functions are values too (`typeof` says `'function'`). That one matters a lot
in Lesson 02.

**`undefined` vs `null`.** Both mean "nothing", but:
- `undefined` = *nobody set this*. A missing key: `({}).foo` is `undefined`.
- `null` = *someone deliberately set this to nothing*. Your quiz state starts
  with `finishedAt: null` because "not finished yet" is a real, intentional answer.

---

## 3. `const` and `let` (and never `var`)

```js
const UNIT_WORD_CAP = 20      // can never be reassigned
let sum = 0                   // can be reassigned
sum += 5                      // ✅
UNIT_WORD_CAP = 30            // ❌ TypeError: Assignment to constant variable
```

**Default to `const`.** Use `let` only when the value really changes, like the
loop counter in `leveling.js`:

```js
let sum = 0
for (let i = 1; i < L; i++) sum += BASE + (i - 1) * GROWTH
```

⚠️ **`const` does not mean "frozen".** It means *this name always points at the
same box*.

**"Something inside can change", but only for objects and arrays.** A number
has no "inside" to change: `0` is just `0`. Objects and arrays *do* have insides:

```js
const progress = { count: 0 }
progress.count = progress.count + 2   // ✅ changing what's INSIDE the box
progress.count                        // 2
progress = { count: 5 }               // ❌ pointing the name at a NEW box
```

Same with an array:

```js
const state = { notes: [] }
state.notes.push('hi')      // ✅ allowed! Same box, different contents
state = {}                  // ❌ can't point the name at a new box
```

> **`const` locks the label to the box, not the contents of the box.**
> For a number, string or boolean there are no contents, so `const` means it can
> never change at all.

This is exactly why React (Lesson 07) makes you build *new* objects instead of
changing old ones. More on that in Lesson 03.

> 📎 **Deeper dive:** [extras/const-let-and-assignment.md](extras/const-let-and-assignment.md):
> why `info + 2` changes nothing, what `+=` / `++` really are, `const` in loops, and a drill.

---

## 4. Truthy and falsy: the most important table in JavaScript

`if (x)`, `x || y`, `x && y` and `!x` don't check for `true`. They check
whether `x` is **truthy**. Exactly **six** values are falsy:

```
false    0    ''    null    undefined    NaN
```

**Everything else is truthy.** That includes some values that look empty:

```
'0'     'false'     []     {}     ' '     -1
```

So `if ([])` runs. An empty notebook `{}` is truthy. That's why
`NotebookContext.jsx` counts keys instead:

```js
const savedWordCount = Object.keys(state.savedWords).length   // 0, which IS falsy
```

---

## 5. `||`, `??`, `&&`, `?.`: the four shortcuts

### `a || b`: "a, unless a is falsy, then b"

```js
const bg = THEME_BG[theme] || THEME_BG.light
```

If `theme` is something unexpected, `THEME_BG[theme]` is `undefined` (falsy),
so you get the light background. A safe default.

### `a ?? b`: "a, unless a is null/undefined, then b"

`src/components/vocabulary/VocabList.jsx`, line 130:

```js
const best = bestScoresByQuiz(quizScores)[quizId] ?? null
```

**Why `??` and not `||` here?** Because a best score can be **0**. With `||`,
a real score of 0 (falsy!) would be thrown away and replaced. `??` only
replaces `null`/`undefined`, so 0 survives.

> 🪤 **The 0 trap.** Whenever the value can legitimately be `0` or `''`, use
> `??`. `limit || 10` turns a deliberate limit of 0 into 10. This is one of
> the most common bugs in JavaScript.

### `a && b`: "if a is truthy, then b"

Mostly used in JSX: `{isPro && <ProBadge />}` (Lesson 06).

### `a?.b`: "a.b, but don't crash if a is nothing"

```js
const userId = user?.id || 'guest'
```

Before sign-in, `user` is `null`. `null.id` crashes the app with
**"Cannot read property 'id' of null"**. `user?.id` gives `undefined`
instead, and `|| 'guest'` turns that into `'guest'`.

`?.` also works on calls. `_layout.jsx` line 44:

```js
SplashScreen.setOptions?.({ duration: 250, fade: true })
```

"Call `setOptions` **if it exists**." Older versions of the library don't
have it, so this line works on both.

#### `?.` in more depth (added 2026-10-08, from a practice session)

**What it checks: the thing on its LEFT, not the property.** `a?.b` asks
*"is `a` missing (null or undefined)?"*, not *"does `a` have a `b`?"*.
Proof: reading a missing property never crashes in the first place:

```js
const user = { id: 'abc' }
user.name       // undefined, no crash, no ?. needed
null.name       // 💥 crash, because the thing on the LEFT is missing
null?.name      // undefined, and THIS is the case ?. exists for
```

So the one-line version is:

> **`a?.b`: if `a` is null/undefined, stop and give `undefined`; otherwise give `a.b` as normal.**

**It always gives `undefined`, never `null` and never `false`.** Even when
what it found was `null`, `?.` reports `undefined`. It treats both kinds of
"nothing" as missing and says so the same way:

```js
const word = { example: null }
word.example            // null       ← reading the key gives what's stored
word.example?.english   // undefined  ← ?. stopped, and ?. always says undefined
```

**Put it at every spot that might be missing.** It guards only the value
directly before it. `user?.profile.name` is safe if `user` is missing, but
crashes if `user` exists and `profile` is null. Write `user?.profile?.name`.
Once it stops, the rest of the chain is skipped.

**Pair it with `??` or `||` for a real fallback.** These *replace* the value;
they don't add to it. An expression always ends as exactly one value:

```js
word.example?.english ?? 'no example'
// step 1: word.example?.english   → undefined
// step 2: undefined ?? 'no example' → 'no example'   (just that, nothing else)
```

**Three forms:** `a?.b` (property), `a?.()` (call only if it exists), `a?.[x]` (bracket lookup).

**When not to use it:** when the value *should always* be there. `?.` turns a
loud crash into a quiet `undefined`, which can hide a bug. Use it when
"missing" is normal (signed out, still loading, an optional field), not to
make an error you don't understand go away. And it only works for reading:
`user?.name = 'x'` is a SyntaxError.

**Quick check.** `const word = { hmong: 'aub', example: null }`

1. `word?.hmong`
2. `word.example?.english`
3. `word.example.english`
4. `word.audio?.length`
5. `word?.example?.english ?? 'no example'`

<details>
<summary>Answers</summary>

1. `'aub'`
2. `undefined`: `example` is null, so `?.` stops and reports **undefined, not null**.
3. 💥 crash: nothing guards `example`.
4. `undefined`: `word.audio` is a missing key (`undefined`), so `?.` stops before `.length`.
5. `'no example'`: just that. `??` replaced the `undefined`.

First attempt (2026-10-08): 3½/5. The misses were #2 (answered `null`) and #5
(answered "null no example"), the same idea twice: **`?.` always reports
`undefined`, and `??` replaces rather than adds.**
</details>

---

## 6. `===` vs `==`

`===` means "same type AND same value". `==` converts types first, with
surprising rules (`0 == ''` is `true`!).

**Rule: always `===`.** There is one exception, and `storage.js` uses it:

```js
if (raw == null) return fallback
```

`x == null` is true for **both** `null` and `undefined`, and nothing else.
It's the one idiom where `==` is clearer. Everywhere else, `===`.

---

## 7. Template strings

Backticks let you put values inside a string. `useDailyQuota.js` line 23:

```js
const storageKey = (scope, name) => `kawmhmoob.quota.${scope || 'global'}.${name}`
// storageKey('abc-123', 'quiz')  →  'kawmhmoob.quota.abc-123.quiz'
// storageKey('', 'quiz')         →  'kawmhmoob.quota.global.quiz'
```

Anything inside `${ }` is a full JavaScript expression, so `||` works in there too.

---

## Gotchas

1. **`typeof null === 'object'`.** Check for null with `x === null`, not `typeof`.
2. **`[] ` and `{}` are truthy.** Check `.length` or `Object.keys(x).length`.
3. **`||` eats zeros.** Use `??` when 0 or `''` is a valid value.
4. **`const` objects are still mutable.** `const` protects the name, not the contents.
5. **Missing keys don't crash; reading *into* them does.** `obj.missing` is
   `undefined`; `obj.missing.x` crashes. That's what `?.` is for.

---
6
## Practice

```bash
node js-ts-course/practice/p01-values.mjs
```

Open the file. Each exercise has a stub that says `todo(...)`. Replace the stub
with your code until everything is ✅.

---

## You can now…

- [x] list the six falsy values from memory

0, false, null, undeifned, NaN, ""

- [x] explain why `best ?? null` is right and `best || null` is a bug

?? is used when you need 0 as a value or anything that isn't null/undefined to be allowed, || when you refuse everything falsy.
- [x] say what `user?.id || 'guest'` produces when `user` is `null`, `{}`, and `{ id: 'x' }`
null = undefined
{} = undefined 
x = 'x'
- [x] explain why `const state = {}` can still change
Objects and arrays can be changed within consst variables
- [x] explain the one place `==` is OK
When you need broad mutubility, for example, all types of falseys or trueys. 
