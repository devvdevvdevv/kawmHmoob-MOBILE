import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'
import Picker from '../ui/Picker.jsx'
import PasswordField from '../ui/PasswordField.jsx'

const dialectOptions = [
  { value: 'white', label: 'White Hmong (Hmoob Dawb)' },
  { value: 'green', label: 'Green Hmong (Moob Leeg)' },
]

export default function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dialectPreference: 'white',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [pendingEmail, setPendingEmail] = useState(null)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  // Live mismatch hint: only once they've started typing the confirmation.
  const mismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword

  const submit = async () => {
    if (submitting) return
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await register(form)
      if (result?.pendingConfirmation) setPendingEmail(result.email)
      else router.push('/account')
    } catch (err) {
      setError(err?.message || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (pendingEmail) {
    return (
      <View className="max-w-md w-full self-center rounded-md bg-cream-50 border border-cream-200 p-8 items-center">
        <Text className="font-serif text-3xl text-stone-900 mb-3">Check your email</Text>
        <Text className="text-stone-700 text-center">
          We sent a confirmation link to <Text className="font-bold">{pendingEmail}</Text>. Click it, then come back and log in.
        </Text>
        <Link href="/login" asChild>
          <Button className="mt-6">Go to login</Button>
        </Link>
      </View>
    )
  }

  return (
    <View className="max-w-md w-full self-center">
      <Text className="font-serif text-4xl text-stone-900 mb-6 text-center">Create an account</Text>
      <View className="rounded-md bg-cream-50 border border-cream-200 p-6 gap-4">
        {/* Usernames can't contain spaces — strip them as they type. */}
        <Field label="Username" value={form.username} onChange={(v) => update('username', v.replace(/\s/g, ''))} autoCapitalize="none" />
        <Field label="Display Name" value={form.displayName} onChange={(v) => update('displayName', v)} />
        <Field label="Email" value={form.email} onChange={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" />

        <PasswordField
          label="Password"
          value={form.password}
          onChange={(v) => update('password', v)}
        />
        <PasswordField
          label="Confirm Password"
          value={form.confirmPassword}
          onChange={(v) => update('confirmPassword', v)}
          hint={mismatch ? 'Passwords don’t match' : null}
        />

        <View>
          <Text className="text-sm font-semibold text-stone-800 mb-1.5">Default Dialect</Text>
          <Picker
            value={form.dialectPreference}
            onChange={(v) => update('dialectPreference', v)}
            options={dialectOptions}
          />
        </View>
        {error && (
          <View className="rounded bg-red-100 px-3 py-2">
            <Text className="text-sm text-red-900">{error}</Text>
          </View>
        )}
        <Button onPress={submit} disabled={submitting || mismatch} className="w-full">
          {submitting ? 'Creating account…' : 'Create Account'}
        </Button>
        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-stone-600">Already have an account?</Text>
          <Link href="/login" asChild>
            <Pressable><Text className="text-sm text-clay-700 underline">Log in</Text></Pressable>
          </Link>
        </View>
      </View>
    </View>
  )
}

function Field({ label, value, onChange, ...rest }) {
  return (
    <View>
      <Text className="text-sm font-semibold text-stone-800 mb-1.5">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-stone-900"
        {...rest}
      />
    </View>
  )
}
