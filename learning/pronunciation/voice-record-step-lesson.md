# Deep lesson: the RECORD step — mic → a .wav file (explanations + skeletons)

This is Box 1 of the pronunciation feature, on its own. **Point A:** the user taps a
mic button. **Point B:** you have a file on disk (`file://…/take.wav`) holding raw
audio the pitch code can later read. Nothing about pitch here — just *capturing sound
into a parseable file*. Get this rock-solid before anything else.

Each section gives you the **what**, the **why** (read this — it's the point), and a
**skeleton** with the key API calls and `// TODO` blanks you fill in.

> Version note: expo-audio's exact export names shift between releases. Open the
> **expo-audio docs for the version in your `package.json` (~1.1)** and confirm each
> name as you type it. Reading the versioned reference — not a blog, not this guide —
> IS the skill.

---

## 0. What "recording" even is (the concept)

A microphone turns air-pressure vibrations into a stream of numbers (**samples**),
thousands per second. "Recording" = the OS captures that stream and writes it to a
file. Your job is to (1) get permission, (2) start/stop the capture, and (3) make sure
it's written in a format you can read back as raw numbers (**uncompressed WAV**), not a
squished format (AAC/mp3) that would need a decoder.

That's the entire step: **permission → capture → an uncompressed file.**

---

## 1. What you build: `src/hooks/usePronunciation.js` (and why a hook)

Why a *hook* (not just code in the component)?
- Recording is **stateful**: are we allowed? are we recording right now? where's the
  finished file? That state has to live somewhere and update the UI.
- A hook **bundles that state + the actions** and hands the component a clean tool:
  ```js
  const { status, uri, start, stop } = usePronunciation()
  ```
  The component doesn't care HOW recording works — it just calls `start()`/`stop()` and
  reads `status`/`uri`. That's the whole point of a custom hook: hide the machinery,
  expose a simple contract.

Why `src/hooks/`? That's where your other hooks live (`useDailyQuota`, `useProgress`).
`PronounceStep` will import this one — keeping it beside the others makes it findable.

**Design the contract FIRST, before the internals.** You decide the public API, then
fill in the guts. That keeps the component simple no matter how messy the internals
get — a real engineering skill, not busywork.
- `status`: `'idle' | 'recording' | 'denied'`
- `uri`: the finished file path, or `null` until you've recorded
- `start()` / `stop()`

### Skeleton — the whole hook (you'll fill the blanks from later sections)
```js
// src/hooks/usePronunciation.js
import { useState } from 'react'
import { useAudioRecorder, AudioModule, setAudioModeAsync } from 'expo-audio'
import { WAV_OPTIONS } from '../lib/recordingOptions.js' // §7

export function usePronunciation() {
  const recorder = useAudioRecorder(WAV_OPTIONS)   // §6 — create the recorder
  const [status, setStatus] = useState('idle')     // §5 — the state machine
  const [uri, setUri] = useState(null)

  const start = async () => {
    try {
      // §3 permission → §4 audio session → §6 prepare + record
      // TODO (fill from §3, §4, §6)
    } catch (e) {
      console.warn('[record] start failed', e)
      setStatus('idle')                            // never strand the UI in "recording"
    }
  }

  const stop = async () => {
    try {
      // §6 stop + capture the uri
      // TODO
    } catch (e) {
      console.warn('[record] stop failed', e)
    } finally {
      setStatus('idle')
    }
  }

  return { status, uri, start, stop }
}
```

---

## 2. The tool: expo-audio (what it hands you)

You already have **expo-audio** (it does your playback). It also records. Use it, NOT
the old `expo-av` (deprecated/removed in SDK 54). The pieces you'll pull from it:
- `useAudioRecorder(options)` → a **recorder object** you drive.
- `AudioModule.requestRecordingPermissionsAsync()` → the permission prompt.
- `setAudioModeAsync({...})` → configure the audio session (iOS needs it).
- `RecordingPresets` → ready-made options (you'll customize these in §7).
- (optional) `useAudioRecorderState(recorder)` → reactive status (level meter, etc.).

---

## 3. Permission — the OS privacy gate (TWO parts, beginners do one)

Recording is privacy-sensitive, so the OS makes you do TWO separate things:

**(a) Ask at RUNTIME** — a popup the user taps "Allow" on. If not granted → `denied`
and a helpful message. Never assume yes.

**(b) Declare at BUILD TIME** — a usage string baked into the app. iOS requires an
`NSMicrophoneUsageDescription`; Apple *rejects* apps that request the mic with no
reason. Android needs the `RECORD_AUDIO` permission (already in your `app.json`).

**Why both?** (a) is the user's consent *this run*; (b) is the app *declaring up front*
what it will ask for. Miss (b) and your dev build may crash on the request, or the
store rejects you. After editing `app.json` you must **rebuild the dev client** —
permission changes are native, a JS reload won't pick them up.

### Skeleton — runtime (top of `start()`) + build-time (`app.json`)
```js
// top of start():
const perm = await AudioModule.requestRecordingPermissionsAsync()
if (!perm.granted) { setStatus('denied'); return }   // bail early
```
```jsonc
// app.json → expo.plugins → the expo-audio entry (add the option object):
[
  "expo-audio",
  { "microphonePermission": "Kawm Hmoob uses your mic to score your pronunciation." }
]
// (expo.android.permissions already lists RECORD_AUDIO)
```

---

## 4. The audio session — iOS's extra hoop

Before recording on **iOS**, set the audio mode:
```js
await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })
```
**Why:** iOS routes audio through "sessions" that have a category. By default the app
sits in a *playback* category that won't let it record; you have to explicitly flip
`allowsRecording`. `playsInSilentMode` lets your playback work even with the ringer
switch off. Android doesn't need this — but calling it is harmless, so do it once
before you record (keep it unconditional).

---

## 5. The state machine — model the states, don't wing it

Recording has clear phases. Model them as a `status` string so the UI is a pure
function of state (button label, disabled-ness, messages all derive from `status`):

```
idle ──start()──▶ (ask permission)
                    │ granted            │ denied
                    ▼                    ▼
                recording ──stop()──▶  idle (+ uri)      denied (show message)
```

- `idle`: show "Record".
- `recording`: show "Stop" + a live indicator.
- `denied`: show "Mic access needed → enable in Settings".

**Why a state machine?** It makes **impossible states impossible** — you can't be
"recording" and "denied" at once, and the button can't do the wrong thing, because it
only ever reads one `status`. (Exactly the lesson from the logout modal's `step`.)

---

## 6. The recorder lifecycle — prepare → record → stop → uri

The mechanical core, in order, and *why* each call exists:
1. `const recorder = useAudioRecorder(options)` — create it (options = §7).
2. `await recorder.prepareToRecordAsync()` — allocate the file/encoder. **Separate
   from `record()` because setup is slow-ish**; you prep, THEN start instantly on tap,
   so there's no lag between the tap and capture.
3. `recorder.record()` — capture begins → `status = 'recording'`.
4. `await recorder.stop()` — capture ends.
5. `recorder.uri` — the `file://…` path to the finished clip → store in `uri`.

Wrap the async calls in `try/catch` and flip `status` back to `idle` on error — a
failed prepare/record shouldn't strand the UI in "recording" forever.

### Skeleton — the rest of `start()` and all of `stop()`
```js
// ...after §3 permission and §4 audio session, inside start():
await recorder.prepareToRecordAsync()
recorder.record()
setStatus('recording')

// stop():
await recorder.stop()
setUri(recorder.uri)   // the finally{} already resets status to 'idle'
```

---

## 7. ⚠️ THE CRUX: recording as uncompressed WAV (won or lost here)

Your pitch code (Box 2/3) needs **raw samples**. The default presets record **AAC
(.m4a)** — *compressed*, which you can't parse by hand. So you must pass **custom
recording options** asking for **linear PCM in a `.wav`**.

**What:** put them in `src/lib/recordingOptions.js` exporting `WAV_OPTIONS`.
**Why a separate file:** it's fiddly, platform-specific config you'll tune during the
spike — keep it out of the hook so the hook stays readable.

- **iOS**: supports **linear PCM** output (an iOS output-format option, e.g.
  `LINEARPCM`, with `linearPCMBitDepth: 16`) → a real WAV. ✅
- **Android** ⚠️: the OS recorder (MediaRecorder) outputs **container formats**
  (3GP/MP4/AAC) — it **does not** emit raw WAV/PCM. So expo-audio likely **cannot** hand
  you a WAV on Android. This is the wall. If you hit it, your options are:
  - a community **raw-PCM capture** module using Android's low-level `AudioRecord`
    (which *does* give raw PCM — you then prepend a 44-byte WAV header yourself), or
  - record AAC and **decode** it — which is the exact decoder problem you were avoiding.

### Skeleton — `src/lib/recordingOptions.js`
```js
// src/lib/recordingOptions.js
import { IOSOutputFormat } from 'expo-audio' // verify the exact enum name in your docs

export const WAV_OPTIONS = {
  extension: '.wav',
  sampleRate: 16000,     // plenty for pitch; smaller/faster than 44.1k
  numberOfChannels: 1,   // mono — a single voice
  bitRate: 128000,

  ios: {                 // iOS CAN do linear PCM → a real WAV
    outputFormat: IOSOutputFormat.LINEARPCM,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },

  android: {             // ⚠️ MediaRecorder can't WAV — the spike tells the truth
    extension: '.wav',
    outputFormat: 'default',
    audioEncoder: 'default',
  },
}
```
Don't solve the Android fallback until the spike (§8) proves you need it.

---

## 8. THE SPIKE — do this BEFORE any UI (the single most important step)

Prove you can get a real WAV on **both** platforms. Throwaway code, wired to a temp
button. If the header isn't a WAV, stop and fix recording before building on it.

### Skeleton — the spike
```js
import * as FileSystem from 'expo-file-system/legacy' // npx expo install expo-file-system

async function spikeWavTest(recorder) {
  await AudioModule.requestRecordingPermissionsAsync()
  await setAudioModeAsync({ allowsRecording: true })
  await recorder.prepareToRecordAsync()
  recorder.record()
  await new Promise((r) => setTimeout(r, 2000))       // record 2 seconds
  await recorder.stop()
  const uri = recorder.uri

  // read the file bytes and inspect the header:
  const b64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' })
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const dv = new DataView(bytes.buffer)

  const riff = String.fromCharCode(...bytes.slice(0, 4))   // expect "RIFF"
  const wave = String.fromCharCode(...bytes.slice(8, 12))  // expect "WAVE"
  const rate = dv.getUint32(24, true)                       // expect 16000
  console.log('[spike]', { uri, riff, wave, rate })
}
```
**Pass = `RIFF` / `WAVE` / a sane rate on iOS AND Android.** If Android fails, you've
learned — on day one, not day five — that Android needs the raw-PCM module. **This
spike de-risks the entire feature. Do it first.**

---

## 9. Minimal wiring into `PronounceStep` (prove the loop, ship value)

You don't need the fancy UI yet — just prove the loop. Record + playing the take back
is already a nice, shippable feature ("hear yourself vs the native clip").

### Skeleton — inside PronounceStep
```jsx
import { usePronunciation } from '../../hooks/usePronunciation.js'
// ...
const { status, uri, start, stop } = usePronunciation()

<Button onPress={status === 'recording' ? stop : start} disabled={status === 'denied'}>
  {status === 'recording' ? 'Stop' : status === 'denied' ? 'Mic blocked' : 'Record'}
</Button>

{status === 'denied' && (
  <Text className="text-sm text-red-600 mt-2">Enable mic access in Settings.</Text>
)}

{uri && (
  <Button variant="secondary" onPress={() => /* play uri with expo-audio */ null}>
    Play my take
  </Button>
)}
```

---

## 10. How to know you're DONE (point B reached)

On **both** platforms:
- Tapping Record asks permission (first time) and starts capturing.
- Tapping Stop produces a `uri`.
- Reading that file's first bytes shows a valid **WAV header** with your expected
  sample rate.
- Denying permission lands you in `denied` with a helpful message, not a crash.

Then Box 1 is real → move to Box 2 (parse the WAV into `{ samples, rate }`).

---

## 11. The level meter (optional — do this LAST)

A moving bar while recording makes it feel alive. expo-audio exposes a **metering**
value (loudness). Poll it — via `useAudioRecorderState(recorder)` or the recorder
status on an interval — and feed it to a simple bar. Pure polish; skip until recording
+ parsing work.

---

## What you'll have built + learned
Files: `src/hooks/usePronunciation.js`, `src/lib/recordingOptions.js`, a throwaway
spike, and a tiny `PronounceStep` change. Concepts: **custom-hook contract design ·
runtime-vs-build-time permissions · iOS audio sessions · modeling a flow as a state
machine · an async native lifecycle (prepare/record/stop) · and the big one — file
format is a platform-capability you VERIFY (the spike), not assume.** That last
habit — spiking the risky assumption before building on it — is worth more than any
single API call.

Next lesson: Box 2 — parsing that `.wav` into `{ samples, rate }`.
