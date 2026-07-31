import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../src/context/AuthContext.jsx'
import TabScreen from '../src/components/TabScreen.jsx'
import Picker from '../src/components/ui/Picker.jsx'
import Button from '../src/components/ui/Button.jsx'

const dialectOptions = [
  { value: 'white', label: 'White Hmong (Hmoob Dawb)' },
  { value: 'green', label: 'Green Hmong (Moob Leeg)' },
]

export default function Settings() {
  const { user, updateProfile } = useAuth()
  const [showTones, setShowTones] = useState(true)
  const [audioOn, setAudioOn] = useState(false)

  return (
    <TabScreen>
      <Text className="font-serif text-4xl text-stone-900 mb-6">Settings</Text>

      <View className="gap-4">
        <Field label="Dialect" hint="Choose which Hmong dialect to study.">
          <Picker
            value={user.dialectPreference}
            onChange={(v) => updateProfile({ dialectPreference: v })}
            options={dialectOptions}
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

        <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
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
      </View>
    </TabScreen>
  )
}

function Field({ label, hint, children }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
      <Text className="text-sm font-semibold text-stone-800">{label}</Text>
      {hint && <Text className="text-xs text-stone-600 mb-2">{hint}</Text>}
      {children}
    </View>
  )
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 flex-row items-start justify-between p-5">
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
