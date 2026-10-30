import { getAllFighters } from '../../lib/getFighters'

export const dynamic = 'force-dynamic'

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
