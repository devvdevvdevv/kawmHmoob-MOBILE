# Learning: voice recording + pronunciation scoring in RN

This is the hardest of the three because the web version leans on the **Web Audio
API** (`getUserMedia`, `MediaRecorder`, `decodeAudioData`, `AnalyserNode`) — **none
of which exist in React Native.** The good news: the actual *scoring math* is pure
JavaScript and ports as-is. The work is replacing the "get audio into numbers"
layer.

Current state: `src/components/speak/PronounceStep.jsx` is an honest stub ("listen
and repeat, recording coming soon"). This lesson is how to make it real.

---

## 1. The pipeline, and what's portable vs not

Web flow (`usePronunciation` + `pronounceScore.scoreTake`):
```
mic → MediaRecorder → Blob
Blob → decodeAudioData → PCM samples (Float32 + sampleRate)   ← audioSamples.js
PCM  → YIN pitch detection → F0 contour [{t, f0}]             ← yin.js       (PORTABLE)
contour(user) vs contour(reference) → score                  ← toneScore.js (PORTABLE)
reference contour: pre-extracted contours.json, else decode mp3 live
```

| Piece | Web file | RN status |
|---|---|---|
| Record mic | `usePronunciation.js` | **rewrite** with expo-audio |
| Blob/mp3 → PCM samples | `audioSamples.js` (`decodeAudioData`) | **rewrite** — no Web Audio; parse a WAV file instead |
| YIN pitch → contour | `yin.js` | **copy as-is** (pure JS) |
| Contour compare → score | `toneScore.js` | **copy as-is** (pure JS) |
| Orchestration | `pronounceScore.js` | **copy, swap the samples source** |
| Reference contours | `data/contours.js` + offline script | **pre-extract offline** (recommended) |
| Live level meter | `AnalyserNode` | use expo-audio recorder **metering** |

So: copy `yin.js` and `toneScore.js` into `src/lib/` untouched. The whole task is
the two "rewrite" rows plus wiring.

---

## 2. Recording with expo-audio (replaces `usePronunciation`)

expo-audio (already installed for playback) also records. Shape of the new hook:

```js
import { useAudioRecorder, AudioModule, RecordingPresets, setAudioModeAsync } from 'expo-audio'

// permissions (once):
const { granted } = await AudioModule.requestRecordingPermissionsAsync()
// iOS needs recording enabled in the audio session:
await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })

// a recorder configured for the format you need (see §3 — you want WAV/PCM):
const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
await recorder.prepareToRecordAsync()
recorder.record()
// ...later...
await recorder.stop()
const uri = recorder.uri          // file:// path to the recorded clip
```

- **Permissions**: add usage strings for the config plugin — iOS
  `NSMicrophoneUsageDescription`, Android `RECORD_AUDIO`. expo-audio's config plugin
  (already in `app.json` plugins) accepts a `microphonePermission` option; set the
  copy there.
- **State machine** — mirror the web hook's `status`: `idle | recording | denied |
  unsupported`. `denied` when permission is refused; you don't really have
  `unsupported` on native, but keep the shape so `PronounceStep` code barely changes.
- **Live meter**: enable metering on the recorder and poll its status
  (`recorder.getStatus()` / the metering value) on an interval while recording to
  drive the existing `LevelMeter` — that replaces the Web Audio `AnalyserNode`.
- **Native only**: this needs a **dev build** (mic + native module), not Expo Go —
  same as RevenueCat. Keep the stub as the fallback when recording isn't available.

---

## 3. The crux: getting PCM samples out of the recording

`yin.js` needs `{ samples: Float32Array, rate: number }`. On web that came from
`decodeAudioData`. In RN there's no decoder, so the trick is: **record in a format
you can parse by hand — uncompressed WAV (LINEAR PCM)** — then read the file bytes.

1. **Record as WAV/PCM.** Configure the recorder's output to linear PCM / `.wav`
   (iOS supports this directly; on Android you may need to pick a PCM-capable
   preset/encoder — test both platforms). Avoid m4a/aac: those are *compressed* and
   you'd be back to needing a decoder.
2. **Read the file** with `expo-file-system`:
   ```js
   import * as FileSystem from 'expo-file-system'
   const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
   const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0)) // or a base64→bytes util
   ```
3. **Parse the WAV** (this is the file that replaces `audioSamples.js`): read the
   44-byte header for `sampleRate` and `bitsPerSample`, then convert the PCM data
   chunk to `Float32Array` in `[-1, 1]`:
   ```js
   // 16-bit little-endian PCM → Float32 in [-1,1]
   const view = new DataView(bytes.buffer)
   const sampleRate = view.getUint32(24, true)
   const dataOffset = 44 // for a canonical PCM WAV; scan chunks if yours differs
   const n = (bytes.length - dataOffset) / 2
   const samples = new Float32Array(n)
   for (let i = 0; i < n; i++) samples[i] = view.getInt16(dataOffset + i*2, true) / 32768
   return { samples, rate: sampleRate }
   ```
   (Downsample to ~16 kHz before YIN if the rate is high — pitch detection doesn't
   need 44.1 kHz and it's cheaper.)

This `wavToSamples(uri)` is the ONLY genuinely new DSP-adjacent code. Once you have
it, `pronounceScore.scoreTake` becomes: `wavToSamples(uri)` → `extractContour` →
`toneScore` — identical to the web from there.

---

## 4. Reference contours: pre-extract OFFLINE (strongly recommended)

The web sometimes decodes the reference mp3 in the browser. **Don't try that in
RN** — decoding an mp3 in-app is harder than the recording problem. Instead do what
the web guide (`instructions/f0-and-tone-scoring.md`) recommends as the "right" path:

1. Write a **Node script** (ffmpeg to decode each reference mp3 → WAV/PCM, then run
   the SAME `yin.js` `extractContour`) that emits `src/data/contours.json`:
   `{ "/assets/audio/…/foo.mp3": [[t, f0], …], … }`.
2. Bundle `contours.json`. Port the web's `data/contours.js` `getContour(path)`
   lookup.
3. `scoreTake` resolves the reference from `contours.json` — instant, offline, no
   in-app decoding. (You already bundle every reference mp3; this just precomputes
   their pitch curves once.)

So reference pitch = **build-time**; only the *user's* take is analyzed at runtime.

---

## 5. Wire it into `PronounceStep`

Replace the stub body with:
- A **record button** (tap to start → `recording` state → tap to stop). Gate on the
  permission result; show a "mic access needed" message on `denied`.
- The **`LevelMeter`** fed by recorder metering while recording (port the web
  `components/speak/LevelMeter.jsx`).
- On stop → `scoreTake(uri, phrase.audio)` → render the score + the **`ToneCurve`**
  (port `components/speak/ToneCurve.jsx`; it draws ref vs user contour — do it in
  `react-native-svg`, which you already use).
- Keep **`onDone`** (mark practiced) as-is.

`ToneCurve` on web is SVG; the RN port is a near-direct translation to
`react-native-svg` `<Polyline>`s (ref curve + user curve), same as the icon ports
you've already done.

---

## 6. Honest scope + a staged plan

This is a multi-day feature, not an afternoon. Stage it so each step ships value:

1. **Record + playback only** — mic permission, record to WAV, play the take back.
   No scoring yet. (Already useful: hear yourself vs the native clip.)
2. **Copy the DSP** — `yin.js` + `toneScore.js` verbatim into `src/lib/`.
3. **`wavToSamples`** — the WAV parser from §3; unit-test it against a known clip.
4. **User contour + self-display** — show the user's own pitch curve (no reference).
5. **Offline reference contours** — the Node script + `contours.json`; now you can
   score user-vs-reference.
6. **Polish** — `LevelMeter`, `ToneCurve`, the BetaRibbon copy already on the Speak
   hub sets expectations honestly.

The two files that will fight you are **(a) getting cross-platform WAV/PCM recording
out of expo-audio**, and **(b)** the WAV parser edge cases (chunk ordering, bit
depth). Everything downstream is the web's proven, portable code.

---

## Files to copy vs write

- **Copy verbatim** from the web app: `src/lib/yin.js`, `src/lib/toneScore.js`,
  `src/data/contours.js` (the getContour lookup).
- **Write new**: `src/hooks/usePronunciation.js` (expo-audio), a `wavToSamples()`
  util (replaces `audioSamples.js`), an offline `scripts/extract-contours.js`, and
  the `PronounceStep` / `ToneCurve` / `LevelMeter` RN renders.
- **Adapt**: `src/lib/pronounceScore.js` — same logic, swap `blobToSamples` for
  `wavToSamples` and resolve references from bundled `contours.json`.
- Read the web's `instructions/f0-and-tone-scoring.md` first — it explains the
  scoring choices the DSP encodes.
