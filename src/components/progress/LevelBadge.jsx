import { Pressable, Text } from 'react-native'
// import { Link } from 'expo-router'  ← restore with the /pass link below
import { useProgress } from '../../hooks/useProgress.js'
import { levelFromPoints } from '../../lib/leveling.js'

// Season level in the header. RN has no separate season-points bucket yet, so
// level derives from xp. Mirrors the web LevelBadge.
//
// ⚠️ THE LINK TO /pass IS COMMENTED OUT — 2026-09-23, with the pass itself.
// This badge used to be "the one status number that's also a door"; with the
// pass gone it is inert like the XP and Streak badges beside it. The Pressable
// stays so the shape, padding and colour do not move — only the Link is gone.
// Restore list: app/pass.jsx's header.
export default function LevelBadge() {
  const { xp } = useProgress()
  const lv = levelFromPoints(xp || 0)
  return (
    // <Link href="/pass" asChild>
    <Pressable className="rounded-full bg-clay-600 px-3 py-1.5">
      <Text className="text-sm font-semibold text-cream-50">Lv {lv.level}</Text>
    </Pressable>
    // </Link>
  )
}
