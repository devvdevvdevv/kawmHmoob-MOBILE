# 03 — Arrays and objects

Your app is mostly **data**: 1,300+ words, units, lessons, stories, quiz
answers, saved progress. Almost all of it is arrays of objects. If you can
fluently reshape arrays and objects, you can write most of the app's logic.
This is the lesson that will pay you back the most.

---

## 1. Start from your code

`src/lib/access.js`:

```js
const studied = category.words.filter((w) => vocabProgress[w.id]).length
const needed = Math.ceil(category.words.length * QUIZ_UNLOCK_RATIO)
```

```js
function lessonOrder() {
  return units.flatMap((u) => u.lessons.map((l) => l.id))
}
```

`src/context/NotebookContext.jsx`:

```js
setState((s) => ({
  ...s,
  savedWords: {
    ...s.savedWords,
    [wordId]: { note, savedAt: new Date().toISOString() },
  },
}))
```

By the end of this lesson, every symbol above will be obvious.

---

## 2. The shape of your data

Look at one word in `src/data/vocabulary.js`:

```js
{
  id: 'animals-dog',
  hmongRPA: 'aub',
  english: 'dog',
  category: 'animals',
  tags: ['mammal', 'pet'],
  audioFile: null,
  exampleSentence: { hmong: '…', english: '…' },
}
```

That's an **object** (named fields), containing an **array** (`tags`, an
ordered list) and another **object** (`exampleSentence`). A category is an
object with a `words` array of these. `categories` is an array of categories.
Arrays of objects of arrays: that's all your data ever is.

Two ways to read a field:

```js
word.english          // dot: when you know the name while writing the code
word['english']       // bracket: same thing
progress[word.id]     // bracket: REQUIRED when the key is in a variable
```

---

## 3. The array methods you must know cold

These all take **a function** (Lesson 02 §6) and call it once per item.

| Method | Question it answers | Returns | Your code |
|---|---|---|---|
| `.map(fn)` | "turn each item into something else" | new array, same length | `u.lessons.map((l) => l.id)` |
| `.filter(fn)` | "keep only the ones where fn is truthy" | new array, shorter or equal | `words.filter((w) => vocabProgress[w.id])` |
| `.find(fn)` | "give me the first match" | one item, or `undefined` | |
| `.findIndex(fn)` | "where is the first match?" | a number, or `-1` | `allPhrases().findIndex((p) => p.id === phraseId)` |
| `.some(fn)` | "does ANY match?" | boolean | `exempt.some((r) => pathname.startsWith(r))` |
| `.every(fn)` | "do ALL match?" | boolean | `children.every((c) => typeof c === 'string')` in Button |
| `.reduce(fn, start)` | "boil the list down to one value" | anything | `cats.reduce((n, c) => n + c.words.length, 0)` |
| `.flatMap(fn)` | "map, then flatten one level" | new array | `lessonOrder()` above |
| `.includes(x)` | "is x in here?" | boolean | |
| `.indexOf(x)` | "where is x?" | number or `-1` | `lessonOrder().indexOf(lessonId)` |

### First: what is that `w`?

The single most useful thing to be sure of before using any of them. **`w` is
each element, one at a time** — not the array, not "the thing you're looking
for". The method calls your function once per item and hands it that item:

```js
const dictionary = [
  { hmongRPA: 'siab', english: 'liver' },
  { hmongRPA: 'kuv',  english: 'I, me' },
]

dictionary.find((w) => w.hmongRPA === 'kuv')
// call 1: w = { hmongRPA: 'siab', … }  → false
// call 2: w = { hmongRPA: 'kuv',  … }  → TRUE → stop, return that whole object
// result: { hmongRPA: 'kuv', english: 'I, me' }
```

Two consequences worth saying out loud:

- **The name is yours.** `w`, `item`, `entry`, `word` — it is just the callback's
  parameter. (`i` is a risky habit: everywhere else it means *index*.)
- **`.find` returns the ELEMENT, not the field.** So reaching the gloss is two
  steps, and the first can fail:

  ```js
  const entry = dictionary.find((w) => w.hmongRPA === word)
  if (!entry) return null          // ⚠️ nothing matched → undefined
  return entry.english             // the field lives on the ELEMENT
  ```

### ⚠️ The landmine: `=` inside a predicate

This is the one that costs an afternoon, because nothing throws:

```js
dictionary.find((w) => w.hmongRPA = 'kuv')     // ONE equals sign
```

That is an **assignment**, not a comparison. Three things happen at once:

1. it **overwrites** `hmongRPA` on the first element — your data is now wrong,
2. the expression evaluates to `'kuv'`, which is **truthy**,
3. so `.find` returns the **first** element, no matter what you searched for.

A wrong answer *and* corrupted data, silently. The fix is the third `=`:

```js
dictionary.find((w) => w.hmongRPA === 'kuv')   // ✅
```

| | means |
|---|---|
| `=` | assign — *make* this that |
| `===` | compare — *is* this that, no type conversion (Lesson 01 §6) |
| `==` | compare loosely — `0 == ''` is `true`. Don't. |

⚠️ **And nothing in this repo catches it.** I checked, rather than assuming:
eslint was run on exactly that line and reported no problems. The rule that
sounds like it would (`no-cond-assign`) only covers an assignment used as a
CONDITION — `if (x = y)`, `while (x = y)` — and an arrow's returned expression is
not a condition. So the editor stays quiet, the tests pass, and the data is
wrong. **The only check here is your own eye.**

Verified behaviour, so you know what the symptom looks like:

```js
const bad = [{ hmongRPA: 'siab', english: 'liver' }, { hmongRPA: 'kuv', english: 'I, me' }]
bad.find((w) => w.hmongRPA = 'kuv')
// → { hmongRPA: 'kuv', english: 'liver' }      ← "found" the wrong word
// bad[0] is now { hmongRPA: 'kuv', english: 'liver' }   ← and it was rewritten
```

Note the tell: the gloss and the headword no longer agree. If a lookup ever
returns a mismatched pair like that, suspect a stray `=` before anything else.

### Watching the data move — nine small ones

Every output below was run, smallest first.

**It returns the ELEMENT, and stops as soon as it has one:**

```js
const nums = [4, 9, 16, 25]
nums.find((n) => n > 10)
// n=4  → false
// n=9  → false
// n=16 → TRUE → stop
// → 16          (25 is never even looked at)
```

**Nothing matched:**

```js
nums.find((n) => n > 100)        // → undefined
```

**Strings — the element IS the string:**

```js
const words = ['siab', 'kuv', 'dej']
words.find((w) => w.startsWith('k'))   // → 'kuv'
```

**Objects — you get the whole object, not the field you tested:**

```js
const cats = [
  { id: 'animals', words: ['aub'] },
  { id: 'food',    words: ['mov', 'dej'] },
]
cats.find((c) => c.words.length > 1)
// → { id: 'food', words: ['mov', 'dej'] }     ← the element, NOT 2
```

**The callback also gets the index as its second argument:**

```js
nums.find((n, i) => i === 2)     // → 16   (the value AT index 2)
```

**The same question, three different answers — pick by what you need back:**

```js
nums.find((n) => n > 10)         // → 16        the first match (an item)
nums.filter((n) => n > 10)       // → [16, 25]  every match (always an array)
nums.some((n) => n > 10)         // → true      just "is there one?"
```

**Reaching a field afterwards, and why `?.` is not optional:**

```js
cats.find((c) => c.id === 'food')?.words.length   // → 2
cats.find((c) => c.id === 'nope')?.words.length   // → undefined, no crash
cats.find((c) => c.id === 'nope').words.length    // 💥 TypeError
```

That last line is the whole reason `WordDetail.jsx` writes

```js
const otherCards = (headwordOf(word.hmongRPA)?.definitions || [])
```

— the lookup can miss, so everything after it has to survive a miss.

**The model in one sentence:** `.find` asks your function a yes/no question about
each item in turn, and hands back **the first item that said yes** — or
`undefined` if nobody did.

### `.map`: transform each item

```js
[{ id: 'a' }, { id: 'b' }].map((w) => w.id)     // ['a', 'b']
```

### `.filter` then `.length`: count matches

```js
const studied = category.words.filter((w) => vocabProgress[w.id]).length
```

In words: "of this category's words, keep the ones that have a progress entry,
then count them."

### `.reduce`: the one that confuses everyone

```js
cats.reduce((n, c) => n + c.words.length, 0)
```

Think of a running total. `n` is the total so far, and starts at `0` (the last
argument). For each category `c`, the function returns the *new* total. After
the last category, that total is the result.

```
start          n = 0
category 1     n = 0  + 12  = 12
category 2     n = 12 + 6   = 18
category 3     n = 18 + 20  = 38   → result: 38
```

> 💡 If a `.reduce` is hard to read, a `for…of` loop with a `let total = 0` is
> **always** acceptable. Clarity beats cleverness.

### `.flatMap`: when each item gives you a list

```js
units.flatMap((u) => u.lessons.map((l) => l.id))
```

`.map` alone would give `[['l1','l2'], ['l3']]`, an array of arrays. `.flatMap`
flattens it to `['l1', 'l2', 'l3']`: every lesson id, in curriculum order.

### Chaining

Each of these returns an array, so you can chain them:

```js
words
  .filter((w) => w.tags.includes('pet'))
  .map((w) => w.english)
// ['dog', 'cat']
```

---

## 4. Objects as lookup tables

Instead of a chain of `if`s, your app uses objects as **dictionaries**:

```js
// Button.jsx
const VARIANTS = {
  primary: { base: 'rounded shadow-warm bg-clay-600', … },
  ghost:   { base: 'rounded border border-cream-300', … },
}
const v = VARIANTS[variant] || VARIANTS.primary
```

```js
// lib/leveling.js
export const POINT_SOURCES = {
  'quiz-complete': { points: 5, capped: true, label: 'Quiz finished' },
  …
}
```

Looking up `VARIANTS[variant]` is one step, however many variants exist, and
adding a variant is adding a line, not a branch. **When you see yourself
writing `if (x === 'a') … else if (x === 'b') …`, ask whether it should be a
lookup object.**

Your notebook also stores saved words as an **object keyed by id**, not as an
array:

```js
savedWords: { 'animals-dog': { note: '', savedAt: '…' }, … }
```

Why? "Is this word saved?" becomes `savedWords[id]`, which is instant, rather
than searching an array. **Use an array when order matters; use an object
keyed by id when you'll look things up.**

### Walking an object

```js
Object.keys(savedWords)     // ['animals-dog', 'food-rice']
Object.values(savedWords)   // [{ note, savedAt }, { note, savedAt }]
Object.entries(savedWords)  // [['animals-dog', {…}], ['food-rice', {…}]]
```

Once you have an array, all of §3 works on it.

---

## 5. References: the idea that explains React

Objects and arrays are **not copied** when you assign them. The variable holds
a *reference*, an arrow pointing to the one object in memory.

```js
const a = { count: 1 }
const b = a          // b points at the SAME object
b.count = 99
a.count              // 99 😱
```

React decides whether to re-render by asking **"is this the same reference as
before?"**. If you change an object in place, the arrow still points to the
same object, React thinks nothing changed, and **your screen doesn't update**.

So in React state you never change; you **copy and replace**.

### Spread `...`: making a copy with changes

```js
const copy = { ...s }                    // new object, same fields
const changed = { ...s, notes: [] }      // new object, `notes` overridden
const longer = [note, ...s.notes]        // new array with `note` at the front
```

Later keys win: in `{ ...s, notes: [] }`, the `notes: []` comes after the
spread, so it replaces `s.notes`.

### Nested updates: copy every level you pass through

Back to `saveWord`:

```js
setState((s) => ({
  ...s,                                  // 1. copy the whole state
  savedWords: {
    ...s.savedWords,                     // 2. copy the savedWords object
    [wordId]: { note, savedAt: … },      // 3. add/replace ONE key
  },
}))
```

`[wordId]:` in square brackets is a **computed key**: "use the *value* of
`wordId` as the key name." Without brackets, you'd literally create a key
called `"wordId"`.

Copying is **shallow**: `{ ...s }` makes a new outer object, but `s.notes` inside
is still the same array. That's why step 2 copies `savedWords` too: you copy
every level on the path to the thing you're changing, and only those levels.

### Immutable versions of the common edits

| Want to… | Mutating ❌ (in state) | Immutable ✅ |
|---|---|---|
| add to array | `arr.push(x)` | `[...arr, x]` |
| remove from array | `arr.splice(i, 1)` | `arr.filter((n) => n.id !== id)` |
| change one item | `arr[i].title = t` | `arr.map((n) => n.id === id ? { ...n, title: t } : n)` |
| set a key | `obj[k] = v` | `{ ...obj, [k]: v }` |
| delete a key | `delete obj[k]` | copy first: `const next = { ...obj }; delete next[k]` |
| sort | `arr.sort()` ⚠️ sorts in place | `[...arr].sort()` |

Every row of the right-hand column appears in `NotebookContext.jsx`. Go find
each one: `deleteNote` (filter), `updateNote` (map + spread), `unsaveWord`
(copy then delete), `createNote` (`[note, ...s.notes]`).

---

## 6. Destructuring objects and arrays

```js
const { user } = useAuth()                     // pull `user` out of an object
const { xp, streakData } = progress            // several at once
const [used, setUsed] = useState(0)            // pull by POSITION out of an array
const [w, t, u] = await Promise.all([...])     // app/admin-users.jsx
```

Objects destructure **by name**; arrays destructure **by position**. That's why
you can name `useState`'s pair anything you like.

---

## 7. `Map` and `Set`, briefly

`app/(tabs)/index.jsx` de-duplicates categories with a `Map`:

```js
const byId = new Map()
for (const c of categories) if (!byId.has(c.id)) byId.set(c.id, c)
const cats = [...byId.values()]
```

A `Map` is like an object but with methods (`.has`, `.get`, `.set`) and it
keeps insertion order. A `Set` holds unique values: `[...new Set(ids)]` is
the classic "remove duplicates" one-liner. Use them in `lib/` logic; for React
state, stick with plain objects and arrays, which are simpler to copy.

---

## Gotchas

1. `.find` returns `undefined` when nothing matches, so guard before using it: `if (!unit) return …`.
2. `.indexOf` returns `-1` (truthy!) when missing. Check `i > -1`, as `access.js` does.
3. `.sort()` and `.reverse()` change the original array. Copy first.
4. Spread is shallow. Copy every level on the path to your change.
5. `{ wordId: x }` makes a key named "wordId". `{ [wordId]: x }` uses its value.
6. Forgetting the start value in `.reduce` on an empty array throws.

---

## Practice

```bash
node js-ts-course/practice/p03-arrays-objects.mjs
```

It contains a small copy of your vocabulary data. Exercises 7–9 rebuild the
notebook's update functions, which are **pure** versions that take a state and
return a new one. This is the exact skill React needs.

---

## You can now…

- [ ] pick the right method out of map / filter / find / some / every / reduce for a question
- [ ] explain `.reduce` with a running-total table
- [ ] explain why changing an object in place doesn't update the screen
- [ ] write the immutable version of add / remove / change / set-key / delete-key
- [ ] explain `[wordId]:` (computed key)
- [ ] say when to store data as an array vs an object keyed by id
