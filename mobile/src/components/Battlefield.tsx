import { ImageBackground, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BattleButton } from './BattleButton'
import { Contenders } from './Contenders'
import { Entrance } from './Entrance'
import type { Contender } from '../lib/types'

interface BattlefieldProps {
  contenders: Contender[]
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
  battleFn: () => void
}

export function Battlefield({ contenders, editNameFn, replaceFn, battleFn }: BattlefieldProps) {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  // The empty-state prompt lives in Fighters on mobile, so the landing screen keeps its room for the grid.
  if (contenders.length === 0) return null

  const landscape = width > height
  // Two contenders means the queue is gone, so there's room to spread things out.
  const roomy = contenders.length === 2

  return (
    <ImageBackground source={require('../../assets/sb-stage-2.jpg')} resizeMode="cover" className="w-full">
      <View
        className={`w-full bg-[rgba(37,55,83,0.7)] ${landscape ? 'py-4' : 'pb-4 pt-10'}`}
        style={{ paddingLeft: Math.max(16, insets.left), paddingRight: Math.max(16, insets.right) }}
      >
        {/* One tree for both orientations, so rotating keeps everything mounted and doesn't replay the fades.
            Landscape is a row where each fighter gets a fixed half-width slot, so the first one doesn't shift
            when the second arrives; portrait is a stack. */}
        <View className={landscape ? 'flex-row items-center' : ''}>
          {/* Entrance doubles as the slot: an extra wrapper in between would shrink-wrap and collapse the
              flex-1 details inside Contenders. */}
          <Entrance preset="fadeIn" className={landscape ? 'flex-1 items-center' : ''}>
            <Contenders
              contender={contenders[0]}
              editNameFn={editNameFn}
              replaceFn={replaceFn}
              horizontal
              imageSize={landscape ? 90 : undefined}
              stackButtons={landscape}
            />
          </Entrance>
          <View className={landscape ? '' : `items-center ${roomy ? 'my-8' : 'my-4'}`}>
            <BattleButton
              onPress={battleFn}
              disabled={!roomy}
              size={landscape ? (roomy ? 110 : 80) : roomy ? 150 : 100}
            />
          </View>
          {contenders[1] ? (
            <Entrance preset="fadeIn" className={landscape ? 'flex-1 items-center' : ''}>
              <Contenders
                contender={contenders[1]}
                editNameFn={editNameFn}
                replaceFn={replaceFn}
                horizontal
                imageSize={landscape ? 90 : undefined}
                stackButtons={landscape}
                mirrored={landscape}
              />
            </Entrance>
          ) : (
            // Holds the second half-width slot open in landscape until the second fighter arrives.
            <View className={landscape ? 'flex-1' : ''} />
          )}
        </View>
      </View>
    </ImageBackground>
  )
}
