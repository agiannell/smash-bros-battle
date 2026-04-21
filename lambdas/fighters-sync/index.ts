import { fetchSmashFighters } from '../shared/amiibo'
import { upsertFighters } from '../shared/dynamo'

export async function handler(): Promise<void> {
  const tableName = process.env.FIGHTERS_TABLE_NAME
  if (!tableName) throw new Error('FIGHTERS_TABLE_NAME environment variable is not set')

  try {
    console.log('Fetching fighters from Amiibo API...')
    const fighters = await fetchSmashFighters()
    console.log(`Fetched ${fighters.length} fighters`)

    await upsertFighters(tableName, fighters)
    console.log(`Sync complete: ${fighters.length} fighters upserted`)
  } catch (err) {
    console.error('fighters-sync failed', {
      tableName,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
    throw err
  }
}
