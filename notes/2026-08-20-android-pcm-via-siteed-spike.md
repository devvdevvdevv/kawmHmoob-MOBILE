# Android PCM recording via @siteed/audio-studio — ✅ CONFIRMED WORKING (2026-08-20)

> 🧵 **One chapter of the audio story.** The whole thread, in order:
> [[AUDIO-END-TO-END]]

**RESULT: PCM recording works on Android.** Verified on a real device through
`/wav-spike`. This removes the last hard blocker on tone scoring.

The original blocker: expo-audio wraps MediaRecorder, which has no PCM output at
all. `@siteed/audio-studio` uses Android's lower-level **AudioRecord** API
instead — and it both **compiles and runs**, which settles the open question from
[[2026-08-13-siteed-audio-studio-build-break-version-pin]]. That note's "remove
it for v1" conclusion is now **obsolete — the package stays.**

Two side effects worth noting:
- `app.config.js` app variants were added so the dev build
  (`com.kawmhmoob.app.dev`) installs alongside the Play Store production app.
  Without that, Android refuses the install — same package, different signing key.
- Several notes asserting "Android cannot record PCM" were corrected on this date.
  If you find another one, it is stale.

Related: [[2026-08-18-pronunciation-pipeline-implemented]] (the pipeline this
unblocks), [[2026-08-13-siteed-audio-studio-build-break-version-pin]] (the build
break, and the 08-20 re-check that questions it).

---

## Why this was worth building

`expo-audio` wraps Android's **MediaRecorder**, whose complete format list
(`3gp/mpeg4/amrnb/amrwb/aac_adts/mpeg2ts/webm`) contains **no PCM option**. Not a
config mistake — the API cannot do it.

`@siteed/audio-studio` talks to Android's lower-level **AudioRecord** API
instead. Its type surface is exactly what the pipeline needs:

```ts
EncodingType = 'pcm_32bit' | 'pcm_16bit' | 'pcm_8bit'
//   pcm_16bit: All platforms (recommended for cross-platform compatibility)
format?: 'wav'
```

`pcm_16bit` + WAV is precisely what `wavDecode.js` already parses. **If this
works, zero lines of the existing pipeline change.**

Bonus surface, unused for now but relevant later:
- `onAudioStream` — audio buffers DURING recording (live scoring, not post-hoc)
- `convertPCMToFloat32`, `getWavFileInfo`, `writeWavHeader` — overlap what
  `wavDecode.js` does by hand
- zero npm dependencies

---

## What was added

**`src/hooks/usePcmRecorder.js`** — records via `@siteed/audio-studio` at
`{ sampleRate: 44100, channels: 1, encoding: 'pcm_16bit' }`.

Its API deliberately **mirrors `usePronunciation`** (`status/uri/start/stop/
playTake/playing`) so swapping the two is a one-line change if this proves out.
It adds `info` — the format metadata, which is the entire point of the spike —
and `error`.

**`app/wav-spike.jsx`** — route `/wav-spike`, AdminGate'd, linked from `/dev`.

It does NOT stop at the header. It runs the real pipeline on the real file and
reports **each stage separately**, so a failure names its own stage instead of
collapsing into "didn't work":

```
read bytes      → byte count, RIFF/WAVE magic
decodeWav       → sample count + header sample rate
downsample      → post-decimation count @ 16 kHz
extractContour  → voiced frame count, median / min / max F0
```

Green banner = real PCM on this device **and** tone scoring works on it.

It also cross-checks the recorder's own claims against physics: 2 s of 44.1 kHz
16-bit mono ≈ 176 KB, i.e. ~86 KB/s. A far smaller file is compressed no matter
what `mimeType` says.

**`app/dev.jsx`** — one link added.

⚠️ **`usePronunciation`, `recordingOptions.js`, and `app/spike.jsx` are
untouched.** The shipping expo-audio path keeps working while this is evaluated;
nothing depends on the new hook yet.

---

## How to test

1. **Build a dev client for Android** — this is the real gate. The library ships
   native Kotlin, so Expo Go and web both prove nothing.
   ```
   eas build --profile development --platform android
   ```
   **This build is itself the experiment.** [[2026-08-13-siteed-audio-studio-build-break-version-pin]]
   says `:siteed-audio-studio:compileReleaseKotlin` fails; the 08-20 re-check
   found the diagnosed Kotlin defect absent from the installed source. If the
   build goes green, that note's premise is dead and the package stays.
2. Install, sign in with an admin account (`src/lib/admin.js`).
3. Settings → 🛠️ Open dev tools → 🎙️ WAV spike 2.
4. Record ~2 s of a steady vowel ("aaah") at normal pitch. **Not a whisper** —
   whispering has no periodic signal, so F0 extraction correctly finds nothing
   and you would misread that as a failure.
5. Analyze.

### Reading the result

| Outcome | Meaning |
|---|---|
| Green, median F0 ~85–200 Hz | **PCM works on Android.** Swap `usePronunciation` → `usePcmRecorder` in the speak lab; tone scoring is live on the primary platform. |
| `decodeWav` fails, magic is `ftyp` | Still compressed. The library did not honour `pcm_16bit`. |
| Builds fail | Read the CURRENT Kotlin error — it is likely different from the 08-13 one. |
| Green but 0 voiced frames | Recording is fine, the take was too quiet/whispered. Retry louder before blaming the pipeline. |

Also worth running on **iOS**, where expo-audio already produces valid WAV — it
gives a known-good baseline to compare Android against.

---

## Status

- Code: written, parses clean, isolated from the shipping path.
- Device: ✅ **VERIFIED on Android.** Real PCM in, decodes, pitch extracts.
- Kotlin build question from 08-13: ✅ **answered — it compiles.**

## Next steps (it passed)

1. Swap the lab's `say` step to `usePcmRecorder`.
2. Decide whether `usePronunciation` retires or stays as the iOS path (no reason
   to keep two if one works everywhere).
3. Remove `REASON_TEXT['unsupported-format']` from the common path — it becomes
   a genuine edge case rather than the Android default.
4. Delete `app/spike.jsx` and this spike; fold the finding into
   `recordingOptions.js`, whose Android comment block would then be wrong.

~~If it fails~~ — it did not. Fallback options are left in git history if ever needed.

---

# Exercises — hammer in the Android/PCM concepts

Predict the answer BEFORE running each one. The prediction is where the learning
happens; the run just tells you whether you understood.

---

## A. Formats and bytes

### A1. Read your own recording's header
Record in `/wav-spike`, then in the Analyze code path log the first 44 bytes as
hex. Identify by eye: `RIFF`, `WAVE`, `fmt `, the sample rate at bytes 24–27,
bits-per-sample at 34–35, and where `data` starts.
**Predict first:** what will bytes 24–27 be for 44100? (Hint: `0x44 0xac 0x00 0x00`
— work out why before you look.)

### A2. Prove little-endian matters
In `decodeWav`, flip `view.getUint32(body + 4, true)` to `false`. Run the spike.
What sample rate is reported? Why does the pipeline then produce a wrong F0
instead of an error? **This is the single most dangerous class of bug in this
file** — no crash, just wrong numbers.

### A3. Break the chunk walker
Modify the decoder to assume `data` starts at byte 44 instead of walking chunks.
Does your Android recording still decode? Does iOS? If both still work, you have
learned something about what those recorders actually emit — and why the walker
is insurance rather than decoration.

### A4. Compression is not a filename
Record with `usePronunciation` (expo-audio) on Android and with `usePcmRecorder`
(siteed). Compare `size ÷ durationMs` for each. One should be ~86 KB/s, the other
far less. **Why does file size alone prove compression, regardless of what the
extension or mimeType claims?**

---

## B. Platform and native modules

### B1. Why did this need a rebuild?
You changed no JS when you first tried siteed, yet a Metro reload could not make
it work. Explain in your own words why `requireNativeModule('AudioStudio')` needs
a new binary while editing `wavDecode.js` does not.

### B2. Make it fail on purpose
Open `/wav-spike` in **Expo Go** or on **web**. What happens, and at what moment —
import time, render time, or when you tap Record? Relate that to
`requireNativeModule` throwing rather than returning null.

### B3. MediaRecorder vs AudioRecord
Both are Android APIs. In two sentences each: what is MediaRecorder for, what is
AudioRecord for, and why does only one of them serve pitch analysis? Then explain
why this was never fixable by changing options in `recordingOptions.js`.

### B4. The 08-13 note was wrong — diagnose the diagnosis
That note concluded "remove for v1" based on Kotlin `reject()` signature errors.
The package now compiles unchanged. List three things that could explain the
discrepancy, and say which you'd check first. **Lesson to extract: how long is a
build diagnosis valid for?**

---

## C. App identity

### C1. Why two icons?
Explain why `com.kawmhmoob.app.dev` can coexist with `com.kawmhmoob.app` but a
second copy of `com.kawmhmoob.app` cannot — even though both are "your app."

### C2. Signing, not naming
Suppose you set the dev build's package BACK to `com.kawmhmoob.app` and tried to
install over the Play Store version. **Predict the exact failure.** Why does the
signing key matter and not just the name?

### C3. What did you lose?
The dev app starts signed out with empty progress. Which data came back after
logging in, and which did not? Map each to where it actually lives
(AsyncStorage vs Supabase). Use `src/context/ProgressContext.jsx` to check.

---

## D. The pipeline, end to end

### D1. Trace one number
Take the median F0 that `/wav-spike` printed. Work backwards and name every
transformation that produced it, in order, with the file and function for each.
Six or seven steps. Do it from memory first.

### D2. Where did 16000 come from?
Your recording is 44100. The spike reports the contour at 16000. Find the exact
line that changed it, and state what would break if it were removed. Then compute
how much slower `differenceFunction` would run at 44100 — the answer is a ratio
of two products.

### D3. Kill the energy gate
Comment out the RMS check in `extractContour`. Record silence and analyze.
How many "voiced" frames appear now, and what F0 do they claim? **This shows why
the gate exists** — and why a confident wrong answer is worse than no answer.

### D4. Whisper test
Record a whispered vowel. Predict the voiced-frame count before you run it.
Explain the result using the definition of F0 from Part 2 of
[[f0-and-tone-scoring-guide]].

---

## E. The one that matters most

### E1. Real speech, two tones
Record yourself saying ONE Hmong word twice, with two DIFFERENT tones — pick a
**contour** pair (rising `-v` vs falling `-j`), not two level tones. Extract both
contours and score them against each other.

**Success looks like:** self-match near 100, cross-match clearly lower.

If they don't separate, stop and fix the scorer before building any more UI.

### E2. Now try the level tones
Same exercise with high (`-b`) vs low (`-s`). **Predict the result from what you
know about `normalizeContour`.** You should be able to say what will happen and
why BEFORE recording.

Then read the level-tone section in
[[2026-08-18-pronunciation-pipeline-implemented]] and decide which of the four
fixes you want. **This decision gates the ffmpeg contour extraction** — two of the
options change what needs storing per clip.
