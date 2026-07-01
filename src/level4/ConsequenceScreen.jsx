import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CONSEQUENCE } from '../data/level4.js'
import PixelButton from '../components/PixelButton.jsx'
import { play } from '../audio/sounds.js'

export default function ConsequenceScreen({ onContinue }) {
  useEffect(() => {
    play('consequenceStamp')
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-l4bg text-l4text px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col gap-3"
      >
        <p className="font-pixel text-sm sm:text-lg">{CONSEQUENCE.headline}</p>
        <p className="font-pixel text-xs sm:text-base text-caught">{CONSEQUENCE.sub}</p>
      </motion.div>
      <PixelButton onClick={onContinue}>NEXT</PixelButton>
    </div>
  )
}
