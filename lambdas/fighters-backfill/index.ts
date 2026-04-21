import { fetchSmashFighters } from '../shared/amiibo'
import { upsertFighters } from '../shared/dynamo'

export async function handler(): Promise<void> {
  const tableName = process.env.FIGHTERS_TABLE_NAME
  if (!tableName) throw new Error('FIGHTERS_TABLE_NAME environment variable is not set')

  try {
    console.log('Starting fighters backfill...')
    const fighters = await fetchSmashFighters()
    console.log(`Fetched ${fighters.length} fighters from Amiibo API`)

    await upsertFighters(tableName, fighters)
    console.log(`Backfill complete: ${fighters.length} fighters written`)
  } catch (err) {
    // Log but do not re-throw — a failed backfill must not roll back the CFN stack.
    // The weekly fighters-sync Lambda will populate the table on its next run.
    console.error('fighters-backfill failed — table will be populated by weekly sync', {
      tableName,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    })
  }
}
