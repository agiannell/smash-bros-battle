'use client'

import { useState } from 'react'

const SHIELD_PATH =
  'M43.07,751.66A541.69,541.69,0,0,0,200.25,959.74V751.66Z' +
  'M200.25,120.24C78.14,219.23,0,370.45,0,540A542.45,542.45,0,0,0,10.44,645.8H200.25Z' +
  'M1068.58,645.8A542.45,542.45,0,0,0,1079,540C1079,241.76,837.44,0,539.49,0a543.53,543.53,0,0,0-66.07,4.19V645.8Z' +
  'M473.42,1075.81a543.54,543.54,0,0,0,66.07,4.18c222.88,0,414.17-135.32,496.47-328.34H473.42Z'

interface BattleButtonProps {
  onClick: () => void
}

export function BattleButton({ onClick }: BattleButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-[15vw] w-[15vw] z-10 absolute left-[42vw] bg-transparent border-none cursor-pointer transition-transform duration-150 ease-in-out hover:scale-110 active:scale-100 animate-fadeInDelay"
      aria-label="Battle!"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1079.02 1080">
        <path fill={hovered ? '#ff3837' : '#666'} d={SHIELD_PATH} />
        <text
          fontSize="262.39"
          fill="#4d4d4d"
          stroke="#fff"
          strokeMiterlimit="10"
          strokeWidth="5"
          style={{ fontFamily: 'var(--font-bangers), cursive', letterSpacing: '0.06em' }}
          transform="translate(154.33 751.13)"
          textLength="770"
          lengthAdjust="spacingAndGlyphs"
        >
          BATTLE!
        </text>
      </svg>
    </button>
  )
}
