import { ImageBackground, View, useWindowDimensions } from 'react-native'
import { BattleButton } from './BattleButton'
import { Contenders } from './Contenders'
import type { Contender } from '../lib/types'

interface BattlefieldProps {
  contenders: Contender[]
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
  battleFn: () => void
}

export function Battlefield({ contenders, editNameFn, replaceFn, battleFn }: BattlefieldProps) {
  const { width, height } = useWindowDimensions()

  // The empty-state prompt lives in Fighters on mobile, so the landing screen keeps its room for the grid.
  if (contenders.length === 0) return null

  const landscape = width > height
  // Two contenders means the queue is gone, so there's room to spread things out.
  const roomy = contenders.length === 2

  return (
    <ImageBackground source={require('../../assets/sb-stage-2.jpg')} resizeMode="cover" className="w-full">
      <View className="w-full bg-[rgba(37,55,83,0.7)] px-4 pb-4 pt-10">
        <View className={landscape ? 'flex-row items-center justify-around' : ''}>
          <Contenders
            contender={contenders[0]}
            editNameFn={editNameFn}
            replaceFn={replaceFn}
            horizontal={!landscape}
          />
          <View className={`items-center ${roomy ? 'my-8' : 'my-4'}`}>
            <BattleButton onPress={battleFn} disabled={!roomy} size={roomy ? (landscape ? 130 : 150) : 100} />
          </View>
          {contenders[1] && (
            <Contenders
              contender={contenders[1]}
              editNameFn={editNameFn}
              replaceFn={replaceFn}
              horizontal={!landscape}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  )
}
