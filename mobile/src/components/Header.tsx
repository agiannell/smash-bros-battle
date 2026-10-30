import { Pressable, View } from 'react-native'
import Logo from '../../assets/icons/smash-logo-white.svg'
import MenuIcon from '../../assets/icons/menu-lines.svg'

interface HeaderProps {
  onMenuPress: () => void
}

// The hamburger sits on the left: Expo Go's floating dev-menu button covers the top-right corner.
export function Header({ onMenuPress }: HeaderProps) {
  return (
    <View className="h-[60px] w-full items-center justify-center bg-black/60">
      <Pressable
        onPress={onMenuPress}
        accessibilityLabel="Toggle menu"
        hitSlop={12}
        className="absolute left-6 active:scale-90"
      >
        <MenuIcon width={30} height={25} />
      </Pressable>
      <Logo width={100} height={32} accessibilityLabel="Super Smash Bros. logo" />
    </View>
  )
}
