import { useEffect, type ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

// Ports of the web's Tailwind keyframes. The web animates margins; here the same distances are
// translations, which run on the UI thread.
const PRESETS = {
  flyUp: { axis: 'y', distance: 500, delay: 300, duration: 900, easing: Easing.bezier(0.9, 0.12, 0.7, 1.3) },
  flyRight: { axis: 'x', distance: -500, delay: 0, duration: 700, easing: Easing.bezier(0.7, 0.12, 0.6, 1.7) },
} as const

interface EntranceProps {
  preset: keyof typeof PRESETS
  children: ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
}

// Plays once when it mounts. Rotating or re-rendering the parent does not replay it.
export function Entrance({ preset, children, style, className }: EntranceProps) {
  const { axis, distance, delay, duration, easing } = PRESETS[preset]
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing }))
  }, [progress, delay, duration, easing])

  // Starts `distance` away from its resting place and fades in. The curves overshoot past 1, so the
  // opacity is clamped to avoid going above fully opaque.
  const animatedStyle = useAnimatedStyle(() => {
    const offset = (1 - progress.value) * distance
    return {
      opacity: Math.min(Math.max(progress.value, 0), 1),
      transform: axis === 'x' ? [{ translateX: offset }] : [{ translateY: offset }],
    }
  })

  return (
    <Animated.View style={[style, animatedStyle]} className={className}>
      {children}
    </Animated.View>
  )
}
