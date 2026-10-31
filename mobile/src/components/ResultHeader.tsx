import { Modal, Pressable, Text } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import CloseIcon from '../../assets/icons/close-button.svg'

interface ResultHeaderProps {
  kind: 'win' | 'draw'
  name?: string
  clearFn: () => void
}

const WIN_GIF = 'https://media.giphy.com/media/Y0Q6qO4v3xVlD2RkZ6/source.gif'
const DRAW_GIF = 'https://media.giphy.com/media/JUB0s1l8yuZsXpSgY9/source.gif'

export function ResultHeader({ kind, name, clearFn }: ResultHeaderProps) {
  const isWin = kind === 'win'

  return (
    <Modal
      transparent
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={clearFn}
    >
      <SafeAreaView
        className={`flex-1 items-center justify-center px-6 ${isWin ? 'bg-[rgba(54,153,83,0.9)]' : 'bg-[rgba(255,0,0,0.9)]'}`}
      >
        <Image
          source={{ uri: isWin ? WIN_GIF : DRAW_GIF }}
          accessibilityLabel={isWin ? 'congrats sticker' : 'unenthused clapping'}
          contentFit="contain"
          style={{ width: '100%', height: isWin ? 300 : 260 }}
        />
        <Text className="mt-6 text-center font-bangers text-6xl tracking-widest text-white">
          {isWin ? `${name} wins!` : 'Draw!'}
        </Text>
        <Pressable onPress={clearFn} accessibilityLabel="Close" hitSlop={16} className="mt-8 active:opacity-60">
          <CloseIcon width={64} height={64} />
        </Pressable>
      </SafeAreaView>
    </Modal>
  )
}
