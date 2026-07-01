import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PixelButton from '../../components/PixelButton.jsx'
import BiasCard from '../../components/BiasCard.jsx'
import { BIAS_CARDS, TASK_ORDER } from './data.js'
import { play } from '../../audio/sounds.js'

export default function Reveal({ results, outcome, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  const cards = TASK_ORDER.map((key) => ({ key, outcome: results[key] }))
  const escapedCount = cards.filter((c) => c.outcome === 'escaped').length

  return (
    <div className="h-full w-full bg-l3-bg text-l4text flex flex-col items-center px-5 py-8 sm:px-10 overflow-y-auto">
      <h1 className="font-pixel text-sm sm:text-base tracking-widest text-accent-cyan glitch-shift">LEVEL 2 — REVEAL</h1>
      <p className={`font-mono text-sm mt-2 ${escapedCount >= cards.length / 2 ? 'text-escaped' : 'text-caught'}`}>
        {escapedCount} / {cards.length} escaped
      </p>

      <div className="flex flex-col gap-5 mt-6 w-full max-w-md">
        {cards.map(({ key, outcome: cardOutcome }, i) => {
          const data = BIAS_CARDS[key]
          const escaped = cardOutcome === 'escaped'
          return (
            <BiasCard
              key={key}
              index={i}
              name={data.name}
              subtitle={data.subtitle}
              fellFor={!escaped}
              lines={escaped ? data.escaped : data.fell}
            />
          )
        })}
      </div>

      <div className="mt-10 mb-6">
        {outcome === 'fail' ? (
          <PixelButton variant="danger" onClick={onRetry}>
            TRY AGAIN
          </PixelButton>
        ) : (
          <PixelButton variant="primary" onClick={onNext}>
            NEXT
          </PixelButton>
        )}
      </div>
    </div>
  )
}
