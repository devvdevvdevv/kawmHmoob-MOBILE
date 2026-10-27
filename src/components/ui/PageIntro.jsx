import { View } from 'react-native'

// PageIntro — what a hub's "Title / subtitle" introduction sits on.
//
// ⚠️ REDONE 2026-10-25 — the author on the first version: "wayy to big … and too
// vibecoded". That version was a full card: `rounded-lg bg-cream-50 shadow-warm
// overflow-hidden flex-row`, a 6 px clay-600 bar down the left, and `p-5` padding —
// ~40 px taller than the plain text it replaced, and a decoration nothing else in the
// app uses.
//
// NOW: a quiet wash, not a card. A half-transparent cream behind the text lifts the
// contrast off the seafoam ground (the actual complaint), with only enough padding to
// keep the letters off its edge. No shadow — shadow-warm is what says "card", and this
// is a heading, not content. No bar. Same ink inside: stone-900 title, stone-800
// subtitle (was stone-700).
//
// Every token used inverts per theme (src/lib/themes.js), so dark and neon need nothing.
//
// TO RESTORE the first version: swap the className below for
//   `rounded-lg bg-cream-50 shadow-warm overflow-hidden flex-row ${className}`
// and wrap children as <View className="w-1.5 bg-clay-600" /><View className="flex-1 p-5">{children}</View>.
//
// TO DROP IT ENTIRELY on a screen: each screen's comment records the plain <View> it replaced.
export default function PageIntro({ className = '', children }) {
  return (
    <View className={`rounded-md bg-cream-50/60 px-4 py-3 ${className}`}>
      {children}
    </View>
  )
}
