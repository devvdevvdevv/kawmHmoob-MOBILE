import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import { useProgress } from '../src/hooks/useProgress.js'
import { useAuth } from '../src/context/AuthContext.jsx'
import { buildBoard, lastWeekWinner } from '../src/data/leaderboard.js'
import { levelFromPoints, seasonDaysLeft, SEASON } from '../src/lib/leveling.js'

// Who's ahead. Everyone but you is placeholder data (buildBoard). The RN
// progress model has no season/week point split yet, so the player's score is
// their XP; week points and clips default to 0 until that engine is ported.
export default function Leaderboard() {
  const { xp } = useProgress()
  const { user } = useAuth()
  const [board, setBoard] = useState('season')

  const you = useMemo(
    () => ({
      name: user?.isGuest ? 'You' : user?.username || user?.displayName || 'You',
      seasonPoints: xp || 0,
      weekPoints: 0,
      clips: 0,
    }),
    [user, xp]
  )

  const key = board === 'season' ? 'seasonPoints' : 'weekPoints'
  const rows = useMemo(() => buildBoard(you, key), [you, key])
  const leader = rows[0]
  const yourRow = rows.find((r) => r.isYou)
  const daysLeft = seasonDaysLeft()

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Leaderboard' }]} />

      <View className="mb-8">
        <Text className="text-xs uppercase tracking-wider font-semibold text-clay-700 mb-1">{SEASON.title}</Text>
        <Text className="font-serif text-4xl text-stone-900 mb-2">Who's ahead.</Text>
        <Text className="text-stone-700">
          {daysLeft > 0 ? `${daysLeft} days left this season.` : 'This season has ended.'}
        </Text>
      </View>

      <View className="gap-4 mb-8">
        <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
          <Text className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">Last week's winner</Text>
          <Text className="font-serif text-2xl text-stone-900">🏆 {lastWeekWinner.name}</Text>
          <Text className="text-sm text-stone-700 mt-1">
            {lastWeekWinner.weekPoints.toLocaleString()} pts · {lastWeekWinner.clips} clips
          </Text>
          <Text className="text-xs text-stone-600 mt-1">{lastWeekWinner.week}</Text>
        </View>

        <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
          <Text className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
            Leading now ({board === 'season' ? 'season' : 'this week'})
          </Text>
          <Text className="font-serif text-2xl text-stone-900">
            {leader.isYou ? '👑 You' : `👑 ${leader.name}`}
          </Text>
          <Text className="text-sm text-stone-700 mt-1">{(leader[key] || 0).toLocaleString()} pts</Text>
          {yourRow && !leader.isYou && (
            <Text className="text-xs text-stone-600 mt-1">You're #{yourRow.rank} of {rows.length}</Text>
          )}
        </View>
      </View>

      <View className="flex-row gap-2 mb-4">
        {[['season', 'Season'], ['week', 'This week']].map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setBoard(id)}
            className={`px-4 py-2 rounded-lg ${board === id ? 'bg-clay-600' : 'bg-cream-100'}`}
          >
            <Text className={`text-sm font-semibold ${board === id ? 'text-cream-50' : 'text-stone-700'}`}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 overflow-hidden">
        {rows.map((r, i) => (
          <View
            key={r.id}
            className={`flex-row items-center gap-4 px-4 py-3 ${i > 0 ? 'border-t border-cream-200' : ''} ${r.isYou ? 'bg-clay-600/10' : ''}`}
          >
            <Text className={`w-8 text-center font-serif text-lg ${r.rank <= 3 ? 'text-clay-700' : 'text-stone-600'}`}>
              {r.rank}
            </Text>
            <View className="flex-1">
              <Text className={r.isYou ? 'font-semibold text-stone-900' : 'text-stone-800'}>
                {r.name}{r.isYou ? ' · you' : ''}
              </Text>
              <Text className="text-xs text-stone-600">{r.clips.toLocaleString()} voice clips</Text>
            </View>
            <View className="items-end">
              <Text className="font-medium text-stone-900">{(r[key] || 0).toLocaleString()}</Text>
              <Text className="text-xs text-stone-600">Lv {levelFromPoints(r.seasonPoints).level}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text className="text-xs text-stone-600 mt-4">
        Everyone but you is placeholder data — there's no leaderboard backend yet. Points come
        from lessons, quizzes, and voice recordings; see the{' '}
        <Link href="/pass" className="underline text-clay-700">season pass</Link>.
      </Text>
    </TabScreen>
  )
}
