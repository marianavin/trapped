import { useEffect } from 'react'
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
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-l3-bg px-5 py-6 sm:px-10 flex flex-col items-center text-l4text">
      <h1 className="font-pixel text-sm sm:text-base tracking-widest text-accent-cyan glitch-shift">
        LEVEL 3 — REVEAL
      </h1>
      <p className={`font-mono text-sm mt-2 ${escapedCount >= cards.length / 2 ? 'text-escaped' : 'text-caught'}`}>
        {escapedCount} / {cards.length} escaped
      </p>

      <div className="flex flex-col gap-5 mt-6 w-full max-w-md pb-6">
        {cards.map(({ key, outcome: cardOutcome }, i) => {
          const data = BIAS_CARDS[key]
          const escaped = cardOutcome === 'escaped'
          return (
            <BiasCard
              key={key}
              index={i}
              name={data.name}
              subtitle={data.subtitle}
              info={data.info}
              fellFor={!escaped}
              lines={escaped ? data.escaped : data.fell}
            />
          )
        })}
      </div>

      <div className="mt-4 mb-6">
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
