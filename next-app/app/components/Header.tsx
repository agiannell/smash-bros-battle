'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu } from './Menu'
import type { Fighter } from '../lib/types'

interface HeaderProps {
  allFighters: Fighter[]
}

export function Header({ allFighters }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showAllFighters, setShowAllFighters] = useState(false)

  const toggleMenu = () => {
    if (showMenu) {
      setShowMenu(false)
      setShowAllFighters(false)
    } else {
      setShowMenu(true)
    }
  }

  const toggleAllFighters = () => setShowAllFighters(prev => !prev)

  return (
    <header className="bg-black/60 w-screen h-[60px] fixed top-0 flex justify-center items-center z-20 box-border">
      <Image src="/smash-logo-white.svg" alt="Super Smash Bros. logo" width={80} height={40} />
      <button
        className="btn-menu h-[25px] w-[30px] fixed right-[25px] z-30 transition-transform duration-[250ms] ease-[cubic-bezier(.36,0,.1,1)] hover:scale-110 active:scale-[.85]"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      />
      {showMenu && (
        <Menu
          allFighters={allFighters}
          showFighters={showAllFighters}
          toggleFn={toggleAllFighters}
        />
      )}
    </header>
  )
}
