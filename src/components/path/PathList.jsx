import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import { usePathLock } from '../../context/PathLockContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { isAdmin } from '../../lib/admin.js'
import { ProBadge } from '../vocabulary/VocabRow.jsx'
import { livePath } from '../../data/path.js'
import { STEPS, stepAvailability, stepsDone, unitStatus } from '../../lib/pathProgress.js'

// THE PATH — every live unit, in teaching order, with where the learner stands.
// Used by /path and by Home. See src/data/path.js for what a unit is.
//
// Numbering is position in the LIVE path, not the unit's `order`: a unit that is
// not ready yet is not shown, and a learner should never see "unit 7" follow
// "unit 5". The course grows in place as content lands (livePath() in path.js).
//
// ⚠️ Rows are static className strings only — no function `style` on a Pressable,
// which renders invisible on native in this app (see the NativeWind note).
//
// `units` (optional) renders a SUBSET — Home shows what is next, and the Learn
// hub shows the units belonging to one chapter (2026-09-23).
//
// ⚠️ THE NUMBER IS ALWAYS THE UNIT'S POSITION IN THE WHOLE LIVE PATH, never its
// position in the subset. A learner who sees "Classifiers" as ⑤ on /path must
// not see it as ① inside Learn's Grammar chapter — the number is what tells them
// where they are in the course, and two different numbers for one unit would
// make the course look like two courses.
export default function PathList({ progress, hasPro, units }) {
  const all = livePath()
  const shown = units || all
  return (
    <View className="gap-3">
      {shown.map((unit) => (
        <UnitRow
          key={unit.id}
          n={all.findIndex((u) => u.id === unit.id) + 1}
          prev={all[all.findIndex((u) => u.id === unit.id) - 1] || null}
          unit={unit}
          progress={progress}
          hasPro={hasPro}
        />
      ))}
    </View>
  )
}

function UnitRow({ n, prev, unit, progress, hasPro }) {
  // Admins see every unit open, for debugging (2026-09-25) — see unitStatus.
  const { user } = useAuth()
  // Was: an inline LockedPanel toggled by useState (2026-09-28, same day). Now a root-mounted modal.
  const showLock = usePathLock()
  const status = unitStatus(unit, progress, hasPro, { admin: isAdmin(user) })
  const avail = stepAvailability(unit)
  const done = stepsDone(unit, progress)
  const steps = STEPS.filter((s) => avail[s.key])
  const doneCount = steps.filter((s) => done[s.key]).length
  const locked = status === 'locked'

  const row = (
    <View className={`rounded-md bg-cream-50 p-4 flex-row items-center gap-4 ${locked ? 'opacity-60' : ''}`}>
      <Medallion n={n} status={status} emoji={unit.emoji} />

      <View className="flex-1">
        {/* ⚠️ HMONG FIRST, ENGLISH UNDER IT — 2026-09-23. The unit a learner is
            working through is named in the language they are learning; the
            English is the gloss, not the heading. A unit with no attested Hmong
            name shows English alone in the same serif slot, so the rows stay a
            single column of names either way. */}
        <View className="flex-row items-center gap-2">
          <Text className="font-serif text-lg text-stone-900 flex-1" numberOfLines={1}>
            {unit.hmongTitle || unit.title}
          </Text>
          {status === 'pro' && <ProBadge />}
        </View>
        {unit.hmongTitle && (
          <Text className="text-xs font-medium text-stone-500 mt-0.5" numberOfLines={1}>{unit.title}</Text>
        )}

        {/* ⚠️ DEV ONLY — a reminder to the author, never shown to a learner. An
            English-only unit is not broken; it is waiting on a Hmong name a
            fluent speaker has confirmed. See hmongTitle in src/data/path.js. */}
        {__DEV__ && !unit.hmongTitle && (
          <Text className="text-xs font-medium text-clay-700 mt-0.5">⚠ no Hmong name yet</Text>
        )}

        <Text className="text-sm font-medium text-stone-600 mt-0.5" numberOfLines={2}>{unit.blurb}</Text>

        {/* One pip per AVAILABLE step. A skipped step gets no pip at all —
            showing an empty one would read as something left to do. */}
        <View className="flex-row items-center gap-1.5 mt-2">
          {steps.map((s) => (
            <View
              key={s.key}
              className={`h-1.5 flex-1 rounded-full ${done[s.key] ? 'bg-clay-600' : 'bg-cream-300'}`}
            />
          ))}
          <Text className="text-xs font-medium text-stone-600 ml-1.5">{doneCount}/{steps.length}</Text>
        </View>
      </View>

      <Icon name={locked ? 'lock' : 'arrowRight'} size={18} tone={locked ? 'muted' : 'accent'} />
    </View>
  )

  // A locked unit is not a link — there is nothing to open yet. Pro units ARE
  // links: the unit screen explains what unlocking it takes.
  // Was: `if (locked) return row` — a dead row that did nothing when tapped. 2026-09-28 (author:
  // "if they tap on locked path they get a locked, upgrade etc"): tapping opens a panel that says
  // what to finish first and, for a Pro unit a free learner can't open anyway, offers the upgrade.
  // Locked AND Pro rows open the modal (author: "make the lock a modal … users MUST be pro").
  // Was: Pro rows linked to the unit screen, which showed the paywall there.
  if (locked || status === 'pro') {
    const needsPro = !unit.free && !hasPro
    return (
      <Pressable onPress={() => showLock({ unit, prev, reason: locked ? 'locked' : 'pro', needsPro })} className="active:opacity-80">
        {row}
      </Pressable>
    )
  }
  return (
    <Link href={`/path/${unit.id}`} asChild>
      <Pressable className="active:opacity-80">{row}</Pressable>
    </Link>
  )
}

// ⚠️ UNUSED since the same day — replaced by PathLockModal (root-mounted). Kept to restore the
// inline version: render it under the row instead of calling showLock().
// What a learner sees on tapping a locked unit (2026-09-28). Static classNames only.
function LockedPanel({ unit, prev, needsPro }) {
  const prevName = prev ? (prev.hmongTitle ? `${prev.hmongTitle} (${prev.title})` : prev.title) : 'the unit before it'
  return (
    <View className="rounded-md bg-cream-100 px-4 py-4 mt-2 gap-3">
      <View className="flex-row items-center gap-2">
        <Icon name="lock" size={16} tone="muted" />
        <Text className="text-base font-semibold text-stone-900">{unit.title} is locked</Text>
      </View>
      <Text className="text-sm font-medium text-stone-700">
        Finish {prevName} to open it. Units open one at a time, so each one builds on the last.
      </Text>
      {needsPro && (
        <Text className="text-sm font-medium text-stone-700">
          It is also part of KawmHmong Pro, along with every topic unit and word set.
        </Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {prev && (
          <Link href={`/path/${prev.id}`} asChild>
            <Button size="sm" variant="secondary">Go to {prev.title}</Button>
          </Link>
        )}
        {needsPro && (
          <Link href="/paywall" asChild>
            <Button size="sm" variant="primary">See plans</Button>
          </Link>
        )}
      </View>
    </View>
  )
}

function Medallion({ n, status, emoji }) {
  if (status === 'complete') {
    return (
      <View className="h-12 w-12 rounded-full bg-success-200 items-center justify-center">
        <Icon name="check" size={22} tone="accent" />
      </View>
    )
  }
  if (status === 'locked') {
    return (
      <View className="h-12 w-12 rounded-full bg-cream-200 items-center justify-center">
        <Text className="font-serif text-lg text-stone-600">{n}</Text>
      </View>
    )
  }
  return (
    <View className="h-12 w-12 rounded-full bg-clay-600/15 border border-clay-500/30 items-center justify-center">
      <Text className="text-2xl">{emoji || n}</Text>
    </View>
  )
}
