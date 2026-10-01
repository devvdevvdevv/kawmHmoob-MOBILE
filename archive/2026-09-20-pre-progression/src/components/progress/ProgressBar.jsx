import { View, Text } from 'react-native'

// The app's progress bar. One implementation — screens were hand-rolling the
// track/fill/percentage triple inline, which is how you end up with four bars in
// four slightly different greys.
//
//   <ProgressBar value={12} max={46} label="Quizzes taken" />   header + bar
//   <ProgressBar value={5} max={20} hint="5/20 studied" />      caption only
//   <ProgressBar value={5} max={20} size="sm" />                bare bar, in a row
//
// `hint` overrides the default "value / max" caption on the right. Track is
// cream-300, not cream-200: on a cream-50 card the lighter track was invisible.
export default function ProgressBar({
  value,
  max = 100,
  label,
  hint,
  size = 'md',
  className = '',
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const showHeader = Boolean(label || hint)

  return (
    <View className={className}>
      {showHeader && (
        <View className="flex-row justify-between items-center gap-2 mb-1.5">
          <Text className="text-xs font-medium text-stone-700">{label || ''}</Text>
          <Text className="text-xs font-medium text-stone-600">
            {hint || `${value} / ${max}`}
          </Text>
        </View>
      )}
      <View
        className={`w-full bg-cream-300 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}
      >
        <View className="h-full bg-clay-600 rounded-full" style={{ width: `${pct}%` }} />
      </View>
    </View>
  )
}
