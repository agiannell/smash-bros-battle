'use client'

import { Header } from '../components/Header'
import { ResultHeader } from '../components/ResultHeader'
import { Battlefield } from '../components/Battlefield'
import { Fighters } from '../components/Fighters'
import { useGame } from './hooks/useGame'
import { useFighters } from './hooks/useFighters'

export function Game() {
  const { randFighters, allFighters, refetchRandom, fetchError } = useFighters()
  const { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn } =
    useGame(refetchRandom)

  let header
  if (result === null) {
    header = <Header allFighters={allFighters} />
  } else if (result.kind === 'win') {
    header = <ResultHeader kind="win" name={result.name} clearFn={clearContenders} />
  } else if (result.kind === 'draw') {
    header = <ResultHeader kind="draw" clearFn={clearContenders} />
  } else {
    result satisfies never
    header = <Header allFighters={allFighters} />
  }

  return (
    <section className="bg-navy min-h-screen">
      {header}
      {fetchError && (
        <p className="text-center text-red-400 font-noto py-4">{fetchError}</p>
      )}
      <Battlefield
        contenders={contenders}
        editNameFn={editName}
        replaceFn={replaceContender}
        battleFn={battleFn}
      />
      <Fighters
        randFighters={randFighters}
        chooseFn={chooseContender}
        contendersCount={contenders.length}
        clearFn={clearContenders}
      />
    </section>
  )
}
