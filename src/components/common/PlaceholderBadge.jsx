import { View, Text } from 'react-native'
import { useAuth } from '../../context/AuthContext.jsx'
import { isAdmin } from '../../lib/admin.js'

// "Placeholder" pill — 2026-09-28 (author: "if it's placeholder indicate it, color code it or
// something"). Shown wherever a lesson with `placeholder: true` appears: the lesson card, the
// path unit's lesson preview, and the lesson screen. Orange so it never reads as Pro (clay) or
// Done (emerald). Static className only — function-style styles render invisible on native.
//
// ⚠️ ADMIN ONLY — 2026-09-28 (author: "hide the placeholder tags for non admin"). The check lives
// HERE, so every place that renders the badge hides it for learners without its own guard.
// `note` (the lesson screen's "A draft…" line) is part of the badge for the same reason.
export default function PlaceholderBadge({ className = '', note = null }) {
  const { user } = useAuth()
  if (!isAdmin(user)) return null
  const pill = (
    <View className={`self-start rounded-full bg-orange-200 px-2 py-0.5 ${note ? '' : className}`}>
      <Text className="text-xs font-semibold text-orange-900">✎ Placeholder</Text>
    </View>
  )
  if (!note) return pill
  return (
    <View className={`flex-row items-center gap-2 ${className}`}>
      {pill}
      <Text className="text-xs font-medium text-stone-600 flex-1">{note}</Text>
    </View>
  )
}
