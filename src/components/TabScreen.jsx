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
export default function TabScreen({ children, scroll = true }) {
  const insets = useSafeAreaInsets()
  const topClearance = HEADER_CONTENT_HEIGHT + insets.top + 16
  const bottomClearance = TAB_BAR_HEIGHT + Math.max(insets.bottom, 8) + 24

  if (!scroll) {
    return (
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: topClearance, paddingBottom: bottomClearance, alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 672, flex: 1 }}>{children}</View>
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: topClearance,
        paddingBottom: bottomClearance,
        // Center the column via the CONTAINER's cross-axis alignment. Putting
        // maxWidth on a self-centered child instead makes react-native-web's
        // ScrollView treat 672 as a MIN width, overflowing narrow screens.
        alignItems: 'center',
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ width: '100%' }}>{children}</View>
    </ScrollView>
  )
}
