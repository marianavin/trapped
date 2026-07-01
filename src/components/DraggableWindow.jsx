import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import WindowChrome, { WindowChromeTrail } from './WindowChrome.jsx'

const TRAIL_STEP = 4
const MAX_DRAG_TRAIL = 40

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Wavy vector path behind the window; index 0 = furthest back. */
function computeWavyTrail(count, step = 5) {
  const points = []
  for (let distance = count; distance >= 1; distance -= 1) {
    const t = distance / count
    const along = distance * step
    const wave = Math.sin(t * Math.PI * 2.75) * step * 3.2
    const ripple = Math.sin(t * Math.PI * 5.5 + 0.6) * step * 0.65
    points.push({
      id: `wavy-${distance}`,
      x: -along + wave * 0.72 + ripple * 0.4,
      y: along + wave * 0.58 + Math.cos(t * Math.PI * 3.25) * step * 0.45,
    })
  }
  return points
}

export default function DraggableWindow({
  title,
  tone = 'cyan',
  className = '',
  bodyClassName = '',
  staticTrailCount = 0,
  staticTrailStep = 4,
  children,
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragTrail, setDragTrail] = useState([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const windowRef = useRef(null)
  const offsetRef = useRef(offset)
  const dragIdRef = useRef(0)
  offsetRef.current = offset

  const wavyTrail = useMemo(
    () => (staticTrailCount > 0 ? computeWavyTrail(staticTrailCount, staticTrailStep) : []),
    [staticTrailCount, staticTrailStep],
  )

  const trailPoints = useMemo(() => [...wavyTrail, ...dragTrail], [wavyTrail, dragTrail])

  useLayoutEffect(() => {
    const el = windowRef.current
    if (!el) return

    const measure = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  function pushDragTrail(x, y) {
    if (prefersReducedMotion()) return
    setDragTrail((prev) => {
      const last = prev[prev.length - 1]
      if (last && Math.hypot(x - last.x, y - last.y) < TRAIL_STEP) return prev
      dragIdRef.current += 1
      const next = [...prev, { id: `drag-${dragIdRef.current}`, x, y }]
      return next.length > MAX_DRAG_TRAIL ? next.slice(-MAX_DRAG_TRAIL) : next
    })
  }

  function onTitleBarPointerDown(e) {
    if (e.button !== 0) return
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const originX = offsetRef.current.x
    const originY = offsetRef.current.y

    pushDragTrail(originX, originY)

    function onMove(ev) {
      const x = originX + ev.clientX - startX
      const y = originY + ev.clientY - startY
      setOffset({ x, y })
      pushDragTrail(x, y)
    }

    function onUp() {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div className={`relative w-full overflow-visible isolate ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        {trailPoints.map((point, i) => (
          <WindowChromeTrail
            key={point.id}
            title={title}
            tone={tone}
            className="absolute left-0 top-0"
            style={{
              width: size.w || '100%',
              height: size.h || undefined,
              zIndex: i + 1,
              transform: `translate(${point.x}px, ${point.y}px)`,
            }}
          />
        ))}
      </div>

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
