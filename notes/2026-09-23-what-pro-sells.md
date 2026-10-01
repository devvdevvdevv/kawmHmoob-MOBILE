# What Pro sells — the case for $7.99/mo, and what is missing (2026-09-23)

The decision `notes/TODO.md` records as open ("recording was paused, which turns
this from a content backlog into a BUSINESS-MODEL DECISION, and that decision is
not made"), written down so it can be argued with rather than re-derived.

**This is an argument, not a change log.** Nothing below was implemented. Every
count was read from the code on 2026-09-23, not remembered.

---

## The problem in one line

**Pro is currently defined as "fewer walls."**

A subscriber today gets: the daily caps lifted, path units 3–10, the Pro quizzes,
and the Speak library. That is a discount on friction, not a capability. And the
free tier got roomier this week — every daily quota went 2 → 5 on 09-22, and the
sentence builder went 5 → 7 on 09-23 — so the gap Pro is selling across narrowed
at the same time.

The surrounding facts, all verified:

| | |
|---|---|
| `MONETIZATION_ENABLED` | `true` since 2026-09-15 |
| Reading | went **free** 2026-09-15 |
| Speak lessons ready | **6 of 21** (the rest are correctly hidden) |
| Recording | **paused** 2026-09-21 |
| Pro price | $7.99/mo (store + RevenueCat dashboards) |
| Season Pass | a second price, $9.99/season, 50 tiers |

So what Pro sells is six lessons and the absence of a limit.

---

## The proposed line

**Pro is voice + trust.** Free is everything that makes someone tell their cousin
about the app; Pro is the two things no free alternative has for Hmong at all.

| | |
|---|---|
| **Free** | the whole reading library · vocabulary browsing · the beginner path · recognition quizzes |
| **Pro** | record yourself and get tone feedback · unlimited speaking practice · offline audio · the reviewed dictionary with example sentences |

The reasoning: for Spanish, everything in this app exists free somewhere. For
Hmong, **we are the only shelf in the store** — and people pay for the only
option far more readily than for the best one. But "only option" is a claim about
the *language*, not about the app, so it only holds while the content is
trustworthy (§3) and the thing nobody else has actually works (§2).

---

## What has to be built, in order

### 1. Make the decision above, or a different one — but make it

Every item below assumes an answer. While Pro means "fewer walls", each quota
raise is an unpriced giveaway and each new free feature is a smaller reason to
pay, and neither shows up as a decision anywhere.

### 2. Six excellent voice lessons, not twenty-one adequate ones

The DSP, the tone curve, the A/B compare and the scorer are all built. Six
lessons with real recordings is enough to sell a subscription **if the feedback
is good enough that someone improves in a week**. Fifteen more silent lessons in
the list add nothing a subscriber can use.

⚠️ **Level-tone normalization is load-bearing here**, not housekeeping. It sits
in TODO's housekeeping section ("the scorer cannot separate level tones"), but a
scorer that confidently marks a correct attempt wrong is the fastest way to lose
a paying user — it attacks the one thing they are paying for.

### 3. The dictionary is the product, not the polish

**685 unreviewed entries, plus 533 carrying no status tag at all, out of 1,350
live entries.** Counted from the data on 2026-09-23, not from TODO.md.

⚠️ **The grep TODO.md gives for this number over-counts by 61.**
`grep -c "'unreviewed'" src/data/vocabulary.js` returns **746**, but 61 of those
hits are **commented-out entries** — words that do not ship. The live count is
685. TODO.md calls its grep "the honest ceiling"; it is a ceiling over a set that
includes deleted words. Count from the data:

```
node -e "…categories → dedupe by id → flatMap(words) → filter tags.includes('unreviewed')"
```

Full breakdown of the 1,350 live entries, today: 685 unreviewed · 124 reviewed ·
30 draft (all 30 also tagged `unreviewed` — the contradicting double-tag TODO.md
flags) · 8 needs-source-review · 17 needs-review · **533 with no status tag**.

For Spanish, a wrong gloss is an annoyance someone corrects elsewhere. **For
Hmong, this app IS the source.** A subscriber who finds `txiv` glossed as *fruit*
on a family card does not file a bug — they conclude the app does not know the
language, cancel, and say so out loud in a small community. This is already
TODO's #1 release blocker; it is also the single biggest threat to renewal.

### 4. A reason to open it tomorrow

Subscriptions die in week three. Streaks, the SRS queue and a due count already
exist — everything a daily reminder needs, with no content work. Notifications
are the highest-leverage item already on the list.

### 5. Listening — the missing modality, nearly free

⚠️ **There is a dead audio button in every quiz.** `getQuizDataset()` carries an
`audio` field on every vocab and path row (`src/data/quizzes.js`), but
`buildQuestions()` drops it — the question it returns is
`{ type, prompt, answer, options }` — and `MultipleChoice` renders
`<AudioButton audioSrc={null} …>` (`QuizEngine.jsx:467`). `AudioButton` derives
`enabled` from `resolveAudioSrc(audioSrc)`, so with `null` it is **always
disabled**. The same drop loses `blurb`, which is why the tone quiz never shows
its transcript line.

Passing `audio` through makes the button work, and a listen-and-choose question
type is then nearly free — **from the 211 clips already recorded, not from clips
still to be made.** Reading and speaking are covered; listening is the gap.

### 6. Delete what cheapens it

A subscriber inspects an app harder than a free user does. Today they would find:

- **100 invented leaderboard rivals** with names and point totals, presented as
  this week's standings (`src/data/leaderboard.js` says placeholder; nothing in
  the UI does). Fabricated social proof is a store-review risk as well as a trust
  one.
- **A 50-tier season pass** whose rewards — themes, badges, content, coupons from
  `PLACEHOLDER_BRANDS` — do not exist.
- **A second price** competing with the one they just paid.

Visible scaffolding in the free parts tells people the paid parts are scaffolding
too.

### 7. Two features that read as "worth paying" on sight

- **Offline audio.** Download a lesson's clips. Cheap, immediately legible as a
  paid feature, genuinely useful — people practise on transit.
- **Server-verified Pro.** `profiles.is_pro` is CLIENT-REPORTED (already in
  TODO). While it is, the subscription is honour-system. Not optional once money
  is involved.

---

## On the price

$7.99/mo is a Duolingo-tier price for a catalogue that is not finished. Two
things make it defensible, and both are reversible:

- **Charge annually.** $39–49/year converts better for a small library than
  $7.99/mo, and it buys twelve months to fill it instead of thirty days to
  justify it.
- **Consider launching at $4.99/mo** and raising it when the voice library and
  the reviewed dictionary land. Existing subscribers keep the old price — a
  loyalty story rather than a discount.

⚠️ The price lives in the store and RevenueCat dashboards, **not in this repo** —
changing it is not a code change, and grepping for it will find nothing.

---

## If only three things get done

1. Finish the voice feedback loop for the six lessons that have audio (§2)
2. Review the dictionary (§3)
3. Turn on notifications (§4)

That is a product someone renews. Everything else here is support for those.

---

## Related

- `notes/TODO.md` — "Blocking the Play production release", the unreviewed-gloss
  count, and the paused-recording decision this note answers
- `notes/2026-09-12-release-gating-and-monetization-on.md` — where the current
  gating came from
- `learning/feature-logic/quiz-engine-explained.md` — §5's audio drop, in context
- `src/lib/quotaLimits.js` — the daily numbers, and why they are flat
