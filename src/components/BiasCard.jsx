import { motion } from 'framer-motion'

export default function BiasCard({ name, fellFor, lines, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.35, delay: index * 0.3 }}
      className="bg-revealbg text-revealtext pixel-border p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-pixel text-[11px] sm:text-xs">{name}</h3>
        <span
          className={[
            'font-pixel text-[10px] px-2 py-1',
            fellFor ? 'text-caught' : 'text-escaped',
          ].join(' ')}
        >
          {fellFor ? '✗ FELL FOR IT' : '✓ ESCAPED'}
        </span>
      </div>
      <div className="font-mono text-xs sm:text-sm leading-relaxed">
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </motion.div>
  )
}
