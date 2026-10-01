import { Redirect } from 'expo-router'

// The /quiz MENU is RETIRED — it listed the same categories the Vocabulary page
// lists, one card each, just with a score on them. Two pages, one story. The
// merged page is /vocabulary (see src/components/vocabulary/VocabCategoryGrid),
// which absorbed the menu's score badges, unlock gate, quota badge, overall
// progress bar, and the non-vocab drills.
//
// Only the MENU is gone. /quiz/[topicId] — the quiz engine itself — is very much
// alive; every quiz still runs there, it just exits back to Vocabulary now.
//
// Kept as a redirect so old links (and anything still pointing at /quiz) land on
// the merged page instead of a 404. The original screen is preserved commented
// below: uncomment it, delete the Redirect, and the old menu is back for
// debugging. See notes/2026-08-29-vocabulary-quiz-merge.
export default function QuizMenuScreen() {
  return <Redirect href="/vocabulary" />
}

/* ─── ORIGINAL /quiz MENU SCREEN — retired, kept for debugging ─────────────────
import TabScreen from '../../src/components/TabScreen.jsx'
import QuizMenu from '../../src/components/quiz/QuizMenu.jsx'

export default function QuizMenuScreen() {
  return (
    <TabScreen>
      <QuizMenu />
    </TabScreen>
  )
}
─────────────────────────────────────────────────────────────────────────────── */
