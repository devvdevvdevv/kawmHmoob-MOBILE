import { View, Text } from 'react-native'
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Tone-contour overlay: the native reference vs the learner's take, both as
// pitch curves on one plot. Time on x, semitones-from-own-median on y.
//
// Ported from the web app's ToneCurve.jsx. The MATH is identical; only the
// rendering changes — <svg>/<path> become react-native-svg's <Svg>/<Path>,
// which is already a dependency (KawmHmoobLogo.jsx uses it).
//
// This is the honest core of the Speak feedback. Two lines can't be "wrong" —
// they show what happened, and the learner SEES their tone go flat where it
// should rise. A single number can only say "68"; the curve says WHERE.
//
// Both curves arrive already normalized to semitones around each speaker's OWN
// median (see normalizeContour in yin.js) — that is what puts a low male voice
// and a high female voice on the same axis. The y-axis labels say "st" for
// semitones, and 0 is that median: NOT an absolute pitch, and not the same Hz
// for both speakers. That is the point, and it is why the centre line is
// labelled rather than left as a bare rule.

const W = 320
const H = 180

// Asymmetric padding: the left and bottom edges carry axis labels, so they need
// more room than the top and right. Getting this wrong clips the text without
// any error — SVG just draws outside the viewBox and it vanishes.
const PAD_L = 30
const PAD_R = 10
const PAD_T = 12
const PAD_B = 22

function pathFor(points, xScale, yScale) {
  if (!points.length) return ''
  // Break the line at time gaps (unvoiced stretches) rather than drawing a
  // straight segment across silence — a gap is information, not a pitch slide.
  // 'M' starts a new subpath, 'L' continues the current one.
  let d = ''
  let prevT = null
  for (const p of points) {
    const x = xScale(p.t)
    const y = yScale(p.st)
    const gap = prevT != null && p.t - prevT > 0.06 // >60 ms unvoiced
    d += `${d === '' || gap ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `
    prevT = p.t
  }
  return d.trim()
}

// ⚠️ `refCurve`, NOT `ref` — `ref` is reserved in React. Passing it to a plain
// function component silently drops it, so the native line would never draw and
// there would be no error explaining why.
export default function ToneCurve({ refCurve = [], user = [] }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const refColor = `rgb(${t['--c-stone-700']})`
  const userColor = `rgb(${t['--c-clay-600']})`
  const gridColor = `rgb(${t['--c-cream-200']})`
  const axisText = `rgb(${t['--c-stone-700']})`
  const labelColor = `rgb(${t['--c-stone-700']})`

  const all = [...refCurve, ...user]
  if (all.length < 2) return null

  const tMax = Math.max(...all.map((p) => p.t)) || 1
  // Symmetric semitone range, at least ±6 st so small wiggles don't fill the
  // frame and look dramatic. Capped at 18 so one octave-error outlier can't
  // flatten every real movement into a straight line.
  const stMax = Math.min(18, Math.max(6, ...all.map((p) => Math.abs(p.st) + 1)))

  const plotW = W - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const midY = PAD_T + plotH / 2

  const xScale = (v) => PAD_L + (v / tMax) * plotW
  const yScale = (st) => midY - (st / stMax) * (plotH / 2)

  // Round the semitone tick to something readable — ±6.4 st is noise, ±6 isn't.
  const stTick = Math.round(stMax)

  return (
    <View className="items-center">
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* ── grid ─────────────────────────────────────────────────────── */}
        {/* Top and bottom bounds, dashed so they read as reference not data */}
        <Line x1={PAD_L} y1={PAD_T} x2={W - PAD_R} y2={PAD_T}
              stroke={gridColor} strokeWidth={1} strokeDasharray="2 4" />
        <Line x1={PAD_L} y1={PAD_T + plotH} x2={W - PAD_R} y2={PAD_T + plotH}
              stroke={gridColor} strokeWidth={1} strokeDasharray="2 4" />
        {/* The median line — solid, because it's the anchor everything is
            measured from, not just a gridline. */}
        <Line x1={PAD_L} y1={midY} x2={W - PAD_R} y2={midY}
              stroke={gridColor} strokeWidth={1.5} />
        {/* y axis */}
        <Line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH}
              stroke={gridColor} strokeWidth={1} />

        {/* ── y-axis labels: semitones from the speaker's own median ────── */}
        <SvgText x={PAD_L - 4} y={PAD_T + 4} fill={axisText} fontSize="9" textAnchor="end">
          {`+${stTick}`}
        </SvgText>
        <SvgText x={PAD_L - 4} y={midY + 3} fill={axisText} fontSize="9" textAnchor="end">
          0
        </SvgText>
        <SvgText x={PAD_L - 4} y={PAD_T + plotH + 3} fill={axisText} fontSize="9" textAnchor="end">
          {`−${stTick}`}
        </SvgText>
        {/* Unit, once — repeating "st" on every tick is noise */}
        <SvgText x={PAD_L - 4} y={PAD_T - 3} fill={axisText} fontSize="8" textAnchor="end" opacity={0.7}>
          st
        </SvgText>

        {/* ── x-axis labels: time ───────────────────────────────────────── */}
        <SvgText x={PAD_L} y={H - 8} fill={axisText} fontSize="9" textAnchor="start">
          0s
        </SvgText>
        <SvgText x={W - PAD_R} y={H - 8} fill={axisText} fontSize="9" textAnchor="end">
          {`${tMax.toFixed(1)}s`}
        </SvgText>

        {/* ── the data ──────────────────────────────────────────────────── */}
        {refCurve.length > 0 && (
          <Path
            d={pathFor(refCurve, xScale, yScale)}
            stroke={refColor}
            strokeWidth={2}
            strokeDasharray="4 3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {user.length > 0 && (
          <Path
            d={pathFor(user, xScale, yScale)}
            stroke={userColor}
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
          />
        )}
      </Svg>

      <View className="flex-row gap-4 mt-1">
        {refCurve.length > 0 && (
          <View className="flex-row items-center gap-2">
            <View style={{ width: 16, height: 2, backgroundColor: refColor }} />
            <Text style={{ color: labelColor }} className="text-xs">Native</Text>
          </View>
        )}
        <View className="flex-row items-center gap-2">
          <View style={{ width: 16, height: 3, backgroundColor: userColor }} />
          <Text style={{ color: labelColor }} className="text-xs">You</Text>
        </View>
      </View>

      {/* What 0 MEANS. Without this the axis is misread as absolute pitch, and
          a learner wonders why their curve isn't lower than a deep voice's. */}
      <Text style={{ color: labelColor }} className="text-[10px] opacity-70 mt-1 text-center">
        0 = each speaker&apos;s own average pitch · st = semitones
      </Text>
    </View>
  )
}
