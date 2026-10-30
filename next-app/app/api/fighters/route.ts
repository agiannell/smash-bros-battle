import { getRandomFighters } from '../../lib/getFighters'
import type { Fighter } from '../../lib/types'

export const dynamic = 'force-dynamic'

export type { Fighter }

const DEFAULT_COUNT = 5

function parseCount(value: string | null): number {
  const count = Number(value)
  return value !== null && Number.isInteger(count) && count > 0 ? count : DEFAULT_COUNT
}

export async function GET(request: Request): Promise<Response> {
  try {
    const count = parseCount(new URL(request.url).searchParams.get('count'))
    const fighters = await getRandomFighters(count)
    return Response.json(fighters)
  } catch (err) {
    console.error('Failed to fetch random fighters', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    return Response.json({ error: 'Failed to load fighters' }, { status: 500 })
  }
}
