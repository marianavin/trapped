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
    <div className="h-full w-full bg-reveal-bg text-reveal-text flex flex-col items-center px-5 py-8 sm:px-10 overflow-y-auto">
      <h1 className="font-pixel text-sm sm:text-base tracking-wide">LEVEL 1 — REVEAL</h1>

      <div className="flex flex-col gap-5 mt-8 w-full max-w-md">
        {cards.map(({ key, outcome }, i) => (
          <BiasCard key={key} data={BIAS_CARDS[key]} outcome={outcome} delay={i * 0.3} />
        ))}
      </div>

      <div className="mt-10 mb-6">
        {success ? (
          <PixelButton
            className="!border-reveal-text !text-reveal-text hover:!bg-reveal-text hover:!text-reveal-bg"
            onClick={onNext}
          >
            NEXT
          </PixelButton>
        ) : (
          <PixelButton
            className="!border-reveal-text !text-reveal-text hover:!bg-reveal-text hover:!text-reveal-bg"
            onClick={onRetry}
          >
            TRY AGAIN
          </PixelButton>
        )}
      </div>
    </div>
  )
}

function BiasCard({ data, outcome, delay }) {
  const escaped = outcome === 'escaped'
  const lines = escaped ? data.escaped : data.fell

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
      className="border-2 border-reveal-text px-4 py-4 bg-white"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-pixel text-[11px] sm:text-xs">{data.name}</span>
        <span
          className={`font-pixel text-[11px] sm:text-xs ${
            escaped ? 'text-reveal-escaped' : 'text-reveal-caught'
          }`}
        >
          {escaped ? '✓ ESCAPED' : '✗ FELL FOR IT'}
        </span>
      </div>
      {lines.map((line) => (
        <p key={line} className="font-mono text-sm leading-relaxed">
          {line}
        </p>
      ))}
    </motion.div>
  )
}
