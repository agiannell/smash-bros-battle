import { useState, useEffect, useCallback } from 'react'
import type { Fighter } from '../../lib/types'

export function useFighters() {
  const [randFighters, setRandFighters] = useState<Fighter[]>([])
  const [allFighters, setAllFighters] = useState<Fighter[]>([])
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

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/all-fighters')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Fighter[] = await res.json()
      setAllFighters(data)
    } catch (err) {
      console.error('Failed to fetch all fighters', err)
    }
  }, [])

  useEffect(() => {
    fetchRandom()
    fetchAll()
  }, [fetchRandom, fetchAll])

  return { randFighters, allFighters, refetchRandom: fetchRandom, fetchError }
}
