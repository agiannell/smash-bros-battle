import { config } from '../config'
import type { Fighter } from './types'

async function fetchFighters(path: string): Promise<Fighter[]> {
  const res = await fetch(`${config.apiBaseUrl}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getRandomFighters = () => fetchFighters('/api/fighters')
export const getAllFighters = () => fetchFighters('/api/all-fighters')
