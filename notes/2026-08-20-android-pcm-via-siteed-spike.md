# Android PCM recording via @siteed/audio-studio — spike built (2026-08-20)

Attempt to remove the last hard blocker on tone scoring: **Android cannot record
raw PCM through expo-audio.** Everything needed is now in place to answer that
with a real device test rather than more source reading.

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
- Device: **completely unverified.** No Android dev build has been made.
- The Kotlin build question from 08-13 remains open and is answered by step 1.

## If it passes

1. Swap the lab's `say` step to `usePcmRecorder`.
2. Decide whether `usePronunciation` retires or stays as the iOS path (no reason
   to keep two if one works everywhere).
3. Remove `REASON_TEXT['unsupported-format']` from the common path — it becomes
   a genuine edge case rather than the Android default.
4. Delete `app/spike.jsx` and this spike; fold the finding into
   `recordingOptions.js`, whose Android comment block would then be wrong.

## If it fails

Options, cheapest first:
1. Re-test whether **expo-audio** now records WAV on the current SDK (zero new
   dependencies if it does).
2. `patch-package` whatever the current Kotlin error actually is.
3. A different PCM recording library.
4. Ship Android without tone scoring — record + playback + compare by ear still
   works, and that is the feature's core value.
