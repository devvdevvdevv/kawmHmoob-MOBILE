import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { useAudioRecorder, AudioStudioModule } from '@siteed/audio-studio'
import { createAudioPlayer } from 'expo-audio'
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
  const uriRef = useRef(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }, [])

  const releasePlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.remove() } catch {}
      playerRef.current = null
    }
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

      await startRecording(CONFIG)
      setStatus('recording')

      // Safety ceiling — see MAX_RECORDING_MS.
      clearTimer()
      timerRef.current = setTimeout(() => {
        if (__DEV__) console.warn('[pcm] hit the ' + MAX_RECORDING_MS + 'ms ceiling — auto-stopping')
        stopRecording().catch(() => {})
        setStatus('idle')
      }, MAX_RECORDING_MS)
    } catch (e) {
      console.warn('[pcm] start failed', e)
      setError(e?.message || String(e))
      setStatus('error')
    }
  }, [startRecording, releasePlayer, clearTimer])

  const stop = useCallback(async () => {
    clearTimer()
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
      setError(e?.message || String(e))
      setStatus('error')
      return null
    } finally {
      if (status !== 'error') setStatus('idle')
    }
  }, [stopRecording, status, clearTimer])

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
      player.addListener('playbackStatusUpdate', (s) => {
        if (s?.didJustFinish) setPlaying(false)
      })
      player.play()
    } catch (e) {
      console.warn('[pcm] playback failed', e)
      setPlaying(false)
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
  }
}
