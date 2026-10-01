import { View, Text } from 'react-native'
import TabScreen from '../src/components/TabScreen.jsx'
import GlobalSearch from '../src/components/common/GlobalSearch.jsx'
import { useSwipeBack } from '../src/hooks/useSwipeBack.js'

// The drawer's Search. Uses the shared <GlobalSearch>, the same component the
// Reference "Search" tab renders — so the two mirror each other exactly.
export default function Search() {
  // Swipe right to go back (2026-09-30, author). Was: <TabScreen> with no wrapper.
  const swipeBack = useSwipeBack()
  return (
    <View style={{ flex: 1 }} {...swipeBack}>
      <TabScreen>
        <Text className="font-serif text-4xl text-stone-900 mb-5">Search</Text>
        <GlobalSearch />
      </TabScreen>
    </View>
  )
}
