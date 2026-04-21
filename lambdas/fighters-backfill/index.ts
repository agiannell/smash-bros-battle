import { fetchSmashFighters } from '../shared/amiibo'
import { upsertFighters } from '../shared/dynamo'

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 10_000

export async function handler(): Promise<void> {
  const tableName = process.env.FIGHTERS_TABLE_NAME
  if (!tableName) throw new Error('FIGHTERS_TABLE_NAME environment variable is not set')

  let lastErr: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      console.log(`Starting fighters backfill (attempt ${attempt}/${MAX_ATTEMPTS})...`)
      const fighters = await fetchSmashFighters()
      console.log(`Fetched ${fighters.length} fighters from Amiibo API`)
      await upsertFighters(tableName, fighters)
      console.log(`Backfill complete: ${fighters.length} fighters written`)
      return
    } catch (err) {
      lastErr = err
      console.warn(`Backfill attempt ${attempt}/${MAX_ATTEMPTS} failed`, {
        error: err instanceof Error ? err.message : String(err),
      })
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      }
    }
  }

  // Log but do not re-throw — a failed backfill must not roll back the CFN stack.
  // Invoke the smash-bros-fighters-sync Lambda manually or wait for the weekly run.
  console.error(`fighters-backfill failed after ${MAX_ATTEMPTS} attempts`, {
    tableName,
    error: lastErr instanceof Error ? lastErr.message : String(lastErr),
    stack: lastErr instanceof Error ? lastErr.stack : undefined,
  })
}
