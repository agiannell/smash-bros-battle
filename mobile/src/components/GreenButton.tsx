import { Pressable, Text } from 'react-native'

interface GreenButtonProps {
  label: string
  onPress: () => void
  compact?: boolean
}

export function GreenButton({ label, onPress, compact = false }: GreenButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-[rgb(54,153,83)] active:bg-[rgb(43,121,66)] ${compact ? 'px-3 py-1.5' : 'mx-1 px-4 py-2'}`}
    >
      <Text className={`font-noto font-bold text-white ${compact ? 'text-center text-sm' : 'text-base'}`}>{label}</Text>
    </Pressable>
  )
}
