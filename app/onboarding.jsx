import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Button from '../src/components/ui/Button.jsx'
import { useAuth } from '../src/context/AuthContext.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import { useThemeColor } from '../src/lib/themeColor.js'
import { DIALECTS, DIALECT_NOTE } from '../src/data/dialects.js'

// ⚠️ SHORTENED 2026-09-28 (author: "more succinct, and doesn't talk about the planned voice
// dataset"). The intro is one line and no longer mentions the voice dataset; every question stays
// (the author: "we need all four … for stats"). The ethnicity hint lost its dataset clause.
//
// New-user onboarding. Collects OPTIONAL speaker metadata that personalizes the
// experience and helps label an open Hmong voice dataset. Ported from the web
// Onboarding page. Non-negotiables kept intact: everything is optional (every
// field has "Prefer not to say", and the whole page can be skipped), the
// purpose is disclosed up top, and completing OR skipping stamps onboardedAt.

const AGE_RANGES = ['Under 18', '18–20', '21–25', '26–30', '31–40', '41–55', '56+']
const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer to self-describe']
const HMONG_RELATIONSHIP = [
  { value: 'native', label: 'Hmong is my first language' },
  { value: 'heritage', label: 'I grew up hearing it at home' },
  { value: 'some-family', label: 'Some family connection to Hmong' },
  { value: 'learner', label: 'Learning it from scratch' },
]
const ETHNICITIES = [
  'Hmong', 'Other Asian', 'White', 'Black or African American',
  'Hispanic or Latino', 'Middle Eastern or North African', 'Multiracial', 'Other',
]
// ⚠️ THIS FILE WAS THE ONE THAT WAS RIGHT — it already offered all three while
// Settings, Profile and Register offered two. The list now comes from
// src/data/dialects.js so the next addition cannot land in only one screen.
// `short` labels, because these render as pills rather than in a dropdown.
const PREFER_NOT = '__prefer_not__'

export default function Onboarding() {
  // ⚠️ A HOOK, so it sits above every early return in this component — the
  // colours it resolves change with the theme, and hook order may not.
  const themeColor = useThemeColor()

  const router = useRouter()
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    ageRange: '',
    gender: '',
    dialectPreference: user.dialectPreference || 'white',
    hmongRelationship: '',
    ethnicity: '',
    region: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const clean = (v) => (v === '' ? null : v === PREFER_NOT ? 'prefer_not_to_say' : v)

  const finish = async (fields) => {
    setSaving(true)
    setError(null)
    try {
      await updateProfile({ ...fields, onboardedAt: new Date().toISOString() })
      router.replace('/')
    } catch (err) {
      setError(err?.message || 'Could not save — you can update this later in Settings.')
      setSaving(false)
    }
  }

  const submit = () =>
    finish({
      ageRange: clean(form.ageRange),
      gender: clean(form.gender),
      dialectPreference: form.dialectPreference,
      hmongRelationship: clean(form.hmongRelationship),
      ethnicity: clean(form.ethnicity),
      region: form.region.trim() || null,
    })

  const skip = () => finish({})

  return (
    <TabScreen>
      {/* One card, app color scheme (cream surface + bold border). TabScreen
          already scrolls, so no nested ScrollView. */}
      {/* ⚠️ Border removed, radius corrected — 2026-09-08. The 2px cream-200
          hairline is the treatment the app dropped on 2026-08-29 for reading too
          dark on cream; shadow-warm and background contrast separate surfaces
          instead. rounded-lg → rounded-md, the shared card corner.
          Was: className="rounded-lg bg-cream-50 border-2 border-cream-200 p-6" */}
      <View className="rounded-md bg-cream-50 shadow-warm p-6">
        {/* Header */}
            <Eyebrow tone="accent" className="mb-2">Welcome{user.displayName && user.displayName !== 'Guest' ? `, ${user.displayName}` : ''}</Eyebrow>
            {/* Was: "Tell us about you" + a paragraph about labelling an open Hmong voice dataset
                (removed 2026-09-28, author). */}
            <Text className="font-serif text-4xl text-stone-900 mb-2">
              A few quick questions
            </Text>

            <Text className="text-stone-700 leading-relaxed mb-6">
              All optional. Skip any of them, and change them anytime in Settings.
            </Text>

            {/* Form */}
            <View className="gap-7">
              <Choice label="Age range" options={AGE_RANGES} value={form.ageRange} onChange={(v) => set('ageRange', v)} />
              <Choice label="Gender" options={GENDERS} value={form.gender} onChange={(v) => set('gender', v)} />

              <View>
                <Label>Which dialect are you learning?</Label>
                <View className="flex-row flex-wrap gap-2">
                  {DIALECTS.map((d) => (
                    <Pill key={d.value} active={form.dialectPreference === d.value} onPress={() => set('dialectPreference', d.value)}>
                      {d.short}
                    </Pill>
                  ))}
                </View>
                {/* The same sentence as every other dialect picker. It was a
                    second copy of this warning, worded slightly differently —
                    which is how a caveat ends up true on one screen and stale
                    on another. */}
                <Text className="text-xs text-stone-600 mt-2">{DIALECT_NOTE}</Text>
              </View>

              <Choice label="How do you know Hmong?" options={HMONG_RELATIONSHIP} value={form.hmongRelationship} onChange={(v) => set('hmongRelationship', v)} />
              <Choice
                label="Ethnicity"
                // Was: '… never shared publicly. Helps make the dataset representative.' (2026-09-28)
                hint="Optional and never shared publicly."
                options={ETHNICITIES}
                value={form.ethnicity}
                onChange={(v) => set('ethnicity', v)}
              />

              <View>
                <Label hint="e.g. a state, country, or region your family is from">
                  Where are you / your family from?
                </Label>
                <TextInput
                  value={form.region}
                  onChangeText={(v) => set('region', v)}
                  placeholder="Optional"
                  placeholderTextColor={themeColor('--c-stone-400')}
                  className="w-full rounded-lg border-2 border-cream-300 bg-cream-50 px-4 py-3.5 text-base text-stone-900"
                />
              </View>

              {error && (
                <View className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                  <Text className="text-sm text-red-900">{error}</Text>
                </View>
              )}

              {/* Actions */}
              <View className="flex-row flex-wrap items-center gap-4 pt-2">
                <Button onPress={submit} disabled={saving}>
                  {saving ? 'Saving…' : 'Start learning'}
                </Button>
                <Pressable onPress={saving ? undefined : skip} disabled={saving}>
                  <Text className="text-sm font-medium text-stone-600 underline">Skip for now</Text>
                </Pressable>
              </View>
            </View>
      </View>

      {/* Extra bottom spacing */}
      <View className="h-6" />
    </TabScreen>
  )
}

function Label({ children, hint }) {
  return (
    <View className="mb-2">
      <Text className="text-sm font-semibold text-stone-800">{children}</Text>
      {hint && <Text className="text-xs text-stone-600 mt-0.5">{hint}</Text>}
    </View>
  )
}

function Choice({ label, hint, options, value, onChange }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <View>
      <Label hint={hint}>{label}</Label>
      <View className="flex-row flex-wrap gap-2">
        {opts.map((o) => (
          <Pill key={o.value} active={value === o.value} onPress={() => onChange(o.value)}>
            {o.label}
          </Pill>
        ))}
        <Pill active={value === PREFER_NOT} onPress={() => onChange(value === PREFER_NOT ? '' : PREFER_NOT)} muted>
          Prefer not to say
        </Pill>
      </View>
    </View>
  )
}

function Pill({ active, onPress, children, muted }) {
  const base = 'rounded-full px-4 py-2 border transition'
  const cls = active
    ? 'bg-clay-600 border-clay-600'
    : muted
      ? 'bg-cream-100 border-cream-200'
      : 'bg-cream-100 border-cream-200'
  const textCls = active ? 'text-cream-50' : muted ? 'text-stone-600' : 'text-stone-800'
  return (
    <Pressable onPress={onPress} className={`${base} ${cls}`}>
      <Text className={`text-sm font-medium ${textCls}`}>{children}</Text>
    </Pressable>
  )
}