import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { play } from '../audio/sounds.js'

// Neon-glow reveal card: dark panel, rounded corners, border+glow colored
// by outcome (mint/cyan glow when escaped, red glow when fell for it) —
// the border color is set inline rather than via a currentColor trick so
// the glow always matches the status regardless of surrounding text color.
const GLOW = {
  escaped: '#2DE8FF',
  caught: '#FF4477',
}

export default function BiasCard({ name, fellFor, lines, index }) {
  const glow = fellFor ? GLOW.caught : GLOW.escaped

  useEffect(() => {
    const t = setTimeout(() => play(fellFor ? 'biasCaught' : 'biasEscaped'), index * 300 + 150)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay: index * 0.3 }}
      className="bg-black/40 text-white border-2 rounded-xl p-4 flex flex-col gap-2"
      style={{ borderColor: glow, boxShadow: `0 0 6px ${glow}, 0 0 18px ${glow}66` }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-pixel text-[11px] sm:text-xs">{name}</h3>
        <span
          className="font-pixel text-[9px] sm:text-[10px] px-2 py-1 rounded-md border shrink-0 inline-flex items-center gap-1.5"
          style={{ color: glow, borderColor: glow }}
        >
          {/* Press Start 2P has no ✗/✓ glyphs, so the browser fell back to a
              thin default-font symbol that read as near-invisible next to
              the bold pixel label — sized and weighted independently here,
              and hidden from screen readers since the text already says it. */}
          <span aria-hidden="true" className="font-sans text-sm sm:text-base font-bold leading-none">
            {fellFor ? '✗' : '✓'}
          </span>
          {fellFor ? 'FELL FOR IT' : 'ESCAPED'}
        </span>
      </div>
      <div className="font-mono text-xs sm:text-sm leading-relaxed text-white/85">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </motion.div>
  )
}
