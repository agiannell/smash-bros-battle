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
    <Pressable onPress={() => chooseFn(fighter)} className="group items-center px-2 active:scale-110">
      <FighterImage uri={fighter.image} label={fighter.name} size={80} />
      <Text className="mt-1 font-noto text-sm font-bold text-white group-active:text-[#eeff00]">{fighter.name}</Text>
    </Pressable>
  )
}
