import { useCallback, useEffect, useRef, useState } from 'react'
import { Audio } from 'expo-av'

// Cross-platform audio playback via expo-av. Works on iOS, Android, and web.
// `src` can be a require()'d local asset or a remote URI string.
//
// When audioSrc is falsy this is a no-op (most words have audioFile: null today).
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
    if (!src) {
      if (__DEV__) console.warn('[audio] no source for', wordId)
      return
    }
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => {})
        soundRef.current = null
      }
      const source = typeof src === 'string' ? { uri: src } : src
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
