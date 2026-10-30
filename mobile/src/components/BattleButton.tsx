import { useState } from 'react'
import { Pressable } from 'react-native'
import Svg, { Path, Text as SvgText } from 'react-native-svg'

const SHIELD_PATH =
  'M43.07,751.66A541.69,541.69,0,0,0,200.25,959.74V751.66Z' +
  'M200.25,120.24C78.14,219.23,0,370.45,0,540A542.45,542.45,0,0,0,10.44,645.8H200.25Z' +
  'M1068.58,645.8A542.45,542.45,0,0,0,1079,540C1079,241.76,837.44,0,539.49,0a543.53,543.53,0,0,0-66.07,4.19V645.8Z' +
  'M473.42,1075.81a543.54,543.54,0,0,0,66.07,4.18c222.88,0,414.17-135.32,496.47-328.34H473.42Z'

interface BattleButtonProps {
  onPress: () => void
  size?: number
}

export function BattleButton({ onPress, size = 120 }: BattleButtonProps) {
  const [pressed, setPressed] = useState(false)

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityLabel="Battle!"
      style={{ width: size, height: size }}
      className="active:scale-110"
    >
      <Svg width={size} height={size} viewBox="0 0 1079.02 1080">
        <Path fill={pressed ? '#ff3837' : '#666'} d={SHIELD_PATH} />
        <SvgText
          x={154.33}
          y={751.13}
          fontSize={262.39}
          fontFamily="Bangers_400Regular"
          letterSpacing={15.7}
          fill="#4d4d4d"
          stroke="#fff"
          strokeWidth={5}
          textLength={770}
          lengthAdjust="spacingAndGlyphs"
        >
          BATTLE!
        </SvgText>
      </Svg>
    </Pressable>
  )
}
