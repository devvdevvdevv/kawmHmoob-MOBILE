# Day summary: everything changed on 2026-09-30

A one-page map of the day the subscription went live and the audio stopped
sticking.

- **The incident, blow by blow:**
  [2026-09-30-internal-testing-bugs-subscription-and-audio.md](2026-09-30-internal-testing-bugs-subscription-and-audio.md)
- **The subscription runbook** (permanent, start here next time):
  [SUBSCRIPTION-SETUP.md](SUBSCRIPTION-SETUP.md)
- **The audio fix, in full:**
  [2026-09-30-audio-stuck-playback-fix.md](2026-09-30-audio-stuck-playback-fix.md)
- **Word rulings:**
  [2026-09-30-word-definition-rulings.md](2026-09-30-word-definition-rulings.md)
  · [2026-09-30-always-free-sets-and-tom-qab-split.md](2026-09-30-always-free-sets-and-tom-qab-split.md)
- **The previous day:** [2026-09-28-day-summary.md](2026-09-28-day-summary.md)

The day started with "purchases do nothing and audio dies" and ended with the
subscription verified end to end on a real device.

## Subscription — closed ✅

**Two root causes, both in the dashboard, neither of them in the code.**

1. **The entitlement had only TEST STORE products attached.** Real Play purchases
   mapped to no entitlement, so the app stayed Free while the money moved. Silent
   by construction: Play charged, RevenueCat recorded the subscription, and
   `entitlements.active` was empty — every layer did its job.
2. **`$rc_annual` pointed at the MONTHLY product.** The label comes from the
   package slot, the price from the product, so the paywall printed "Yearly ·
   $7.99" exactly as wired. A product in the wrong slot produces a confident,
   wrong pairing — never an error.

**Verified on device:** purchase, restore, two correctly-priced plans, account
binding, and cancel-keeps-access-to-period-end.

⚠️ **The account-binding test was nearly wrong.** A → B → back to A looks
*identical* under both transfer settings. Only "did B have Pro?" separates them.
B had none, so **Keep with original App User ID** is confirmed live and Pro is
account-bound.

### Code that came out of it

- `app/subscription.jsx` **(new)** — status screen: which account holds Pro
  (first on the page), plan, Active/Cancelled/Payment-problem with dates, trial
  and sandbox badges, manage-in-Play, refresh on focus, restore.
- `purchase()` and `restore()` now **return whether Pro was granted**. Neither
  threw on the failure that mattered, so the paywall had been celebrating
  silence.
- Account-collision errors named properly; `lastProAccount` lets a failed
  restore say *which* account holds Pro.
- `PURCHASE_INVALID_ERROR` corrected — it is a **config error, not a declined
  card**, and the old message sent people to check a card that was fine.
- `configure()` moved to module scope; the binding effect waits for auth and
  guards against a stale `logIn` overwriting a fresh purchase.

## Audio — fixed, NOT yet verified on device ⚠️

**One missing exit explained all of it.** `playing` was cleared only by
`didJustFinish`, an event that does not fire when playback never starts. On
Android, recording through `@siteed/audio-studio` and playing through
`expo-audio` left the session in recording mode with nothing handing it back, so
`play()` returned silently, `didJustFinish` never came, and every later clip died
too. Restart was the only recovery.

Watchdog + real toggle button + the Android `setAudioModeAsync` bracket + the iOS
`finally` + the stale-status guard + the recording ceiling routed through
`stop()`.

⚠️ **Verify in the order the doc gives.** Play a dozen quiz clips *without*
recording first — that is what separates the watchdog fix from the session fix.
Skip it and a pass tells you nothing about which one did the work.

## Words

Five rulings — `aws` concise and neutral, `tus` = people/animals/living things
(the `txoj` sense removed), `leej` people-only, `nim no` = right now, `tom qab`
**split into two entries** (time vs space) following the `rau` pattern rather
than a `senses[]` list.

**Eleven sets made always free** by name. ⚠️ That list is **not derivable from
path order** — regenerating `vocabAccess.js` from `order` would silently re-lock
all twelve ids.

## Also

`/dev` got a real safe-area top inset — it sits outside the design system, so
nothing was handling the status bar.

## Still open

- **License testing** — add tester Google accounts in Play Console, and check
  whether real money was charged earlier. Unconfirmed.
- **One production build** carries every code change above. **None of it has
  reached a device yet.**
- **The path units** — ten units (orders 13–41) teaching the now-free word sets
  are still Pro. Needs a ruling; the position rule cannot express that list.
- **Deferred by choice:** classifiers in the noun quizzes ([TODO.md](TODO.md)),
  the shared audio player, the `AppState` listener, and the server-side
  entitlement webhook.

## The two lessons worth keeping

> **A wrong price or a wrong plan list is always a dashboard bug, never a code
> bug** — the price and the plan list both come from the store, and the label and
> the price come from *different* places, so they can disagree without erroring.

> **Any asynchronous operation whose only completion signal is a callback needs a
> timeout, or it has no completion signal at all.** `playToEnd` knew this; the
> three hooks did not, and the cost was one bug wearing three disguises.

And a third, smaller one, from the "payment declined" misdiagnosis:
**a user-facing message is a translation, not a replacement — keep the original
code somewhere.**

## Branding — two names, stated 2026-09-30

The author: *"KawmHmoob is the official name, but KawmHmong is used so users know
it's obviously for Hmong."* **Neither is a rename of the other** — the
2026-09-29 note that the app had been renamed to KawmHmong was too simple.

- **KawmHmoob** — official, RPA, the way the language spells itself. Also every
  id in the codebase.
- **KawmHmong** — user-facing, so an English reader sees which language it
  teaches at a glance.

Current release: **KawmHmoob 1.0**.

Applied in the two places where the app names itself formally:
- `app/about.jsx` — a "KawmHmoob 1.0" eyebrow and a paragraph explaining the
  pair, so nobody normalises one into the other later;
- `app/settings.jsx` — a version stamp reading `KawmHmoob {version}`.

⚠️ **The version is read from `Constants.expoConfig.version`, never typed.** A
hardcoded "1.0" is true for exactly one release and then quietly lies — and a
version stamp that lies is worse than none, because it is the first thing a bug
report quotes.

⚠️ Still never rename: the entitlement id `KawmHmoob Pro`, `com.kawmhmoob.app`,
the scheme, or the `kawmhmoob:*` storage keys. Renaming the entitlement alone
revokes Pro for every existing subscriber.

### Drawer logo sizing

Icon **40 → 56px**, wordmark **150 → 170px** (`DrawerHost.jsx`), gap 2 → 3.

The icon grew ~40% and the wordmark ~13%, deliberately unequal. The mark is the
elephant foot (ko taw ntxhw) and at 40px beside a 150px wordmark it read as a
bullet point — the eye went straight past it to the text. Scaling both equally
would have preserved exactly that, so the ratio moved from 1:3.75 to 1:3.

The wordmark derives its height from its width via the SVG viewBox, so only
`width` needs changing.

## Purchase celebration now says "You're on Pro"

The Pro purchase fired the shared celebration overlay, which congratulated the
buyer with **"Lesson complete!"** — the one line of that modal a caller could not
override. `body` and `cta` already took overrides; the heading was hardcoded.

`CelebrationOverlay` now reads `celebration.heading || 'Lesson complete!'`, and
the paywall passes `heading: 'You’re on Pro!'` — exclamation included, matching the
energy of the 🎉 and the confetti it sits under.

**The default is unchanged**, so the two lesson callers
(`learn/[unitId]/[lessonId]`, `reading/story/[storyId]/quiz`) keep the copy they
had — both pass only `(title, onDone)` and were checked.

⚠️ Deliberately NOT a second overlay component. A bespoke success modal for
purchases would be a second celebration surface to keep in step, and the two
would drift. One overlay, three optional overrides: `heading`, `body`, `cta`.
