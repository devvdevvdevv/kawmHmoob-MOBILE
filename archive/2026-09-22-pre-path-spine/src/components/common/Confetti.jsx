import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native'

// A one-shot confetti burst — the RN port of the web Confetti (which used CSS
// keyframes). Each piece is an Animated.View that falls from above the screen to
// below it with sideways drift + spin, staggered start, then the whole thing
// self-removes when the longest piece finishes so nothing lingers.
//
// Rendered as an absolute, non-interactive overlay (pointerEvents="none") so it
// never blocks the buttons underneath. Colors follow the palette.
const COLORS = ['#B25E3D', '#9C4F33', '#7FA6AA', '#D88278', '#C26358', '#D9B38C']

function Piece({ piece, height }) {
  const t = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const anim = Animated.timing(t, {
      toValue: 1,
      duration: piece.dur,
      delay: piece.delay,
      easing: Easing.linear,
      useNativeDriver: true,
    })
    anim.start()
    return () => anim.stop()
  }, [t, piece])

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-20, height + 20] })
  const translateX = t.interpolate({ inputRange: [0, 1], outputRange: [0, piece.drift] })
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${piece.rot}deg`] })
  const opacity = t.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0.6] })

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: piece.left,
        width: piece.w,
        height: piece.h,
        borderRadius: 2,
        backgroundColor: piece.color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  )
}

export default function Confetti({ count = 40 }) {
  const { width, height } = useWindowDimensions()
  const [done, setDone] = useState(false)

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: Math.random() * width,
        drift: (Math.random() * 2 - 1) * 60, // px sideways
        rot: 360 + Math.random() * 720,
        delay: Math.random() * 500,
        dur: 2600 + Math.random() * 1600,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        h: 9 + Math.random() * 7,
      })),
    [count, width]
  )

  useEffect(() => {
    const maxMs = pieces.reduce((m, p) => Math.max(m, p.delay + p.dur), 0)
    const id = setTimeout(() => setDone(true), maxMs + 100)
    return () => clearTimeout(id)
  }, [pieces])

  if (done) return null

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { height }]}>
      {pieces.map((p) => (
        <Piece key={p.key} piece={p} height={height} />
      ))}
    </Animated.View>
  )
}
