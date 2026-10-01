import { View, Text, Pressable, ScrollView } from 'react-native'
import { SCREEN_PADDING_X } from '../TabScreen.jsx'

// A segmented control for switching sections WITHIN a screen.
//
// Not navigation — the screen stays put and swaps its body. Use it when the
// sections are peers a learner will bounce between, not a hierarchy they drill
// into. (Drilling in is a Link to a route; this is not that.)
//
//   <SegmentedTabs
//     tabs={[{ id: 'a', label: 'Conversations', count: 3 }, …]}
//     value={tab}
//     onChange={setTab}
//   />
//
// ⚠️ FULL-BLEED, and it has to be. TabScreen pads its column by
// SCREEN_PADDING_X and centres it, so a rail rendered normally is boxed inside
// that column and CLIPS at the gutter as soon as the pills exceed the width —
// which four tabs do. Cancelling the gutter with a negative margin and putting
// it back as contentContainer padding lets the rail scroll to the true screen
// edge, so the last pill is reachable instead of cut in half.
//
// ⚠️ The negative margin MUST match the gutter, so it is imported, never retyped.
export default function SegmentedTabs({ tabs, value, onChange }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // The rail is a single unit, so the background wraps the row, not the
      // screen — it should not stretch edge to edge on a tablet.
      // Cancel the page gutter, then restore it INSIDE the scrollable area.
      // flexGrow:0 stops the rail claiming leftover vertical space.
      style={{ marginHorizontal: -SCREEN_PADDING_X, flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_X }}
      className="mb-6"
    >
      <View className="flex-row gap-1 rounded-full bg-cream-200/70 p-1" style={{ flexShrink: 0 }}>
        {tabs.map((t) => {
          const active = t.id === value
          return (
            <Pressable
              key={t.id}
              onPress={() => onChange(t.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.count != null ? `${t.label}, ${t.count} items` : t.label}
              // Static classes only — a style FUNCTION is dropped by NativeWind
              // on native and renders this invisible. See
              // notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.md
              className={`flex-row items-center gap-2 rounded-full px-4 py-2 ${
                active ? 'bg-cream-50 shadow-warm' : 'active:bg-cream-200'
              }`}
            >
              <Text
                className={`text-sm ${
                  active ? 'font-semibold text-stone-900' : 'text-stone-600'
                }`}
              >
                {t.label}
              </Text>
              {t.count != null && (
                <Text
                  className={`text-[11px] ${active ? 'text-clay-700' : 'text-stone-500'}`}
                >
                  {t.count}
                </Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </ScrollView>
  )
}
