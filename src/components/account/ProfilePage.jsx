import { View, Text } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { categories } from '../../data/vocabulary.js'
import ProgressBar from '../progress/ProgressBar.jsx'
import Button from '../ui/Button.jsx'
import Picker from '../ui/Picker.jsx'

// Note: data export uses console.log on native (no Blob download).
// To export to a file on device, you can add expo-file-system + expo-sharing later.

const dialectOptions = [
  { value: 'white', label: 'White Hmong (Hmoob Dawb)' },
  { value: 'green', label: 'Green Hmong (Moob Leeg)' },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile } = useAuth()
  const { xp, streakData, quizScores, vocabProgress, completedLessons, exportData } = useProgress()

  const wordsKnown = Object.values(vocabProgress).filter((s) => s === 'known').length

  const handleExport = () => {
    console.log('[export]', JSON.stringify(exportData(), null, 2))
  }

  if (user.isGuest) {
    return (
      <View className="rounded-md bg-cream-50 border border-cream-200 p-8 max-w-xl">
        <Text className="font-serif text-3xl text-stone-900 mb-2">Guest Account</Text>
        <Text className="text-stone-700 mb-6">
          You're learning as a guest. Progress is saved on this device only. Create an account to sync your work.
        </Text>
        <View className="flex-row gap-2">
          <Link href="/login" asChild>
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/register" asChild>
            <Button>Create Account</Button>
          </Link>
        </View>
      </View>
    )
  }

  return (
    <View className="gap-6 max-w-3xl">
      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-4xl text-stone-900">{user.displayName}</Text>
        <Text className="text-stone-600 mt-1">
          @{user.username} · joined {user.joinedAt?.slice(0, 10)}
        </Text>
      </View>

      <View className="flex flex-wrap gap-3">
        <Stat label="XP" value={xp} />
        <Stat label="Streak" value={`${streakData.currentStreak}d`} />
        <Stat label="Quizzes" value={quizScores.length} />
        <Stat label="Words Known" value={wordsKnown} />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-xl text-stone-900 mb-3">Dialect Preference</Text>
        <Picker
          value={user.dialectPreference}
          onChange={(v) => {
              updateProfile({ dialectPreference: v }).catch((e) =>
                console.warn('[profile] could not save dialect', e)
              )
            }}
          options={dialectOptions}
        />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <Text className="font-serif text-xl text-stone-900 mb-4">My Progress</Text>
        <View className="gap-3">
          {categories.map((c) => {
            const total = c.words.length
            const known = c.words.filter((w) => vocabProgress[w.id] === 'known').length
            return (
              <ProgressBar
                key={c.id}
                label={c.title}
                value={known}
                max={Math.max(total, 1)}
              />
            )
          })}
        </View>
        <Text className="text-xs text-stone-500 mt-4">
          Completed lessons: {completedLessons.length}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Button onPress={handleExport} variant="secondary">Export My Data</Button>
        <Button onPress={() => { logout(); router.push('/') }} variant="ghost">Log Out</Button>
      </View>
    </View>
  )
}

function Stat({ label, value }) {
  return (
    <View className="flex-1 min-w-[80px] rounded-md bg-cream-50 border border-cream-200 p-5 items-center">
      <Text className="font-serif text-3xl text-stone-900">{value}</Text>
      <Text className="text-xs uppercase tracking-wider text-clay-600 mt-1">{label}</Text>
    </View>
  )
}
