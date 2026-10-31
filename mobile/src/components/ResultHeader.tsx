import { Modal, Pressable, Text, useWindowDimensions } from 'react-native'
import { Image } from 'expo-image'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
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
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const landscape = width > height

  return (
    <Modal
      transparent
      animationType="fade"
      supportedOrientations={['portrait', 'landscape']}
      onRequestClose={clearFn}
    >
      <SafeAreaView
        className={`flex-1 items-center justify-center px-6 ${landscape ? 'flex-row' : ''} ${isWin ? 'bg-[rgba(54,153,83,0.9)]' : 'bg-[rgba(255,0,0,0.9)]'}`}
      >
        <Image
          source={{ uri: isWin ? WIN_GIF : DRAW_GIF }}
          accessibilityLabel={isWin ? 'congrats sticker' : 'unenthused clapping'}
          contentFit="contain"
          style={{ width: landscape ? '40%' : '100%', height: landscape ? 220 : isWin ? 300 : 260 }}
        />
        <Text
          className={`text-center font-bangers tracking-widest text-white ${landscape ? 'ml-6 shrink text-5xl' : 'mt-6 text-6xl'}`}
        >
          {isWin ? `${name} wins!` : 'Draw!'}
        </Text>
        {/* In landscape the X sits in the top-left corner (clear of the header's hamburger showing through),
            which is easier to reach than the center. Absolute offsets ignore the SafeAreaView padding, so the
            insets are added by hand. */}
        <Pressable
          onPress={clearFn}
          accessibilityLabel="Close"
          hitSlop={16}
          style={landscape ? { top: insets.top + 12, left: insets.left + 16 } : undefined}
          className={`active:opacity-60 ${landscape ? 'absolute' : 'mt-8'}`}
        >
          <CloseIcon width={landscape ? 48 : 64} height={landscape ? 48 : 64} />
        </Pressable>
      </SafeAreaView>
    </Modal>
  )
}
