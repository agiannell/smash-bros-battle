import './global.css'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
// Import single weights from their subpaths. The package roots re-export every
// weight, which makes Metro bundle all of them (~56MB for Noto Sans KR alone).
import { Bangers_400Regular } from '@expo-google-fonts/bangers/400Regular'
import { NotoSansKR_400Regular } from '@expo-google-fonts/noto-sans-kr/400Regular'
import Logo from './assets/icons/smash-logo-white.svg'
import { BattleButton } from './src/components/BattleButton'
import { Contenders } from './src/components/Contenders'
import { Fighters } from './src/components/Fighters'
import { useFighters } from './src/game/useFighters'
import { useGame } from './src/game/useGame'

// Temporary harness for the leaf components (replaced by Battlefield/Header/Game in later Phase 3 steps).
export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })
  const { randFighters, loading, fetchError, refetchRandom } = useFighters()
  const { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn } =
    useGame(refetchRandom)

  if (!fontsLoaded) return null

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-navy">
        <ScrollView contentContainerClassName="items-center px-4 py-6" keyboardShouldPersistTaps="handled">
          <Logo width={200} height={65} />
          {loading && <Text className="mt-6 font-noto text-white">Loading fighters...</Text>}
          {fetchError && <Text className="mt-6 text-center font-noto text-red-400">{fetchError}</Text>}
          {result && (
            <Text className="mt-4 font-bangers text-5xl tracking-widest text-white">
              {result.kind === 'win' ? `${result.name} wins!` : "It's a draw!"}
            </Text>
          )}
          <View className="mt-6 flex-row justify-center">
            {contenders.map(c => (
              <Contenders key={c.slot} contender={c} editNameFn={editName} replaceFn={replaceContender} />
            ))}
          </View>
          {contenders.length === 2 && !result && (
            <View className="my-4">
              <BattleButton onPress={battleFn} size={140} />
            </View>
          )}
          <View className="mt-6">
            <Fighters
              randFighters={randFighters}
              chooseFn={chooseContender}
              contendersCount={contenders.length}
              clearFn={clearContenders}
            />
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
