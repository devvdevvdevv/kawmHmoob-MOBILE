# How to: the Comprehension module (listen, then be quizzed)

**You write the code. This is the map.** It is in `learning/reading/` because
guides 01 and 02 are the same shape — a library, an item, a hand-written
comprehension quiz — and this module is those two with **audio instead of text**.
Read `02-comprehension-quiz-guide.md` first; everything it says about questions
still holds, and this guide does not repeat it.

What you described: an archive of Hmong clips, pick one, listen, get quizzed on
what the conversation was about.

---

## 0. One user's walk, before any code

1. Taps **Comprehension** on Home (or in the Learn tab).
2. Sees a library: "Ordering food at a restaurant · 0:48 · beginner", a few
   dozen cards, filterable by level.
3. Taps one. Sees the title, how long it is, who is speaking, and **three
   questions with the options hidden** — so they know what to listen *for*.
4. Presses play. Can replay as often as they like; the count is shown.
5. Answers the questions. Right/wrong feedback per question, as in the reading quiz.
6. **Then** the transcript appears: Hmong first, English one tap away.
7. Score recorded, XP awarded, back to the library with that clip marked done.

Step 6 is the module's whole teaching value, and step 3 is what makes it a
listening exercise rather than a memory test. Neither is obvious from "video +
quiz", which is why the walk comes first.

---

## 1. ⚠️ Two things to settle before you write a line

### a) You cannot host an archive of other people's videos

This is the blocker, and it is not a technical one. Downloading Hmong clips from
YouTube/Facebook/TikTok and re-serving them inside a paid app is
straightforwardly copyright infringement, and it is also against those
platforms' terms. It puts the app at risk in a way no feature is worth. Four
honest routes:

| route | what you get | cost |
|---|---|---|
| **Record your own** | full rights, exactly the level you want, one consistent voice set | studio time — **and you are already booking a native speaker** (`notes/recording/`) |
| **Ask permission** | real, varied speech from real creators | one email per clip, and a written yes to keep on file |
| **Embed, don't host** | the creator's player, their ad revenue, no rights problem | needs a WebView, no offline, and the learner leaves your screen |
| **Public domain / CC** | free and legal | mostly formal recordings (radio, church, archives) — hard for beginners, and attribution is mandatory |

**The one I would take:** while the native speaker is in the room for the
re-record, add a second session — **ten 30-to-60-second scripted conversations**
(ordering food, meeting someone, asking directions, a phone call, a family
argument). You write the scripts, so you know every word in them, which means
you can write questions that test comprehension rather than luck. That is phase 1
of the archive, and it is rights-clean.

Then use "ask permission" to grow it with real, unscripted speech later — that is
where the real difficulty lives, and where beginners should not start.

Whatever you choose: put `credit` and `licence` on **every clip object** from day
one. Retrofitting provenance onto 40 files you no longer remember the source of
is the kind of job that ends with deleting content.

### b) Audio first. Video is a second decision, later

Your app already has `expo-audio`, a working player (`src/hooks/useAudio.js`) and
a remote-hosting seam. It has **no video player at all**. Adding one (`expo-video`)
means a new native dependency, a config plugin and a **new build** — and you have
a load-bearing pinned `@siteed/audio-studio` in there that a careless dependency
bump can break.

And listening is the skill. Video adds faces and gesture, which *help* the
learner — that is a real argument for it — but it also multiplies file size,
hosting cost and recording difficulty.

So: build the module as `kind: 'audio'` clips, and leave a `kind` field on the
data so `kind: 'video'` is an added renderer later, not a rewrite. Design the
library card so a thumbnail could sit in it one day.

---

## 2. The routes — what "multi page, user clicks it and access" means here

You have `app/comprehension/[comp].jsx`. Two problems with it:

1. **A flat `[comp].jsx` cannot have children.** The clip screen needs a quiz
   page under it, exactly as reading does. In Expo Router, children need a
   **folder**.
2. **The param is called `comp`**, which will read as `params.comp` everywhere
   and tell you nothing. Name it for the thing: `clipId`.

The shape to build, mirroring `app/reading/`:

```
app/comprehension/
  index.jsx                 the library   → /comprehension
  [clipId]/
    index.jsx               one clip      → /comprehension/clip-restaurant
    quiz.jsx                the questions → /comprehension/clip-restaurant/quiz
```

How each page is reached:

- **Home → Explore** list (`app/(tabs)/index.jsx`) — one entry, the way
  "Beginner path" and "Readings" are there. This is the "user clicks it" part;
  a route with no door is a route nobody finds.
- Library → clip: `<Link href={`/comprehension/${clip.id}`} asChild><Pressable>`,
  the idiom used in `PathList.jsx` and the Explore list.
- Clip → quiz: same, plus `/quiz`.
- Every screen reads `useLocalSearchParams()` for `clipId`, looks the clip up,
  and **`<Redirect href="/comprehension" />` when it is not found** — the guard
  `app/path/[unitId]/reading.jsx` uses. A bad URL must not render a broken page.

⚠️ Your stub currently ends with a bare `return`, which renders `undefined` and
throws. Every screen must return an element or a `<Redirect>`.

---

## 3. The data shape

One file, `src/data/comprehension.js`, one object per clip. Questions live
**inside** the clip — guide 02 explains why, and it is the same reason here:
"what did she order?" only exists because you wrote it about this clip.

The fields to think about, and why each one is there:

| field | why it exists |
|---|---|
| `id` | ⚠️ **a progress key.** Renaming one strands every score and completion. Pick a scheme now (`comp-restaurant-01`) and never rename. |
| `title`, `blurb` | the library card |
| `kind` | `'audio'` now, `'video'` later (§1b) |
| `media` | the path, in the app's `/assets/audio/…` convention so `resolveAudioSrc` handles it (§4) |
| `seconds` | shown on the card **before** tapping. "How long is this" is the first thing a learner wants |
| `level` | `beginner` / `intermediate` — the library's only filter worth having at first |
| `dialect` | White or Green. The app already has `dialect_preference`; a Green clip is not wrong, it is *labelled* |
| `speakers` | how many voices, so "two people talking" is not a surprise |
| `credit`, `licence` | §1a. Non-negotiable |
| `transcript` | `[{ hmong, english }]` per line — the same shape `stories.js` uses for paragraphs, so you can reuse its rendering |
| `questions` | `[{ prompt, options, answer, because }]` — `because` is the one-line explanation shown after answering, and it is what turns a wrong answer into a lesson |
| `vocab` | ids into `vocabulary.js` for a "words in this clip" strip. Optional, and the cheapest way to tie this module to the rest of the app |

Two rules worth writing into the file's header comment:

- **Transcript is mandatory, even when nobody will read it.** It is what makes a
  wrong answer explainable, it is the accessibility story for anyone who cannot
  hear the clip, and it is how you find out a question was unfair.
- **A clip with no questions is not shippable**, the same way `path.js` has
  readiness: let the library hide it rather than ship a dead-end card. Give
  yourself `isClipReady(clip)` and a `scripts/check-comprehension.mjs` that fails
  on a missing transcript, a missing `answer`, an `answer` not in `options`, a
  duplicate id, or a media path with no file. Every one of those renders fine and
  is invisible — which is exactly the argument `scripts/check-path.mjs` makes.

---

## 4. The media: hosting and playback

### Hosting — the seam already exists

`src/lib/audioBase.js` resolves a stored path in this order: bundled asset from
`AUDIO_MAP` → else prefix `EXPO_PUBLIC_AUDIO_BASE_URL` → else no-op. So:

- **Do not bundle the clips.** The repo already carries 41 MB of word audio.
  Thirty one-minute clips is another 30–60 MB in the APK, downloaded by every
  user whether they open this module or not.
- **Put them in Supabase Storage** (or any static host), set
  `EXPO_PUBLIC_AUDIO_BASE_URL`, and they stream with **no new code**. That is
  what that env var was built for.
- ⚠️ **Then honour the rule `supabase/01-stories.sql` states:** "The app must
  keep working offline." A streamed clip means this module is the first one that
  simply cannot work on a plane. Say so on screen when it fails (§7) — do not let
  it look broken.

### Playback — `useAudio` is not enough, and this is the one real build

`src/hooks/useAudio.js` is a **one-shot player**: `play(src)` and a `playing`
flag. No pause, no position, no duration, no seek. A comprehension screen needs
at least pause and position, and wants a scrubber.

So you will write a second hook — `useClipPlayer` — on the same `expo-audio`
primitives. Read `useAudio.js` first and copy its three hard-won details:

1. `resolveAudioSrc()` before anything, and **no-op when it returns null** rather
   than throwing.
2. `player.remove()` on unmount **and** before starting another source. A native
   player that outlives its screen keeps playing over the next one.
3. `addListener('playbackStatusUpdate', …)` is where `didJustFinish`, position
   and duration come from.

Then add what it lacks: `pause()`, `seek(seconds)`, `position`, `duration`,
`replays` (count them yourself — the player will not).

⚠️ **Do not delete or "upgrade" `useAudio`.** Sixty-odd call sites use it, and
one-shot is right for them. Two hooks, two jobs.

---

## 5. The listening screen's own rules

Nothing in guides 01 and 02 covers these, because text does not have them.

**Never autoplay on screen entry.** Someone opening a clip on a bus with the
volume up gets a fright and closes the app. The play button is the first thing to
touch, sized like `AudioButton`'s `hero`.

**Show the questions before the audio, with the options hidden.** This is the
design decision that makes the module teach listening. Knowing that the question
is "what did she order?" changes what you listen for, which is exactly what
comprehension practice is. Showing the options too would let someone
pattern-match a keyword instead of following the sense.

**Replays are unlimited, and counted.** This is practice, not an exam. But show
"3 plays" — a learner who needed six plays knows more about their own level than
any score can tell them. (A "how many plays?" stat is the honest version of
difficulty rating. Consider storing it.)

**The transcript comes after the answers, in two stages.** Hmong first, English
one tap away — the same rule `app/path/[unitId]/reading.jsx` and the story reader
follow. Reading the Hmong while the answer is fresh is the actual learning
moment; showing English at the same time throws it away.

**Segment replay is the best feature you can add second.** Put a `at` timestamp
on each question and let the feedback offer "hear that part again" → `seek(at)`.
It is a small change to the data and turns a wrong answer into a targeted
listening drill. Do not build it first; build it once the module works.

---

## 6. The quiz: copy the reading one, not `QuizEngine`

`src/components/quiz/QuizEngine.jsx` **generates** questions from a word dataset.
Yours are hand-written, so it is the wrong parent — guide 02 makes this argument
and `app/reading/story/[storyId]/quiz.jsx` is the built proof. Read that file and
take four things from it:

1. **Shuffle with a copy** (`[...arr]`). Shuffling `clip.questions` in place
   reorders your actual data for the rest of the session.
2. **A pinned action bar, present from the first render.** Its comment records
   the bug: feedback and the Next button appearing out of nothing pushed the
   button below the fold, so answering looked like it did nothing. Only the
   label and enabled state should change.
3. **The quiz is the same surface as the thing it is about** — same sheet, same
   colour. A quiz about a clip is the last beat of that clip, not a new place.
4. **Progress ids.** Reading uses `storyStepId(id)` → `reading-<id>`. Yours:
   `comprehension-<clipId>`, in **one exported function** in the data file, so
   the screen never builds that string by hand. Then
   `markStepComplete(id)` for completion (+2 XP, streak) and
   `recordQuizScore({ quizId, accuracy })` for the score (+5), which is what
   makes a "best score" and a retake possible.

---

## 7. When the media will not play

This module fails in a way none of the others do: the content is remote. Treat it
with the rule from `learning/ui-patterns/send-status-and-result-screens.md` —
**name the failure and say whether retrying helps.**

| what happened | what the learner should see |
|---|---|
| no host configured (dev) | "Clips aren't available in this build." No retry. |
| offline / fetch failed | "Couldn't load this clip — check your connection." **Retry.** |
| 404 on the file | "This clip is missing. I've been told." No retry — and it should have been caught by your checker |
| playing, then dropped | keep the position, offer Resume |

And the question that decides the screen: **can they still answer the questions
if the audio never loads?** No. So unlike the contact form, this failure *does*
take the screen — there is no unsaved work to protect, and a quiz about a clip
nobody heard is worse than an honest error.

---

## 8. Gates, limits and where it plugs in

- **Paywall:** a `tier: 'free' | 'pro'` on the clip, and `canAccess(tier,
  userTier)` from `SubscriptionContext.jsx`, wrapped in `PaywallGate` the way
  lesson screens do. Keep three or four clips free: this is the module most
  likely to sell the app, because it is the one nothing else on the market does
  for Hmong.
- **Daily allowance:** add a `comprehension` row to `QUOTA_LIMITS`
  (`src/lib/quotaLimits.js`, everything is 5/day right now) and use
  `useDailyQuota('comprehension', …, { enabled: !isPro })`. ⚠️ Spend the quota on
  **starting a quiz, not on playing audio** — charging per replay would punish
  exactly the behaviour the module is trying to encourage.
- **The path, later.** A comprehension step would be a natural sixth step in a
  path unit (`src/lib/pathProgress.js`), and
  `learning/feature-logic/path-into-learn-guide.md` §4 already describes the four
  places adding a step touches. Do not do this until there are enough clips to
  cover the early units — an unavailable step is skipped, but a *thin* one is
  worse than none.

---

## 9. Gotchas, most of them already written down somewhere in this repo

- **Ids are progress keys.** Renaming a clip id strands scores (`path.js` and
  `pathProgress.js` both carry this warning).
- **NativeWind classes must be literal strings.** `` `bg-${level}` `` never
  compiles. Write the branches out.
- **A `Pressable` with a function `style` is invisible on native.** Static style
  objects only.
- **Release the player.** See §4. This is the bug that plays two clips at once.
- **`expo-video` is a native dependency** — a new build, not a reload. Decide
  before you promise video to anyone.
- **A quiz option not present in `options`** renders a question that cannot be
  answered correctly. Your checker catches it; nothing else will.
- **Don't let the library show a clip that has no questions** (§3).
- **`[comp].jsx` → `[clipId]/`** (§2), and never `return` with nothing.

---

## 10. Build order — each step should run before the next

1. **Content first, two clips.** Script, record (or licence) **two** 40-second
   clips with full transcripts and three questions each. Everything below is
   pointless without them, and two is enough to find every design problem.
2. **The data file + `isClipReady` + the checker.** Run the checker before any
   screen exists.
3. **The library** (`index.jsx`) with hard-coded cards, no filters. Reach it from
   Home's Explore list, so the door exists from day one.
4. **The clip screen** with the existing one-shot `useAudio` and a plain play
   button. Prove the media resolves from the remote host on a real device before
   building anything clever.
5. **`useClipPlayer`** — pause, position, replay count.
6. **The quiz screen**, copied in shape from the reading quiz; scoring and
   `markStepComplete` last.
7. **Failure states** (§7), tested by turning off wifi and by pointing one clip at
   a path that does not exist.
8. **Then** the extras, in this order: transcript reveal → segment replay →
   levels/filters → paywall + quota → the vocab strip.
9. **A note in `notes/`**, dated, with the licensing decision written down. That
   is the one fact about this module nobody can reconstruct from the code.

---

## Checklist

1. Rights settled and recorded per clip (`credit`, `licence`) before any content lands.
2. Audio now; `kind` field so video is additive.
3. A folder route, a named param (`clipId`), and a `Redirect` guard on a bad id.
4. A door on Home — a route nobody can find is not shipped.
5. Questions inside the clip object. Transcript mandatory.
6. A checker that fails on the invisible mistakes.
7. Clips streamed, not bundled; failures named, with an honest offline message.
8. No autoplay. Questions before audio, options hidden. Replays free and counted.
9. Transcript after answering: Hmong, then English on tap.
10. A second player hook; `useAudio` untouched.
11. Progress ids from one exported function; score **and** completion recorded.
12. Quota on starting the quiz, never on replaying audio.

---

# Exercises

**1. Write the two scripts.** ✍️ Before any code, write two 40-second
conversations, in Hmong, using only words already in `vocabulary.js` (check with
a script — `categories.flatMap(c => c.words)`). Then write three questions for
each. Which was harder, and what does that tell you about how many clips this
module can realistically have by launch?

**2. Find the unanswerable question.** Deliberately write one question whose
`answer` is not in its `options`, and one clip with no transcript. Now write the
checker that catches both. Run it before you build a single screen.

**3. Prove the hosting seam without writing a module.** Put one mp3 in Supabase
Storage, set `EXPO_PUBLIC_AUDIO_BASE_URL`, and make an existing `AudioButton`
somewhere play it by giving a word a path that isn't bundled. Nothing about
comprehension yet — this de-risks the whole module in ten minutes. What happens
with the env var unset, and where in `audioBase.js` is that decided?

**4. Break the player on purpose.** Build the clip screen with `useAudio`, start
a clip, and navigate away mid-playback. What do you hear? Now find the `useEffect`
in `useAudio.js` that is supposed to prevent it, and work out whether your new
screen honours it.

**5. Test the "questions first" decision on yourself.** Build the clip screen
both ways — questions visible before playing, and hidden until after. Listen to a
clip you did not script (find any Hmong clip online, just for this test, nothing
shipped). Which version taught you more? Write down the answer; it is the module's
core design decision and you should own it, not me.

**6. Decide the offline story.** ✍️ Write the three sentences the learner sees
when: there's no network, the file 404s, and the build has no host. Then decide
whether downloading a clip for offline use is worth building — and what it costs
you in rights terms if the file lands on the device permanently.

**7. Cost it.** Thirty clips at one minute, mono mp3 at 96 kbps, is about how many
MB? What does Supabase Storage charge for that in bandwidth if 500 people each
play ten clips a month? This is the number that decides whether the archive is
thirty clips or three hundred.
