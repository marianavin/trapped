import { useEffect } from 'react'
import PixelButton from '../../components/PixelButton.jsx'
import BiasCard from '../../components/BiasCard.jsx'
import { RevealScreen } from '../../components/GameUI.jsx'
import { BIAS_CARDS, TASK_ORDER } from './data.js'
import { play } from '../../audio/sounds.js'

export default function Reveal({ results, outcome, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  const cards = TASK_ORDER.map((key) => ({ key, outcome: results[key] }))
  const escapedCount = cards.filter((c) => c.outcome === 'escaped').length

  return (
    <RevealScreen
      title="LEVEL 2 — REVEAL"
      subtitle={
        <span className={escapedCount >= cards.length / 2 ? 'text-escaped' : 'text-caught'}>
          {escapedCount} / {cards.length} escaped
        </span>
      }
      actions={
        outcome === 'fail' ? (
          <PixelButton variant="danger" onClick={onRetry}>
            TRY AGAIN
          </PixelButton>
        ) : (
          <PixelButton variant="primary" onClick={onNext}>
            NEXT
          </PixelButton>
        )
      }
    >
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
    </RevealScreen>
  )
}
