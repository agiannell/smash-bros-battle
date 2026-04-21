import { getAllFighters } from '../../lib/getFighters'
import type { Fighter } from '../../lib/types'

export const revalidate = 86400

export type { Fighter }

export async function GET(): Promise<Response> {
  try {
    const fighters = await getAllFighters()
    return Response.json(fighters)
  } catch (err) {
    console.error('Failed to fetch all fighters', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    return Response.json({ error: 'Failed to load fighters' }, { status: 500 })
  }
}
