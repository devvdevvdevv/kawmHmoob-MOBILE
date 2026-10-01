import { useQuizSettings } from '../../context/QuizSettingsContext.jsx'
import { useQuizPrefs } from '../../lib/quizPrefs.js'
import QuizSettingsSheet from './QuizSettingsSheet.jsx'

// Renders the quiz/study settings sheet at the ThemedShell ROOT, as a sibling of
// GlobalHeader and GlobalTabBar — which is the only place an absolute-fill
// overlay actually covers the whole screen. See QuizSettingsContext for why a
// screen-level mount could never do it, however high its zIndex.
//
// Same job as CelebrationOverlay and the PageInfoModal mounted by GlobalHeader.
// Renders nothing at all until a screen opens it.
export default function QuizSettingsHost() {
  const { settings, closeQuizSettings } = useQuizSettings()
  const { prefs, setPref } = useQuizPrefs()

  if (!settings) return null

  return (
    <QuizSettingsSheet
      visible
      onClose={closeQuizSettings}
      prefs={prefs}
      setPref={setPref}
      notes={settings.notes}
    />
  )
}
