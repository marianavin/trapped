import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Typewriter from '../../components/Typewriter.jsx'
import PixelButton from '../../components/PixelButton.jsx'
import StreetBackdrop from './StreetBackdrop.jsx'
import { BYSTANDER_LINE, SIGN_TEXT, BYSTANDER_ADDRESS, SIGN_ADDRESS } from './data.js'
import { play } from '../../audio/sounds.js'

const IDLE_ADVANCE_MS = 6000

// Act 1 — anchoring. The bystander's line lands first and silently sets the
// reported address. The sign arrives a beat later and can overwrite it, but
// only if the player actively taps it. Doing nothing keeps the anchor.
// There is no "which address is correct?" prompt - the game never explains
// itself during play. The decision is just: did you touch the sign or not.
export default function Act1Location({ onProceed }) {
  const [address, setAddress] = useState(null)
  const [signVisible, setSignVisible] = useState(false)
  const [callReady, setCallReady] = useState(false)
  const [signConfirmed, setSignConfirmed] = useState(false)
  const proceededRef = useRef(false)

  const proceed = (finalAddress) => {
    if (proceededRef.current) return
    proceededRef.current = true
    onProceed(finalAddress ?? address ?? BYSTANDER_ADDRESS)
  }

  useEffect(() => {
    if (!signVisible) return
    const t = setTimeout(() => proceed(), IDLE_ADVANCE_MS)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signVisible, address])

  const handleBystanderDone = () => {
    setAddress(BYSTANDER_ADDRESS)
    setCallReady(true)
    setTimeout(() => setSignVisible(true), 1100)
  }

  const handleSignTap = () => {
    setAddress(SIGN_ADDRESS)
    setSignConfirmed(true)
    play('keyClick')
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-l3-bg">
      <StreetBackdrop />
      {/* dims the busier backdrop so foreground text/UI stays the clear focal point */}
      <div className="absolute inset-0 bg-l3-bg/55" aria-hidden="true" />

      <div className="relative z-10 h-full w-full flex flex-col px-5 py-8 sm:px-10">
        <div className="font-pixel text-[10px] text-l3-prompt">
          LOCATION: <span className="text-white">{address ?? '—'}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="w-full max-w-sm border-2 border-white/70 bg-black/50 px-4 py-4">
            <p className="font-mono text-l3-label text-sm sm:text-base min-h-[3em]">
              <Typewriter text={BYSTANDER_LINE} speed={26} onDone={handleBystanderDone} />
            </p>
          </div>

          <AnimatePresence>
            {signVisible && (
              <motion.button
                type="button"
                onClick={handleSignTap}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`font-mono text-sm sm:text-base px-4 py-3 border-2 w-full max-w-sm text-left bg-l3-bg/80
                  ${signConfirmed ? 'border-l3-success text-l3-success' : 'border-white/50 text-l3-prompt'}`}
              >
                {SIGN_TEXT}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center pb-4">
          <PixelButton variant="prompt" disabled={!callReady} onClick={() => proceed()}>
            CALL NOW
          </PixelButton>
        </div>
      </div>
    </div>
  )
}
