import { Pressable, Text, useWindowDimensions } from 'react-native'
import { FighterImage } from './FighterImage'
import type { Fighter } from '../lib/types'

interface QueueProps {
  fighter: Fighter
  chooseFn: (fighter: Fighter) => void
  contendersCount: number
}

export function Queue({ fighter, chooseFn, contendersCount }: QueueProps) {
  const { width, height } = useWindowDimensions()

  if (contendersCount >= 2) return null

  // Big 2-column grid on the empty landing screen; once a fighter is chosen the
  // grid shrinks to 3 columns so it fits below the contenders without scrolling.
  const landscape = width > height
  const large = !landscape && contendersCount === 0
  // Landscape is one non-wrapping row of flex-1 items: six w-1/6 items round to slightly over 100% and wrap.
  const columnClass = landscape ? 'flex-1' : large ? 'w-1/2' : 'w-1/3'
  const imageSize = large ? 120 : landscape ? (contendersCount === 0 ? 72 : 56) : 80

  return (
    <Pressable onPress={() => chooseFn(fighter)} className={`group items-center py-2 active:scale-105 ${columnClass}`}>
      <FighterImage uri={fighter.image} label={fighter.name} size={imageSize} />
      <Text
        numberOfLines={2}
        className={`mt-1 px-2 text-center font-noto font-bold text-white group-active:text-[#eeff00] ${large ? 'text-sm' : 'text-xs'}`}
      >
        {fighter.name}
      </Text>
    </Pressable>
  )
}
