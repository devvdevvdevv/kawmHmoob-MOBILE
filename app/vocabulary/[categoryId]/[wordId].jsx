import { View } from 'react-native'
import TabScreen from '../../../src/components/TabScreen.jsx'
import { useSwipeBack } from '../../../src/hooks/useSwipeBack.js'
import WordDetail from '../../../src/components/vocabulary/WordDetail.jsx'
// Unused since the word-page gate was lifted (2026-09-26) — kept for the restore below.
// import { useLocalSearchParams } from 'expo-router'
// import PaywallGate from '../../../src/components/common/PaywallGate.jsx'
// import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
// import { canOpenCategory } from '../../../src/lib/vocabAccess.js'

// ⚠️ A WORD'S OWN PAGE IS FREE — 2026-09-26. It was locked on 2026-09-25 with
// its set ("a word inside a locked set is locked too"), and that turned out to
// make the DICTIONARY look broken: the author reported "lots of words still
// without definitions, like tshawb". tshawb was defined — but it lives in a
// reading-* group, so for a free account every search result and every "Open
// in dictionary" from the reader landed on the upgrade card instead of the word.
// ~500 story words behaved that way.
//
// The line now: DEFINITIONS are free everywhere (this page, like the reader's
// long-press lookup); STUDY is Pro for topic sets — the set/deck page
// (app/vocabulary/[categoryId]/index.jsx), its flashcards, its quiz — and
// saving a word stays Pro (WordDetail's own Save rule).
//
// RESTORE THE LOCK by bringing back the block below and its imports.
//   const { categoryId } = useLocalSearchParams()
//   const { isPro } = useSubscription()
//   if (!canOpenCategory(String(categoryId), isPro)) {
//     return (
//       <TabScreen>
//         <PaywallGate tier="pro" contentLabel="This word set is part of Kawm Hmoob Pro">{null}</PaywallGate>
//       </TabScreen>
//     )
//   }
export default function WordDetailScreen() {
  // Swipe right to go back to the previous page (2026-09-30, author: "swipe off of dictionary").
  // Was: <TabScreen> with no wrapper.
  const swipeBack = useSwipeBack()
  return (
    <View style={{ flex: 1 }} {...swipeBack}>
      <TabScreen>
        <WordDetail />
      </TabScreen>
    </View>
  )
}
