'use client'

import { useState } from 'react'
import type { Contender } from '../lib/types'

interface ContendersProps {
  contender: Contender
  editNameFn: (slot: 0 | 1, name: string) => void
  replaceFn: (slot: 0 | 1) => void
}

export function Contenders({ contender, editNameFn, replaceFn }: ContendersProps) {
  const [editing, setEditing] = useState(false)
  const [userInput, setUserInput] = useState('')

  const handleEdit = () => {
    if (userInput.trim() === '') return
    editNameFn(contender.slot, userInput.trim())
    setEditing(false)
    setUserInput('')
  }

  return (
    <section className="w-[20vw] flex relative box-border flex-col justify-evenly items-center animate-fadeIn">
      <p className="font-bangers text-3xl tracking-widest z-0">HP: {contender.hp}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={contender.image}
        alt={contender.name}
        className="h-[200px] my-[4%] bg-black/70 shadow-[0_0_100px_100px_rgba(0,0,0,0.7)] z-[-1]"
      />
      <div>
        {editing ? (
          <div className="w-[20vw] box-border flex flex-row items-center justify-center">
            <input
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder={contender.name}
              className="px-2 py-1 mr-[2px] text-black text-base"
            />
            <button onClick={handleEdit} className="btn-green">Submit</button>
          </div>
        ) : (
          <div>
            <p className="font-bangers text-3xl tracking-widest z-0">{contender.name}</p>
            <div className="w-[20vw] box-border flex flex-row items-center justify-center">
              <button onClick={() => setEditing(true)} className="btn-green">Edit Name</button>
              <button onClick={() => replaceFn(contender.slot)} className="btn-green">Replace</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
