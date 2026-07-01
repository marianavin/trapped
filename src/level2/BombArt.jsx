import { motion } from 'framer-motion'

const C = {
  bg: '#1a0e1c',
  black: '#0A0A0A',
  stick: '#C42A2A',
  stickHi: '#E84545',
  stickLo: '#7B1A1A',
  stickCap: '#9A2222',
  rope: '#B8956A',
  ropeHi: '#D4B88A',
  ropeLo: '#8A7048',
  strap: '#1A1A1A',
  strapHi: '#333333',
  timerBody: '#2A2A2A',
  timerFace: '#0A0A0A',
  timerDigit: '#FF00FF',
  timerUrgent: '#FF3131',
  labelBg: '#1A1A3A',
  labelText: '#E8F8FF',
}

function buildLayout() {
  const bx = 52
  const stickW = 216
  const stickH = 20
  const frontY = [40, 62, 84]
  const backY = [50, 72]
  const backX = bx + 18
  const backW = stickW - 36
  const tx = bx + stickW / 2 - 44
  const ty = 50
  const tw = 88
  const th = 54
  const faceX = tx + 4
  const faceY = ty + 8
  const faceW = tw - 8
  const faceH = th - 14
  const ropeY = frontY[0] - 8
  const ropeH = frontY[2] + stickH - ropeY + 12
  const wireY = [58, 76, 94]
  const viewH = 208

  return {
    bx,
    stickW,
    stickH,
    frontY,
    backY,
    backX,
    backW,
    tx,
    ty,
    tw,
    th,
    faceX,
    faceY,
    faceW,
    faceH,
    ropeY,
    ropeH,
    wireY,
    viewH,
  }
}

const L = buildLayout()

function Stick({ x, y, w, h, dim = false }) {
  return (
    <g opacity={dim ? 0.72 : 1}>
      <rect x={x} y={y} width={w} height={h} fill={C.stick} stroke={C.black} strokeWidth={2} />
      <rect x={x + 4} y={y + 2} width={w - 8} height={3} fill={C.stickHi} />
      <rect x={x + 4} y={y + h - 5} width={w - 8} height={3} fill={C.stickLo} />
      <rect x={x} y={y} width={5} height={h} fill={C.stickCap} />
      <rect x={x + w - 5} y={y} width={5} height={h} fill={C.stickLo} />
    </g>
  )
}

function RopeColumn({ x, y, h }) {
  const steps = Math.floor(h / 8)
  return (
    <g pointerEvents="none" aria-hidden="true">
      <rect x={x - 3} y={y} width={16} height={h} fill={C.strap} stroke={C.black} strokeWidth={2} />
      <rect x={x - 1} y={y + 2} width={3} height={h - 4} fill={C.strapHi} opacity={0.5} />
      <rect x={x + 1} y={y} width={10} height={h} fill={C.rope} stroke={C.black} strokeWidth={1} />
      {Array.from({ length: steps }).map((_, i) => (
        <line
          key={i}
          x1={x + 2}
          y1={y + 4 + i * 8}
          x2={x + 10}
          y2={y + 8 + i * 8}
          stroke={i % 2 === 0 ? C.ropeHi : C.ropeLo}
          strokeWidth={2}
        />
      ))}
    </g>
  )
}

function wireDash(pattern) {
  if (pattern === 'stripe') return '10 4'
  if (pattern === 'dotted') return '3 5'
  return undefined
}

function wirePath(index) {
  const { tx, ty, tw, th, bx, stickW, wireY } = L
  const y = wireY[index]
  const labelX = 28
  const endX = bx + stickW + 20

  if (index === 0) {
    return {
      d: `M ${tx + 8} ${ty + 14} L ${labelX + 14} ${y} L ${endX} ${y}`,
      labelX,
      labelY: y,
      cutX: bx + stickW / 2,
      cutY: y,
    }
  }
  if (index === 1) {
    return {
      d: `M ${tx + tw - 8} ${ty + 24} L ${labelX + 14} ${y} L ${endX} ${y}`,
      labelX,
      labelY: y,
      cutX: bx + stickW - 36,
      cutY: y,
    }
  }
  return {
    d: `M ${tx + tw / 2} ${ty + th} L ${tx + tw / 2} ${y} L ${labelX + 14} ${y} L ${endX} ${y}`,
    labelX,
    labelY: y,
    cutX: bx + 48,
    cutY: y,
  }
}

function WireGraphics({ wire, index, isCurrent }) {
  const { d, labelX, labelY, cutX, cutY } = wirePath(index)
  const dash = wireDash(wire.pattern)

  return (
    <g pointerEvents="none" aria-hidden="true">
      <path d={d} fill="none" stroke={C.black} strokeWidth={9} strokeLinecap="square" strokeDasharray={dash} opacity={0.25} />
      <path d={d} fill="none" stroke={wire.color} strokeWidth={6} strokeLinecap="square" strokeDasharray={dash} />
      <rect x={labelX - 10} y={labelY - 9} width={20} height={16} fill={C.labelBg} stroke={C.black} strokeWidth={2} />
      <text x={labelX} y={labelY + 3} textAnchor="middle" className="font-pixel" fontSize={8} fill={C.labelText}>
        {wire.shortLabel}
      </text>
      {isCurrent && (
        <>
          <rect x={cutX - 4} y={cutY - 4} width={8} height={8} fill={wire.color} stroke={C.black} strokeWidth={1} />
          <text x={cutX - 10} y={cutY - 10} fontSize={9}>
            ✂️
          </text>
        </>
      )}
    </g>
  )
}

function WireHitTarget({ wire, index, clickable, onClick }) {
  const { d, labelX, labelY } = wirePath(index)
  const aria = `Cut ${wire.label}${wire.pattern === 'stripe' ? ', striped texture' : wire.pattern === 'dotted' ? ', dotted texture' : ', solid texture'}`

  function activate(e) {
    if (!clickable) return
    e.stopPropagation()
    onClick(wire.id)
  }

  function onKeyDown(e) {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(wire.id)
    }
  }

  if (!clickable) return null

  const hitStyle = { cursor: 'pointer', pointerEvents: 'all' }

  return (
    <g role="button" tabIndex={0} aria-label={aria} onKeyDown={onKeyDown}>
      <path d={d} fill="none" stroke="transparent" strokeWidth={24} strokeLinecap="round" onClick={activate} style={hitStyle} />
      <rect x={labelX - 14} y={labelY - 12} width={28} height={24} fill="transparent" onClick={activate} style={hitStyle} />
    </g>
  )
}

export default function BombArt({
  mm,
  ss,
  urgent,
  wires = [],
  currentWireId,
  wiresClickable,
  onWireClick,
}) {
  const { bx, stickW, stickH, frontY, backY, backX, backW, tx, ty, tw, th, faceX, faceY, faceW, faceH, ropeY, ropeH, viewH } = L

  return (
    <svg viewBox={`0 0 320 ${viewH}`} className="w-full h-auto block" shapeRendering="crispEdges">
      <defs>
        <pattern id="bombGrid" width={16} height={16} patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(0,240,255,0.06)" strokeWidth={1} />
        </pattern>
        <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={2} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="timerFaceClip">
          <rect x={L.faceX} y={L.faceY} width={L.faceW} height={L.faceH} />
        </clipPath>
      </defs>

      <rect width={320} height={viewH} fill={C.bg} />
      <rect width={320} height={viewH} fill="url(#bombGrid)" />

      {/* dynamite — behind wires */}
      <g aria-hidden="true">
        <Stick x={backX} y={backY[0]} w={backW} h={stickH} dim />
        <Stick x={backX} y={backY[1]} w={backW} h={stickH} dim />
        {frontY.map((y) => (
          <Stick key={y} x={bx} y={y} w={stickW} h={stickH} />
        ))}
      </g>

      {/* wires draped over the bundle */}
      {wires.map((w, i) => (
        <WireGraphics key={w.id} wire={w} index={i} isCurrent={w.id === currentWireId} />
      ))}

      <RopeColumn x={bx - 14} y={ropeY} h={ropeH} />
      <RopeColumn x={bx + stickW + 4} y={ropeY} h={ropeH} />

      <g pointerEvents="none" aria-hidden="true">
        <rect x={tx - 8} y={ty - 4} width={10} height={th + 8} fill={C.strap} stroke={C.black} strokeWidth={2} />
        <rect x={tx + tw - 2} y={ty - 4} width={10} height={th + 8} fill={C.strap} stroke={C.black} strokeWidth={2} />

        <rect x={tx} y={ty} width={tw} height={th} fill={C.timerBody} stroke={C.black} strokeWidth={2} />
        <rect x={tx + 2} y={ty + 2} width={tw - 4} height={3} fill={C.strapHi} opacity={0.55} />
        <rect x={faceX} y={faceY} width={faceW} height={faceH} fill={C.timerFace} stroke={C.black} strokeWidth={2} />
      </g>

      <g clipPath="url(#timerFaceClip)" pointerEvents="none">
        <motion.text
          x={faceX + faceW / 2}
          y={faceY + faceH / 2 + 4}
          textAnchor="middle"
          className="font-pixel tabular-nums"
          fontSize={13}
          fill={urgent ? C.timerUrgent : C.timerDigit}
          filter="url(#ledGlow)"
          animate={{ scale: urgent ? [1, 1.08, 1] : 1 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          transition={{ duration: 0.35, repeat: urgent ? Infinity : 0 }}
        >
          {mm}:{ss}
        </motion.text>
      </g>

      {/* hit targets on top so ropes/timer never block label clicks */}
      {wires.map((w, i) => (
        <WireHitTarget
          key={`hit-${w.id}`}
          wire={w}
          index={i}
          clickable={wiresClickable}
          onClick={onWireClick}
        />
      ))}

      <g pointerEvents="none" aria-hidden="true">
        <rect x={bx + 8} y={frontY[0] - 10} width={4} height={8} fill={C.black} />
        <rect x={bx + stickW - 12} y={frontY[0] - 10} width={4} height={8} fill={C.black} />
      </g>
    </svg>
  )
}
