import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { SETUP_TEXT } from './data.js'
import { LevelScreen } from '../../components/GameUI.jsx'
import { play, startSiren } from '../../audio/sounds.js'

export default function Setup({ onDone }) {
  useEffect(() => {
    play('setupTone')
    startSiren()
    const t = setTimeout(onDone, 2600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <LevelScreen center className="px-6 text-center gap-3">
      {SETUP_TEXT.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.6, duration: 0.3 }}
          className="font-pixel text-sm sm:text-lg leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
    </LevelScreen>
  )
}
