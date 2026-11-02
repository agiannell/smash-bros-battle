import { useEffect, type ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

// Ports of the web's Tailwind keyframes. The web animates margins; here the same distances are
// translations, which run on the UI thread.
const PRESETS = {
  flyUp: { delay: 300, duration: 900, easing: Easing.bezier(0.9, 0.12, 0.7, 1.3) },
}

interface EntranceProps {
  preset: keyof typeof PRESETS
  children: ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
}

// Plays once when it mounts. Rotating or re-rendering the parent does not replay it.
export function Entrance({ preset, children, style, className }: EntranceProps) {
  const { delay, duration, easing } = PRESETS[preset]
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing }))
  }, [progress, delay, duration, easing])

  // flyUp starts 500pt below its resting place and fades in. The curve overshoots past 1, so the
  // opacity is clamped to avoid going above fully opaque.
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.max(progress.value, 0), 1),
    transform: [{ translateY: (1 - progress.value) * 500 }],
  }))

  return (
    <Animated.View style={[style, animatedStyle]} className={className}>
      {children}
    </Animated.View>
  )
}
