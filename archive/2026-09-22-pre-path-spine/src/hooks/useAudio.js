import { useCallback, useEffect, useRef, useState } from 'react'
import { createAudioPlayer } from 'expo-audio'
import { resolveAudioSrc } from '../lib/audioBase.js'

// Cross-platform audio playback via expo-audio (SDK 54; replaced the removed
// expo-av). `src` can be a require()'d local asset or a remote URI string.
//
// String paths (the web `/assets/audio/…` form) are run through resolveAudioSrc,
// which checks the bundled AUDIO_MAP first, then prefixes the configured remote
// host (EXPO_PUBLIC_AUDIO_BASE_URL). Until a source resolves, playback no-ops.
export function useAudio() {
  const [playing, setPlaying] = useState(null)
  const playerRef = useRef(null)

  // Release the native player on unmount.
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try { playerRef.current.remove() } catch {}
        playerRef.current = null
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
      // Tear down the previous one-shot player before starting the next.
      if (playerRef.current) {
        try { playerRef.current.remove() } catch {}
        playerRef.current = null
      }
      const source = typeof resolved === 'string' ? { uri: resolved } : resolved
      // createAudioPlayer is synchronous in expo-audio (no more createAsync).
      const player = createAudioPlayer(source)
      playerRef.current = player
      setPlaying(wordId || src)
      player.addListener('playbackStatusUpdate', (status) => {
        if (status?.didJustFinish) setPlaying(null)
      })
      player.play()
    } catch (e) {
      if (__DEV__) console.warn('[audio] play failed', e)
      setPlaying(null)
    }
  }, [])

  return { play, playing }
}
