import { getRandomFighters } from '../../lib/getFighters'
import type { Fighter } from '../../lib/types'

export const dynamic = 'force-dynamic'

export type { Fighter }

export async function GET(): Promise<Response> {
  try {
    const fighters = await getRandomFighters(5)
    return Response.json(fighters)
  } catch (err) {
    console.error('Failed to fetch random fighters', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    return Response.json({ error: 'Failed to load fighters' }, { status: 500 })
  }
}
