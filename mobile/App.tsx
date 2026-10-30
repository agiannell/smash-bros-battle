import './global.css'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
// Import single weights from their subpaths. The package roots re-export every
// weight, which makes Metro bundle all of them (~56MB for Noto Sans KR alone).
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular'
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular'
import { Battlefield } from './src/components/Battlefield'
import { Header } from './src/components/Header'
import { Menu } from './src/components/Menu'
import { Fighters } from './src/components/Fighters'
import { ResultHeader } from './src/components/ResultHeader'
import { useFighters } from './src/game/useFighters'
import { useGame } from './src/game/useGame'

// Temporary harness for the leaf components (replaced by Battlefield/Header/Game in later Phase 3 steps).
export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })
  const [menuOpen, setMenuOpen] = useState(false)
  const { randFighters, loading, fetchError, refetchRandom } = useFighters()
  const { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn } =
    useGame(refetchRandom)

  if (!fontsLoaded) return null

  // Two contenders means the queue is gone, so there's room to spread things out.
  const roomy = contenders.length === 2

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-navy">
        <Header onMenuPress={() => setMenuOpen(true)} />
        <ScrollView contentContainerClassName="items-center pb-6" keyboardShouldPersistTaps="handled">
          {loading && <Text className="mt-6 px-4 font-noto text-white">Loading fighters...</Text>}
          {fetchError && <Text className="mt-6 px-4 text-center font-noto text-red-400">{fetchError}</Text>}
          <Battlefield
            contenders={contenders}
            editNameFn={editName}
            replaceFn={replaceContender}
            battleFn={battleFn}
          />
          <View className={`w-full px-4 ${roomy ? 'mt-10' : 'mt-6'}`}>
            <Fighters
              randFighters={randFighters}
              chooseFn={chooseContender}
              contendersCount={contenders.length}
              clearFn={clearContenders}
            />
          </View>
        </ScrollView>
        {/* See All Characters is wired up with AllFighters in the next step. */}
        <Menu visible={menuOpen} onClose={() => setMenuOpen(false)} onSeeAll={() => setMenuOpen(false)} />
        {result && (
          <ResultHeader
            kind={result.kind}
            name={result.kind === 'win' ? result.name : undefined}
            clearFn={clearContenders}
          />
        )}
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
