
// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// ─────────────────────────────────────────────────────────────────────────────
// 🧪 SPEAK LAB — sandbox for the lesson flow.
//
// Route: /speak-lab   (file-based routing — this file IS the route.)
// Reached from /dev. AdminGate guards it, because a deep link walks past a
// hidden menu item (same reasoning as /spike).
//
// The lesson MECHANICS live in src/components/speak/ and are shared with the
// real route at /speak/lesson/[lessonId]:
//   • LessonScroll.jsx — the chat-style presentation
//   • LessonSteps.jsx  — the step components
// That is deliberate: a sandbox that drifts from shipping code stops being a
// useful sandbox.
//
// What is still different here:
//   • reads src/data/speakLab.js (throwaway script) not speakLessons.js
//   • no quota, no Pro lock, no SPEAK_ENABLED gate — it is admin-only
//
// ⚠️ scroll={false}: LessonScroll owns its own ScrollView. TabScreen scrolls by
// default, and nesting two breaks both.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { View, Text } from 'react-native'
import TabScreen from '../src/components/TabScreen.jsx'
import AdminGate from '../src/components/common/AdminGate.jsx'
import LessonScroll from '../src/components/speak/LessonScroll.jsx'
import LessonCompleteModal from '../src/components/speak/LessonCompleteModal.jsx'
import { LAB_LESSON } from '../src/data/speakLab.js'

export default function SpeakLab() {
  const [finished, setFinished] = useState(null)
  const [runKey, setRunKey] = useState(0)

  return (
    <AdminGate>
      <>
      <TabScreen scroll={false}>
        <Text className="font-serif text-2xl text-stone-900 mb-1">Speak Lab 🧪</Text>
        <View className="rounded-md bg-cream-100 p-3 mb-4">
          <Text className="text-xs text-stone-700">
            Sandbox. Same engine as the real lessons — only the data and the
            missing quota/Pro gates differ.
          </Text>
        </View>

        <LessonScroll
          key={runKey}
          lesson={LAB_LESSON}
          onFinish={(stats) => setFinished(stats)}
        />
      </TabScreen>

      {/* Sibling of TabScreen — absoluteFill only fills its PARENT, so a modal
          rendered inside the padded TabScreen box is clipped to it. */}
      <LessonCompleteModal
        visible={Boolean(finished)}
        lessonTitle={LAB_LESSON.title}
        stats={finished}
        nextLesson={null}
        onRedo={() => { setFinished(null); setRunKey((k) => k + 1) }}
        onNextLesson={() => setFinished(null)}
        onExit={() => setFinished(null)}
      />
      </>
    </AdminGate>
  )
}
