# Speak module: A/B compare → lesson engine → shipped (2026-08-24)

One long session. The Speak module went from "a sandbox with two step types" to a
feature reachable by users. **The engine is done; the content is not.**

Teaching write-ups: [[ab-compare-and-lesson-script-lesson]] (Promises from zero),
[[how-to-author-a-speak-lesson]], [[useref-vs-usestate]],
[[nativewind-classname-on-third-party]].

---

## Read this first

| If you want… | Go to |
|---|---|
| to add a lesson | [[how-to-author-a-speak-lesson]] — not this file |
| what's left before users should see it | **Open items**, below |
| why a decision was made | the section named for it |
| the two real bugs found | *className dropped*, *modal clipped* |

## Open items (nothing else in this note is blocking)

1. **Level-tone scoring approach** — 4 options, two change what gets stored per
   clip. ⚠️ **Decide BEFORE running the ffmpeg extraction** or you extract twice.
   Detail in [[2026-08-18-pronunciation-pipeline-implemented]].
2. **Reference contours** — `contours.json` is `{}`, so no lesson shows a score.
   Needs ffmpeg + `scripts/extract-contours.mjs`.
3. **Native audio + verified Hmong** — every `audio` is `''` and every phrase is
   placeholder. The longest pole; cannot be shortened by writing code.
4. **`SPEAK_ENABLED = true`** — flipped this session. Placeholder lessons are
   reachable by users on a build. Flip back if one ships before #3.
5. **Cross-lesson recycling** — the highest-value FEATURE left. Cheap version
   needs no SRS: open each lesson with 2-3 recalls from the previous one,
   hand-picked. See the last section.

## The shape it landed in

```
app/speak/lesson/[lessonId].jsx     route: gating, quota, modals
  └ LessonScroll.jsx                presentation: chat-style reveal
      └ LessonSteps.jsx             the step components (shared)
  └ LessonCompleteModal.jsx         finish: redo / next / exit + confetti
  └ SpeakSettingsSheet.jsx          empty shell, persistent settings later

LessonRunner.jsx                    🗄️ ARCHIVED pager, same steps
app/speak-lab.jsx                   sandbox, same engine, throwaway data
```

Step types: `intro` → `hear` → `say` (imitate, Hmong visible) → `recall`
(produce, Hmong hidden) → `listen` (comprehension, English hidden) → `dialogue`.
`word` is disabled, commented not deleted.

## Decisions worth not re-litigating

- **Only `recall` scores.** `say` shows the Hmong, so a number there measures
  reading aloud.
- **Gate on HAVING ATTEMPTED, never on the score.** A score can be impossible; a
  recording never is. Admins bypass.
- **Hearing the answer ends a recall.** Otherwise you can pass every one by
  listening first.
- **Redo is the PRIMARY finish action.** Repetition is the method, not a
  consolation prize.
- **Auto-advance never on a step that asks you to do something.**
- **Speech is separate from vocab.** No imports between them, ever.

## Two real bugs this session

- **`className` is silently dropped on `Animated.View`** — margins and alignment
  vanished with no error. Same root cause as the invisible-buttons bug.
- **The finish modal was clipped** — `absoluteFill` fills its PARENT, and it was
  rendered inside `TabScreen`'s padded box.

---

*Sections below are in the order they happened. Search for a heading rather than
reading start to finish.*

---

## What was built

### `src/lib/playToEnd.js` — awaitable playback

`playToEnd(source, opts)` returns a Promise that resolves when the clip actually
ENDS. Plus `pause(ms)`.

**Why it had to exist.** `useAudio().play()` cannot be chained for two reasons:
1. It explicitly `remove()`s the previous player before starting a new one
   (useAudio.js:33-37), so a second call cuts the first clip off.
2. It returns when the sound STARTS, never when it ends. Nothing to await.

**The technique** — wrap the callback in a Promise. `didJustFinish` already
reports the end; it just arrives as a callback rather than a return value. Create
a Promise and call `resolve` from inside the listener.

**Three design points worth keeping:**

- **`finish()` is a hand-rolled `finally`.** Three exits (normal end, timeout,
  throw) all need the same cleanup. A real `try/finally` CANNOT work here: the
  Promise executor returns while the clip is still playing, so a finally block
  would run seconds before there is anything to clean up.
- **The `alreadyFinished` guard protects the CLEANUP, not the resolve.** The
  Promise itself ignores a second `resolve()` (it settles once). But a clip
  ending normally at 2s leaves the 15s timer armed; when it fires it would
  `remove()` an already-removed player.
- **Listener attached BEFORE `play()`.** A very short clip could otherwise finish
  before anyone is listening, and `didJustFinish` fires into the void.

⚠️ **`isRecording` is not optional decoration.** A bundled clip must go through
`resolveAudioSrc`; a `file://` recording must NOT. Trace a file uri through that
function and it returns **null** — the learner's own voice silently never plays,
with no error. This is the single most likely bug in the feature.

### `src/hooks/useAbCompare.js` — the sandwich

NATIVE → YOU → NATIVE, one tap, ~5-6 seconds, 300ms gaps.

**Ordering rationale:** native FIRST because auditory pitch memory lasts only a
few seconds — otherwise you compare your voice to a fading memory. Native LAST
because the final thing heard is what gets imitated next; ending on your own
error rehearses the error. Three (odd) plays end on the target for free.

**The cancel flag is a `useRef`, not `useState`.** The sequence checks it between
every `await`. State would be captured at the render where the loop STARTED, so
flipping it later creates a new variable the in-flight loop never sees. A ref is
one box that is never recreated.

`try/finally` DOES work here (unlike inside `playToEnd`) because the `await`s
keep everything in one function body — so `finally` genuinely runs at the end,
including after an early `return`.

### `app/speak-lab.jsx` — all four step types

| Step | What |
|---|---|
| `hear` | listen to the whole phrase — stateless |
| `word` | meet one word + optional usage note — stateless |
| `say` | record → play → A/B → score → self-assess |
| `dialogue` | one turn at a time; app plays A, learner records B |

`dialogue` is the only step with internal state (which turn), and it stays LOCAL
to that step — the runner still owns the step index.

### Self-assessment

"Got it / Not sure / Try again" under each `say` step, AFTER the score and curve
so the learner judges having seen the evidence.

⚠️ **Deliberately NOT aggregated into a lesson score.** The moment a number is
shown, people optimise it — and here they would be optimising a number they
assign themselves.

### Progress — decided: PER STEP

`markStepComplete(step.id, { lessonId, lessonComplete })` on every Next.

Chosen over per-lesson because a 10-15 minute lesson needs resume. The existing
`markStepComplete` is already **idempotent** (`if (completedSteps.includes(id))
return s`), so replaying a step cannot double-count XP — which is exactly why we
did not roll custom tracking.

### `ToneCurve` — `nowPlaying` prop

Thickens whichever line is currently sounding during A/B compare. Connects the
sound to the picture; one piece of state.

---

## Deleted

`src/hooks/useVerifyWhenDone.js` — superseded by `src/lib/playToEnd.js`. It had
two `playToEnd` declarations in one file (a syntax error) and lived under a `use`
prefix while not being a hook.

---

## ⚠️ THE HMONG IN speakLab.js IS PLACEHOLDER

Written to exercise the flow, **not** by a native speaker. Not one line ships
without verification. The `audio: ''` fields are all empty — there are no
recordings for this lesson yet.

---

## What is NOT done, and why

| | Blocker |
|---|---|
| Reference contours | needs ffmpeg (not installed) — `contours.json` is still `{}` |
| Level-tone scoring | **a decision, not code.** 4 options; two change what gets stored per clip, so decide BEFORE running the extraction |
| Native audio | needs a human in a room with a microphone |
| Real lesson content | needs a native speaker |
| `SPEAK_ENABLED = false` | product call — flipping exposes the EXISTING drills, not this flow |
| Real (non-lab) route | lessons still live only at the admin-gated `/speak-lab` |

**The honest summary: the engine is done, the content is not.** Twenty lessons of
authored phrases plus native recordings dwarfs everything on the code side, and
none of it can be compressed by writing code faster.

---

## How to test

Settings → 🛠️ dev tools → 🧪 Speak lab. Signed in, admin email.

10 steps: hear → word/say ×3 → the `nyob zoo` repeat → full sentence → dialogue.

⚠️ **A/B compare needs BOTH a native clip and a recording.** Every lab step has
`audio: ''`, so the A/B button will not appear until you point a step's `audio`
at a real clip. To see it: set `audio` on one `say` step to a path from
`assets/audio/tones/`, then record.

**First thing to verify** (guide §6 Step 1): does `playToEnd` resolve when the
sound STOPS rather than when it starts? Everything else rests on that.

---

# Concepts this work surfaced

Written up separately because they recur everywhere:

- [[useref-vs-usestate]] — the photocopy vs the whiteboard, and the decision rule
- [[arrow-function-bodies-and-handlers]] — `() =>` as a DELAY, not decoration
- Part 1 of [[ab-compare-and-lesson-script-lesson]] — Promises from actual zero

**The observation worth keeping:** the syntax here is easy. The SCAFFOLDING was
the hard part — knowing the cancel flag must be a ref, knowing `playToEnd` cannot
be a hook, knowing `finish()` replaces a `finally`. None of that is JavaScript
knowledge; it is knowing which shape the problem wants.

---

# Exercises

Predict the answer BEFORE running each one.

## A. The Promise wrap

**A1. Prove the interrupt.** Call `useAudio().play()` twice back to back with two
clips. Describe what you hear, then explain it using useAudio.js:33-37.

**A2. Break the guard.** Delete `if (alreadyFinished) return` from `finish()`.
Play a clip, let it end, wait 15 seconds. What happens when the timer fires, and
why does the Promise NOT resolve twice?

**A3. Move `play()` up.** Put `player.play()` before `addListener`. Does it still
work? Why is it risky even when it does?

**A4. Kill the timeout.** Point `playToEnd` at a nonexistent path with the
`setTimeout` removed. How long is the button stuck? Add it back and confirm.

**A5. The parens trap.** Change `setTimeout(resolve, ms)` in `pause()` to
`setTimeout(resolve(), ms)`. Predict the result, then run it.

## B. Refs and closures

**B1. Make the flag state.** Swap `activeRef` for `useState` in `useAbCompare`.
Start a sandwich, hit Stop. Log the value the loop sees each iteration. Explain
why it never updates.

**B2. Drop `.current`.** Change the double-tap guard to `if (activeRef) return`.
Predict BEFORE running: does A/B work, never work, or always work?

**B3. Ref the wrong thing.** Make `running` a ref instead of state. Which half
breaks — the loop or the button? Why?

## C. The source-resolution bug

**C1. Drop the flag.** Remove `{ isRecording: true }` from the take's
`playToEnd` call. Predict what you hear. Then trace a `file://` uri through
`resolveAudioSrc` line by line and say exactly which branch returns null.

**C2. The reverse.** Pass `{ isRecording: true }` for the NATIVE clip. What
happens, and why is the failure different from C1?

## D. The step machine

**D1. Add a type.** Add `{ type: 'tip', text: '...' }` to the script with no
matching branch. What renders, and why is that better than `null`?

**D2. Remove the key.** Delete `key={step.id}` from `<SayStep>`. Record on one
`say` step, hit Next to the following one. What carries over that should not?

**D3. Double-count XP.** Hit Next, then Back, then Next on the same step. Does XP
increase twice? Find the line in `markStepComplete` that prevents it.

## E. The one that matters

**E1. Test the order claim.** Build `you → native` as an alternative to
`native → you → native`. Record a deliberately wrong tone and try each five
times. Which leaves you better able to fix it next attempt? **My ordering
argument is reasoning, not evidence — this is the experiment that would settle
it.**

---

# The Speak module, wired for real (same day)

The lab was a sandbox. This makes it a shipping feature — with one flag still off.

## What changed

**`src/components/speak/LessonRunner.jsx` (NEW)** — the engine, extracted from
`app/speak-lab.jsx`. All four step types plus the stepper live here now.

**Why extract:** the sandbox and the real route must not drift. A sandbox that
diverges from shipping code stops being a useful sandbox. Both now import the
same file; only their DATA and their gating differ.

**`src/data/speakLessons.js` (NEW)** — real lesson scripts. Two lessons
(Greetings, Thanks & Sorry), each with the double-check repeat and a closing
dialogue. Plus `getSpeakLesson(id)` and `lessonProgress(lesson, completedSteps)`.

**`app/speak/lesson/[lessonId].jsx` (NEW)** — the real route. Owns the WRAPPING
concerns the lab does not have:
- `SPEAK_ENABLED` redirect
- daily quota
- Pro lock via `PaywallGate`
- breadcrumbs + exit navigation

**`app/(tabs)/speak.jsx`** — a "Conversations" section above the existing phrase
groups, with per-lesson progress bars. Both stay: groups are targeted repetition,
lessons teach a whole exchange.

**`app/speak-lab.jsx`** — slimmed to ~40 lines. It now just picks the lab data
and renders the shared runner.

## Decisions made here

**QUOTA IS SPENT PER LESSON, NOT PER RECORDING.** A 10-minute lesson has ~6 `say`
steps; charging each would burn a day's allowance in one sitting. Consumed on the
FIRST step completed (via `onStep`), so a learner can't restart repeatedly for
free.

**`free: true` exempts a lesson from BOTH quota and Pro lock** — the same rule the
tones group follows. Greetings is marked free: the first lesson is the hook.

**Hook order in the route.** All hooks (`useDailyQuota`, `useAuth`,
`useSubscription`) run BEFORE the `SPEAK_ENABLED` / not-found / quota-exhausted
early returns. Same trap as
[[2026-08-17-page-info-modal-swipe-gesture]] — a return above a hook changes the
hook count between renders.

**`LessonRunner`'s "no steps" guard is also below its hooks**, for the same reason.

## ⚠️ Still not done

**`SPEAK_ENABLED` is still `false`.** I did not flip it — that is a product call,
and flipping it exposes the EXISTING phrase drills alongside these lessons. The
route redirects to `/speak` until you decide.

**All Hmong is placeholder and every `audio` is `''`.** The structure is real; the
content is not. No line ships without a native speaker.

**Reference contours still empty**, so no lesson will show a score yet.

**Level-tone scoring still undecided** — and two of the four fixes change what is
stored per clip, so decide before running the ffmpeg extraction.

## How to test today

The lab still works admin-only: dev tools → 🧪 Speak lab.

For the REAL route you must first flip `SPEAK_ENABLED = true` in
`src/lib/launch.js`, then Speak tab → Conversations → a lesson. Flip it back
before building for users unless you have decided otherwise.

---

## SPEAK_ENABLED flipped to TRUE (2026-08-24)

`src/lib/launch.js` — the whole Speak section is now live for users.

The flag's original comment said to flip it "once recording + tone scoring work."
Both do: PCM recording verified on Android 08-20, pipeline self-tested 08-18. The
stale claim in the file header was corrected at the same time.

### What this exposes — SIX entry points, not just the new lessons

| Route | What the user now gets |
|---|---|
| `app/(tabs)/speak.jsx` | the hub (was `SpeakComingSoon`) |
| `app/(tabs)/index.jsx` | the daily phrase card on Home |
| `app/speak/lesson/[lessonId]` | **new** Conversations lessons |
| `app/speak/group/[groupId]` | the older per-phrase drills |
| `app/speak/family/[familyId]` | word-family drills |
| `app/speak/[phraseId]` | single-phrase practice |

⚠️ **Only the first is new work.** The other five are the pre-existing drills that
have been dark since v1 — flipping this flag ships them too. They were built and
working, but they have not been looked at with fresh eyes in weeks.

### ⚠️ What users will now see that is not finished

- **Conversations lessons contain PLACEHOLDER HMONG and no audio.** Every
  `audio: ''` in `src/data/speakLessons.js`. A learner opening "Greetings" sees
  unverified text and silent play buttons.
- **No scores anywhere** — `contours.json` is still `{}`, so every take returns
  `reason: 'no-reference'`. The curve draws; the number does not.
- **`MONETIZATION_ENABLED` is still false**, so everyone is treated as Pro: no
  quota, no locks. The gating code runs but has no visible effect yet.

### Before this reaches real users

- [ ] Replace placeholder Hmong with native-verified content
- [ ] Record native audio for every lesson step
- [ ] Run the contour extraction so scores appear
- [ ] Walk the five older Speak routes once — they have been dark for weeks
- [ ] Decide the level-tone approach (gates the extraction)

Flip back to `false` if a build ships before those are done.

---

## Presentation changed: chat-style SCROLL, pager archived (same day)

The one-step-at-a-time pager was replaced with a **chat-style reveal** — steps
appear one at a time but STAY ON SCREEN, stacking downward.

### Why

- **Language learning is cumulative.** Seeing `nyob zoo` still above you while
  you build the full sentence is the point. A pager hides it.
- **Re-hearing an earlier word costs one scroll gesture** instead of five taps
  backwards through steps already done.
- **One visual grammar.** The dialogue step already stacked turns this way; now
  the whole lesson reads the same.

Trade-off accepted: a long lesson is a long scroll. Progressive reveal keeps the
start from being overwhelming, and auto-scroll means the learner never hunts for
what is new. Past steps dim to 0.65 opacity so the eye lands on what is new —
but they stay fully readable and fully interactive.

### The three-file split

| File | Role |
|---|---|
| `LessonSteps.jsx` | the step COMPONENTS — what each type looks like |
| `LessonScroll.jsx` | the shipping presentation — chat-style reveal |
| `LessonRunner.jsx` | 🗄️ **ARCHIVED** pager, kept for reference |

**Why archive rather than delete:** paging may be the better fit for some lesson
types later — a timed drill, or a quiz where seeing previous answers would be
cheating. Both presentations import the SAME steps, so the archived one cannot
rot into disagreeing about what a step is.

**A presentation decides LAYOUT and PACING. A step decides its own content and
interaction.** That line is what makes two presentations cheap.

### New step type: `intro`

Sets the scene before any Hmong appears. `{ title, body: [...], emoji?, duration? }`.

**No audio, no interaction, by design** — a learner who just opened a language app
should not be asked to do anything in the first three seconds.

Lesson one uses TWO intro steps: a **welcome to Kawm Hmoob** (first lesson only,
with the 5–10 minute estimate) and then a **topic intro** for greetings. Later
lessons skip the welcome and open with their own topic card.

### ⚠️ `scroll={false}` on TabScreen is REQUIRED

`TabScreen` scrolls by default. `LessonScroll` owns its own `ScrollView`, with a
pinned progress bar above and a pinned Continue button below. **Nesting two
scroll views breaks both** — the inner one gets no height and the outer one
fights it for gestures.

Both the real route and the lab pass `scroll={false}`.

### One implementation detail worth keeping

```js
setRevealed((n) => n + 1)
setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80)
```

The `setTimeout` is not superstition. Without it the scroll fires against the OLD
content height — the new card has not mounted yet — and lands short of the bottom.

---

## Tuning pass: compact cards, no `word` step, auto-advance (same day)

### 1. `word` step DISABLED (commented, not deleted)

It rendered the same word immediately before the `say` step rendered it again —
two near-identical cards back to back. `SayStep` already shows hmong + english +
the native clip, so nothing is lost.

Commented out in three places so it cannot half-work:
- the `case 'word'` branch in `LessonSteps.jsx`
- the `WordStep` component itself
- **every word step in both data files** — otherwise they would hit the `default:`
  placeholder now that the case is gone

Kept rather than deleted in case the type earns its place back — e.g. a word that
needs a usage NOTE before practising, which `say` has nowhere to put.

### 2. Cards compacted

`p-6 → p-4`, `text-3xl → text-2xl`, tighter margins, dim opacity 0.65 → 0.55.
More of the lesson is visible at once, which is the entire point of the scroll.

### 3. Auto-advance — with one hard rule

Passive steps move on by themselves so the learner isn't tapping Continue every
few seconds:

```js
intro: 7000,  hear: 6000,  word: 5000,
say: null,    dialogue: null,   // ← NEVER
```

⚠️ **A step that asks the learner to DO something must never advance on a timer.**
Auto-advancing out of a `say` step mid-recording would be infuriating and could
cut a take off. Only steps with nothing to do are eligible.

Two more decisions:
- **Tapping Continue turns auto OFF for the rest of the lesson.** The learner has
  shown they want to set the pace; fighting them would be obnoxious.
- **The countdown is visible** ("auto-continues in a moment · tap to stay here").
  A card moving on its own with no warning reads as a bug. Tapping the notice
  cancels auto WITHOUT advancing, for someone who wants to sit on a step.

### 4. Lessons rebuilt around SENTENCES, not words

Both lessons now teach **4 sentences** each:

| Lesson | Steps | Sentences |
|---|---|---|
| Greetings | 13 | hello · my name is · what is your name · see you again |
| Thanks & Sorry | 12 | thank you · thank you very much · sorry · it's nothing |

**Why sentences:** a learner can use "Kuv lub npe hu ua ___" the moment they walk
out the door. "npe" alone does nothing for them. Both lessons now close on a
3–4 turn dialogue that uses the sentences together.

Each lesson keeps two double-checks (a sentence returning ~4 steps later).

Target shape recorded in the file header: **3-4 sentences, 12-16 steps, 5-10
minutes.**

⚠️ Still placeholder Hmong, still no audio.

---

## Eye-height positioning (same day)

`scrollToEnd` left each new card pinned to the BOTTOM of the viewport. Reading a
phrase down there means looking down — and on a phone held at chest height that
is the worst possible spot.

Replaced with explicit positioning: the active card's top lands **22% down the
visible area** — upper-middle, where the eye naturally rests.

### How

Three pieces, all refs (nothing here should trigger a re-render — see
[[useref-vs-usestate]]):

```js
cardTops.current[idx]   // each card's y, captured via onLayout
viewportH.current       // scroll view height, via its onLayout
scrollTo({ y: top - viewportH * 0.22 })
```

### Two details that would break it

**The delay before scrolling is 120ms, not 0.** The new card must mount AND
report its layout before there is a position to scroll to. Scrolling immediately
targets a `cardTops` entry that does not exist yet.

**`paddingBottom` is dynamic: `max(240, viewportH * 0.7)`.** Without tail space
the scroll bottoms out early and the LAST card can never rise to eye height — it
stays pinned low, which is exactly the problem this change exists to fix. A fixed
small padding would work for long lessons and fail on short ones.

---

## New step type `recall`, and the lesson shape that uses it (same day)

### The shape

Per SET of related words (2 words → 1 phrase):

```
hear   word 1      meet it
say    word 1      imitate it — Hmong VISIBLE
hear   word 2
say    word 2
─────────────────────────────────────
recall word 1      "How do you say 'hello'?" — Hmong HIDDEN
recall word 2
recall the phrase  the two combined
```

Then the next set. Both lessons are now two sets + a dialogue:

```
greetings    17  intro intro | hear say hear say | recall recall recall
                             | hear say hear say | recall recall recall | dialogue
politeness   16  intro       | hear say hear say | recall recall recall
                             | hear say hear say | recall recall recall | dialogue
```

### Why `recall` is a separate type from `say`

| | shows Hmong? | skill |
|---|---|---|
| `say` | **yes** | IMITATION — can you copy this sound? |
| `recall` | **no** | PRODUCTION — can you retrieve it unaided? |

Recognition is far easier than recall, and **only recall is what speaking
actually demands.** A lesson that never hides the answer teaches you to read
Hmong aloud, not to speak it.

### Two deliberate choices inside `recall`

**The reveal is a TAP, not a timer.** Struggling to remember is the part that
builds the memory. Handing the answer over after three seconds removes exactly
the effort that makes it stick.

**The card is visually inverted** (clay background, cream text) so a test looks
different from a practice card the moment it appears. The learner should know
which mode they are in before reading a word.

**The recall block comes AFTER both words, not immediately after each one.** A
gap between meeting a word and being asked for it is what makes the retrieval
real. Asking straight away tests short-term echo, not memory.

`recall: null` in `AUTO_ADVANCE_MS` — never auto-advance. The learner is
recording AND retrieving.

### The scroll block

`paddingBottom` was `max(240, viewportH * 0.7)` — enough tail space to fling past
the newest card into a wall of blank space, which reads as "the lesson ended"
when it has not.

Now: `max(80, viewportH * (1 - EYE_FRACTION) - 200)` — **just enough for the
current card to reach eye height, and no more.**

Plus a soft floor below the newest card:

```
      ───────
   more after this
```

It says "there is more, it is not here yet" rather than letting the scroll trail
into an unexplained void.

---

## Scoring moved to `recall` only (same day)

`say` no longer scores. No Score button, no number, no ToneCurve.

**Why:** `say` is PRACTICE — the Hmong is on screen, so the learner is copying
something they can see and hear. A number there adds nothing except something to
feel bad about on a step whose whole job is low-stakes repetition.

On `recall` the number means something: the phrase came from MEMORY, so it is
measuring a real attempt rather than a read-aloud.

**What `say` keeps:** record, play back, A/B compare, self-assessment. A/B stays
because hearing yourself against the native clip IS the right feedback for
imitation — it just isn't a score.

Verified: `scoreTake`, `ToneCurve`, and `REASON_TEXT` now appear only inside
`RecallStep`.

### Side effect worth noting

The scoring pipeline is now exercised on **fewer** steps — roughly 6 recalls per
lesson instead of every recording. That makes the reference-contour gap sting
less: you only need contours for the phrases you actually test on, not for every
practice repetition.

---

## Authoring guide written

[[how-to-author-a-speak-lesson]] — the lesson shape, every step type with its
data, the non-negotiable rules (unique ids, `audio: ''`, never import
vocabulary.js), lesson-level flags, how to add audio, and how to test.

Written because adding a lesson is now genuinely a one-file job, and that only
stays true if the conventions are written down somewhere other than in my head.

---

## Attempt gate + admin bypass (same day)

Continue is now LOCKED on `say`, `recall`, and `dialogue` until the learner has
recorded something.

### ⚠️ This does NOT contradict the "no gating" decision

The 08-20 decision was **never gate on a SCORE.** A score can be impossible — no
reference contour, or a level tone the scorer structurally cannot judge (see the
level-tone section above). Gating on a score would trap learners on phrases the
machine cannot evaluate.

**Gating on HAVING ATTEMPTED is a different thing entirely.** Recording always
works, on every platform, for every phrase. Requiring it can never trap anyone.

Passive steps (`intro`, `hear`) are never gated — there is nothing to attempt.

### How readiness travels UP

Steps own their recorder, so only they know a take exists. They report it:

```
LessonScroll  ──onReady──►  Step  ──►  SayStep / RecallStep / DialogueStep
              ◄────────────── "I have a recording" ──────────────
```

Each interactive step runs `useEffect(() => { if (uri) onReady?.(true) }, [uri])`.
`attempted` is STATE, not a ref — the Continue button must re-render when it
flips. (Opposite call from `activeRef` in useAbCompare; the deciding question is
always "does the screen need to redraw?" See [[useref-vs-usestate]].)

`onReady` is passed ONLY to the current step. Past cards stay interactive but
cannot re-unlock a gate that has already passed.

**Dialogue readiness is stricter:** it needs the learner to have recorded AND
reached the final turn. Walking to the end without recording is not an attempt —
the recording turns are the point.

### Admin bypass

```js
const bypassGate = isAdmin(user)
```

Clicking straight through a lesson is how you review pacing and copy without
recording 17 takes. Uses `isAdmin`, not `__DEV__`, so it also works in a release
build on your own account.

The button area says which mode you are in — "record your answer to continue" vs
"admin — gate bypassed" — so a locked button is never a mystery.

### One guard worth keeping

Auto-advance is explicitly checked against gated types. All three gated types are
already `null` in `AUTO_ADVANCE_MS`, but the guard means a future timing value
cannot accidentally skip a gate.

---

## Lesson-complete modal + confetti (same day)

`src/components/speak/LessonCompleteModal.jsx` — shown when the last step is
completed, INSTEAD of navigating away. The learner chooses what happens next
rather than being bounced to the hub.

### Three actions, and the order is deliberate

```
  Practise again        ← PRIMARY
  Next: <lesson title>  ← if one exists
  All lessons           ← quiet exit
```

**Redo is the primary button.** For pronunciation, going again is usually the
most valuable next action — not a consolation prize. That is the opposite of a
quiz, where a redo means you failed. Repetition IS the method here.

`getNextLesson(id)` in `speakLessons.js` returns the next lesson or null; the
button is hidden at the end of the list.

### Why not reuse CelebrationOverlay

The Learn module's shared overlay offers a SINGLE action ("Back to lessons"). A
finished Speak lesson has three sensible next moves and which one the learner
wants is genuinely unknown. Both use the same `Confetti` component.

### Two traps this file deliberately avoids

**NOT a React Native `<Modal>`.** On this build a Modal's buttons render under the
system nav bar — the whole saga in
[[2026-08-06-header-page-info-button]]. Plain absolute-fill View with
zIndex/elevation 9999, the proven pattern.

**`flexShrink: 1` on the scroll body, `flexShrink: 0` on the footer.** Without it
the buttons get pushed past the card's bottom edge on device while looking
perfect on web — the #1 "works on web, broken on the build" modal trap, also from
the 08-06 note.

Static style OBJECTS throughout, never style functions
([[nativewind-function-style-invisible]]).

### The stat line is not a grade

"4 of 6 speaking steps recorded" — it reports what happened, it does not judge it.
Same reasoning as never aggregating self-assessments into a score: the moment a
number looks like a grade, people optimise it instead of practising.

### Redo keeps progress

`redo()` resets `revealed`, `attempted`, and re-enables auto-advance — but does
NOT clear `completedSteps`. XP already earned stays earned; `markStepComplete` is
idempotent, so a second pass cannot double-count it.

---

## Polish pass: reveal UI, scroll easing, listen-locks-record (same day)

### 1. The reveal is a panel, not a link

Was: 10px underlined "Show me the answer".
Now: a full-width bordered panel with a title and a subtitle that changes with
state — `check how you did` if a take exists, `recording locks after this` if not.

**Why:** it is the most important control on the card, and a learner reaching for
it is usually mid-struggle. Making them aim at 10px of text is hostile. The
revealed answer also now shows the English under the Hmong and labels itself
"Answer".

### 2. ⚠️ Hearing the answer ENDS the recall

Once the learner plays the native clip, recording is **locked** for that step.

Anything said after hearing it is IMITATION, not retrieval — scoring it would
measure the wrong thing entirely, and a learner could "pass" every recall by
listening first. Record, THEN check.

**Already recorded? Listening is free.** The attempt is banked, so the lock only
applies to `heardAnswer && !uri`.

The button explains itself when locked ("you heard the answer — recording is off
for this one") rather than being mysteriously dead.

`AudioButton` gained `onPlay` and `disabled` props to make this possible. Both
are optional, so every existing caller is unaffected.

### 3. Removed the "N done" counter

It read "0 done" for the whole first pass through a lesson, which is a strange
thing to tell someone who is actively doing it. The step counter and progress bar
already say where you are. `completedSteps` is no longer read here at all.

### 4. Hand-animated scroll, ~650ms with easing

`scrollTo({ animated: true })` has a fixed, snappy duration RN does not let you
configure — it lands like a jump cut in a reading context.

Replaced with a 16ms interval stepping the offset over `SCROLL_MS = 650` using an
**ease-in-out cubic** curve (slow start, quick middle, slow finish). The lesson
now drifts to the next card rather than teleporting.

Three details that make it safe:
- `onScroll` tracks the current offset in a ref, so the animation knows where it
  is starting from (not always the previous target — the learner may have
  scrolled by hand)
- a new animation clears the previous interval, so two cannot fight
- `useEffect` cleanup clears it on unmount — a timer outliving the screen would
  keep calling `scrollTo` on a ref that no longer exists

`SCROLL_MS` at the top of the file is the single knob if 650 feels wrong on device.

---

## FIX: the finish modal was clipped — lifted out of LessonScroll (same day)

### The bug

`LessonCompleteModal` uses `StyleSheet.absoluteFill`, and it was rendered INSIDE
`LessonScroll`. That component lives inside `TabScreen`'s padded, flexed
container — so the modal filled **the lesson area**, not the screen. Dimmed
backdrop with visible page around it, card floating in the wrong box.

### The rule underneath

> **`absoluteFill` fills its PARENT, not the viewport.**

Nothing about the style is "full screen" — it is `position: absolute` with all
four insets at 0. Whatever the nearest positioned ancestor is, that is the box it
fills. Put it three containers deep and it fills the third container.

This is exactly why `CelebrationOverlay` is mounted at the **ThemedShell root**
rather than inside whichever screen triggers it — and why `PageInfoModal` is
mounted by `GlobalHeader`, not by the pages whose help it shows.

### The fix

The modal moved to the ROUTE, as a **sibling** of `TabScreen`:

```jsx
<>
  <TabScreen scroll={false}>
    <LessonScroll key={runKey} … onFinish={setFinished} />
  </TabScreen>

  <LessonCompleteModal visible={Boolean(finished)} … />
</>
```

A Fragment, not a wrapper `<View>` — a wrapper would just become the new parent
and reintroduce the same clipping.

`LessonScroll` no longer knows the modal exists. It reports upward:

```js
onFinish?.({ attempted, total })
```

### Redo via `key`, not a reset function

"Practise again" bumps `runKey`, which **remounts** `LessonScroll`. Changing a
component's `key` throws the old instance away and builds a fresh one, so every
piece of state inside it resets — `revealed`, `attempted`, `autoOn`, scroll
position — with no `reset()` method to write or keep in sync.

Same trick as `key={step.id}` on `SayStep`, for the same reason: a fresh
component is cheaper and more reliable than manually undoing state.

Progress is NOT cleared — `completedSteps` lives in `ProgressContext`, and
`markStepComplete` is idempotent, so a second pass cannot double-count XP.

### Applied to both

The lab uses the identical shape, so the sandbox exercises the real structure.

---

## Fade-in animations (same day)

Reanimated's declarative `entering` prop — one line per element, no shared values
or worklets to manage.

### Dialogue turns drift in from their OWN side

```jsx
entering={(t.speaker === 'A' ? FadeInLeft : FadeInRight).duration(260)}
```

A enters from the left, B from the right. The exchange reads as **two people**
rather than a list scrolling by. It reinforces the alternating alignment the
bubbles already have, in motion rather than only in position.

**260ms** — long enough to register as motion, short enough that a learner
tapping quickly never waits on it.

### Lesson cards drift UP

```jsx
entering={FadeInDown.duration(320)}
```

Matches the direction the scroll is already travelling, so a new card feels like
it arrived from below rather than appearing from nowhere.

**320ms** — slightly longer than a dialogue turn, because a whole card is a
bigger visual event than one line.

### Why `entering` rather than hand-rolled Animated

Reanimated's layout animations run on the UI thread and need no state, no
`useSharedValue`, no `useAnimatedStyle`, and no cleanup. Compare the A/B compare
work, where a shared value was genuinely required because the position depended
on a gesture. Here nothing depends on anything — the element simply appears once.

**Rule of thumb: if the animation is "this element just showed up," use
`entering`. Reach for shared values only when a value the animation depends on
changes over time.**

Both use the reanimated already proven on this build (v4.1.7, worklets plugin
last in babel.config.js — verified during the swipe work).

---

## Spacing restored (same day)

The earlier "make it compact" pass was done as a blanket find/replace
(`p-6 → p-4`, `mb-5 → mb-3`, etc.) and went too far. Once the cards had real
content — reveal panels, A/B buttons, self-assessment rows — the stack read as
one dense wall.

Restored with intent rather than a global swap:

| | was | now |
|---|---|---|
| gap BETWEEN cards | `mb-3` | **`mb-5`** ← the biggest offender |
| card padding | `p-4` | `p-5` (`p-6` for intro cards) |
| dialogue bubble padding | `p-3` | `p-4` |
| gap between turns | `mb-3` | `mb-4` |
| hmong → english | `mb-3` | `mb-5` |
| section dividers | `mt-4 pt-3` | `mt-6 pt-4` |
| footer | `pt-2` | `pt-4` |
| "more after this" floor | `py-3` | `py-5` |

**Intro cards get `p-6`** — they are pure reading with no controls competing for
attention, so they can afford the most air.

**Lesson: a blanket find/replace is the wrong tool for spacing.** Density is a
per-element judgement — a card with three buttons needs different breathing room
than one with a single line of text. The compact pass treated them identically
and every card lost the same amount, which is not what "make it tighter" meant.

---

## 🔴 REAL BUG: `className` silently dropped on `Animated.View` (same day)

Cards were flush against each other with no gap, and dialogue bubbles stacked
CENTRED instead of alternating left/right. The code looked correct:

```jsx
<Animated.View className="mb-5">
<Animated.View className={`mb-4 ${t.speaker === 'A' ? 'items-start' : 'items-end'}`}>
```

**Neither class did anything.** `Animated.View` comes from
`react-native-reanimated`, not `react-native` — and NativeWind's JSX transform
only wraps components it knows about. On a third-party component the `className`
prop passes straight through to something that has no idea what a Tailwind class
string means, and is dropped.

No error. No warning. The element renders, just unstyled.

### Why it was extra confusing

The dialogue turn already HAD a `style` prop (for opacity). So half the styling
worked and half vanished — which reads as "my margin value is wrong" rather than
"my margin is not being applied at all."

### Fix

Real style objects on every `Animated.View`:

```jsx
style={{ marginBottom: 20 }}
style={{
  marginBottom: 16,
  alignItems: t.speaker === 'A' ? 'flex-start' : 'flex-end',
  opacity: idx === turnIndex ? 1 : 0.45,
}}
```

### Same root cause as the invisible-buttons bug

[[nativewind-function-style-invisible]] — a `style` FUNCTION was dropped, making
buttons render at zero size. Different symptom, identical mechanism: **NativeWind
sits in the middle of every element's props, and anything it cannot read, it does
not forward.**

| | what breaks | symptom |
|---|---|---|
| `style` as a FUNCTION | any component | zero size — invisible |
| `className` on a third-party component | reanimated, svg | dropped — unstyled |

**The pattern to use:** animation wrapper on the outside with a `style`, Tailwind
on the plain `View` inside it.

```jsx
<Animated.View entering={FadeInDown} style={{ marginBottom: 20 }}>
  <View className="rounded-md bg-cream-50 border border-cream-200 p-5">…</View>
</Animated.View>
```

Written up with 6 exercises: [[nativewind-classname-on-third-party]].

---

## Button label alignment

`Button`'s label had no `textAlign`. Fine on one line, broken the moment a label
wraps — the second line left-aligns inside a centred row. Added
`textAlign: 'center'`.

Button ROWS (`Play mine` / `Score` / `A/B`) now get `className="flex-1"` on each,
so they share the width evenly instead of sizing to their own text. A row of
ragged-width buttons reads as three unrelated controls; equal widths read as one
set of choices.

---

## UI pass: step rail, and a settings entry point (same day)

### ~~The step rail~~ — TRIED AND REMOVED

Added a dot-per-step rail with connector lines down the left edge, then removed it
the same session at Devan's call.

**Why it went:** it stole horizontal space from the cards and added a second
progress indicator competing with the bar already pinned at the top. The step
counter and the progress bar answer "how far in am I" perfectly well; the rail
was decoration dressed as information.

Kept in git history if a per-step status indicator is ever genuinely wanted —
but the lesson is that the scroll ITSELF is the sequence. Drawing a line beside
it to say so is redundant.

### Past-card opacity 0.55 → 0.7

0.55 made earlier cards look DISABLED. They are not — re-tapping audio on an
earlier phrase is the entire reason for this layout. Dimming interactive content
too far actively discourages the thing the design exists to enable.

### Progress: the BAR ONLY

Both text counters are gone — first "N done", then "Step 4 of 17".

**Why:** the bar already communicates position, and neither number is something a
learner ACTS on. Knowing you are on step 4 of 17 does not change what you do
next; you press Continue either way. It was a second way of saying what the bar
already said, taking up a row to do it.

Bar itself went h-1.5 → h-2 so it reads clearly as the sole indicator.

### Lesson title

`text-2xl` → `text-xl` with `numberOfLines={1}`. At 2xl a two-word title like
"Thanks & Sorry" dominated the screen above content that matters more. The title
is orientation, not the point of the page.

---

## Settings sheet (empty shell, deliberately)

`src/components/speak/SpeakSettingsSheet.jsx`, opened by a ⚙ in the lesson header
opposite the breadcrumb's back affordance — so the two navigation-ish controls
bracket the title rather than crowding one corner.

**Empty on purpose.** The shell exists so the entry point is in the same place
from the first lesson a learner ever opens, instead of appearing later and moving
things around.

The empty state names what will live there rather than being a blank box:
auto-advance, playback speed, A/B order.

### ⚠️ The constraint recorded in the file

Whatever lands here must PERSIST across lessons, which means **a context or
AsyncStorage — never LessonScroll state.** That component is remounted on every
"Practise again" (the `key={runKey}` trick in the route), so anything held there
is wiped on redo.

Candidates, all already decided elsewhere and hardcoded today:
- auto-advance on/off + speed → `AUTO_ADVANCE_MS`
- A/B order and gap → `GAP_MS = 300`, native→you→native
- the require-a-recording gate → currently on for all but admins
- dialect preference → already on the account, but a Speak-specific override may
  make sense
- playback speed for native clips → the obvious first learner request

**Centred card, not a bottom sheet** (changed same day). It holds a handful of
toggles, not a long list — a sheet filling only a third of the screen reads as
unfinished. Now matches `LessonCompleteModal`: centred, maxWidth 420, backdrop
tap to close, no grab handle.

Not an RN `<Modal>` — same nav-bar reason as every other overlay here.

---

## Re-centre when a card GROWS (same day)

Revealing a recall answer adds a whole panel — Hmong, English, audio button — to
a card that is already on screen. The card's `y` does not move, so the original
eye-height scroll was still "correct" while the new content sat below the fold.

### Two parts to the fix

**1. Track heights, not just tops.** `cardHeights` ref alongside `cardTops`.

**2. Position depends on SIZE:**

```js
h > vh * 0.6
  ? top - (vh - h) / 2      // tall card → CENTRE it
  : top - vh * EYE_FRACTION // short card → top at eye height
```

Pinning a tall card's top would push its bottom half off screen — the exact
problem. Below 60% of the viewport, eye height reads better; above it, centring
wins.

**3. Re-scroll on growth**, from `onLayout`:

```js
if (isCurrent && prev != null && height - prev > 24) {
  requestAnimationFrame(() => scrollCardToEye(idx))
}
```

`> 24` so ordinary re-layout noise does not cause a scroll. `requestAnimationFrame`
so the new height is committed before the scroll is computed. Safe from loops:
scrolling does not change layout, so this cannot re-trigger itself.

Also fires when a score + ToneCurve appear — same growth, same fix.

---

## Type scale down a notch

Cards read large once the reveal panel and button rows were in. Padding stayed
generous; the TYPE came down:

| | was | now |
|---|---|---|
| phrase (hear/say) | `text-xl` | `text-lg` |
| recall prompt | `text-xl` | `text-lg` |
| revealed answer | `text-2xl` | `text-xl` |
| intro title | `text-2xl` | `text-xl` |
| intro emoji | `text-5xl` | `text-4xl` |
| score | `text-4xl` | `text-3xl` |
| dialogue bubble | `text-lg` | `text-base` |
| card padding | `p-5` | `p-4` (intro `p-5`) |

**The principle:** when a card feels heavy, shrink the TYPE before the padding.
Cutting padding makes it cramped; cutting type size makes it calm. The earlier
compact pass got this backwards and had to be reverted.

---

## Exit guard: confirm before abandoning a lesson (same day)

`src/hooks/useExitGuard.js` + a `ConfirmModal` in the lesson route.

### ⚠️ The wording matters, and "progress won't be saved" would be a LIE

`markStepComplete` fires on every Continue, so **completed steps and their XP are
saved permanently** in ProgressContext. Leaving does not undo them.

What leaving actually loses:
- your POSITION in the lesson — `LessonScroll` state, wiped on unmount
- this run's recordings — temp files, and `uri` state goes with the component
- scores and self-assessments for the current run

So the message says:

> Steps you've finished are saved, but you'll start "Greetings" from the
> beginning next time — and this round's recordings will be gone.

True, and still gives someone a reason to stay. A scarier lie would train
learners to distrust the app's other messages.

### Three ways out, one confirm

| Route out | Caught by |
|---|---|
| Android hardware back | `BackHandler` listener |
| back gesture / header back | `usePreventRemove` (@react-navigation/native 7.3.16) |
| the "Speak" back pill | the route's OWN button, calling `ask()` |

**The third needed a change.** `Breadcrumbs` renders its back pill as a `<Link>`,
which navigates immediately — no chance to intervene. So the route now passes
`{ label: 'Speak' }` with **no `to`**, which makes Breadcrumbs render no link at
all, and supplies its own visually identical pill wired to the guard.

### When the guard is armed

```js
const started = stepNo > 1 && !finished
```

Past the first card, and not already at the finish modal. Leaving from the intro
card asks nothing — there is genuinely nothing to lose yet, and a confirm dialog
for "you have done nothing" is the kind of friction that makes people stop
trusting confirms.

`LessonScroll` reports position via a new `onProgress` callback rather than the
route owning the step index. The route does not need to know WHERE you are, only
whether there is a somewhere worth losing.

### Hook order

`useExitGuard` is called ABOVE all three early returns (`SPEAK_ENABLED`,
not-found, quota-exhausted) — it contains `useState`/`useEffect`, so a return
above it would change the hook count between renders. Same trap as
[[2026-08-17-page-info-modal-swipe-gesture]].

---

## 🔴 The exit guard trapped you — two bugs, fixed same day

Reported immediately: after FINISHING a lesson, none of the finish-modal buttons
worked. The screen was inescapable.

### Bug 1 — clearing `finished` re-armed the guard

The finish modal did this:

```js
onExit={() => {
  setFinished(null)          // ← re-arms the guard
  router.replace('/speak')   // ← now blocked
}}
```

`started` is `stepNo > 1 && !finished`. Clearing `finished` flipped `started`
back to true in the same tick, so the guard blocked the navigation that was
supposed to follow it.

**Fix: do not clear `finished` before navigating.** The screen unmounts anyway.

`onRedo` still clears it, and that is correct — the remount makes LessonScroll
report step 1 via `onProgress`, so `started` is false again until the learner
advances.

### Bug 2 — confirming an exit could never actually leave

Worse, and it would have hit the "Leave" button too. `confirm()` called
`router.replace()` while `preventRemove` was **still true** — so the navigation
was blocked and the confirm re-opened. An infinite loop.

**Fix: confirming DISARMS first, and navigates on the next render.**

```js
const armed = active && !allowLeave

const confirm = () => { setAsking(false); setAllowLeave(true) }

useEffect(() => {
  if (!allowLeave) return
  const action = pendingAction.current
  if (action) navigation.dispatch(action)  // replay what they tried
  else onLeave()                            // pill / hardware back
}, [allowLeave])
```

Two steps, because **React state is not visible until the re-render.** Reading
`allowLeave` immediately after setting it would still see `false`.

### Replaying the original action

`usePreventRemove`'s callback hands over the navigation action it blocked —
`{ data: { action } }`. Storing it and dispatching after confirmation means a
back gesture goes back and a tab press goes to that tab, instead of everything
being redirected to `/speak`.

Held in a REF: read by an effect, never drawn.
See [[useref-vs-usestate]] — same decision rule as always.

### The general lesson

**A guard needs an off switch, and flipping it is not instant.** Any
"confirm-then-act" flow where the guard and the action live in the same tick will
deadlock. Disarm, let React re-render, then act.

---

## Every modal fades in (same day)

### It turned out to be half done already

The four components using React Native's `<Modal>` — `ConfirmModal`,
`InfoModal`, `Picker`, `DeleteAccountModal` — **already had
`animationType="fade"`.** RN handles those.

Only the `absoluteFill` overlays needed work, because those are plain Views that
appear instantly.

### What was added

| Component | Entrance |
|---|---|
| `LessonCompleteModal` | backdrop `FadeIn 180ms` + card `FadeInUp 260ms delay 40` |
| `SpeakSettingsSheet` | same pair |
| `CelebrationOverlay` | backdrop `FadeIn 180ms` |
| `WelcomeTour` | `FadeIn 200ms` |
| `PageInfoModal` | card `FadeInUp 240ms` |

### Two motions, not one

The backdrop FADES while the card RISES, and the card is 40ms behind:

```
0ms    backdrop starts dimming
40ms   card starts rising
180ms  backdrop settled
300ms  card settled
```

The dim lands first, so the card arrives **onto** something rather than with it.
One combined fade reads as a flat image appearing; two staged motions read as
depth.

### ⚠️ PageInfoModal is the exception, for a real reason

Its root is a `GestureHandlerRootView` — required, because gesture-handler only
sees gestures inside one and `app/_layout.jsx` has none (see the swipe work).
Converting that root to an `Animated.View` would silently kill the swipe.

**So the animation went on the CARD instead of the backdrop.** When a component's
root has a structural job, animate the child.

### The trap that showed up twice while doing this

Changing `<View>` → `<Animated.View>` means changing the CLOSING tag too, and
scripted edits kept matching the wrong one. Two separate parse failures.

Root cause the second time: **CRLF line endings.** An exact string comparison
against `"    </View>"` fails when the line actually ends `</View>\r`. Comparing
`.trim()` instead fixed it.

Also relevant every time: **never `className` on an `Animated.View`** — see
[[nativewind-classname-on-third-party]]. All the styles above are objects.

---

## Three improvements from the Natulang review (same day)

Asked what would make the module better. Four came out; three were built.

### 1. ⚠️ Incremental sentence building — the biggest win, and ZERO code

The lesson went word → word → **full sentence**. That jump is where learners fall
off; nothing bridges it. Now each recall adds ONE piece to the thing just said:

```
kuv                        →  I / my
kuv lub npe                →  my name
kuv lub npe hu ua Ntxawg   →  My name is Ntxawg.
```

Greetings does this twice — once for `kuv…`, once for `koj…` — and went 17 → 22
steps.

**Pure authoring. Not one line of code changed.** The `recall` step already did
everything needed; the old script simply was not using it well.

This is the pattern most worth copying into every future lesson, and it now has
its own section in [[how-to-author-a-speak-lesson]].

### 2. "Try again" now actually gives you another go

The three self-assessment buttons all did the same thing: nothing. A learner
notices that within two lessons, and then stops trusting the other controls.

`usePronunciation` gained `reset()`. Tapping **Try again** clears the take and
drops the card back to its Record state.

Still NOT a score — this is the smallest honest meaning the button could have.
The fuller version (re-queue that phrase a few steps later) needs the runner to
mutate its own step list, which is a bigger change than it sounds.

### 3. New step type `listen` — the comprehension direction

Every step until now was English → Hmong. `listen` plays the Hmong and asks what
it MEANS.

|  | shown | learner produces | skill |
|---|---|---|---|
| `recall` | English | Hmong | PRODUCTION |
| `listen` | Hmong + audio | English | COMPREHENSION |

**Why it matters:** a learner who only ever produces can SAY "ua tsaug" but may
not recognise it when a Hmong speaker says it to them — which is the real failure
mode in a conversation, where you HEAR before you speak.

**No recording, on purpose.** The answer is in English; scoring an English take
against a Hmong reference is meaningless, and saying "thank you" out loud teaches
nothing. It is a self-check: listen, answer in your head, reveal, be honest.

That makes it the only step type with **no gate** — there is no attempt to
detect. Also `listen: null` in `AUTO_ADVANCE_MS`: the learner is thinking, and a
timer would answer the question for them.

One per lesson, placed late, after the phrases have been produced.

### Lesson shapes now

```
greetings   22  intro intro | hear say ×3 | recall ×4 (the build)
                            | hear say ×2 | recall ×3 | listen | recall | dialogue
politeness  17  intro       | hear say ×2 | recall ×3
                            | hear say ×2 | recall ×3 | listen | dialogue
```

---

## ⚠️ Still deferred — and it is the highest-value item left

**Cross-lesson recycling.** The thing that actually makes Natulang work. Right
now a finished lesson is a closed box: those phrases are never seen again unless
the whole lesson is replayed. That is how a textbook teaches — chapter by
chapter, forgetting as it goes.

**The cheap 80% needs no SRS at all.** A lesson script can simply OPEN with 2-3
`recall` steps drawn from the PREVIOUS lesson, chosen by hand at authoring time.
Zero new infrastructure; it uses the step type that already exists. A real
per-word strength model can come much later, once there are learners producing
data to tune it against.

Named here so it does not get lost.

## Also raised, not built

**Advised AGAINST: streaks, points, or a leaderboard on pronunciation.** The
module has already refused a score twice — no gating on it, no aggregated
self-assessment — and the reasoning holds. The moment speaking carries a number,
people optimise the number instead of speaking. Keep this module honest and
unranked, even if the rest of the app gamifies.

---

## Audio + record buttons made larger (same day)

Both were too quiet for controls that ARE the point of their cards.

### `AudioButton` now has four sizes

```js
sm   28px   inline beside a word in a list — incidental
lg   40px   a card's secondary audio
xl   64px   THE action on a lesson card
hero 88px   the only thing to do on the screen (a `hear` step)
```

⚠️ **44px is the floor for a tap target** (Apple HIG / Material). `sm` at 28px is
UNDER it — which is fine inline, where a mis-tap is cheap and the row is usually
pressable too, but wrong for anything that is a card's main action. Noted in the
file so the small size does not spread.

Assigned by what the step is FOR:

| Step | Size | Why |
|---|---|---|
| `hear` | **hero** | the audio IS the step; nothing else to touch |
| `listen` | **hero** | same — you are there to listen |
| `say` | xl | reference clip, but you also record here |
| `recall` (revealed answer) | xl | same |
| dialogue turn | lg | one line in an exchange, not the card's action |

### Two other AudioButton changes

**Kept ♪, added a playing state.** I swapped it to ▶ arguing a triangle reads as
"press to hear" better than a note; Devan reverted it. The note is the app's
established audio mark — it appears on every vocabulary row and reference screen,
and consistency across the app beats a marginally more literal icon in one place.

What DID stick: it now flips to ▮▮ while that clip is playing, using `playing`
from `useAudio`, so a learner can tell whether their tap registered.

**Accessibility props added** — `accessibilityRole`, a label that changes when
there is no clip, and `busy` while playing. It was a bare `Pressable` with a
character in it.

### Record buttons

`Button` gained an **`xl`** size (`px-8 py-5`, 18px text vs 14). Font size now
scales with button size — a big button with small text reads as a mistake.

All three record buttons (`say`, `recall`, `dialogue`) use it, with transport
glyphs in the label:

```
●  Record        ●  Say it        ●  Your line
■  Stop
```

**Why glyphs:** ● and ■ are recognisable before the words are read. On a card
where recording is the whole point, the control should be identifiable at a
glance rather than requiring a label to be parsed.

---

## Type/size rebalance (2026-08-29)

> "make the words bigger too, why's the font so small. But make the entire box
> smaller, dude, screens dont need to be THAT big."

Both halves at once, and they are not in tension — because **the words were
never what made the box big.**

An earlier pass ("make it a tiny bit more small") shrank things by class, not by
role. The Hmong headword — the single thing a learner is meant to read and say —
ended up at `text-lg`, the same size as body copy. Meanwhile the chrome grew:
88px hero audio buttons, `size="xl"` record buttons at `py-5`, `mt-6 pt-4`
divider rules. The card was tall because of its FURNITURE, and quiet because its
CONTENT had been shrunk to fit.

So: content up, furniture down.

**Content up**

| | was | now |
|---|---|---|
| Hmong headword | `text-lg` | `text-2xl` |
| English gloss | `text-sm` | `text-base` |
| Recall reveal | `text-xl` | `text-2xl` |
| Dialogue turn | `text-base` | `text-lg` |
| Listen answer | `text-base` | `text-lg` |

Eyebrow labels ("Listen", "New word") stay `text-xs`. They are signposts, not
content, and growing them would undo the whole point.

**Furniture down**

| | was | now | saved |
|---|---|---|---|
| Record button | `xl` (`py-5`) | `lg` (`py-3.5`) | ~13px each |
| AudioButton `hero` | 88px | 72px | 16px |
| AudioButton `xl` | 64px | 56px | 8px |
| Divider rule | `mt-6 pt-4` | `mt-4 pt-3` | 12px |
| Gloss margin | `mb-5` | `mb-4` | 4px |
| Card gap (LessonScroll) | 20px | 14px | 6px |

Net: the card lost roughly 50-60px of height while its type got noticeably
larger. Both buttons stay far above the 44px tap-target floor, so the earlier
"make the buttons more noticeable" work is not undone — 72px is still emphatic.

> **The transferable bit.** "Too big" and "too small" in the same breath is not a
> contradiction — it means the size hierarchy is inverted. Ask which elements are
> CONTENT and which are FURNITURE, then move them in opposite directions.
> Scaling everything by one step, which is what a blanket find/replace does,
> preserves the inversion and fixes nothing.

### Follow-up: the cards themselves (same day)

> "for example make the from memory card smaller too."

The pass above shrank shared chrome. This one goes per-card, and the `recall`
("From memory") card is where the real finding was.

**It was showing the same string twice.** The prompt at the top is
`step.english`; the revealed answer block printed `step.hmong` and then
`step.english` again — re-answering a question the learner is currently looking
at, three inches lower. Deleted.

That is the difference between compacting and editing. Every gap on that card
was defensible on its own; the duplicated line was not defensible at all, and no
amount of margin-shaving would have found it. **Look for what the card says
twice before looking at what it pads.**

Rest of the recall card:

| | was | now |
|---|---|---|
| Duplicate English under answer | present | removed |
| Answer audio button | `xl` (56px) | `lg` (40px) — inside a panel, it was competing with Record |
| Prompt margin | `mb-4` | `mb-3` |
| Eyebrow | `mb-3` | `mb-2` |
| Action row | `mt-4` | `mt-3` |
| Divider | `mt-4 pt-3` | `mt-3 pt-3` |
| Reveal panel | `py-3` | `py-2.5` |
| Score number | `text-3xl` | `text-2xl` |

⚠️ **One thing had to be given back.** Removing the duplicate English also
removed the *gap* it was silently providing, leaving the audio button jammed
under the answer. The Hmong line went `mb-1` → `mb-3` to restore it explicitly.
Deleting an element deletes its spacing too — check what collapses.

The same one-notch tightening then went across `hear`, `word`, `say`,
`dialogue` and `listen` (eyebrows `mb-3`→`mb-2`, action rows `mt-4`→`mt-3`,
reveal panels `py-3`→`py-2.5`, SayStep's native-clip row `mb-5`→`mb-4`).

Deliberately unchanged: `hero` audio on `hear` and `listen`. On those cards the
audio IS the step — there is nothing else to press — so it earns the size. Grep
confirms no `mb-5`, `mt-6`, `p-6` or `p-8` remains anywhere in the file.

### Playing-state glyph (2026-08-29)

> "make the stop button smaller, after playing."

The round `AudioButton` shows `♪` at rest and `▮▮` while playing, at the SAME
font size. But `▮▮` is two solid blocks and `♪` is a thin stroke — equal font
size, wildly unequal ink. At `hero` (72px) the playing state read like the
button had grown.

Each size now carries a `stop` class one step below its `glyph`:

| size | box | `glyph` (♪) | `stop` (▮▮) |
|---|---|---|---|
| sm | 28px | `text-sm` | `text-xs` |
| lg | 40px | `text-lg` | `text-sm` |
| xl | 56px | `text-2xl` | `text-base` |
| hero | 72px | `text-3xl` | `text-xl` |

⚠️ **The box is unchanged — only the glyph inside it.** Shrinking the button
itself would move every element below it, on a card `LessonScroll` has already
scroll-positioned to eye height. The learner would lose their place mid-clip,
which is worse than the problem being fixed. Same reasoning as the answer/audio
gap earlier today: changing an element's size changes its neighbours' positions.

> **Equal font size is not equal visual weight.** A glyph swap needs its own
> size, not the one that suited the glyph it replaced.

### The recall lock was a deadlock (2026-08-29)

`recordLocked = heardAnswer && !uri` latched BOTH terms and guarded the only
action that could clear either, so hearing the answer killed that step's Record
button permanently. Replaced with a transient check on whether audio is actually
sounding right now.

Promoted to its own note — the bug class (a latched boolean guarding its own exit)
and the pedagogy-vs-mechanics framing generalise well beyond this card:
**[[2026-08-29-recall-lock-deadlock]]**
