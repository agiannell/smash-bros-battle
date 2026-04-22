import * as https from 'node:https'

const AMIIBO_API_URL = 'https://www.amiiboapi.org/api/amiibo/?amiiboSeries=0x00'
const REQUEST_TIMEOUT_MS = 30_000

export interface AmiiboFighter {
  head: string
  tail: string
  name: string
  image: string
}

interface AmiiboApiResponse {
  amiibo: AmiiboFighter[]
}

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`Amiibo API error: ${res.statusCode} ${res.statusMessage}`))
      }
      const chunks: Buffer[] = []
      res.on('data', (chunk: Buffer) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      res.on('error', reject)
    })
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Amiibo API timed out after ${REQUEST_TIMEOUT_MS}ms`))
    })
    req.on('error', reject)
  })
}

function isValidAmiiboFighter(item: unknown): item is AmiiboFighter {
  if (typeof item !== 'object' || item === null) return false
  const obj = item as Record<string, unknown>
  return (
    typeof obj.head === 'string' && obj.head.length > 0 &&
    typeof obj.tail === 'string' && obj.tail.length > 0 &&
    typeof obj.name === 'string' && obj.name.length > 0 &&
    typeof obj.image === 'string' && obj.image.length > 0
  )
}

export async function fetchSmashFighters(): Promise<AmiiboFighter[]> {
  const body = await httpsGet(AMIIBO_API_URL)
  const data = JSON.parse(body) as AmiiboApiResponse
  if (!data.amiibo || data.amiibo.length === 0) {
    throw new Error('Amiibo API returned no fighters')
  }
  const valid = data.amiibo.filter(item => {
    if (isValidAmiiboFighter(item)) return true
    console.warn('Skipping malformed Amiibo item', { item })
    return false
  })
  if (valid.length === 0) {
    throw new Error('Amiibo API returned no valid fighters after validation')
  }
  return valid
}
