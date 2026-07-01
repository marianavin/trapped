import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { play } from '../audio/sounds.js'

const GLOW = {
  escaped: '#00F0FF',
  caught: '#FF3131',
}

export default function BiasCard({ name, fellFor, lines, index, subtitle }) {
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
      className="gw-panel-grid text-white border-2 rounded-sm p-4 flex flex-col gap-2"
      style={{ borderColor: glow, boxShadow: `0 0 4px ${glow}, 0 0 16px ${glow}66` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-pixel text-[11px] sm:text-xs">{name}</h3>
          {subtitle && <span className="font-mono text-[10px] sm:text-xs ml-2 text-white/50">{subtitle}</span>}
        </div>
        <span
          className="font-pixel text-[9px] sm:text-[10px] px-2 py-1 rounded-sm border shrink-0 inline-flex items-center gap-1.5"
          style={{ color: glow, borderColor: glow }}
        >
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
