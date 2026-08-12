import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useAudioRecorder,
  createAudioPlayer,
  AudioModule,
  setAudioModeAsync,
} from 'expo-audio'
import { WAV_OPTIONS } from '../lib/recordingOptions.js' // §7 — asks for linear PCM, not AAC

// Record the learner's voice and play it back. Box 1 of the pronunciation
// pipeline (see learning/pronunciation/voice-record-step-lesson.md).
//
// This hook is the RECORDING half only — it produces a file `uri` and can play
// it. Pitch detection / tone scoring (Boxes 2-3) read that file later; nothing
// here knows about tones yet.
//
// `status`: 'idle' | 'recording' | 'denied'
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

  const releasePlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.remove() } catch {}
      playerRef.current = null
    }
  }, [])

  useEffect(() => releasePlayer, [releasePlayer]) // release on unmount

  const start = async () => {
    try {
      const perm = await AudioModule.requestRecordingPermissionsAsync()
      if (!perm.granted) { setStatus('denied'); return }

      // Any previous take is now stale — drop it so the UI can't offer to play a
      // recording that no longer matches what the learner is doing.
      releasePlayer()
      setPlaying(false)
      setUri(null)

      // iOS needs the audio session put into recording mode first.
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })

      await recorder.prepareToRecordAsync()
      recorder.record()
      setStatus('recording')
    } catch (e) {
      console.warn('[record] start failed', e)
      setStatus('idle')
    }
  }

  const stop = async () => {
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

  return { status, uri, start, stop, playTake, playing }
}
