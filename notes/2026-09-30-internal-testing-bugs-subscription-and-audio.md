# Internal-testing build: subscription and audio bugs (2026-09-30)

Open bug log for the internal-testing build on Google Play. Written while
debugging — nothing here is fixed yet. Each issue: the **symptom** as reported,
**what the code actually does** (with file:line), the **ranked causes**, the
**cheapest way to tell them apart**, and a **fix sketch**.

No code has been changed. This is a map, not a changelog.

Two labels used throughout:
- **CONFIRMED IN CODE** — read in this repo, no device needed.
- **HYPOTHESIS** — consistent with the symptom, needs a dashboard or a log line
  to confirm or kill.

---

## READ THIS FIRST: which EAS profile built the APK under test?

This one check invalidates or confirms half of the subscription list, and it
costs nothing.

`eas.json` ships **three different RevenueCat keys**:

| profile | key | store |
|---|---|---|
| `development` | `test_XWqyPsYtMKWTNTJASczybazCmYg` | RevenueCat **Test Store** |
| `preview` | `test_XWqyPsYtMKWTNTJASczybazCmYg` | RevenueCat **Test Store** |
| `production` | `goog_ANDDkmuESGVnxUewkkZUBhsNnqV` | Google Play |

— [eas.json:13-38](../eas.json)

The Test Store is RevenueCat's own sandbox. **It never touches Google Play
Billing.** Products come from the RevenueCat dashboard, not Play Console;
"purchases" are simulated; there is no Play order and nothing for Play to
restore.

If the build handed to the testing group came from `development` or `preview`,
then:

- two plans priced identically is expected — they are whatever the Test Store
  offering says, and the Play base plans are irrelevant;
- Play Console's subscription setup is not being exercised at all;
- "Restore Purchases" has nothing on the Play account to find.

**Do this before debugging anything else.** Add a one-line startup log:

```js
console.log('[rc] key prefix', rcApiKey().slice(0, 5))
```

`test_` means Test Store. `goog_` means real Play Billing. Everything below
assumes a `goog_` build; record which one you were on when you re-test.

> Related: [SubscriptionContext.jsx:24-50](../src/context/SubscriptionContext.jsx)
> already documents the per-platform key split, and flags that
> `EXPO_PUBLIC_RC_API_KEY_IOS` is still unset — iOS is not ready regardless.

---

# A. Subscription

## A1. Monthly and Yearly show the same price ($7.99), no differentiation

**Symptom.** The paywall does not distinguish the two plans; the yearly plan is
also $7.99.

**What the code does — CONFIRMED IN CODE.** The paywall renders whatever the
store returns and nothing else:

- period label comes from `pkg.packageType` through `PERIOD_LABEL`
  — [paywall.jsx:24-32](../app/paywall.jsx), [paywall.jsx:548](../app/paywall.jsx)
- price is `pkg.product.priceString`, passed through verbatim
  — [paywall.jsx:549](../app/paywall.jsx)
- the list is `offerings.current.availablePackages` filtered to `SELLABLE_TYPES`
  — [paywall.jsx:272-279](../app/paywall.jsx)

There is no hardcoded price anywhere in the repo, and no per-period logic that
could collapse two plans into one. **The app is reporting what the store told
it.** So this is a configuration problem, not a code problem.

**Ranked causes.**

1. **You are on the Test Store** (see the section above). Test Store offerings
   are configured in RevenueCat and are easy to duplicate at one price.
2. **The annual base plan does not exist in Play Console.** You suspected this
   yourself, and it is the most likely cause on a `goog_` build. One product +
   one base plan = one package, and the offering has nothing annual to attach.
3. **Both RC packages point at the same Play product/base plan.** `$rc_monthly`
   and `$rc_annual` can both be wired to the monthly base plan by mistake — the
   offering then has two entries, two labels, and one price.
4. **An annual base plan exists but is priced 7.99.** Play Console prices base
   plans independently; a copied base plan keeps the source price.

**How to tell them apart.** Log the raw offering — this answers 1–4 in one shot:

```js
// paywall.jsx, inside load(), after `const current = offerings.current`
console.log('[rc] offering', current.identifier, current.availablePackages.map(p => ({
  pkg: p.identifier,
  type: p.packageType,
  product: p.product.identifier,     // same string twice = cause 3
  price: p.product.priceString,
  period: p.product.subscriptionPeriod,
})))
```

- one entry → cause 2
- two entries, same `product` → cause 3
- two entries, different `product`, same price → cause 4

**Fix sketch.** Play Console → the subscription product → **add an annual base
plan** (its own price, its own ID) → activate it. Then RevenueCat → the offering
→ attach it as the **Annual** package. No app change is needed; `PERIOD_LABEL`
already maps `ANNUAL` to 'Yearly' and `SELLABLE_TYPES` already includes it
([paywall.jsx:102](../app/paywall.jsx)). A new build is not required either —
offerings are fetched at runtime.

> The price lives in the store dashboards, not the repo, so changing it is a
> Play Console + RevenueCat action only.

---

## A2. Purchase succeeds but Pro never activates — the prime suspect

**Symptom.** The plan was purchased several times; the account never reflected
it.

**CONFIRMED IN CODE — and the comment on the line is the tell:**

```js
const PRO_ENTITLEMENT = "KawmHmoob Pro" // RC Dashbaord name
```
— [SubscriptionContext.jsx:143](../src/context/SubscriptionContext.jsx)

```js
function proFromInfo(info) {
  return Boolean(info?.entitlements?.active?.[PRO_ENTITLEMENT])
}
```
— [SubscriptionContext.jsx:153-155](../src/context/SubscriptionContext.jsx)

**`customerInfo.entitlements.active` is keyed by the entitlement IDENTIFIER, not
by its display name.** In the RevenueCat dashboard an entitlement has both: an
identifier (a slug — conventionally `pro`) and a display name (free text —
"KawmHmoob Pro"). The comment on line 143 says this string is the *dashboard
name*. If the identifier is anything other than the exact string
`KawmHmoob Pro` — including a case difference or the space — this lookup is
`undefined` on every call, forever.

The consequence is the exact reported symptom, and it is completely silent:

1. `purchasePackage` resolves successfully — the charge goes through;
2. `setRcPro(proFromInfo(customerInfo))` sets `rcPro` to **false**;
3. `isPro` stays false ([SubscriptionContext.jsx:254-260](../src/context/SubscriptionContext.jsx));
4. the paywall's success path still runs — `onBuy` awaits `purchase(pkg)`, it
   does not throw, so the **confetti celebration fires anyway**
   ([paywall.jsx:299-306](../app/paywall.jsx)) — the user is congratulated on a
   subscription they did not get;
5. buying again repeats the whole thing.

The repo already warns about this failure in prose:

> "⚠️ THE ENTITLEMENT STRING HAS TO MATCH EXACTLY. […] If the RevenueCat
> dashboard spells it differently — a space, a case, a typo — a user pays, the
> purchase succeeds, and they stay locked out. That failure is silent and it is
> the worst one on this list, because the money moves and the access does not."
> — [launch.js:30-34](../src/lib/launch.js)

**How to confirm — 30 seconds, no purchase needed.** Print the keys RevenueCat
is actually handing you:

```js
// SubscriptionContext.jsx, in the getCustomerInfo().then()
console.log('[rc] active entitlements', Object.keys(info.entitlements.active))
console.log('[rc] all entitlements',    Object.keys(info.entitlements.all))
console.log('[rc] looking for',         JSON.stringify(PRO_ENTITLEMENT))
```

If `all` is empty too, the purchase never reached RevenueCat (go to A5). If
`all` has a key and it is not the string on line 143, **this is the bug**.

**Fix sketch.** Replace the constant with the identifier copied out of the
RevenueCat dashboard. Then make the failure loud instead of silent:

```js
if (__DEV__ && info?.entitlements && !info.entitlements.all[PRO_ENTITLEMENT]) {
  console.warn('[rc] entitlement id not found:', PRO_ENTITLEMENT,
               '— dashboard has:', Object.keys(info.entitlements.all))
}
```

And gate the celebration on the entitlement rather than on the call resolving:
have `purchase()` return `proFromInfo(customerInfo)` and only `celebrate()` when
it is true; otherwise surface "the store took the payment but we could not
confirm your subscription — tap Restore".

---

## A3. A stale `logIn` can overwrite a fresh purchase

**HYPOTHESIS — mechanism confirmed in code, ordering not yet observed on device.**

`AuthContext.hydrateProfile` builds a **new user object on every call**
([AuthContext.jsx:47-48](../src/context/AuthContext.jsx)), and it is called from
`onAuthStateChange` ([AuthContext.jsx:62-66](../src/context/AuthContext.jsx)),
which Supabase fires on `INITIAL_SESSION`, `SIGNED_IN` **and every
`TOKEN_REFRESHED`**.

The account-binding effect in SubscriptionContext depends on `[user]`
([SubscriptionContext.jsx:109-135](../src/context/SubscriptionContext.jsx)), so
a new object identity re-runs it — each time calling `Purchases.logIn(user.id)`
and then `setRcPro(proFromInfo(customerInfo))`.

The guard is `active`, which is only cleared on **unmount**
([SubscriptionContext.jsx:134](../src/context/SubscriptionContext.jsx)) — it
does not protect against out-of-order resolution. So an in-flight `logIn` that
started before a purchase and resolves after it will write its stale
`customerInfo` over the fresh `rcPro = true`. Pro flickers on, then off.

There is a second window on every cold start. `user` is `guestUser` initially
([AuthContext.jsx:34](../src/context/AuthContext.jsx)), so the binding effect
takes the guest branch and calls `Purchases.logOut()`
([SubscriptionContext.jsx:122-126](../src/context/SubscriptionContext.jsx)),
which mints a **fresh anonymous App User ID** — before the session hydrates and
`logIn` puts the real one back. Every launch does an
identified → anonymous → identified round trip.

**How to confirm.** Log every binding transition and watch the ordering:

```js
console.log('[rc] bind', user?.id, user?.isGuest)
// and after each call:
console.log('[rc] bound →', await Purchases.getAppUserID())
```

**Fix sketch.**
- Depend on the identity that actually matters, not the object:
  `}, [user?.id, user?.isGuest])`
- Add a monotonic guard so a late response cannot win:
  ```js
  const bindSeq = useRef(0)
  const mySeq = ++bindSeq.current
  // …
  if (active && mySeq === bindSeq.current) setRcPro(proFromInfo(customerInfo))
  ```
- Skip the guest branch until auth has finished loading. `AuthContext` already
  exposes `loading` ([AuthContext.jsx:35](../src/context/AuthContext.jsx)) —
  waiting on it removes the logOut/logIn round trip entirely.

---

## A4. Pro does not survive logout / account switch

**Symptom.** Need to guarantee the plan sticks to a specific account across
logout, account switch, and switching back.

There are **three different identities** in play and they do not have to agree:

| identity | owns | changes when |
|---|---|---|
| Google account | the Play purchase | you switch accounts in the Play Store |
| RevenueCat App User ID | the entitlement | `logIn` / `logOut` |
| Supabase user id | app progress | you sign in/out in the app |

**HYPOTHESIS 1 — anonymous purchases never transfer.** If a purchase happens
while RevenueCat is anonymous — a guest, or inside the cold-start window in A3 —
it binds to that anonymous ID. RevenueCat's **default** transfer behaviour is
*"keep with the original App User ID"*, which means signing in afterwards does
**not** move the entitlement. The paywall already tries to prevent the guest
case by blocking purchase behind sign-up
([paywall.jsx:247](../app/paywall.jsx), [paywall.jsx:276-295](../app/paywall.jsx)),
but the A3 launch window is not covered by that.

→ Check **RevenueCat → Project Settings → Transfer purchases**. For an
account-bound subscription you want *"Transfer to the new App User ID"*.

**HYPOTHESIS 2 — Play binds to the Google account, not to yours.** The purchase
lives on the Google account signed into the Play Store on that device. Two app
accounts on one phone share one Play purchase; the same app account on a phone
with a different Google account has none. This is store behaviour, not a bug —
but it is a **product decision not yet made**: does Pro follow the KawmHmong
account, or the phone's Play account? Write the answer down, because the paywall
copy currently promises the former ("Pro is tied to your account, not to this
phone" — [paywall.jsx:280-282](../app/paywall.jsx)).

**Confirmed in code and fine:** `signOut` does set `guestUser`
([AuthContext.jsx:124-125](../src/context/AuthContext.jsx)), which drives the
binding effect's guest branch, and `logOut` is correctly only called when not
already anonymous ([SubscriptionContext.jsx:122](../src/context/SubscriptionContext.jsx))
— it throws otherwise.

**Test matrix to run once A2 is fixed** (each step: does the Pro UI show?)

1. Sign in as A → buy → Pro on?
2. Force-quit → relaunch → still Pro? *(catches A3)*
3. Sign out → guest → Pro **off**?
4. Sign in as B (same phone, same Google account) → Pro on or off? *(records
   your answer to Hypothesis 2 — decide which one is correct before running it)*
5. Sign out → back to A → Pro on?
6. Uninstall → reinstall → sign in as A → Pro on? *(the real test of account
   binding)*
7. A on a second device with a different Google account → Restore → Pro on?
   *(this is the one that fails if transfer behaviour is wrong)*

---

## A5. Restore Purchases does nothing

**CONFIRMED IN CODE — restore cannot report failure.**

```js
const restore = useCallback(async () => {
  if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')
  const info = await Purchases.restorePurchases()
  setRcPro(proFromInfo(info))
}, [])
```
— [SubscriptionContext.jsx:224-230](../src/context/SubscriptionContext.jsx)

`restorePurchases()` resolves successfully when it finds **nothing**. So the
only way `onRestore` shows an error is a thrown network failure
([paywall.jsx:321-334](../app/paywall.jsx)) — a restore that finds no
subscription, or finds one and fails the entitlement lookup, is
indistinguishable from a restore that worked. The spinner stops and the screen
does not change. That is precisely "isn't working".

**Ranked causes.**

1. **A2.** Same broken entitlement key — restore genuinely retrieves the
   purchase and `proFromInfo` still returns false. If A2 is the bug, this is the
   same bug wearing a different hat, and fixing A2 fixes both.
2. **Test Store build** — nothing on the Play account to restore.
3. **A4 / transfer behaviour** — the entitlement is on a different App User ID.
4. **The test subscription already expired.** Play's license-tester
   subscriptions run on an accelerated clock (a monthly sub can renew in minutes
   and auto-cancel after a handful of renewals). An expired sub restores as
   **inactive** — correctly. If you bought it a while ago it may simply be gone;
   re-buy immediately before testing restore.

**Fix sketch.** Make restore tell the truth. Have it return the boolean:

```js
const restore = useCallback(async () => {
  if (!rcApiKey()) throw new Error('Purchases are unavailable in this build.')
  const info = await Purchases.restorePurchases()
  const pro = proFromInfo(info)
  setRcPro(pro)
  return pro
}, [])
```

and in `onRestore`, when it comes back false, show "We could not find a
subscription on this store account" with the Google-account caveat — rather than
silently succeeding.

---

## A6. Latent: `Purchases.configure()` runs in an effect

**CONFIRMED IN CODE — not the reported bug, but it will bite.**

`Purchases.configure()` is called inside a `useEffect` in the provider
([SubscriptionContext.jsx:71-93](../src/context/SubscriptionContext.jsx)), while
`paywall.jsx` calls `Purchases.getOfferings()` in its own effect
([paywall.jsx:268-284](../app/paywall.jsx)).

React runs **child** effects before **parent** effects. The provider is an
ancestor of every route ([_layout.jsx:76](../app/_layout.jsx)), so on any mount
where the paywall is in the first committed tree — a deep link to `/paywall`, a
cold start restored onto that route — `getOfferings()` fires before `configure()`
and throws "there is no singleton instance". The user sees **"Could not load
plans."** and a Retry button that works on the second press.

**Fix sketch.** Configure at module scope in a file imported from
`app/_layout.jsx`, before any component renders — or expose an `rcReady` promise
from the provider that the paywall awaits.

---

# B. Audio

**Symptom.** During Speak tests and quizzes, playback breaks and never recovers.
The play button stays stuck in its playing state; only restarting the app fixes
it. Most common right after recording a take and trying to play it back.

The Android and iOS recording paths are **different libraries**
([useRecorder.js:42-47](../src/hooks/useRecorder.js)) — Android goes through
`@siteed/audio-studio`, iOS through `expo-audio` — so read B2 as the Android
explanation and B4 as the iOS one.

## B1. `playing` has exactly one exit, and it is not guaranteed to fire

**CONFIRMED IN CODE.** All three playback hooks clear their `playing` state from
one place only:

```js
player.addListener('playbackStatusUpdate', (status) => {
  if (status?.didJustFinish) setPlaying(null)
})
```
— [useAudio.js:43-45](../src/hooks/useAudio.js),
  [usePronunciation.js:151-153](../src/hooks/usePronunciation.js),
  [usePcmRecorder.js:179-181](../src/hooks/usePcmRecorder.js)

There is **no timeout, no error listener, and no AppState handling** (`grep
AppState` across `src/` and `app/` returns nothing). `try/catch` only covers the
synchronous `createAudioPlayer` + `play()` call — a player that is constructed
fine and then never produces sound throws nothing.

So every one of these leaves the button stuck forever:

- the clip never loads (bad URI, missing remote asset, no network);
- playback cannot start because another audio stack holds the session (**B2**);
- the app is backgrounded mid-clip and the player is torn down;
- a phone call, alarm or Bluetooth switch interrupts;
- the player is `remove()`d by the next `play()` before finishing — the removed
  player's listener never fires, and only the *new* one can clear the state.

**And the stuck button cannot be cleared by the user.** `AudioButton` renders
the stop glyph from that state — but pressing it calls `play()` again, not stop:

```js
onPress={(e) => { …; if (enabled) { play(audioSrc, wordId); onPlay?.() } }}
// …
{isPlaying ? '▮▮' : '♪'}
```
— [AudioButton.jsx:41-50](../src/components/common/AudioButton.jsx),
  [AudioButton.jsx:66-68](../src/components/common/AudioButton.jsx)

It **looks** like a stop button and behaves like a play button. There is no path
back except unmounting the screen.

**The asymmetry that gives away the fix:** `playToEnd` — the non-hook utility —
already solved this. It arms a 15-second timer and routes normal finish, timeout
and error through one `finish()`
([playToEnd.js:63-71](../src/lib/playToEnd.js),
[playToEnd.js:80](../src/lib/playToEnd.js),
[playToEnd.js:91-94](../src/lib/playToEnd.js)), and its own comments explain
why. The hooks never got the same treatment.

**Fix sketch (applies to all three hooks).**

1. Arm a watchdog alongside every `play()` and clear `playing` when it fires —
   the same shape as `playToEnd`'s `timeoutMs`. Prefer the clip's own duration
   plus a margin over a flat 15s.
2. Use the status to *tighten* the watchdog rather than to detect an error.
   `AudioStatus` has **no `error` field** — the usable fields are `playing`,
   `isLoaded`, `duration`, `currentTime`, `didJustFinish`
   ([Audio.types.d.ts:137-168](../node_modules/expo-audio/build/Audio.types.d.ts)).
   So: once `isLoaded && duration > 0`, re-arm the timer to the clip's real
   length; and if `playing` never becomes true within ~1.5s of `play()`, treat
   that as the stall in B2 and clear. There is no callback for "this failed" —
   absence of progress is the only signal available.
3. Clear `playing` inside `releasePlayer()` — right now removing a player leaves
   the state claiming it is still going.
4. Make `AudioButton` a real toggle: pressing it while `isPlaying` should stop
   and clear. Even if nothing else is fixed, this gives the user a way out that
   is not "restart the app".
5. Subscribe to `AppState` and clear on `background`.

## B2. Android: two native audio stacks, no session coordination — likely root cause

**CONFIRMED IN CODE; the audio-focus consequence is a HYPOTHESIS to verify on
device.**

On Android the app **records with one library and plays back with another**:

- record → `@siteed/audio-studio`'s `useAudioRecorder`
  ([usePcmRecorder.js:3](../src/hooks/usePcmRecorder.js),
  [usePcmRecorder.js:63](../src/hooks/usePcmRecorder.js))
- play → `expo-audio`'s `createAudioPlayer`
  ([usePcmRecorder.js:4](../src/hooks/usePcmRecorder.js),
  [usePcmRecorder.js:176](../src/hooks/usePcmRecorder.js))

And the decisive detail: **`usePcmRecorder` never calls `setAudioModeAsync` at
all.** The iOS hook does, on both sides of the recording
([usePronunciation.js:94](../src/hooks/usePronunciation.js),
[usePronunciation.js:122](../src/hooks/usePronunciation.js)). The Android hook
has no equivalent — nothing puts the shared session back into playback mode
after `AudioRecord` has had it.

If `@siteed`'s recorder does not fully release Android audio focus / the session
on stop, `expo-audio`'s player then cannot acquire it. On Android that failure
is **silent**: `createAudioPlayer` succeeds, `play()` returns, no exception, no
sound, and — because nothing ever plays — `didJustFinish` never fires. B1 then
converts that into a permanently stuck button, and every later clip is dead too
because the session is still wrong. **Only a process restart clears it.**

That chain matches the report line for line: Android, worst immediately after
recording, kills all subsequent playback, restart-only recovery.

**How to confirm.** Reproduce the stuck state, then with the device attached:

```
adb logcat -s AudioTrack AudioFlinger AudioManager ExoPlayerImpl AudioRecord
```

Look for `AUDIOFOCUS_LOSS` with no matching gain, or an `AudioTrack` that never
transitions to playing. Also check the `AudioManager` mode: if it is still
`MODE_IN_COMMUNICATION` after the recorder stopped, that is the smoking gun.

Second, cheaper test that isolates the recorder as the cause: on a fresh launch,
play a dozen clips in a quiz **without recording anything**. If playback never
sticks, the recorder is implicated; if it sticks anyway, B1 alone is enough to
explain it and this section is secondary.

**Fix sketch.**
- Mirror the iOS pattern: call `setAudioModeAsync({ allowsRecording: true })`
  before `startRecording` and
  `{ allowsRecording: false, playsInSilentMode: true }` after `stopRecording`,
  in a `finally`, in `usePcmRecorder` too.
- Insert a short settle delay between `stopRecording()` resolving and the first
  `createAudioPlayer` — the native recorder may release asynchronously.
- If focus is genuinely not being returned, that is an upstream
  `@siteed/audio-studio` issue. **Do not remove that dependency to work around
  it** — it is the only Android path that produces the PCM the tone scorer can
  read ([useRecorder.js:10-20](../src/hooks/useRecorder.js)).

## B3. Stuck players are never released, and they accumulate

**CONFIRMED IN CODE.** A player is only `remove()`d by the *next* `play()` on
the same hook instance, or on unmount
([useAudio.js:33-37](../src/hooks/useAudio.js),
[useAudio.js:16-23](../src/hooks/useAudio.js)). A player stuck per B1/B2 holds a
native decoder until one of those happens.

`useAudio()` is a **per-component** hook, not a shared singleton — every
`AudioButton` in a list owns its own player ref
([AudioButton.jsx:33](../src/components/common/AudioButton.jsx)), and
`LessonSteps` mounts several recorders and players at once
([LessonSteps.jsx:119-121](../src/components/speak/LessonSteps.jsx),
[LessonSteps.jsx:238](../src/components/speak/LessonSteps.jsx),
[LessonSteps.jsx:404-406](../src/components/speak/LessonSteps.jsx)). Nothing
coordinates them; two can play over each other, and each leak is independent.

Android's media codec pool is finite. Exhaust it and **all** audio in the
process dies until restart — which is the "audio does not come back" half of the
report, distinct from the stuck-button half.

**Fix sketch.** Either a single shared player owned by one provider, or a
module-level registry that force-releases any player idle beyond its clip
length. The shared provider also fixes the two-clips-at-once problem for free.

## B4. iOS: a failed `recorder.stop()` strands the session in recording mode

**CONFIRMED IN CODE.**

```js
const stop = async () => {
  clearTimer()
  try {
    await recorder.stop()
    setUri(recorder.uri)
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true })
  } catch (e) {
    console.warn('[record] stop failed', e)
  } finally {
    setStatus('idle')
  }
}
```
— [usePronunciation.js:113-128](../src/hooks/usePronunciation.js)

The restore on line 122 sits **inside the `try`, after** the call that can
throw. If `recorder.stop()` rejects, the session is never taken out of recording
mode — and the comment directly above that line states the consequence:

> "⚠️ iOS: leaving allowsRecording=true routes playback to the quiet EARPIECE,
> so 'Play my take' sounds broken/inaudible."

Permanently, for the rest of the process. The `finally` resets `status` to
`'idle'`, so the UI looks fine while every subsequent clip plays into the
earpiece.

**Fix sketch.** Move the `setAudioModeAsync` restore into the `finally`, wrapped
in its own try/catch. It must run whether or not the recorder stopped cleanly.

## B5. `usePcmRecorder.stop()` overwrites its own error status

**CONFIRMED IN CODE.**

```js
} catch (e) {
  setError(e?.message || String(e))
  setStatus('error')
  return null
} finally {
  if (status !== 'error') setStatus('idle')
}
```
— [usePcmRecorder.js:148-155](../src/hooks/usePcmRecorder.js)

`status` here is the value captured in the `useCallback` closure, not the value
just set — `setStatus` is async and the closure is stale. On the failure path
`status` is still `'recording'`, so the guard passes and the `'error'` set one
line earlier is immediately replaced with `'idle'`.

A failed stop therefore presents as a successful one with no take. Worth fixing
early because it is actively hiding B2 while you debug it.

**Fix sketch.** Use a local flag instead of reading state: `let failed = false`
in the try/catch, `if (!failed) setStatus('idle')` in the `finally`.

## B6. Android: hitting the 15s ceiling silently discards the take

**CONFIRMED IN CODE.** The auto-stop timer calls the underlying
`stopRecording()` directly, bypassing the hook's own `stop()`:

```js
timerRef.current = setTimeout(() => {
  stopRecording().catch(() => {})
  setStatus('idle')
}, MAX_RECORDING_MS)
```
— [usePcmRecorder.js:116-121](../src/hooks/usePcmRecorder.js)

So `setUri` / `setInfo` never run and the recording is lost with no message. The
iOS hook does this correctly, calling its own `stop()`
([usePronunciation.js:103-106](../src/hooks/usePronunciation.js)).

**Fix sketch.** Call the hook's `stop()` from the timer, as iOS does.

---

# Suggested order of work

**Subscription** — one dashboard check, then one string:

1. Confirm the build profile / key prefix (the READ THIS FIRST section). If it
   is `test_`, rebuild on `production` and re-run everything before reading on.
2. Log `Object.keys(info.entitlements.all)` and compare with
   [SubscriptionContext.jsx:143](../src/context/SubscriptionContext.jsx) —
   **A2**. This is the single most likely cause of both "does not activate" and
   "restore does not work", and it is a one-line fix.
3. Log the offering packages — **A1**. Create the annual base plan in Play
   Console and attach it in RevenueCat.
4. Check RevenueCat's transfer-purchases setting — **A4** — and decide the
   account-vs-Google-account policy before running the test matrix.
5. Make restore and purchase report failure honestly (**A5**, **A2** step 5) so
   the next round of testing produces information instead of silence.
6. Tidy **A3** (effect deps + sequence guard) and **A6** (configure at module
   scope).

**Audio** — instrument first, because B1 is currently hiding the real cause:

1. Land the B1 watchdog + failure-state listener + `AudioButton` toggle. This
   does not fix the underlying stall, but it stops it being permanent and makes
   every later test readable.
2. Fix **B5**, so a failed stop stops lying about it.
3. Run the isolation test in B2 (play many clips with no recording) to decide
   whether the recorder is implicated.
4. If it is: add the `setAudioModeAsync` bracket to `usePcmRecorder` and take
   the `adb logcat` reading — **B2**.
5. Fix **B4** (move the restore into `finally`) and **B6** (route the ceiling
   through `stop()`) — both are small and independent.
6. Consider the shared-player refactor — **B3** — once the rest is stable.

---

# UPDATE — dashboard check, same day

Findings from checking the RevenueCat and Play Console dashboards. **A2 is
dead.** Two new sections replace it, plus the build mechanics that turned out to
matter more than anything in part A.

## A2 is NOT the bug — the entitlement string is correct

**RESOLVED.** Checked in the RevenueCat dashboard: the entitlement's
**identifier** and its **display name** are both the literal string
`KawmHmoob Pro`. So
[SubscriptionContext.jsx:143](../src/context/SubscriptionContext.jsx) is right,
`proFromInfo` looks up the correct key, and the prime suspect is eliminated.

Keep the `__DEV__` warning from A2's fix sketch anyway — it costs nothing and it
is what would have answered this in thirty seconds instead of a day.

## A7. ROOT CAUSE — CONFIRMED AND FIXED: the entitlement had only TEST STORE products

**✅ THIS WAS IT.** Found by the author on 2026-09-30 after the checks below.

The `KawmHmoob Pro` entitlement had products attached — so it *looked* wired —
but they were the **Test Store's** `monthly` and `yearly`, created 2026-08-05
during early setup. **No Play Store product was attached at all.**

A RevenueCat project holds one app per store, Test Store included, and each app
has its own products with freely reusable names. The entitlement's product list
does not distinguish them except by a store column that is easy to read past.

That one fact explains all three reported symptoms at once:

| symptom | why |
|---|---|
| Purchase succeeds, account never reflects it | the Play product mapped to no entitlement, so `entitlements.active` stayed empty |
| Restore Purchases does nothing | it restored the same purchase, which still mapped to nothing |
| Monthly and yearly both $7.99 | the offering was listing the **Test Store** products, whose prices matched |

And it is silent by construction: Play charged correctly, RevenueCat recorded the
subscription, `proFromInfo` returned false correctly, and no layer had anything
to report.

**Fixed by attaching the Play Store products** — `kawmhmoob_pro:monthly`
(2026-09-29) and `kawmhmoob_pro:yearly` (2026-09-30). Retroactive, no rebuild.

The Test Store products were left attached deliberately: they are inert for a
`goog_` build and keep the `development` / `preview` profiles testable.

**The full setup and verification guide is now
[SUBSCRIPTION-SETUP.md](SUBSCRIPTION-SETUP.md) — §2 is this trap.**

### Also confirmed while checking

- **The entitlement identifier is `KawmHmoob Pro`**, matching its display name
  and matching
  [SubscriptionContext.jsx](../src/context/SubscriptionContext.jsx). The
  identifier was never the problem (A2 stays dead).
- **The purchases were real Play Store purchases**, not Test Store ones — which
  is what made the missing Play attachment fatal rather than merely untidy.

### Background — how the check was framed

**HYPOTHESIS — check this first.**

RevenueCat keeps two separate things about a customer and it is easy to read one
and think you have seen the other:

| | what it is | where it shows |
|---|---|---|
| **Subscription** | the product they bought | Customer view → *Subscriptions* |
| **Entitlement** | what that purchase *grants* | Customer view → *Entitlements* |

**The app only ever reads the second one.** `customerInfo.entitlements.active`
contains entitlements — it does not contain subscriptions. Nothing in the
RevenueCat API turns a purchase into an entitlement automatically; the link is a
row you create in the dashboard by attaching a product to an entitlement.

So this state is entirely possible, and matches the report exactly:

- the purchase went through;
- RevenueCat shows the subscription on the customer — *"I can see my test
  subscription"*;
- **no entitlement was granted**, because the Play product is not attached to
  `KawmHmoob Pro`;
- `entitlements.active` is `{}`, `proFromInfo` returns false, the app stays Free.

**Check:** RevenueCat → **Entitlements** → `KawmHmoob Pro` → the **Products**
list. If it is empty, or does not contain the Play base plan that was actually
purchased, that is the bug.

**Fix:** attach the product. It is **retroactive** — RevenueCat re-evaluates
existing customers, so the entitlement appears for purchases already made. **No
rebuild, no new AAB.** The app picks it up on the next `getCustomerInfo`, i.e.
the next launch.

⚠️ **Every base plan must be attached separately.** When the yearly base plan is
added (A8), it is a *different product* to RevenueCat and needs its own
attachment to the same entitlement. Miss that and yearly subscribers pay and get
nothing — the same silent failure, one product later.

## A8. Only a monthly plan exists in Play — add a BASE PLAN, not a new subscription

**CONFIRMED by the author, 2026-09-30:** Play Console shows one monthly option
and no yearly.

Play's subscription model has three levels, and picking the wrong one is the
usual mistake here:

```
Subscription            "KawmHmong Pro"        ← what the user subscribes to; ONE of these
  └─ Base plan          monthly · $7.99        ← the billing period + price
  └─ Base plan          yearly  · $XX.XX       ← ADD THIS ONE
       └─ Offer         7 days free            ← optional intro/trial on a base plan
```

**Do not create a second subscription.** A separate subscription product is a
separate thing to subscribe to — a user could hold both at once, upgrade/downgrade
between monthly and yearly stops working (Play only handles that *within* one
subscription), and the paywall would list two unrelated items.

**Steps.**

1. Play Console → Monetise → Subscriptions → open the existing **KawmHmong Pro**
   subscription → **Add base plan**.
2. Auto-renewing, billing period **Yearly**, its own base plan ID (e.g.
   `pro-yearly`), its own price.
3. **Activate it.** An inactive base plan is invisible to the Billing API and
   will simply not appear.
4. RevenueCat → Products → add the new product. Play exposes a base plan as
   `subscriptionId:basePlanId`, so it arrives as something like
   `pro:pro-yearly` — a *different product ID* from the monthly one.
5. RevenueCat → Entitlements → `KawmHmoob Pro` → **attach the new product**
   (see the warning in A7).
6. RevenueCat → Offerings → the current offering → **Add package** → `$rc_annual`
   → point it at the yearly product.

**No app change and no rebuild.** `PERIOD_LABEL` already maps `ANNUAL` to
'Yearly' ([paywall.jsx:24-32](../app/paywall.jsx)), `SELLABLE_TYPES` already
includes it ([paywall.jsx:102](../app/paywall.jsx)), and offerings are fetched at
runtime ([paywall.jsx:268-284](../app/paywall.jsx)). The second row appears on
the next launch.

## A9. Testers were probably charged real money — license testing is a separate list

**The author's assumption was that internal testers are not charged. That is not
what the internal testing track does.**

Two different lists, and being on one does not put you on the other:

| list | where | what it does |
|---|---|---|
| **Internal testing track** | Release → Testing → Internal testing | who may *install* the build |
| **License testing** | **Setup → License testing** | whose purchases are *test purchases* |

Only the second one makes purchases free. A tester on the internal track but
**not** on the license-testing list goes through the real Play purchase flow with
a real payment method and **is charged**.

**Actions.**
1. Play Console → **Setup → License testing** → add every tester email
   (the Google account signed in to Play on the device, which is not necessarily
   the KawmHmong account email).
2. Check for real charges: Google Play order history on the account, or Play
   Console → Orders. Refund any real purchase from there.
3. Re-test only after the account appears on the license-testing list.

Once an account is a licence tester, its subscriptions become test purchases:
**no charge**, and an accelerated clock — a monthly subscription renews every few
minutes and auto-cancels after roughly six renewals. That expiry is itself a
cause of "restore does not work" (see A5 cause 4): re-buy immediately before
testing restore rather than relying on yesterday's purchase.

## A10. Which build can actually do real billing — and the answer to "another EAS build?"

**CONFIRMED IN CODE — and this likely explains the whole of part A.**

The three profiles are not interchangeable, and *two of them cannot do real Play
billing at all*:

| profile | package name | RC key | real Play Billing? |
|---|---|---|---|
| `development` | **`com.kawmhmoob.app.dev`** | `test_…` | **No** — wrong package *and* Test Store |
| `preview` | `com.kawmhmoob.app` | `test_…` | **No** — right package, but RC Test Store |
| `production` | `com.kawmhmoob.app` | `goog_…` | **Yes** |

The package rename is in [app.config.js:33-44](../app.config.js): `APP_VARIANT
=development` rewrites `android.package` to `com.kawmhmoob.app.dev`, and only the
`development` profile sets that env ([eas.json:17](../eas.json)). Play Billing is
bound to the package name, so a dev build is a **different app** that Play has
never heard of.

**So: yes, a new build is required — but only for code changes and for the key.**

| change | new AAB? |
|---|---|
| Attach product to entitlement (A7) | **No** |
| Add the yearly base plan + offering (A8) | **No** |
| RevenueCat transfer-purchases setting (A4) | **No** |
| Add license testers (A9) | **No** |
| Any code fix in part A or B | **Yes** |
| Moving off a `test_`/dev build onto real billing | **Yes** — the key and the package are baked in at build time |

```
eas build  --profile production --platform android    # produces an AAB
eas submit --profile production --platform android    # uploads it to Play
```

`autoIncrement: true` on the production profile ([eas.json:32](../eas.json))
handles the version code.

⚠️ **The app must be installed FROM Play, not sideloaded.** Play Billing checks
that the installed app came from Play and is signed with the Play app-signing
key. Upload the AAB to the internal testing track and install through the
opt-in link — a locally-installed APK will not complete a real purchase.

⚠️ **`production` has never been built before this.** Note that the `goog_` key
has therefore never run on a device, and
`EXPO_PUBLIC_RC_API_KEY_IOS` is still unset ([eas.json:31-38](../eas.json)) — this
profile is Android-only until that is added.

## Revised order of work for part A

1. **RevenueCat → Entitlements → KawmHmoob Pro → Products.** Attach the Play
   product if it is not there — **A7**. Retroactive, no build.
2. **RevenueCat → the customer** — is the App User ID the Supabase UUID, or
   `$RCAnonymousID:…`? Anonymous means the purchase never bound to the account —
   **A3/A4**, and it needs the transfer-purchases setting plus the code fix.
3. **Also on that customer: which store?** "Play Store" vs "Test Store" tells you
   which build made the purchase, and therefore whether **A10** is the whole
   story.
4. Play Console → **Setup → License testing** — **A9**. Refund any real charge.
5. Play Console → add the **yearly base plan**, then wire it through RevenueCat —
   **A8**.
6. Land the code fixes (A2's `__DEV__` warning, A3, A5, A6) plus part B, then
   `eas build --profile production` and ship to internal testing.

---

# IMPLEMENTED — code fixes landed 2026-09-30

All the code-side fixes above are now in. **None of the dashboard work is done**
— A7 (attach product to entitlement), A8 (yearly base plan), A9 (license
testers) and A4's transfer setting are still open, and A7 remains the prime
suspect for the reported symptom.

`npx eslint` is clean on every file touched.

### Subscription

| file | change | issue |
|---|---|---|
| `src/context/SubscriptionContext.jsx` | `configure()` moved to a module-scope `ensureConfigured()`, idempotent, called at import | A6 |
| | `proFromInfo` warns in `__DEV__` when the entitlement is absent from `entitlements.all` | A2/A7 |
| | `purchase()` returns whether Pro was actually granted | A2 |
| | `restore()` returns whether anything was restored | A5 |
| | binding effect: waits for `authLoading`, depends on `rcUserId`/`rcIsGuest` primitives, `bindSeq` guard so only the newest bind may write | A3 |
| `app/paywall.jsx` | `onBuy` only celebrates when the entitlement arrived; otherwise shows "We could not confirm your subscription" | A2 |
| | `onRestore` reports "No subscription found" instead of silently succeeding | A5 |
| | two pre-existing `react/no-unescaped-entities` errors in `AlreadyPro` fixed (straight → curly apostrophes) | — |

The `[rc] key prefix` / `[rc] all entitlements` / `[rc] active` logs the author
added are **kept deliberately** and commented as such — they are the fastest
answer to "which store is this build talking to" and "did the entitlement
actually arrive".

### Audio

| file | change | issue |
|---|---|---|
| `src/hooks/useAudio.js` | one `clear()` reachable from finish / watchdog / replacement / unmount; watchdog armed before `play()` and re-armed to the clip's real duration once known; stale-player guard on the listener; exports `stop` | B1 |
| `src/components/common/AudioButton.jsx` | genuine toggle — pressing it while playing now stops instead of re-entering `play()` | B1 |
| `src/hooks/usePronunciation.js` | `releasePlayer` clears `playing` and the watchdog; `playTake` gets the same watchdog; **`setAudioModeAsync` restore moved into the `finally`**; exports `stopPlayback` | B1, B4 |
| `src/hooks/usePcmRecorder.js` | `setAudioModeAsync` bracket added around recording (it had none at all); restore runs in the `finally` with `shouldRouteThroughEarpiece: false`; recording ceiling routed through `stop()` via `stopRef`; `failed` local replaces the stale-closure `status` check; `playTake` watchdog; exports `stopPlayback` | B1, B2, B5, B6 |

⚠️ **A behavioural note for the speak screens.** Every `playTake` caller renders
its button as `disabled={playing}`
([LessonSteps.jsx:165](../src/components/speak/LessonSteps.jsx),
[LessonSteps.jsx:328](../src/components/speak/LessonSteps.jsx),
[LessonSteps.jsx:477](../src/components/speak/LessonSteps.jsx),
[PronounceStep.jsx:165](../src/components/speak/PronounceStep.jsx)). So on those
screens a stall did not show as a stuck stop button — it showed as a playback
button **disabled forever**, which is why it read as "audio never comes back".
The watchdog is what fixes those screens: it releases `playing` and the button
re-enables on its own. `stopPlayback` is exported for them but unused so far,
because a disabled button cannot be tapped to escape.

### Not done, deliberately

- **B3 (shared player / instance registry).** A real refactor — every
  `AudioButton` still owns its own player. The watchdog now releases stuck
  players, which removes the accumulation that made B3 urgent. Revisit if audio
  still dies process-wide after the rest is verified on device.
- **AppState handling.** Backgrounding mid-clip is now caught by the watchdog
  within a clip-length rather than never, so this is no longer a hang — just a
  short delay. Worth adding, not urgent.

### Verify on device, in this order

1. Quiz audio, no recording: play a dozen clips, confirm nothing sticks and the
   button toggles.
2. Record → play back → play a quiz clip (Android). This is the reported path
   and the B2 test.
3. Hit the 15s recording ceiling on Android — the take should now survive
   (B6 previously discarded it).
4. Purchase with the dashboard still mis-wired: confirm the paywall now says
   "We could not confirm your subscription" instead of firing confetti.
5. Restore with no subscription: confirm "No subscription found" appears.

---

# RESOLVED — end of day, 2026-09-30

Everything in part A is working. What follows is the closing record: the second
root cause, the account-binding decision, and the screens and code that came out
of it.

**The permanent how-to now lives in
[SUBSCRIPTION-SETUP.md](SUBSCRIPTION-SETUP.md).** This note is the incident; that
one is the runbook. Audio has its own write-up in
[2026-09-30-audio-stuck-playback-fix.md](2026-09-30-audio-stuck-playback-fix.md).

## A11. The SECOND root cause: the yearly package pointed at the monthly product

A7 (Test Store products on the entitlement) fixed purchasing and restoring. It
did **not** fix the paywall, which kept showing **Yearly · $7.99** after the
yearly base plan had been created and priced at **88** in Play Console.

Cause: the offering's **`$rc_annual` package still pointed at the MONTHLY
product**.

**Why that is invisible, and the general lesson:**

- the word on screen comes from `PERIOD_LABEL[pkg.packageType]` — **the package
  slot**
- the number beside it comes from `pkg.product.priceString` — **the product**

They are different sources, and nothing can check they describe the same billing
period. So the app printed "Yearly" from the slot and the monthly price from the
product, exactly as wired.

> **A product in the wrong slot produces a confident, wrong pairing — never an
> error.**

That is why it presented as a *pricing* bug when it was a *wiring* bug. Recorded
as rule 3 in [SUBSCRIPTION-SETUP.md §10](SUBSCRIPTION-SETUP.md).

**Fixed by repointing `$rc_annual` at `kawmhmoob_pro:yearly`.** No rebuild, no
reinstall — which also answered the "should I uninstall?" question: the diagnosis
order in §8b (check the dashboard value, then log what the store returned, and
only then suspect the device) reaches this in two steps without touching the
phone.

### The "not backwards compatible" warning — ignored, correctly

Selecting the Play product warns that it needs RevenueCat Android SDK v6+ and
offers a **fallback product for older SDKs**. Left blank.

```
react-native-purchases    10.7.0
purchases-hybrid-common   18.29.0   → native Android SDK v8.x
```

Far past v6, and nothing older has ever shipped. ⚠️ Setting a fallback "to be
safe" would be actively harmful here: picking the monthly product as the yearly
package's fallback — the obvious-looking option in that dropdown — re-creates
A11, but only for some clients.

## A12. Pro is now account-bound

**Decision: one subscription unlocks one KawmHmong account.**

The RevenueCat customer log was showing paired transfer events —

```
Got their purchases transferred to   d8245f67-…
Got their purchases transferred from d8245f67-…
```

— which is the signature of **"Transfer to the new App User ID"**, the opposite
of account-binding. **Switch to "Keep with original App User ID."**

Neither mode allows *stacking*: under transfer the entitlement moves rather than
copies, so two accounts can never hold Pro at once. The difference is whether it
is **pinned** to the buyer, and that is what was wanted.

Full reasoning, trade-offs and the Play "one subscription per Google account"
limit: [SUBSCRIPTION-SETUP.md §4b](SUBSCRIPTION-SETUP.md).

## Code landed after the first IMPLEMENTED block

| file | change |
|---|---|
| `app/subscription.jsx` **(new)** | subscription status screen — which account holds Pro (first on the page), plan, Active/Cancelled/Payment-problem with dates, trial and sandbox badges, manage-in-Play, refresh, restore |
| `src/components/account/ProfilePage.jsx` | "Manage subscription" links to `/subscription` instead of jumping straight out to Google Play |
| `src/context/SubscriptionContext.jsx` | exposes `entitlement`, `managementURL`, `refresh()`, `lastProAccount`; `PRO_ENTITLEMENT` + `proFromInfo` moved to **module scope**; all updates routed through one `applyInfo()` |
| `app/paywall.jsx` | `RECEIPT_ALREADY_IN_USE_ERROR` / `RECEIPT_IN_USE_BY_OTHER_SUBSCRIBER_ERROR` handled as "This subscription belongs to another account"; `describePurchaseError` takes `{ context: 'restore' }` so a failed restore stops promising "nothing was charged" |
| both screens | a failed restore can now **name the account that holds Pro** |

**Button hierarchy on `/subscription`.** Restore is `secondary` (solid stone-900)
and Refresh is `ghost` — they were the other way round at first. Restore is the
action that rescues someone who paid and is staring at "Free plan", the most
upset reader this screen will ever have; Refresh only re-checks something the
screen already polls on focus. Leaving Restore as the faintest control on the
page put the weakest emphasis on the most important button.

### Naming the owning account, and its honest limit

⚠️ **RevenueCat will not say whose subscription it is.**
`RECEIPT_ALREADY_IN_USE_ERROR` withholds the owning App User ID on purpose —
returning it would hand one user another user's identity to anyone who tapped
Restore. So this cannot come from the store.

Instead `KEY_LAST_PRO_ACCOUNT` records `{ id, name }` on the **device** whenever
a signed-in account genuinely holds Pro. A later restore that finds nothing, on a
device remembering a *different* account, says so by name.

Four constraints, each load-bearing:

- **device-scoped** (no userId suffix) — it must be readable by a different
  account than wrote it, or it cannot answer its own question;
- written from **`realPro`**, never `isPro` — `isPro` is true for everyone while
  `MONETIZATION_ENABLED` is false and absorbs the dev override, either of which
  would record a non-subscriber and then name them to the next person;
- **name only, never the email** — shown to a different account on a shared
  phone; a display name is already public on leaderboards, an email is not;
- **suppressed when it names the current user** — otherwise it implies their own
  subscription is somewhere unreachable.

Covers one person / one phone / two accounts. Does **not** cover another device
or a post-reinstall purchase — those fall back to the generic wording rather
than implying certainty.

## ✅ Verified end to end on device, 2026-09-30

| | result |
|---|---|
| Purchase | succeeds, entitlement arrives, Pro unlocks without a restart |
| Restore | returns Pro to the owning account |
| Monthly vs yearly | two plans, two prices, correct labels (after A11) |
| **Account binding** | A bought → **B had no Pro** → A still had it on return |
| Cancel in Play | access correctly continues to period end |

The account-binding line is the one that mattered and the one nearly missed:
**A → B → back to A looks identical under both transfer settings.** Only "did B
have Pro?" distinguishes them. B had none, so "Keep with original App User ID"
is confirmed live.

**Part A is closed.**

## Still open

- **License testing** (A9) — add tester Google accounts, refund any real charges.
- **One production build** carries every code change above plus the audio fixes:
  `eas build --profile production --platform android`.
- **Server-side entitlement** — gating still trusts the client; `profiles.is_pro`
  is a dashboard report that gating never reads. A RevenueCat webhook is the
  proper fix. Deliberately not built: the only cost today is a wrong number on
  one admin screen.

---

*Re-run `node scripts/build-notes-index.mjs` to pick this file up in the index.*
