import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname, useRouter } from 'expo-router'
import Svg, { Path, Circle, Line } from 'react-native-svg'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../lib/themes.js'
import LevelBadge from './progress/LevelBadge.jsx'
import StreakBadge from './progress/StreakBadge.jsx'

import { useDrawer } from './Drawer/DrawerContext.jsx'

// The slim status/identity HEADER — the top counterpart to GlobalTabBar. Mirrors
// the web Navbar: an ocean-200 band with the wordmark on the left and a cluster
// of monochrome SVG line icons (theme toggle, season pass, leaderboard, search,
// settings, account) on the right, split into groups by thin dividers.
//
// Icons are the SAME line icons the web uses (ported path-for-path). Colors are
// theme-driven; navigation is router.navigate() on Pressables (a <Link> style
// array crashes react-native-web — see notes).
const HIDE_ON = ['/login', '/onboarding']

export const HEADER_CONTENT_HEIGHT = 64

// rgb() for a --c-* token in the active theme.
function tok(theme, name) {
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  return t[name] ? `rgb(${t[name]})` : '#000'
}

export default function GlobalHeader() {
  const insets = useSafeAreaInsets()
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const { theme, cycle } = useTheme()
  const { toggle } = useDrawer()          // hamburger → toggles the drawer open

  if (HIDE_ON.some((r) => pathname.startsWith(r))) return null

  const ink = tok(theme, '--c-stone-800')      // inactive icon
  const accent = tok(theme, '--c-clay-600')     // active icon
  const ThemeIcon = theme === 'neon' ? SparkIcon : theme === 'dark' ? MoonIcon : SunIcon

  const nav = (to) => () => router.navigate(to)
  const on = (prefix) => pathname.startsWith(prefix)

  return (
    <View className="bg-ocean-200 border-b border-ocean-400/40" style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bar}>
        {/* Left — hamburger + status */}
        <View style={styles.leftCluster}>
          <IconBtn onPress={toggle}><MenuIcon color={ink} /></IconBtn>
          <LevelBadge />
          <StreakBadge />
        </View>

        {/* Right — theme toggle (Sun/Moon/Spark by current theme; cycles light→dark→neon) */}
        <View style={styles.cluster}>
          <IconBtn onPress={cycle}><ThemeIcon color={ink} /></IconBtn>
        </View>
      </View>
    </View>
  )
}

function IconBtn({ onPress, children }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} style={styles.iconBtn}>
      {children}
    </Pressable>
  )
}

// ── Icons (ported path-for-path from the web Navbar / icons) ──────────────────
const S = 23
function MenuIcon({ color }) {   // hamburger — three lines
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 6h16M4 12h16M4 18h16" />
    </Svg>
  )
}
function SunIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </Svg>
  )
}
function MoonIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </Svg>
  )
}
function SparkIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2l1.9 5.7L20 9.6l-5.4 3.2L15.8 19 12 15.4 8.2 19l1.2-6.2L4 9.6l6.1-1.9L12 2z" />
    </Svg>
  )
}
function SearchIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="7" />
      <Path d="m20 20-3.5-3.5" />
    </Svg>
  )
}
function SettingsIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82z" />
    </Svg>
  )
}
function PersonIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  )
}
function TrophyIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 4h10v5a5 5 0 0 1-10 0z" fill={color} fillOpacity={0.15} />
      <Path d="M7 5H4.8a.8.8 0 0 0-.8.9c.2 2 1.3 3.4 3 3.6M17 5h2.2a.8.8 0 0 1 .8.9c-.2 2-1.3 3.4-3 3.6" />
      <Path d="M12 14v3" />
      <Path d="M8.5 20h7l-.7-3h-5.6z" />
    </Svg>
  )
}
function TiersIcon({ color }) {
  return (
    <Svg width={S} height={S} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m12 3 8 4.5-8 4.5-8-4.5z" fill={color} fillOpacity={0.15} />
      <Path d="m4 12 8 4.5 8-4.5" />
      <Path d="m4 16.5 8 4.5 8-4.5" />
    </Svg>
  )
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30 },
  bar: {
    height: HEADER_CONTENT_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftCluster: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cluster: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { paddingHorizontal: 4, paddingVertical: 6 },
})
