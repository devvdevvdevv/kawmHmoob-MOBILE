# JavaScript → TypeScript, taught through KawmHmoob

A course for one student: you. Every example comes from **your own app**, so
the concepts are not abstract. You have already *used* almost everything in
here. This course is about *understanding* it well enough to write it from a
blank file, without copying a nearby pattern and hoping.

> **The rule of the course:** you type the code. The lessons explain, the
> practice files check your work, and nothing hands you a finished answer. If you
> get stuck, every exercise has a hint. Read the hint before you look anything up.

---

## How each lesson works

Every lesson follows the same five steps:

1. **Start from your code.** A real snippet from the app, with its file path.
2. **The concept.** What is actually happening, explained in plain words.
3. **Gotchas.** The mistakes that are easy to make, most of them already made somewhere in this repo.
4. **Practice.** Either a file in `practice/` that you run, or a task in the app.
5. **"You can now…"** A checklist. Don't move on until you can honestly tick every box.

### Running the practice files

From the `kawmHmoob-MOBILE` folder:

```bash
node js-ts-course/practice/p01-values.mjs
```

You'll see ❌ for every exercise you haven't written yet, and ✅ as you finish
them. Edit the file, save, run again. That loop (write → run → read the
error → fix) **is** programming. Get comfortable in it.

TypeScript practice files (`.mts`) run the same way, and also have a type check:

```bash
node js-ts-course/practice/p11-types.mts          # does the code work?
npx tsc -p js-ts-course/practice                  # are the types right?
```

---

## The route

Do these in order. Each lesson builds on the ones before it.

| # | Lesson | Practice | Your code it's built on |
|---|--------|----------|-------------------------|
| 00 | [The map of your app](00-the-map-of-your-app.md) | read-through tasks | the whole folder structure, `app/_layout.jsx` |
| 01 | [Values, variables, and the truth](01-values-and-variables.md) | `p01-values.mjs` | `lib/storage.js`, `useDailyQuota.js` |
| 02 | [Functions](02-functions.md) | `p02-functions.mjs` | `lib/leveling.js`, `ui/Button.jsx` |
| 03 | [Arrays and objects](03-arrays-and-objects.md) | `p03-arrays-objects.mjs` | `lib/access.js`, `NotebookContext.jsx` |
| 04 | [Modules: import and export](04-modules.md) | read-through tasks | every file's first 20 lines |
| 05 | [Async: waiting for things](05-async.md) | `p05-async.mjs` | `lib/storage.js`, `useDailyQuota.js` |
| 06 | [How React thinks](06-react-mental-model.md) | in-app: `app/playground.jsx` | `(tabs)/index.jsx`, `PathList.jsx` |
| 07 | [State and effects](07-state-and-effects.md) | in-app | `NotebookContext.jsx`, `_layout.jsx` |
| 08 | [Reducers: state machines](08-reducers.md) | `p08-reducer.mjs` | `hooks/useQuizState.js` |
| 09 | [Context and providers](09-context-and-providers.md) | in-app | `_layout.jsx`, `NotebookContext.jsx` |
| 10 | [Custom hooks](10-custom-hooks.md) | in-app | `hooks/useDailyQuota.js` |
| 10b | [Hooks & libraries field guide + 6 build projects](10b-hooks-and-libraries.md) | **real features you build** | every hook and library the app uses |
| 11 | [TypeScript I: types for what you already write](11-typescript-basics.md) | `p11-types.mts` | `Button.jsx` variants, vocabulary words |
| 12 | [TypeScript II: generics, unions, and reducers](12-typescript-advanced.md) | `p12-generics.mts` | `loadJSON`, `useQuizState`, `POINT_SOURCES` |
| 13 | [Converting KawmHmoob to TypeScript](13-migrating-the-app.md) | the real app | `lib/` → `hooks/` → `context/` → screens |
| 14 | [Debugging like you mean it](14-debugging.md) | habits | the red box, Metro, `scripts/check-*.mjs` |

### Extras

Deeper dives written from questions asked during practice:

- [`const`, `let`, and what actually changes a variable](extras/const-let-and-assignment.md): companion to Lesson 01 §3, with a drill

**Pace:** one lesson per sitting is plenty. Lessons 03, 05, 07 and 12 are the
hard ones. It's normal to need two sittings for each of those.

---

## Your progress

Tick these as you go (edit this file and change `[ ]` to `[x]`):

- [ ] 00 The map
- [ ] 01 Values
- [ ] 02 Functions
- [ ] 03 Arrays & objects
- [ ] 04 Modules
- [ ] 05 Async
- [ ] 06 React mental model
- [ ] 07 State & effects
- [ ] 08 Reducers
- [ ] 09 Context
- [ ] 10 Custom hooks
- [ ] 10b Hooks & libraries, plus the build projects:
  - [ ] P1 AuthContext `useMemo`
  - [ ] P2 Share a word
  - [ ] P3 `useDebouncedValue` in search
  - [ ] P4 Pull-to-refresh leaderboard
  - [ ] P5 `useAppForeground` + new-day refresh
  - [ ] P6 Recently viewed words
- [ ] 11 TypeScript I
- [ ] 12 TypeScript II
- [ ] 13 Migration: first file converted
- [ ] 14 Debugging

---

## How this relates to `learning/`

`learning/` holds **feature** guides: how the quiz engine works, how to build the
reading library. This course is about the **language underneath** those
features. When a lesson touches a topic that already has a deep guide (refs,
arrow-function bodies, the quiz engine), it links there instead of repeating it.
