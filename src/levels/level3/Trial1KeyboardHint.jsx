import { useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Trial 1 — speech bubble anchored to the keypad key labelled 9.
export default function Trial1KeyboardHint({ anchorRef, containerRef }) {
  const [pos, setPos] = useState(null)

  useLayoutEffect(() => {
    const anchor = anchorRef?.current
    const container = containerRef?.current
    if (!anchor || !container) return

    const update = () => {
      const a = anchor.getBoundingClientRect()
      const c = container.getBoundingClientRect()
      setPos({
        left: a.right - c.left + 12,
        top: a.top - c.top + a.height / 2,
      })
    }

    update()
    window.addEventListener('resize', update)

    const ro = new ResizeObserver(update)
    ro.observe(container)
    ro.observe(anchor)

    return () => {
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [anchorRef, containerRef])

  if (!pos) return null

  return (
    <motion.div
      className="pointer-events-none absolute z-20 origin-left -translate-y-1/2"
      style={{ left: pos.left, top: pos.top }}
      animate={{
        x: [0, 0.4, -0.4, 0.4, -0.4, 0.2, -0.2, 0],
        scale: [1, 1.06, 1],
      }}
      transition={{
        x: { duration: 0.28, repeat: Infinity, ease: 'linear' },
        scale: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      aria-hidden="true"
    >
      <div className="relative">
        <span className="absolute right-full top-1/2 -mr-px block h-0 w-0 -translate-y-1/2 border-y-[8px] border-y-transparent border-r-[10px] border-r-neutral-900" />
        <span className="absolute right-full top-1/2 mr-[2px] block h-0 w-0 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[8px] border-r-white" />
        <div className="whitespace-nowrap rounded-md border-2 border-neutral-900 bg-white px-3 py-1.5 text-sm leading-tight text-neutral-900 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
          Hurry up! <span className="font-bold">991</span>
        </div>
      </div>
    </motion.div>
  )
}
