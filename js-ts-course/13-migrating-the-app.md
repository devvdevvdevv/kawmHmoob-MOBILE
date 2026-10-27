# 13 — Converting KawmHmoob to TypeScript

This is where the course turns into real work on the real app. You'll convert
it **one file at a time**, starting with the safest files and working up. The
app keeps running the whole way: TypeScript and JavaScript files can import
each other freely, so there's never a "big bang" day.

> **You do every conversion.** This lesson is the map and the checklist.

---

## 1. Where you're starting (measured 2026-10-04)

- **0** `.ts`/`.tsx` files in `app/` or `src/`. Everything is `.js`/`.jsx`.
- `tsconfig.json` is just `{ "compilerOptions": {}, "extends": "expo/tsconfig.base" }`.
  Expo's base already sets `"allowJs": true` (JS and TS can mix) and `"noEmit": true`
  (tsc only checks; Babel does the real compiling).
- `typescript ~5.9` is already in `devDependencies`. **Nothing to install.**
- `npx tsc --noEmit` currently reports errors **only** from this course's own
  unfinished practice files. Step 0 fixes that.

---

## 2. Step 0: set up the checker (one sitting)

1. **Turn on strict mode and scope the check.** Change `tsconfig.json` to:

   ```json
   {
     "extends": "expo/tsconfig.base",
     "compilerOptions": {
       "strict": true
     },
     "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts"]
   }
   ```

   - `strict` turns on the checks that actually catch bugs (`possibly undefined`,
     no implicit `any`). Without it, TS is much weaker. Turn it on **now**, while
     there's nothing to break. Turning it on later, after 50 files, is painful.
   - `include` lists only `.ts`/`.tsx` files. That leaves out the course's `.mts`
     practice files (they have their own `tsconfig`), and JS files are only
     looked at when a TS file imports them.

2. **Add a script** to `package.json`'s `"scripts"`:
   ```json
   "typecheck": "tsc --noEmit"
   ```
   Run `npm run typecheck`. Expect no output. That's your green baseline.

3. **Commit** this setup on its own before converting anything.

---

## 3. Step 1: `// @ts-check` (types without renaming)

Before renaming anything, you can type-check a **JS** file by putting this
on its first line:

```js
// @ts-check
```

VS Code will start underlining problems in that file, using types it *infers*
plus any you write in **JSDoc** comments:

```js
// @ts-check

/**
 * Total points needed to REACH a level (level 1 = 0).
 * @param {number} level
 * @returns {number}
 */
export function totalForLevel(level) { … }
```

**Try it on `src/lib/leveling.js`** first: add `// @ts-check` and JSDoc for each
exported function. You get real type checking with zero risk, since the file
is still `.js` and nothing else changes. This is how you warm up. Doing two
or three `lib/` files this way is a good exercise, but the real goal is renaming.

---

## 4. The order: follow the layers upward

Lesson 00 §2's layers tell you the order. Convert **bottom-up**, so every file
you convert imports things that are already typed.

| Phase | What | Why this order |
|---|---|---|
| **A** | a shared `src/types.ts` | the vocabulary of your app: `Word`, `Category`, `Unit`, `Note`, `QuizStatus`… |
| **B** | `src/lib/*` (pure files first: `leveling`, `daily`, `quotaLimits`, `access`) | pure functions, no React, quickest wins (Lessons 11–12) |
| **C** | `src/data/*` | gives the whole app typed content. ⚠️ read §6 first |
| **D** | `src/hooks/*` | `useQuizState` first: you already typed that reducer in p12 |
| **E** | `src/context/*` | the typed-context pattern, Lesson 12 §5 |
| **F** | `src/components/ui/*` → other components | `Button` first: typed props pay off in every screen |
| **G** | `app/*` screens | last, because by now everything they import is typed |

**Phase A sketch.** Start `src/types.ts` with just the types you need for Phase B,
and grow it as you go. Read the real data to write them: open `vocabulary.js` and
describe one word honestly, including the optional fields (`senses`,
`exampleSentence`). Which fields does *every* word have? Which only some?
That investigation is the lesson.

---

## 5. Converting one file: the checklist

Do this **for every file**, one file per commit:

1. **Rename** it: `leveling.js` → `leveling.ts` (`.jsx` → `.tsx` if it has JSX).
2. **Fix the importers.** Your app writes extensions in imports
   (`'../../src/lib/leveling.js'`), and that path no longer exists. Find them all:
   ```bash
   grep -rn "lib/leveling.js" app src
   ```
   (7 hits for `leveling` today.) Change each to the **extensionless** path:
   `'../../src/lib/leveling'`. Metro and TypeScript both resolve that to `.ts`.
3. **Run `npm run typecheck`.** Fix the errors, starting from the top. Use §7's table.
4. **Add types to the exports.** Parameter types and return types on every
   exported function, even where inference works. They're the file's contract.
5. **Run the app** and click through the screens that use the file. Types are
   erased (Lesson 11 §2), so a conversion should never change behaviour. If
   something behaves differently, you changed logic by accident.
6. **Run `npm run lint`** too.
7. **Commit**: `ts: convert lib/leveling`.

---

## 6. Traps specific to this repo

1. **`scripts/` import the data files by path.** `scripts/check-path.mjs` does
   `await import(asUrl('src/data/path.js'))`. Rename `path.js` → `path.ts` and
   that script breaks. Your Node (22.19) can import `.ts` files directly, so
   update those paths to `.ts` and re-run every `check-*` script after each data
   conversion. Do a `grep -rn "src/data/" scripts` before Phase C.
2. **The huge data files.** `vocabulary.js` is thousands of lines. Don't
   annotate every word. Type the array once: `const RAW_CATEGORIES: Category[] = [ … ]`
   (or `satisfies Category[]`, Lesson 12 §3), and TS checks every entry. It may
   find real data mistakes. Good. Fix them *in a separate commit* from the rename,
   so the history shows which was which.
3. **Commented-out code stays.** House rule: things are commented out, not
   deleted. TS ignores comments, so leave them exactly as they are, including
   `// Was:` lines.
4. **NativeWind `className`.** `nativewind-env.d.ts` is what makes `className`
   a legal prop on `View`/`Text`/`Pressable`. Keep it in `include` (Step 0 does).
   Third-party components (`Animated.View`, etc.) may not accept it, which is the
   same thing `learning/concepts/nativewind-classname-on-third-party.md` describes,
   now reported by the compiler.
5. **`require()` for images** gives back a `number` type in RN. That's fine.
6. **`useState({})` and `useState([])`** infer a type of "empty object/array
   forever". Write the type: `useState<Record<string, SavedWord>>({})`.

---

## 7. The errors you'll see most, and the honest fix

| Error | Means | Honest fix |
|---|---|---|
| `Parameter 'x' implicitly has an 'any' type` | strict mode wants a parameter type | write it: `(x: string)` |
| `'x' is possibly 'undefined'` | a `.find`, a `?` field, a lookup by key | narrow: `if (!x) return …`, or `?.` / `??` |
| `Property 'foo' does not exist on type 'Bar'` | typo, or the type is missing a field | fix the typo, or add the field to the type if the data really has it |
| `Type 'string' is not assignable to type '"primary" \| …'` | a plain string where a union is required | type the source as the union too, or `as const` on the literal |
| `Argument of type 'null' is not assignable…` | `useState(null)` with no type | `useState<Word \| null>(null)` |
| `Object literal may only specify known properties` | an extra key, usually a typo | fix it, or add it to the type |
| `'err' is of type 'unknown'` | in a `catch` | `err instanceof Error ? err.message : String(err)` |
| `Could not find a declaration file for module 'x'` | a library without types | `npm i -D @types/x` if it exists; otherwise a one-line `declare module 'x'` in a `.d.ts` |

### The three escape hatches, and why to resist them

- `any`: switches checking off and spreads (Lesson 11 §7).
- `// @ts-ignore`: hides the error but not the bug. (`@ts-expect-error` is
  slightly better: it at least complains once the error goes away.)
- `as Something`: tells TS "trust me". It's a lie if you're wrong.

Each is occasionally right (a library with wrong types, a genuinely untypeable
spot). When you use one, **write a comment saying why**, the same way your code
already explains every ⚠️ decision. If you can't write the reason, you haven't
found the real fix yet.

---

## 8. A milestone plan

| Milestone | Done when |
|---|---|
| 🥉 **First blood** | Step 0 committed + `leveling.ts`, `daily.ts` converted |
| 🥈 **Typed core** | all of `src/lib` + `src/types.ts` |
| 🥇 **Typed data** | `src/data` converted, every `scripts/check-*` still runs |
| 💎 **Typed state** | hooks + contexts. `useNotebook()` returns a typed, non-null value |
| 🏆 **All TypeScript** | `app/` converted; `npm run typecheck` clean |

Write a dated note in `notes/` at each milestone (your existing convention):
what you converted, what TS caught, and what surprised you. Those notes become
your record of how much you've learned.

---

## You can now…

- [ ] set up `strict` + `include` + a `typecheck` script
- [ ] use `// @ts-check` and JSDoc to type a JS file without renaming it
- [ ] convert a file, including fixing its importers' paths
- [ ] explain why the order is lib → data → hooks → context → components → screens
- [ ] recognise the top 8 errors and fix them without `any`
