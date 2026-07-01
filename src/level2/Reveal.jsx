import { useEffect } from 'react'
import { BIAS_CARDS } from '../data/level2.js'
import BiasCard from '../components/BiasCard.jsx'
import { RevealActions, RevealScreen } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

const BIAS_ORDER = ['labelSignifier', 'authority', 'confirmation']

export default function Reveal({ success, results, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  return (
    <RevealScreen
      title="LEVEL 1 — REVEAL"
      actions={<RevealActions success={success} onNext={onNext} onRetry={onRetry} />}
    >
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
    </RevealScreen>
  )
}
