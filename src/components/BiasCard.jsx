import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { play } from '../audio/sounds.js'

const GLOW = {
  escaped: '#8899FF',
  caught: '#FF3131',
}

export default function BiasCard({ name, fellFor, lines, index, subtitle, info }) {
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
      className="border-2 rounded-sm bg-black/40 p-4 flex flex-col gap-2 text-white"
      style={{ borderColor: glow, boxShadow: `0 0 4px ${glow}, 0 0 16px ${glow}66` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-pixel text-[10px] sm:text-[11px] inline-flex items-center gap-x-2 leading-none">
            {info && (
              <span className="group relative inline-flex shrink-0 -translate-y-px">
                <span
                  className="inline-flex h-[12px] w-[12px] sm:h-[13px] sm:w-[13px] cursor-help items-center justify-center rounded-full border font-mono text-[10px] sm:text-[11px] leading-none transition-opacity group-hover:opacity-80 group-focus-within:opacity-80"
                  style={{ borderColor: glow, color: glow }}
                  tabIndex={0}
                  role="img"
                  aria-label="What is this bias?"
                >
                  i
                </span>
                <span
                  className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-30 w-56 rounded-md border bg-l3-bg px-3 py-2 font-mono text-[10px] leading-relaxed text-l3-label opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-64 sm:text-xs"
                  style={{ borderColor: `${glow}66`, boxShadow: `0 0 12px ${glow}33` }}
                  role="tooltip"
                >
                  {info}
                </span>
              </span>
            )}
            <span className="text-neutral-400">Bias:</span>
            <span className="text-white">{name}</span>
          </h3>
          {subtitle && (
            <p className="font-mono text-[10px] sm:text-xs text-white/50 mt-1">{subtitle}</p>
          )}
        </div>
        <span
          className="font-pixel text-[7px] sm:text-[8px] shrink-0 inline-flex items-center gap-1 opacity-90"
          style={{ color: glow }}
        >
          <span aria-hidden="true" className="font-sans text-[10px] sm:text-xs font-bold leading-none">
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
