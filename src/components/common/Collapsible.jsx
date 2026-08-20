import { useState } from 'react'
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native'
import Icon from '../ui/Icon.jsx'

// A reusable accordion: a tappable title row + a body that shows only when open.
// The component owns the open/close state; the caller supplies the body as
// `children` (the children pattern — same shape as most accordion/menu components).
//
//   <Collapsible title="Why create an account?">
//     {REASONS.map((r, i) => <Row key={i} text={r} />)}
//   </Collapsible>
//
// See learning/ui-patterns/collapsible-dropdown-lesson.md.

// LayoutAnimation is opt-in on old-arch Android. Runs once at module load.
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  // ONE function for the whole handler. `configureNext` arms the animation for the
  // next layout change, so it must be called right before the state update, every
  // time — it is not a one-time setup. (No-op on react-native-web.)
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((o) => !o)
  }

  return (
    <View>
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between py-3"
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        {/* flex-1 + mr-3 so a long title WRAPS instead of shoving the chevron off
            the row on a narrow phone. */}
        <Text className="flex-1 mr-3 text-lg font-semibold text-clay-700">{title}</Text>
        {/* Static style OBJECT, never a style function — NativeWind drops the
            function form on native and the element renders invisible. */}
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <Icon name="arrowRight" size={18} tone="accent" />
        </View>
      </Pressable>

      {open && <View className="pb-3">{children}</View>}
    </View>
  )
}
