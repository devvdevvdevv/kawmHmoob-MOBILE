import { useEffect, useState, useMemo, useCallback } from 'react'
import { View, Text } from 'react-native'
// import { Link } from 'expo-router'  ← the page's only Link was the /pass one
// in the placeholder footnote below; restore both together (2026-09-23).
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import { useProgress } from '../src/hooks/useProgress.js'
import { useAuth } from '../src/context/AuthContext.jsx'
import { buildBoard, lastWeekWinner } from '../src/data/leaderboard.js'
import { levelFromPoints, seasonDaysLeft, SEASON } from '../src/lib/leveling.js'
import { isSupabaseConfigured, supabase } from '../src/lib/supabase.js'
import { SkeletonList } from '../src/components/common/SkeletonCard.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Who's ahead. Real rankings come from the Supabase `leaderboard` VIEW (username +
// xp, ranked). Guests / no-backend fall back to the placeholder roster (buildBoard).
// Every row is normalized to ONE shape: { id, rank, name, points, isYou }.
export default function Leaderboard() {
  // ⚠️ A HOOK, so it sits above every early return in this component — the
  // colours it resolves change with the theme, and hook order may not.

  const { xp } = useProgress()
  const { user } = useAuth()

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Guests / unconfigured builds can't read the view → show the sample board.
  const usingPlaceholder = !isSupabaseConfigured() || Boolean(user?.isGuest)

  // Placeholder rows (your XP merged into the invented roster), normalized to the
  // canonical shape so the render doesn't care where a row came from.
  const placeholderRows = useMemo(() => {
    const you = {
      id: 'you',
      name: user?.isGuest ? 'You' : user?.username || user?.displayName || 'You',
      seasonPoints: xp || 0,
    }
    return buildBoard(you, 'seasonPoints').map((r) => ({
      id: r.id,
      rank: r.rank,
      name: r.name,
      points: r.seasonPoints || 0,
      isYou: r.isYou,
    }))
  }, [user, xp])

  // Fetch the board. Wrapped in useCallback so the error-state Retry re-runs it.
  const load = useCallback(() => {
    let active = true
    setLoading(true)
    setError(null)

    if (usingPlaceholder) {
      setRows(placeholderRows)
      setLoading(false)
      return () => { active = false }
    }

    supabase
      .from('leaderboard')
      .select('id, username, display_name, xp')
      .order('xp', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!active) return
        if (error) { setError('Could not load the leaderboard.'); return }
        setRows((data || []).map((r, i) => ({
          id: r.id,
          rank: i + 1, // the query already ordered by xp desc
          name: r.username || r.display_name || 'Learner',
          points: r.xp || 0,
          isYou: r.id === user?.id,
        })))
      })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [usingPlaceholder, placeholderRows, user])

  useEffect(() => load(), [load])

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

      {/* Last week's winner — a settled record, kept static for now. */}
      <View className="rounded-md bg-cream-50 p-5 mb-4">
        <Text className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">Last week's winner</Text>
        <Text className="font-serif text-2xl text-stone-900">🏆 {lastWeekWinner.name}</Text>
        <Text className="text-sm font-medium text-stone-700 mt-1">{lastWeekWinner.weekPoints.toLocaleString()} pts</Text>
        <Text className="text-xs text-stone-600 mt-1">{lastWeekWinner.week}</Text>
      </View>

      {loading ? (
        // ⚠️ A SKELETON, NOT A SPINNER — 2026-09-09. The board is always a
        // list of rows, so its shape is known before the data is: the skeleton
        // holds that layout, and nothing on the page jumps when the rows land.
        // A centred spinner collapsed the page to nothing and then pushed the
        // whole board down in one frame.
        //
        // The paywall keeps its spinner on purpose — a purchase round-trip has
        // no known shape, and a fake row there would be a lie about what is
        // coming back.
        <SkeletonList count={6} />
      ) : error ? (
        <View className="rounded-md bg-cream-50 p-8 items-center">
          <Text className="font-serif text-xl text-stone-900 mb-2 text-center">{error}</Text>
          <Button variant="primary" onPress={load}>Retry</Button>
        </View>
      ) : (
        <>
          {/* Leading now */}
          {leader && (
            <View className="rounded-md bg-cream-50 p-5 mb-6">
              <Text className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">Leading now</Text>
              <Text className="font-serif text-2xl text-stone-900">
                {leader.isYou ? '👑 You' : `👑 ${leader.name}`}
              </Text>
              <Text className="text-sm font-medium text-stone-700 mt-1">{leader.points.toLocaleString()} pts</Text>
              {yourRow && !leader.isYou && (
                <Text className="text-xs text-stone-600 mt-1">You're #{yourRow.rank} of {rows.length}</Text>
              )}
            </View>
          )}

          {/* The ranked list */}
          <View className="rounded-md bg-cream-50 overflow-hidden">
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
                </View>
                <View className="items-end">
                  <Text className="font-medium text-stone-900">{r.points.toLocaleString()}</Text>
                  <Text className="text-xs text-stone-600">Lv {levelFromPoints(r.points).level}</Text>
                </View>
              </View>
            ))}
          </View>

          {usingPlaceholder && (
            <Text className="text-xs text-stone-600 mt-4">
              {/* ⚠️ The trailing "see the season pass" link was commented out
                  2026-09-23 with the pass itself — the sentence now ends at
                  "practice". Restore list: app/pass.jsx's header.
                  Was: quizzes, and practice; see the{' '}
                       <Link href="/pass" className="underline text-clay-700">season pass</Link>. */}
              Sample standings — sign in to see the real leaderboard. Points come from lessons,
              quizzes, and practice.
            </Text>
          )}
        </>
      )}
    </TabScreen>
  )
}
