import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { play } from '../../audio/sounds.js'
import { LeftPathArt, RightPathArt, ExtinguisherArt } from './Artwork.jsx'

const FORK_TIMEOUT_MS = 3200
const EXTINGUISHER_TIMEOUT_MS = 2800

// Two silent decision points before the door panel. Nothing on screen is
// labeled — the game never explains itself during play. The fork is the
// social-proof trap (blueprint: "the crowd is wrong, the empty route is
// faster"); the extinguisher is loss-aversion bait with no real payoff.
// Doing nothing at the fork still resolves to "followed the crowd" - the
// same way inaction usually does in real crowds.
export default function Act1Corridor({ onProceed }) {
  const [step, setStep] = useState('fork')
  const [forkChoice, setForkChoice] = useState(null)
  const [extinguisherChoice, setExtinguisherChoice] = useState(null)
  const advancedRef = useRef(false)

  const chooseFork = (choice) => {
    if (advancedRef.current) return
    advancedRef.current = true
    setForkChoice(choice)
    play('keyClick')
    setTimeout(() => {
      advancedRef.current = false
      setStep('extinguisher')
    }, 350)
  }

  useEffect(() => {
    if (step !== 'fork') return
    const t = setTimeout(() => chooseFork('crowd'), FORK_TIMEOUT_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const chooseExtinguisher = (choice) => {
    if (advancedRef.current) return
    advancedRef.current = true
    setExtinguisherChoice(choice)
    play(choice === 'pickedUp' ? 'wrongBuzz' : 'keyClick')
    setTimeout(() => onProceed({ forkChoice, extinguisherChoice: choice }), 350)
  }

  useEffect(() => {
    if (step !== 'extinguisher') return
    const t = setTimeout(() => chooseExtinguisher('left'), EXTINGUISHER_TIMEOUT_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  return (
    <div className="h-full w-full relative bg-l1-wall-dark overflow-hidden">
      <SmokeCreep />

      <AnimatePresence mode="wait">
        {step === 'fork' && (
          <motion.div
            key="fork"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full w-full flex"
          >
            <button
              type="button"
              onClick={() => chooseFork('empty')}
              className="relative flex-1 h-full border-r-2 border-l1-wall-dark overflow-hidden"
              aria-label="left path"
            >
              <LeftPathArt />
            </button>
            <button
              type="button"
              onClick={() => chooseFork('crowd')}
              className="relative flex-1 h-full overflow-hidden"
              aria-label="right path"
            >
              <RightPathArt />
            </button>
          </motion.div>
        )}

        {step === 'extinguisher' && (
          <motion.div
            key="extinguisher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full w-full overflow-hidden"
          >
            <ExtinguisherArt />

            {/* extinguisher hotspot — art group sits around (80-125, 275-395)
                in the 360x640 viewBox */}
            <button
              type="button"
              onClick={() => chooseExtinguisher('pickedUp')}
              aria-label="pick up extinguisher"
              className="absolute z-20 bg-transparent"
              style={{ left: '18%', top: '42%', width: '20%', height: '20%' }}
            />

            {/* far doorway glow — "keep moving", art at (240-300, 260-400) */}
            <button
              type="button"
              onClick={() => chooseExtinguisher('left')}
              aria-label="keep moving"
              className="absolute z-20 bg-transparent"
              style={{ left: '64%', top: '38%', width: '20%', height: '24%' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SmokeCreep() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-10 bg-l1-smoke pointer-events-none"
      style={{ opacity: 0.22 }}
      initial={{ height: '0%' }}
      animate={{ height: '18%' }}
      transition={{ duration: 2.6, ease: 'easeOut' }}
    />
  )
}
