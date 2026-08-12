# Deep lesson: the RECORD step — mic → a .wav file (teach yourself)

This is Box 1 of the pronunciation feature, on its own. **Point A:** the user taps a
mic button. **Point B:** you have a file on disk (`file://…/take.wav`) holding raw
audio the pitch code can later read. Nothing about pitch here — just *capturing sound
into a parseable file*. Get this rock-solid before anything else.

Read it, understand the WHY at each step, then write the code yourself.

---

## 0. What "recording" even is (the concept)

A microphone turns air-pressure vibrations into a stream of numbers (**samples**),
thousands per second. "Recording" = the OS captures that stream and writes it to a
file. Your job is to (1) get permission, (2) start/stop the capture, and (3) make sure
it's written in a format you can read back as raw numbers (**uncompressed WAV**), not a
squished format (AAC/mp3) that needs a decoder.

That's the entire step: **permission → capture → an uncompressed file.**

---

## 1. The file you'll create — and why a hook

Create: **`src/hooks/usePronunciation.js`**

Why a *hook* (not just code in the component)?
- Recording is **stateful**: are we allowed? are we recording right now? where's the
  finished file? That state has to live somewhere and update the UI.
- A hook **bundles that state + the actions** and hands the component a clean tool:
  ```
  const { status, uri, start, stop } = usePronunciation()
  ```
  The component doesn't care HOW recording works — it just calls `start()`/`stop()` and
  reads `status`/`uri`. That's the point of a custom hook: hide the machinery, expose a
  simple contract.

Why `src/hooks/`? That's where your other hooks live (`useDailyQuota`, `useProgress`).
`PronounceStep` will import this one. Keeping it beside the others = discoverable.

**What it will expose (design the contract first, before writing internals):**
- `status`: `'idle' | 'recording' | 'denied'`
- `uri`: the finished file path (or `null` until you've recorded)
- `start()`: ask permission if needed, then begin capturing
- `stop()`: end capture, set `uri`

Designing the *shape* first is a real skill — you decide the public API, then fill in
the guts. It keeps the component simple no matter how messy the internals get.

---

## 2. The tool: expo-audio (what it hands you)

You already have **expo-audio** (it does your playback). It also records. Use it, NOT
the old `expo-av` (deprecated/removed in SDK 54). The pieces you'll pull from it:
- `useAudioRecorder(options)` → a **recorder object** you drive.
- `AudioModule.requestRecordingPermissionsAsync()` → the permission prompt.
- `setAudioModeAsync({...})` → configure the audio session (iOS needs it).
- `RecordingPresets` → ready-made options (you'll customize these in §6).
- (optional) `useAudioRecorderState(recorder)` → reactive status (level meter, etc.).

> Version note: exact export names can shift between expo-audio releases. Open the
> **expo-audio docs for the version in your `package.json` (~1.1)** and confirm each
> name as you use it. Reading the official reference for the exact version is itself the
> skill — don't trust a blog (or this guide) over the versioned docs.

---

## 3. Permission — the OS privacy gate (two separate parts)

Recording is privacy-sensitive, so the OS makes you do TWO things, and beginners
usually forget one:

**(a) Ask at RUNTIME** — a popup the user taps "Allow" on:
```
const { granted } = await AudioModule.requestRecordingPermissionsAsync()
```
If not `granted` → set `status = 'denied'` and show a "mic access needed" message.
Never assume yes.

**(b) Declare at BUILD TIME** — a usage string baked into the app:
- iOS requires an `NSMicrophoneUsageDescription` ("Kawm Hmoob uses your mic to score
  your pronunciation"). expo-audio's **config plugin** (already in `app.json`
  `plugins`) accepts a `microphonePermission` option — set the copy there.
- Android needs the `RECORD_AUDIO` permission (your `app.json` already lists it).

**Why both?** (a) is the user's consent *this run*; (b) is the app *declaring up front*
what it will ask for (Apple rejects apps that request the mic with no usage string).
Miss (b) and your dev build may crash or the store will reject you.

After changing `app.json`, you must **rebuild the dev client** — plugin/permission
changes are native, a JS reload won't pick them up.

---

## 4. The audio session — iOS's extra hoop

Before recording on **iOS**, set the audio mode:
```
await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })
```
Why: iOS routes audio through "sessions" with a category. By default the app is in a
*playback* category that won't let it record; you have to explicitly flip
`allowsRecording`. `playsInSilentMode` lets your playback work even with the ringer
switch off. Android doesn't need this — but calling it is harmless, so do it once
before you record.

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

Why a state machine? It makes **impossible states impossible** — you can't be
"recording" and "denied" at once, and the button can't do the wrong thing, because it
only ever reads one `status`. This is the same lesson as the logout modal's `step`.

---

## 6. The recorder lifecycle — prepare → record → stop → uri

The mechanical core, in order:
1. `const recorder = useAudioRecorder(options)` — create it (options = §7).
2. `await recorder.prepareToRecordAsync()` — allocate the file/encoder. (Separate from
   `record()` because setup is slow-ish; you prep, THEN start instantly on tap.)
3. `recorder.record()` — capture begins → set `status='recording'`.
4. `await recorder.stop()` — capture ends.
5. `recorder.uri` — the `file://…` path to the finished clip → store it in `uri`.

Wrap the async calls in `try/catch` and flip `status` back to `idle` on error — a
failed prepare/record shouldn't strand the UI in "recording" forever.

---

## 7. ⚠️ THE CRUX: recording as uncompressed WAV (this is where it's won or lost)

Your pitch code (Box 2/3) needs **raw samples**. The default presets record **AAC
(.m4a)** — *compressed*, which you can't parse by hand. So you must pass **custom
recording options** asking for **linear PCM in a `.wav`**.

Recording options look roughly like:
```
{
  extension: '.wav',
  sampleRate: 16000,     // 16 kHz is plenty for pitch; smaller files, faster math
  numberOfChannels: 1,   // mono — you don't need stereo for a voice
  // + a platform-specific block telling it to use LINEAR PCM, 16-bit
}
```

- **iOS**: supports **linear PCM** output (there's an iOS output-format option for it,
  e.g. `LINEARPCM`, with `linearPCMBitDepth: 16`). This gives you a real WAV. ✅
- **Android** ⚠️: the OS recorder (MediaRecorder) outputs **container formats**
  (3GP/MP4/AAC) — it **does not** emit raw WAV/PCM. So expo-audio likely **cannot** hand
  you a WAV on Android. This is the wall. If you hit it, your options are:
  - a community **raw-PCM capture** module that uses Android's low-level `AudioRecord`
    (which *does* give raw PCM you can wrap in a WAV header yourself), or
  - record AAC and **decode** it — which is the exact decoder problem you were avoiding.

**So before you build ANY UI: write the spike.** Ten lines:
1. Set the WAV options, `prepareToRecordAsync`, `record()`, wait 2s, `stop()`.
2. Read the first ~44 bytes of `recorder.uri` (see the parse lesson / `expo-file-system`).
3. `console.log` them and check: does it start with `RIFF` … `WAVE`? Is the sample rate
   sane?
4. **Run it on iOS AND Android.**

If both say `RIFF…WAVE`, the whole feature is unblocked. If Android doesn't, you've
learned — on day one, not day five — that Android needs the raw-PCM module. **This
spike is the single most important thing in the entire feature.** Do it first.

---

## 8. The level meter (optional — do this LAST)

A moving bar while recording makes it feel alive. expo-audio exposes a **metering**
value (loudness). Poll it — via `useAudioRecorderState(recorder)` or the recorder's
status on an interval — and feed it to a simple bar. Pure polish; skip until recording
+ parsing work.

---

## 9. How to know you're DONE (point B reached)

You've finished the record step when, on **both** platforms:
- Tapping Record asks permission (first time) and starts capturing.
- Tapping Stop produces a `uri`.
- Reading that file's first bytes shows a valid **WAV header** with your expected
  sample rate.
- Denying permission lands you in `denied` with a helpful message, not a crash.

At that point Box 1 is real and you can move to Box 2 (parsing the WAV into samples).

---

## 10. Minimal wiring into `PronounceStep` (just enough to test)

You don't need the fancy UI yet — just prove the loop:
- Import `usePronunciation`. Show a **Record/Stop button** driven by `status`.
- After `stop()`, feed `uri` to expo-audio **playback** so the user can hear their take
  (this alone is a nice, shippable feature — "hear yourself vs the native clip").
- Leave scoring for later boxes.

---

## What you'll have learned (just from this step)
Custom-hook API design · runtime vs build-time permissions · iOS audio sessions ·
modeling a flow as a state machine · an async native lifecycle (prepare/record/stop) ·
and the real-world lesson that **file format is a platform-capability question you must
verify, not assume.** That last one — spiking the risky assumption before building on
it — is worth more than any single API call.

Next lesson: Box 2 — parsing that `.wav` into `{ samples, rate }`.
