import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE_WIN, CONSEQUENCE_FAIL } from './data.js'
import { play } from '../../audio/sounds.js'
import { HallwayBackdrop } from './Artwork.jsx'

// Immediate, unambiguous result of the player's decisions. No commentary yet -
// that's what the reveal screen is for.
export default function Consequence({ success, onDone }) {
  const lines = success ? CONSEQUENCE_WIN : CONSEQUENCE_FAIL

  useEffect(() => {
    play(success ? 'connectSuccess' : 'doorLock')
    const t = setTimeout(onDone, 1900)
    return () => clearTimeout(t)
  }, [success, onDone])

  return (
    <div className={`relative h-full w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden ${
      success ? 'bg-l1-wall-dark' : 'bg-black'
    }`}
    >
      {success && (
        <>
          <HallwayBackdrop />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}
      {!success && <SmokeFill />}

      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className={`relative z-10 font-pixel text-lg sm:text-2xl ${
            success ? 'text-l1-correct' : 'text-l1-danger'
          }`}
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}

function SmokeFill() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 bg-l1-smoke"
      style={{ opacity: 0.2 }}
      initial={{ height: '0%' }}
      animate={{ height: '100%' }}
      transition={{ duration: 1.8, ease: 'easeIn' }}
    />
  )
}
