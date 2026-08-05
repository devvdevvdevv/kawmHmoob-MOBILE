import { Modal, View, Text, Pressable } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// A themed "are you sure?" dialog. Replaces Alert.alert (which doesn't render on
// web). Buttons are RAW inline Pressables — inside a RN <Modal> the theme CSS vars
// don't cascade and the shared <Button> is cache-prone, so colors are inlined from
// theme tokens. Tap the backdrop or Cancel to dismiss.
//
// Props: visible, title, message?, confirmLabel?, cancelLabel?, destructive?,
//        onConfirm, onCancel
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const cream = `rgb(${t['--c-cream-50']})`
  const ghostText = `rgb(${t['--c-stone-800']})`
  // Destructive = a clear static red (danger should read as danger in any theme);
  // otherwise the brown clay primary.
  const confirmBg = destructive ? '#dc2626' : `rgb(${t['--c-clay-600']})`

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      {/* Backdrop — tap to cancel */}
      <Pressable
        onPress={onCancel}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      >
        {/* Card — swallow taps so they don't bubble to the backdrop */}
        <Pressable
          onPress={() => {}}
          style={{ width: '100%', maxWidth: 400, backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 16, padding: 24 }}
        >
          <Text className="font-serif" style={{ color: titleColor, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>
            {title}
          </Text>
          {message ? (
            <Text style={{ color: bodyColor, fontSize: 15, lineHeight: 22, marginBottom: 20 }}>{message}</Text>
          ) : (
            <View style={{ height: 12 }} />
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: border, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
            >
              <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600' }}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: 24, borderRadius: 10, backgroundColor: confirmBg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
            >
              <Text style={{ color: cream, fontSize: 16, fontWeight: '700' }}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}
