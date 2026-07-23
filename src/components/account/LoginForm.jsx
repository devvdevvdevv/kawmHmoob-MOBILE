import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'
import Button from '../ui/Button.jsx'

export default function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submit = async () => {
    if (!email || !password || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await login({ email, password })
      router.push('/account')
    } catch (err) {
      setError(err?.message || 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View className="max-w-md w-full self-center">
      <Text className="font-serif text-4xl text-stone-900 mb-6 text-center">Welcome back</Text>
      <View className="rounded-md bg-cream-50 border border-cream-200 p-6 gap-4">
        <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Password" value={password} onChange={setPassword} secureTextEntry />
        {error && (
          <View className="rounded bg-red-100 px-3 py-2">
            <Text className="text-sm text-red-900">{error}</Text>
          </View>
        )}
        <Button onPress={submit} disabled={submitting} className="w-full">
          {submitting ? 'Logging in…' : 'Log In'}
        </Button>
        <View className="flex-row justify-center gap-1">
          <Text className="text-sm text-stone-600">No account?</Text>
          <Link href="/register" asChild>
            <Pressable><Text className="text-sm text-clay-700 underline">Register</Text></Pressable>
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
