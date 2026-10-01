import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TAB_BAR_HEIGHT } from './GlobalTabBar.jsx'
import { HEADER_CONTENT_HEIGHT } from './GlobalHeader.jsx'

// Shared page shell. Mirrors the web app's <main> (centered max-width, generous
// padding). Every content screen renders its body inside <TabScreen> so spacing
// is identical app-wide.
//
// Both the header and the tab bar are position:absolute overlays that float ON
// TOP of the page, so content must be padded to clear BOTH:
//   top    = header height + safe-area inset (status bar/notch)
//   bottom = tab bar height + safe-area inset (home indicator)
// The two heights are exported from GlobalHeader/GlobalTabBar so the numbers
// never drift. (No SafeAreaView here — the top padding already includes the
// inset, and the header owns the very top.)
//
// Background is transparent — the single page background (seafoam-300) is
// painted once by the root layout and shows through.
// The page gutter. Exported so a full-bleed child — a horizontally scrolling
// tab rail, say — can cancel it with a negative margin and restore it inside
// its own content padding, instead of hardcoding 20 and drifting if this moves.
export const SCREEN_PADDING_X = 20

/**
 * How much padding sits below a TabScreen's content, clearing the floating tab
 * bar and the home indicator.
 *
 * Exported as a HOOK because it depends on the safe-area inset, which is a
 * runtime value. A full-bleed surface that should reach the bottom EDGE of the
 * screen cancels this with a negative margin and adds it back as its own
 * padding — see app/words/sentences/[groupId].jsx.
 */


// JavaScript Prop for sentence builder




export function useBottomClearance() {
  const insets = useSafeAreaInsets()
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 24
}

export default function TabScreen({ children, scroll = true, fill = false }) {
  const insets = useSafeAreaInsets()
  const topClearance = HEADER_CONTENT_HEIGHT + insets.top + 16
  const bottomClearance = useBottomClearance()

  if (!scroll) {
    return (
      <View style={{ flex: 1, paddingHorizontal: SCREEN_PADDING_X, paddingTop: topClearance, paddingBottom: bottomClearance, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 672, flex: 1 }}>{children}</View>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{
        paddingHorizontal: SCREEN_PADDING_X,
        paddingTop: topClearance,
        paddingBottom: bottomClearance,
        // Center the column via the CONTAINER's cross-axis alignment. Putting
        // maxWidth on a self-centered child instead makes react-native-web's
        // ScrollView treat 672 as a MIN width, overflowing narrow screens.
        alignItems: 'center',
        // `fill` — for a screen whose background must reach the bottom EDGE
        // rather than stopping where its text stops (the sentence builder's
        // cream sheet). Both halves are required and neither works alone:
        //
        //   flexGrow here  → the scroll content is at least viewport-tall
        //   flex below     → the wrapper PASSES that height to the child
        //
        // A ScrollView's content container is content-sized by definition, so
        // without the first there is no spare height to claim; without the
        // second the wrapper shrinks to its content and swallows it again.
        ...(fill && { flexGrow: 1 }),
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: '100%', ...(fill && { flex: 1 }) }}>{children}</View>
    </ScrollView>
  )
}
