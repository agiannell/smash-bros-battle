import { Pressable, Text, View } from 'react-native'
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
    <View className="w-full items-center">
      {showReset ? (
        <Pressable onPress={clearFn} className="mt-2 bg-[#535353] px-6 py-2 active:scale-90 active:bg-[#b92828]">
          <Text className="font-bangers text-4xl tracking-widest text-white">Reset Battlefield</Text>
        </Pressable>
      ) : (
        <>
          <Text
            className={`font-bangers text-4xl tracking-widest text-white ${contendersCount === 0 ? 'mb-1' : 'mb-4'}`}
          >
            Choose Your Character!
          </Text>
          {contendersCount === 0 && (
            <Text className="mb-4 px-6 text-center font-noto text-base text-white">
              Pick two fighters, then hit BATTLE. The higher HP wins!
            </Text>
          )}
        </>
      )}
      <View className="w-full flex-row flex-wrap">
        {randFighters.map(f => (
          <Queue key={f.id} fighter={f} chooseFn={chooseFn} contendersCount={contendersCount} />
        ))}
      </View>
    </View>
  )
}
