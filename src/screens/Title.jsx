import PixelButton from '../components/PixelButton.jsx'
import CRTOverlay from '../components/CRTOverlay.jsx'
import { play } from '../audio/sounds.js'

export default function Title({ onBegin }) {
  return (
    <div className="relative h-full w-full bg-black flex flex-col items-center justify-center gap-8 px-6">
      <CRTOverlay />
      <h1 className="font-pixel text-white text-3xl sm:text-5xl tracking-widest">TRAPPED</h1>
      <p className="font-mono text-white/70 text-sm sm:text-base">Your mind is the obstacle.</p>
      <PixelButton
        onClick={() => {
          play('bootChime')
          onBegin()
        }}
      >
        BEGIN
      </PixelButton>
    </div>
  )
}
