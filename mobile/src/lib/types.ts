export interface Fighter {
  id: string   // head-tail from Amiibo (e.g. "00000000-00000002")
  name: string
  image: string
}

export interface Contender {
  /** Slot index: 0 or 1 */
  slot: 0 | 1
  name: string
  image: string
  hp: number
}
