import {View, Text, Pressable, ScrollView, useWindowDimensions} from 'react-native';
import { useProgress } from '../../src/hooks/useProgress.js'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import {Link} from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
// SCREEN_PADDING_X is back: the shelves break out of the page gutter again now
// that the whole screen is one sheet. TabScreen itself is no longer used here —
// see the frame comment inside ReadingsHub.
import { SCREEN_PADDING_X } from '../../src/components/TabScreen.jsx'
import { HEADER_CONTENT_HEIGHT } from '../../src/components/GlobalHeader.jsx'
import { TAB_BAR_HEIGHT } from '../../src/components/GlobalTabBar.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import StoryCover, { shelfCoverWidth } from '../../src/components/reading/StoryCover.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import { useTheme } from '../../src/context/ThemeContext.jsx'
import { genreCoverColor } from '../../src/lib/genreCover.js'
import {
    GENRES,
    stories,
    storyStepId
} from '../../src/data/stories.js';


// READING LIBRARY — a shelf, not a list.
//
// Every other hub in this app is a vertical stack of full-width rows. This one
// deliberately is not. A library should look like books, and a row of spines you
// scroll sideways is a shape people already know. It also scales where a list
// does not: at 25 stories a vertical list is a scroll marathon, while shelves
// put three or four genres in one screen.
//
// ⚠️ GENRE MEMBERSHIP IS DERIVED. GENRES supplies order, titles and the shelf
// colour; which stories sit on a shelf comes from the stories themselves.
// Writing a story in src/data/stories.js is the only thing that puts it here.
//
// Build guide: learning/reading/01-the-library-guide.md


function genreFilter(){

    // ✅ CORRECT — start with an empty container to fill as you walk the list.
    const byGenre = {}

    // ✅ CORRECT — for...of gives you each story object directly.
    for (const story of stories){

        // ✅ "Have I seen this genre before?" If not, make its bucket.
        //    Create-on-first-write. The if does ONE job: ensure the array exists.
        if (!byGenre[story.genre]){
            byGenre[story.genre] = []
        }

        // ✅ FIXED 2026-09-05 — three changes on this one line:
        //
        //    1. MOVED OUT of the if. Inside, it only ran the first time a genre
        //       appeared; story #2 in the same genre found the key already there,
        //       the if was false, and it was never pushed. Every genre held
        //       exactly one story and nothing errored.
        //
        //    2. push(story) instead of push(story.id, story.title, …).
        //       push with several arguments appends each as its OWN element, so
        //       the array became a flat list of strings rather than stories.
        //       One object per push — the whole story, so the render side can
        //       read any field it wants.
        //
        //    3. Dropped story.readingTime, which does not exist (it is
        //       story.minutes). Moot now that the whole object goes in.
        byGenre[story.genre].push(story)


    }



    // ✅ CORRECT — and note the return sits OUT here, after the loop finishes.
    //    Inside the loop it would exit on story #1.
    //
    // Attach each genre's stories to the genre's own fields.
    // ...g spreads what the genre already has (id, title, blurb) so adding a
    // field to GENRES later comes along for free. `items` is the only new one.
    // `|| []` because a genre with no stories has no key here, and
    // undefined.length throws.
    return(
        GENRES.map((g) => ({ ...g, items: byGenre[g.id] || [] }))
    );
}





export default function ReadingsHub(){

    // completedSteps is the app-wide record of what has been finished; a story
    // lands in it when its quiz is completed.
    const { completedSteps } = useProgress()
    const { isPro } = useSubscription()

    // genreFilter() returns one entry per genre, each carrying its own stories.
    const allShelves = genreFilter()

    // A genre with no stories gets no shelf. "Horror · 0 stories" advertises an
    // empty room — worse than simply not being there. This is the ONLY place
    // that decision lives; genreFilter() stays dumb and returns everything.
    const shelves = allShelves.filter((g) => g.items.length > 0)

    // reduce = many values in, ONE value out. The 0 is where the count starts.
    const totalMinutes = stories.reduce((sum, s) => sum + s.minutes, 0)

    const readCount = stories.filter((s) => completedSteps.includes(storyStepId(s.id))).length

    // ── ONE SURFACE ──────────────────────────────────────────────────────
    //
    // ⚠️ 2026-09-08 — THE LIBRARY LEFT TabScreen TOO, and for the same reason
    // the reader did: to be a single colour from the header to the tab bar.
    //
    // Until now the module was two different surfaces. The library was cream
    // CARDS floating on the seafoam page ground; the reader was one unbroken
    // cream sheet. Tapping a cover meant crossing from one to the other, and
    // that seam is what still read as two places rather than one section of
    // one app.
    //
    // Now both are the same sheet. The library IS the paper the stories are
    // printed on, the covers sit directly on it, and opening one changes what
    // is on the page rather than what the page is.
    //
    // ⚠️ THE TRADE, STATED PLAINLY: the rest of the app is cards on seafoam,
    // and this module is now the one place that is not. That is deliberate — a
    // library and a reader are a continuous surface in every reading app there
    // is — but it IS a divergence. Everything else on the screen still comes
    // from the house set (the eyebrow, the heading ladder, the progress bar,
    // the Pro pill, clay-verb-plus-arrow), so it reads as the same app in a
    // different room rather than as a different app.
    //
    // TO REVERT to cards on seafoam: wrap the children in <TabScreen> again in
    // place of this frame + ScrollView, and put the card classes back on Shelf
    // below ('rounded-md bg-cream-50 shadow-warm overflow-hidden pt-5 pb-5').
    const insets = useSafeAreaInsets()
    const topClearance = HEADER_CONTENT_HEIGHT + insets.top
    const bottomClearance = TAB_BAR_HEIGHT + insets.bottom

    return (

        <View style={{ flex: 1, paddingTop: topClearance, paddingBottom: bottomClearance }}>

        <ScrollView
            className="bg-cream-50"
            contentContainerStyle={{
                paddingHorizontal: SCREEN_PADDING_X,
                paddingTop: 20,
                paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
        >

            <Breadcrumbs
                items={[
                    { label: 'Home', to: '/' },
                    { label: 'Readings', to: '/reading' },
                ]}
            />


            {/* ── Masthead ─────────────────────────────────────────────────
                ⚠️ REBUILT 2026-09-08 to the house pattern, reversing the
                argument that used to sit here.

                It was a printed title page: a 46px "Library" over a thick-then-
                thin double rule, on the reasoning that a library should
                announce itself differently from a lesson hub. It did announce
                itself differently — and that WAS the problem. Every other hub
                in this app opens the same way (Home, Speak, Learn, Reference):
                a small eyebrow, a serif title, one sentence of what this is
                for. Arriving in Reading and finding a different grammar read as
                leaving the app rather than moving inside it.

                The books are still the exception; the chrome around them is
                not. The shelves below are where this module gets to look like
                itself.

                Was:
                  <Text className="text-[10px] font-bold uppercase tracking-[3px] text-clay-700 mb-2">
                      Nyeem · Reading
                  </Text>
                  <Text className="font-serif text-[46px] text-stone-900 leading-none">Library</Text>
                  <View className="h-[3px] bg-stone-800 mt-4" />
                  <View className="h-px bg-cream-300 mt-[3px] mb-3" />
                  … then a single uppercase stat line. */}
            <View className="mb-12">

                {/* ── EYEBROW COMMENTED OUT 2026-09-08 ─────────────────────
                    The clay dot and "Nyeem · Reading" label, the app's "you are
                    in a section" mark, copied from the Speak hub.

                    Removed at request, and the title is why it can go: this
                    masthead now reads "Nyeem Hmoob" — Hmong for "read Hmong" —
                    which already names the section in the section's own
                    language. The eyebrow was saying the same word twice.

                    TO RESTORE: uncomment this block. It belongs directly above
                    the title, with the title keeping its mb-3.

                    <View className="flex-row items-center gap-2 mb-2">
                        <View className="h-2 w-2 rounded-full bg-clay-600" />
                        <Text className="text-xs uppercase tracking-[2px] text-stone-600">
                            Nyeem · Reading
                        </Text>
                    </View>
                ────────────────────────────────────────────────────────────── */}

                {/* The Hmong leads, the way a story's Hmong title leads on its
                    cover. Was: "Read it in Hmong." */}
                <Text className="font-serif text-4xl text-stone-900 mb-3">
                    Nyeem Hmoob
                </Text>

                <Text className="text-base font-medium text-stone-700 leading-relaxed">
                    Short stories with the English one tap away. Hold any word to
                    look it up without leaving the page.
                </Text>

                {/* Progress in the SAME shape as Speak's: a 2px track, a clay
                    fill, and the count in words beside it. It was an uppercase
                    stat line here and a progress bar everywhere else, which
                    made the one module that tracks reading look like the one
                    module that does not track anything. */}
                <View className="mt-5 flex-row items-center gap-3">
                    <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-clay-600"
                            style={{ width: `${stories.length ? (readCount / stories.length) * 100 : 0}%` }}
                        />
                    </View>
                    <Text className="text-sm font-medium text-stone-700">
                        {readCount} of {stories.length} read · {totalMinutes} min
                    </Text>
                </View>
            </View>


            {/* ── The shelves ───────────────────────────────────────────────
                ⚠️ gap-7 + A RULE, where it used to be gap-14 and nothing.

                56px of empty space was doing the dividing on its own, and it
                was not enough: "See all 4" is a clay-coloured action sitting at
                the BOTTOM of its shelf, and the next shelf opens with a
                coloured dot and a label. With only air between them the button
                read as belonging to the shelf below it — the one thing it must
                never do, because it goes to the shelf above.

                Space alone cannot fix that. The two things being separated are
                not the same weight: one is an action, the other is a heading.
                A rule is a HARD boundary in a way that any amount of whitespace
                is not.

                7 above and 7 below (28px each), so the total gap is what it was
                — the rule is spent from the existing space rather than added to
                it, and the page does not get longer. */}
            <View className="gap-7">
                {shelves.map((g, i) => (
                    <Shelf
                        key={g.id}
                        genre={g}
                        locked={!g.free && !isPro}
                        completedSteps={completedSteps}
                        // No rule under the last shelf: a divider with nothing
                        // after it is a line under the page, not a separator.
                        divider={i < shelves.length - 1}
                    />
                ))}
            </View>

            {/* An empty library is a real state while you are authoring, so it
                gets a real answer instead of a blank screen. */}
            {shelves.length === 0 && (
                <View className="rounded-md bg-cream-100 p-8 items-center">
                    <Text className="font-serif text-xl text-stone-900 mb-1">No stories yet</Text>
                    <Text className="text-sm font-medium text-stone-700 text-center">
                        Add one to src/data/stories.js and it will appear here.
                    </Text>
                </View>
            )}


        </ScrollView>

        </View>

    )


}


/**
 * One genre = one horizontal shelf, printed straight onto the page.
 *
 * ⚠️ IT WAS A CREAM CARD FOR ONE DAY — 2026-09-08. The card was the right
 * answer while the library sat on the seafoam page ground: everything else in
 * the app is a cream-50 card floating on that blue, and covers placed directly
 * on it were the only content in the app that was not.
 *
 * The screen is now the cream itself (see ReadingsHub), so a cream card on a
 * cream sheet would be an outline around nothing. What separates one shelf
 * from the next is space and the coloured dot in its header — the way a
 * printed page separates sections, which is what this now is.
 *
 * ⚠️ THE ROW IS FULL-BLEED. TabScreen's gutter is cancelled with a negative
 * margin and restored as content padding, so the last cover runs to the true
 * screen edge. A cover half off the edge is the clearest "there is more this
 * way" there is, and boxing the row inside the gutter kills it.
 */
function Shelf({ genre, locked, completedSteps, divider = false }){
  const { theme: libraryTheme } = useTheme()

    // ⚠️ MEASURED, NOT GUESSED — and useWindowDimensions rather than a one-off
    // Dimensions.get(), because this one re-renders on rotation and on a
    // foldable opening. The hook is safe here: ReadingsHub has no early return
    // above this component, so Shelf renders on every pass.
    const { width: screen } = useWindowDimensions()
    const coverW = shelfCoverWidth(screen)

    return (
        <View>

            {/* ── Shelf header ────────────────────────────────────────────
                Set at the app's SECTION scale, not a size of its own: the
                serif title at text-2xl and the blurb at text-sm font-medium
                text-stone-600, which is the pairing every hub in the app uses
                above a list of cards.

                Was: font-serif text-[19px] over an 11px blurb, one line, with a
                5×18px colour bar to its left. That bar was the module's own
                invention; the app marks a section with a 2×2 dot, so this uses
                the dot — in the genre's cover colour, so the heading and the
                books under it are still visibly the same shelf. */}
            <View className="mb-5">

                <View className="flex-row items-center gap-2 mb-2">
                    <View className="h-2 w-2 rounded-full" style={{ backgroundColor: genreCoverColor(genre.cover, libraryTheme) }} />
                    <Eyebrow>{genre.items.length} {genre.items.length === 1 ? 'story' : 'stories'}</Eyebrow>

                    {/* Pro reads on the shelf itself, in the app's own badge.
                        A locked genre used to look identical to a free one
                        until you tapped a cover and hit the paywall. */}
                    {locked && (
                        <View className="rounded-full bg-cream-200 px-2 py-0.5 ml-auto">
                            <Text className="text-[10px] uppercase tracking-wider font-medium text-stone-600">
                                ◆ Pro
                            </Text>
                        </View>
                    )}
                </View>

                <Text className="font-serif text-2xl text-stone-900">
                    {genre.title}
                </Text>

                {!!genre.blurb && (
                    <Text className="text-sm font-medium text-stone-600 mt-1.5" numberOfLines={2}>
                        {genre.blurb}
                    </Text>
                )}
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -SCREEN_PADDING_X }}
                // 12, not 16: smaller books want a tighter gap, or the shelf
                // reads as a row of separate cards rather than as one shelf.
                contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING_X, gap: 12 }}
            >
                {genre.items.map((story) => (
                    // ⚠️ StoryCover is SHARED with the genre screen. Drawing a
                    // story two different ways in two places is what made
                    // tapping a cover feel like leaving the library.
                    <StoryCover
                        key={story.id}
                        story={story}
                        genre={genre}
                        width={coverW}
                        locked={locked}
                        read={completedSteps.includes(storyStepId(story.id))}
                    />
                ))}
            </ScrollView>

            {/* The way in, at the FOOT of the card — the same "verb in clay,
                then an arrow" affordance as Home's "Practice saying it" and
                every DrillTile's trailing arrow. It was an 11px pill floating
                up in the header, which is neither where the app puts its
                actions nor a size it uses for them. */}
            <Link href={`/reading/${genre.id}`} asChild>
                <Pressable
                    className="flex-row items-center gap-1.5 pt-5 active:opacity-70"
                    hitSlop={8}
                >
                    <Text className="text-sm font-semibold text-clay-700">
                        See all {genre.items.length}
                    </Text>
                    <Icon name="arrowRight" size={16} tone="accent" />
                </Pressable>
            </Link>

            {/* ⚠️ INSET, NOT FULL-BLEED — this is the "semi" part and it is the
                whole reason it works. The cover row runs to the true screen
                edge; a rule that did the same would read as a hard page break
                cutting the library into slices. Stopping it at the gutter, one
                step in from where the books run, makes it a section rule
                INSIDE one continuous page instead.

                cream-200 on cream-50: present enough to stop the eye, faint
                enough that it never competes with a cover. */}
            {divider && <View className="h-px bg-cream-200 mt-7" />}

        </View>
    )
}


// ── RETIRED 2026-09-08: the local Cover ─────────────────────────────────────
// Replaced by src/components/reading/StoryCover.jsx, which the genre screen
// uses too. Kept here, commented, because the shape it settled on — a fixed
// height caption so spines line up, state in the top-right corner — is the
// reasoning the shared component inherited.
//
// To restore: uncomment this, and change <StoryCover … genre={genre}> back to
// <Cover … cover={genre.cover}> in Shelf above.
//
// /**
//  * A story cover.
//  *
//  * ONE CARD, two zones: a coloured block on top standing in for artwork, and a
//  * cream caption below it. The caption sits on its own light ground rather than
//  * floating on the page — text directly on the seafoam background reads as
//  * unfinished, and the white base is what makes cover + title land as a single
//  * object instead of two things that happen to be near each other.
//  *
//  * `overflow-hidden` on the outer card is what rounds the top of the colour
//  * block; without it the block's square corners punch through the card's radius.
//  *
//  * Typographic, because 25 stories is 25 pieces of artwork you do not have. The
//  * ASPECT RATIO does most of the work — a tall block reads as a book with
//  * nothing on it at all.
//  */
// function Cover({ story, cover, locked, read }){
//
//     // First character of the Hmong title, as a mark. Gives every cover a
//     // different face without a single asset.
//     const initial = story.title.trim().charAt(0)
//
//     return (
//         // A locked story goes straight to the offer. Opening it only to wall
//         // the reader is a worse trip than never entering.
//         <Link href={locked ? '/paywall' : `/reading/story/${story.id}`} asChild>
//
//             <Pressable className="w-[136px] rounded-lg bg-cream-50 shadow-warm overflow-hidden active:opacity-80">
//
//                 {/* ── the "artwork" ─────────────────────────────────────────
//                     `cover` arrives as a whole static class string from GENRES —
//                     never built by interpolation, because NativeWind only compiles
//                     class names it can SEE in source. */}
//                 <View className={`h-[176px] items-center justify-center ${cover}`}>
//
//                     <Text className="font-serif text-[52px] leading-none text-cream-50 opacity-95">
//                         {initial}
//                     </Text>
//
//                     {/* Minutes ride on the artwork like a publisher's mark, so
//                         the caption below stays just the title — which is what
//                         you actually scan a shelf for. */}
//                     <View className="absolute bottom-2 left-2 rounded bg-cream-50/25 px-1.5 py-0.5">
//                         <Text className="text-[10px] font-bold text-cream-50">{story.minutes} min</Text>
//                     </View>
//
//                     {/* State rides the artwork's top-right corner: a lock if it
//                         is Pro, a tick once the quiz is done. Never both — locked
//                         stories cannot have been read. */}
//                     {locked ? (
//                         <View className="absolute top-2 right-2 rounded-full bg-stone-900/35 p-1.5">
//                             <Icon name="lock" size={13} tone="onDark" />
//                         </View>
//                     ) : read ? (
//                         <View className="absolute top-2 right-2 rounded-full bg-cream-50/85 p-1.5">
//                             <Icon name="check" size={13} tone="accent" />
//                         </View>
//                     ) : null}
//                 </View>
//
//                 {/* ── the caption, on white ─────────────────────────────────
//                     Fixed height so every spine on the shelf lines up: a one-line
//                     title and a two-line title must not make neighbouring covers
//                     sit at different heights. */}
//                 <View className="px-2.5 pt-2 pb-2.5 h-[62px] justify-between">
//
//                     <Text
//                         className="font-serif text-[13px] leading-[17px] text-stone-900"
//                         numberOfLines={2}
//                     >
//                         {story.title}
//                     </Text>
//
//                     <Text className="text-[9px] font-bold uppercase tracking-[1.2px] text-stone-500">
//                         {story.level}
//                     </Text>
//                 </View>
//
//             </Pressable>
//         </Link>
//     )
// }
