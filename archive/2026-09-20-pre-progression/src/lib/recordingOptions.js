import { IOSOutputFormat, AudioQuality } from 'expo-audio'

// Recording settings for the pronunciation feature.
//
// Applied at prepareToRecordAsync() time — the format is decided BEFORE capture,
// never converted afterward (camera settings, not Photoshop).
//
// ⚖️ THE TENSION: two goals pull in opposite directions.
//   - "Hear yourself vs the native clip" (SHIPPING NOW) wants good-sounding audio.
//   - Pitch detection (Boxes 2-3, not built) wants raw PCM and doesn't care how
//     pretty it sounds.
// Optimized for EARS, because that's the half users experience today, and higher
// quality costs pitch detection nothing — it's strictly more data.
//
// Shape matches expo-audio's `RecordingOptions` type: extension / sampleRate /
// numberOfChannels / bitRate are shared, and each platform block overrides.

export const WAV_OPTIONS = {
  extension: '.wav',

  // 44100 = CD rate. Was 16000, which is "wideband" — plenty for PITCH (voices
  // live at 80-400 Hz, and you capture up to half the sample rate), but it caps
  // you at 8 kHz and that's where consonants live. Sibilants (s / sh / f / t)
  // turn dull and lispy, which is what "terrible quality" sounds like. Costs
  // ~2.75x file size; pitch code just scans a wider lag range.
  sampleRate: 44100,

  numberOfChannels: 1, // mono — one voice, one mic. Stereo would interleave two
                       // lists we'd have to unbraid before analyzing.

  bitRate: 128000,     // compression setting: irrelevant to iOS linear PCM
                       // (nothing to compress), but it DOES apply to Android AAC.

  // ── iOS: a genuine uncompressed WAV ────────────────────────────────────────
  // These fields double as the instructions for reading the file back later:
  // 16-bit + not-float + little-endian is exactly `getInt16(offset, true)`.
  ios: {
    outputFormat: IOSOutputFormat.LINEARPCM, // = 'lpcm'
    // REQUIRED by the RecordingOptionsIos type (not optional) and set by every
    // built-in preset. Ignored for linear PCM in practice, but omitting a
    // required field is asking the native side for trouble.
    audioQuality: AudioQuality.MAX,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },

  // ── Android: WAV IS NOT POSSIBLE HERE ──────────────────────────────────────
  // Not an opinion — expo-audio's own types say "Android recording uses
  // MediaRecorder", and the complete list of formats it accepts is:
  //
  //   AndroidOutputFormat : 'default' | '3gp' | 'mpeg4' | 'amrnb' | 'amrwb'
  //                         | 'aac_adts' | 'mpeg2ts' | 'webm'
  //   AndroidAudioEncoder : 'default' | 'amr_nb' | 'amr_wb' | 'aac' | 'he_aac'
  //                         | 'aac_eld'
  //
  // There is no 'wav' and no 'pcm' in either list. NO value of these options can
  // produce raw PCM on Android — it's a dependency limit, not a config mistake.
  // Raw samples require a different capture API (AudioRecord), which means a
  // different library or a native module. See notes/2026-08-10-*.
  //
  // Until then, be EXPLICIT rather than 'default': Android's default encoder is
  // historically AMR-NB, an 8 kHz narrowband voice codec that sounds like a
  // walkie-talkie (it's literally what the built-in LOW_QUALITY preset selects).
  // mpeg4 + aac at 128 kbps is dramatically better to listen to, and since
  // neither option is hand-parseable, take the one that sounds good.
  android: {
    extension: '.m4a', // honest extension for what MediaRecorder actually makes
    outputFormat: 'mpeg4',
    audioEncoder: 'aac',
    // 'unprocessed' would skip OEM noise-suppression/AGC (better for analysis);
    // left at the default so playback keeps whatever the phone does to make
    // voices sound good. Revisit when Box 3 exists.
    // audioSource: 'unprocessed',
  },

  // ── Web ────────────────────────────────────────────────────────────────────
  // REQUIRED by the RecordingOptions type. The app has a web build, and
  // PronounceStep constructs a recorder there too — so this can't be omitted.
  // Browsers ignore the PCM settings entirely and hand back webm/opus, which is
  // why the spike must never be judged on web.
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
}
