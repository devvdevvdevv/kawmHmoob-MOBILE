# The JS/TS course, and the first two drills: folders and route brackets (2026-10-04)

A personal course for learning JavaScript → TypeScript through this app's own
code now lives in `js-ts-course/` (15 lessons, 00–14, plus runnable practice in
`js-ts-course/practice/`). This note records how it was set up, and the first
working session on Lesson 00: two drills, the answers given, the mistakes
made, and the real-code trace that came out of them.

## The course

- `js-ts-course/README.md`: the route and a progress checklist.
- Lessons 00–14: app map → values → functions → arrays/objects → modules →
  async → React → state/effects → reducers → context → hooks → TS I → TS II →
  converting the app → debugging.
- `practice/pNN-*.mjs|.mts`: stubs that call `todo()`. Run with `node`; the
  TypeScript ones are also checked with `npx tsc -p js-ts-course/practice`, using
  `@ts-expect-error` lines as type tests.

**Why no solutions in the repo:** the point is the reps. Solutions were written
once in a scratch folder outside the project, only to prove every check can pass
and `tsc` comes out clean, and were never added here.

**Side change:** `eslint.config.js` now ignores `js-ts-course/**`. The unfinished
stubs produced 44 unused-parameter warnings that would have buried the app's
real ones. (`learning/README.md` also gained a pointer to the course.)

## Drill 1: which folder does code go in? ("does it need React?")

**The quick check:** does it return JSX, or call a hook (`use…`)? Neither → `lib/`
(logic) or `data/` (content). Either → ask in order: page with a URL → `app/`;
**owns** the one shared copy behind a `<Provider>` → `context/`; draws something →
`components/`; per-screen remembering-logic → `hooks/`.

Score: 7/8, then 2/3 on the follow-ups. Both misses were the two classic traps,
now written into Lesson 00 §2 with the full drill:

- **Trap 1: "it calls `useAuth()`, so it's a context."** No. *Reading* a context
  makes it a hook. A context is the file that *keeps* the shared state.
  `NotebookContext.jsx` calls `useAuth()` (line 27) but is a context because it
  owns the notebook.
- **Trap 2: "it's just counting, so it's lib."** Not if it calls `useNotebook()`.
  The instinct was still right about the *logic*: the best design splits it into a
  pure `lib/` function plus a thin hook that feeds it (Lesson 10 §5).

## Drill 2: `[unitId]` and `(tabs)` in folder names

> **`[name]` = a blank the URL fills in.** **`(name)` = a folder the URL ignores.**

| File | URL | Variable the screen gets |
|---|---|---|
| `app/about.jsx` | `/about` | none |
| `app/(tabs)/speak.jsx` | `/speak` | none: the group vanishes |
| `app/learn/[unitId]/index.jsx` | `/learn/basics` | `unitId = "basics"` |
| `app/reading/[genreId].jsx` | `/reading/legends` | `genreId = "legends"` |
| `app/path/[unitId]/flashcards.jsx` | `/path/numbers/flashcards` | `unitId = "numbers"` |
| to make `/words/aub` | `app/words/[wordId].jsx` | `wordId = "aub"` |

Score: 6/6 on the URLs. Two things to tighten:

- **Name the variable, not just the URL.** The variable is the half the screen uses.
- **The bracket name is the variable name, case and all.** The answer given was
  `[wordid]`. That works, but then the screen must read `const { wordid }`;
  writing `wordId` gives `undefined` with no error, which shows up as a "not
  found" screen. **Why it matters:** this is a silent bug. Nothing throws.

## The real trace: how `/reading/folk` reaches its shelf

`/reading/folktales` was a made-up example; **the real folk-tale genre id is
`folk`**. The chain:

1. **Data:** `src/data/stories.js:42-52`, `GENRES`, includes
   `{ id: 'folk', title: 'Folk tales', … }`. Stories join a shelf with
   `genre: 'folk'` (e.g. line 3100).
2. **The link:** `app/reading/index.jsx:395`,
   ``href={`/reading/${genre.id}`}`` → `/reading/folk`.
3. **The blank:** the file name `[genreId].jsx` makes `genreId = "folk"`.
   The file's own comment: *"THE FILENAME IS THE API."*
4. **The lookup:** `app/reading/[genreId].jsx`. Line 33 reads it
   (`useLocalSearchParams`), line 46 finds it (`GENRES.find`), line 54 guards
   against an unknown id, line 68 filters that genre's stories.

**Why it works with one file:** the URL carries only the id; the screen looks
everything else up in the data. The screen never says "folk" anywhere.

### Two things noticed along the way (no change made)

- **Ids must match on both ends.** A story with `genre: 'folktales'` would land on
  no shelf, with no error, the same silent class as the `classifers` typo
  `scripts/check-path.mjs` exists to catch. TypeScript (Lesson 11 §5) would catch it.
- **`'true crime'` has a space in its id**, so its URL is `/reading/true%20crime`.
  expo-router decodes it and it works. Hyphenated ids are the safer habit for new
  genres, but **don't rename this one**: an id change breaks old links and anything
  keyed on it.

## Still open

- The `[comp].jsx` exercise: trace `app/comprehension/[comp].jsx` the same way
  (what's the blank, what data it looks up, where the link is). Unanswered.
- Lesson 00's other reading tasks and its "You can now…" checklist.

Related: `js-ts-course/00-the-map-of-your-app.md`, `learning/reading/01-the-library-guide.md`
