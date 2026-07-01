import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE_WIN, CONSEQUENCE_FAIL } from './data.js'
import { play } from '../../audio/sounds.js'

// Immediate, unambiguous result of the player's decisions. No commentary yet -
// that's what the reveal screen is for.
export default function Consequence({ connected, onDone }) {
  const lines = connected ? CONSEQUENCE_WIN : CONSEQUENCE_FAIL

  useEffect(() => {
    play(connected ? 'connectSuccess' : 'failPhrase')
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [connected, onDone])

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center px-6 text-center ${
        connected ? 'bg-l3-bg' : 'bg-black'
      }`}
    >
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className={`font-pixel text-lg sm:text-2xl ${connected ? 'text-l3-success' : 'text-l3-error'}`}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
