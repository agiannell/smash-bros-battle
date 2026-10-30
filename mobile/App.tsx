import './global.css'
import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'
import { useFonts } from 'expo-font'
// Import single weights from their subpaths. The package roots re-export every
// weight, which makes Metro bundle all of them (~56MB for Noto Sans KR alone).
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular'
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular'
import Logo from './assets/icons/smash-logo-white.svg'
import { config } from './src/config'
import { useFighters } from './src/game/useFighters'

// Temporary checkpoint screen (replaced by the real game UI in Phase 3).
export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })
  const { randFighters, allFighters, loading, fetchError } = useFighters()

  if (!fontsLoaded) return null

  return (
    <View className="flex-1 items-center justify-center bg-navy px-6">
      <Logo width={240} height={78} />
      <Text className="mt-8 font-bangers text-5xl tracking-widest text-white">Smash Bros Battle</Text>
      <Text className="mt-4 text-center font-noto text-base text-white">
        Expo + NativeWind are running. API: {config.apiBaseUrl}
      </Text>
      <Text className="mt-6 text-center font-noto text-lg text-white">
        {loading
          ? 'Loading fighters...'
          : (fetchError ?? `${randFighters.length} random, ${allFighters.length} total (${randFighters[0]?.name})`)}
      </Text>
      <StatusBar style="light" />
    </View>
  )
}
