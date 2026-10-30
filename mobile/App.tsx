import './global.css'
import { StatusBar } from 'expo-status-bar'
import { ScrollView, Text, View, useWindowDimensions } from 'react-native'
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
import { ResultHeader } from './src/components/ResultHeader'
import { useFighters } from './src/game/useFighters'
import { useGame } from './src/game/useGame'

// Temporary harness for the leaf components (replaced by Battlefield/Header/Game in later Phase 3 steps).
export default function App() {
  const [fontsLoaded] = useFonts({ Bangers_400Regular, NotoSansKR_400Regular })
  const { width, height } = useWindowDimensions()
  const { randFighters, loading, fetchError, refetchRandom } = useFighters()
  const { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn } =
    useGame(refetchRandom)

  if (!fontsLoaded) return null

  const landscape = width > height

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-navy">
        <ScrollView contentContainerClassName="items-center px-4 py-6" keyboardShouldPersistTaps="handled">
          {!landscape && <Logo width={200} height={65} />}
          {loading && <Text className="mt-6 font-noto text-white">Loading fighters...</Text>}
          {fetchError && <Text className="mt-6 text-center font-noto text-red-400">{fetchError}</Text>}
          <View className={`mt-6 w-full ${landscape ? 'flex-row items-center justify-around' : ''}`}>
            {contenders[0] && (
              <Contenders
                contender={contenders[0]}
                editNameFn={editName}
                replaceFn={replaceContender}
                horizontal={!landscape}
              />
            )}
            {contenders.length === 2 && (
              <View className="my-2 items-center">
                <BattleButton onPress={battleFn} size={landscape ? 110 : 120} />
              </View>
            )}
            {contenders[1] && (
              <Contenders
                contender={contenders[1]}
                editNameFn={editName}
                replaceFn={replaceContender}
                horizontal={!landscape}
              />
            )}
          </View>
          <View className="mt-6 w-full">
            <Fighters
              randFighters={randFighters}
              chooseFn={chooseContender}
              contendersCount={contenders.length}
              clearFn={clearContenders}
            />
          </View>
        </ScrollView>
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
