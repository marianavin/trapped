import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { play } from '../../audio/sounds.js'

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
    <div className="h-full w-full relative bg-l1-bg overflow-hidden">
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
              className="flex-1 h-full flex items-center justify-center border-r border-l1-smoke"
              aria-label="left path"
            >
              <div className="w-2 h-16 bg-l1-correct opacity-60" />
            </button>
            <button
              type="button"
              onClick={() => chooseFork('crowd')}
              className="flex-1 h-full flex items-center justify-center gap-2"
              aria-label="right path"
            >
              <CrowdFigures />
            </button>
          </motion.div>
        )}

        {step === 'extinguisher' && (
          <motion.div
            key="extinguisher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-10"
          >
            <button
              type="button"
              onClick={() => chooseExtinguisher('pickedUp')}
              className="flex flex-col items-center gap-2"
              aria-label="pick up extinguisher"
            >
              <div className="w-6 h-10 bg-l1-danger" />
              <div className="w-8 h-2 bg-l1-smoke" />
            </button>

            <button
              type="button"
              onClick={() => chooseExtinguisher('left')}
              className="font-pixel text-[10px] text-l1-correct border-2 border-l1-correct px-4 py-3"
              aria-label="keep moving"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CrowdFigures() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-8 bg-l1-overlay"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function SmokeCreep() {
  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 bg-l1-smoke"
      style={{ opacity: 0.2 }}
      initial={{ height: '0%' }}
      animate={{ height: '18%' }}
      transition={{ duration: 2.6, ease: 'easeOut' }}
    />
  )
}
