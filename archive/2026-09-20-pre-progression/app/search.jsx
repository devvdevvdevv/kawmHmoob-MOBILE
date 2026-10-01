import { View, Text } from 'react-native'
import TabScreen from '../src/components/TabScreen.jsx'
import GlobalSearch from '../src/components/common/GlobalSearch.jsx'

// The drawer's Search. Uses the shared <GlobalSearch>, the same component the
// Reference "Search" tab renders — so the two mirror each other exactly.
export default function Search() {
  return (
    <TabScreen>
      <Text className="font-serif text-4xl text-stone-900 mb-5">Search</Text>
      <GlobalSearch />
    </TabScreen>
  )
}
