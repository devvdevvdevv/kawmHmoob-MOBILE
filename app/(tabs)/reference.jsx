
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
import PageIntro from '../../src/components/ui/PageIntro.jsx'
import Tabs from '../../src/components/Tabs.jsx'
// Data — the grouped/tone/grammar exports from reference.js
import { consonantGroups, vowelGroups, vowels, tones, grammar } from '../../src/data/reference.js'
import LetterGrid from '../../src/components/reference/LetterGrid.jsx'
import VoiceToggle from '../../src/components/reference/VoiceToggle.jsx'
import { useVoicePrefs } from '../../src/lib/voicePrefs.js'
// ToneRows (the unlinked rows) is still used by app/alphabet/[tab].jsx — this
// screen renders the linked variant instead (2026-10-14).
import { ToneRowsLinked } from '../../src/components/reference/ToneRows.jsx'
import VowelToneGrid from '../../src/components/reference/VowelToneGrid.jsx'
import ToneAudioNote from '../../src/components/reference/ToneAudioNote.jsx'
import { useAuth } from '../../src/context/AuthContext.jsx'
import { isAdmin } from '../../src/lib/admin.js'
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
  // Vowel × tone — the spelling table (2026-10-14). Its own tab rather than a
  // section inside Vowels or Tones: it belongs to BOTH, and burying a
  // horizontally-scrolling 13×8 table under either one hides it.
  { id: 'vowel-tones', label: 'Vowel + tone' },
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
  // Which recorded speaker LetterGrid's audio buttons play — 2026-10-24.
  const { voice, setVoice } = useVoicePrefs()

  // ── ⚠️ THE FULL 13×8 GRID IS DEV-ONLY — 2026-10-14 ─────────────────────────
  //
  // Author: "Keep what you have, but keep it only accessible for dev accounts."
  // A learner reaches the same material through the Tones and Vowels tabs now,
  // one tone or one vowel at a time; the whole grid is the author's overview.
  //
  // `isAdmin(user)`, NOT `__DEV__` — the same choice the reading library and
  // "Spell it out" made: a real device signed in as an admin account should see
  // it, not only a dev build.
  //
  // ⚠️ THE TAB IS FILTERED FROM THE LIST **AND** THE RENDER IS GUARDED. Hiding
  // only the tab leaves `/reference?tab=vowel-tones` working for anyone with the
  // link, and hiding only the render leaves a tab that shows nothing. The route
  // itself is not gated — the destination guard is the tab body, which is the
  // same pattern AdminGate.jsx documents.
  const { user } = useAuth()
  const showGrid = isAdmin(user)
  const visibleTabs = TABS.filter((t) => t.id !== 'vowel-tones' || showGrid)

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
      {/* On a PageIntro card, 2026-10-25 (contrast placeholder; see PageIntro.jsx).
          Was: <View className="mb-8"> … </View>, subtitle text-stone-700. */}
      <PageIntro className="mb-8">
        <Eyebrow dot="bg-cream-600" className="mb-2">Reference</Eyebrow>

        <Text className="font-serif text-4xl text-stone-900 mb-3">Look it up.</Text>

        <Text className="text-base font-medium text-stone-800 leading-relaxed">
          Letters, tones, and grammar at a glance.
        </Text>
      </PageIntro>

      <Tabs tabs={visibleTabs} active={tab} onChange={setTab} />

      {/* One section per tab. consonants + vowels share GroupedLetters. */}
      {tab === 'consonants' && (
        <>
          <VoiceToggle voice={voice} onChange={setVoice} />
          <GroupedLetters groups={consonantGroups} kind="consonant" />
        </>
      )}
      {/* Toggle added 2026-10-25 — Emily's no-tone syllables are her bare vowels.
          Was: {tab === 'vowels' && <GroupedLetters groups={vowelGroups} kind="vowel" />} */}
      {tab === 'vowels' && (
        <>
          <VoiceToggle voice={voice} onChange={setVoice} />
          <GroupedLetters groups={vowelGroups} kind="vowel" />
        </>
      )}
      {tab === 'tones' && (
        <View>
          {/* ⚠️ ABOVE the rows, not under them — 2026-10-18. This is the tab where someone
              first hears a Hmong tone, and the flag only does its job if it is read BEFORE
              the clips, not after. */}
          <ToneAudioNote className="mb-4" />
          {/* Toggle added 2026-10-25 — Emily recorded the eight Cim names. */}
          <VoiceToggle voice={voice} onChange={setVoice} />
          {/* Linked rows — each tone offers "see it on every vowel" (2026-10-14). */}
          <ToneRowsLinked items={tones} />
          <PracticeLink href="/speak/group/speak-tones" label="the eight tones" />
        </View>
      )}
      {/* Toggle added 2026-10-25 — Emily recorded the single vowels in all eight tones. */}
      {tab === 'vowel-tones' && showGrid && (
        <>
          <VoiceToggle voice={voice} onChange={setVoice} />
          <VowelToneGrid vowels={vowels} tones={tones} />
        </>
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
          {/* ⚠️ VOWELS ONLY — 2026-10-14 (author: "each vowel would get their own
              page, containing everything for that vowel"). Consonants have no
              per-letter page, so they get no row of links. The links sit UNDER
              the grid rather than making the tiles tappable: a tile already holds
              an audio button, and a link wrapping a button is a coin-toss tap. */}
          {kind === 'vowel' ? <VowelLinks items={g.items} /> : null}
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
    // ⚠️ RESTYLED 2026-10-15 (author: "for the speak section in the alphabet page, we
    // need to make the ui better there"). It was a thin cream-100 strip with the mic on
    // the RIGHT, directly under the cream-50 cards of VowelLinks and the cream-50 tiles
    // of LetterGrid — the only navigation element on the page that did not look like the
    // others, and the mic sat exactly where every other row in this app puts its "go"
    // arrow, so it read as a status icon rather than a destination.
    //
    // Now the app's standard row: icon chip left, title + what-happens-next line,
    // arrow right (Home's Explore list, About's footer links, the paywall's features).
    // ⚠️ ONLY THIS COMPONENT CHANGED. The letter grids, the groups and their order are
    // untouched — the complaint was that this row was weak, not that the page was wrong.
    <View className="mt-4">
      {/* The dot is clay-600, Speak's own tab-indicator token (see Eyebrow.jsx): the
          mark here and the highlighted tab this leads to are the same fact. */}
      <Eyebrow dot="bg-clay-600" className="mb-2">Speak</Eyebrow>
      <Link href={href} asChild>
        <Pressable className="rounded-md bg-cream-50 shadow-warm p-4 flex-row items-center gap-4 active:bg-cream-100">
          <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
            <Icon name="mic" size={20} tone="accent" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-stone-900">
              Practise saying {label}
            </Text>
            {/* What actually happens there. "Try practising" never said. */}
            <Text className="text-sm font-medium text-stone-600 mt-0.5">
              Record yourself, compare to a native speaker.
            </Text>
          </View>
          <Icon name="arrowRight" size={18} tone="muted" />
        </Pressable>
      </Link>
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
      {/* The five biggest grammar ideas, each a quick summary + a link to its full lesson — 2026-09-28
          (author: "create some boxes directly relating to the grammar types … so users have quick
          access to the lessons directly … only the top biggest 5"). The cheat sheets follow. */}
      <GrammarEssentials arrowColor={arrowColor} />
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

// ── GRAMMAR ESSENTIALS — the top five, 2026-09-28 ────────────────────────────
// Each: the idea in one line, one example, and "Learn more" into its dedicated Learn lesson.
// Every line restates a rule the author has settled (see notes/2026-09-28-*). More grammar will
// be added to this page later (author) — add a box here, pointing at its lesson.
const GRAMMAR_ESSENTIALS = [
  {
    title: 'How a sentence is built',
    basic: 'Who, then the verb, then the rest. The verb never changes: noj is noj, whoever eats and whenever.',
    example: 'Kuv noj mov. — I eat.',
    // Was: foundations-action-verbs — the dedicated lesson exists now (2026-09-28).
    lesson: { unitId: 'grammar', lessonId: 'grammar-sentence-structure' },
  },
  {
    title: 'Yog: to be',
    basic: 'Yog links a thing to a noun: what it is. Never put yog before a describing word.',
    example: 'Kuv yog Hmoob. · Nws zoo heev (not Nws yog zoo heev).',
    lesson: { unitId: 'grammar', lessonId: 'foundations-yog-to-be' },
  },
  {
    title: 'Classifiers',
    basic: 'Every noun takes its own counting word, and it comes right before the noun.',
    example: 'ib lub tsev · ob tus aub · peb phau ntawv',
    lesson: { unitId: 'grammar', lessonId: 'foundations-noun-classifiers' },
  },
  {
    title: 'Describing things',
    basic: 'The describing word comes after the noun, and works as the verb by itself.',
    example: 'neeg zoo — a good person · Lub tsev no loj heev.',
    lesson: { unitId: 'grammar', lessonId: 'grammar-adjectives' },
  },
  {
    title: 'Time and tense',
    basic: 'The verb stays the same. A time word or a small marker says when.',
    example: 'Naghmo kuv noj mov. · Kuv yuav noj mov.',
    lesson: { unitId: 'grammar', lessonId: 'foundations-tense-markers' },
  },
]

function GrammarEssentials({ arrowColor }) {
  return (
    <View className="gap-3 mb-3">
      <Text className="font-serif text-2xl text-stone-900">Start here</Text>
      <Text className="text-sm font-medium text-stone-600 -mt-2">The five ideas that hold Hmong grammar together.</Text>
      {GRAMMAR_ESSENTIALS.map((g, i) => (
        <Link key={g.title} href={`/learn/${g.lesson.unitId}/${g.lesson.lessonId}`} asChild>
          <Pressable className="rounded-md bg-cream-50 p-5 active:bg-cream-100">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="h-8 w-8 rounded-full bg-clay-600/15 items-center justify-center">
                <Text className="font-serif text-base text-clay-700">{i + 1}</Text>
              </View>
              <Text className="font-serif text-xl text-stone-900 flex-1">{g.title}</Text>
            </View>
            <Text className="text-sm font-medium text-stone-700 leading-relaxed">{g.basic}</Text>
            <Text className="text-sm font-semibold text-clay-700 mt-2">{g.example}</Text>
            <View className="flex-row items-center gap-1.5 mt-3">
              <Text className="text-sm font-semibold text-clay-700">Learn more</Text>
              <ArrowRightIcon color={arrowColor} size={14} />
            </View>
          </Pressable>
        </Link>
      ))}
      <Text className="font-serif text-2xl text-stone-900 mt-4">Cheat sheets</Text>
    </View>
  )
}

// (Search is now the shared <GlobalSearch/> — rendered by the Search tab above and
// the drawer's /search route, so they mirror.)



// VowelLinks — one chip per vowel, each opening that vowel's own page
// (app/vowel/[letter].jsx) with all eight tones on it. Added 2026-10-14.
// ⚠️ REWORKED 2026-10-14 (author: "Open the vowels to see it in all eight tones,
// we need that ui to be a bit better").
//
// What was wrong with the first version, which was a row of bare letters:
//
//   · A chip saying just `a` repeated the grid directly above it, so the row
//     read as the same letters twice rather than as a different offer.
//   · It said nothing about WHAT you get by tapping. Each chip now previews the
//     set it opens — `ab aj av…` — which is the actual answer to "see it in all
//     eight tones".
//   · The chips were px-3 py-2 around a 16px glyph, under the 44px minimum tap
//     target. Now a full-width row per vowel, which also gives the preview room.
//
// Rows, not chips: a preview needs horizontal space, and thirteen wrapped chips
// of uneven width made a ragged block. One row per vowel reads as a list of
// doors, which is what it is.
function VowelLinks({ items }) {
  return (
    <View className="mt-4">
      <Eyebrow className="mb-2">In all eight tones</Eyebrow>
      <View className="gap-2">
        {items.map((v) => (
          <Link key={v.letter} href={`/vowel/${v.letter}`} asChild>
            <Pressable className="rounded-md bg-cream-50 px-4 py-3 flex-row items-center gap-3 active:bg-cream-100">
              <Text className="font-serif text-2xl text-clay-700 w-10">{v.letter}</Text>
              <View className="flex-1">
                {/* The preview IS the point: it shows the eight written forms
                    this vowel takes, which is what the page behind it holds. */}
                <Text className="font-serif text-sm text-stone-800" numberOfLines={1}>
                  {tones.map((t) => v.letter + t.marker).join('  ')}
                </Text>
                {v.sound ? (
                  <Text className="text-[11px] font-medium text-stone-600 mt-0.5">
                    sounds like “{v.sound}”
                  </Text>
                ) : null}
              </View>
              <Icon name="arrowRight" size={16} tone="muted" />
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
