import TabScreen from '../../../src/components/TabScreen.jsx'
import VocabGroup from '../../../src/components/vocabulary/VocabGroup.jsx'

// /vocabulary/group/<themeId> — the categories inside one theme.
//
// A STATIC "group" segment next to the dynamic [categoryId] route, exactly like
// app/speak/group/[groupId].jsx sits next to app/speak/[phraseId].jsx. Static
// segments outrank dynamic ones, so this wins over /vocabulary/<categoryId>/<wordId>.
export default function VocabGroupScreen() {
  return (
    <TabScreen>
      <VocabGroup />
    </TabScreen>
  )
}
