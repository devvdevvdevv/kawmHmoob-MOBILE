import { View, Text, Pressable } from 'react-native'
import { TEXT_SIZES } from '../../lib/readingPrefs.js'

/**
 * A− / A+ for body text, stepping through TEXT_SIZES.
 *
 * ⚠️ EXTRACTED FROM THE READER — 2026-10-14 (author: "we need to provide
 * something that can allow the user to adjust the font size"). It lived inside
 * app/reading/story/[storyId]/index.jsx, which meant the ONE place in the app
 * that let a learner resize text was a story. Lessons are longer than most
 * stories; the path's intros run to 33 paragraphs.
 *
 * Two big-and-small "A"s rather than −/+ glyphs: the pair is the reading-app
 * convention for text size, and it says WHAT gets bigger, which a plus does not.
 *
 * ⚠️ The ends DISABLE rather than wrap. Wrapping from the largest step back to Small
 * turns "one more tap" into the text suddenly shrinking, which reads as a bug.
 *
 * @param {string} value     the current TEXT_SIZES value ('sm' | 'md' | 'lg')
 * @param {Function} onChange called with the next value
 * @param {string} [label]   what is being resized, for the screen reader
 */
export default function TextSizeStepper({ value, onChange, label = 'text' }) {
  const i = Math.max(0, TEXT_SIZES.findIndex((s) => s.value === value))
  const canShrink = i > 0
  const canGrow = i < TEXT_SIZES.length - 1

  return (
    <View className="flex-row items-center gap-1 rounded-md bg-cream-100 p-0.5">
      <Pressable
        onPress={() => onChange(TEXT_SIZES[i - 1].value)}
        disabled={!canShrink}
        // Vertical slop only — horizontal would overlap the neighbouring button
        // and make a tap between them a coin toss.
        hitSlop={{ top: 8, bottom: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Smaller ${label}`}
        className={`h-8 w-9 items-center justify-center rounded active:bg-cream-200 ${canShrink ? '' : 'opacity-40'}`}
      >
        {/* maxFontSizeMultiplier: these are control glyphs in a fixed-height
            box, not text to be read — see the dynamic-type item in TODO.md. */}
        <Text maxFontSizeMultiplier={1.3} className="font-serif text-[13px] text-stone-800">A</Text>
      </Pressable>

      <Pressable
        onPress={() => onChange(TEXT_SIZES[i + 1].value)}
        disabled={!canGrow}
        hitSlop={{ top: 8, bottom: 8 }}
        accessibilityRole="button"
        accessibilityLabel={`Larger ${label}`}
        className={`h-8 w-9 items-center justify-center rounded active:bg-cream-200 ${canGrow ? '' : 'opacity-40'}`}
      >
        <Text maxFontSizeMultiplier={1.3} className="font-serif text-[19px] text-stone-800">A</Text>
      </Pressable>
    </View>
  )
}
