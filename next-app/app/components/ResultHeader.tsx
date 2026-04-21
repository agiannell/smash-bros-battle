interface ResultHeaderProps {
  kind: 'win' | 'draw'
  name?: string
  clearFn: () => void
}

const WIN_GIF = 'https://media.giphy.com/media/Y0Q6qO4v3xVlD2RkZ6/source.gif'
const DRAW_GIF = 'https://media.giphy.com/media/JUB0s1l8yuZsXpSgY9/source.gif'

export function ResultHeader({ kind, name, clearFn }: ResultHeaderProps) {
  const isWin = kind === 'win'
  return (
    <header
      className={`w-screen h-screen fixed flex flex-col justify-center items-center z-20 box-border animate-fadeIn ${
        isWin ? 'bg-[rgba(54,153,83,0.9)] pb-[200px]' : 'bg-[rgba(255,0,0,0.9)] pb-[100px]'
      }`}
    >
      <button
        className="btn-close h-[40px] w-[40px] fixed top-5 right-5 rounded-full transition-transform duration-500 ease-[cubic-bezier(.36,0,.1,1)] hover:rotate-180"
        onClick={clearFn}
        aria-label="Close"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={isWin ? 'h-[400px]' : 'h-[350px]'}
        src={isWin ? WIN_GIF : DRAW_GIF}
        alt={isWin ? 'congrats sticker' : 'unenthused clapping'}
      />
      <h1>{isWin ? `${name} wins!` : 'Draw!'}</h1>
    </header>
  )
}
