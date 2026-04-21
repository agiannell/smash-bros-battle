import type { Fighter } from '../lib/types'

interface AllFightersProps {
  allFighters: Fighter[]
}

export function AllFighters({ allFighters }: AllFightersProps) {
  return (
    <section className="h-screen w-screen bg-navy fixed bottom-0 right-0 box-border animate-flyDown">
      <h2 className="mt-5 font-bangers text-5xl tracking-widest z-10">All Available Fighters</h2>
      <div className="overflow-y-scroll flex flex-wrap mx-[30px] my-[15px] box-border h-[calc(100vh-80px)]">
        {allFighters.map(f => (
          <section key={f.id} className="m-[10px_20px] font-bold box-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.image} alt={f.name} className="h-[100px] my-[5px]" />
            <p>{f.name}</p>
          </section>
        ))}
      </div>
    </section>
  )
}
