import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import Icon from './Icon.jsx'

// A password input with a show/hide eye toggle. Manages its own visibility state,
// so callers just pass value/onChange (and an optional `hint` for a validation
// message, which also turns the border red). The eye sits inside the field's
// border via a flex row — no absolute positioning.
export default function PasswordField({ label, value, onChange, hint, ...rest }) {
  const [show, setShow] = useState(false)
  return (
    <View>
      {label ? <Text className="text-sm font-semibold text-stone-800 mb-1.5">{label}</Text> : null}
      <View className={`flex-row items-center rounded border bg-cream-50 ${hint ? 'border-red-400' : 'border-cream-300'}`}>
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          className="flex-1 px-3 py-2 text-sm text-stone-900"
          {...rest}
        />
        <Pressable
          onPress={() => setShow((s) => !s)}
          hitSlop={8}
          className="px-3 py-2"
          accessibilityLabel={show ? 'Hide password' : 'Show password'}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={20} tone="muted" />
        </Pressable>
      </View>
      {hint ? <Text className="text-xs text-red-600 mt-1">{hint}</Text> : null}
    </View>
  )
}
