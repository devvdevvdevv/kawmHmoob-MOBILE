import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native'
// useLocalSearchParams reads the dynamic part of the URL. useRouter is only
// needed for the "not found" escape hatch further down.
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// TabScreen still wraps the "genre not found" branch — an error state belongs on
// the app's normal chrome. The genre itself is a cream sheet, matching the
// library it came from and the reader it leads to.
import TabScreen, { SCREEN_PADDING_X } from '../../src/components/TabScreen.jsx'
import { HEADER_CONTENT_HEIGHT } from '../../src/components/GlobalHeader.jsx'
import { TAB_BAR_HEIGHT } from '../../src/components/GlobalTabBar.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Button from '../../src/components/ui/Button.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import StoryCover from '../../src/components/reading/StoryCover.jsx'
import { GENRES, stories, storyStepId } from '../../src/data/stories.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useTheme } from '../../src/context/ThemeContext.jsx'
import { genreCoverColor } from '../../src/lib/genreCover.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'

// ONE GENRE — the stories on a single shelf.
//
// ⚠️ THE FILENAME IS THE API. This file is called [genreId].jsx, so the URL
// segment arrives under exactly that name: /reading/life gives genreId 'life'.
// Rename the file and you rename the parameter — nothing else connects them.

export default function ReadingGenre() {

  // Pull 'life' out of /reading/life. Always a string (or undefined), never a
  // number, because a URL is text.
  const { genreId } = useLocalSearchParams()

  const router = useRouter()
  const { completedSteps } = useProgress()
  const { theme: genreTheme } = useTheme()
  const { isPro } = useSubscription()

  // ⚠️ ABOVE THE GUARD, because hooks must run in the same order on every
  // render and the "genre not found" return below is an early exit.
  const insets = useSafeAreaInsets()

  // .find() returns the FIRST match, or undefined if nothing matches. That
  // undefined is the whole reason the guard below exists.
  const genre = GENRES.find((g) => g.id === genreId)

  // ⚠️ GUARD BEFORE USE. Someone can type /reading/nonsense, or follow a stale
  // link after a genre is renamed. Without this, `genre.title` on the next line
  // throws "cannot read property of undefined" and the screen is blank.
  //
  // Returning EARLY is the pattern — handle the broken case, get out, and let
  // the rest of the function assume everything is fine.
  if (!genre) {
    return (
      <TabScreen>
        <Text className="font-serif text-2xl text-stone-900 mb-2">Genre not found</Text>
        <Text className="text-sm font-medium text-stone-700 mb-4">
          There is no genre called &ldquo;{String(genreId)}&rdquo;.
        </Text>
        <Button onPress={() => router.push('/reading')}>Back to Readings</Button>
      </TabScreen>
    )
  }

  // Membership is derived here too — this screen never hardcodes which stories
  // belong to it. Same filter the hub uses, narrowed to one genre.
  const items = stories.filter((s) => s.genre === genre.id)

  const minutes = items.reduce((sum, s) => sum + s.minutes, 0)

  // Locking is per GENRE, not per story — one flag covers the shelf.
  const locked = !genre.free && !isPro

  // Progress for THIS shelf. Every other hub in the app reports "done of total"
  // on the screen you are standing on, not just on the one above it.
  const readHere = items.filter((s) => completedSteps.includes(storyStepId(s.id))).length
  const pct = items.length ? (readHere / items.length) * 100 : 0

  // One surface, library → genre → reader. See the long note in
  // app/reading/index.jsx for why this module leaves TabScreen behind.
  return (
    <View style={{ flex: 1, paddingTop: HEADER_CONTENT_HEIGHT + insets.top, paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}>

    <ScrollView
      className="bg-cream-50"
      contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_X, paddingTop: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >

      {/* The middle crumb links back to the hub; the last one is the current
          page, so it is a label with no `to` — you never link to where you are. */}
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Readings', to: '/reading' },
          { label: genre.title },
        ]}
      />

      {/* ── The shelf sign ────────────────────────────────────────────────
          Full-bleed, in the genre's OWN colour, so arriving here confirms the
          cover you tapped. A white heading on a white page after tapping a
          dark green book is what made this screen feel like a different app.

          The negative margin cancels TabScreen's gutter and the padding puts
          it back inside — same technique as the shelves on the hub. */}
      <View
        style={{ marginHorizontal: -SCREEN_PADDING_X, backgroundColor: genreCoverColor(genre.cover, genreTheme) }}
        className="px-5 pt-6 pb-5 mb-7"
      >
        <Eyebrow tone="onDark" className="mb-2">Shelf</Eyebrow>

        {/* ⚠️ text-3xl, DOWN FROM A BESPOKE 34px. On a 360px screen a two-word
            genre at 34px wrapped to two lines and the sign grew taller than the
            first row of covers under it — the label was outweighing the shelf
            it labels. text-3xl is the app's sub-screen heading step, shared with
            the reader's title block.
            Was: className="font-serif text-[34px] text-cream-50 leading-none" */}
        <Text className="font-serif text-3xl text-cream-50 leading-tight">
          {genre.title}
        </Text>

        {!!genre.blurb && (
          <Text className="text-[13px] font-medium text-cream-50/80 leading-relaxed mt-2.5">
            {genre.blurb}
          </Text>
        )}

        {/* The counts sit under a hairline in the same white, so they read as
            part of the sign rather than as a caption that got left behind. */}
        <View className="h-px bg-cream-50/25 mt-4 mb-3" />

        {/* ⚠️ THE HOUSE PROGRESS BAR, RECOLOURED — not a different component.
            Same 1.5px track and same fill the Speak cards use; only the two
            colours change, because this one sits on the genre's dark ground
            where clay-on-cream would disappear. Matching the SHAPE is what
            makes it read as the same app; matching the colour would make it
            invisible. */}
        <View className="flex-row items-center gap-3">

          <View className="h-1.5 w-24 rounded-full bg-cream-50/25 overflow-hidden">
            <View className="h-full bg-cream-50" style={{ width: `${pct}%` }} />
          </View>

          {/* Sentence case at a readable size, for the same reason the
              reader's title block dropped its uppercase stripe: this is a
              sentence about progress, not a label. "3 of 4 read" also says
              plainly what "3/4" only implies. */}
          <Text className="text-[13px] font-medium text-cream-50/75 flex-1">
            {readHere} of {items.length} read · {minutes} min
          </Text>

          {/* The Pro pill, in the app's own words. It was the string "· Pro"
              tacked onto the end of the stat line; everywhere else in the app
              Pro is a pill with a ◆ in it, and a learner should recognise the
              badge without reading it. */}
          {locked && (
            <View className="rounded-full bg-cream-50/20 px-2 py-0.5">
              <Text className="text-[10px] uppercase tracking-wider font-medium text-cream-50">
                ◆ Pro
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Keyed by story.id — stable and unique, unlike the array index, which
          shifts the moment you insert a story. */}
      <CoverGrid
        items={items}
        genre={genre}
        locked={locked}
        completedSteps={completedSteps}
      />

    </ScrollView>

    </View>
  )
}

/**
 * Two covers per row.
 *
 * ⚠️ THE WIDTH IS MEASURED, NOT GUESSED. A hardcoded column width is right on
 * exactly one phone; useWindowDimensions gives the real number and also updates
 * on rotation, which a one-off Dimensions.get() call does not.
 *
 * ⚠️ THE HOOK LIVES HERE, not in the screen above it. That component early-
 * returns for an unknown genre, and a hook added above it is one more call
 * whose order has to stay right forever. In a child that only renders after
 * the guard has passed, there is nothing to get wrong.
 *
 * flex-wrap does the layout: fixed-width children, and the row breaks itself.
 * No index arithmetic, no chunking the array into pairs.
 */
function CoverGrid({ items, genre, locked, completedSteps }) {

  const { width: screen } = useWindowDimensions()

  const GAP = 16
  // The page's own gutter is padding, so it is not available to the covers.
  const usable = screen - SCREEN_PADDING_X * 2
  const col = Math.floor((usable - GAP) / 2)

  return (
    <View className="flex-row flex-wrap" style={{ gap: GAP }}>
      {items.map((story) => (
        <StoryCover
          key={story.id}
          story={story}
          genre={genre}
          width={col}
          locked={locked}
          read={completedSteps.includes(storyStepId(story.id))}
        />
      ))}
    </View>
  )
}

// ── RETIRED 2026-09-08: StoryRow ────────────────────────────────────────────
// This screen used to be a vertical list of rows. It worked, but it broke the
// cover language the library sets up: you tapped a designed book and landed on
// something that looked like the settings screen. CoverGrid above draws the
// same StoryCover the shelves do.
//
// Pressable and Icon stay imported for this block, so uncommenting it and
// swapping <CoverGrid …> back for the items.map() is the whole restore.
//
// /** One story: what it is, how long, and how hard. */
// function StoryRow({ story, locked, read }) {
//   return (
//     // The route is /reading/story/[storyId] — 'story' sits in the path so this
//     // can never collide with /reading/[genreId]. Without it, 'horror' and
//     // 'story-zaj-…' would both be bare segments under /reading and the router
//     // could not tell a genre from a story.
//     // Locked rows go to the offer rather than into the story.
//     <Link href={locked ? '/paywall' : `/reading/story/${story.id}`} asChild>
//
//       <Pressable
//         className={`rounded-md flex-row items-center gap-4 p-4 ${
//           locked
//             ? 'bg-cream-100 active:bg-cream-200'
//             : 'bg-cream-50 shadow-warm active:bg-cream-100'
//         }`}
//       >
//
//         {/* Leading slot in priority order: locked > read > default. State is
//             read BEFORE the title, so it lands before the content does. */}
//         <View
//           className={`h-11 w-11 rounded-full items-center justify-center ${
//             locked ? 'bg-stone-400/15' : 'bg-clay-600/12'
//           }`}
//         >
//           <Icon
//             name={locked ? 'lock' : read ? 'check' : 'bookOpen'}
//             size={20}
//             tone={locked ? 'muted' : 'accent'}
//           />
//         </View>
//
//         <View className="flex-1">
//
//           {/* The Hmong title leads — it is the actual name of the thing. */}
//           <Text className="font-serif text-lg text-stone-900">{story.title}</Text>
//
//           {!!story.english && (
//             <Text className="text-sm font-medium text-stone-600 mt-0.5">{story.english}</Text>
//           )}
//
//           {/* Level and minutes on one line: both are "should I read this now?"
//               facts, so they belong together rather than stacked. */}
//           <Text className="text-xs text-stone-500 mt-2">
//             {locked
//               ? 'Unlock with Pro'
//               : `${story.level} · ${story.minutes} min · ${story.questions.length} questions`}
//           </Text>
//         </View>
//
//         <Icon name={locked ? 'lock' : 'arrowRight'} size={18} tone="muted" />
//
//       </Pressable>
//     </Link>
//   )
// }
