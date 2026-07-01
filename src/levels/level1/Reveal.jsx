import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PixelButton from '../../components/PixelButton.jsx'
import { BIAS_CARDS } from './data.js'
import { play } from '../../audio/sounds.js'

// Calm, quiet contrast to the chaos of play. Each bias is named, the exact
// moment is shown, one sentence per line - never generic.
export default function Reveal({ results, success, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  const cards = [
    { key: 'salience', outcome: results.salience },
    { key: 'socialProof', outcome: results.socialProof },
    { key: 'framing', outcome: results.framing },
  ]

  return (
    <div className="h-full w-full bg-[#0D0D0D] text-white flex flex-col items-center px-5 py-8 sm:px-10 overflow-y-auto">
      <h1 className="font-pixel text-sm sm:text-base tracking-wide text-l1-text">LEVEL 1 — REVEAL</h1>

      <div className="flex flex-col gap-5 mt-8 w-full max-w-md">
        {cards.map(({ key, outcome }, i) => (
          <BiasCard key={key} data={BIAS_CARDS[key]} outcome={outcome} delay={i * 0.3} />
        ))}
      </div>

      <div className="mt-10 mb-6">
        {success ? (
          <PixelButton className="!border-white !text-white" onClick={onNext}>
            NEXT
          </PixelButton>
        ) : (
          <PixelButton className="!border-white !text-white" onClick={onRetry}>
            TRY AGAIN
          </PixelButton>
        )}
      </div>
    </div>
  )
}

// Neon-glow card, matching the shared src/components/BiasCard.jsx look —
// kept as a local component because this screen's data shape (data.escaped
// / data.fell keyed by outcome string) differs slightly from the shared
// component's (fellFor boolean + lines array).
const GLOW = { escaped: '#44FF88', caught: '#FF4D4D' }

function BiasCard({ data, outcome, delay }) {
  const escaped = outcome === 'escaped'
  const lines = escaped ? data.escaped : data.fell
  const glow = escaped ? GLOW.escaped : GLOW.caught

  useEffect(() => {
    const t = setTimeout(() => play(escaped ? 'biasEscaped' : 'biasCaught'), delay * 1000 + 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="border-2 rounded-xl px-4 py-4 bg-black/40"
      style={{ borderColor: glow, boxShadow: `0 0 6px ${glow}, 0 0 18px ${glow}66` }}
    >
      <div className="flex items-center justify-between mb-2 gap-3">
        <span className="font-pixel text-[11px] sm:text-xs">{data.name}</span>
        <span
          className="font-pixel text-[9px] sm:text-[10px] px-2 py-1 rounded-md border shrink-0"
          style={{ color: glow, borderColor: glow }}
        >
          {escaped ? '✓ ESCAPED' : '✗ FELL FOR IT'}
        </span>
      </div>
      {lines.map((line) => (
        <p key={line} className="font-mono text-sm leading-relaxed text-white/85">
          {line}
        </p>
      ))}
    </motion.div>
  )
}
