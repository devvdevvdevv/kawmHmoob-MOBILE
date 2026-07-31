import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'

// ToneRows — one row per tone: marker, name, description, Cim name, audio.
// RN port of the web components/reference/ToneRows.jsx.
// items: [{ marker, name, description, example, example2, audio }]
//
// See the bottom of this file for the original hand-written version (archived)
// and a detailed changelog of what was wrong and why the fix works.
export default function ToneRows({ items }) {
  return (
    <View className="gap-2">
      {items.map((t) => (
        // Row = THREE siblings side by side: marker | middle (flex-1) | audio
        <View
          key={t.name}
          className="rounded-md bg-cream-50 border border-cream-200 flex-row items-center gap-4 p-4"
        >
          {/* Marker — a Text (not a View): text styles only work on Text in RN */}
          <Text className="w-10 font-serif text-2xl text-clay-700 text-center">
            {t.marker || '–'}
          </Text>

          {/* Middle column — takes the remaining width, stacks vertically */}
          <View className="flex-1">
            <Text className="font-semibold text-stone-800">{t.name}</Text>
            <Text className="text-sm text-stone-600">{t.description}</Text>
            <Text className="text-sm text-stone-700 italic">{t.example2}</Text>
          </View>

          <AudioButton audioSrc={t.audio} wordId={t.name} />
        </View>
      ))}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHANGELOG — what the first (hand-written) attempt got wrong, and the fix.
// Kept as a learning record.
//
// 1. import "react-natve" → "react-native"   (you fixed this ✓)
//    Typo in the package name. A module that doesn't exist = the file never
//    imports; the whole screen crashes before rendering.
//
// 2. import "../components/common/AudioButton.jsx" → "../common/AudioButton.jsx"
//    (you fixed the path ✓) — BUT a trailing space had crept into the string
//    ("...AudioButton.jsx "). Metro resolves the literal string, so the space
//    makes it a different, non-existent path → "unable to resolve module".
//    Whitespace inside an import specifier is never ignored. Removed it.
//    (Why "../common": this file is in src/components/reference/, so ".." is
//    already src/components/; "../components/common" pointed at the bogus
//    src/components/components/common/.)
//
// 3. Broken nesting (the big one). The marker <View> (w-10) was never closed
//    before the flex-1 middle column and the <AudioButton>, so BOTH were nested
//    INSIDE the 40px-wide marker box. Result: everything crammed into a tiny
//    column. A tone row must have THREE SIBLINGS in a flex-row:
//        marker  |  flex-1 middle  |  AudioButton
//    Fix: close the marker immediately, then open the middle column as a sibling.
//
// 4. Marker was <View className="...text styles..."> wrapping <View><Text>.
//    In RN, text styles (font-serif, text-2xl, text-clay-700, text-center) do
//    NOTHING on a View — they must sit on the <Text>. Collapsed the three nested
//    elements into a single styled <Text>.
//
// 5. className="surface" → "rounded-md bg-cream-50 border border-cream-200"
//    `surface` is a web-only utility; it isn't defined in this RN app, so the
//    card had no background/border/radius. Used the explicit token classes.
//
// 6. font-display → font-serif   (this app's serif class is font-serif)
//
// 7. text-clay-800 → text-stone-800   (matches the web; clay-800 isn't a token)
//
// 8. "hidden sm:block" on example2 — web-only responsive classes, dead in RN.
//    Removed; example2 just always shows in the stacked middle column.
//
// 9. Unused imports Pressable and Link removed (ToneRows navigates nothing).
// ─────────────────────────────────────────────────────────────────────────────

// ── ARCHIVE: original hand-written version (do not use — see changelog above) ──
//
// import {View, Text, Pressable} from "react-native"
// import {Link} from "expo-router"
// import AudioButton from "../common/AudioButton.jsx "
//
// export default function ToneRows({items}){
//     return(
//         <View className="gap-2">
//            {items.map((t) => (
//                 <View key={t.name} className="surface flex-row items-center p-4 gap-4">
//                     <View className="w-10 font-display text-2xl text-clay-700 text-center">
//                         <View>
//                             <Text>
//                                 {t.marker || '-'}
//                             </Text>
//                         </View>
//                         {/* Spacing */}
//                     <View className="flex-1 min-w-0">
//                         <Text className="font-semibold text-clay-800">
//                             {t.name}
//                         </Text>
//                         <Text className="text-sm text-stone-600">
//                             {t.description}
//                         </Text>
//                         <Text className="text-sm text-stone-700 italic hidden sm:block">
//                             {t.example2}
//                         </Text>
//                     </View>
//                     <AudioButton audioSrc={t.audio} wordId={t.name}/>
//                     </View>
//                 </View>
//            ))}
//         </View>
//     );
// }
