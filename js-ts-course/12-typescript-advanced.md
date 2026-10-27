# 12 — TypeScript II: generics, unions, and reducers

Lesson 11 gave you types for single values. This lesson covers the four tools
that make TypeScript fit **your actual app**: generics (for `loadJSON` and
`useState`), discriminated unions (for reducers), `Record` / `keyof typeof`
(for lookup tables like `POINT_SOURCES`), and typed context.

---

## 1. Generics: a type with a blank in it

`loadJSON` returns whatever was stored. What's its return type?

```ts
async function loadJSON(key: string, fallback: any): Promise<any>    // 😞 type safety gone
```

It depends on the caller: a notebook for one, a quota record for another. A
**generic** is a type *parameter*, a blank the caller fills in:

```ts
async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  …
}

const notebook = await loadJSON('kawmhmoob.notebook.guest', initialState)   // T = typeof initialState
const count    = await loadJSON('some.counter', 0)                           // T = number
```

`<T>` declares the blank. TS usually **infers** it from the arguments (here,
from `fallback`), so callers rarely write `loadJSON<number>(…)` by hand.

You've been using generics all along:

```ts
string[]                // is Array<string>
Promise<number>         // a ticket for a number
useState<Word | null>(null)   // without <…>, TS would think the state can ONLY ever be null
```

> ⚠️ **Honesty check.** `loadJSON<T>` *promises* the stored data is a `T`, but
> it really just runs `JSON.parse`. If storage holds an old format, the type is
> a lie. That's why the notebook does `{ ...initialState, ...next }`: it fills
> in any missing fields. For data from outside (storage, network), types
> describe what you **expect**, so you still **validate** what you get. When in
> doubt, return `unknown` and narrow (Lesson 11 §7).

---

## 2. Discriminated unions: typing actions

Your quiz reducer's actions are objects with different shapes, told apart by `type`:

```ts
type QuizAction =
  | { type: 'start'; questions: Question[] }
  | { type: 'answer'; selected: string; isCorrect: boolean }
  | { type: 'next' }
  | { type: 'review' }
  | { type: 'reset' }
```

`type` is the **discriminant**: one field whose literal value says which shape
this is. Inside a `switch`, TS narrows to the matching shape:

```ts
function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'start':
      return { …, questions: action.questions }     // ✅ TS knows `questions` exists here
    case 'next':
      return { …, questions: action.questions }     // ❌ Property 'questions' does not exist on type '{ type: "next" }'
```

And at every `dispatch`:

```ts
dispatch({ type: 'answr', selected: 'aub', isCorrect: true })   // ❌ typo caught
dispatch({ type: 'answer', selected: 'aub' })                   // ❌ isCorrect missing
```

### The exhaustive check

Add a case to the union but forget it in the reducer? Make that a compile error:

```ts
    default: {
      const unhandled: never = action    // ❌ if any action type reaches here
      return state
    }
```

`never` is the type with **no values**. If every case is handled, `action` has
been narrowed to "nothing left" by the time it reaches `default`, so the
assignment is fine. If you forget `'review'`, `action` is still
`{ type: 'review' }` there, which isn't assignable to `never`, and you get an
error that names the case you forgot.

### Status unions make impossible states impossible

Lesson 08 said "one `status` beats several booleans." TypeScript can go
further and attach **different data to each status**:

```ts
type SendState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent' }
  | { status: 'failed'; error: string; retry: boolean }
```

Now `error` only exists when `status === 'failed'`. You literally *can't*
read an error from a successful send. (Compare with
`learning/ui-patterns/send-status-and-result-screens.md`.)

---

## 3. `Record`, `keyof typeof`, `as const`, `satisfies`: typing lookup tables

### `Record<K, V>`: an object with keys K and values V

```ts
type PointSource = 'lesson-step' | 'quiz-complete' | 'speak-attempt'   // …
type PointRule = { points: number; capped: boolean; label: string }

const POINT_SOURCES: Record<PointSource, PointRule> = {
  'lesson-step': { points: 2, capped: true, label: 'Lesson step' },
  …
}
```

TS now demands **every** source has a rule (forget one → error), and
`award('quiz-complte')` is a typo error.

### Deriving the union FROM the object

Writing the list of keys twice (once in the union, once in the object) is
annoying. Flip it around: write the object, and **derive** the type:

```ts
const VARIANTS = {
  primary: 'rounded shadow-warm bg-clay-600',
  ghost: 'rounded border border-cream-300',
}
type Variant = keyof typeof VARIANTS      // 'primary' | 'ghost'
```

Read it inside-out: `typeof VARIANTS` = "the type of this object";
`keyof` = "the union of its keys". Add a variant to the object, and the type
updates itself.

### `as const`: "don't widen my literals"

```ts
const SIZES = ['sm', 'md', 'lg'] as const   // readonly ['sm', 'md', 'lg'], not string[]
type Size = (typeof SIZES)[number]          // 'sm' | 'md' | 'lg'
```

### `satisfies`: check the shape, keep the precise type

```ts
const POINT_SOURCES = {
  'lesson-step': { points: 2, capped: true, label: 'Lesson step' },
  …
} satisfies Record<string, PointRule>     // every value must be a valid PointRule…

type PointSource = keyof typeof POINT_SOURCES   // …but the keys stay exact
```

With `: Record<string, PointRule>`, the keys would widen to "any string" and
you'd lose the typo checking. `satisfies` gives you both: it **validates**
without **forgetting**. This is the pattern for `VARIANTS`, `SIZES`,
`POINT_SOURCES`, `TONES` and every other lookup table in your app.

---

## 4. Utility types: reshaping types you already have

| Utility | Means | Example from your app |
|---|---|---|
| `Partial<T>` | every field optional | `updateNote(id, patch: Partial<Note>)` |
| `Pick<T, 'a' \| 'b'>` | only these fields | `Pick<Word, 'id' \| 'hmongRPA'>` for a chip |
| `Omit<T, 'a'>` | all but these | `Omit<Note, 'id' \| 'createdAt'>` for "the fields a user can edit" |
| `ReturnType<typeof f>` | whatever `f` returns | `type Level = ReturnType<typeof levelFromPoints>` |
| `Readonly<T>` | can't assign to fields | state you must not mutate |

`ReturnType` is especially handy while converting: `levelFromPoints` returns a
7-field object, and you get its type for free instead of writing it out.

---

## 5. Typing React

### State

```ts
const [used, setUsed] = useState(0)                 // inferred number, nothing to write
const [word, setWord] = useState<Word | null>(null)  // must say it: `null` alone tells TS nothing
```

### Reducer

```ts
const [state, dispatch] = useReducer(reducer, initial)
// if `reducer` is typed (state: QuizState, action: QuizAction) => QuizState,
// then state and dispatch are typed automatically
```

### Context: where the `throw` pays off

```ts
type NotebookValue = {
  savedWords: Record<string, SavedWord>
  savedWordCount: number
  saveWord: (wordId: string, note?: string) => boolean
  // …
}

const NotebookContext = createContext<NotebookValue | null>(null)

export function useNotebook(): NotebookValue {
  const ctx = useContext(NotebookContext)            // NotebookValue | null
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx                                         // narrowed to NotebookValue ✅
}
```

The `throw` you already have (Lesson 09) is exactly what narrows away `null`, so
every screen gets a non-null, fully-typed notebook. Your JS was already shaped
for TypeScript.

### Custom hooks

Annotate the parameters; let TS infer the returned object, or name it with
`ReturnType<typeof useDailyQuota>` where another file needs it.

### Events and children

```ts
children: React.ReactNode
onChangeText: (text: string) => void
style?: StyleProp<ViewStyle>                // from 'react-native'
```

---

## Practice

```bash
node js-ts-course/practice/p12-generics.mts
npx tsc -p js-ts-course/practice
```

Same two-part rule as Lesson 11. The last exercise is a typed version of your
Lesson 08 flashcard reducer, including the exhaustive `never` check.

---

## You can now…

- [ ] write a generic function and explain what `<T>` is
- [ ] explain why `useState<Word | null>(null)` needs the `<…>`
- [ ] type reducer actions as a discriminated union, with an exhaustive `never` check
- [ ] derive a union from an object with `keyof typeof`
- [ ] explain what `satisfies` does that `: Record<…>` doesn't
- [ ] use `Partial`, `Pick`, `Omit` and `ReturnType`
- [ ] type a context so `useX()` returns a non-null value
