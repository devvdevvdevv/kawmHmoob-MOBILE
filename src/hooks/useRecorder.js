import { Platform } from 'react-native'
import { usePronunciation } from './usePronunciation.js'
import { usePcmRecorder } from './usePcmRecorder.js'

// THE ONE RECORDER THE LESSON STEPS USE.
//
// Picks whichever library actually produces analysable audio on the platform
// you are standing on, and hides the choice from every caller.
//
// ── Why two recorders exist at all ──────────────────────────────────────────
//
//   iOS      expo-audio  → LINEARPCM 16-bit WAV   ✅ verified since 2026-08-10
//   Android  expo-audio  → AAC in an .m4a         ❌ wavDecode cannot read it
//            @siteed     → pcm_16bit WAV          ✅ verified on device 2026-08-20
//   Web      expo-audio  → webm/opus              ❌ neither path decodes
//
// Android's MediaRecorder has NO PCM output — the format list is
// 3gp/mpeg4/amrnb/amrwb/aac_adts/mpeg2ts/webm and none of them are raw samples.
// That is a limitation of the API expo-audio wraps, not a config mistake. See
// src/lib/recordingOptions.js.
//
// ── Why NOT just use @siteed everywhere ─────────────────────────────────────
//
// It claims `pcm_16bit` on all platforms, and it may well work on iOS. But it
// has only ever been VERIFIED on Android, while expo-audio has been running in
// production on iOS since August. Swapping the proven iOS path for an unproven
// one to save a branch would be trading a working feature for tidiness.
//
// Each platform uses the path that was actually tested on it. Revisit if
// @siteed gets verified on an iOS device — then this file collapses to one line.
//
// ⚠️ CONDITIONAL HOOK CALL — and why it is safe here.
//
// The rule is that hook ORDER must be identical on every render. `Platform.OS`
// is a constant baked in at startup: it cannot change between renders, or
// during the life of the process. So exactly one branch runs, always, for the
// entire session — the order never varies.
//
// This is the rare legitimate exception. It would NOT be safe for anything that
// can change (a prop, state, a feature flag read at runtime).

const USE_PCM = Platform.OS === 'android'

export function useRecorder() {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- Platform.OS is a
  // startup constant, so this branch is fixed for the whole process. See above.
  return USE_PCM ? usePcmRecorder() : usePronunciation()
}

/**
 * Can this platform produce audio the pitch pipeline can actually read?
 *
 * Lets UI explain itself instead of silently failing — e.g. hiding a Score
 * button on web rather than offering one that always errors.
 */
export const RECORDING_IS_ANALYSABLE = Platform.OS !== 'web'
