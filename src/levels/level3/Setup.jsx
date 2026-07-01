import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SETUP_TEXT } from './data.js'
import { play, startSiren } from '../../audio/sounds.js'

// 10 seconds of context, no instructions. Auto-advances - the player is
// never told what a "correct" move looks like here or anywhere else.
export default function Setup({ onDone }) {
  useEffect(() => {
    play('setupTone')
    startSiren()
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-l3-bg px-6 text-center">
      {SETUP_TEXT.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.6, duration: 0.3 }}
          className="font-pixel text-white text-sm sm:text-lg leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
