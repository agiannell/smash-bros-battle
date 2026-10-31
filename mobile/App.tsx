import './global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
// Import single weights from their subpaths. The package roots re-export every
// weight, which makes Metro bundle all of them (~56MB for Noto Sans KR alone).
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular'
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular'
import { Game } from './src/game/Game'

export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  )
}
