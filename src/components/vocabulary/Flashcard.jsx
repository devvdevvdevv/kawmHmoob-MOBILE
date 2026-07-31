import { useRef, useState } from 'react'
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native'
import { useProgress } from '../../hooks/useProgress.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import AudioButton from '../common/AudioButton.jsx'

// Status badge shown ON the card so a learner can tell at a glance whether they've
// already marked this word (RN port of the web's StatusBadge). Rendered on BOTH
// faces since either can be the one facing up. `new` is the default for any word
// with no vocabProgress entry, so an unstudied card says so rather than nothing.
const STATUS = {
  new: { label: 'New', pill: '--c-cream-200', text: '--c-stone-700' },
  learning: { label: 'Learning', pill: '--c-clay-600', text: '--c-cream-50' },
  known: { label: 'Known', pill: '--c-success-700', text: '--c-cream-50' },
}

// Fully inline styles (not className): NativeWind's className interop is
// unreliable on the animated card, so the pill's position/color are set via
// theme tokens directly — same approach the faces use for their bg/border.
function StatusBadge({ status, t }) {
  const s = STATUS[status] || STATUS.new
  return (
    <View
      style={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: `rgb(${t[s.pill]})`,
      }}
    >
      <Text style={{ color: `rgb(${t[s.text]})`, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
        {s.label}
      </Text>
    </View>
  )
}

// A flashcard with a real 3D flip (RN port of the web's CSS flip). Two faces are
// stacked; each is an Animated.View rotated about Y with backfaceVisibility
// hidden, so exactly one shows at a time. Card visuals use theme tokens inline
// (not className) so the animated faces stay themed reliably.
export default function Flashcard({ word, onAdvance }) {
  const [flipped, setFlipped] = useState(false)
  const anim = useRef(new Animated.Value(0)).current
  const { vocabProgress, setVocabStatus } = useProgress()
  const { theme } = useTheme()
  const status = vocabProgress[word.id] || 'new'

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const cardBorder = `rgb(${t['--c-cream-200']})`

  const flip = () => {
    const next = !flipped
    setFlipped(next)
    Animated.spring(anim, { toValue: next ? 1 : 0, useNativeDriver: true, friction: 8, tension: 12 }).start()
  }

  const frontRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const backRotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })

  const faceStyle = {
    backgroundColor: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 40,
    minHeight: 280,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  }

  const mark = (next) => {
    setVocabStatus(word.id, next)
    if (onAdvance) setTimeout(onAdvance, 250)
  }

  return (
    <View>
      <Pressable onPress={flip}>
        <View style={{ minHeight: 280 }}>
          {/* Front — Hmong + audio */}
          <Animated.View style={[faceStyle, { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] }]}>
            <StatusBadge status={status} t={t} />
            <View className="flex-row items-center gap-3 mb-3">
              <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
              <Text className="font-serif text-5xl text-clay-700">{word.hmongRPA}</Text>
            </View>
            <Text className="text-sm text-stone-500 italic">Tap to flip</Text>
          </Animated.View>

          {/* Back — English + example */}
          <Animated.View style={[faceStyle, StyleSheet.absoluteFill, { transform: [{ perspective: 1000 }, { rotateY: backRotate }] }]}>
            <StatusBadge status={status} t={t} />
            <Text className="font-serif text-3xl text-stone-900 mb-2 text-center">{word.english}</Text>
            {word.exampleSentence && (
              <View className="items-center mt-4">
                <Text className="italic text-clay-700 mb-1 text-center">{word.exampleSentence.hmong}</Text>
                <Text className="text-sm text-stone-600 text-center">{word.exampleSentence.english}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Pressable>

      <View className="flex-row gap-2 mt-4 justify-center">
        <Pressable
          onPress={() => mark('learning')}
          className={`px-4 py-2 rounded shadow-warm ${status === 'learning' ? 'bg-clay-600' : 'bg-cream-200'}`}
        >
          <Text className={`text-sm font-semibold ${status === 'learning' ? 'text-cream-50' : 'text-clay-700'}`}>
            Mark Learning
          </Text>
        </Pressable>
        <Pressable
          onPress={() => mark('known')}
          className={`px-4 py-2 rounded shadow-warm ${status === 'known' ? 'bg-emerald-700' : 'bg-emerald-100'}`}
        >
          <Text className={`text-sm font-semibold ${status === 'known' ? 'text-cream-50' : 'text-emerald-800'}`}>
            Mark Known
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
