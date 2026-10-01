# Audit fixes: error boundary, ESLint, sync copy, tone-eval gate (2026-08-29)

Acting on a review of the app. Four things fixed; two flagged that code can't fix.

## 1. Error boundaries — a render crash no longer kills the app

There was **no** error boundary anywhere and **no** crash reporting, so any throw
in render white-screened the app and nobody ever found out.

New `src/components/common/ErrorBoundary.jsx`, wired in at **two** levels in
`app/_layout.jsx`:

- **Inner**, around `<Stack>` inside `ThemedShell` — one bad screen resets to a
  "Try again" *inside the live shell*, with every provider (session, progress,
  notebook) still mounted. Recovery costs the user nothing.
- **Outer**, around the whole provider tree — the last resort, for a throw in a
  provider itself (a corrupt persisted blob, a failed hydrate). The inner boundary
  can't catch those: it lives inside the very providers that would have to be
  alive to render it.

Three deliberate choices in the component:

- **It's a class.** `getDerivedStateFromError` / `componentDidCatch` still have no
  hook equivalent. This is the one place in the app that has to be one.
- **Inline styles, zero imports beyond react-native.** It renders exactly when
  something below it is broken, so it must not depend on `ThemeProvider` (possibly
  the thing that threw), on NativeWind's className interop, or on any shared UI
  component. The cream/clay palette is hardcoded.
- **The error message shows in `__DEV__` only** — useful to us, noise to a learner.

⚠️ **It does not report anywhere.** The `onError` prop is the hook for that. Wire
Sentry/Crashlytics into it and every caught crash becomes visible; until then a
crash is *recoverable but silent*, and only the user knows it happened.

## 2. The notebook sync promise — copy corrected

Two screens told users an account syncs their **saved words**:

- `ProfilePage.jsx` — "Sync your streak, XP, and saved words across devices"
- `WelcomeTour.jsx` — "keeps your streak, saved words, and XP synced everywhere"

`ProgressContext` does sync (`supabase.from('progress').upsert`). **`NotebookContext`
has zero Supabase references** — it is AsyncStorage-only, keyed
`kawmhmoob.notebook.<userId>`. Saved words and notes die with the device, after the
app said they wouldn't.

Chosen fix: **correct the copy**, since it's complete today with no database work.
Both old strings are commented out in place with a pointer to restore them.

**The real fix is still open**: mirror `NotebookContext` into Supabase the way
`ProgressContext` does. It needs a `notebook` table + RLS, which is a migration
someone has to run — that's why it wasn't done here. See
[2026-08-28-notebook-cap-study-and-notes-hidden], which already flagged that the
15-word cap is local-only and would need server-side enforcement if it ever syncs.

## 3. ESLint — the project had none

24,000 lines with no linter. Nothing caught unused variables, missing hook
dependencies, or a typo'd identifier until it surfaced as a crash on device.

`eslint.config.js` (flat config), built on `eslint-config-expo/flat`.

### Version pinning — this took three tries, don't undo it

- `eslint@^9`, **not** 10. `eslint-plugin-react` (a transitive dep of the Expo
  config) declares `eslint: ^3 || … || ^9.7`; on ESLint 10 every lint run dies with
  `contextOrFilename.getFilename is not a function`.
- `typescript@~5.9`, **not** 7. The Expo flat config loads `@typescript-eslint`
  unconditionally even in a pure-JS project, and it refuses TS 7.0 outright.
  TypeScript is here only to satisfy that plugin; there is no TS source.

### Result: 139 problems (101 errors, 38 warnings)

| count | rule |
|---|---|
| 36 | `react/no-unescaped-entities` |
| 30 | `no-unused-vars` (downgraded to warn — see below) |
| 27 | `react-hooks/rules-of-hooks` |
| 19 | `react-hooks/refs` |
| 11 | `react-hooks/set-state-in-effect` |
| 8 | `react-hooks/purity` |

**None of them were fixed** — adding the linter was the task; the cleanup is its
own job. Two worth looking at first:

- `src/hooks/useRecorder.js:47` — `usePcmRecorder` and `usePronunciation` are called
  **conditionally**. That's a genuine rules-of-hooks violation, the kind that
  corrupts hook order and crashes rather than merely warning.
- `src/hooks/useDailyQuota.js:53` — `setState` synchronously inside an effect.

Two config decisions:

- `no-unused-vars` is a **warning**, not an error: this codebase deliberately keeps
  disabled features commented out (house rule), which leaves genuinely unused
  imports behind. They should stay visible, not fail a build.
- `scripts/**` gets Node globals (`Buffer`, `__dirname`, `process`). Without it
  those files report 4 phantom `no-undef` errors — and a linter with known-false
  errors is a linter people stop reading.

Run it with `npm run lint`.

## 4. `/tone-eval` was the only ungated dev route

`/dev`, `/spike`, `/wav-spike` and `/speak-lab` all sit behind `AdminGate`;
`app/tone-eval.jsx` had neither that nor `__DEV__`, so it was deep-linkable in
production. Now gated like the rest. (Low severity — the page is an honest "not
available on mobile" placeholder, not a live tool.)

## Flagged, NOT fixed — these need a human

- **35 `TODO-VERIFY` markers** in `src/data/lessons/` (adjectives 7, conjunctions 6,
  time 9, others 13). Unverified Hmong grammar claims are shipping as fact, and a
  learner cannot detect a wrong nuance. Needs a native speaker, not a code change.
- **`SPEAK_ENABLED = true`** in `src/lib/launch.js` while the comment directly below
  it says *"⚠️ Lesson CONTENT is placeholder Hmong with no audio yet — flip back to
  false if that ships to users."* That instruction is currently not being followed.
- **64% of vocabulary has no audio** — 339 of 527 words are `audioFile: null`, in a
  tonal language. `AudioButton` degrades honestly (disabled, with a "No recording
  available" label), but this is the product's core value gap. Needs recordings.
- **Accessibility**: 123 `Pressable`s, 9 `accessibilityLabel`s. `AudioButton` is the
  model to copy.
