import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname, useRouter } from 'expo-router'
import Svg, { Path, Line, Rect } from 'react-native-svg'
import { useTheme } from '../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../lib/themes.js'

// --- Icons ---
function HomeIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 10.5L12 3l9 7.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M5 9.5V21h14V9.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} fillOpacity={filled ? 0.15 : 0} />
      <Path d="M9 21v-6h6v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  )
}

function BookIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill={filled ? color : 'none'} fillOpacity={filled ? 0.15 : 0} />
      <Path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {filled && <Line x1="8" y1="8" x2="15" y2="8" stroke={color} strokeWidth={2} strokeLinecap="round" />}
    </Svg>
  )
}

function MicIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <Path d="M5 10v1a7 7 0 0 0 14 0v-1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

function CardsIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="6" width="13" height="15" rx="2" stroke={color} strokeWidth={2} fill={filled ? color : 'none'} fillOpacity={filled ? 0.2 : 0} />
      <Path d="M8 3h11a2 2 0 0 1 2 2v13" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

function AlphabetIcon({ filled, color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      {filled && <Path d="M12 5.5L17.5 19h-11z" fill={color} fillOpacity={0.15} />}
      <Path d="M5 20L12 4l7 16" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="8.2" y1="14.5" x2="15.8" y2="14.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

// `rgb()` string for a --c-* token in the given theme (e.g. rgb(156 79 51)).
function tok(theme, name) {
  const triplet = (THEME_TOKENS[theme] || THEME_TOKENS.light)[name]
  return triplet ? `rgb(${triplet})` : 'transparent'
}

// FIVE sections. `to` is where the tab navigates; `match` decides when the tab
// stays lit — every page in the app belongs to a section, so a lesson under
// /learn/... keeps "Learn" active, and /quiz or /notebook keep "Vocabulary"
// active. Mirrors the web PrimaryNav match() functions. `ind` is the --c-* token
// for the active indicator accent (resolved per theme).
const SECTIONS = [
  { id: 'home', to: '/', label: 'Home', icon: HomeIcon, ind: '--c-stone-700', match: (p) => p === '/' },
  { id: 'learn', to: '/learn', label: 'Learn', icon: BookIcon, ind: '--c-seafoam-500', match: (p) => p.startsWith('/learn') },
  { id: 'speak', to: '/speak', label: 'Speak', icon: MicIcon, ind: '--c-clay-600', match: (p) => p.startsWith('/speak') },
  // Tab opens the Words hub (the richer daily-practice page); the category grid
  // stays at /vocabulary, reached from the hub's "Browse words" tile.
  { id: 'vocabulary', to: '/words', label: 'Words', icon: CardsIcon, ind: '--c-blush-500', match: (p) => ['/vocabulary', '/words', '/quiz', '/notebook', '/review', '/search'].some((r) => p.startsWith(r)) },
  { id: 'reference', to: '/reference', label: 'Reference', icon: AlphabetIcon, ind: '--c-cream-600', match: (p) => ['/reference', '/alphabet', '/course'].some((r) => p.startsWith(r)) },
]

// Screens where the nav bar should be hidden (full-screen flows).
const HIDE_ON = ['/login', '/register', '/onboarding']

// The persistent bottom navigation. Rendered ONCE by the root layout (see
// app/_layout.jsx), so it floats over every screen in the app rather than
// belonging to any single navigator. It reads the current route with
// usePathname() to decide which tab is active, and navigates with
// router.navigate() (which reuses an existing screen instead of stacking a
// duplicate).
export default function GlobalTabBar() {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const pathname = usePathname()
  const router = useRouter()

  if (HIDE_ON.some((r) => pathname.startsWith(r))) return null

  const active = SECTIONS.findIndex((s) => s.match(pathname))
  const textActive = tok(theme, '--c-stone-900')
  const textInactive = tok(theme, '--c-stone-500')
  // Percentage-based so it tracks the flex tab grid at any screen width (and on
  // web, where a pixel width captured at module load would be wrong).
  const tabPct = 100 / SECTIONS.length

  return (
    <View style={styles.tabBarContainer}>
      <View
        className="bg-cream-50 border-t border-cream-200"
        style={[styles.tabBarGlass, { paddingBottom: Math.max(insets.bottom, 8) }]}
      >
        <View style={styles.indicatorTrack}>
          <View style={[styles.indicator, {
            backgroundColor: active >= 0 ? tok(theme, SECTIONS[active].ind) : 'transparent',
            opacity: active >= 0 ? 1 : 0,
            width: `${tabPct}%`,
            left: `${(active >= 0 ? active : 0) * tabPct}%`,
          }]} />
        </View>

        <View style={styles.tabGrid}>
          {SECTIONS.map((s, i) => {
            const isActive = i === active
            const Icon = s.icon
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => router.navigate(s.to)}
                activeOpacity={0.7}
                style={styles.tabItem}
              >
                <Icon filled={isActive} color={isActive ? textActive : textInactive} />
                <Text style={[styles.tabLabel, {
                  color: isActive ? textActive : textInactive,
                  fontWeight: isActive ? '600' : '500',
                }]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  )
}

// Height (excluding safe-area inset) the bar occupies. Screens add this much
// bottom padding so their last content clears the floating bar — see TabScreen.
export const TAB_BAR_HEIGHT = 62

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  tabBarGlass: {
    // border comes from className (border-t border-cream-200, themed)
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  indicatorTrack: {
    position: 'relative',
    height: 2,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 2,
    borderRadius: 1,
  },
  tabGrid: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingTop: 10,
    paddingBottom: 8,
    minHeight: 52,
  },
  tabLabel: {
    fontSize: 11,
  },
})
