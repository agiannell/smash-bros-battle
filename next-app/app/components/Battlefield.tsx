import { Contenders } from './Contenders'
import type { Contender } from '../lib/types'

interface BattlefieldProps {
  contenders: Contender[]
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
  battleFn: () => void
}

export function Battlefield({ contenders, editNameFn, replaceFn, battleFn }: BattlefieldProps) {
  return (
    <section>
      {contenders.length === 0 ? (
        <section className="battlefield-bg w-screen h-[65vh] flex items-center justify-center">
          <div className="w-screen h-[65vh] bg-[rgba(37,55,83,0.7)] flex items-center justify-center">
            <h1 className="animate-flyRight">Choose Your Character!</h1>
          </div>
        </section>
      ) : (
        <section className="battlefield-bg w-screen h-[65vh] flex items-center justify-center relative mb-5">
          <div className="w-screen h-[50vh] my-5 px-[16vw] pt-[1vw] box-border flex relative justify-between items-center flex-wrap">
            {contenders.map(c => (
              <Contenders
                key={c.slot}
                contender={c}
                editNameFn={editNameFn}
                replaceFn={replaceFn}
              />
            ))}
          </div>
          {contenders.length === 2 && (
            <button
              className="btn-battle h-[15vw] w-[15vw] z-10 absolute left-[42vw] transition-transform duration-150 ease-in-out hover:scale-110 active:scale-100 animate-fadeInDelay"
              onClick={battleFn}
              aria-label="Battle!"
            />
          )}
        </section>
      )}
    </section>
  )
}
