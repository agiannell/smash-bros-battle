import { AllFighters } from './AllFighters'
import type { Fighter } from '../lib/types'

interface MenuProps {
  allFighters: Fighter[]
  showFighters: boolean
  toggleFn: () => void
}

export function Menu({ allFighters, showFighters, toggleFn }: MenuProps) {
  return (
    <nav className="pr-[70px] fixed top-0 right-0 w-[17vw] h-[5vw] bg-navy box-border flex flex-col items-end justify-center animate-growIn">
      <button
        onClick={toggleFn}
        className="bg-transparent text-white border-none font-bangers text-2xl tracking-widest"
      >
        See All Characters
      </button>
      {showFighters && <AllFighters allFighters={allFighters} />}
    </nav>
  )
}
