import { FlatList, Text, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FighterImage } from './FighterImage'
import type { Fighter } from '../lib/types'

interface AllFightersProps {
  allFighters: Fighter[]
}

// Rendered in-tree (not a Modal) so the Header's close toggle stays tappable. Absolute offsets ignore the
// SafeAreaView's padding, so the status-bar inset is added to clear the 60px header.
export function AllFighters({ allFighters }: AllFightersProps) {
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const numColumns = width > height ? 6 : 3

  return (
    <View
      className="absolute inset-x-0 bottom-0 z-10 bg-navy"
      style={{ top: insets.top + 60 }}
    >
      {/* FlatList can't change numColumns on the fly, so a new key forces a re-render on rotation. */}
      <FlatList
        key={numColumns}
        data={allFighters}
        numColumns={numColumns}
        keyExtractor={f => f.id}
        ListHeaderComponent={
          <Text className="px-4 pb-4 pt-5 text-center font-bangers text-4xl tracking-widest text-white">
            All Available Fighters
          </Text>
        }
        contentContainerClassName="pb-6"
        renderItem={({ item }) => (
          <View className="flex-1 items-center py-2">
            <FighterImage uri={item.image} label={item.name} size={90} recyclingKey={item.id} />
            <Text numberOfLines={2} className="mt-1 px-2 text-center font-noto text-xs font-bold text-white">
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  )
}
