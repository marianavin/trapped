import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { play } from '../audio/sounds.js'
import { Building } from '../components/PixelArtKit.jsx'

// An 8-second, unpausable, unreplayable scene. No controls of any kind.
// This is the only ground truth the player ever gets — everything the
// dispatcher says afterward is measured against what actually happened here.
export default function FlashScene({ onDone }) {
  const [phase, setPhase] = useState('establish') // establish -> drive -> impact -> exit
  const doneRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('drive'), 900)
    const t2 = setTimeout(() => {
      setPhase('impact')
      play('impactHit')
    }, 4600)
    const t3 = setTimeout(() => setPhase('exit'), 5400)
    const t4 = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        onDone()
      }
    }, 8000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onDone])

  return (
    <div className="relative h-full w-full overflow-hidden bg-l4bg select-none">
      {/* hand-drawn night skyline — flat pixel-art buildings with a window
          grid, replacing the old blurred/rounded CSS glow so this matches
          the same hard-edged style as Level 1/2's art. */}
      <svg
        viewBox="0 0 360 640"
        preserveAspectRatio="none"
        shapeRendering="crispEdges"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="360" height="640" fill="#0A0E1A" />
        <Building x={0} y={200} width={70} height={280} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={0} />
        <Building x={72} y={140} width={54} height={340} body="#22304A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={1} />
        <Building x={128} y={230} width={64} height={250} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={2} />
        <Building x={250} y={170} width={58} height={310} body="#22304A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={1} />
        <Building x={306} y={220} width={54} height={260} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={3} />

        {/* streetlamp glow — stepped squares, no blur */}
        <rect x="164" y="200" width="32" height="32" fill="#FFD166" opacity="0.06" />
        <rect x="172" y="208" width="16" height="16" fill="#FFD166" opacity="0.16" />
      </svg>

      {/* street sign — the one honest clue, easy to miss in 8 seconds */}
      <div className="absolute top-4 left-4 font-pixel text-[9px] text-l4street/80 flex items-center gap-1">
        <span>N</span>
        <span className="text-base leading-none">↑</span>
      </div>

      {/* sidewalk */}
      <div className="absolute bottom-24 left-0 right-0 h-2 bg-l4text/20" />
      {/* road */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-l4panel" />
      <div className="absolute bottom-12 left-0 right-0 h-1 bg-l4text/30 [background-image:repeating-linear-gradient(to_right,currentColor_0,currentColor_20px,transparent_20px,transparent_40px)]" />

      {/* pedestrian */}
      <motion.div
        className="absolute bottom-24 w-3 h-8 bg-l4street"
        initial={{ left: '48%' }}
        animate={
          phase === 'impact' || phase === 'exit' ? { left: '44%', rotate: -12 } : { left: '48%' }
        }
        transition={{ duration: 0.3 }}
      />

      {/* the car — silver, moderate speed, small hatchback silhouette. Ground truth. */}
      <motion.div
        className="absolute bottom-16 h-6 w-14 bg-l4text"
        initial={{ right: '-10%', bottom: '4rem' }}
        animate={
          phase === 'establish'
            ? { right: '-10%' }
            : phase === 'drive'
            ? { right: '46%' }
            : phase === 'impact'
            ? { right: '50%' }
            : { right: '70%', bottom: '2rem', opacity: 0.4 }
        }
        transition={{ duration: phase === 'drive' ? 3.6 : phase === 'exit' ? 2.4 : 0.5, ease: 'linear' }}
      />

      {phase === 'impact' && (
        <motion.div
          className="absolute inset-0 bg-l4flash"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  )
}
