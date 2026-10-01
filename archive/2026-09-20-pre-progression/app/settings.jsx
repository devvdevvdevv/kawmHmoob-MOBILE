import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../src/context/AuthContext.jsx'
import TabScreen from '../src/components/TabScreen.jsx'
import Picker from '../src/components/ui/Picker.jsx'
import Button from '../src/components/ui/Button.jsx'
import { isAdmin } from '../src/lib/admin.js'
import { useQuizPrefs, DIRECTION_OPTIONS } from '../src/lib/quizPrefs.js'
import { dialectOptions, DIALECT_NOTE } from '../src/data/dialects.js'
import { useReadingPrefs, TEXT_SIZES } from '../src/lib/readingPrefs.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// ⚠️ THE LIST MOVED — 2026-09-12. It was copied into four files and they had
// already drifted: onboarding offered Dananshan, this did not. src/data/dialects.js
// is the one source, and it carries the database-constraint warning too.

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [showTones, setShowTones] = useState(true)
  const [audioOn, setAudioOn] = useState(false)
  const { prefs, setPref } = useQuizPrefs()
  const { prefs: readingPrefs, setPref: setReadingPref } = useReadingPrefs()

  return (
    <TabScreen>
      <Text className="font-serif text-4xl text-stone-900 mb-6">Settings</Text>

      <View className="gap-4">
        <Field label="Dialect" hint={DIALECT_NOTE}>
          <Picker
            value={user.dialectPreference}
            onChange={(v) => {
              updateProfile({ dialectPreference: v }).catch((e) =>
                console.warn('[profile] could not save dialect', e)
              )
            }}
            options={dialectOptions()}
          />
        </Field>

        {/* Quizzes auto-start on open — there is no pre-quiz screen to choose a
            direction on, so it lives here and is remembered. Quizzes whose data
            only works one way (Tone Drill) ignore this; see `reversible` in
            src/data/quizzes.js. */}
        <Field
          label="Quiz direction"
          hint="Which side of a word the quiz shows you. The ⚙ inside any quiz has this and the rest."
        >
          <Picker
            value={prefs.direction}
            onChange={(v) => setPref('direction', v)}
            options={DIRECTION_OPTIONS}
          />
        </Field>

        {/* The same preference as the A / A buttons at the top of every story.
            Picker only reads `value` and `label`, so TEXT_SIZES passes straight
            in — the size numbers riding along on each step are ignored here. */}
        <Field
          label="Story text size"
          hint="How big the Hmong is set in Readings. The A / A buttons above any story change it too."
        >
          <Picker
            value={readingPrefs.textSize}
            onChange={(v) => setReadingPref('textSize', v)}
            options={TEXT_SIZES}
          />
        </Field>

        <Toggle
          label="Show tone markers"
          hint="Display tone consonants in lessons."
          checked={showTones}
          onChange={setShowTones}
        />
        <Toggle
          label="Audio playback"
          hint="Play pronunciation audio when available."
          checked={audioOn}
          onChange={setAudioOn}
        />

        <View className="rounded-md bg-cream-50 p-5">
          <Text className="text-sm font-semibold text-stone-800 mb-3">Account</Text>
          {user.isGuest ? (
            <View className="flex-row gap-2">
              <Link href="/login" asChild><Button variant="ghost">Log In</Button></Link>
              <Link href="/register" asChild><Button>Register</Button></Link>
            </View>
          ) : (
            <Link href="/account" asChild><Button variant="secondary">Manage Account</Button></Link>
          )}
        </View>

        {/* The dedication and the speaker-population page. It sits under
            Account rather than at the top because it is the thing you read once,
            not the thing you came to Settings to change. */}
        <View className="rounded-md bg-cream-50 p-5">
          <Text className="text-sm font-semibold text-stone-800 mb-1">About</Text>
          <Text className="text-xs text-stone-600 mb-3">
            Why this app exists, and who speaks Hmong.
          </Text>
          <Link href="/about" asChild>
            <Button variant="ghost">About Kawm Hmoob</Button>
          </Link>
        </View>

        {/* Admin-only entry to the dev tools. This is just the DOORWAY — /dev and
            /spike are guarded by AdminGate themselves, because a deep link walks
            straight past a hidden menu item. */}
        {isAdmin(user) && (
          <View className="rounded-md bg-cream-50 p-5">
            <Text className="text-sm font-semibold text-stone-800 mb-1">Dev tools</Text>
            <Text className="text-xs text-stone-600 mb-3">
              QA harnesses and throwaway spikes. Not visible to normal accounts.
            </Text>
            <Link href="/dev" asChild><Button variant="ghost">🛠️ Open dev tools</Button></Link>
          </View>
        )}
      </View>
    </TabScreen>
  )
}

function Field({ label, hint, children }) {
  return (
    <View className="rounded-md bg-cream-50 p-5">
      <Text className="text-sm font-semibold text-stone-800">{label}</Text>
      {hint && <Text className="text-xs text-stone-600 mb-2">{hint}</Text>}
      {children}
    </View>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <View className="rounded-md bg-cream-50 flex-row items-start justify-between p-5">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-stone-800">{label}</Text>
        {hint && <Text className="text-xs text-stone-600">{hint}</Text>}
      </View>
      <Pressable
        onPress={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full ${checked ? 'bg-clay-600' : 'bg-cream-300'}`}
      >
        <View
          className="absolute top-0.5 h-5 w-5 rounded-full bg-cream-50 shadow-warm"
          style={{ left: checked ? 20 : 2 }}
        />
      </Pressable>
    </View>
  )
}
