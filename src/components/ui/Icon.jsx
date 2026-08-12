import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Shared stroke-icon set — the same line-icon language as GlobalHeader, so the app
// uses ONE consistent icon system instead of emoji. Feather/Lucide-style paths at a
// 24 viewBox, 2px round strokes.
//
//   <Icon name="flame" tone="accent" />
//   <Icon name="zap" size={20} tone="ink" />
//
// `tone` maps to a theme token so icons recolor with the theme automatically.

const TONES = {
  ink: '--c-stone-800',
  accent: '--c-clay-600',
  muted: '--c-stone-400',
  onDark: '--c-cream-50',
}

// Each icon is a render function of the shared stroke props.
const ICONS = {
  flame: (p) => (
    <Path {...p} d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  ),
  star: (p) => (
    <Path {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  ),
  inbox: (p) => (
    <>
      <Path {...p} d="M22 12h-6l-2 3h-4l-2-3H2" />
      <Path {...p} d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
  check: (p) => (
    <>
      <Path {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <Polyline {...p} points="22 4 12 14.01 9 11.01" />
    </>
  ),
  layers: (p) => (
    <>
      <Path {...p} d="M12 2L2 7l10 5 10-5-10-5z" />
      <Polyline {...p} points="2 17 12 22 22 17" />
      <Polyline {...p} points="2 12 12 17 22 12" />
    </>
  ),
  zap: (p) => (
    <Path {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  ),
  music: (p) => (
    <>
      <Path {...p} d="M9 18V5l12-2v13" />
      <Circle {...p} cx="6" cy="18" r="3" />
      <Circle {...p} cx="18" cy="16" r="3" />
    </>
  ),
  book: (p) => (
    <>
      <Path {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path {...p} d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  bookOpen: (p) => (
    <>
      <Path {...p} d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <Path {...p} d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  grid: (p) => (
    <>
      <Line {...p} x1="3" y1="3" x2="21" y2="3" />
      <Path {...p} d="M4 7h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <Line {...p} x1="9" y1="11" x2="15" y2="11" />
    </>
  ),
  arrowRight: (p) => (
    <>
      <Line {...p} x1="4" y1="12" x2="19" y2="12" />
      <Polyline {...p} points="13 6 19 12 13 18" />
    </>
  ),
  arrowLeft: (p) => (
    <>
      <Line {...p} x1="19" y1="12" x2="5" y2="12" />
      <Polyline {...p} points="12 19 5 12 12 5" />
    </>
  ),
  eye: (p) => (
    <>
      <Path {...p} d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <Circle {...p} cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (p) => (
    <>
      <Path {...p} d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <Path {...p} d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <Path {...p} d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <Line {...p} x1="2" y1="2" x2="22" y2="22" />
    </>
  ),
  mic: (p) => (
    <>
      <Path {...p} d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <Path {...p} d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <Line {...p} x1="12" y1="19" x2="12" y2="22" />
    </>
  ),
  trophy: (p) => (
    <>
      <Path {...p} d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path {...p} d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path {...p} d="M4 22h16" />
      <Path {...p} d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <Path {...p} d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <Path {...p} d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </>
  ),
  award: (p) => (
    <>
      <Circle {...p} cx="12" cy="8" r="6" />
      <Path {...p} d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  ),
  fileText: (p) => (
    <>
      <Path {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <Polyline {...p} points="14 2 14 8 20 8" />
      <Line {...p} x1="16" y1="13" x2="8" y2="13" />
      <Line {...p} x1="16" y1="17" x2="8" y2="17" />
    </>
  ),
  lock: (p) => (
    <>
      <Rect {...p} x="4" y="11" width="16" height="10" rx="2" />
      <Path {...p} d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  trash: (p) => (
    <>
      <Polyline {...p} points="3 6 5 6 21 6" />
      <Path {...p} d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <Line {...p} x1="10" y1="11" x2="10" y2="17" />
      <Line {...p} x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
}

export default function Icon({ name, size = 22, tone = 'ink', color }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const stroke = color || `rgb(${t[TONES[tone]] || t['--c-stone-800']})`
  const render = ICONS[name]
  if (!render) return null
  const p = { stroke, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {render(p)}
    </Svg>
  )
}
