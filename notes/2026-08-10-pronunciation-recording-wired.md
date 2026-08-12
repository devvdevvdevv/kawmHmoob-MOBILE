# Pronunciation recording wired + audio-quality fix (2026-08-10)

Box 1 of the pronunciation pipeline is wired into the app: record your voice, play
it back against the native clip. Built from
`learning/pronunciation/voice-record-step-lesson.md` (§7–§9).

Boxes 2 (parse WAV → samples) and 3 (pitch track + tone score) are still unbuilt.

---

## The three boxes, and why Box 1 ships alone

```
Box 1  record a real WAV        ← wired now
Box 2  parse WAV → raw samples  ← next
Box 3  pitch track + score      ← after that
```

"Hear yourself vs a native speaker" is a real feature on its own — no scoring
needed. So Box 1 ships value immediately AND de-risks the rest, because everything
downstream depends on the recording format being parseable.

---

## 🔴 The audio quality bug (the main lesson here)

First recordings sounded **terrible**. Two separate causes, both in
[src/lib/recordingOptions.js](../src/lib/recordingOptions.js):

### 1. `sampleRate: 16000`

Chosen for the MATH, not for ears. Sample rate caps the highest frequency you can
capture at **half** its value — so 16000 means nothing above 8 kHz survives. Vowels
are fine (voices live at 80–400 Hz), but **consonants live up above**: `s`, `sh`,
`f`, `t` go dull and lispy. Sounds underwater.

**→ Now `44100`.** Costs ~2.75x file size. Costs pitch detection **nothing** —
more samples is strictly more information. The lag scan just covers a wider range,
and it can decimate by 3 in one line if it ever needs the speed.

### 2. Android's `outputFormat: 'default'`

The nastier one. Android's default MediaRecorder encoder has historically been
**AMR-NB** — an 8 kHz narrowband codec built for 2G phone calls. `'default'`
doesn't mean "sensible," it means "whatever this OEM picked in 2011." Walkie-talkie
audio.

**→ Now explicit `mpeg4` + `aac`** at 128 kbps, with an honest `.m4a` extension.

### ⚖️ The tension worth remembering

Two goals pull opposite ways:

| Goal | Wants |
|---|---|
| "Hear yourself" (shipping now) | good-sounding audio |
| Pitch detection (not built) | raw PCM, doesn't care how it sounds |

**Optimized for EARS**, because that's the half users experience today, and higher
quality costs the pitch math nothing. The original 16000 was a premature
optimization for code that doesn't exist yet.

---

## ⚠️ Open decision: the Android WAV experiment got pre-conceded

Setting Android to `mpeg4`/`aac` explicitly means Android **definitely** won't
produce a WAV. The lesson said it *probably* couldn't; this makes it certain.

Reasoning: MediaRecorder can't emit raw PCM regardless, so the `AudioRecord` +
hand-written-44-byte-header route was needed either way — and meanwhile
`'default'` was actively degrading the shipping feature.

**If the fact is wanted for the record:** flip the android block back to
`'default'`/`'default'` for ONE spike run, log the header, set it back. Five
minutes to own the fact instead of inheriting it from a doc.

---

## What changed

### `src/hooks/usePronounciation.js` → [usePronunciation.js](../src/hooks/usePronunciation.js)

Renamed (the old filename had an extra `o`; the lesson and every doc spell it
correctly). Nothing imported it yet, so it was free. Also gained playback:

- **`playTake()` deliberately does NOT use `useAudio()`.** That hook runs sources
  through `resolveAudioSrc()`, which is built for bundled `/assets/audio/…` paths.
  Hand it `file:///…/recording.wav` and it prepends `/assets/audio/`, misses
  AUDIO_MAP, and returns **null** — a silent no-op with no error. A local recording
  is already playable; it goes straight to `createAudioPlayer({ uri })`.
- **iOS earpiece trap:** `start()` sets `allowsRecording: true`, and leaving it set
  routes playback to the quiet EARPIECE — playback sounds broken/inaudible.
  `stop()` now flips it back to `false`.
- `start()` clears the previous `uri` so a stale take can't be played back as if it
  were the new one.

### [src/components/speak/PronounceStep.jsx](../src/components/speak/PronounceStep.jsx)

Replaced the "recording is coming" placeholder with a real **Your turn** panel: one
status-driven button (Record → Stop recording → Record again), the `denied`
message, and a **Play my take** button that only appears once a take exists and
never mid-recording. Props unchanged.

### [app/spike.jsx](../app/spike.jsx) — throwaway, DELETE when it passes

The §8 spike as an Expo Router route (`/spike`) — file-based routing means the file
IS the route, and deleting it deletes the route. Records 2s, reads the header,
logs the verdict.

Three bugs fixed from the first pass, all worth recognizing again:

1. `spikeWAVTest` vs `spikeWavTest` — and because `onPress={...}` is evaluated
   *during render*, the ReferenceError crashed the screen before any tap.
2. A `recorder` **parameter** on the handler — RN's `Button` calls `onPress(event)`,
   so the press event shadowed the real recorder. Use the closure instead.
3. `Uint8Array.from((atob(b64), (c) => charCodeAt(0)))` — both args wrapped in ONE
   paren makes it the **comma operator**: it discards `atob(b64)` and passes the
   arrow function as the source. Since a function's `.length` is its parameter
   count, you silently get a **1-byte array**. Correct form is two arguments:
   `Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))`.

---

## The WAV header (why those offsets)

The spike's magic numbers are offsets into a fixed 44-byte layout:

| Bytes | Meaning |
|---|---|
| 0–3 | `"RIFF"` — container magic |
| 8–11 | `"WAVE"` |
| 20–21 | audio format (1 = uncompressed PCM) |
| 24–27 | **sample rate** |
| 34–35 | bits per sample |
| 44+ | the actual samples |

`getUint32(24, true)` — the `true` is **little-endian**, and it must match
`linearPCMIsBigEndian: false`. Read it the wrong way and you get a
plausible-looking wrong number with no error.

**Those four iOS `linearPCM*` fields ARE the parsing instructions**, decided in
advance: 16-bit + not-float + little-endian is exactly
`dataView.getInt16(offset, true)`. Change one and the reader must change with it.

---

## How to test

Recording quality changes are **pure JS — no rebuild.** Just reload Metro.

For the spike: needs the dev build (real mic + filesystem), **not web** — in a
browser expo-audio falls back to MediaRecorder and hands you webm/opus, ignoring
the options entirely. You'd learn a fact about Chrome instead of about the phone.

Reaching the route: **Settings → 🛠️ Open dev tools → 🎙️ WAV spike** (requires
logging in with an admin email — see
[2026-08-10-dev-tools-route-and-admin-gate](2026-08-10-dev-tools-route-and-admin-gate.md)).
`/_sitemap` and `kawmhmoob://spike` still work as fallbacks.

### Toolchain state on this machine (2026-08-10)

| | |
|---|---|
| `eas-cli` 20.5.1 | ✅ installed |
| git repo | ✅ in `kawmHmoob-MOBILE/` |
| Android SDK | ❌ `ANDROID_HOME` unset |
| JDK | ⚠️ **25** — Gradle for RN 0.81 wants **17** |

So `npx expo run:android` is blocked on two counts (and JDK 25 fails Gradle
confusingly). Use EAS:

```bash
eas build --profile development --platform android
npx expo start --dev-client     # NOT plain `expo start` — that targets Expo Go
```

Windows means **iOS needs a physical iPhone** + EAS build; no simulator without a
Mac. Fine, because **Android is the coin flip** — iOS supports linear PCM and will
almost certainly pass. Test the risky platform first.

### Pass / fail

Results render **on screen** (and still log to console):

```
✅ REAL WAV
riff (bytes 0-3)   ✓ "RIFF"      ❌ "ftyp" = MP4 container (expected: Android)
wave (bytes 8-11)  ✓ "WAVE"
sample rate        ✓ 44100
bits/sample        ✓ 16
file size          ✓ 172 KB
```

The size check matters independently: 2s at 44100 × 2 bytes ≈ **176 KB**. A file
can carry a perfect WAV header and still be far too small to be raw audio — the
header can be right and the file still be wrong.

---

## Still TODO

- **Run the spike** on both platforms. Nothing above proves the format yet —
  recording/playback work regardless of container, so the app ships either way, but
  Boxes 2–3 depend entirely on the answer.
- Box 2: parse WAV → `{ samples, rate }`.
- Box 3: pitch tracker (YIN / autocorrelation) + tone-contour scoring.
- Android raw PCM via `AudioRecord` + hand-written header, if/when Box 2 needs it.
- Delete `app/spike.jsx` once it has served its purpose.
- Quota: quizzes/pronunciation still unwired — see
  [2026-08-06-daily-quota-and-signifier](2026-08-06-daily-quota-and-signifier.md).

Related: `learning/pronunciation/voice-record-step-lesson.md`,
[2026-08-04-eas-development-build-setup](2026-08-04-eas-development-build-setup.md).
