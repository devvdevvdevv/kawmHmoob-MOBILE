# Extra: `const`, `let`, and what actually changes a variable

A companion to Lesson 01 §3. Written 2026-10-08 from a practice question:
*"`let` can be incremented, `const` can't — but does `info + 2` change `info`?"*

---

## 1. A calculation never changes a variable

`info + 2` **works out** a new value. It doesn't store it anywhere. If you
don't keep the answer, it's thrown away, and the variable is untouched.

```js
let info2 = 0
info2 + 2          // the answer is 2… but nobody kept it
info2              // still 0 ❗
```

Only an **assignment** (`=`) changes a variable:

```js
let info2 = 0
info2 = info2 + 2  // work out 0 + 2, then STORE it back in info2
info2              // 2 ✅
```

Shortcuts. Each one is a hidden `=`:

| Shortcut | Means |
|---|---|
| `x += 2` | `x = x + 2` |
| `x -= 2` | `x = x - 2` |
| `x++` | `x = x + 1` |
| `x--` | `x = x - 1` |

---

## 2. `const` forbids the `=`, and nothing else

```js
const info = 0
info + 2           // ✅ just a calculation: gives 2, info is still 0
info * 10          // ✅ also fine: gives 0
info = info + 2    // ❌ TypeError: Assignment to constant variable
info += 2          // ❌ same (hidden `=`)
info++             // ❌ same (hidden `=`)
```

Want the result? **Give it a new name:**

```js
const info = 0
const total = info + 2   // total is 2, info is still 0
```

> **`let` can be re-assigned (`=`, `+=`, `++`). `const` can't. Both can be
> *used* in calculations as much as you like, and a calculation never changes
> the variable.**

---

## 3. "Changing what's inside": only objects and arrays

A number (or string, or boolean) has no "inside". `0` is just `0`, and the only
way to get a different number into a variable is `=`.

Objects and arrays are **boxes with contents**. `const` locks the *label to the
box*, not the *contents*:

```js
const progress = { count: 0 }
progress.count = progress.count + 2   // ✅ changing what's INSIDE the box
progress.count                        // 2
progress = { count: 5 }               // ❌ pointing the label at a NEW box

const words = []
words.push('aub')                     // ✅ contents changed
words = ['miv']                       // ❌ new box
```

(In React state you shouldn't change the inside either, but that's a React
rule, not a `const` rule. See Lesson 03 §5.)

---

## 4. `const x = someFunction()` stores the result once

```js
const today = dayKey()     // runs dayKey() ONCE and stores "2026-10-08"
today                      // "2026-10-08", and reading it does NOT call dayKey() again
```

The variable holds the **answer**, not the question. If you need a fresh answer
(say, after midnight), call the function again.

---

## 5. In loops

```js
for (let i = 0; i < 3; i++) { … }    // must be `let`: i++ re-assigns the same i each round
for (const word of words) { … }      // `const` is fine: each round gets a BRAND-NEW `word`
```

From your own code, `src/lib/leveling.js`:

```js
let sum = 0                                          // let: it's about to be re-assigned
for (let i = 1; i < L; i++) sum += BASE + (i - 1) * GROWTH
return sum
```

Both `sum` and `i` change every round, so both are `let`. Everything else in that
file is `const`, because it never changes after it's set.

---

## 6. Which one to pick

> **Start with `const`. Switch to `let` only when you need to write `=` (or
> `+=`, `++`) on that name later.**

If you're unsure, use `const`. If you were wrong, JavaScript tells you
immediately ("Assignment to constant variable"), and you change that one word.

---

## Drill: what's the final value, or is it an error?

```js
// A
let a = 5
a + 1
// a is ?

// B
let b = 5
b = b + 1
// b is ?

// C
const c = 5
c += 1
// c is ?

// D
const d = 5
const e = d + 1
// d is ?   e is ?

// E
const box = { n: 5 }
box.n++
// box.n is ?

// F
let f = 0
for (let i = 0; i < 3; i++) f += 2
// f is ?
```

<details>
<summary>Answers</summary>

- **A:** `5`. `a + 1` was calculated and thrown away.
- **B:** `6`. The `=` stored it.
- **C:** ❌ TypeError. `+=` is an assignment, and `c` is `const`.
- **D:** `d` is `5`, `e` is `6`. The result went into a new name.
- **E:** `6`. Changing the *inside* of a `const` object is allowed.
- **F:** `6`. Three rounds of `f = f + 2`.
</details>
