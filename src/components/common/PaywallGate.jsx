import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { canAccess, useSubscription } from '../../context/SubscriptionContext.jsx'
import Button from '../ui/Button.jsx'

export default function PaywallGate({ tier, fallback, contentLabel, children }) {
  const { tier: userTier } = useSubscription()
  if (canAccess(tier, userTier)) return children
  return fallback || <UpgradeCard contentLabel={contentLabel} />
}

function UpgradeCard({ contentLabel }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-8 items-center max-w-xl self-center">
      <Text className="text-xs uppercase tracking-[3px] text-clay-600 mb-3">Pro content</Text>
      <Text className="font-serif text-3xl text-stone-900 mb-3 text-center">
        {contentLabel || 'This is part of Kawm Hmoob Pro'}
      </Text>
      <Text className="text-stone-700 mb-6 text-center">
        Upgrade to unlock extended quizzes, full reading library, dialogues, and advanced units. Your free progress stays exactly where it is.
      </Text>
      <View className="flex-row flex-wrap gap-3 justify-center">
        <Link href="/account" asChild>
          <Button variant="primary">See plans</Button>
        </Link>
        <Link href="/learn" asChild>
          <Button variant="secondary">Back to free lessons</Button>
        </Link>
      </View>
    </View>
  )
}
