import { View, Text, Pressable } from 'react-native'
import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import { SPEAK_ENABLED } from '../../../src/lib/launch.js'
import {
  getSpeakCategory,
  categoryLessons,
  categoryProgress,
  lessonProgress,
} from '../../../src/data/speakLessons.js'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { isAdmin } from '../../../src/lib/admin.js'

// One conversation CATEGORY — its lessons, in course order.
//
// The Conversations tab lists categories; this is what a category card opens.
// That split exists because the course is heading for ~200 lessons, and a flat
// list of 200 cards is not a screen anyone can use.
//
// ⚠️ Lesson numbers are GLOBAL, not per-category. The second category starts at
// Lesson 4, not Lesson 1 — the number says how far into the whole course you
// are. It comes from `lesson.number`, computed in src/data/speakLessons.js from
// array position; never write one by hand here.
export default function SpeakCategory() {

  const { categoryId } = useLocalSearchParams()
  const router = useRouter()
  const category = getSpeakCategory(categoryId)
  const { completedSteps } = useProgress()
  const { isPro } = useSubscription()
  const { user } = useAuth()

  // ⚠️ THE SPEAK_ENABLED GUARD MOVED BELOW THE HOOKS — 2026-09-12.
  //
  // It used to be the first line of the component, which is a rules-of-hooks
  // violation: a return above a hook changes the hook COUNT between renders, and
  // React matches state to hooks by call order. It happened to be harmless
  // because SPEAK_ENABLED is a module constant — the branch is identical for the
  // life of the process, so the count never actually varies.
  //
  // "Harmless because of a fact somewhere else" is the shape of a bug with a
  // delay on it: the day that flag becomes stateful (a remote config, a dev
  // toggle, an A/B flag) every hook below it binds to the wrong slot. The same
  // trap is documented in the reader and in
  // notes/2026-08-17-page-info-modal-swipe-gesture.md.
  //
  // Running the hooks and then returning costs one render of work that is thrown
  // away, on a screen that is switched off.
  if (!SPEAK_ENABLED) return <Redirect href="/speak" /> // v1: Speak coming soon

  if (!category) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Category not found.</Text>
        <Button onPress={() => router.push('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  // Admins get the unrecorded ones too — see the note on the Conversations tab.
  const lessons = categoryLessons(category.id, { includeUnready: isAdmin(user) })
  const { done, total } = categoryProgress(category.id, completedSteps)

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Speak', to: '/speak' },
          { label: category.title },
        ]}
      />

      <View className="mb-6">
        <View className="flex-row items-center gap-3 mb-2">
          {category.emoji && <Text className="text-3xl">{category.emoji}</Text>}
          <Text className="font-serif text-3xl text-stone-900 flex-1">{category.title}</Text>
        </View>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">{category.blurb}</Text>
        <View className="mt-4 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-clay-600"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </View>
          <Text className="text-sm font-medium text-stone-700">
            {done} of {total} lessons done
          </Text>
        </View>
      </View>

      <View className="gap-3">
        {lessons.map((lesson) => {
          const p = lessonProgress(lesson, completedSteps)
          const complete = p.total > 0 && p.done === p.total
          const locked = lesson.tier === 'pro' && !isPro
          return (
            // A locked lesson routes to /paywall, NOT into the lesson. The lesson
            // screen has its own PaywallGate as a backstop, but bouncing someone
            // INTO a lesson only to wall them is worse than taking them straight
            // to the offer.
            <Link key={lesson.id} href={locked ? '/paywall' : `/speak/lesson/${lesson.id}`} asChild>
              <Pressable
                accessibilityLabel={
                  locked
                    ? `Lesson ${lesson.number}, ${lesson.title}. Locked. Opens subscription plans.`
                    : undefined
                }
                className={`rounded-md flex-row items-center gap-4 p-4 ${
                  locked
                    ? 'bg-cream-100 active:bg-cream-200'
                    : 'bg-cream-50 shadow-warm active:bg-cream-100'
                }`}
              >
                {/* Leading slot, in priority order: lock > done > number. The
                    lock is read BEFORE the title, so the state lands first. */}
                <View
                  className={`h-11 w-11 rounded-full items-center justify-center ${
                    locked ? 'bg-stone-400/15' : 'bg-clay-600/12'
                  }`}
                >
                  {locked ? (
                    <Icon name="lock" size={20} tone="muted" />
                  ) : complete ? (
                    <Icon name="check" size={20} tone="accent" />
                  ) : (
                    <Text className="font-serif text-lg text-clay-700">{lesson.number}</Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-[10px] uppercase tracking-wider text-stone-500">
                    Lesson {lesson.number}
                  </Text>
                  <Text
                    className={`font-serif text-lg ${locked ? 'text-stone-500' : 'text-stone-900'}`}
                  >
                    {lesson.title}
                  </Text>
                  <Text
                    className={`text-sm mt-0.5 ${locked ? 'text-stone-500' : 'text-stone-600'}`}
                    numberOfLines={2}
                  >
                    {lesson.blurb}
                  </Text>
                  {locked ? (
                    <Text className="text-xs text-clay-700 mt-2">Unlock with Pro</Text>
                  ) : (
                    <View className="flex-row items-center gap-3 mt-2">
                      <View className="h-1.5 w-24 bg-cream-200 rounded-full overflow-hidden">
                        <View className="h-full bg-clay-600" style={{ width: `${p.pct}%` }} />
                      </View>
                      <Text className="text-xs text-stone-500">
                        {p.done}/{p.total} steps
                      </Text>
                    </View>
                  )}
                </View>

                <Icon name={locked ? 'lock' : 'arrowRight'} size={18} tone="muted" />
              </Pressable>
            </Link>
          )
        })}
      </View>
    </TabScreen>
  )
}
