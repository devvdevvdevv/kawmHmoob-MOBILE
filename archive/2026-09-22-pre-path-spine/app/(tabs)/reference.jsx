
// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
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
//             <Pressable className="rounded-md bg-cream-50 p-5">
//               <Text className="font-serif text-xl text-stone-900 mb-2">{l.title}</Text>
//               <Text className="text-sm font-medium text-stone-600">{l.desc}</Text>
//             </Pressable>
//           </Link>
//         ))}
//       </View>
//     </TabScreen>
//   )
// }


// Above contains the original Reference.jsx - Please do NOT delete it. 

import { View, Text, Pressable } from 'react-native'   // Pressable: for the grammar "Learn this" link
import { useState, useEffect } from 'react'
import { Link, useLocalSearchParams } from 'expo-router'  // Link + deep-link tab param
import TabScreen from '../../src/components/TabScreen.jsx'
import Tabs from '../../src/components/Tabs.jsx'
// Data — the grouped/tone/grammar exports from reference.js
import { consonantGroups, vowelGroups, tones, grammar } from '../../src/data/reference.js'
import LetterGrid from '../../src/components/reference/LetterGrid.jsx'
import ToneRows from '../../src/components/reference/ToneRows.jsx'
import GlobalSearch from '../../src/components/common/GlobalSearch.jsx'   // the Search tab (mirrors the drawer)
import Icon from '../../src/components/ui/Icon.jsx'                 // the mic on the practice links
import { wordFamilies } from '../../src/data/wordFamilies.js'       // to verify a drill exists before linking
import { SPEAK_ENABLED } from '../../src/lib/launch.js'
import Svg, { Path } from 'react-native-svg'                        // for the "Learn this" arrow
import { useTheme } from '../../src/context/ThemeContext.jsx'       // to color the arrow per theme
import { THEME_TOKENS } from '../../src/lib/themes.js'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'

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



// Valid tab ids, so a bad ?tab= can't break the page.
const TAB_IDS = TABS.map((t) => t.id)
const validTab = (v) => (typeof v === 'string' && TAB_IDS.includes(v) ? v : null)

export default function Reference() {
  // A `?tab=` param (e.g. from search deep-links) picks the starting tab.
  const { tab: tabParam } = useLocalSearchParams()
  const [tab, setTab] = useState(validTab(tabParam) || 'consonants')

  // If the param changes while this screen is already mounted (e.g. tapping an
  // alphabet result while on the Reference → Search tab), follow it.
  useEffect(() => {
    const next = validTab(tabParam)
    if (next) setTab(next)
  }, [tabParam])

  return (
    <TabScreen>
      {/* ⚠️ NO PROGRESS BAR HERE, deliberately — 2026-09-09. Every other hub
          got one, and this is the one screen where it would be wrong: Reference
          is a place you LOOK THINGS UP, not a thing you work through. "12 of 62
          letters" would invent a goal nobody has, and make a dictionary feel
          like homework. The eyebrow and the heading step are what it shares
          with the others; the progress bar is what it correctly does not. */}
      <View className="mb-8">
        <Eyebrow dot="bg-cream-600" className="mb-2">Reference</Eyebrow>

        <Text className="font-serif text-4xl text-stone-900 mb-3">Look it up.</Text>

        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Letters, tones, and grammar at a glance.
        </Text>
      </View>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* One section per tab. consonants + vowels share GroupedLetters. */}
      {tab === 'consonants' && <GroupedLetters groups={consonantGroups} kind="consonant" />}
      {tab === 'vowels' && <GroupedLetters groups={vowelGroups} kind="vowel" />}
      {tab === 'tones' && (
        <View>
          <ToneRows items={tones} />
          <PracticeLink href="/speak/group/speak-tones" label="the eight tones" />
        </View>
      )}
      {tab === 'grammar' && <GrammarTables sections={grammar} />}
      {tab === 'search' && <GlobalSearch />}
    </TabScreen>
  )
}

// ── Helpers (below the default export, per convention) ───────────────────────

// GroupedLetters — Single/Double/… sections, each a LetterGrid.
// groups: consonantGroups OR vowelGroups → [{ id, title, blurb, items }]
// ⚠️ `kind` IS REQUIRED, not decoration. consonantGroups and vowelGroups BOTH
// use the ids 'single' and 'double', and this component cannot tell which set
// it was handed. Building the speak href from `g.id` alone would send the vowel
// sections to consonant practice — a link that works, goes somewhere real, and
// is wrong.
function GroupedLetters({ groups, kind }) {
  return (
    <View className="gap-8">
      {groups.map((g) => (
        <View key={g.id}>
          <View className="mb-3">
            {/* title stays stone-900; the (count) is the muted stone-400 part */}
            <Text className="font-serif text-xl text-stone-900">
              {g.title} <Text className="text-stone-400">({g.items.length})</Text>
            </Text>
            <Text className="text-sm font-medium text-stone-600">{g.blurb}</Text>
          </View>
          <LetterGrid items={g.items} />
          <PracticeLink href={familyHref(kind, g.id)} label={practiceLabel(kind, g.id)} />
        </View>
      ))}
    </View>
  )
}

// Reference group → Speak word-family route. The family ids follow
// `family-<kind>-<size>`, e.g. family-consonant-double.
//
// ⚠️ Returns null when no such family exists, and PracticeLink renders nothing
// for a null href. Reference is DATA and Speak is CONTENT — a letter group can
// exist here with no drill written for it yet, and a dead link is worse than no
// link.
function familyHref(kind, groupId) {
  const id = `family-${kind}-${groupId}`
  return wordFamilies.some((f) => f.id === id) ? `/speak/family/${id}` : null
}

function practiceLabel(kind, groupId) {
  const family = wordFamilies.find((f) => f.id === `family-${kind}-${groupId}`)
  return family ? family.title.toLowerCase() : null
}

/**
 * "Try practising them →" — the bridge from reading a table to saying it aloud.
 *
 * Reference tells you a letter exists; Speak is where you produce it. Without
 * this the two tabs are strangers and the learner has to know the drill is
 * there at all.
 */
function PracticeLink({ href, label }) {
  // No route, no drill, or Speak switched off → render nothing at all.
  if (!href || !SPEAK_ENABLED) return null
  return (
    <Link href={href} asChild>
      <Pressable className="flex-row items-center justify-between gap-3 rounded-md bg-cream-100 px-4 py-3 mt-3 active:bg-cream-200">
        <Text className="text-sm font-semibold text-stone-800 flex-1">
          Try practising {label}
        </Text>
        <Icon name="mic" size={18} tone="accent" />
      </Pressable>
    </Link>
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
        <View key={s.title} className="rounded-md bg-cream-50 p-5">
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


