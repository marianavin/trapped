import { useEffect } from 'react'
import PixelButton from '../components/PixelButton.jsx'
import GlitchShell, { ScreenHeader } from '../components/GlitchShell.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import { play } from '../audio/sounds.js'

export default function TitleScreen({ onBegin }) {
  useEffect(() => {
    play('bootChime')
  }, [])

  return (
    <GlitchShell contentClassName="gap-8 px-6 py-10">
      <ScreenHeader title="TRAPPED" subtitle="Your mind is the obstacle." />

      <WindowChrome title="SYSTEM // INIT" className="w-full max-w-sm">
        <p className="font-mono text-xs sm:text-sm text-l4text/80 leading-relaxed text-center">
          A cognitive bias escape room. Three scenarios. One rule: question what feels obvious.
        </p>
      </WindowChrome>

      <PixelButton variant="primary" onClick={onBegin}>
        BEGIN
      </PixelButton>
    </GlitchShell>
  )
}
