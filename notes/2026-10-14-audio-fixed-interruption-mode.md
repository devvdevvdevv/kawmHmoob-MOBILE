# The audio actually plays — what fixed it, and how it was found (2026-10-14)

The "audio works for a while, then dies until restart" bug, chased from
2026-09-30 to today and **confirmed working on a device**: the author played
through the tones and the consonants with no failure.

⚠️ **WHICH SINGLE CHANGE FIXED IT IS NOT PROVEN.** Five changes landed over three
days and the device was only tested at the end. The evidence points hard at §1,
and §6 says how to prove it in two minutes if it ever matters.

Previous note, superseded in its conclusions but not its findings:
`notes/2026-10-09-audio-one-speaker-fix.md`.

---

## 0. The plain-English version (read this first)

**The phone has one speaker, and Android makes an app ask before using it.**
Think of one microphone at a school assembly: you can talk all you like, but if
nobody hands you the mic, the room hears nothing.

**The app never asked.** For a while it got away with it — the mic happened to be
pointed its way — then it wasn't, and the app kept talking into the air. It
genuinely believed it was playing. It even reported `playing: true`. Silence.

**Then the first fix made it worse.** I taught it to ask, but to ask for the mic
EXCLUSIVELY: "everyone else be quiet." Android said no. So instead of sometimes
getting sound, it got none at all, every time — the version that was completely
dead.

**The fix was asking politely.** It now says "I'll play alongside whatever else is
going on", and Android allows it. A one-second consonant does not need to silence
the whole phone.

Two smaller things on top:

- It was building a **brand-new speaker connection for every single word**. The
  phone only has so many and they are not freed as fast as you would think, so
  after about forty words there were none left and nothing played until a
  restart. Now there is ONE, reused.
- If a clip does fail, it now **repairs itself** on the next press. Before, one
  failure poisoned everything after it until the app restarted.

**Why it took three days:** the audio library never says "that failed". There is
no error to catch — it reports `playing: true` and stays silent. The bug was
simple; SEEING it was the hard part, which is what the whole log in §5 is for.

---

## 1. ⚠️ THE LIKELY CAUSE: a required field we never passed

`setAudioModeAsync()` takes an `AudioMode`, and **`interruptionMode` is a
required field of it**. Not one of the app's seven calls passed it. From
expo-audio's own type docs:

- `'mixWithOthers'` — *"On Android, this means **no audio focus is requested**."*
- `'doNotMix'` — requests **exclusive** focus; other apps pause.
- `'duckOthers'` — focus with ducking.
- and separately: **`playsInSilentMode` and `allowsRecording` are `@platform ios`.**

So on Android every mode call the app made set two iOS-only flags and left focus
unspecified.

### The trap I walked into

On 2026-10-14 I "fixed" that by passing `interruptionMode: 'doNotMix'`
everywhere — and **audio stopped working entirely, from the first press.** The
reasoning was sound and the result was worse, because `'doNotMix'` REQUESTS
EXCLUSIVE FOCUS, and a request the system denies leaves nothing to play into.

The device log is what showed it:

```
status#1 c playing=false loaded=false t=0.00 dur=0.00 buffering=true  state=buffering
status#3 c playing=true  loaded=true  t=0.00 dur=1.92 buffering=false state=ready
⏱ duration watchdog — c it SAID playing but never finished
   | final: t=0.00 dur=1.92 playing=false buffering=false state=idle mute=false
```

⚠️ **`state=ready` → `state=idle` with the clock never leaving 0.00.** That final
snapshot is read BEFORE we pause the player, so ExoPlayer went to `idle` on its
own — which it does on an unrecoverable error, most often a failure to open the
audio output. Exactly what a denied focus request looks like.

### The fix

ONE constant, `PLAYBACK_INTERRUPTION_MODE` in `src/lib/audioOwner.js`, set to
**`'mixWithOthers'`** — the configuration under which audio demonstrably worked
for dozens of clips, and what the docs recommend for "sound effects, UI feedback,
or short audio clips", which is what a one-second consonant is.

Both playback callers read it (`app/_layout.jsx` at startup, `useAudio`'s session
re-assert), and the recorders' RESTORE paths restore to it. Their record-mode
calls keep `'doNotMix'` deliberately: another app bleeding into a take is worse
than another app being interrupted.

## 2. One player, reused — no native churn

`useAudio` created and removed a native player per clip. `remove()` returning
does not promise the AudioTrack and codec behind it are freed, and Android's
output tracks are a finite pool.

Now: ONE player for the app's lifetime; each clip calls `player.replace(source)`,
then `seekTo(0)` — without the seek, replaying the same clip starts at the end
and finishes instantly, a silent bug of its own. `stats.created` should read **1**
after a hundred presses, with `reused` carrying the count.

⚠️ **With an escape hatch**, because reuse introduces a new risk: a player that
has stopped rendering would poison every press after it. A watchdog failure sets
`playerBroken`, `release()` tears that player down, and the next press builds a
fresh one. Reuse normally, hard reset after a failure.

## 3. Recovery instead of a restart

- The session re-assert ran **only** from the 15-second ceiling watchdog, and
  every real failure lands in the DURATION watchdog instead. So nothing ever
  repaired the session — which is why one failure meant every press afterwards
  failed too, until the app restarted.
- Now: either watchdog marks the session dirty and re-asserts, **and the next
  press re-establishes the session before creating a player** (`play()` became
  async for this; no caller awaits it).

## 4. The two earlier fixes that were real but not sufficient

From `notes/2026-10-09-audio-one-speaker-fix.md`, kept here because they are
still load-bearing:

- **No audio session at startup** (2026-10-07). Only the recorders ever called
  `setAudioModeAsync`, so until a learner visited Speak the session was at the OS
  default. ⚠️ On Android this mattered less than it looked, because the flags
  being set were iOS-only — see §1.
- **A recording that failed to START** left the session in capture mode for the
  rest of the process; the 09-30 pass only covered a failed STOP.
- **Per-button players and four unaware playback owners** — the shared player and
  the speaker claim (`claimPlayback`) stand, and the device log confirmed them:
  `c` and `r` stayed level across 50 presses, so nothing leaks in JS.

## 5. The diagnostics that made it findable

⚠️ **expo-audio has no error event.** `AudioStatus` carries `playing`,
`isLoaded`, `duration`, `currentTime`, `isBuffering`, `playbackState`,
`didJustFinish`, `mute` — and nothing for "this failed". A player that cannot
render reports `playing: true` and stays silent. Everything below exists because
of that one absence.

| what was added | what it settled |
|---|---|
| `c=` / `r=` / `wd=` counters | no leak — killed the pool-exhaustion theory |
| `reason=` on every release | `finish` vs `replaced` vs `watchdog` vs `stop` |
| `status#N playing= loaded= t= dur=` | the clip loads and claims to play, clock frozen |
| `buffering= state= mute=` | `ready → idle`, the error signature in §1 |
| `final:` snapshot at the watchdog | the player's own last word, read before we touch it |
| `asset uri` (dev only) | a dev build streams clips from Metro over HTTP, not from the APK |

⚠️ **The asset URI is worth remembering**:
`http://192.168.12.22:8081/assets/?unstable_path=…/single-consonant-c.mp3?platform=android&hash=…`
— note the TWO `?`, a malformed query. The clip still loaded, so it is not the
cause, but it is a real oddity in how dev assets are addressed.

`AUDIO_DEBUG` in `useAudio.js` defaults to `__DEV__`; set it to `true` to keep
the log in an internal-testing build. The `⏱` and `play failed` warnings print in
every build.

## 6. ⚠️ How to prove §1, if it ever matters

Flip `PLAYBACK_INTERRUPTION_MODE` to `'doNotMix'`, restart, press one clip.

- Silence with `state=ready → idle` → the focus request is the cause, confirmed.
- Still plays → the cause was §2 or §3 and this note's §1 is overstated.

Worth doing once while the memory is fresh, because the answer changes what to
suspect next time.

## 7. Does it work offline? Yes — checked, not assumed

The author's question after it started working, and the answer matters because
the dev log shows clips arriving over HTTP.

**Audio is fully offline.** Every clip is reached by a **static `require()`** in
`src/lib/audioMap.js` (371 of them), and Metro packages anything behind a literal
require into the app binary. The `http://192.168.x.x:8081/...` URI in the dev log
is Metro serving assets over the network **while connected to it**; the same
require resolves to a local file in a standalone build.

Two things confirm nothing silently needs a server:

- **`EXPO_PUBLIC_AUDIO_BASE_URL` is unset**, so `resolveAudioSrc`'s remote branch
  is dead code in these builds. An unbundled clip returns `null` and the button
  renders DISABLED rather than attempting a fetch.
- The 2026-10-08 audit: **322 distinct clips referenced, 322 bundled, 0
  unresolvable.**

No `assetBundlePatterns` in app.json, which is correct — the default bundles
whatever `require` reaches, and `.mp3` is a default Metro asset extension.

⚠️ **WHAT IS NOT OFFLINE, so a tester report is not a surprise:** Pro status
(RevenueCat verification), remote Supabase stories, the leaderboard, auth, and
progress sync. The one with teeth is **Pro** — see the new TODO item.

## Changed files

- `src/lib/audioOwner.js` — `PLAYBACK_INTERRUPTION_MODE`, the one place
- `app/_layout.jsx` — startup session, reads the constant
- `src/hooks/useAudio.js` — one reused player, `replace()` + `seekTo(0)`,
  module-scope status listener, session recovery, the whole diagnostic log
- `src/hooks/usePcmRecorder.js`, `src/hooks/usePronunciation.js` —
  `interruptionMode` on every call; restores use the shared constant; the
  failed-start restore from 10-07

Lint clean; `check-undefined-refs` clean across 286 files.

## Still open

- **Which change did it** (§6).
- **The log is still verbose.** It was written to catch a bug that is now
  believed fixed. Once a week of use passes without a failure, the `status#N`
  lines and the `asset uri` line can go; keep the counters, the `reason=`, and
  the two `⏱` warnings.
- **`app/spike.jsx` still calls `setAudioModeAsync({ allowsRecording: … })`**
  with no `interruptionMode`. It is a dev spike and unreachable in release, but
  it is now the only caller that does not follow the rule.
