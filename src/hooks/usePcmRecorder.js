import { useCallback, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { useAudioRecorder, AudioStudioModule } from '@siteed/audio-studio'
import { createAudioPlayer } from 'expo-audio'

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
// ⚠️ THIS HOOK IS UNPROVEN ON DEVICE. The library previously broke the Android
// release build (Kotlin Promise signature mismatch — notes/2026-08-13). Source
// inspection on 2026-08-20 says that defect is gone, but READING is not
// COMPILING. Verify with an EAS Android build before trusting it.
//
// `usePronunciation` is deliberately left untouched so the shipping path keeps
// working while this is evaluated.
//
// API mirrors usePronunciation on purpose, so swapping is a one-line change:
//   { status, uri, start, stop, playTake, playing }
// plus `info` — the format metadata, which is the whole point of the spike.

// 44100 matches recordingOptions.js: consonants (s/sh/f/t) need the bandwidth to
// sound right on playback. Pitch analysis downsamples to 16k afterwards anyway.
// SampleRate is a union type in this library: 16000 | 44100 | 48000.
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

  const releasePlayer = useCallback(() => {
    if (playerRef.current) {
      try { playerRef.current.remove() } catch {}
      playerRef.current = null
    }
  }, [])

  useEffect(() => releasePlayer, [releasePlayer]) // release on unmount

  const start = useCallback(async () => {
    try {
      setError(null)
      const perm = await AudioStudioModule.requestPermissionsAsync()
      if (!perm?.granted) { setStatus('denied'); return }

      // Any previous take is stale — drop it so the UI can't offer to play a
      // recording that no longer matches what the learner is doing.
      releasePlayer()
      setPlaying(false)
      setUri(null)
      setInfo(null)

      await startRecording(CONFIG)
      setStatus('recording')
    } catch (e) {
      console.warn('[pcm] start failed', e)
      setError(e?.message || String(e))
      setStatus('error')
    }
  }, [startRecording, releasePlayer])

  const stop = useCallback(async () => {
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
  }, [stopRecording, status])

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
  }
}
