import { View, Text } from 'react-native'
import Icon from '../ui/Icon.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// The end-of-session results furniture — the emblem at the top of the card and
// the row of numbers under it.
//
// ⚠️ LIFTED OUT OF app/words/sentences/[groupId].jsx ON 2026-09-20, unchanged,
// when the typing drill became the second screen that ends in exactly this
// card. Two drills sitting one tile apart on the Words hub have to finish the
// same way or "session complete" looks like two different apps. Copying the
// forty lines was the alternative and it is how the app ends up with two
// slightly different trophies.

// One result number, in its own tinted tile. Three of these sit side by side —
// see the call sites for why the numbers can't be collapsed into one line
// without losing information.
//
// Tint is an OPACITY modifier on an existing full-strength token (bg-ocean-700/12,
// not e.g. bg-ocean-100), the same trick the Words hub's icon circles use
// (bg-clay-600/12). This app's lime/ocean/blush scales don't all define every
// 100/300 step (tailwind.config.js) — opacity on a step that DOES exist sidesteps
// that entirely instead of adding more shade steps to the config.
const RESULT_TONES = {
  ocean: { bg: 'bg-ocean-700/12', text: 'text-ocean-700', token: '--c-ocean-700' },
  blush: { bg: 'bg-blush-500/12', text: 'text-blush-500', token: '--c-blush-500' },
  clay:  { bg: 'bg-clay-600/12',  text: 'text-clay-700',  token: '--c-clay-600' },
}

export function ResultStat({ icon, tone, value, label }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = RESULT_TONES[tone] || RESULT_TONES.clay

  return (
    <View className={`flex-1 rounded-md ${c.bg} py-3 items-center`}>
      <Icon name={icon} size={18} color={`rgb(${t[c.token]})`} />
      <Text className={`font-serif text-xl mt-1 ${c.text}`}>{value}</Text>
      <Text className="text-[10px] uppercase tracking-wide font-semibold text-stone-600 mt-0.5 text-center">
        {label}
      </Text>
    </View>
  )
}

// The results-screen icon badge. Two states, not a spectrum — either every
// answer landed or it didn't, so this is a trophy-vs-award switch rather than a
// meter. Colour comes from the SAME lime the "Correct ✓" panels use inside the
// drills, so "perfect" reads as one consistent colour across the whole screen,
// not a new one invented just for this badge.
export function ResultEmblem({ perfect }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const bg = perfect ? 'bg-lime-200' : 'bg-clay-600/12'
  const iconColor = perfect ? `rgb(${t['--c-lime-900']})` : `rgb(${t['--c-clay-600']})`

  return (
    <View className={`h-16 w-16 rounded-full items-center justify-center ${bg}`}>
      <Icon name={perfect ? 'trophy' : 'award'} size={30} color={iconColor} />
    </View>
  )
}
