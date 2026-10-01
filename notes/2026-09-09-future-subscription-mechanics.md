# Future: the five things that make it a SUBSCRIPTION (2026-09-09)

**Nothing here is built.** This is the map for five pieces of work identified
together on 2026-09-08. They belong in one note because they answer one question
the content roadmap does not:

> Content answers *"is month one worth paying for?"*
> These answer *"is month six?"*

A learner can finish every story and lesson in the app. What keeps a
subscription is state that grows with them and content that keeps arriving.
Notebook sync, cross-module scheduling, OTA and the cap are all that; the
monetization flag is what turns any of it into money.

Devan is on **audio** now (the 340 silent words), which is correctly ahead of
all of this. This note exists so none of it has to be re-derived later.

---

## 1. Notebook sync — the smallest one, and the one that costs the most

`NotebookContext` has **zero** Supabase references. `ProgressContext` has three.
Saved words live only in `AsyncStorage`, under `kawmhmoob.notebook.<userId>`.

**A subscriber who changes phones loses every saved word.** That got worse on
2026-09-08: the reading module can now save words from inside a story, so the
notebook is where reading sends everything it teaches.

### The pattern already exists — copy it

`ProgressContext` is the working example, and it is small:

```js
async function loadProgress(userId) {
  if (userId === 'guest') return (await loadJSON('kawmhmoob.progress.guest', null)) || initialState
  const { data } = await supabase.from('progress').select('data').eq('user_id', userId).single()
  return data?.data || initialState
}

async function saveProgress(userId, state) {
  if (userId === 'guest') { await saveJSON('kawmhmoob.progress.guest', state); return }
  await supabase.from('progress').upsert({ user_id: userId, data: state, updated_at: ... })
}
```

One jsonb blob per user, guests stay local, and the hydrate/save `useEffect` pair
is already identical in both contexts. `NotebookContext` needs the same two
functions and a `notebooks` table.

### Three traps — and two of them are in the pattern being copied

**Last-write-wins clobbering.** The upsert writes the WHOLE blob. Two devices
open, and the second save overwrites the first: the earlier device's saved words
vanish with no conflict and no error. Tolerable for progress (monotonic, mostly
append-only). Less tolerable for a 15-word notebook someone curates. If it
matters, the row needs per-word merge or an `updated_at` check, not a blob.

**Guest data is stranded on sign-up, not merged.** Both contexts key on
`user?.id || 'guest'` and RELOAD when it changes. A guest saves 8 words, creates
an account, and lands on an empty notebook — their words still sit under the
guest key, unreachable. This bug is **already live in progress** and will be
copied verbatim unless the sign-up path merges guest state into the new account.
See [2026-09-01-next-gate-and-paywall-plan] §4, which flags the same identity
seam for quotas.

**The copy used to say it syncs.** That claim was removed from the UI on
2026-08-29 ([2026-08-29-audit-fixes-error-boundary-lint-sync-copy]). If Pro is
ever marketed as cross-device, this has to ship BEFORE that sentence goes back.

---

## 2. Spaced repetition ACROSS modules — half-built, and the built half is good

> **Correction to a claim made on 2026-09-08.** A grep for
> `srs|reviewQueue|nextReview|dueAt` found nothing, and the conclusion drawn was
> "spaced repetition: no code anywhere." **That was wrong.** It is all there
> under different names — `vocabSchedule`, `nextSchedule`, `selectDueWords`.
> Grep for the concept, not for the vocabulary you expect it to use.

### What exists

In `ProgressContext`, a Leitner ladder:

```js
const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]   // days

function nextSchedule(prev, success) {
  const idx = prev?.intervalIdx ?? -1
  const newIdx = success ? Math.min(idx + 1, SRS_INTERVALS.length - 1) : 0   // miss -> back to 1 day
  ...
  return { intervalIdx: newIdx, dueDate, lastReviewedAt }
}
```

Plus session selection that is more thought-through than most: reviews before
new words, a `SESSION_LIMIT` of 25 so a 300-word backlog is not one unfinishable
session, a `DAILY_NEW_LIMIT` of 10, and a **date-seeded shuffle** so the home
card, the Words hub and the session screen all derive the same deck on the same
day instead of three different ones. Consumers: `app/(tabs)/index.jsx`,
`app/words/index.jsx`, `app/words/session.jsx`, `app/review.jsx`.

### What is missing

**Exactly one thing feeds it:** `setVocabStatus(wordId, status)`. Mark a word
Known and it schedules. Nothing else in the app ever writes `vocabSchedule`.

| the learner does | schedules a review? |
|---|---|
| marks a word Known in Words | yes |
| gets a word wrong in a quiz (`recordQuizScore`) | no |
| long-presses a word in a story, or saves it | no |
| finishes a Speak lesson step (`markStepComplete`) | no |
| reads a story containing a word they are learning | no |

The content plan calls for spaced repetition **scheduled across modules, not
just within a lesson**. That is the gap. The engine is fine; the inputs are
missing.

### The design question to settle first

`nextSchedule(prev, success)` takes a BOOLEAN. Every module has to answer "was
this a success?" in its own terms, and those terms are not comparable: a quiz has
a right answer, a Speak recording has a 0-100 tone score, and reading a word is
exposure with no assessment at all.

Decide the mapping before wiring anything, or the ladder fills with events that
do not mean the same thing:

- **Quiz** — clearest. Correct is a success, wrong is a miss. Wire this first.
- **Speak** — a score threshold, and choosing the threshold is a content decision.
- **Reading** — probably NOT a success signal. Exposure is not recall. It could
  seed a word into the schedule as "seen" without advancing an interval.
- **Saving to the notebook** — an intent signal, not a performance one.

**A miss resets to `intervalIdx: 0`.** Feeding it a weak signal (a Speak score
that dips, a word skimmed in a story) can wipe a genuinely mastered word's
90-day interval back to one day. That is how a good SRS turns into a nag.

---

## 3. OTA updates — the delivery pipe a cadence needs

No `expo-updates` in `package.json` or `app.config.js`. **Content ships inside
the binary.** Every new story, lesson and audio clip needs a full store release
and a review cycle.

That is what makes "two new stories a month" a store-review schedule rather than
a publishing one — and a visible cadence is the clearest answer to "why am I
still paying." A subscriber's app is currently identical on day 1 and day 90.

For when it is built:

- EAS Update is the Expo-native answer, and the runtime is already SDK 54.
- **JS and assets only.** Audio bundled via `require()` can go out in an OTA;
  anything needing a native module still needs a store build. The audio pipeline
  is the reason to check this carefully — see `notes/AUDIO-END-TO-END.md`.
- **Both stores require that an OTA not change what the app materially is.**
  Adding stories is fine. Turning monetization on via OTA is not — ship a flag
  flip like `MONETIZATION_ENABLED` in a reviewed binary.
- The alternative, and possibly the better first step: move stories and lessons
  to **Supabase** and fetch them. Then content is a database row, not a release —
  at the cost of offline reading, which this app has for free today because
  everything is bundled. That trade is the real decision, not the tooling.

---

## 4. The notebook cap — a UX affordance pretending to be a paid boundary

```js
export const NOTEBOOK_WORD_LIMIT = 15   // src/context/NotebookContext.jsx
```

Enforced entirely in the client, inside `saveWord()`. Its ORIGINAL reason is good
and worth keeping ([2026-08-28-notebook-cap-study-and-notes-hidden]): the saved
words became a study deck, and a deck has to be finishable in one sitting.

The problem is only what it is asked to do at the paywall. If Pro's pitch is
"unlimited saved words", then:

- the limit is trivially bypassed — it is client-side, and the notebook does not
  even reach the server yet (see §1);
- and **the cap has to survive the flag flip**. Everyone is Pro today, so nobody
  has hit 15 as a paid wall. The day `MONETIZATION_ENABLED` flips, a free user
  with 40 saved words is over a limit that did not exist for them yesterday.
  Decide what happens to them — grandfathered, read-only, or pruned. Silently
  dropping words is the one unacceptable answer.

Cleanest resolution: keep 15 as the **study-deck size** (a real product reason)
and pick a different Pro boundary that the server can actually enforce once §1
exists.

---

## 5. Monetization — the flag, and what is still untrue

The implementation plan already exists and has not been superseded:
**[2026-09-01-next-gate-and-paywall-plan]** — read that first. It covers the
one-line flag, the gating inventory, the quota ladder, and the store/legal
pre-flight.

What has changed since it was written (2026-09-01 to 2026-09-09):

- **Reading shipped.** Library, genre screens, reader, quiz, progress, quota, and
  free-vs-Pro genres via `free: true` on a genre. It is now a real Pro surface,
  which the plan predates.
- **Ten stories exist, and none are release content.** Nine carry
  `placeholder: true`; the tenth is the original shape test. The Hmong has not had
  a native review. See [2026-09-08-reading-module-visual-system].
- **Price.** $12.99/mo was decided 2026-08-30. A $7.99 "starter" was floated on
  2026-09-08 as a placeholder to start earning. **There is no middle tier in the
  code**: `canAccess(contentTier, userTier)` returns true only for `'pro'`, so a
  second paid tier is a change to that function rather than to call sites — and
  it needs a defensible split of content that does not yet exist to split.

Still untrue or unfinished, unchanged from the plan:

- **29 `TODO-VERIFY` grammar claims** in `src/data/lessons/`.
- **340 of 528 words have no audio** (36% coverage). Being worked on now.
- **Speak is 3 lessons of placeholder Hmong**, and `SPEAK_ENABLED`'s own comment
  says to flip it back to `false` if that ships. Speak is Pro-walled.
- **Legal pages are unhosted placeholders** — `kawmhmoob.com/terms` and
  `/privacy`, with the TODO still at `app/paywall.jsx:31`. A guaranteed rejection.
- **Grandfathering is undecided.** Everyone has been Pro since v1; flipping the
  flag takes things away from every existing user at once.

---

## Suggested order

1. **Audio** (in progress) — nothing here competes with it.
2. **Notebook sync** — smallest, and it removes the clearest churn cause. It also
   has to exist before any server-enforced Pro boundary can.
3. **Quiz to SRS** — one call site, the least ambiguous success signal, and it
   makes the review queue meaningfully better straight away.
4. **Decide the cap's job**, since §1 changes what is enforceable.
5. **OTA / remote content** — the moment there is a second batch of stories to
   deliver, not before.
6. **Monetization last**, per the 2026-09-01 plan's own ordering.

Related: [2026-09-01-next-gate-and-paywall-plan],
[2026-09-08-reading-module-visual-system],
[2026-08-28-notebook-cap-study-and-notes-hidden],
[2026-08-06-daily-quota-and-signifier],
[2026-08-18-content-implementation-plan].
