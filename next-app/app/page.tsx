import { Suspense } from 'react'
import Image from 'next/image'
import { GameLoader } from './game/GameLoader'

export const dynamic = 'force-dynamic'

function GameSkeleton() {
  return (
    <section className="bg-navy min-h-screen">
      <header className="bg-black/60 w-screen h-[60px] fixed top-0 flex justify-center items-center z-20 box-border">
        <Image src="/smash-logo-white.svg" alt="Super Smash Bros. logo" width={80} height={40} />
      </header>
      <section className="battlefield-bg w-screen h-[65vh] flex items-center justify-center">
        <div className="w-screen h-[65vh] bg-[rgba(37,55,83,0.7)] flex items-center justify-center">
          <h1>Choose Your Character!</h1>
        </div>
      </section>
    </section>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<GameSkeleton />}>
      <GameLoader />
    </Suspense>
  )
}
