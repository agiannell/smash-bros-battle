import './global.css'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import { useFonts } from 'expo-font'
// Import single weights from their subpaths. The package roots re-export every
// weight, which makes Metro bundle all of them (~56MB for Noto Sans KR alone).
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular'
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular'
import Logo from './assets/icons/smash-logo-white.svg'

// Phase 1 checkpoint screen: proves NativeWind, fonts, and SVG all work on device.
export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })

  if (!fontsLoaded) return null

  return (
    <View className="flex-1 items-center justify-center bg-navy px-6">
      <Logo width={240} height={78} />
      <Text className="mt-8 font-bangers text-5xl tracking-widest text-white">Smash Bros Battle</Text>
      <Text className="mt-4 text-center font-noto text-base text-white">
        Expo + NativeWind are running. API: {process.env.EXPO_PUBLIC_API_BASE_URL}
      </Text>
      <View className="mt-6 h-4 w-40 rounded bg-red-500" />
      <StatusBar style="light" />
    </View>
  )
}
