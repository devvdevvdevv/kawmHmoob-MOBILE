import { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'



// Modal Swipe Logic

import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'







// The header "i" button's help modal — NOT a RN <Modal> (its buttons render under
// the system nav bar on this build). Instead a plain absolute-fill overlay with a
// high elevation/zIndex, the SAME proven pattern as CelebrationOverlay. Mounted by
// GlobalHeader, which lives at the ThemedShell root, so absoluteFill covers the
// whole screen and sits above the tab bar.
//
// slides: [{ emoji?, title, body: string | string[] }]
export default function PageInfoModal({ visible, slides = [], onClose }) {
  const insets = useSafeAreaInsets()
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

  const [index, setIndex] = useState(0)
  const count = slides.length
  const multi = count > 1
  const last = index >= count - 1
  const first = index <= 0

  const close = () => { setIndex(0); onClose?.() }



  // Implementing the gesture logic
  //
  // EVERY hook below has to run on EVERY render, so the `visible` early-return
  // lives AFTER them (see below). Returning first would give React 5 hooks while
  // closed and 7 while open → "Rendered more hooks than during the previous
  // render." Hook order is fixed; it can never sit behind an `if`.

  const tx = useSharedValue(0)   // how far the slide is dragged, in px

// Clamp at ends. 
  // const goTo = (i) => setIndex(Math.max((0 , Math.min(count - 1, i )))) 

  const goTo = (i) => setIndex(Math.max(0, Math.min(count - 1, i)))

  // It's meant to clamp the slide index — goTo(i) sets the index but keeps it inside the valid range, 
  // so Math.min(count - 1, i) caps it at the last slide and Math.max(0, ...) 
  // floors it at the first, letting callers pass any number without crashing on a missing slide.


  // Pan

  const pan = Gesture.Pan() 
  .activeOffsetX([-10,10])     // only start on a horizontal drag
  .onUpdate((e) => {tx.value = e.translationX})  // follow the finger
  .onEnd((e) => {
    const THRESH = 60
    if (e.translationX <= -THRESH && index < count - 1) runOnJS(goTo)(index +1)
    else if (e.translationX >= THRESH && index > 0) runOnJS(goTo)(index - 1)
    tx.value = withTiming(0);
  })


  const slideStyle = useAnimatedStyle(() => ({transform: [{translateX: tx.value}]}))

  // --- last hook is above this line, so it's safe to bail out now ---

  if (!visible || count === 0) return null
  const s = slides[Math.min(index, count - 1)]
  const paras = Array.isArray(s.body) ? s.body : s.body ? [s.body] : []

  

  // The overlay root is a GestureHandlerRootView, not a plain View: gesture-handler
  // only sees gestures inside one, and app/_layout.jsx has none. It renders a View
  // and takes the same style, so this is a swap, not extra nesting. (The guide says
  // "put it inside the <Modal>" because an RN <Modal> is a separate native window —
  // that half doesn't apply here; this overlay is a normal View in the main tree.)
  return (
    <GestureHandlerRootView
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
          zIndex: 9999,
          elevation: 9999,
        },
      ]}
    >
      <View style={{ width: '100%', maxWidth: 420, backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 18, padding: 24, position: 'relative' }}>
        {/* Always-visible close */}
        <Pressable
          onPress={close}
          hitSlop={12}
          style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: ghostText, fontSize: 26, fontWeight: '600', lineHeight: 26 }}>×</Text>
        </Pressable>


        {/* ScrollView */}

          <GestureDetector gesture = {pan}>
            <Animated.View style= {slideStyle}>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
                {s.emoji ? <Text style={{ fontSize: 40, marginBottom: 8 }}>{s.emoji}</Text> : null}
                <Text className="font-serif" style={{ color: titleColor, fontSize: 24, fontWeight: '700', marginBottom: 12, paddingRight: 28 }}>
                  {s.title}
                </Text>
                {paras.map((p, j) => (
                  <Text key={j} style={{ color: bodyColor, fontSize: 15, lineHeight: 23, marginBottom: j < paras.length - 1 ? 12 : 0 }}>
                    {p}
                  </Text>
                ))}
              </ScrollView>



            </Animated.View>
          </GestureDetector>

        {/* Footer */}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 20 }}>
          {multi ? (
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {slides.map((_, i) => (
                <View key={i} style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: i === index ? dotOn : dotOff }} />
              ))}
            </View>
          ) : <View />}



    
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {multi && !first && (
              <Pressable onPress={() => setIndex(index - 1)} hitSlop={8} style={{ paddingHorizontal: 6, paddingVertical: 10 }}>
                <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600' }}>Back</Text>
              </Pressable>
            )}



            <Pressable
              onPress={() => (multi && !last ? setIndex(index + 1) : close())}
              style={{ minHeight: 44, paddingHorizontal: 24, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>
                {multi && !last ? 'Next' : 'Got it'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  )
}
