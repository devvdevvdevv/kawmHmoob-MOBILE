import { useState } from 'react'
import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Tiles used to be a fixed `w-[100px]` in a wrapping row. Whatever width didn't
// divide evenly piled up as dead space on the RIGHT — so the grid sat off-centre,
// by a different amount on every screen size and orientation.
//
// Now the row measures itself (onLayout) and the tile width is computed to fill it
// exactly: N columns edge to edge, equal margins on both sides, at any width. The
// tile width is FLOORED so floating-point remainders can never push the last tile
// onto its own line (that slack is a pixel or two, invisible).
const GAP = 12        // must match the `gap-3` on the row below
// The packing threshold, NOT the rendered width: how many MIN_TILE-wide tiles fit
// decides the column count, then the tiles grow to fill the row. 90 is tuned so
// every common phone (360–428pt) lands on 3 columns of 98–121px — the ~100px the
// tiles were designed at — and the 672pt max-width column lands on 6.
const MIN_TILE = 90

// The letter tile grid — consonants and vowels. items: [{ letter, sound?, audio? }]
export default function LetterGrid({ items }) {
  const [rowWidth, setRowWidth] = useState(0)

  // ⚠️ OVERRIDE REMOVED — 2026-09-14. It made every letter INVISIBLE on the
  // dark and neon themes, which is the opposite of what it was written to do.
  //
  // Was: const letterStyle = theme === 'light' ? undefined
  //        : { color: tokenColor(theme, '--c-cream-50') }
  //
  // Its comment claimed "the dark themes' cream-50 is a warm off-white". It is
  // not. Check src/lib/themes.js:
  //
  //            cream-50 (the CARD bg)   clay-700 (the letter)
  //   light    251 246 236  near-white  126 63 40   dark brown   ✓ readable
  //   dark      33  29  26  near-BLACK  178 94 61   light clay   ✓ readable
  //   neon      23  21  38  near-BLACK  226 82 58   bright clay  ✓ readable
  //
  // The tile is `bg-cream-50`, so painting the text cream-50 painted it in
  // exactly its own background. Every token in this app ALREADY inverts per
  // theme — that is the entire point of the CSS-variable system (see the note
  // at the top of tailwind.config.js: "no `dark:` variants in components").
  // `text-clay-700` was correct in all three themes on its own.
  //
  // THE GENERAL RULE: if a themed token looks wrong in dark mode, fix the token
  // in themes.js. Do not hand-pick a replacement colour in a component — you
  // are overriding the one mechanism that was already handling it.

  // rowWidth is 0 until the first layout pass — fall back to the original 100px so
  // the first frame renders a sane layout rather than a collapsed one.
  const cols = rowWidth ? Math.max(1, Math.floor((rowWidth + GAP) / (MIN_TILE + GAP))) : 0
  const tileWidth = cols ? Math.floor((rowWidth - GAP * (cols - 1)) / cols) : 100

  return (
    <View
      className="flex-row flex-wrap gap-3"
      onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
    >
      {items.map((it) => (
        <View
          key={it.letter}
          // minHeight = width: a tile is never taller than it is wide. Short labels
          // pad out to a square instead of sitting in a narrow, portrait box.
          style={{ width: tileWidth, minHeight: tileWidth }}
          className="rounded-md bg-cream-50 px-2 py-2 items-center justify-center"
        >
          <View className="self-end">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700">
            {it.letter}
          </Text>
          {it.sound ? (
            <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound}</Text>
          ) : null}
        </View>
      ))}
    </View>
  )
}
