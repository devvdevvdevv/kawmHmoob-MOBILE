import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import { categories } from '../src/data/vocabulary.js'
import { useProgress } from '../src/hooks/useProgress.js'
import { selectSession } from '../src/context/ProgressContext.jsx'
import Flashcard from '../src/components/vocabulary/Flashcard.jsx'
import Button from '../src/components/ui/Button.jsx'
import TabScreen from '../src/components/TabScreen.jsx'
// The done screen (2026-09-26): entrance motion, trophy, confetti.
import Reanimated, { ZoomIn, FadeInUp } from 'react-native-reanimated'
import Icon from '../src/components/ui/Icon.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import Confetti from '../src/components/common/Confetti.jsx'
import { useTheme } from '../src/context/ThemeContext.jsx'
import { THEME_TOKENS } from '../src/lib/themes.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.

// Back / forward arrows — 2026-09-28 (author: "add the left and right buttons, so the user can go
// back"). The same icons and round cream buttons as app/words/session.jsx.
function ArrowLeftIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12H5" />
      <Path d="M11 6l-6 6 6 6" />
    </Svg>
  )
}
function ArrowRightIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12h15" />
      <Path d="M13 6l6 6-6 6" />
    </Svg>
  )
}

export default function Review() {
  const { vocabSchedule } = useProgress()
  const { theme } = useTheme()

  const dueWords = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    // ⚠️ THE CAPPED SESSION, not every unscheduled word — see the note in
    // TodayCard. This screen was building a 572-card deck and showing
    // "1 of 572", which is not a review session, it is a punishment.
    return selectSession(allWords, vocabSchedule).queue
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)
  // The furthest card reached, so → after going back walks forward through cards already seen,
  // and never jumps past one the learner hasn't reached (Skip does that).
  const [furthest, setFurthest] = useState(0)

  if (dueWords.length === 0) {
    return (
      <TabScreen>
        <View className="rounded-md bg-cream-50 p-10 items-center">
          <Text className="font-serif text-3xl text-stone-900 mb-2">All caught up.</Text>
          <Text className="text-stone-700 mb-6 text-center">
            No words due for review right now. Browse vocabulary to add new ones, or come back later.
          </Text>
          <Link href="/vocabulary" asChild>
            <Button>Browse Vocabulary</Button>
          </Link>
        </View>
      </TabScreen>
    )
  }

  if (idx >= dueWords.length) {
    return <ReviewDone count={dueWords.length} />
    // Was (replaced 2026-09-26 — author: "the done page needs to be centered and
    // more dramatic"):
    //   <TabScreen>
    //     <View className="rounded-md bg-cream-50 p-10 items-center">
    //       <Text className="font-serif text-3xl text-stone-900 mb-2">Done.</Text>
    //       <Text className="text-stone-700 mb-6 text-center">
    //         You reviewed {dueWords.length} word{dueWords.length === 1 ? '' : 's'}.
    //       </Text>
    //       <Link href="/" asChild><Button>Home</Button></Link>
    //     </View>
    //   </TabScreen>
  }

  const word = dueWords[idx]
  // Was: const advance = () => setIdx((i) => i + 1)
  const advance = () => {
    const next = idx + 1
    setIdx(next)
    setFurthest((f) => Math.max(f, next))
  }
  const back = () => setIdx((i) => Math.max(0, i - 1))
  const forward = () => setIdx((i) => Math.min(furthest, i + 1))
  const canBack = idx > 0
  const canForward = idx < furthest

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const arrowColor = `rgb(${t['--c-stone-800']})`

  return (
    <TabScreen>
      <View className="mb-5 flex-row justify-between items-end">
        <View>
          <Text className="font-serif text-4xl text-stone-900 mb-1">Review</Text>
          <Text className="text-stone-700">{idx + 1} of {dueWords.length} due</Text>
        </View>
        <View className="h-2 w-32 bg-cream-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-clay-600"
            style={{ width: `${((idx + 1) / dueWords.length) * 100}%` }}
          />
        </View>
      </View>
      {/* advanceOnKnown (2026-09-28): in Review, Mark Known AND Mark Learning both move on. */}
      <Flashcard word={word} key={word.id} onAdvance={advance} advanceOnKnown />
      {/* Was (2026-09-28 — author: arrows to go back, and "color in the skip button"):
          <View className="mt-4 items-center">
            <Button onPress={advance} variant="ghost" size="sm">Skip →</Button>
          </View> */}
      <View className="flex-row justify-between items-center mt-5 gap-3">
        <Pressable
          onPress={canBack ? back : undefined}
          disabled={!canBack}
          className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${canBack ? '' : 'opacity-40'}`}
        >
          <ArrowLeftIcon color={arrowColor} />
        </Pressable>

        <Button onPress={advance} size="sm">Skip</Button>

        <Pressable
          onPress={canForward ? forward : undefined}
          disabled={!canForward}
          className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${canForward ? '' : 'opacity-40'}`}
        >
          <ArrowRightIcon color={arrowColor} />
        </Pressable>
      </View>
    </TabScreen>
  )
}

/**
 * The end of a daily review — 2026-09-26.
 *
 * CENTERED: `fill` makes the scroll content at least screen-tall and the inner
 * flex-1 + justify-center puts the card in the middle of it (it still scrolls
 * on a short phone — nothing is clipped).
 *
 * DRAMATIC, in order of arrival: confetti falls over the whole screen, the
 * trophy springs in (lime, the same "you did it" colour as ResultEmblem's
 * perfect score), then the headline, then the big count, then the buttons.
 *
 * ⚠️ className on PLAIN children only, never on a Reanimated.View — NativeWind
 * silently drops it there (see the story reader's EnglishGloss).
 * ⚠️ Translating entrances are fine HERE: the whole screen mounts at once, so
 * nothing else is moving the same pixels. The story reader's "opacity only"
 * rule is about a gloss opening inside text that is already on screen.
 * Confetti is a SIBLING of TabScreen so it covers the full screen, and it is
 * pointerEvents="none", so the buttons stay tappable under it.
 */
function ReviewDone({ count }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const trophy = `rgb(${t['--c-lime-900']})`

  return (
    <View style={{ flex: 1 }}>
      <TabScreen fill>
        <View className="flex-1 justify-center py-6">
          <View className="rounded-2xl bg-cream-50 shadow-warm px-6 py-10 items-center">

            <Reanimated.View entering={ZoomIn.springify().damping(11)}>
              <View className="h-36 w-36 rounded-full bg-lime-200/50 items-center justify-center">
                <View className="h-24 w-24 rounded-full bg-lime-200 items-center justify-center">
                  <Icon name="trophy" size={48} color={trophy} />
                </View>
              </View>
            </Reanimated.View>

            <Reanimated.View entering={FadeInUp.delay(250).duration(450)} style={{ width: '100%' }}>
              {/* The shared Eyebrow (check-theme bans hand-rolled ones). Centered by
                  its wrapper — Eyebrow's className is spacing only. */}
              <View className="items-center mt-7">
                <Eyebrow>Daily review complete</Eyebrow>
              </View>
              {/* "Zoo heev!" — very good. The celebration is in Hmong, with the
                  English right under it, like everywhere else in the app. */}
              <Text className="font-serif text-5xl text-stone-900 text-center mt-2">Zoo heev!</Text>
              <Text className="text-base font-medium text-stone-600 text-center mt-1">Great work.</Text>
            </Reanimated.View>

            <Reanimated.View entering={FadeInUp.delay(450).duration(450)} style={{ width: '100%' }}>
              <View className="items-center mt-8 mb-8">
                <Text className="font-serif text-7xl text-clay-700 text-center" style={{ lineHeight: 80 }}>
                  {count}
                </Text>
                <Text className="text-sm uppercase tracking-[1.5px] font-semibold text-stone-500 text-center">
                  word{count === 1 ? '' : 's'} reviewed
                </Text>
                <Text className="text-base text-stone-700 text-center mt-4 leading-relaxed">
                  Each word comes back just before you would forget it. See you tomorrow.
                </Text>
              </View>
            </Reanimated.View>

            <Reanimated.View entering={FadeInUp.delay(650).duration(450)} style={{ width: '100%' }}>
              <View className="gap-3">
                <Link href="/" asChild>
                  <Button size="lg">Home</Button>
                </Link>
                <Link href="/vocabulary" asChild>
                  <Button variant="secondary" size="lg">Browse vocabulary</Button>
                </Link>
              </View>
            </Reanimated.View>

          </View>
        </View>
      </TabScreen>
      <Confetti count={60} />
    </View>
  )
}
