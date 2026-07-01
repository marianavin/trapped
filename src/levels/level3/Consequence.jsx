import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE_WIN, CONSEQUENCE_PARTIAL, CONSEQUENCE_FAIL } from './data.js'
import { play } from '../../audio/sounds.js'

// Immediate, unambiguous result of the player's decisions. No commentary yet -
// that's what the reveal screen is for. One of three outcomes based on how
// many of the four trials the player passed.
export default function Consequence({ outcome, onDone }) {
  const lines =
    outcome === 'win' ? CONSEQUENCE_WIN : outcome === 'partial' ? CONSEQUENCE_PARTIAL : CONSEQUENCE_FAIL

  useEffect(() => {
    play(outcome === 'fail' ? 'failPhrase' : 'connectSuccess')
    const t = setTimeout(onDone, 1800)
    return () => clearTimeout(t)
  }, [outcome, onDone])

  const colour = outcome === 'fail' ? 'text-accent-magenta' : 'text-l3-prompt'

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center px-6 text-center bg-l3-bg`}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className={`font-pixel text-lg sm:text-2xl ${colour}`}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
