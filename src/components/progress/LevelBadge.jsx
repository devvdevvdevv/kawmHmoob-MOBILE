import { Pressable, Text } from 'react-native'
import { Link } from 'expo-router'
import { useProgress } from '../../hooks/useProgress.js'
import { levelFromPoints } from '../../lib/leveling.js'

// Season level in the header — the one status number that's also a door: it's a
// LINK to the pass (XP/Streak badges are inert). RN has no separate season-points
// bucket yet, so level derives from xp. Mirrors the web LevelBadge.
export default function LevelBadge() {
  const { xp } = useProgress()
  const lv = levelFromPoints(xp || 0)
  return (
    <Link href="/pass" asChild>
      <Pressable className="rounded-full bg-clay-600 px-3 py-1.5">
        <Text className="text-sm font-semibold text-cream-50">Lv {lv.level}</Text>
      </Pressable>
    </Link>
  )
}
