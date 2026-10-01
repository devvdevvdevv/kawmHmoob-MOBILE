import { useState } from 'react'
import { Modal, Pressable, Text, View, FlatList } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Native dropdown replacement for <select>. Tap to open a modal list, tap a row
// to pick. Works on iOS, Android, and web.
//
// Colors are INLINE from theme tokens, NOT className. Inside a RN <Modal> the
// theme CSS variables don't cascade (the Modal is a separate native root), so
// NativeWind color classes like `bg-cream-50` silently no-op — which left the
// option rows unstyled and effectively invisible. Same convention as
// ConfirmModal / InfoModal / WelcomeTour.
export default function Picker({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const rowBorder = `rgb(${t['--c-cream-200']})`
  const rowSelectedBg = `rgb(${t['--c-cream-100']})`
  const triggerBg = `rgb(${t['--c-cream-50']})`
  const triggerBorder = `rgb(${t['--c-cream-300']})`
  const textColor = `rgb(${t['--c-stone-800']})`

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ width: '100%', borderRadius: 6, borderWidth: 1, borderColor: triggerBorder, backgroundColor: triggerBg, paddingHorizontal: 12, paddingVertical: 10 }}
      >
        <Text style={{ fontSize: 14, color: textColor }}>{selected?.label || 'Select…'}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent>
        <Pressable
          onPress={() => setOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
        >
          {/* Swallow taps on the card so they don't dismiss */}
          <Pressable
            onPress={() => {}}
            style={{ width: '100%', maxWidth: 384, backgroundColor: cardBg, borderRadius: 12, borderWidth: 2, borderColor: border, overflow: 'hidden' }}
          >
            <FlatList
              data={options}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => {
                const isSel = item.value === value
                return (
                  <Pressable
                    onPress={() => { onChange(item.value); setOpen(false) }}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: rowBorder,
                      backgroundColor: isSel ? rowSelectedBg : 'transparent',
                    }}
                  >
                    <Text style={{ fontSize: 16, color: textColor, fontWeight: isSel ? '700' : '400' }}>
                      {item.label}
                    </Text>
                  </Pressable>
                )
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}
