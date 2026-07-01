import { useEffect } from 'react'
import { TRUTH, BIAS_CARDS, buildReport } from '../data/level4.js'
import BiasCard from '../components/BiasCard.jsx'
import PixelButton from '../components/PixelButton.jsx'
import { RevealScreen } from '../components/GameUI.jsx'
import { play } from '../audio/sounds.js'

const BIAS_ORDER = ['misinformation', 'anchoring', 'authority', 'confirmation']

function Row({ label, truth, reported, wrong }) {
  return (
    <div className="grid grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
      <div className="text-l4-muted">{label}</div>
      <div />
      <div className="text-escaped">{truth}</div>
      <div className={`${wrong ? 'text-caught' : 'text-escaped'} inline-flex items-center gap-1`}>
        <span aria-hidden="true" className="font-sans text-base font-bold leading-none">
          {wrong ? '✗' : '✓'}
        </span>
        {reported}
      </div>
    </div>
  )
}

export default function RevealScreenLevel4({ answers, results, onContinue }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  const report = buildReport(answers)

  return (
    <RevealScreen
      title="WHAT YOU SAW VS. WHAT YOU REPORTED"
      actions={
        <PixelButton variant="primary" onClick={onContinue}>
          NEXT
        </PixelButton>
      }
    >
      <div className="flex flex-col gap-2 -mt-2">
        <div className="grid grid-cols-2 gap-3 font-pixel text-[9px] sm:text-[10px] mb-1">
          <div>WHAT HAPPENED</div>
          <div>YOUR REPORT</div>
        </div>
        <Row label="Color" truth={TRUTH.color} reported={report.color} wrong={report.color !== TRUTH.color} />
        <Row label="Driver's shirt" truth={TRUTH.shirt} reported={report.shirt} wrong={report.shirt !== TRUTH.shirt} />
        <Row label="Type" truth={TRUTH.type} reported={report.type} wrong={report.type !== TRUTH.type} />
        <Row label="Direction" truth={TRUTH.direction} reported={report.direction} wrong={report.direction !== TRUTH.direction} />
      </div>

      <p className="font-mono text-sm italic text-center max-w-sm mx-auto">
        "You didn't see a dark car. You agreed to one."
      </p>

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
