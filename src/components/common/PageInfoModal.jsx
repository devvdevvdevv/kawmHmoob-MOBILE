import { useRef, useState } from 'react'
import { Modal, View, Text, ScrollView, Pressable, Dimensions } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// The header "i" button's help modal. Takes an array of slides; with one slide
// it's a plain notice, with several it becomes a horizontally swipeable pager
// with dots + Back/Next (so it works by touch AND on web without a swipe).
//
// Like InfoModal, colors are inlined from theme tokens — the theme CSS vars don't
// cascade into a native <Modal>, and the shared <Button> is unreliable there.
//
// slides: [{ emoji?, title, body: string | string[] }]
export default function PageInfoModal({ visible, slides = [], onClose }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const primaryBg = `rgb(${t['--c-clay-600']})`
  const primaryText = `rgb(${t['--c-cream-50']})`
  const dotOn = `rgb(${t['--c-clay-600']})`
  const dotOff = `rgb(${t['--c-cream-200']})`
  const ghostText = `rgb(${t['--c-stone-800']})`

  const scrollRef = useRef(null)
  const [index, setIndex] = useState(0)
  // Card inner width drives the paging math. Seed from screen size to avoid a
  // first-frame flash, then correct via onLayout.
  const screenW = Dimensions.get('window').width
  const [w, setW] = useState(Math.min(screenW - 48, 420))

  const count = slides.length
  const multi = count > 1
  const last = index >= count - 1

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(count - 1, i))
    setIndex(clamped)
    scrollRef.current?.scrollTo({ x: clamped * w, animated: true })
  }

  const onMomentumEnd = (e) => {
    if (!w) return
    setIndex(Math.round(e.nativeEvent.contentOffset.x / w))
  }

  const close = () => { setIndex(0); onClose?.() }

  if (count === 0) return null

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View
          onLayout={(e) => setW(e.nativeEvent.layout.width)}
          style={{ width: '100%', maxWidth: 420, maxHeight: '82%', backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 18, overflow: 'hidden' }}
        >
          {/* Always-available close — so the user can bail from any slide. */}
          <Pressable
            onPress={close}
            hitSlop={10}
            style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: ghostText, fontSize: 22, fontWeight: '600', lineHeight: 22 }}>×</Text>
          </Pressable>

          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled={multi}
            scrollEnabled={multi}
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onMomentumEnd}
          >
            {slides.map((s, i) => (
              <View key={i} style={{ width: w, padding: 24 }}>
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 360 }}>
                  {s.emoji ? <Text style={{ fontSize: 40, marginBottom: 8 }}>{s.emoji}</Text> : null}
                  <Text className="font-serif" style={{ color: titleColor, fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
                    {s.title}
                  </Text>
                  {(Array.isArray(s.body) ? s.body : s.body ? [s.body] : []).map((p, j, arr) => (
                    <Text key={j} style={{ color: bodyColor, fontSize: 15, lineHeight: 23, marginBottom: j < arr.length - 1 ? 12 : 0 }}>
                      {p}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            ))}
          </ScrollView>

          {/* Footer — dots (multi only) + Back/Next or Got it */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderTopWidth: 2, borderTopColor: border }}>
            {multi ? (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {slides.map((_, i) => (
                  <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: i === index ? dotOn : dotOff }} />
                ))}
              </View>
            ) : <View />}

            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              {multi && index > 0 && (
                <Pressable onPress={() => goTo(index - 1)} hitSlop={8}>
                  <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600' }}>Back</Text>
                </Pressable>
              )}
              {multi && !last ? (
                <Pressable
                  onPress={() => goTo(index + 1)}
                  style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 24, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                >
                  <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>Next</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={close}
                  style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 24, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
                >
                  <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>Got it</Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}
