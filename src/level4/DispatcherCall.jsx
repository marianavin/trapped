import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QUESTIONS, DISPATCHER_INTRO } from '../data/level4.js'
import PixelButton from '../components/PixelButton.jsx'
import Typewriter from '../components/Typewriter.jsx'
import { play } from '../audio/sounds.js'
import DispatcherBackdrop from './DispatcherBackdrop.jsx'

// Act 3 — the call is now outgoing: the player dials the police rather than
// being called, per the redesigned 3-act structure. Mechanically unchanged
// from the original dispatcher-call version — same leading-question/scoring
// flow — only the framing text and the sound cue's meaning shift (the same
// two-tone ring now plays as "it's ringing on their end" instead of "an
// incoming call").
export default function DispatcherCall({ onComplete }) {
  const [stage, setStage] = useState('dialling') // dialling -> intro -> q0..q4 -> done
  const [qIndex, setQIndex] = useState(0)
  const [lineTyped, setLineTyped] = useState(false)
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    play('dispatcherRing')
    const t = setTimeout(() => setStage('intro'), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (stage === 'intro') {
      const t = setTimeout(() => {
        setStage('question')
        play('questionArrive')
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
      play('questionArrive')
    } else {
      onComplete(next)
    }
  }

  // Screen readers get the full line/question the instant it arrives,
  // separately from the visual typewriter effect below — otherwise a live
  // region on the animated text would announce every character increment.
  const srAnnouncement =
    stage === 'dialling'
      ? 'Dialling police...'
      : stage === 'intro'
      ? DISPATCHER_INTRO
      : stage === 'question'
      ? QUESTIONS[qIndex].line
      : ''

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-l4bg text-l4text px-6 gap-6 overflow-hidden">
      <DispatcherBackdrop />
      {/* dims the window/skyline dressing so the dialogue stays the focal point */}
      <div className="absolute inset-0 bg-l4bg/55" aria-hidden="true" />

      <p role="status" aria-live="polite" className="sr-only">
        {srAnnouncement}
      </p>

      <div className="relative z-10 w-full flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {stage === 'dialling' && (
          <motion.p
            key="dialling"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-pixel text-xs sm:text-sm animate-pulse"
          >
            DIALLING POLICE…
          </motion.p>
        )}

        {stage === 'intro' && (
          <motion.p
            key="intro"
            aria-hidden="true"
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
            <div className="pixel-border bg-l4panel p-4" aria-hidden="true">
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
                  <PixelButton key={opt.id} className="w-full" onClick={() => selectOption(opt.id)}>
                    {opt.label}
                  </PixelButton>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
