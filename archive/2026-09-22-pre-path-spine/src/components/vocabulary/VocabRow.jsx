import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import ProgressBar from '../progress/ProgressBar.jsx'
import Icon from '../ui/Icon.jsx'

// The card recipe for the Vocabulary section, in ONE string.
//
// ⚠️ CARD BORDER REMOVED — 2026-08-29, matching the app-wide pass.
//
// This REVERSES an earlier deliberate choice, and that reasoning is worth
// keeping: cream-300 was chosen BECAUSE cream-200 was too faint to read as an
// edge on a cream card. The border was doing real work here. It came out anyway
// because every other card in the app lost its hairline the same day, and a
// vocab card that alone keeps a 2px edge reads as an oversight rather than a
// choice. Background contrast does the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: put `border` + `border-cream-300` back on the line below.
export const VOCAB_CARD = 'rounded-md bg-cream-50'

// One row shell for both list pages — a category (opens its word deck) and a
// drill (opens its quiz) are the same anatomy, and were drifting apart as two
// near-identical copies:
//
//   [ leading 64pt ] [ title / meta / optional bar ] [ trailing 64pt ]
//     ^ tap = href                                     ^ its own target
//
// Two targets, both 64pt, with the whole row as the primary one.
export default function VocabRow({
  href,
  leading,
  title,
  meta,
  badge,
  progress,
  // The accent hue for this row's progress fill — see lib/vocabAccent.js. Left
  // undefined, ProgressBar keeps its clay-600 default, so the drill rows on
  // /vocabulary are untouched.
  progressFill,
  trailing,
  accessibilityLabel,
}) {
  return (
    <View className={`${VOCAB_CARD} flex-row items-center gap-3 p-4`}>
      <Link href={href} asChild>
        <Pressable
          className="flex-row items-center gap-4 flex-1 active:opacity-70"
          accessibilityRole="link"
          accessibilityLabel={accessibilityLabel || title}
        >
          {leading}

          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text
                className="text-lg font-semibold text-stone-900 leading-tight flex-1"
                numberOfLines={2}
              >
                {title}
              </Text>
              {badge}
            </View>

            {!!meta && <Text className="text-sm font-medium text-stone-600 mt-1">{meta}</Text>}

            {/* Only when there's something to show — an empty bar on every
                untouched row is noise, and these pages are all rows. */}
            {!!progress && (
              <ProgressBar
                value={progress.value}
                max={progress.max}
                size="sm"
                fill={progressFill}
                className="mt-2"
              />
            )}
          </View>
        </Pressable>
      </Link>

      {trailing}
    </View>
  )
}

// The round 64pt chip that opens a row: an emoji for a word category, an icon for
// a drill. Same size as the quiz chip on the other end, so rows scan as a grid.
//
// `accent` tints the circle (see lib/vocabAccent.js). It is the ONLY coloured
// element on a vocabulary card, and it is why a group page of 13 categories now
// reads as a set rather than as 13 grey circles. Omit it and the medallion falls
// back to the original cream — every pre-existing call site looks unchanged.
export function RowIcon({ emoji, icon, accent }) {
  const medallion = accent?.medallion || 'bg-cream-100'
  const ring = accent?.ring || 'border-cream-300'

  if (emoji) {
    return (
      <View
        className={`h-16 w-16 rounded-full ${medallion} border ${ring} items-center justify-center`}
      >
        <Text className="text-3xl">{emoji}</Text>
      </View>
    )
  }
  return (
    <View className={`h-16 w-16 rounded-full ${accent?.medallion || 'bg-clay-600/15'} items-center justify-center`}>
      <Icon name={icon} size={26} tone="accent" />
    </View>
  )
}

export function ProBadge() {
  return (
    <View className="rounded-full bg-clay-600 px-2 py-0.5">
      <Text className="text-xs uppercase tracking-wider font-semibold text-cream-50">Pro</Text>
    </View>
  )
}
