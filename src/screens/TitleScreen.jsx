import { useEffect } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import GlitchShell, { ScreenHeader } from '../components/GlitchShell.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import { play } from '../audio/sounds.js'

export default function TitleScreen({ onBegin }) {
  useEffect(() => {
    play('bootChime')
  }, [])

  function handleBegin() {
    play('keyClick')
    onBegin()
  }

  return (
    <GlitchShell contentClassName="gap-8 px-6 py-10">
      <ScreenHeader title="TRAPPED" subtitle="Your mind is the obstacle." />

      <WindowChrome title="SYSTEM // INIT" className="w-full max-w-sm">
        <div className="font-mono text-xs sm:text-sm text-l4text leading-relaxed text-center flex flex-col gap-2">
          <p>THREE SCENARIOS.</p>
          <p>YOUR CONFIDENCE IS THE TRAP.</p>
          <p>QUESTION EVERYTHING THAT FEELS OBVIOUS.</p>
        </div>
      </WindowChrome>

      <PixelButton variant="primary" onClick={handleBegin}>
        BEGIN
      </PixelButton>
    </GlitchShell>
  )
}
