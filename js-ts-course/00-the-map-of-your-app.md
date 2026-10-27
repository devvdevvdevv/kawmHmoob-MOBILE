# 00 — The map of your app (the scaffolding)

You've worked in this project for months, but probably one file at a time.
This lesson zooms all the way out. Once you can see the whole shape, every
file you open later has a *place*, and you'll know where new code belongs
before you write it.

---

## 1. The one-sentence version

> **`app/` decides *which screen* you're on. `src/` holds *everything those
> screens use*. Everything else is configuration or notes.**

Here's how that looks:

```
kawmHmoob-MOBILE/
│
├── app/                 ← SCREENS. One file = one URL. (expo-router)
│   ├── _layout.jsx      ← the frame around every screen (providers, header, tab bar)
│   ├── (tabs)/          ← the 5 bottom-tab screens: index, learn, reference, speak, vocabulary
│   ├── path/[unitId]/   ← a screen whose URL contains a variable: /path/greetings
│   └── login.jsx …      ← /login, /account, /paywall …
│
├── src/
│   ├── components/      ← UI pieces screens are built from (Button, PathList, QuizEngine…)
│   ├── context/         ← GLOBAL STATE shared by every screen (auth, notebook, progress…)
│   ├── hooks/           ← reusable stateful logic (useDailyQuota, useAudio, useQuizState…)
│   ├── lib/             ← PURE LOGIC — plain functions, no React (leveling, access, storage…)
│   └── data/            ← CONTENT — vocabulary, lessons, path, stories, as JS objects
│
├── scripts/             ← Node programs YOU run (check-path.mjs, check-vocabulary.mjs…)
├── assets/              ← images, fonts, audio
├── notes/  learning/    ← your engineering diary and feature guides
├── js-ts-course/        ← this course
│
├── package.json         ← dependencies + `npm run …` commands
├── app.json / app.config.js ← Expo's settings (name, icon, splash, plugins)
├── babel.config.js / metro.config.js ← how your code is transformed and bundled
├── tailwind.config.js / global.css   ← NativeWind (className="…") setup
├── eslint.config.js     ← the linter's rules
├── tsconfig.json        ← TypeScript settings (matters from Lesson 11)
├── eas.json             ← cloud build profiles
└── android/             ← generated native project — you almost never edit this by hand
```

---

## 2. The layers, and which way they're allowed to point

Think of the folders as floors in a building. **Code may only import from the
floor below it, never from above.**

```
   app/ (screens)              ← top floor: knows about everything
        │ imports
   src/components/             ← UI pieces
        │ imports
   src/context/  src/hooks/    ← React state
        │ imports
   src/lib/                    ← plain JavaScript logic
        │ imports
   src/data/                   ← plain content
```

Check it against your own code:

- `app/(tabs)/index.jsx` (a screen) imports `TodayCard` (component),
  `useAuth` (context), `levelFromPoints` (lib), and `categories` (data). ✅ All downward.
- `src/lib/access.js` imports from `../data/lessons.js`. ✅ lib → data.
- `src/lib/leveling.js` imports **nothing**. It's pure math. That's the ideal for `lib/`.

**Why this matters:** if `data/vocabulary.js` ever imported a React component,
your Node scripts (`scripts/check-vocabulary.mjs`) could no longer read it,
because Node can't run React Native. The layering is what lets those scripts
exist at all.

> 🧭 **Where does new code go?** Ask: *does it need React?*
> - No, it's a calculation or a rule → `src/lib/`
> - No, it's content → `src/data/`
> - Yes, and it's stateful logic used by 2+ screens → `src/hooks/`
> - Yes, and *every* screen needs the same copy of it → `src/context/`
> - Yes, and it draws something → `src/components/`
> - It's a whole page with a URL → `app/`

### Drilling the test (added 2026-10-04, from a practice session)

**The quick check: look for two things.** Does the code **return JSX**
(`<View>`, `<Text>`…)? Does it **call a hook** (anything starting with `use`)?
Neither → it doesn't need React → `lib/` (logic) or `data/` (content).
Either one → it needs React, so ask these in order and stop at the first "yes":

1. A whole page with its own URL? → `app/`
2. Does it **own** the one shared copy that every screen reads, behind a `<Provider>`? → `context/`
3. Does it draw something? → `components/`
4. Is it remembering-logic that each screen wants its own copy of? → `hooks/`

**A restaurant picture:** `data/` is the pantry (ingredients), `lib/` holds the recipe
cards, `hooks/` are cooks (every station hires its own), `context/` is the one
order board on the wall, `components/` are the plates customers see, and
`app/` is the dining rooms, each with an address.

#### The two traps

**Trap 1: "it involves context, so it's a context."** ❌ A function that calls
`useAuth()` or `useNotebook()` only *reads* the board. A context is the file
that *holds* the shared data (its own `useState`) and broadcasts it with a
`<Provider>`. Reading a context makes something a **hook**.
Proof: `NotebookContext.jsx` calls `useAuth()` on line 27. It's a context because
it **owns** the notebook state, not because it calls `useAuth()`.

> Ask: **is this the place where the shared data is *kept*?** If not, and it
> just uses hooks to do some work, it's a hook.

**Trap 2: "it's just logic, so it's lib."** ❌ Only if it calls no hooks. The
moment a function calls `use…`, it needs React and can't live in `lib/`.
But the instinct is good: the *logic part* often *is* `lib/` material. The
best design splits it in two:

```js
// src/lib/notebookStats.js — pure, no React: the thinking
export function countStartingWith(savedWords, letter) {
  return Object.keys(savedWords).filter((id) => id.startsWith(letter)).length
}

// src/hooks/useTWordCount.js — a thin React shell: the fetching
export function useTWordCount() {
  const { savedWords } = useNotebook()
  return countStartingWith(savedWords, 't')
}
```

The hook gets the data from React; the lib function does the thinking. (That's
Lesson 10 §5, "keep the logic out of the hook.") This is an illustration of
the shape, not code to add to the app.

#### The drill: where does each one go?

1. `isWordDueToday(word, schedule)`: returns true/false from some dates
2. A list of Hmong colour words with their English meanings
3. A seconds timer that the quiz and speak screens each want their own count of
4. Light/dark mode, read by every screen
5. A `StreakBadge` that shows 🔥 7
6. A new Settings page at `/settings`
7. `formatScore(80)` → `"80%"`
8. A function that calls `useAuth()` and returns the user's display name
9. A function that calls `useNotebook()` and returns how many saved words start with "t"
10. A file that holds the quiz difficulty in `useState`, wraps the app in a `<Provider>`, and is read by every quiz screen
11. A function that calls `useTheme()` and `useSubscription()` and returns a badge colour

<details>
<summary>Answers</summary>

1. `lib/`. No JSX, no hooks, just date maths.
2. `data/`. It's content.
3. `hooks/` (`useTimer`). It needs `useState` + `useEffect`, one copy per screen.
4. `context/`. One shared copy; it already exists as `ThemeContext`.
5. `components/`. It draws.
6. `app/settings.jsx`. It's a page with a URL.
7. `lib/`. Same input, same output, no React.
8. `hooks/` (`useDisplayName`). It *reads* a context, so it's a hook. **Trap 1.**
9. `hooks/`. It calls `useNotebook()`. **Trap 2.** The counting itself can be split out into `lib/`.
10. `context/`. It *owns* the shared state and has a `<Provider>`.
11. `hooks/`. It only reads two contexts.

First attempt (2026-10-04): 7/8 on 1–8 (missed 8: trap 1), then 2/3 on 9–11 (missed 9: trap 2).
</details>

---

## 3. `app/` — the folder IS the navigation

expo-router turns file paths into URLs. You never write a list of routes. The
folder structure *is* the list.

| File | URL | Notes |
|---|---|---|
| `app/(tabs)/index.jsx` | `/` | `(tabs)` in brackets is a **group**: it organises files but doesn't appear in the URL |
| `app/login.jsx` | `/login` | |
| `app/path/index.jsx` | `/path` | `index` = "the folder itself" |
| `app/path/[unitId]/index.jsx` | `/path/greetings`, `/path/numbers`… | `[unitId]` is a **variable** |
| `app/path/[unitId]/flashcards.jsx` | `/path/greetings/flashcards` | |
| `app/_layout.jsx` | — | not a page: the wrapper around all pages |
| `app/+not-found.jsx` | any URL that matches nothing | |

How does a `[unitId]` screen know *which* unit? Look at
`app/path/[unitId]/index.jsx`, lines 28–29:

```js
const { unitId } = useLocalSearchParams()   // "greetings", read from the URL
const unit = getUnit(String(unitId))        // look it up in src/data/path.js
```

That's the whole trick: **the URL carries an id; the screen looks the id up in
data.** One file serves every unit.

---

## 4. `_layout.jsx` — the frame around everything

Open `app/_layout.jsx`. It does three jobs, in order:

1. **Waits for fonts** (lines 50–67). Until they load, it `return null`
   (renders nothing) while the splash screen covers the app.
2. **Wraps the app in providers** (lines 72–100). That big staircase of
   `<ThemeProvider><AuthProvider><SubscriptionProvider>…` makes global state
   available to every screen. Lesson 09 is entirely about this.
3. **Draws the shell** (`ThemedShell`, lines 117–157): the `<Stack>` (where the
   current screen appears), plus the header, tab bar, drawer and overlays that
   float above every screen.

> ❓ **Why is `CelebrationOverlay` near the bottom of `ThemedShell`?**
> In React Native, things rendered **later** draw **on top**. The confetti has
> to cover the tab bar, so it comes after the tab bar. The comment on line 151
> says exactly this.

---

## 5. One tap, end to end

Here is a real path through all the layers: **you long-press a word in a
story and tap "Save"**.

```
1. src/components/reading/WordSheet.jsx  (component)
      const { saveWord } = useNotebook()          ← line 107: grab a function from context
      setFull(!saveWord(card.id))                 ← line 298: call it on tap
                 │
2. src/context/NotebookContext.jsx  (context)
      saveWord(wordId) {
        if full → return false                    ← the 25-word cap
        setState(s => ({ ...s, savedWords: {…, [wordId]: {…}} }))   ← new state
      }
                 │  React re-renders everything that uses the notebook
                 │
3. the same file, the "save" effect (lines 43–46)
      useEffect(() => { saveJSON(KEY_PREFIX + userId, state) }, [state…])
                 │
4. src/lib/storage.js  (lib)
      AsyncStorage.setItem(key, JSON.stringify(value))   ← written to the phone
```

Every concept in this course appears in that chain: **functions** (02),
**object spread** (03), **modules** (04), **async** (05), **state and effects**
(07), **context** (09). By Lesson 10 you'll be able to explain every line.

---

## 6. The files that aren't code

| File | What it's for | When you touch it |
|---|---|---|
| `package.json` | the list of libraries (`dependencies`) and the `scripts` you run with `npm run` | adding a library (`npx expo install x`), adding a command |
| `package-lock.json` | the *exact* version of every library, locked | never by hand, but do commit it |
| `node_modules/` | the downloaded libraries themselves | never; delete + `npm install` if it's broken |
| `app.json` / `app.config.js` | app name, icon, splash colour, permissions, plugins | changing native settings, which needs a rebuild |
| `.env` | secret-ish values (`EXPO_PUBLIC_SUPABASE_URL`) | never commit it; `.env.example` shows its shape |
| `patches/` | small fixes to libraries, re-applied after every install by `patch-package` | rarely |
| `android/` | the generated Android project | almost never; `expo run:android` regenerates parts of it |

---

## Practice (reading tasks, no code)

Answer these by opening files. Write your answers in a scratch note. The
answers are at the bottom, so don't peek first.

1. Which file is the screen at the URL `/reading`?
2. `app/(tabs)/vocabulary.jsx` is only 13 lines long. Open it. Where does the real screen live?
3. In `src/lib/`, find one file that imports nothing at all. What does that tell you about it?
4. Which layer does `src/hooks/useDailyQuota.js` import from? Is that "downward"?
5. You want to add a function `wordsDueToday(vocabSchedule)` that does pure date
   math. Which folder does it go in, and why?
6. In `_layout.jsx`, `NotebookProvider` is *inside* `AuthProvider`. Open
   `NotebookContext.jsx` line 27 and explain why it **has** to be.

<details>



1. reading or /reading /index
2. VocabularyGrid
3. It only exports files, not imports files. 
4. Lib, yes it's downward. 
5. Components
6. Because the notebook is connected to an account and it needs to be authenticated.




















<summary>Answers</summary>

1. `app/reading/index.jsx`. (Its neighbour `[genreId].jsx` is `/reading/folktales` and so on.)
2. In `src/components/vocabulary/VocabCategoryGrid.jsx`. The tab file just wraps it in `<TabScreen>`. The tab file is a thin door; the room is in `src/`.
3. `leveling.js`, `daily.js`, `launch.js` and several others. Importing nothing means it can't depend on React, storage or data: it's pure math, easy to test, and safe to call from anywhere.
4. `../lib/storage.js` and `../lib/daily.js`, so hooks → lib, which is downward. ✅
5. `src/lib/`. It's a calculation and needs no React.
6. `NotebookProvider` calls `useAuth()` to get the user id (each user has their own notebook). A component can only read a context from a provider that sits **above** it in the tree.
</details>

---

## You can now…

- [x] say which folder a new piece of code belongs in, using the "does it need React?" test
- [x] read a file path under `app/` and say its URL
- [x] explain what `[unitId]` and `(tabs)` mean in a folder name
- [x] trace the "save word" tap through component → context → lib → storage
- [x] name what `package.json`, `app.json`, `.env` and `node_modules` are for
