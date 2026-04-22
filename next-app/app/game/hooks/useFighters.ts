import { useState, useCallback } from 'react'
import type { Fighter } from '../../lib/types'

export function useFighters(initialRandFighters: Fighter[], initialAllFighters: Fighter[]) {
  const [randFighters, setRandFighters] = useState<Fighter[]>(initialRandFighters)
  const [allFighters] = useState<Fighter[]>(initialAllFighters)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchRandom = useCallback(async () => {
    try {
      const res = await fetch('/api/fighters')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Fighter[] = await res.json()
      setRandFighters(data)
      setFetchError(null)
    } catch (err) {
      console.error('Failed to fetch random fighters', err)
      setFetchError('Failed to load fighters. Please refresh the page.')
    }
  }, [])

  return { randFighters, allFighters, refetchRandom: fetchRandom, fetchError }
}
