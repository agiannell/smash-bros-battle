import { Game } from './game/Game'
import { getAllFighters, getRandomFighters } from './lib/getFighters'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [randFighters, allFighters] = await Promise.all([
    getRandomFighters(5),
    getAllFighters(),
  ])

  return <Game initialRandFighters={randFighters} initialAllFighters={allFighters} />
}
