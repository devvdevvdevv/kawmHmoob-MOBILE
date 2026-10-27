# 11 — TypeScript I: types for what you already write

TypeScript is **JavaScript plus labels that say what kind of value goes
where**. A checker reads the labels and complains *while you type* when they
don't match, instead of your app crashing on a phone three days later.

You already think in types. Every comment like `// name : the feature/quota id`
or `// a name from the shared Icon set` in your code is a type written in
English. TypeScript makes those comments **checked**.

---

## 1. Start from your code: bugs TypeScript would have caught

From the comments in your own repo:

- `scripts/check-path.mjs`: *"A typo in a category id produces a SHORTER unit,
  not an error — `classifers` simply contributes no words."* With a type listing
  the valid category ids, `'classifers'` is a red squiggle the moment you type it.
- `Button.jsx`: `VARIANTS[variant] || VARIANTS.primary`. If someone writes
  `variant="primay"`, the fallback hides the typo and the button just looks wrong.
  With `variant: 'primary' | 'secondary' | 'ghost' | 'danger'`, it can't compile.
- `NotebookContext.jsx` `saveWord` returns `false` when the notebook is full.
  A caller that ignores the return value has a silent bug. TS can't force you to
  read it, but `saveWord(wordId: string): boolean` makes it visible in every
  autocomplete popup.
- Lesson 04's "got: undefined" from wrong import braces: TS reports it as
  *"Module has no exported member 'Button'. Did you mean to use 'import Button from'?"*

You wrote a whole folder of `scripts/check-*.mjs` to catch data mistakes after
the fact. TypeScript is the same idea, built into the editor, for code.

---

## 2. How it works: types are erased

```ts
function totalForLevel(level: number): number {    // TypeScript
  …
}
```

becomes, before running:

```js
function totalForLevel(level) {                    // plain JavaScript
  …
}
```

**Types don't exist at runtime.** They're checked, then stripped. Expo's Babel
strips them in the app; Node 22 strips them when you run a `.mts` file. So:

- TS can't change what your code *does*, only tell you when it's wrong.
- You can't `if (typeof x === MyType)`. The type is gone by then. You check
  values (`typeof x === 'string'`), and TS understands those checks (§6).
- **Running and type-checking are two separate steps.** `node p11-types.mts` runs
  it *even with type errors*. `npx tsc -p js-ts-course/practice` is the checker.
  In the app, VS Code shows errors as you type, and `npx tsc --noEmit` checks the
  whole project.

---

## 3. Annotations, and when to skip them

```ts
let count: number = 0
const name: string = 'aub'
const tags: string[] = ['mammal', 'pet']
function double(n: number): number { return n * 2 }
```

But TS **infers** most types, so you don't need to write them everywhere:

```ts
let count = 0                  // inferred: number
const tags = ['mammal']        // inferred: string[]
function double(n: number) { return n * 2 }    // return inferred: number
```

**Rule of thumb:**
- ✅ Always annotate **function parameters**. TS can't guess what callers will pass.
- ✅ Annotate **exported function return types**. That documents the contract,
  and catches you returning the wrong thing.
- ❌ Don't annotate local variables whose value makes the type obvious.

---

## 4. Object types: describing your data

```ts
type Word = {
  id: string
  hmongRPA: string
  english: string
  category: string
  tags: string[]
  audioFile: string | null                       // "a string, or deliberately nothing"
  exampleSentence?: { hmong: string; english: string }   // ? = may be missing entirely
}
```

Now:

```ts
const dog: Word = { id: 'animals-dog', hmongRPA: 'aub', english: 'dog',
                    category: 'animals', tags: ['pet'], audioFile: null }   // ✅

const bad: Word = { id: 'x', english: 'dog' }
// ❌ Type '{ id: string; english: string; }' is missing the following properties
//    from type 'Word': hmongRPA, category, tags, audioFile
```

- `?` = the key may be absent (its type includes `undefined`).
- `| null` = the key is present, but may hold `null`.
  These match Lesson 01's `undefined` vs `null` distinction exactly.

### `type` vs `interface`

```ts
interface Word { id: string; … }    // nearly the same thing
```

They're 95% interchangeable. **Use `type`** in this course and project: it
also handles unions (next section), which `interface` can't.

---

## 5. Union types: "one of these"

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type QuizStatus = 'idle' | 'active' | 'finished' | 'reviewing'
```

A union of **literal strings** is TypeScript's best feature for an app like
yours. Every place you have a fixed set of ids, statuses or variants, a union
makes typos impossible and gives you autocomplete:

```ts
const v: ButtonVariant = 'ghost'     // ✅ and the editor offered it as you typed
const w: ButtonVariant = 'primay'    // ❌ Type '"primay"' is not assignable to type 'ButtonVariant'
```

Unions of different kinds work too: `string | null`, `number | 'unlimited'`.

---

## 6. Narrowing: TypeScript follows your `if`s

With `"strict": true`, TS won't let you use a maybe-missing value as if it's definitely there:

```ts
function hmongOf(words: Word[], id: string): string {
  const word = words.find((w) => w.id === id)    // type: Word | undefined
  return word.hmongRPA
  //     ~~~~ ❌ 'word' is possibly 'undefined'
}
```

That error **is** the "Cannot read property 'hmongRPA' of undefined" crash,
caught before it happens. Fix it with a normal JS check, and TS *narrows* the type:

```ts
  if (!word) return '?'          // after this line, TS knows word is Word
  return word.hmongRPA           // ✅
// or:  return word?.hmongRPA ?? '?'
```

TS understands `if (x)`, `typeof x === 'string'`, `x === null`, `Array.isArray(x)`,
`'key' in obj`, and early `return`s. **You narrow with the same JavaScript
you'd write anyway. TS just checks that you did.**

---

## 7. Typing functions and props

### Function types

```ts
type OnPress = () => void                      // takes nothing, returns nothing useful
type Scorer = (answer: string, correct: string) => boolean
```

### Component props

```tsx
type ButtonProps = {
  children?: React.ReactNode       // anything React can render
  icon?: IconName
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

export default function Button({ children, variant = 'primary', size = 'md' }: ButtonProps) {
```

Now every `<Button variant="…">` in the app is checked, and hovering
`<Button` in VS Code shows exactly what it accepts. This is where TypeScript
feels like a superpower in React.

### `any` and `unknown`

- `any` = "turn the checker off for this value." Anything goes, nothing is
  checked. It spreads: everything touching an `any` becomes unchecked too.
  **Avoid it.** It's a hole in the floor.
- `unknown` = "I don't know what this is *yet*." You must narrow it before
  using it. **Use this for data from outside**: `JSON.parse`, storage, the
  network, `catch (err)`.

```ts
function readScore(raw: unknown): number | null {
  if (typeof raw === 'number') return raw     // narrowed to number
  return null
}
```

---

## 8. Reading TypeScript errors

TS errors look scary but always have the same shape:

```
p11-types.mts:42:9 - error TS2322: Type 'string' is not assignable to type 'number'.
               ^^^^ line:column        ^^^^^^ the code     ^^^ the actual message
```

1. **Go to the line:column.** The squiggle is exactly where it is.
2. **Read the last line of the message first.** In long errors, the most
   specific reason is at the bottom of the indented chain.
3. **"X is not assignable to Y"** = "you gave me X where I needed Y". Ask:
   is the *value* wrong, or is the *type* wrong?
4. **"possibly 'undefined'"** = add a check (§6).
5. **"Property 'x' does not exist on type 'Y'"** = a typo, or a key you forgot to
   add to the type.

---

## Practice

```bash
node js-ts-course/practice/p11-types.mts       # runs the code (ignores types)
npx tsc -p js-ts-course/practice               # checks the types
```

This file has **two** kinds of checks:
- the runtime checks you know, printed by `node`;
- **type checks**: lines marked `// @ts-expect-error`. That comment means "the
  next line *should* be a type error". If your type is too loose and the line
  compiles, `tsc` reports **"Unused '@ts-expect-error' directive"**. So `tsc`
  passes only when your types reject the bad code *and* accept the good code.

When you start, `tsc` prints a pile of errors. That's expected: the types are
all `any` placeholders. Work through them one at a time.

---

## You can now…

- [ ] explain "types are erased", and why `node` runs code with type errors
- [ ] write an object `type` with optional (`?`) and nullable (`| null`) fields
- [ ] use a union of string literals for a fixed set of values
- [ ] fix "possibly 'undefined'" by narrowing
- [ ] type a component's props
- [ ] choose `unknown` over `any` for outside data
- [ ] read a TS error from the bottom line up
