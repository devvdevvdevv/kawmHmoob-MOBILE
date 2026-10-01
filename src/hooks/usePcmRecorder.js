import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { useAudioRecorder, AudioStudioModule } from '@siteed/audio-studio'
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio'
import * as FileSystem from 'expo-file-system/legacy'

// Records REAL 16-bit PCM WAV — on Android too.
//
// WHY THIS EXISTS ALONGSIDE usePronunciation():
// `usePronunciation` uses expo-audio, which wraps Android's MediaRecorder. That
// API's entire format list (3gp/mpeg4/amrnb/amrwb/aac_adts/mpeg2ts/webm) has NO
// PCM option, so on Android it can only ever produce compressed audio — which
// wavDecode.js cannot read, which means no pitch, no score. See
// src/lib/recordingOptions.js for the receipts.
//
// @siteed/audio-studio talks to Android's lower-level AudioRecord API instead,
// which hands back raw samples. Its `encoding: 'pcm_16bit'` is documented as
// working on ALL platforms.
//
// ✅ VERIFIED ON AN ANDROID DEVICE 2026-08-20 via /wav-spike: real PCM in,
// decodes, pitch extracts. The Kotlin build break from notes/2026-08-13 is gone.
//
// ⚠️ NOT verified on iOS. The library claims pcm_16bit on all platforms, but iOS
// already has a proven path (expo-audio → LINEARPCM), so there is no reason to
// gamble it. src/hooks/useRecorder.js picks per platform and explains why.
//
// API mirrors usePronunciation deliberately — including reset() — so useRecorder
// can swap between them with callers noticing nothing. Plus `info`, the format
// metadata that made the spike readable.

// 44100 matches recordingOptions.js: consonants (s/sh/f/t) need the bandwidth to
// sound right on playback. Pitch analysis downsamples to 16k afterwards anyway.
// SampleRate is a union type in this library: 16000 | 44100 | 48000.

// ⚠️ RECORDING CEILING. An unbounded recording is a real hazard, not a tidiness
// issue: 44.1kHz 16-bit mono is ~5MB per minute, and wavDecode loads the whole
// file into one Float32Array to analyse it. Tap Record, put the phone in a
// pocket, and that array is hundreds of megabytes.
//
// 15s is deliberately generous — nothing this module teaches is longer than a
// sentence — so hitting it means something went wrong, not that someone was
// being thorough.
const MAX_RECORDING_MS = 15000

// ⚠️ PLAYBACK WATCHDOG — 2026-09-30. Mirrors useAudio.js / usePronunciation.js.
// `playing` had one exit (`didJustFinish`), and expo-audio's AudioStatus has no
// error field, so a clip that never started was indistinguishable from one
// still going — permanently. See notes/2026-09-30-internal-testing-bugs-*.md.
const PLAYBACK_CEILING_MS = 15000
const FINISH_GRACE_MS = 1500

// Delete a take we are finished with. Without this every recording a learner
// ever makes stays in the app sandbox forever, and the app eventually shows up
// in Settings using gigabytes for files nothing will ever read again.
//
// idempotent:true so a missing file is not an error — the recorder may have
// already replaced it.
async function discardTake(uri) {
  if (!uri) return
  try { await FileSystem.deleteAsync(uri, { idempotent: true }) } catch {}
}

const CONFIG = {
  sampleRate: 44100,
  channels: 1,          // mono — one voice, one mic
  encoding: 'pcm_16bit', // ← the entire reason for this hook
}

export function usePcmRecorder() {
  const { startRecording, stopRecording, isRecording } = useAudioRecorder()
  const [status, setStatus] = useState('idle') // 'idle' | 'recording' | 'denied' | 'error'
  const [uri, setUri] = useState(null)
  const [info, setInfo] = useState(null)
  const [error, setError] = useState(null)
  const [playing, setPlaying] = useState(false)

  const playerRef = useRef(null)
  const timerRef = useRef(null)
  // Playback watchdog — kept apart from timerRef, which is the RECORDING
  // ceiling. One ref for both would let a playback timeout cancel an auto-stop.
  const playTimerRef = useRef(null)
  const uriRef = useRef(null)
  // ⚠️ A REF, NOT A DIRECT CALL. The recording ceiling inside start() needs to
  // invoke stop(), but stop is declared BELOW start — naming it in start's deps
  // array would read it before initialisation and throw during render. The ref
  // is assigned after stop exists and always holds the latest one.
  const stopRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  // ⚠️ setPlaying(false) BELONGS HERE. Releasing the player and leaving
  // `playing` true is the stuck-button state: no sound, and a UI insisting
  // otherwise. Every caller of this wanted both halves.
  const releasePlayer = useCallback(() => {
    if (playTimerRef.current) { clearTimeout(playTimerRef.current); playTimerRef.current = null }
    if (playerRef.current) {
      try { playerRef.current.remove() } catch {}
      playerRef.current = null
    }
    setPlaying(false)
  }, [])

  useEffect(() => { uriRef.current = uri }, [uri])

  // On unmount: release the player, cancel the timer, and bin the take.
  useEffect(() => {
    return () => {
      releasePlayer()
      if (timerRef.current) clearTimeout(timerRef.current)
      discardTake(uriRef.current)
    }
  }, [releasePlayer])

  const start = useCallback(async () => {
    try {
      setError(null)
      const perm = await AudioStudioModule.requestPermissionsAsync()
      if (!perm?.granted) { setStatus('denied'); return }

      // Any previous take is stale — drop it so the UI can't offer to play a
      // recording that no longer matches what the learner is doing.
      releasePlayer()
      setPlaying(false)
      // Delete it, do not just forget it — dropping the reference leaks the file.
      discardTake(uriRef.current)
      setUri(null)
      setInfo(null)

      // ⚠️ THE ANDROID AUDIO SESSION, AND WHY THIS HOOK NEEDS IT TOO —
      // 2026-09-30. This file records through @siteed/audio-studio but plays
      // back through expo-audio: TWO native audio stacks sharing ONE session.
      // usePronunciation (iOS) bracketed its recording with setAudioModeAsync
      // from the start; this hook never called it at all, so nothing ever put
      // the session back into playback mode after AudioRecord had held it.
      //
      // When that happens the failure is SILENT: createAudioPlayer succeeds,
      // play() returns, no exception is thrown, no sound comes out — and
      // because nothing plays, `didJustFinish` never fires. That is the
      // "audio sticks after recording and only a restart fixes it" report.
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })

      await startRecording(CONFIG)
      setStatus('recording')

      // Safety ceiling — see MAX_RECORDING_MS.
      clearTimer()
      timerRef.current = setTimeout(() => {
        if (__DEV__) console.warn('[pcm] hit the ' + MAX_RECORDING_MS + 'ms ceiling — auto-stopping')
        // ⚠️ ROUTED THROUGH stop(), NOT stopRecording() — 2026-09-30. Calling
        // the library directly skipped setUri/setInfo AND the audio-mode
        // restore, so hitting the ceiling silently threw the take away and left
        // the session in recording mode. usePronunciation always called its own
        // stop() here; this hook did not, and the two must behave identically
        // or useRecorder cannot swap between them.
        stopRef.current?.()
      }, MAX_RECORDING_MS)
    } catch (e) {
      console.warn('[pcm] start failed', e)
      setError(e?.message || String(e))
      setStatus('error')
    }
  }, [startRecording, releasePlayer, clearTimer])

  const stop = useCallback(async () => {
    clearTimer()
    // ⚠️ A LOCAL, NOT STATE — 2026-09-30. The finally below used to read
    // `status` from the closure to decide whether to reset it. setStatus is
    // async and the closure holds the value from the render that created this
    // callback, so on the failure path `status` was still 'recording': the
    // guard passed and the 'error' set one line earlier was immediately
    // overwritten with 'idle'. A failed stop presented as a successful one with
    // no take — actively hiding the very failures this file needed to report.
    let failed = false
    try {
      const rec = await stopRecording()
      if (rec) {
        setUri(rec.fileUri)
        // The metadata IS the experiment: mimeType/bitDepth/sampleRate tell you
        // whether this platform actually honored the PCM request.
        setInfo({
          fileUri: rec.fileUri,
          mimeType: rec.mimeType,
          sampleRate: rec.sampleRate,
          bitDepth: rec.bitDepth,
          channels: rec.channels,
          size: rec.size,
          durationMs: rec.durationMs,
          platform: Platform.OS,
        })
      }
      return rec
    } catch (e) {
      console.warn('[pcm] stop failed', e)
      failed = true
      setError(e?.message || String(e))
      setStatus('error')
      return null
    } finally {
      // ⚠️ THE RESTORE RUNS WHETHER OR NOT THE RECORDER STOPPED CLEANLY, and
      // that is the point: a session left in recording mode is exactly what
      // kills every later playback, and a failed stop is when it is MOST likely
      // to happen. shouldRouteThroughEarpiece is named explicitly so playback
      // goes back to the speaker rather than inheriting whatever the recording
      // session left behind.
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldRouteThroughEarpiece: false,
        })
      } catch (e) {
        console.warn('[pcm] audio mode restore failed', e)
      }
      if (!failed) setStatus('idle')
    }
    // `status` is deliberately NOT a dependency any more — reading it here was
    // the bug described at the top of this function.
  }, [stopRecording, clearTimer])

  // Kept current so the recording ceiling in start() can reach the latest stop
  // without naming it in a deps array declared above it.
  stopRef.current = stop

  // Throw away the current take so the learner can record again from scratch.
  // Mirrors usePronunciation.reset — the two hooks must stay API-identical or
  // useRecorder cannot swap between them.
  const reset = useCallback(() => {
    releasePlayer()
    setPlaying(false)
    discardTake(uriRef.current)
    setUri(null)
    setInfo(null)
  }, [releasePlayer])

  // Play the take back. A local file uri is already playable — do NOT run it
  // through resolveAudioSrc(), which is built for bundled '/assets/audio/…'
  // paths and would turn a 'file:///…' recording into null.
  const playTake = useCallback(() => {
    if (!uri) return
    try {
      releasePlayer()
      const player = createAudioPlayer({ uri })
      playerRef.current = player
      setPlaying(true)

      // Armed before play(): a take that fails instantly still needs something
      // waiting to free the button.
      playTimerRef.current = setTimeout(releasePlayer, PLAYBACK_CEILING_MS)

      player.addListener('playbackStatusUpdate', (s) => {
        // A removed player can still deliver one last event; it must not clear
        // state belonging to whatever replaced it.
        if (playerRef.current !== player) return
        if (s?.didJustFinish) return releasePlayer()
        // Tighten the deadline to the take's real length once it is known.
        if (s?.isLoaded && s.duration > 0 && playTimerRef.current) {
          clearTimeout(playTimerRef.current)
          playTimerRef.current = setTimeout(releasePlayer, s.duration * 1000 + FINISH_GRACE_MS)
        }
      })
      player.play()
    } catch (e) {
      console.warn('[pcm] playback failed', e)
      releasePlayer()
    }
  }, [uri, releasePlayer])

  return {
    status: isRecording ? 'recording' : status,
    uri,
    info,
    error,
    start,
    stop,
    playTake,
    playing,
    reset,
    // Mirrors usePronunciation — the two must stay API-identical or useRecorder
    // cannot swap between them.
    stopPlayback: releasePlayer,
  }
}
