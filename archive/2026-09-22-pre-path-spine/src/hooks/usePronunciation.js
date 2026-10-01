import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useAudioRecorder,
  createAudioPlayer,
  AudioModule,
  setAudioModeAsync,
} from 'expo-audio'
import * as FileSystem from 'expo-file-system/legacy'
import { WAV_OPTIONS } from '../lib/recordingOptions.js' // §7 — asks for linear PCM, not AAC

// Record the learner's voice and play it back. Box 1 of the pronunciation
// pipeline (see learning/pronunciation/voice-record-step-lesson.md).
//
// This hook is the RECORDING half only — it produces a file `uri` and can play
// it. Pitch detection / tone scoring (Boxes 2-3) read that file later; nothing
// here knows about tones yet.
//
// `status`: 'idle' | 'recording' | 'denied'

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

export function usePronunciation() {
  // WAV_OPTIONS is applied at prepareToRecordAsync() time — the format is decided
  // BEFORE capture, never converted afterward.
  const recorder = useAudioRecorder(WAV_OPTIONS)
  const [status, setStatus] = useState('idle')
  const [uri, setUri] = useState(null)
  const [playing, setPlaying] = useState(false)

  // One-shot playback player, kept in a ref so we can tear it down. Same pattern
  // as useAudio.js — a native player must be released or it leaks.
  const playerRef = useRef(null)
  // Auto-stop timer for MAX_RECORDING_MS.
  const timerRef = useRef(null)
  // Latest uri in a ref, so unmount cleanup can delete a take it never rendered.
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

  // On unmount: release the player, cancel the timer, and bin the take. The
  // learner has left this step; the file has no reader left.
  useEffect(() => {
    return () => {
      releasePlayer()
      if (timerRef.current) clearTimeout(timerRef.current)
      discardTake(uriRef.current)
    }
  }, [releasePlayer])

  const start = async () => {
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync()
      if (!perm.granted) { setStatus('denied'); return }

      // Any previous take is now stale — drop it so the UI can't offer to play a
      // recording that no longer matches what the learner is doing.
      releasePlayer()
      setPlaying(false)
      // Delete it, do not just forget it — dropping the reference leaks the file.
      discardTake(uriRef.current)
      setUri(null)

      // iOS needs the audio session put into recording mode first.
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })

      await recorder.prepareToRecordAsync()
      recorder.record()
      setStatus('recording')

      // Safety ceiling. stop() clears this, so it only ever fires when the
      // learner did not stop themselves.
      clearTimer()
      timerRef.current = setTimeout(() => {
        if (__DEV__) console.warn('[record] hit the ' + MAX_RECORDING_MS + 'ms ceiling — auto-stopping')
        stop()
      }, MAX_RECORDING_MS)
    } catch (e) {
      console.warn('[record] start failed', e)
      setStatus('idle')
    }
  }

  const stop = async () => {
    clearTimer()
    try {
      await recorder.stop()
      setUri(recorder.uri)

      // ⚠️ iOS: leaving allowsRecording=true routes playback to the quiet
      // EARPIECE, so "Play my take" sounds broken/inaudible. Flipping it back
      // sends audio to the speaker again.
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true })
    } catch (e) {
      console.warn('[record] stop failed', e)
    } finally {
      setStatus('idle')
    }
  }

  // Throw away the current take so the learner can record again from scratch.
  // Used by the "Try again" self-assessment: saying you want another go should
  // actually GIVE you another go, not just record a preference.
  const reset = useCallback(() => {
    releasePlayer()
    setPlaying(false)
    discardTake(uriRef.current)
    setUri(null)
  }, [releasePlayer])

  // Play the take back. NOTE: this deliberately does NOT use useAudio() —
  // that hook runs sources through resolveAudioSrc(), which is built for bundled
  // '/assets/audio/…' paths and would mangle a 'file:///…' recording into null.
  // A local recording is already a playable uri; hand it straight to the player.
  const playTake = useCallback(() => {
    if (!uri) return
    try {
      releasePlayer() // tear down the previous one-shot before starting the next
      const player = createAudioPlayer({ uri })
      playerRef.current = player
      setPlaying(true)
      player.addListener('playbackStatusUpdate', (s) => {
        if (s?.didJustFinish) setPlaying(false)
      })
      player.play()
    } catch (e) {
      console.warn('[record] playback failed', e)
      setPlaying(false)
    }
  }, [uri, releasePlayer])

  return { status, uri, start, stop, playTake, playing, reset }
}
