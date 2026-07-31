import { useMemo } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import { useProgress } from '../src/hooks/useProgress.js'
import { useAuth } from '../src/context/AuthContext.jsx'
import { PASS, tiers, nextMilestone, TYPE_META } from '../src/data/battlepass.js'
import {
  levelFromPoints, MAX_LEVEL, POINTS_TO_MAX, POINT_SOURCES, DAILY_CAP, SEASON, seasonDaysLeft,
} from '../src/lib/leveling.js'

// Season pass — level track + reward tiers, ported from the web BattlePass.
// The RN progress model has no separate season-points bucket yet, so level is
// derived from XP. Rewards are mockups (no partnership exists), same as web.
export default function BattlePass() {
  const { xp } = useProgress()
  const { user } = useAuth()
  const seasonPoints = xp || 0
  const lv = useMemo(() => levelFromPoints(seasonPoints), [seasonPoints])
  const upNext = nextMilestone(lv.level)
  const daysLeft = seasonDaysLeft()

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Season Pass' }]} />

      <View className="mb-8">
        <Text className="text-sm uppercase tracking-[2px] font-semibold text-clay-700 mb-2">{SEASON.title}</Text>
        <Text className="font-serif text-5xl text-stone-900 mb-3">{PASS.title}</Text>
        <Text className="text-lg text-stone-700">
          {daysLeft} days left · {MAX_LEVEL} tiers · {POINTS_TO_MAX.toLocaleString()} points to max
        </Text>
      </View>

      {user.isGuest && <GuestNotice seasonPoints={seasonPoints} />}

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6 mb-8">
        <View className="flex-row flex-wrap items-end justify-between gap-4 mb-5">
          <View>
            <Text className="text-sm uppercase tracking-wider font-semibold text-stone-600 mb-1">Your level</Text>
            <Text className="font-serif text-7xl text-stone-900">{lv.level}</Text>
          </View>
          <View className="items-end">
            <Text className="font-serif text-3xl text-stone-900">
              {seasonPoints.toLocaleString()}<Text className="text-lg text-stone-600"> pts</Text>
            </Text>
            <Text className="text-sm text-stone-600 mt-1">
              {lv.maxed ? 'Max level reached' : `${lv.remaining.toLocaleString()} to level ${lv.level + 1}`}
            </Text>
          </View>
        </View>
        <View className="h-3.5 rounded-full bg-cream-200 overflow-hidden">
          <View className="h-full rounded-full bg-clay-600" style={{ width: `${Math.round(lv.progress * 100)}%` }} />
        </View>
        {upNext && (
          <Text className="text-base text-stone-700 mt-4">
            Up next: <Text className="font-semibold">{upNext.name}</Text> at level {upNext.level}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap items-end justify-between gap-2 mb-4">
        <Text className="font-serif text-3xl text-stone-900">Rewards</Text>
        <Text className="text-sm text-stone-600">{PASS.premiumTrackLabel} · {PASS.premiumPrice}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingVertical: 16, paddingRight: 8 }}
      >
        {tiers.map((tier) => (
          <TierCard key={tier.level} tier={tier} unlocked={lv.level >= tier.level} isCurrent={lv.level === tier.level} />
        ))}
      </ScrollView>
      <Text className="text-sm text-stone-600 mt-1 mb-10">Scroll sideways to see all {MAX_LEVEL} tiers</Text>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6 mb-8">
        <Text className="font-serif text-2xl text-stone-900 mb-2">How you earn</Text>
        <Text className="text-base text-stone-700 mb-5">
          Study actions share a {DAILY_CAP}-point daily cap. Voice recordings have no cap — every
          clip helps build the Hmong speech corpus, so there's no point telling you to stop.
        </Text>
        <View className="gap-3">
          {Object.entries(POINT_SOURCES).map(([id, s]) => (
            <View key={id} className="flex-row items-center justify-between gap-3 rounded-xl bg-cream-100 px-4 py-3">
              <Text className="text-base text-stone-800 flex-1">{s.label}</Text>
              <View className="flex-row items-center gap-2">
                {!s.capped && (
                  <View className="rounded-full bg-emerald-100 px-2.5 py-1">
                    <Text className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800">No cap</Text>
                  </View>
                )}
                <Text className="text-base font-semibold text-stone-900">+{s.points}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="text-base text-stone-700 mb-5">
          <Text className="font-semibold">Everything above is a placeholder.</Text> No partnership
          exists and every business named is invented — they're here to show what the reward track
          could hold, not to advertise anything. Levels are real, rewards are mockups.
        </Text>
        <Link href="/leaderboard" asChild>
          <Button variant="secondary">See the leaderboard</Button>
        </Link>
      </View>
    </TabScreen>
  )
}

function TierCard({ tier, unlocked, isCurrent }) {
  const meta = TYPE_META[tier.type] || { label: tier.type, icon: '🎁' }
  return (
    <View
      className={`w-48 rounded-2xl border p-5 ${unlocked ? 'border-emerald-500/40 bg-emerald-50' : 'border-cream-300 bg-cream-50'} ${isCurrent ? 'border-clay-600' : ''}`}
      style={isCurrent ? { borderWidth: 2 } : undefined}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className={`w-11 h-11 rounded-xl items-center justify-center ${unlocked ? 'bg-emerald-500' : 'bg-cream-200'}`}>
          <Text className="text-xl">{meta.icon}</Text>
        </View>
        {tier.premium && (
          <View className="rounded-full bg-clay-600 px-2 py-1">
            <Text className="text-[10px] uppercase tracking-wider font-bold text-cream-50">Pro</Text>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap items-center gap-1 mb-1.5">
        <Text className={`text-[11px] uppercase tracking-wider font-semibold ${unlocked ? 'text-emerald-800' : 'text-stone-500'}`}>
          Level {tier.level} · {meta.label}
        </Text>
        {tier.milestone && <Text className="text-[11px] text-clay-700 font-bold">· Milestone</Text>}
      </View>

      <Text className={`font-semibold mb-1 ${unlocked ? 'text-emerald-900' : 'text-stone-900'}`}>{tier.name}</Text>
      <Text className={`text-sm ${unlocked ? 'text-emerald-900/80' : 'text-stone-700'}`}>{tier.detail}</Text>
      {tier.brand && <Text className="text-xs text-stone-600 mt-2">{tier.brand}</Text>}

      <Text className={`text-xs font-semibold mt-4 pt-3 border-t ${unlocked ? 'border-emerald-500/30 text-emerald-900' : 'border-cream-300 text-stone-500'}`}>
        {unlocked ? (isCurrent ? '✓ You’re here' : '✓ Unlocked') : '🔒 Locked'}
      </Text>
    </View>
  )
}

function GuestNotice({ seasonPoints }) {
  const earned = seasonPoints > 0
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 border-l-4 border-l-clay-600 p-6 mb-8">
      <Text className="font-serif text-2xl text-stone-900 mb-2">
        {earned ? 'Keep your progress' : 'Create an account to compete'}
      </Text>
      <Text className="text-base text-stone-700 mb-1">
        {earned
          ? `You've earned ${seasonPoints.toLocaleString()} season points as a guest. They're saved on this device only — create a free account and they'll come with you.`
          : "You're browsing as a guest. Season points and levels still work, but they live on this device only and you won't appear on the leaderboard."}
      </Text>
      <Text className="text-sm text-stone-600 mb-5">
        Points you earn now move to a new account when you create one. Logging into an account you
        already have keeps that account's progress instead.
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <Link href="/register" asChild>
          <Button>Create free account</Button>
        </Link>
        <Link href="/login" asChild>
          <Button variant="secondary">Log in</Button>
        </Link>
      </View>
    </View>
  )
}
