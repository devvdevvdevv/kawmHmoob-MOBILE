import { useMemo, useRef } from 'react'
import { PanResponder } from 'react-native'
import { useRouter } from 'expo-router'

// Swipe right to go back — 2026-09-30 (author: "make it so user can swipe off of dictionary and back to
// previous page").
//
// ⚠️ WHY A HAND-ROLLED GESTURE: the root Stack uses `animation: 'fade'`, which has no native swipe-back,
// and Android's native stack has no in-app swipe-back at all — only the system back gesture.
//
// It only claims a CLEARLY horizontal, rightward drag (dx past 24px and twice |dy|), so vertical
// scrolling, taps and typing in the search box behave exactly as before; the ScrollView inside never
// claims a horizontal move, so this parent gets it in the bubble phase. Released past 80px → back
// (or Home, when the screen was opened directly and there is nothing to go back to).
//
// Usage: const swipe = useSwipeBack(); <View style={{ flex: 1 }} {...swipe}>…</View>
export function useSwipeBack({ distance = 80 } = {}) {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_e, g) => g.dx > 24 && Math.abs(g.dx) > Math.abs(g.dy) * 2,
        onPanResponderTerminationRequest: () => true,
        onPanResponderRelease: (_e, g) => {
          if (g.dx < distance) return
          const r = routerRef.current
          if (r.canGoBack()) r.back()
          else r.replace('/')
        },
      }),
    [distance],
  )
  return responder.panHandlers
}
