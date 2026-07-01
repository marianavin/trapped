import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE_WIN, CONSEQUENCE_FAIL } from '../data/level2.js'
import { play } from '../audio/sounds.js'

// Immediate, unambiguous result of the player's decisions. No commentary yet -
// that's what the reveal screen is for.
export default function Consequence({ success, onDone }) {
  const lines = success ? CONSEQUENCE_WIN : CONSEQUENCE_FAIL

  useEffect(() => {
    play(success ? 'connectSuccess' : 'failPhrase')
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [success, onDone])

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center px-6 text-center ${
        success ? 'bg-l2-bg' : 'bg-black'
      }`}
    >
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className={`font-pixel text-lg sm:text-2xl ${success ? 'text-correct' : 'text-wrong'}`}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
