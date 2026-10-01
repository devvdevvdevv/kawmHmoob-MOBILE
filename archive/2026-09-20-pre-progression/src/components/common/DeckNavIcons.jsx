import Svg, { Path } from 'react-native-svg'

// Deck-nav icons ported path-for-path from the web icon set (Arrow/Refresh):
// 24x24, stroke currentColor @ 2px, round caps/joins. RN SVG has no
// currentColor, so the color is passed in from the active theme.
//
// Shared by every study deck — the per-category one in VocabList and the
// notebook's saved-words deck — so the two look identical.

export function ArrowLeftIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12H5" /><Path d="M11 6l-6 6 6 6" />
    </Svg>
  )
}

export function ArrowRightIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 12h15" /><Path d="M13 6l6 6-6 6" />
    </Svg>
  )
}

export function RefreshIcon({ color, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 12a8 8 0 1 1-2.3-5.7" /><Path d="M20 3v4h-4" />
    </Svg>
  )
}
