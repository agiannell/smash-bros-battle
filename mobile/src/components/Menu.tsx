import { Pressable, Text, View } from 'react-native'

interface MenuProps {
  visible: boolean
  onClose: () => void
  onSeeAll: () => void
}

// Rendered in-tree rather than in a Modal so the Header (and its toggle) stays tappable while open.
// Absolutely positioned inside the screen's SafeAreaView, directly below the 60px header.
export function Menu({ visible, onClose, onSeeAll }: MenuProps) {
  if (!visible) return null

  return (
    <Pressable
      onPress={onClose}
      accessibilityLabel="Close menu"
      style={{ position: 'absolute', top: 60, left: 0, right: 0, bottom: 0 }}
      className="z-10 bg-black/50"
    >
      <View className="self-start border-l-4 border-[#ff3837] bg-[#2f4d85] px-6 py-4 shadow-lg shadow-black">
        <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-60">
          <Text className="font-bangers text-2xl tracking-widest text-white">See All Characters</Text>
        </Pressable>
      </View>
    </Pressable>
  )
}
