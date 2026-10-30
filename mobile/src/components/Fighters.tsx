import { FlatList, Pressable, Text, View } from 'react-native'
import { Queue } from './Queue'
import type { Fighter } from '../lib/types'

interface FightersProps {
  randFighters: Fighter[]
  chooseFn: (fighter: Fighter) => void
  contendersCount: number
  clearFn: () => void
}

export function Fighters({ randFighters, chooseFn, contendersCount, clearFn }: FightersProps) {
  const showReset = contendersCount >= 2

  return (
    <View className="items-center">
      {showReset ? (
        <Pressable onPress={clearFn} className="mt-2 bg-[#535353] px-6 py-2 active:scale-90 active:bg-[#b92828]">
          <Text className="font-bangers text-4xl tracking-widest text-white">Reset Battlefield</Text>
        </Pressable>
      ) : (
        <Text
          className={`mb-4 font-bangers text-4xl tracking-widest text-white ${contendersCount === 1 ? '' : 'opacity-0'}`}
        >
          Choose Your Character!
        </Text>
      )}
      <FlatList
        horizontal
        data={randFighters}
        keyExtractor={f => f.id}
        renderItem={({ item }) => <Queue fighter={item} chooseFn={chooseFn} contendersCount={contendersCount} />}
        className="flex-grow-0"
        contentContainerClassName="px-2"
      />
    </View>
  )
}
