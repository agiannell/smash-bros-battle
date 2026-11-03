import { useEffect, type ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

// Ports of the web's Tailwind keyframes. The web animates margins; here the same distances are
// translations, which run on the UI thread.
const PRESETS = {
  flyUp: { fade: true, axis: 'y', distance: 500, delay: 300, duration: 900, easing: Easing.bezier(0.9, 0.12, 0.7, 1.3) },
  flyRight: { fade: true, axis: 'x', distance: -500, delay: 0, duration: 700, easing: Easing.bezier(0.7, 0.12, 0.6, 1.7) },
  // The web's 2000px distance is about two phone heights, so most of its 1.5s would be spent off-screen.
  flyDown: { fade: false, axis: 'y', distance: -900, delay: 0, duration: 450, easing: Easing.bezier(0.9, 0.12, 0.7, 1) },
  // Scales up from the top-right corner (where the hamburger is) instead of from the center.
  growIn: { fade: true, axis: 'scale', distance: 0, delay: 0, duration: 300, easing: Easing.inOut(Easing.ease) },
  // Fade-only: no movement. (The result overlay is a Modal, which already fades natively.)
  fadeIn: { fade: true, axis: 'none', distance: 0, delay: 0, duration: 200, easing: Easing.inOut(Easing.ease) },
  fadeInDelay: { fade: true, axis: 'none', distance: 0, delay: 0, duration: 700, easing: Easing.inOut(Easing.ease) },
} as const

interface EntranceProps {
  preset: keyof typeof PRESETS
  children: ReactNode
  style?: StyleProp<ViewStyle>
  className?: string
}

// Plays once when it mounts. Rotating or re-rendering the parent does not replay it.
export function Entrance({ preset, children, style, className }: EntranceProps) {
  const { fade, axis, distance, delay, duration, easing } = PRESETS[preset]
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration, easing }))
  }, [progress, delay, duration, easing])

  // Starts `distance` away from its resting place and fades in. The curves overshoot past 1, so the
  // opacity is clamped to avoid going above fully opaque.
  const animatedStyle = useAnimatedStyle(() => {
    const offset = (1 - progress.value) * distance
    const opacity = fade ? Math.min(Math.max(progress.value, 0), 1) : 1
    if (axis === 'none') return { opacity }
    if (axis === 'scale') return { opacity, transform: [{ scale: progress.value }], transformOrigin: 'top right' }
    return { opacity, transform: axis === 'x' ? [{ translateX: offset }] : [{ translateY: offset }] }
  })

  return (
    <Animated.View style={[style, animatedStyle]} className={className}>
      {children}
    </Animated.View>
  )
}
