import { Contenders } from './Contenders'
import { BattleButton } from './BattleButton'
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
            <BattleButton onClick={battleFn} />
          )}
        </section>
      )}
    </section>
  )
}
