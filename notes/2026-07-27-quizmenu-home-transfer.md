# Transferring richer screens: QuizMenu + Home (2026-07-27)

Continued the web→RN port by closing the biggest remaining *within-screen*
feature gaps. Method: diffed web `src/pages/*` line counts against their RN
equivalents to spot screens that were ported thin, then ported the missing
richness. The two real gaps were **QuizMenu** (RN was 31 lines vs web 222) and
**Home** (50 vs 282).

## Audit result (what's actually a gap)

| Screen | Verdict |
|---|---|
| QuizMenu | **Gap → ported** (below) |
| Home | **Gap → ported** (below) |
| QuizEngine | **Already complete** — RN handles the same question types as the web (`multiple-choice`, `matching` — the only types in `quizzes.js`), plus timer, streak, and review mode. No work. |
| SentenceBuilder | **Intentional placeholder in BOTH** — the web page literally says "the sentence builder isn't implemented yet." RN already mirrors it. No work. |
| Data files | **Fully synced** — no `src/data/*` files differ web vs RN (the only web-only ones are `contours.*` / `speechEval.js`, which belong to the deferred mic-scoring ToneEval). |

## 1. QuizMenu (`src/components/quiz/QuizMenu.jsx`)

Was a flat list of every quiz. Now the web's organized scoreboard:

- **Breadcrumbs** (Home › Words › Quizzes) + a progress header ("You've taken X
  of N quizzes" / "N quizzes across the whole course").
- **Grouping**: non-vocab quizzes group by their `category` (Alphabet, Tones,
  Grammar, Speak); the ~33 vocab quizzes are collected under a single
  **Vocabulary** section and sub-grouped by `categoryGroups` — the SAME themes
  the Vocabulary page uses, so both pages tell one story.
- **QuizCard** is now a scoreboard entry:
  - **Best score** badge (green `success` chip with ✓ at ≥80%, else neutral).
  - **Study-gating** via `quizUnlock(quizId, vocabProgress)` (already in
    `lib/access.js`): a vocab quiz you haven't studied enough for shows locked,
    links to the word bank (not the quiz), and says "📖 Study N more to unlock".
  - Pro badge; question count when unlocked.

Deps already present in RN: `categoryGroups` (vocabulary.js), `quizUnlock`
(access.js), `quizScores`/`vocabProgress` (useProgress), Breadcrumbs. Icons are
emoji (🔒/✓/📖). Verified: the menu renders grouped, and a not-yet-studied vocab
quiz shows the "Study N more to unlock" gate.

## 2. Home (`app/(tabs)/index.jsx`)

Was hero + TodayCard + a simple card list. Now the web's **bento dashboard**,
restructured for mobile (vertical stack; 2-up rows for the tiles and doors):

- **Hero** — "Welcome" / "Welcome back, {username}" + "Nyob zoo." + tagline.
- **Phrase of the day** — `pickOfTheDay(allPhrases(), 'home-phrase')` → a card
  linking to `/speak/{id}` ("Practice saying it →"). Deterministic per day.
- **Stat tiles** (🔥 day streak, ⭐ total XP) — 2-up.
- **Front doors** — 🎤 Speak, and 🃏 Words which reads "{n} due — start" (→
  `/words/session`) or "All caught up" (→ `/words`), from
  `selectSession(allWords, vocabSchedule).queue.length`.
- **SeasonStrip** — "Lv N · {pts} · {remaining} to next" + Pass/Leaderboard
  buttons + a progress bar (`levelFromPoints`, from `xp`). Home is where the
  season layer is discoverable since it isn't a nav section.
- **TodayCard** (kept) and **Explore** — 8 cards (Learn, Reference, Readings,
  Vocabulary [with derived word/category counts], Quizzes, Notebook,
  Leaderboard, Season Pass) each with a blurb + section accent color.
- **GuestBanner** (top) and **Footer** (bottom) kept from the parity pass.

Deps already present: `selectSession` (ProgressContext), `allPhrases` (speak.js),
`pickOfTheDay` (daily.js), `levelFromPoints` (leveling.js), `categories`,
`useAuth`. Icons/accents are emoji + themed text colors.

## Verify

```bash
npx expo start --port 8224
# bundle 200. Screenshots confirmed:
#   /       → phrase of the day, stat tiles, front doors ("10 due — start"),
#             season strip (Lv 1 · progress), Today, Explore.
#   /quiz   → grouped (Alphabet/Tones/Grammar/Speak + Vocabulary-by-theme),
#             a vocab quiz shows "📖 Study 7 more to unlock".
```

Last verified 2026-07-27: web bundle 200, both screens screenshot-confirmed.
Device/Expo Go pass still recommended.

## Watch out
- The season/points numbers use `xp` as the stand-in for the web's `seasonPoints`
  (the full points engine isn't ported — user-deferred). Same substitution as
  Leaderboard/BattlePass/LevelBadge.
- Don't run `npm audit fix --force`.
