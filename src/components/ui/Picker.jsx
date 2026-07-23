import { useState } from 'react'
import { Modal, Pressable, Text, View, FlatList } from 'react-native'

// Native dropdown replacement for <select>. Tap to open a modal list,
// tap a row to pick. Works on iOS, Android, and web (web uses the same
// overlay, which is acceptable for this app's scale).

export default function Picker({ value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2"
      >
        <Text className="text-sm text-stone-800">
          {selected?.label || 'Select…'}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 bg-stone-900/50 justify-center items-center px-6"
          onPress={() => setOpen(false)}
        >
          <View className="w-full max-w-sm rounded-md bg-cream-50 border border-cream-200 shadow-warm">
            <FlatList
              data={options}
              keyExtractor={(o) => String(o.value)}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                  className={`px-4 py-3 border-b border-cream-200 ${
                    item.value === value ? 'bg-cream-100' : ''
                  }`}
                >
                  <Text className="text-stone-800">{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  )
}
