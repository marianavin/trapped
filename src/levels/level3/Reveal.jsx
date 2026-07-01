import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PixelButton from '../../components/PixelButton.jsx'
import { BIAS_CARDS, TASK_ORDER } from './data.js'
import { play } from '../../audio/sounds.js'

// Calm, quiet contrast to the chaos of play. Each bias is named, the exact
// moment is shown, one sentence per line - never generic.
export default function Reveal({ results, outcome, onNext, onRetry }) {
  useEffect(() => {
    play('revealLoad')
  }, [])

  const cards = TASK_ORDER.map((key) => ({ key, outcome: results[key] }))
  const escapedCount = cards.filter((c) => c.outcome === 'escaped').length

  return (
    <div className="h-full w-full bg-[#1A1A2E] text-white flex flex-col items-center px-5 py-8 sm:px-10 overflow-y-auto">
      <h1 className="font-pixel text-sm sm:text-base tracking-wide text-l3-prompt">LEVEL 3 — REVEAL</h1>
      <p className={`font-mono text-sm mt-2 ${escapedCount >= cards.length / 2 ? 'text-l3-prompt' : 'text-accent-magenta'}`}>
        {escapedCount} / {cards.length} escaped
      </p>

      <div className="flex flex-col gap-5 mt-6 w-full max-w-md">
        {cards.map(({ key, outcome }, i) => (
          <BiasCard key={key} data={BIAS_CARDS[key]} outcome={outcome} delay={i * 0.18} />
        ))}
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

// Neon-glow card, matching the shared src/components/BiasCard.jsx look —
// kept as a local component because this screen's data shape (data.escaped
// / data.fell keyed by outcome string) differs slightly from the shared
// component's (fellFor boolean + lines array).
const GLOW = { escaped: '#2DE8FF', caught: '#FF4477' }

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
        <div>
          <span className="font-pixel text-[11px] sm:text-xs">{data.name}</span>
          {data.subtitle && (
            <span className="font-mono text-[10px] sm:text-xs ml-2 text-white/50">{data.subtitle}</span>
          )}
        </div>
        <span
          className="font-pixel text-[9px] sm:text-[10px] px-2 py-1 rounded-md border shrink-0 inline-flex items-center gap-1.5"
          style={{ color: glow, borderColor: glow }}
        >
          {/* icon split out of the pixel font — Press Start 2P has no ✗/✓
              glyphs so it fell back to a tiny thin symbol; sized/weighted
              on its own, aria-hidden since the label text is redundant */}
          <span aria-hidden="true" className="font-sans text-sm sm:text-base font-bold leading-none">
            {escaped ? '✓' : '✗'}
          </span>
          {escaped ? 'ESCAPED' : 'FELL FOR IT'}
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
