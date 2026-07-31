import { useCallback, useEffect, useRef, useState } from 'react'
import { Audio } from 'expo-av'
import { resolveAudioSrc } from '../lib/audioBase.js'

// Cross-platform audio playback via expo-av. Works on iOS, Android, and web.
// `src` can be a require()'d local asset or a remote URI string.
//
// String paths (the web `/assets/audio/…` form) are run through resolveAudioSrc,
// which prefixes the configured remote host (EXPO_PUBLIC_AUDIO_BASE_URL). Until
// that host is set, playback is a graceful no-op.
export function useAudio() {
  const [playing, setPlaying] = useState(null)
  const soundRef = useRef(null)

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {})
        soundRef.current = null
      }
    }
  }, [])

  const play = useCallback(async (src, wordId) => {
    const resolved = resolveAudioSrc(src)
    if (!resolved) {
      // No source, or a remote path with no host configured yet — no-op.
      if (__DEV__) console.warn('[audio] no playable source for', wordId, '(set EXPO_PUBLIC_AUDIO_BASE_URL?)')
      return
    }
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {})
        soundRef.current = null
      }
      const source = typeof resolved === 'string' ? { uri: resolved } : resolved
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true })
      soundRef.current = sound
      setPlaying(wordId || src)
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) setPlaying(null)
      })
    } catch (e) {
      if (__DEV__) console.warn('[audio] play failed', e)
      setPlaying(null)
    }
  }, [])

  return { play, playing }
}
