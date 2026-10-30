import { Pressable, Text } from 'react-native'
import { FighterImage } from './FighterImage'
import type { Fighter } from '../lib/types'

interface QueueProps {
  fighter: Fighter
  chooseFn: (fighter: Fighter) => void
  contendersCount: number
}

export function Queue({ fighter, chooseFn, contendersCount }: QueueProps) {
  if (contendersCount >= 2) return null

  return (
    <Pressable onPress={() => chooseFn(fighter)} className="group flex-1 items-center px-1 active:scale-110">
      <FighterImage uri={fighter.image} label={fighter.name} size={80} />
      <Text
        numberOfLines={2}
        className="mt-1 text-center font-noto text-xs font-bold text-white group-active:text-[#eeff00]"
      >
        {fighter.name}
      </Text>
    </Pressable>
  )
}
