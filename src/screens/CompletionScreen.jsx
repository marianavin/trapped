import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PixelButton from '../components/PixelButton.jsx'
import { play } from '../audio/sounds.js'

// Standalone completion screen for this level build. The full end screen
// (radar chart, named profile, stress curve) only makes sense once all 4
// levels exist — see TRAPPED_Game_Design_Blueprint.md. This shows this
// level's own outcome/process split using the exact global score labels.
export default function CompletionScreen({ result, onReplay }) {
  const escaped = result.escapedCount
  const total = 4

  useEffect(() => {
    play(escaped >= 3 ? 'connectSuccess' : 'failPhrase')
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-l4bg text-l4text px-6 text-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-pixel text-sm sm:text-lg"
      >
        YOUR MIND UNDER PRESSURE
      </motion.h2>

      <div className="flex flex-col gap-4 font-mono">
        <div>
          <p className="text-2xl sm:text-3xl font-pixel text-caught">0 / 1</p>
          <p className="text-xs text-l4text/70 mt-1">SCENARIOS SURVIVED</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-pixel text-escaped">
            {escaped} / {total}
          </p>
          <p className="text-xs text-l4text/70 mt-1">BIASES ESCAPED</p>
        </div>
      </div>

      <PixelButton onClick={onReplay}>TRY AGAIN</PixelButton>
    </div>
  )
}
