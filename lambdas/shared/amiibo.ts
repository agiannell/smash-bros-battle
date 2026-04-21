const AMIIBO_API_URL = 'https://www.amiiboapi.com/api/amiibo/?amiiboSeries=0x00'

export interface AmiiboFighter {
  head: string
  tail: string
  name: string
  image: string
}

interface AmiiboApiResponse {
  amiibo: AmiiboFighter[]
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
  const res = await fetch(AMIIBO_API_URL)
  if (!res.ok) throw new Error(`Amiibo API error: ${res.status} ${res.statusText}`)
  const data = (await res.json()) as AmiiboApiResponse
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
