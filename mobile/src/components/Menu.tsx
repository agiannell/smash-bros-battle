import { Modal, Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface MenuProps {
  visible: boolean
  onClose: () => void
  onSeeAll: () => void
}

export function Menu({ visible, onClose, onSeeAll }: MenuProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} accessibilityLabel="Close menu" className="flex-1 bg-black/40">
        <SafeAreaView edges={['top', 'left']}>
          <View className="mt-[60px] self-start bg-navy px-6 py-3">
            <Pressable onPress={onSeeAll} hitSlop={8} className="active:opacity-60">
              <Text className="font-bangers text-2xl tracking-widest text-white">See All Characters</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Pressable>
    </Modal>
  )
}
