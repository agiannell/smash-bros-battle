import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Logo from '../../assets/icons/smash-logo-white.svg'
import MenuIcon from '../../assets/icons/menu-lines.svg'
import CloseIcon from '../../assets/icons/close-button.svg'

interface HeaderProps {
  menuOpen: boolean
  onMenuPress: () => void
}

// The hamburger sits on the right, matching the web (Expo Go's floating dev-menu button can cover it there).
export function Header({ menuOpen, onMenuPress }: HeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <View className="z-20 h-[60px] w-full items-center justify-center bg-black/60">
      <Pressable
        onPress={onMenuPress}
        accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
        hitSlop={12}
        style={{ right: Math.max(24, insets.right) }}
        className="absolute h-[25px] w-[30px] items-center justify-center active:scale-90"
      >
        {menuOpen ? <CloseIcon width={26} height={26} /> : <MenuIcon width={30} height={25} />}
      </Pressable>
      <Logo width={100} height={32} accessibilityLabel="Super Smash Bros. logo" />
    </View>
  )
}
