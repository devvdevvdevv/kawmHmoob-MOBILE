import { View, Text, Pressable } from 'react-native'
import { Link, usePathname } from 'expo-router'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// `basePath` is the route prefix (e.g. '/alphabet'); tabs append `/<id>`.
// CONTROLLED mode: pass `active` + `onChange` and the tabs switch by STATE
// (no navigation) instead of by route. Omit them → the original route behavior.
export default function Tabs({ basePath, tabs, active, onChange }) {
  const pathname = usePathname() || ''
  const controlled = typeof onChange === 'function'

  // The container + map are ALWAYS here. Only the per-tab element branches:
  // controlled → a Pressable that calls onChange; else → a Link that navigates.
  return (
    <View className="flex-row flex-wrap gap-1 mb-6 p-1 rounded-md bg-cream-100 self-start">
      {tabs.map((t) => {
        const href = `${basePath}/${t.id}`
        const isActive = controlled
          ? active === t.id
          : pathname === href || pathname.startsWith(href + '/')

        return controlled ? (
          // STATE MODE — no Link; tapping calls onChange(t.id)
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            className={`px-5 py-2.5 rounded min-h-[44px] justify-center ${isActive ? 'bg-cream-50 shadow-warm' : 'active:bg-cream-200'}`}
          >
            <Text className={`text-sm font-medium ${isActive ? 'text-clay-700' : 'text-stone-600'}`}>
              {t.label}
            </Text>
          </Pressable>
        ) : (
          // ROUTE MODE — Link navigates (original behavior, untouched)
          <Link key={t.id} href={href} asChild>
            <Pressable className={`px-5 py-2.5 rounded min-h-[44px] justify-center ${isActive ? 'bg-cream-50 shadow-warm' : 'active:bg-cream-200'}`}>
              <Text className={`text-sm font-medium ${isActive ? 'text-clay-700' : 'text-stone-600'}`}>
                {t.label}
              </Text>
            </Pressable>
          </Link>
        )
      })}
    </View>
  )
}
