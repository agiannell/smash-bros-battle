import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import type { Fighter } from './types'

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-west-2' }))

function toFighter(item: Record<string, unknown>): Fighter | null {
  if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.image !== 'string') {
    console.warn('Discarding DynamoDB item missing required fields', { item })
    return null
  }
  return { id: item.id, name: item.name, image: item.image }
}

export async function getAllFighters(): Promise<Fighter[]> {
  const tableName = process.env.FIGHTERS_TABLE_NAME
  if (!tableName) throw new Error('FIGHTERS_TABLE_NAME environment variable is not set')

  const items: Record<string, unknown>[] = []
  let lastKey: Record<string, unknown> | undefined

  try {
    do {
      const result = await client.send(
        new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: 'pk = :pk',
          ExpressionAttributeValues: { ':pk': 'FIGHTER' },
          ExclusiveStartKey: lastKey,
        })
      )
      items.push(...(result.Items ?? []))
      lastKey = result.LastEvaluatedKey as Record<string, unknown> | undefined
    } while (lastKey)
  } catch (err) {
    console.error('DynamoDB query failed', {
      tableName,
      error: err instanceof Error ? err.message : String(err),
    })
    throw err
  }

  const fighters = items
    .map(item => toFighter(item))
    .filter((f): f is Fighter => f !== null)

  if (fighters.length === 0) {
    console.warn('getAllFighters returned 0 results — DynamoDB table may be empty', { tableName })
  }

  return fighters
}

export async function getRandomFighters(count: number = 5): Promise<Fighter[]> {
  const all = await getAllFighters()
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, count)
}
