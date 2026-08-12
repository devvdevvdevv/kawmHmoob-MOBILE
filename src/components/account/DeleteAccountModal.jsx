import { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// "Type your username to confirm" delete dialog — a deliberate friction step so the
// account can't be nuked by a stray tap. The Delete button stays disabled until the
// typed text EXACTLY matches the username.
//
// Notes: colors inlined from theme tokens (theme vars don't cascade into a native
// <Modal>); no statusBarTranslucent + safe-area padding so buttons aren't hidden by
// the system nav bar; STATIC style objects only (a style FUNCTION renders invisible
// on native — see notes/nativewind-drops-function-style).
export default function DeleteAccountModal({ visible, username, busy, error, onCancel, onConfirm }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const inputBorder = `rgb(${t['--c-cream-300']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const mutedColor = `rgb(${t['--c-stone-500']})`
  const inputTextColor = `rgb(${t['--c-stone-900']})`
  const ghostText = `rgb(${t['--c-stone-800']})`

  // Reset the typed text every time the dialog opens.
  const [typed, setTyped] = useState('')
  useEffect(() => { if (visible) setTyped('') }, [visible])

  const matches = typed.trim() === username
  const canConfirm = matches && !busy

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={busy ? undefined : onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
        }}
      >
        <View style={{ width: '100%', maxWidth: 400, backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 16, padding: 24 }}>
          <Text className="font-serif" style={{ color: titleColor, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
            Delete your account?
          </Text>
          <Text style={{ color: bodyColor, fontSize: 15, lineHeight: 22, marginBottom: 16 }}>
            This permanently deletes your account and all your progress. This can't be undone.
          </Text>

          <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 8 }}>
            Type your username <Text style={{ fontWeight: '700', color: bodyColor }}>@{username}</Text> to confirm:
          </Text>
          <TextInput
            value={typed}
            onChangeText={setTyped}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder={username}
            placeholderTextColor={mutedColor}
            editable={!busy}
            style={{ borderWidth: 2, borderColor: inputBorder, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: inputTextColor, marginBottom: error ? 6 : 20 }}
          />
          {error ? <Text style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</Text> : null}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <Pressable
              onPress={busy ? undefined : onCancel}
              style={{ minHeight: 48, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: border, alignItems: 'center', justifyContent: 'center', opacity: busy ? 0.5 : 1 }}
            >
              <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={canConfirm ? onConfirm : undefined}
              style={{ minHeight: 48, paddingHorizontal: 24, borderRadius: 10, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center', opacity: canConfirm ? 1 : 0.45 }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{busy ? 'Deleting…' : 'Delete forever'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
