import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Icon from '../ui/Icon.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { isAdmin } from '../../lib/admin.js'
import Eyebrow from '../ui/Eyebrow.jsx'
import { continueTarget, stepHref } from '../../lib/pathProgress.js'

// "Continue" — the single answer to "what do I do now?". One tap, straight into
// the next step of the next unfinished unit. The design note's whole argument
// for the path rests on this card existing.
//
// When the next unit needs Pro, the card says so and opens the unit screen —
// which explains it — rather than dropping the learner onto a paywall cold.
export default function ContinueCard({ progress, hasPro }) {
  // Admins: every unit counts as open (2026-09-25) — see unitStatus.
  const { user } = useAuth()
  const target = continueTarget(progress, hasPro, { admin: isAdmin(user) })

  if (!target) {
    return (
      <View className="rounded-lg bg-cream-50 shadow-warm p-6">
        {/* Was: "Beginner path" — renamed 2026-09-26. */}
        <Eyebrow className="mb-2">Paths</Eyebrow>
        <Text className="font-serif text-2xl text-stone-900">Every unit done. 🎉</Text>
        <Text className="text-sm font-medium text-stone-700 mt-1">
          More units open as they are written. Keep practising in the meantime.
        </Text>
      </View>
    )
  }

  const { unit, status, step } = target
  const needsPro = status === 'pro'
  const href = needsPro || !step ? `/path/${unit.id}` : stepHref(unit.id, step.key)

  return (
    <Link href={href} asChild>
      <Pressable className="rounded-lg bg-cream-50 shadow-warm p-6 active:opacity-90">
        <Eyebrow className="mb-2">{needsPro ? 'Next unit' : 'Continue'}</Eyebrow>
        {/* Hmong first, English under (2026-09-23) — see hmongTitle in
            src/data/path.js. This card is on Home and the Words hub, so it is
            where the Hmong name is seen most. */}
        <Text className="font-serif text-3xl text-stone-900">
          {unit.hmongTitle || unit.title}
        </Text>
        {unit.hmongTitle && (
          <Text className="text-sm font-medium text-stone-500 mt-0.5">{unit.title}</Text>
        )}
        <Text className="text-base font-medium text-stone-700 mt-1 mb-3">
          {needsPro
            ? 'Part of KawmHmong Pro.'
            : step ? `${step.title} — ${step.blurb}` : unit.blurb}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm font-semibold text-clay-700">
            {needsPro ? 'See what’s inside' : step ? `Start ${step.title.toLowerCase()}` : 'Open the unit'}
          </Text>
          <Icon name="arrowRight" size={16} tone="accent" />
        </View>
      </Pressable>
    </Link>
  )
}
