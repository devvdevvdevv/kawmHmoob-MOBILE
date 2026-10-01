import { Pressable, Text } from 'react-native'
import { useAudio } from '../../hooks/useAudio.js'
import { resolveAudioSrc } from '../../lib/audioBase.js'

// Tap-to-hear. Four sizes, because the same control does very different jobs:
//
//   sm  (28px) — inline next to a word in a list. Incidental.
//   lg  (40px) — a card's secondary audio.
//   xl  (56px) — THE action on a lesson card. Big enough to be the obvious
//                first thing to touch, and comfortably past the 44px minimum
//                tap target on both platforms.
//   hero (72px) — the only thing to do on the screen (a `hear` step).
//
// ⚠️ 44px is the floor for a tap target (Apple HIG / Material). `sm` at 28px is
// UNDER that, which is why it only appears inline where a mis-tap is cheap and
// the row itself is usually pressable too. Anything that is THE action on a card
// should be xl or hero.
// `stop` is deliberately ONE STEP SMALLER than `glyph`. Two solid blocks
// carry far more ink than a musical note, so at the same font size the playing
// state reads as heavier and bigger even though the box has not moved.
//
// ⚠️ THE BOX NEVER CHANGES — only the glyph inside it. Resizing the button
// mid-playback would move everything under it on a card that is already
// scroll-positioned to eye height, and the learner would lose their place.
const SIZES = {
  sm: { box: 'h-7 w-7', glyph: 'text-sm', stop: 'text-xs' },
  lg: { box: 'h-10 w-10', glyph: 'text-lg', stop: 'text-sm' },
  xl: { box: 'h-14 w-14', glyph: 'text-2xl', stop: 'text-base' },
  hero: { box: 'h-[72px] w-[72px]', glyph: 'text-3xl', stop: 'text-xl' },
}

export default function AudioButton({ audioSrc, wordId, size = 'sm', onPlay, disabled = false }) {
  const { play, playing } = useAudio()
  // Enabled only when the clip is actually playable — a real path AND a host
  // configured (EXPO_PUBLIC_AUDIO_BASE_URL), or a local/absolute source.
  const enabled = Boolean(resolveAudioSrc(audioSrc)) && !disabled
  const s = SIZES[size] || SIZES.sm
  const isPlaying = playing === (wordId || audioSrc)

  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation?.()
        if (enabled) {
          play(audioSrc, wordId)
          // Lets a caller know the reference was heard — RecallStep uses this to
          // stop a "from memory" answer becoming an imitation.
          onPlay?.()
        }
      }}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={enabled ? 'Play audio' : 'No recording available'}
      accessibilityState={{ disabled: !enabled, busy: isPlaying }}
      // Static classes only — a style FUNCTION would be dropped by NativeWind on
      // native and render this invisible. See
      // notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.md
      className={`items-center justify-center rounded-full ${s.box} ${
        enabled
          ? isPlaying
            ? 'bg-clay-700 shadow-warm'
            : 'bg-clay-500 shadow-warm active:bg-clay-600'
          : 'bg-cream-200'
      }`}
    >
      <Text className={`${isPlaying ? s.stop : s.glyph} ${enabled ? 'text-cream-50' : 'text-stone-400'}`}>
        {isPlaying ? '▮▮' : '♪'}
      </Text>
    </Pressable>
  )
}
