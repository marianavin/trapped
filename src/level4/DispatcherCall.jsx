import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, DISPATCHER_INTRO } from '../data/level4.js'
import PixelButton from '../components/PixelButton.jsx'
import Typewriter from '../components/Typewriter.jsx'
import { play, SFX } from '../sound/sounds.js'

export default function DispatcherCall({ onComplete }) {
  const [stage, setStage] = useState('ringing') // ringing -> intro -> q0..q4 -> done
  const [qIndex, setQIndex] = useState(0)
  const [lineTyped, setLineTyped] = useState(false)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    play(SFX.dispatcherRing)
    const t = setTimeout(() => setStage('intro'), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (stage === 'intro') {
      const t = setTimeout(() => {
        setStage('question')
        play(SFX.questionArrive)
      }, 1200)
      return () => clearTimeout(t)
    }
  }, [stage])

  function selectOption(optionId) {
    const q = QUESTIONS[qIndex]
    const next = { ...answers, [q.id]: optionId }
    setAnswers(next)

    if (qIndex + 1 < QUESTIONS.length) {
      setLineTyped(false)
      setQIndex(qIndex + 1)
      play(SFX.questionArrive)
    } else {
      onComplete(next)
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-l4bg text-l4text px-6 gap-6">
      <AnimatePresence mode="wait">
        {stage === 'ringing' && (
          <motion.p
            key="ringing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-pixel text-xs sm:text-sm animate-pulse"
          >
            INCOMING CALL...
          </motion.p>
        )}

        {stage === 'intro' && (
          <motion.p
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-pixel text-xs sm:text-sm"
          >
            {DISPATCHER_INTRO}
          </motion.p>
        )}

        {stage === 'question' && (
          <motion.div
            key={QUESTIONS[qIndex].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md flex flex-col gap-5"
          >
            <div className="pixel-border bg-l4panel p-4">
              <Typewriter
                text={QUESTIONS[qIndex].line}
                speed={18}
                onDone={() => setLineTyped(true)}
                className="font-mono text-sm sm:text-base leading-relaxed"
              />
            </div>

            {lineTyped && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                {QUESTIONS[qIndex].options.map((opt) => (
                  <PixelButton key={opt.id} full onClick={() => selectOption(opt.id)}>
                    {opt.label}
                  </PixelButton>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
