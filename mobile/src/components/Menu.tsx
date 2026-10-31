import { Pressable, StyleSheet, Text, View } from 'react-native'

interface MenuProps {
  visible: boolean
  onClose: () => void
  onSeeAll: () => void
}

// Rendered in-tree rather than in a Modal so the Header (and its toggle) stays tappable while open.
// The container is positioned with a plain View so the offset below the 60px header can't be lost
// to className/style merging on a Pressable.
export function Menu({ visible, onClose, onSeeAll }: MenuProps) {
  if (!visible) return null

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close menu"
        style={StyleSheet.absoluteFill}
        className="bg-black/50"
      />
      <View className="self-start border-l-4 border-[#ff3837] bg-[#2f4d85] px-6 py-4 shadow-lg shadow-black">
        <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-60">
          <Text className="font-bangers text-2xl tracking-widest text-white">See All Characters</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, zIndex: 10 },
})
