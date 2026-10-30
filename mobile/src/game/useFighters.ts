import { useState, useCallback, useEffect } from 'react'
import { config } from '../config'
import { getAllFighters, getRandomFighters } from '../lib/api'
import type { Fighter } from '../lib/types'

const toQueue = (fighters: Fighter[]) => fighters.slice(0, config.queueSize)

export function useFighters() {
  const [randFighters, setRandFighters] = useState<Fighter[]>([])
  const [allFighters, setAllFighters] = useState<Fighter[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [rand, all] = await Promise.all([getRandomFighters(), getAllFighters()])
      setRandFighters(toQueue(rand))
      setAllFighters(all)
      setFetchError(null)
    } catch (err) {
      console.error('Failed to load fighters', err)
      setFetchError('Failed to load fighters. Pull to retry.')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRandom = useCallback(async () => {
    try {
      setRandFighters(toQueue(await getRandomFighters()))
      setFetchError(null)
    } catch (err) {
      console.error('Failed to fetch random fighters', err)
      setFetchError('Failed to load fighters. Pull to retry.')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { randFighters, allFighters, loading, fetchError, reload: load, refetchRandom: fetchRandom }
}
