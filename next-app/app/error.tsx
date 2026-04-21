'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <section className="bg-navy min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bangers tracking-widest">Something went wrong</h1>
      <p className="text-gray-300 font-noto">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-[#535353] text-white font-bangers text-2xl tracking-widest hover:bg-[#ff3738] transition-colors"
      >
        Try Again
      </button>
    </section>
  )
}
