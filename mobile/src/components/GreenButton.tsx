import { Pressable, Text } from 'react-native'

interface GreenButtonProps {
  label: string
  onPress: () => void
}

export function GreenButton({ label, onPress }: GreenButtonProps) {
  return (
    <Pressable onPress={onPress} className="mx-1 bg-[rgb(54,153,83)] px-4 py-2 active:bg-[rgb(43,121,66)]">
      <Text className="font-noto text-base font-bold text-white">{label}</Text>
    </Pressable>
  )
}
