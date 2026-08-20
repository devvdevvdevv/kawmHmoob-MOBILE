# @siteed/audio-studio breaks the Android release build (Kotlin Promise reject) — unused, drop for v1 (2026-08-13)

## Issue
EAS **Android release build fails during `:siteed-audio-studio:compileReleaseKotlin`.**

## Root cause
`@siteed/audio-studio`'s Android library (**v0.1.0**) has outdated Kotlin that implements
Promise **`reject` with the old signature**. Current **expo-modules-core** requires:

```kotlin
reject(code: String, message: String?, cause: Throwable?)
// or
reject(exception: CodedException)
```

The library's anonymous `Promise` implementations no longer match, so the Kotlin
compile throws **dozens of "does not implement abstract member" / "overrides nothing"**
errors → the module (and the whole app) never compiles → **no AAB.**

## Background (why the package is here)
Switched from **expo-audio → @siteed/audio-studio** because expo-audio could not properly
record **WAV** files on Android (WAV/PCM is needed for pitch/DSP tone scoring in Speak).
siteed fixed WAV support **but is incompatible with the current Expo SDK / expo-modules-core.**

## Why the "3.2.0 pin" did NOT fix it
- We first tried pinning npm `^3.2.1 → 3.2.0`. The **Android code is v0.1.0 either way**,
  so the Kotlin failure persists — the npm version isn't the lever.
- `npx expo-doctor` reported **18/18 pass** — a **false comfort**: doctor validates JS
  config/versions, it does **not** compile native Kotlin. JS green ≠ native build green.

## Key discovery — the package is UNUSED in our source
- **No `.js/.jsx` file imports `@siteed/audio-studio`.** It's only referenced in
  `app.json` (plugin) and `package.json` (dependency).
- The only recording code uses **expo-audio**: `useAudioRecorder` in
  `app/spike.jsx` and `src/hooks/usePronunciation.js`.
- So siteed currently adds **only broken native code** to the build, with **zero
  functional use** in the app today. Speak is also gated off (`SPEAK_ENABLED = false`).

## Resolution for v1 → REMOVE it
Because nothing imports it and Speak is off, the clean fix that unblocks the AAB:
1. `npm uninstall @siteed/audio-studio` (drops it from package.json + lockfile).
2. Remove `"@siteed/audio-studio"` from `app.json` → `plugins`.
3. Rebuild — `:siteed-audio-studio:compileReleaseKotlin` no longer exists, so the
   release build compiles and produces an AAB. Metro is unaffected (no imports to break).

## Library status / when Speak is built
`@siteed/audio-studio` is **effectively broken on modern Expo** — needs one of:
- an **upstream update** (check for a version whose Android code targets the new
  expo-modules-core Promise API), or
- a **`patch-package` patch** rewriting its Kotlin `reject(...)` calls to the new
  signature (`reject(code, message, cause)` / `reject(CodedException)`), or
- a **replacement** WAV/PCM recorder, or re-testing whether **expo-audio** now records
  proper WAV on the current SDK (it's already what our code uses).
Decide this in the **Speak phase**, not for the free v1.

Related: [2026-08-06-v1-launch-flags-speak-locked-monetization-off] (SPEAK_ENABLED),
[2026-08-12-revenuecat-prod-key-wired-monetization-still-off] (other launch plumbing).

---

## ⚠️ RE-CHECK 2026-08-20 — the diagnosis above may be STALE

Inspected the code actually sitting in `node_modules` today. **The Kotlin
signature mismatch this note blames is not present.**

```
node_modules/@siteed/audio-studio  npm 3.2.0
expo-modules-core                  3.0.30

expo Promise interface requires exactly two abstract members:
    fun resolve(value: Any?)
    fun reject(code: String, message: String?, cause: Throwable?)

In the installed library source:
    object : Promise      18
    override fun resolve  18     ← correct signature
    override fun reject   18     ← correct 3-arg signature
    old 2-arg reject       0
```

All 18 anonymous implementations satisfy the interface.

**On "the Android code is v0.1.0 either way":** `android/build.gradle` does still
say `version = '0.1.0'`, but that is an internal version string nobody bumped —
it is NOT evidence the Kotlin is old. The source content is what matters, and it
matches the current API.

### Confidence

Source was READ, not COMPILED. Kotlin has failure modes a grep cannot see, and
unrelated errors may exist. The claim is narrow: **the specific diagnosed cause is
gone.** Whether the build is green is unknown.

### Action — verify BEFORE executing the removal

Run an EAS Android release build with the package still installed.

- **Compiles** → KEEP it. This library records real WAV/PCM on Android, which is
  exactly the Box 1 blocker in
  [[2026-08-18-pronunciation-pipeline-implemented]]. Tone scoring would then work
  on the primary platform instead of returning `unsupported-format`.
- **Still fails** → capture the CURRENT error, then remove with real information
  rather than a stale diagnosis.

⚠️ Until that build runs, the package is still in `app.json` → `plugins`, so the
Android release build is still presumed broken. The v1 decision is unchanged and
unexecuted — this note only questions its premise.
