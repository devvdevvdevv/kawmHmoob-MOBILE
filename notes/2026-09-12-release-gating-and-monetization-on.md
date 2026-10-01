# Release gating: unfinished lessons hidden, monetization ON (2026-09-12)

The first Play release. Two changes that decide what a stranger sees.

## 1. Unrecorded lessons are hidden from everyone but admins

Fifteen of the 21 lessons are skeletons with no audio. A lesson with no clips
**cannot be practised** — nothing to imitate, nothing for the scorer to compare a
take against — so showing it advertises a room with no floor.

```
LEARNER SEES          ADMIN SEES
cat-greetings  3      all 7 categories
cat-price      3      21 lessons, 15 marked "not recorded"
```

⚠️ **`ready` is DERIVED FROM THE AUDIO, not a flag.** `lessonIsReady()` checks
that every non-intro step has an `audio` path. A hand-set `ready: true` is one
more thing to forget; this way, wiring the last clip publishes the lesson and
there is no second step to miss.

Four surfaces needed it, and the fourth is the one that would have leaked:

| surface | what it does now |
|---|---|
| Conversations tab | `visibleSpeakCategories({ includeUnready: admin })` |
| category screen | `categoryLessons(id, { includeUnready: admin })` |
| **the lesson route** | **guard** — deep links get "Not ready yet" |
| Home's TodayCard | never suggests an unready lesson |

⚠️ **The route guard is the enforcement; the lists are a suggestion.** Hiding a
lesson from two menus does nothing about a bookmark, a deep link, or a "next
lesson" push. Same lesson as `/dev` and the quiz study-gate.

⚠️ **`getNextLesson()` now skips unready lessons.** It feeds the lesson-complete
modal, which pushes straight into whatever it returns — without the filter,
finishing the last recorded lesson dropped the learner into a silent one, which
is the worst possible moment to do that.

⚠️ **`categoryLessons()` defaults to ready-only**, so `categoryProgress` counts
what the learner can actually see. A category reading "0/5" when two are
invisible is a lie about how much is left.

### The admin view says which are silent

With unrecorded lessons visible, an admin cannot otherwise tell a finished
category from one that only looks finished — the exact confusion that gets a
silent lesson shipped. Each category card now carries
`⚠️ N lessons not recorded — hidden from learners`.

## 2. `MONETIZATION_ENABLED = true`

Freemium, greetings free. What the switch actually does, in one place:

- `isPro` stops being hardcoded `true` and starts coming from RevenueCat. **Every
  lock in the app derives from it.**
- the daily quota ladder activates — 2 a day for everything except vocabulary
  (3), Pro unlimited. See section 3.
- paywall and upgrade UI appear.

**Free, and derived rather than listed:** any speak category with `free: true`
minus any lesson that opts out with `pro: true` (so: Greetings and Farewells —
Thanks & Sorry is now paid), the tones group, the Learn module, and any reading
genre with `free: true` ('life'). Everything else needs Pro.

### ⚠️ Three ways this fails silently, in severity order

1. **The entitlement string must match EXACTLY.** The app checks
   `info.entitlements.active["KawmHmoob Pro"]`. If the RevenueCat dashboard
   spells it differently — a space, a case, a typo — **the purchase succeeds and
   the user stays locked out.** Money moves, access does not. Nothing in the app
   can detect this; only a test purchase can.
2. **An empty offering is a dead end.** With no active offering, the paywall
   renders "No plans available right now." on a locked app — nowhere to pay.
3. **iOS is not ready.** `EXPO_PUBLIC_RC_API_KEY_IOS` is unset; only the Android
   `goog_` key is configured (eas.json, production profile). This flag is safe
   for Play and **not** safe for an App Store build.

**To reverse:** set it to `false`. Everyone becomes Pro again, every wall
disappears, no migration and nothing to undo on the app side.


## 3. The free tier: two a day, everywhere

```
speak             2/day        quiz              2/day
reading           2/day        sentence builder  2/day
search-hear       2/day        vocabulary        3/day   ← the one exception
```

⚠️ **The guest→account ladder is now FLAT, and that is a real trade.** It used to
climb — guest 1, free 3, Pro unlimited — so the guest number sold registration
and the free number sold Pro. One number does both jobs now, which means
**signing up no longer buys a bigger allowance**; the only thing still selling it
is progress that survives a reinstall. If sign-ups fall, `QUOTA_LIMITS` is the
first place to look.

⚠️ **Vocabulary gets 3, and it is counted per CATEGORY, not per word.** Browsing
is not an exercise — it is where somebody looks something up mid-lesson. Two
lookups a day would make the rest of the app harder to use rather than making Pro
more attractive. And per-word would be unusable: open a word, go back to check
the one above it, and two thirds of the day is gone. Re-opening something you
already read costing another view is the kind of rule people uninstall over.

### A trial cap was built, then reverted the same day

`useTrialCap` — a once-ever counter, `{ count }` with no date — is written,
commented out of `quotaLimits.js`, and left in the tree. The argument for it
stands: with six lessons and ten stories, a daily allowance is functionally
unlimited, because a patient free user finishes the app in a fortnight and never
meets a reason to pay.

It was reverted because **a daily allowance is the gentler thing to launch with,
and it can be tightened later without taking something back from anyone.** The
restore instructions are in the file.

## 4. An attempt is spent when you START, not when you pass

The reading module's comprehension quiz **had no limit at all** until today. It
is not built on `QuizEngine` — it is the reading module's own state machine — so
it quietly sat outside the quota every other quiz obeys, with an "Again" button
offering unlimited retakes.

Unlimited retakes are also the one place where guessing beats reading: five
questions, four options each, falls to brute force in a handful of runs.

⚠️ **Spending the attempt on COMPLETION would make failure free** — quit at
question four, start again, and the counter never moves. Spending it at `start()`
means a wrong answer costs exactly what a right one does, which is what makes the
questions worth reading the story for.

⚠️ **Retakes are not blocked, they are PRICED.** "Again" comes back through
`start()` and spends the next attempt; when there are none left the button is
gone and the wall renders instead. A button that opens a wall is worse than a
button that is not there.

⚠️ **The wall only renders when `status === 'idle'`.** The attempt is spent at
start, so without that condition a run would hit the wall the instant it began —
throwing the learner out of the quiz they just paid for.

The lesson copy changed with it: "You can take it again as many times as you
like" became "an attempt counts whether you pass or not, so read first."

## 5. The limit arrives where the question was asked

A Learn lesson links straight out to a quiz or a speaking module. Following a
dead link used to dump the learner on a different screen wearing a wall, with the
lesson behind a back button — the app answering "no" in a different room from the
one where you asked.

`GatedLink` replaces `<Link>` at those three exits. It reads the destination's
allowance and either routes or opens `LimitModal` in place.

⚠️ **It owns its own quota and modal state.** Those links live three levels down
inside step components; threading a flag from the screen would mean touching
every step type. Self-contained is what makes each call site one line.

⚠️ **It does not CONSUME anything** — the destination spends the allowance when
the work starts. A link that charged you for pressing it would bill people for
changing their mind.

⚠️ **`LimitModal` is not an RN `<Modal>`**, for the two reasons this app has
already been bitten by: a Modal's buttons render under the system nav bar on this
build, and themed NativeWind classes resolve to **transparent** inside one.
Absolute-fill overlay, colours resolved from `THEME_TOKENS` by hand.

## 6. The 572

The home card offered "572 due — start" on a fresh account. Two bugs in one call:

```js
selectDueWords(allWords, vocabSchedule).length        // was
selectSession(allWords, vocabSchedule).queue.length   // now
```

1. **`selectDueWords` counts a word with NO schedule as due** (`!sched || …`), so
   every word nobody had ever studied was "due for review" — the opposite of true.
2. **It is uncapped**, while the session the button actually starts is capped at
   `SESSION_LIMIT` (25). The number promised a session the app would never run.

`app/review.jsx` had the identical bug and was building a 576-card deck showing
"1 of 576". Both now read the queue the learner is about to see.

## 7. The paywall

Rebuilt as a sales page: a five-line feature list with icons, the plan, then what
stays free said out loud — a paywall that pretends the free tier is worthless is
arguing with the person still using it.

⚠️ **The feature list renders before and regardless of the store.** It used to sit
in the same branch as the plans, so a failed offerings fetch left a paywall with a
retry button and no reason to press it: the one screen whose whole job is to
explain something, explaining nothing.

⚠️ **Every line of `PRO_FEATURES` is a promise the app keeps TODAY.** Listing the
roadmap is how a paywall becomes a complaint.

⚠️ **The price is never hardcoded.** `pkg.product.priceString` comes from the
store, localised, and correct the day it changes. **$7.99/month** at launch (down
from $12.99) lives in Play Console and RevenueCat.

**Lifetime is commented out** — monthly only at launch. The branch is kept
because the distinction matters: a lifetime package is a one-time non-consumable
and must not say "auto-renews", which is wording store review rejects for.

## 8. The wall itself

`QuotaWall` is **centred** now — `minHeight` plus `justify-center`, not
`flex-1`, because it renders inside TabScreen's ScrollView where a `flex-1` child
collapses to its content height unless the container sets `flexGrow`. A measured
minHeight needs nothing from the parent.

It also takes `kind="trial"` for a non-resetting cap, unused today but wired: on
a trial the guest CTA ("create an account for more") promises something that does
not happen, because trial numbers are identical for guests and accounts.

## 9. Buying Pro requires an account — and that is a technical fact, not a policy

`SubscriptionContext` calls `Purchases.logIn(user.id)` for a signed-in user and
`Purchases.logOut()` for a guest. So **a purchase made as a guest binds to an
anonymous RevenueCat id that lives on the device.** Reinstall, or sign in later,
and the entitlement belongs to somebody who no longer exists — while the progress
it was bought to unlock was never syncing either, because a guest's progress is
local too.

The paywall now shows guests a sign-up card instead of the plan list: *"Pro is
tied to your account, not to this phone."* `onBuy` re-checks it as well, because
the list not being rendered is not the same as the purchase being impossible.

## 10. A successful purchase gets the confetti

`celebrate('Kawm Hmoob Pro', …)` — the overlay the app already uses for finishing
a lesson, rendered at the ROOT so the confetti covers the floating header and tab
bar rather than being clipped inside a screen's column.

⚠️ **`celebrate()` gained an optional third argument instead of getting a second
overlay.** "You've successfully completed Kawm Hmoob Pro" is the wrong sentence
for a purchase, but a bespoke success modal would be a second celebration surface
to keep in step — and the two would drift the first time one was restyled. The
body and button label are now overridable; every existing caller passes two
arguments and gets exactly the copy it always got.

⚠️ **It fires on `purchase()` resolving, which a cancellation does not do** —
`purchase` swallows `userCancelled` without throwing, so backing out of the Play
sheet cannot trigger a celebration for a purchase that never happened.

## 11. Every wall is centred now, and one rule covers all three

`QuotaWall` (daily limit), `PaywallGate`'s `UpgradeCard` (Pro content — what
Thanks & Sorry shows a free user), and `LimitModal` (the in-lesson interruption)
all sit in the middle of the viewport rather than at the top of a scroll column.

For somebody who is not a subscriber, **the wall IS the screen**. Pinned to the
top with a screenful of empty cream underneath, it reads as something that failed
to load rather than an answer.

⚠️ **`minHeight`, NEVER `flex-1`, and this is the part worth remembering.** All
of these render inside TabScreen's `ScrollView`. A `flex-1` child of a scroll
view **collapses to its content height** unless the container also sets
`flexGrow: 1` — so the obvious fix silently does nothing, and making it work
would mean changing every screen that can show a wall. A measured
`Math.max(320, height * 0.62)` asks nothing of the parent and behaves the same
everywhere.

`LimitModal` is the exception that proves it: it is an absolute-fill overlay, so
it centres with plain flexbox and needs none of this.

## 12. The tone curve's "you" line is white

Was `--c-clay-600`. Changed on request.

⚠️ **It is only legible on a dark theme, and that is not a bug in the change — it
is the surface.** The curve renders on `PronounceStep`'s result card, which is
`bg-cream-50`, and that token is `251 246 236` on light and `33 29 26` on dark.
White on the light theme is a white line on near-white paper: the take is still
plotted and nobody can see it.

Left as asked rather than quietly made theme-aware, because the fix is a design
decision with two answers, both a couple of lines:

- **give the plot area its own dark backdrop** — white becomes right in every
  theme, and the chart reads as an instrument rather than a line on paper;
- **make the colour token-driven** — white on dark, clay on light, at the cost of
  it not being white everywhere.

The reasoning sits in a comment at the colour so it does not get "fixed" by
accident.

## Also fixed: hooks below the guard

`app/(tabs)/speak.jsx` and `app/speak/category/[categoryId].jsx` both opened with
`if (!SPEAK_ENABLED) return …` **above** their hooks — a rules-of-hooks violation
that was harmless only because `SPEAK_ENABLED` is a module constant, so the
branch never varies within a process.

"Harmless because of a fact somewhere else" is a bug with a delay on it: the day
that flag becomes a remote config or a dev toggle, every hook below it binds to
the wrong slot. Both guards moved below the hooks; 12 lint errors went with them.

⚠️ **17 more of these remain** in other screens (`speak/group`, `speak/family`,
`learn/[unitId]`, `leaderboard`, `pass`, `spike`). Same pattern, same reason they
are currently harmless. Not touched before a release.

## ⚠️ NOT DONE, AND IT IS THE BIGGEST CONTENT RISK AT LAUNCH

**Nine of the ten reading stories are still placeholder Hmong, and they are
visible to everyone.** The gate built here is for Speak lessons only. Every
placeholder story carries `placeholder: true`, so the same treatment is a
one-line filter — but it takes the Reading module from ten stories to one, which
is a product decision rather than a cleanup.

It is the top item in notes/TODO.md under "Blocking the Play production release"
and flipping monetization on does not change that: a Pro subscriber now pays for
a library that is mostly unreviewed prose.

## Files touched

- `src/data/speakLessons.js` — `lessonIsReady`, `ready`, `visibleSpeakCategories`,
  `categoryLessons` option, `getNextLesson` skip
- `app/(tabs)/speak.jsx` — visible categories, admin badge, hook order
- `app/speak/category/[categoryId].jsx` — admin lessons, hook order
- `app/speak/lesson/[lessonId].jsx` — the route guard
- `src/components/home/TodayCard.jsx` — ready-only suggestions
- `src/lib/launch.js` — the flag, and what it means
- `src/lib/quotaLimits.js` — everything 2/day, vocabulary 3, TRIAL_LIMITS retired
- `src/hooks/useTrialCap.js` — written, unused, kept
- `src/components/common/QuotaWall.jsx` — centred, trial-aware
- `src/components/common/LimitModal.jsx`, `GatedLink.jsx` — new
- `app/learn/[unitId]/[lessonId].jsx` — three exits gated in place
- `app/reading/story/[storyId]/quiz.jsx` — the quiz that had no limit
- `app/vocabulary/[categoryId]/index.jsx` — 3 categories a day
- `app/paywall.jsx` — the sales page, account gate, purchase celebration
- `src/components/common/PaywallGate.jsx` — the upgrade card, centred
- `src/components/speak/ToneCurve.jsx` — the "you" line is white
- `src/context/CelebrationContext.jsx`, `CelebrationOverlay.jsx` — optional copy
- `src/components/home/TodayCard.jsx`, `app/review.jsx` — the 572

## Before the build goes out

- [ ] RevenueCat: entitlement **exactly** `KawmHmoob Pro`, offering **active**
- [ ] Play Console: subscription product active and attached to that offering
- [ ] A real test purchase with a Play licence tester — the only way to catch (1)
- [ ] "Restore purchases" works on a reinstall
- [ ] Build uses the **production** EAS profile (the `goog_` key), not the
      `test_` key in `.env`
- [ ] Decide on the placeholder stories above
