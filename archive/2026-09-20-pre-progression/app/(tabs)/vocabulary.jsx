import TabScreen from '../../src/components/TabScreen.jsx'
import VocabCategoryGrid from '../../src/components/vocabulary/VocabCategoryGrid.jsx'

// VocabCategoryGrid returns a bare <View>; wrap it so it scrolls and clears
// the floating tab bar. It's shared with the /vocabulary detail routes, which
// is why it isn't wrapped internally.
export default function VocabularyTab() {
  return (
    <TabScreen>
      <VocabCategoryGrid />
    </TabScreen>
  )
}
