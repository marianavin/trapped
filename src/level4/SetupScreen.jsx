import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SETUP_LINES } from '../data/level4.js'
import { play } from '../audio/sounds.js'

// 10 seconds of context, no instructions. Auto-advances — the player never
// has to click through their own setup screen.
export default function SetupScreen({ onDone }) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    play('setupTone')
  }, [])

  useEffect(() => {
    if (lineIndex < SETUP_LINES.length - 1) {
      const t = setTimeout(() => setLineIndex(lineIndex + 1), 1100)
      return () => clearTimeout(t)
    }
    const t = setTimeout(onDone, 1400)
    return () => clearTimeout(t)
  }, [lineIndex, onDone])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-l4bg text-l4text px-6 text-center gap-3">
      {SETUP_LINES.slice(0, lineIndex + 1).map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-pixel text-sm sm:text-lg"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
