import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE } from '../data/level4.js'
import PixelButton from '../components/PixelButton.jsx'
import { LevelScreen } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

export default function ConsequenceScreen({ onContinue }) {
  useEffect(() => {
    play('consequenceStamp')
  }, [])

  return (
    <LevelScreen center className="gap-8 px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col gap-3"
      >
        <p className="font-pixel text-sm sm:text-lg">{CONSEQUENCE.headline}</p>
        <p className="font-pixel text-xs sm:text-base text-caught">{CONSEQUENCE.sub}</p>
      </motion.div>
      <PixelButton variant="primary" onClick={onContinue}>
        NEXT
      </PixelButton>
    </LevelScreen>
  )
}
