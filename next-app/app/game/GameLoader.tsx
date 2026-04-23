import { getAllFighters, getRandomFighters } from '../lib/getFighters'
import { Game } from './Game'

export async function GameLoader() {
  const [randFighters, allFighters] = await Promise.all([
    getRandomFighters(5),
    getAllFighters(),
  ])
  return <Game initialRandFighters={randFighters} initialAllFighters={allFighters} />
}
