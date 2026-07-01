import { useLayoutEffect, useRef, useState } from 'react'
import WindowChrome, { WindowChromeTrail } from './WindowChrome.jsx'

const TRAIL_STEP = 4
const MAX_TRAIL = 26

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function DraggableWindow({
  title,
  tone = 'cyan',
  className = '',
  bodyClassName = '',
  children,
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const windowRef = useRef(null)
  const offsetRef = useRef(offset)
  offsetRef.current = offset

  useLayoutEffect(() => {
    const el = windowRef.current
    if (!el) return

    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  function pushTrail(x, y) {
    if (prefersReducedMotion()) return
    setTrail((prev) => {
      const last = prev[prev.length - 1]
      if (last && Math.hypot(x - last.x, y - last.y) < TRAIL_STEP) return prev
      const next = [...prev, { x, y }]
      return next.length > MAX_TRAIL ? next.slice(-MAX_TRAIL) : next
    })
  }

  function onTitleBarPointerDown(e) {
    if (e.button !== 0) return
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const originX = offsetRef.current.x
    const originY = offsetRef.current.y

    pushTrail(originX, originY)

    function onMove(ev) {
      const x = originX + ev.clientX - startX
      const y = originY + ev.clientY - startY
      setOffset({ x, y })
      pushTrail(x, y)
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      setTimeout(() => setTrail([]), 80)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className={`relative w-full ${className}`}>
      {trail.map((point, i) => (
        <WindowChromeTrail
          key={`${point.x}-${point.y}-${i}`}
          title={title}
          tone={tone}
          className="absolute left-0 top-0"
          style={{
            width: size.w || '100%',
            height: size.h || undefined,
            transform: `translate(${point.x}px, ${point.y}px)`,
            opacity: 0.2 + (i / Math.max(trail.length - 1, 1)) * 0.55,
          }}
        />
      ))}

      <div
        ref={windowRef}
        className="relative z-10 touch-none"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        <WindowChrome
          title={title}
          tone={tone}
          className="w-full"
          bodyClassName={bodyClassName}
          titleBarClassName="cursor-grab active:cursor-grabbing"
          onTitleBarPointerDown={onTitleBarPointerDown}
        >
          {children}
        </WindowChrome>
      </div>
    </div>
  )
}
