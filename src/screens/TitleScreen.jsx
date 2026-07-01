import { useEffect } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import { play } from '../audio/sounds.js'

export default function TitleScreen({ onBegin }) {
  useEffect(() => {
    play('bootChime')
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-l4bg text-l4text px-6 text-center">
      <h1 className="font-pixel text-2xl sm:text-4xl tracking-widest">TRAPPED</h1>
      <p className="font-mono text-sm sm:text-base text-l4text/80">Your mind is the obstacle.</p>
      <PixelButton onClick={onBegin}>BEGIN</PixelButton>
    </div>
  )
}
