import { Queue } from './Queue'
import type { Fighter } from '../lib/types'

interface FightersProps {
  randFighters: Fighter[]
  chooseFn: (fighter: Fighter) => void
  contendersCount: number
  clearFn: () => void
}

export function Fighters({ randFighters, chooseFn, contendersCount, clearFn }: FightersProps) {
  const showReset = contendersCount >= 2

  return (
    <section>
      {showReset ? (
        <button
          className="px-[2%] mt-[2vw] border-none bg-[#535353] text-white font-bangers text-4xl tracking-widest transition-all duration-100 ease-in-out hover:scale-105 hover:bg-[#ff3738] active:scale-[.7] active:bg-[#b92828] animate-fadeInDelay"
          onClick={clearFn}
        >
          Reset Battlefield
        </button>
      ) : (
        <h2
          className={`font-bangers tracking-widest text-5xl mb-[25px] ${
            contendersCount === 1 ? 'animate-fadeIn' : 'invisible'
          }`}
        >
          Choose Your Character!
        </h2>
      )}
      <div className="flex box-border justify-evenly flex-wrap animate-flyUp">
        {randFighters.map(f => (
          <Queue key={f.id} fighter={f} chooseFn={chooseFn} contendersCount={contendersCount} />
        ))}
      </div>
    </section>
  )
}
