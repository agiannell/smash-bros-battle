import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { RefreshControl, Text, View } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AllFighters } from '../components/AllFighters'
import { Battlefield } from '../components/Battlefield'
import { Fighters } from '../components/Fighters'
import { Header } from '../components/Header'
import { Menu } from '../components/Menu'
import { ResultHeader } from '../components/ResultHeader'
import { useFighters } from './useFighters'
import { useGame } from './useGame'

export function Game() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { randFighters, allFighters, loading, fetchError, reload, refetchRandom } = useFighters()
  const { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn } =
    useGame(refetchRandom)

  // The scroll offset goes negative while pulling down past the top; the hint grows with the pull.
  const scrollY = useSharedValue(0)
  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y
  })
  const hintStyle = useAnimatedStyle(() => {
    const pull = -scrollY.value
    return {
      opacity: interpolate(pull, [0, 90], [0.6, 1], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(pull, [0, 90], [1, 1.8], Extrapolation.CLAMP) }],
    }
  })

  // Two contenders means the queue is gone, so there's room to spread things out.
  const roomy = contenders.length === 2

  const toggleHeader = () => {
    if (showAll) setShowAll(false)
    else setMenuOpen(open => !open)
  }
  const showAllFighters = () => {
    setMenuOpen(false)
    setShowAll(true)
  }

  let resultOverlay = null
  if (result === null) {
    resultOverlay = null
  } else if (result.kind === 'win') {
    resultOverlay = <ResultHeader kind="win" name={result.name} clearFn={clearContenders} />
  } else if (result.kind === 'draw') {
    resultOverlay = <ResultHeader kind="draw" clearFn={clearContenders} />
  } else {
    result satisfies never
  }

  return (
    <SafeAreaView className="flex-1 bg-navy">
      <Header menuOpen={menuOpen || showAll} onMenuPress={toggleHeader} />
      <Animated.ScrollView
        contentContainerClassName="items-center pb-6"
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor="#fff" />}
      >
        {loading && randFighters.length === 0 && (
          <Text className="mt-6 px-4 font-noto text-white">Loading fighters...</Text>
        )}
        {fetchError && <Text className="mt-6 px-4 text-center font-noto text-red-400">{fetchError}</Text>}
        {contenders.length === 0 && !loading && (
          <Animated.View style={hintStyle} className="mt-3">
            <Text className="font-noto text-xs text-white">↓ Pull down to refresh fighters</Text>
          </Animated.View>
        )}
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
      </Animated.ScrollView>
      {showAll && <AllFighters allFighters={allFighters} />}
      <Menu visible={menuOpen} onClose={() => setMenuOpen(false)} onSeeAll={showAllFighters} />
      {resultOverlay}
      <StatusBar style="light" />
    </SafeAreaView>
  )
}
