import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { isStoryFree } from '../../data/stories.js'
import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import Icon from '../ui/Icon.jsx'
import { storyCover } from '../../data/storyCovers.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { genreCoverColor } from '../../lib/genreCover.js'

// THE STORY COVER — one definition, used by the library shelves AND the genre
// grid.
//
// ⚠️ IT EXISTS AS A SHARED COMPONENT ON PURPOSE. The library used covers and the
// genre screen used generic rows, so tapping a cover landed you on something
// that looked like a settings list. Two screens showing the same object have to
// draw it the same way, and the only reliable way to guarantee that is one file.
//
// ── Why it looks like a book jacket ────────────────────────────────────────
// A single huge letter on flat colour reads as a placeholder, because that is
// what it is. A real jacket has structure: a label at the top, the title set in
// the middle with room around it, a mark at the foot, and a hairline inset from
// the trimmed edge. Reproducing that structure — even with no artwork at all —
// is what makes a coloured rectangle read as a book.

/**
 * The RATIO is the important part — 1:1.42 is roughly a paperback, and a
 * rectangle at that proportion reads as a book before you have drawn anything
 * on it. Height is always derived from it, never passed.
 *
 * ⚠️ COVER_W IS ONLY THE FALLBACK NOW. Both callers pass a real width: the
 * shelves via shelfCoverWidth() below, the genre grid from its measured column.
 * This is what a StoryCover renders at if a caller forgets — deliberately
 * mid-range, so forgetting looks wrong rather than broken.
 */
export const COVER_W = 158
export const COVER_RATIO = 1.42

/**
 * The shelf cover width for a given screen width.
 *
 * ⚠️ A FIXED WIDTH IS RIGHT ON ONE PHONE. A proportion of the screen holds the
 * same rhythm everywhere, and is clamped at both ends because a proportion
 * alone goes wrong in both directions — too narrow to set a title on a small
 * phone, poster-sized on a tablet.
 *
 * ⚠️ 40% → 30% ON 2026-09-08, at request, and the reasoning is worth keeping:
 * a shelf is sized for the library it will hold, not the one it holds today.
 * At 40% two covers filled the screen, which looks generous with three stories
 * and looks broken with twenty — every shelf becomes a long horizontal drag
 * with no sense of how much is on it. At 30% you see three and a bit, so the
 * shelf reads as a shelf, and scrolling one is a flick rather than a journey.
 *
 * The cover is a smaller OBJECT now, not just a scaled one: see SCALE below —
 * padding, title and caption all step down with it, because a 110px jacket with
 * 20px padding is mostly margin.
 */
export function shelfCoverWidth(screenWidth) {
  return Math.round(Math.min(150, Math.max(104, screenWidth * 0.3)))
}

export default function StoryCover({ story, genre, locked: lockedGenre = false, read = false, width = COVER_W }) {
  // Per-story Pro, 2026-09-28 — see isStoryFree in stories.js. The genre lock still applies too.
  const { isPro } = useSubscription()
  const locked = lockedGenre || (!isStoryFree(story) && !isPro)
  const { theme: coverTheme } = useTheme()

  // The jacket art, or null. Null is the normal case today — no story has art
  // yet — and the typographic jacket below is not a fallback in the apologetic
  // sense: it is a finished design that art is allowed to replace.
  const art = storyCover(story.id)

  // Height is DERIVED, never passed. Two independent numbers drift the moment
  // one caller changes only one of them, and a shelf of covers at slightly
  // different proportions is exactly the kind of wrong that is hard to name.
  const height = Math.round(width * COVER_RATIO)

  // ── ONE SCALE OBJECT, THREE SIZES ───────────────────────────────────────
  //
  // ⚠️ EVERY DIMENSION THAT DEPENDS ON WIDTH LIVES HERE. It was a single `big`
  // boolean flipping the title size, with the padding, the eyebrow and the
  // caption all hardcoded for a 158px cover. Below about 130 that stopped
  // working — 20px of padding on a 110px jacket leaves 70px of usable width, so
  // the title wrapped to four cramped lines while the box around it looked
  // empty.
  //
  // Reading them as one object also makes the sizes comparable at a glance,
  // which is how you keep three tiers looking like one design.
  const S =
    width >= 168
      ? { pad: 'px-5 pl-6 py-5', eyebrow: 'text-[9px]',    title: 'text-[21px] leading-[26px]', foot: 'text-[10px]', cap: 'text-[15px] leading-[19px]', capH: 46, rule: 'inset-x-[13px] inset-y-[11px]', spine: 'w-[7px]' }
      : width >= 130
        ? { pad: 'px-4 pl-5 py-4', eyebrow: 'text-[8px]',  title: 'text-[17px] leading-[21px]', foot: 'text-[9px]',  cap: 'text-[14px] leading-[18px]', capH: 44, rule: 'inset-x-[11px] inset-y-[9px]',  spine: 'w-[6px]' }
        : { pad: 'px-3 pl-4 py-3', eyebrow: 'text-[7px]',  title: 'text-[14px] leading-[18px]', foot: 'text-[8px]',  cap: 'text-[12px] leading-[15px]', capH: 34, rule: 'inset-x-[9px] inset-y-[8px]',   spine: 'w-[5px]' }

  return (
    // A locked story goes straight to the offer. Opening it only to wall the
    // reader is a worse trip than never entering.
    // ⚠️ A story with a content warning opens to the warning even when locked (author, Zong Vang):
    // the story screen shows the warning, then the paywall. Was: locked ? '/paywall' : story.
    <Link href={locked && !story.warning ? '/paywall' : `/reading/story/${story.id}`} asChild>

      <Pressable style={{ width }} className="active:opacity-80">

        {/* ── The jacket ───────────────────────────────────────────────── */}
        <View
          style={{ width, height, backgroundColor: genreCoverColor(genre.cover, coverTheme) }}
          className="rounded-lg overflow-hidden shadow-warm"
        >
          {/* ── The art, when there is any ──────────────────────────────────
              ⚠️ THE GENRE COLOUR IS STILL THE BACKGROUND OF THIS View, and it
              stays there on purpose. It shows for the frame or two while the
              image decodes, and it is what you see if a file ever goes missing
              — so a broken cover looks like a plain jacket rather than a hole.

              ⚠️ THE SCRIM IS NOT OPTIONAL. Everything on this jacket — the
              genre, the title, the minutes — is cream text sitting directly on
              it. Over uncontrolled artwork, cream on a pale sky is unreadable.
              45% black is enough to guarantee the type at any exposure while
              leaving the image plainly visible.

              First in the tree, so the spine, the hairline, the type and the
              state badge all render ON TOP of it. */}
          {art && (
            <>
              <Image source={art} resizeMode="cover" style={StyleSheet.absoluteFill} />
              <View style={StyleSheet.absoluteFill} className="bg-stone-900/45" />
            </>
          )}

          {/* The spine: a darker band down the binding edge. One element, and
              it is what stops the cover reading as a flat swatch. */}
          <View className={`absolute left-0 top-0 bottom-0 bg-stone-900/20 ${S.spine}`} />

          {/* The hairline, inset from the trim. Book jackets almost always have
              a rule set in from the edge; borrowing it costs one View. */}
          <View className={`absolute rounded border border-cream-50/25 ${S.rule}`} />

          <View className={`flex-1 justify-between ${S.pad}`}>

            <Text
              className={`font-bold uppercase tracking-[1.5px] text-cream-50/70 ${S.eyebrow}`}
              numberOfLines={1}
            >
              {genre.title}
            </Text>

            {/* The title carries the cover. Centred with room above and below,
                the way a jacket sets it — not filling the space. */}
            <Text className={`font-serif text-cream-50 ${S.title}`} numberOfLines={3}>
              {story.title}
            </Text>

            <Text className={`font-bold uppercase tracking-[1.2px] text-cream-50/70 ${S.foot}`}>
              {story.minutes} min
            </Text>
          </View>

          {/* State rides the top-right corner. Never both — a locked story
              cannot have been read. */}
          {locked ? (
            <View className="absolute top-2.5 right-2.5 rounded-full bg-stone-900/40 p-1.5">
              <Icon name="lock" size={12} tone="onDark" />
            </View>
          ) : read ? (
            <View className="absolute top-2.5 right-2.5 rounded-full bg-cream-50 p-1.5">
              <Icon name="check" size={12} tone="accent" />
            </View>
          ) : null}
        </View>

        {/* ── Below the jacket ─────────────────────────────────────────────
            The English title, NOT the Hmong one — the Hmong is already on the
            cover, and repeating it wastes the only two lines available here.
            Fixed height so every spine on a shelf lines up: a one-line and a
            two-line caption must not stagger their neighbours.

            ⚠️ SERIF, 2026-09-08. It was 12px sans, which is the app's BLURB
            style — the type it uses for the sentence under a title, not for a
            title. Every name of a thing in this app is set in the serif face,
            and a book's name should not be the exception. Sizes up with it:
            12/15 → 14/18, and the box from 38 to 44 to hold two lines. */}
        <View style={{ height: S.capH }} className="mt-2 justify-start">
          <Text className={`font-serif text-stone-900 ${S.cap}`} numberOfLines={2}>
            {story.english || story.title}
          </Text>
        </View>

      </Pressable>
    </Link>
  )
}
