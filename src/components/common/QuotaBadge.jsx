import { View, Text } from 'react-native'

// The "N left today" signifier for a daily free-tier quota. Feed it the values
// from useDailyQuota. Renders nothing when the quota is disabled (Pro — no cap)
// or still loading, so it's safe to drop anywhere.
//
//   const q = useDailyQuota('speak', 3, { enabled: !isPro })
//   <QuotaBadge {...q} label="practices" />
export default function QuotaBadge({ remaining, limit, enabled = true, ready = true, label = 'left' }) {
  if (!enabled || !ready) return null
  const out = remaining <= 0
  return (
    <View className={`rounded-full px-2.5 py-0.5 ${out ? 'bg-clay-500' : 'bg-cream-200'}`}>
      <Text className={`text-[10px] uppercase tracking-wider font-medium ${out ? 'text-cream-50' : 'text-stone-600'}`}>
        {out ? 'Daily limit reached' : `${remaining} of ${limit} ${label}`}
      </Text>
    </View>
  )
}
