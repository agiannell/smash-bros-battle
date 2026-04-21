import { useState } from 'react'
import type { Fighter, Contender } from '../../lib/types'

export type GameResult = { kind: 'win'; name: string } | { kind: 'draw' }

export function useGame(onReset: () => void) {
  const [contenders, setContenders] = useState<Contender[]>([])
  const [result, setResult] = useState<GameResult | null>(null)

  const chooseContender = (fighter: Fighter) => {
    if (contenders.length >= 2) return
    const hp = Math.ceil(Math.random() * 49 + 50)
    const slot = contenders.length as 0 | 1
    setContenders(prev => [...prev, { slot, name: fighter.name, image: fighter.image, hp }])
  }

  const editName = (slot: 0 | 1, name: string) => {
    setContenders(prev => prev.map(c => c.slot === slot ? { ...c, name } : c))
  }

  const replaceContender = (slot: 0 | 1) => {
    setContenders(prev =>
      prev.filter(c => c.slot !== slot).map((c, i) => ({ ...c, slot: i as 0 | 1 }))
    )
    onReset()
  }

  const clearContenders = () => {
    setContenders([])
    setResult(null)
    onReset()
  }

  const battleFn = () => {
    if (contenders.length < 2) return
    const [a, b] = contenders
    if (a.hp > b.hp) {
      setResult({ kind: 'win', name: a.name })
    } else if (a.hp < b.hp) {
      setResult({ kind: 'win', name: b.name })
    } else {
      setResult({ kind: 'draw' })
    }
  }

  return { contenders, result, chooseContender, editName, replaceContender, clearContenders, battleFn }
}
