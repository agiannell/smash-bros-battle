import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import type { AmiiboFighter } from './amiibo'

export const dynamoClient = new DynamoDBClient({})

const BATCH_CONCURRENCY = 10

async function upsertFighter(tableName: string, fighter: AmiiboFighter, now: string): Promise<void> {
  await dynamoClient.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: {
        pk: { S: 'FIGHTER' },
        id: { S: `${fighter.head}-${fighter.tail}` },
      },
      // Set created_at only on first insert; always update name, image, updated_at
      UpdateExpression:
        'SET #name = :name, image = :image, updated_at = :now, created_at = if_not_exists(created_at, :now)',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': { S: fighter.name },
        ':image': { S: fighter.image },
        ':now': { S: now },
      },
    })
  )
}

export async function upsertFighters(tableName: string, fighters: AmiiboFighter[]): Promise<void> {
  const now = new Date().toISOString()
  let processed = 0

  for (let i = 0; i < fighters.length; i += BATCH_CONCURRENCY) {
    const batch = fighters.slice(i, i + BATCH_CONCURRENCY)
    await Promise.all(batch.map(f => upsertFighter(tableName, f, now)))
    processed += batch.length
    console.log(`Progress: ${processed}/${fighters.length}`)
  }
}
