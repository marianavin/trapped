import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SETUP_TEXT } from './data.js'
import { play, startAlarm } from '../../audio/sounds.js'
import { HallwayBackdrop } from './Artwork.jsx'

// 10 seconds of context, no instructions. Auto-advances - the player is
// never told what a "correct" move looks like here or anywhere else.
export default function Setup({ onDone }) {
  useEffect(() => {
    play('setupTone')
    startAlarm()
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-l1-wall-dark px-6 text-center overflow-hidden">
      <HallwayBackdrop />
      <div className="absolute inset-0 bg-black/50" />
      {SETUP_TEXT.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.6, duration: 0.3 }}
          className="relative z-10 font-pixel text-l1-text text-sm sm:text-lg leading-relaxed drop-shadow-[0_2px_0_rgba(0,0,0,0.9)]"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}
