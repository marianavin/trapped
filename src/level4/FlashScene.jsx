import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { play } from '../audio/sounds.js'
import { Building } from '../components/PixelArtKit.jsx'

// Act 1 — the accident. 8 seconds, unpausable, unreplayable, no controls.
// Redesigned so every fact the game later interrogates is unambiguously
// perceptible in the moment: the car's silhouette clearly reads as a
// hatchback (short sloped rear, not a sedan's flat trunk), its body is a
// high-contrast silver against the night sky, it travels in one continuous
// direction (screen-right to screen-left = west, matching the compass sign),
// and the driver is visible through the windshield in a distinct amber
// shirt for a full beat before impact. Nothing here is rushed or blurred —
// the bias in this level was never about failing to see clearly. It's about
// what the newspaper and the officer talk the player into reporting instead.
export default function FlashScene({ onDone }) {
  const [phase, setPhase] = useState('establish') // establish -> approach -> impact -> flee
  const doneRef = useRef(false)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('approach'), 900)
    const t2 = setTimeout(() => {
      setPhase('impact')
      play('impactHit')
    }, 4800)
    const t3 = setTimeout(() => setPhase('flee'), 5600)
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

  const driverVisible = phase === 'approach' || phase === 'impact'

  // One continuous leftward line — no direction change at any phase, so
  // "which way did it go" has exactly one honest answer: west.
  const carRight =
    phase === 'establish'
      ? '-14%'
      : phase === 'approach'
      ? '48%'
      : phase === 'impact'
      ? '52%'
      : '104%'

  return (
    <div className="relative h-full w-full overflow-hidden bg-l4bg select-none">
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

        {/* streetlamp glow — stepped squares, no blur — lights the crossing
            so color/shirt read clearly instead of as night silhouettes */}
        <rect x="140" y="196" width="80" height="16" fill="#FFD166" opacity="0.05" />
        <rect x="156" y="204" width="48" height="10" fill="#FFD166" opacity="0.12" />
      </svg>

      {/* compass — the one fixed reference point for direction */}
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
        animate={phase === 'impact' || phase === 'flee' ? { left: '44%', rotate: -12 } : { left: '48%' }}
        transition={{ duration: 0.3 }}
      />

      {/* the car — hatchback silhouette, ground truth: silver, west, amber-shirted driver */}
      <motion.div
        className="absolute bottom-16 h-8 w-20"
        style={{ right: 0 }}
        initial={{ right: '-14%' }}
        animate={{ right: carRight }}
        transition={{ duration: phase === 'approach' ? 3.9 : phase === 'flee' ? 2.4 : 0.5, ease: 'linear' }}
      >
        {/* hatchback body: short, sloped rear (right edge, since travel is
            leftward) distinguishes it from a sedan's flat trunk */}
        <div className="absolute bottom-0 left-0 h-4 w-full bg-l4text" />
        <div className="absolute bottom-4 left-2 h-3 w-[60%] bg-l4text" />
        {/* rear hatch slope — the detail that reads "hatchback, not sedan" */}
        <div className="absolute bottom-4 right-0 h-3 w-2 bg-l4bg" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
        {/* windshield band with driver visible inside */}
        <div className="absolute bottom-[26px] left-2 h-2 w-[46%] bg-l4bg/70" />
        {driverVisible && (
          <div className="absolute bottom-[26px] left-3 h-2 w-2 bg-l4street" aria-hidden="true" />
        )}
        {/* wheels — flat squares, not circles, per the game's pixel-art rule */}
        <div className="absolute -bottom-1 left-3 h-2 w-3 bg-l4panel" />
        <div className="absolute -bottom-1 right-4 h-2 w-3 bg-l4panel" />
      </motion.div>

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
