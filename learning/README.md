# Learning guides

Teaching-style guides for building/understanding parts of the app — grouped by topic.
Most are written to be *implemented yourself*, not copy-pasted.

## 💳 monetization/
Subscriptions, the paywall, and free-tier gating.
- **revenuecat-integration-guide.md** — the whole RevenueCat subscription system.
- **paywall-page-and-hydration-guide.md** — building the paywall screen (offerings hydration).
- **quota-enforcement-guide.md** — applying the daily-quota pattern to each surface.

## 🗄️ supabase/
Backend: auth, data, and the leaderboard.
- **supabase-setup-guide.md** — the schema (`profiles`/`progress`), RLS, signup trigger.
- **supabase-leaderboard-lesson.md** — build the leaderboard (a read-only VIEW + wiring), with SQL concepts.

## 🎤 pronunciation/
The Speak feature — recording + tone scoring (DSP). Read the record step first.
- **voice-record-step-lesson.md** — Box 1 only: mic → a `.wav` file, in depth.
- **voice-recording-pronunciation-guide.md** — the full pipeline (record → parse → pitch detect → compare), build-it-yourself DSP.

## 📖 reading/
Building the Reading module from nothing — a genre library of Hmong stories,
each with a comprehension quiz. Written to be implemented yourself, in order.
- **01-the-library-guide.md** — data shape, derived genres, the library, genre and story screens.
- **02-comprehension-quiz-guide.md** — questions in the story, the quiz as a state machine, scoring, progress, quota.
- **03-listening-comprehension-guide.md** — the Comprehension module (audio clips +
  a quiz): the licensing decision first, folder routes, a second player hook,
  and the listening-specific UX rules. You build it.
- **04-story-images-and-lightbox-guide.md** — pictures between paragraphs (why they
  are not lines, why the `require` map is its own file), then a tap-to-open lightbox
  (Modal, three ways to close, the flash-on-close fix), then optional pinch-zoom and
  swipe-to-close. You build it.

## 🧩 ui-patterns/
Reusable UI/interaction patterns.
- **collapsible-dropdown-lesson.md** — an accordion (boolean + conditional render).
- **logout-confirm-success-modal-lesson.md** — sequencing two modals (confirm → success) as a state machine.
- **modal-swipe-gesture-guide.md** — adding real swipe with gesture-handler + reanimated.
- **send-status-and-result-screens.md** — telling someone whether their submit worked:
  four states, named failures with a `retry` flag, and never destroying an unsent draft.
  From the /contact form. Exercises at the end.

## 🧠 feature-logic/
How existing app features work (explainers + a conversion guide).
- **notebook-logic-explained.md**
- **quiz-engine-explained.md** — the one engine behind every quiz: id → config + dataset,
  prefs, `buildQuestions`, the four gates, the reducer, one tap end to end. Exercises at the end.
- **search-logic-explained.md**
- **words-page-logic-explained.md**
- **reference-page-conversion-guide.md**
- **path-spine-explained.md** — the Beginner Path: units vs categories, derived completion,
  positional unlocking, reusing screens with a scoping id. Exercises at the end.
- **path-into-learn-guide.md** — DRAFT build guide: putting the path inside the Learn tab,
  with a "Lesson" step linking each unit to its Learn lessons. You build it.
- **notebook-quiz-guide.md** — BUILD IT YOURSELF: a quiz made only from the learner's
  saved notebook words. The design choice (how per-user ids reach a pure data file), six
  steps, the too-few-words and easy-distractor problems, a test checklist and exercises.
- **splitting-vocab-sets-guide.md** — how the Vocabulary page is organised (themes,
  primary vs secondary sets) and how to split a big set into "Animals 1, 2, 3" yourself —
  `SET_SPLITS`, why progress survives, `check-splits`. Exercises at the end.
- **dictionary-headwords-guide.md** — one word, numbered definitions: why cards are NOT
  merged (decks, notebook, progress), how the headword is built and repeats folded, how to
  pin a line's meaning (`means: { yog: 'yog-to-be-is' }`), glossary taps that show the
  dictionary too, and the two scripts. Try-it-yourself at the end.
- **fill-the-blank-drill-guide.md** — FUTURE, not built: a fill-the-blank drill that puts
  learned words back into sentences (pick the right conjunction, the right pronoun), with 3
  strikes. Measured readiness, the "secretly right wrong answer" problem, where to start.

## 📐 concepts/
General, transferable programming patterns (not app-specific).
- **navigation-return-context.md** — "back" that remembers where you came from: history
  back vs hierarchy back, passing `?fromGroup=` / `?fromUnit=` / `?fromStory=` in the link
  (and `dismissTo` vs `push` for a stateful screen underneath), and why the
  context must be validated. Exercises at the end.
- **lookup-ranking-and-fallbacks.md** — when several sources can answer one question:
  exact beats partial, collisions that silently discard data, and how to guard a
  fallback. From the "every tus meant tus xov" bug.
- **stored-null-guard-pattern.md** — read-with-fallback + `&&` guard + create-on-first-write.
- **useref-vs-usestate.md** — which one to reach for, and why a ref survives a render.
- **arrow-function-bodies-and-handlers.md** — `() => x` vs `() => { x }`, and event handlers.
- **nativewind-classname-on-third-party.md** — why `className` is silently dropped on
  an Animated.View or any component NativeWind does not map.
- **accessibility-role-and-state.md** — roles, labels and state for screen readers.

---
_Add new guides into the folder that fits; create a new folder only when a topic has ≥2 guides._
