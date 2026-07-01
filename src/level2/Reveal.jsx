import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { BIAS_CARDS } from '../data/level2.js'
import BiasCard from '../components/BiasCard.jsx'
import PixelButton from '../components/PixelButton.jsx'
import { play } from '../audio/sounds.js'

const BIAS_ORDER = ['labelSignifier', 'authority', 'confirmation']

// Calm, quiet contrast to the chaos of play. Each bias is named, the exact
// moment is shown, one sentence per line - never generic.
export default function Reveal({ success, results, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  return (
    <div className="h-full w-full overflow-y-auto bg-l2-bg text-white px-5 py-8 flex flex-col items-center gap-8">
      <h2 className="font-pixel text-sm sm:text-base text-center text-l2-text">LEVEL 1 — REVEAL</h2>

      <div className="w-full max-w-md flex flex-col gap-4">
        {BIAS_ORDER.map((key, i) => {
          const fellFor = results[key]
          const card = BIAS_CARDS[key]
          return (
            <BiasCard
              key={key}
              index={i}
              name={card.name}
              fellFor={fellFor}
              lines={fellFor ? card.fellFor : card.escaped}
            />
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        {success ? (
          <PixelButton variant="primary" onClick={onNext}>
            NEXT
          </PixelButton>
        ) : (
          <PixelButton variant="danger" onClick={onRetry}>
            TRY AGAIN
          </PixelButton>
        )}
      </motion.div>
    </div>
  )
}
