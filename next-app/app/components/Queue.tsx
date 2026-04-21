import type { Fighter } from '../lib/types'

interface QueueProps {
  fighter: Fighter
  chooseFn: (fighter: Fighter) => void
  contendersCount: number
}

export function Queue({ fighter, chooseFn, contendersCount }: QueueProps) {
  if (contendersCount >= 2) return null

  return (
    <section>
      <button
        onClick={() => chooseFn(fighter)}
        className="transition-all duration-150 ease-in hover:scale-110 hover:text-[rgb(238,255,0)] active:scale-100 cursor-pointer bg-transparent border-none p-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={fighter.image} alt={fighter.name} className="h-[9vw] mb-[5px]" />
        <p className="font-bold z-10">{fighter.name}</p>
      </button>
    </section>
  )
}
