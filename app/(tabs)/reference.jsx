// import { View, Text, Pressable } from 'react-native'
// import { Link } from 'expo-router'
// import TabScreen from '../../src/components/TabScreen.jsx'

// // Reference is the hub the original web app used to gather the alphabet and
// // grammar tables. The detailed screens still live at the root /alphabet and
// // /course routes, so this tab links out to them for now.
// const links = [
//   { to: '/reference', title: 'Alphabet', desc: 'Consonants, vowels, and tones.' },
//   { to: '/course', title: 'Grammar & Course', desc: 'Grammar tables, everyday phrases, and reading.' },
// ]

// export default function Reference() {
//   return (
//     <TabScreen>
//       <View className="mb-6">
//         <Text className="font-serif text-4xl text-stone-900 mb-2">Reference</Text>
//         <Text className="text-stone-700">
//           The building blocks — alphabet, tones, and grammar — in one place.
//         </Text>
//       </View>

//       <View className="gap-4">
//         {links.map((l) => (
//           <Link key={l.to} href={l.to} asChild>
//             <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5">
//               <Text className="font-serif text-xl text-stone-900 mb-2">{l.title}</Text>
//               <Text className="text-sm text-stone-600">{l.desc}</Text>
//             </Pressable>
//           </Link>
//         ))}
//       </View>
//     </TabScreen>
//   )
// }


// Above contains the original Reference.jsx - Please do NOT delete it. 

import { View, Text, Pressable } from 'react-native'   // Pressable: for the grammar "Learn this" link
import { useState } from 'react'
import { Link } from 'expo-router'                       // Link: for the grammar "Learn this" link
import TabScreen from '../../src/components/TabScreen.jsx'
import Tabs from '../../src/components/Tabs.jsx'
// Data — the grouped/tone/grammar exports from reference.js
import { consonantGroups, vowelGroups, tones, grammar } from '../../src/data/reference.js'
import LetterGrid from '../../src/components/reference/LetterGrid.jsx'
import ToneRows from '../../src/components/reference/ToneRows.jsx'
import GlobalSearch from '../../src/components/common/GlobalSearch.jsx'   // the Search tab (mirrors the drawer)
import Svg, { Path } from 'react-native-svg'                        // for the "Learn this" arrow
import { useTheme } from '../../src/context/ThemeContext.jsx'       // to color the arrow per theme
import { THEME_TOKENS } from '../../src/lib/themes.js'

// Module-level config (not hoisted → keep it ABOVE the component)
const TABS = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
  { id: 'grammar', label: 'Grammar' },
  { id: 'search', label: 'Search' },
]




// function ArrowRightIcon({color, size=20}){
//     return(

//         <SVG width={size} height={size} viewBox="0 0 24 24 " fill={none} stroke={color} strokeWidth={2} strokeLinecap={round} strokeLinejoin={round}>
//             <Path d="M4 12h15" /><Path d="M13 6l6 6-6 6" />
//         </SVG>

//     );
// }



export default function Reference() {
  // Which tab is showing. Default to the first.
  const [tab, setTab] = useState('consonants')

  return (
    <TabScreen>
      <View className="mb-6">
        <Text className="font-serif text-3xl text-stone-900 mb-2">Reference</Text>
        <Text className="text-base text-stone-700">Letters, tones, and grammar at a glance — or search it all.</Text>
      </View>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* One section per tab. consonants + vowels share GroupedLetters. */}
      {tab === 'consonants' && <GroupedLetters groups={consonantGroups} />}
      {tab === 'vowels' && <GroupedLetters groups={vowelGroups} />}
      {tab === 'tones' && <ToneRows items={tones} />}
      {tab === 'grammar' && <GrammarTables sections={grammar} />}
      {tab === 'search' && <GlobalSearch />}
    </TabScreen>
  )
}

// ── Helpers (below the default export, per convention) ───────────────────────

// GroupedLetters — Single/Double/… sections, each a LetterGrid.
// groups: consonantGroups OR vowelGroups → [{ id, title, blurb, items }]
function GroupedLetters({ groups }) {
  return (
    <View className="gap-8">
      {groups.map((g) => (
        <View key={g.id}>
          <View className="mb-3">
            {/* title stays stone-900; the (count) is the muted stone-400 part */}
            <Text className="font-serif text-xl text-stone-900">
              {g.title} <Text className="text-stone-400">({g.items.length})</Text>
            </Text>
            <Text className="text-sm text-stone-600">{g.blurb}</Text>
          </View>
          <LetterGrid items={g.items} />
        </View>
      ))}
    </View>
  )
}

// Small right-arrow for the "Learn this" link (svg, theme-colored — like VocabList).
function ArrowRightIcon({ color, size = 14 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12h15" />
      <Path d="M13 6l6 6-6 6" />
    </Svg>
  )
}

// GrammarTables — one card per cheat sheet.
// sections: grammar → [{ title, note, lesson?: {unitId, lessonId}, items:[{hmong, english}] }]
function GrammarTables({ sections }) {
  const { theme } = useTheme()
  const arrowColor = `rgb(${(THEME_TOKENS[theme] || THEME_TOKENS.light)['--c-clay-700']})`

  return (
    <View className="gap-5">
      {/* OUTER map = the cards (one per grammar section `s`) */}
      {sections.map((s) => (
        <View key={s.title} className="rounded-md bg-cream-50 border border-cream-200 p-5">
          {/* Title */}
          <Text className="font-serif text-xl text-stone-900">{s.title}</Text>
          {/* Note */}
          <Text className="text-sm text-stone-500 italic mb-2">{s.note}</Text>

          {/* INNER map = the rows inside this card. border-t on rows after the first. */}
          {s.items.map((it, i) => (
            <View key={it.hmong} className={`flex-row justify-between py-2 ${i > 0 ? 'border-t border-cream-200' : ''}`}>
              <Text className="text-clay-700 font-semibold">{it.hmong}</Text>
              <Text className="text-stone-600">{it.english}</Text>
            </View>
          ))}

          {/* Learn this → : inside the card, AFTER the rows, only when a lesson exists */}
          {s.lesson && (
            <Link href={`/learn/${s.lesson.unitId}/${s.lesson.lessonId}`} asChild>
              <Pressable className="flex-row items-center gap-1.5 mt-4">
                <Text className="text-sm font-medium text-clay-700">Learn this</Text>
                <ArrowRightIcon color={arrowColor} size={14} />
              </Pressable>
            </Link>
          )}
        </View>
      ))}
    </View>
  )
}

// (Search is now the shared <GlobalSearch/> — rendered by the Search tab above and
// the drawer's /search route, so they mirror.)


