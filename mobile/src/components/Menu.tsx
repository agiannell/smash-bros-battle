import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface MenuProps {
  visible: boolean
  onClose: () => void
  onSeeAll: () => void
}

// Rendered in-tree rather than in a Modal so the Header (and its toggle) stays tappable while open.
// Absolute offsets are measured from the parent's outer edge, ignoring the SafeAreaView's padding,
// so the status-bar inset has to be added to clear the 60px header.
export function Menu({ visible, onClose, onSeeAll }: MenuProps) {
  const insets = useSafeAreaInsets()

  if (!visible) return null

  return (
    <View style={[styles.container, { top: insets.top + 60 }]}>
      <Pressable
        onPress={onClose}
        accessibilityLabel="Close menu"
        style={StyleSheet.absoluteFill}
        className="bg-black/50"
      />
      <View className="self-end border-l-4 border-[#ff3837] bg-[#2f4d85] px-6 py-4 shadow-lg shadow-black">
        <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-60">
          <Text className="font-bangers text-2xl tracking-widest text-white">See All Characters</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10 },
})
