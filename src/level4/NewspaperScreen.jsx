import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { NEWSPAPER } from '../data/level4.js'
import PixelButton from '../components/PixelButton.jsx'
import { play } from '../audio/sounds.js'

// Act 2 — the newspaper. The bridge between witnessing the accident and
// calling it in. Mechanically, this is where the wrong story (dark sedan,
// fled north) gets planted first — not by an officer's leading question,
// but by a public report the player reads as settled fact before anyone
// has asked them anything. Real eyewitness contamination usually starts
// exactly like this: other people's account arrives before your own does.
// No timer here — the pressure in this beat is quiet, not urgent.
export default function NewspaperScreen({ onProceed }) {
  useEffect(() => {
    play('paperRustle')
  }, [])

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-l4bg px-6 py-10 gap-8">
      <motion.div
        initial={{ opacity: 0, y: 14, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-reveal-bg text-reveal-text border-2 border-reveal-text/70 px-5 py-6 relative"
      >
        {/* torn corner — a printed artifact dropped into a night scene, not
            more night-scene dressing */}
        <div
          className="absolute -top-2 -right-2 w-6 h-6 bg-l4bg"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
          aria-hidden="true"
        />

        <p className="font-pixel text-[9px] tracking-widest text-reveal-text/60 mb-2">
          {NEWSPAPER.kicker} · {NEWSPAPER.date}
        </p>
        <h1 className="font-pixel text-sm sm:text-base leading-relaxed mb-4">{NEWSPAPER.headline}</h1>
        <div className="font-mono text-xs sm:text-sm leading-relaxed flex flex-col gap-2">
          {NEWSPAPER.body.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <PixelButton variant="dark" onClick={onProceed}>
          {NEWSPAPER.cta}
        </PixelButton>
      </motion.div>
    </div>
  )
}
