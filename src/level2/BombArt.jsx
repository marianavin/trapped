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
  const stickH = 36
  const frontY = [34, 62, 90]
  const backY = [44, 72]
  const backX = bx + 18
  const backW = stickW - 36
  const tx = bx + stickW / 2 - 44
  const ty = 53
  const tw = 88
  const th = 54
  const faceX = tx + 4
  const faceY = ty + 8
  const faceW = tw - 8
  const faceH = th - 14
  const ropeY = frontY[0] - 8
  const ropeH = frontY[2] + stickH - ropeY + 12
  const wireY = frontY.map((y) => y + Math.round(stickH / 2))
  const cutLeft = bx + 24
  const cutRight = bx + stickW - 20

  const contentTop = frontY[0] - 10
  const contentBottom = ropeY + ropeH
  const contentH = contentBottom - contentTop
  const viewPad = 28
  const actionStripH = 52
  const viewH = contentH + viewPad * 2 + actionStripH
  const offsetY = viewPad - contentTop
  const shift = (y) => y + offsetY
  const btnW = 208
  const btnH = 20
  const btnX = (320 - btnW) / 2
  const actionsBottom = viewH - viewPad
  const cutBtnY = actionsBottom - btnH

  return {
    bx,
    stickW,
    stickH,
    frontY: frontY.map(shift),
    backY: backY.map(shift),
    backX,
    backW,
    tx,
    ty: shift(ty),
    tw,
    th,
    faceX,
    faceY: shift(faceY),
    faceW,
    faceH,
    ropeY: shift(ropeY),
    ropeH,
    wireY: wireY.map(shift),
    cutLeft,
    cutRight,
    viewH,
    btnW,
    btnH,
    btnX,
    cutBtnY,
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
  const { tx, ty, tw, th, bx, stickW, wireY, cutLeft, cutRight } = L
  const y = wireY[index]
  const labelX = 28
  const endX = bx + stickW + 20
  const cutGap = 22
  const cutX = index === 1 ? cutRight : cutLeft
  const half = cutGap / 2

  const base = { labelX, labelY: y, cutX, cutY: y, cutGap }

  if (index === 0) {
    return {
      ...base,
      d: `M ${tx + 8} ${ty + 14} L ${labelX + 14} ${y} L ${endX} ${y}`,
      dLeft: `M ${tx + 8} ${ty + 14} L ${labelX + 14} ${y} L ${cutX - half} ${y}`,
      dRight: `M ${cutX + half} ${y} L ${endX} ${y}`,
    }
  }
  if (index === 1) {
    return {
      ...base,
      d: `M ${tx + tw - 8} ${ty + 24} L ${labelX + 14} ${y} L ${endX} ${y}`,
      dLeft: `M ${tx + tw - 8} ${ty + 24} L ${labelX + 14} ${y} L ${cutX - half} ${y}`,
      dRight: `M ${cutX + half} ${y} L ${endX} ${y}`,
    }
  }
  return {
    ...base,
    d: `M ${tx + tw / 2} ${ty + th} L ${tx + tw / 2} ${y} L ${labelX + 14} ${y} L ${endX} ${y}`,
    dLeft: `M ${tx + tw / 2} ${ty + th} L ${tx + tw / 2} ${y} L ${labelX + 14} ${y} L ${cutX - half} ${y}`,
    dRight: `M ${cutX + half} ${y} L ${endX} ${y}`,
  }
}

function wireStroke(path, wire, dash, shadow = false) {
  return (
    <path
      d={path}
      fill="none"
      stroke={shadow ? C.black : wire.color}
      strokeWidth={shadow ? 9 : 6}
      strokeLinecap="square"
      strokeDasharray={dash}
      opacity={shadow ? 0.25 : 1}
    />
  )
}

function WireCutOverlay({ wire, index }) {
  const { cutX, cutY, cutGap } = wirePath(index)
  const halfGap = cutGap / 2

  return (
    <g pointerEvents="none" aria-hidden="true">
      <rect x={cutX - halfGap - 8} y={cutY - 4} width={7} height={8} fill={wire.color} stroke={C.black} strokeWidth={2} />
      <rect x={cutX - halfGap - 5} y={cutY - 1} width={4} height={2} fill="#C9A227" />
      <rect x={cutX + halfGap + 1} y={cutY - 4} width={7} height={8} fill={wire.color} stroke={C.black} strokeWidth={2} />
      <rect x={cutX + halfGap + 2} y={cutY - 1} width={4} height={2} fill="#C9A227" />
      <line x1={cutX - halfGap - 6} y1={cutY - 6} x2={cutX + halfGap + 6} y2={cutY + 6} stroke={C.black} strokeWidth={2} />
      <line x1={cutX - halfGap - 6} y1={cutY + 6} x2={cutX + halfGap + 6} y2={cutY - 6} stroke="#FF3131" strokeWidth={2} />
    </g>
  )
}

function WireGraphics({ wire, index, isSelected }) {
  const { d, dLeft, dRight, labelX, labelY } = wirePath(index)
  const dash = wireDash(wire.pattern)

  return (
    <g pointerEvents="none" aria-hidden="true" opacity={isSelected ? 0.92 : 1}>
      {isSelected ? (
        <>
          {wireStroke(dLeft, wire, dash, true)}
          {wireStroke(dLeft, wire, dash)}
          {wireStroke(dRight, wire, dash, true)}
          {wireStroke(dRight, wire, dash)}
        </>
      ) : (
        <>
          {wireStroke(d, wire, dash, true)}
          {wireStroke(d, wire, dash)}
        </>
      )}
      <rect
        x={labelX - 10}
        y={labelY - 9}
        width={20}
        height={16}
        fill={C.labelBg}
        stroke={C.black}
        strokeWidth={2}
        opacity={isSelected ? 0.55 : 1}
      />
      <text
        x={labelX}
        y={labelY + 3}
        textAnchor="middle"
        className="font-pixel"
        fontSize={8}
        fill={C.labelText}
        opacity={isSelected ? 0.55 : 1}
      >
        {wire.shortLabel}
      </text>
      {isSelected && (
        <line x1={labelX - 8} y1={labelY + 1} x2={labelX + 8} y2={labelY + 1} stroke="#FF3131" strokeWidth={2} />
      )}
    </g>
  )
}

function WireSegmentHit({ wire, index, clickable, selected, onClick }) {
  if (!clickable) return null

  const { bx, stickW, wireY } = L
  const y = wireY[index]
  const startX = 44

  function activate(e) {
    e.stopPropagation()
    onClick(wire.id)
  }

  return (
    <line
      role="radio"
      aria-checked={selected}
      aria-label={`Cut ${wire.label}`}
      x1={startX}
      y1={y}
      x2={bx + stickW}
      y2={y}
      stroke="transparent"
      strokeWidth={8}
      strokeLinecap="round"
      onClick={activate}
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
    />
  )
}

function WireLabelHit({ wire, index, clickable, selected, onClick }) {
  if (!clickable) return null

  const { labelX, labelY } = wirePath(index)
  const aria = `Cut ${wire.label}${wire.pattern === 'stripe' ? ', striped texture' : wire.pattern === 'dotted' ? ', dotted texture' : ', solid texture'}`

  function activate(e) {
    e.stopPropagation()
    onClick(wire.id)
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(wire.id)
    }
  }

  return (
    <rect
      role="radio"
      tabIndex={0}
      aria-checked={selected}
      aria-label={aria}
      x={labelX - 10}
      y={labelY - 9}
      width={20}
      height={16}
      fill="transparent"
      onClick={activate}
      onKeyDown={onKeyDown}
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
    />
  )
}

function SvgActionButton({ x, y, width, height, label, variant, fontSize = 8, onClick }) {
  const border = variant === 'danger' ? C.timerUrgent : '#00F0FF'
  const text = variant === 'danger' ? C.timerUrgent : '#00F0FF'

  function activate(e) {
    e.stopPropagation()
    onClick?.()
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={onKeyDown}
      style={{ cursor: 'pointer', pointerEvents: 'all' }}
    >
      <rect x={x} y={y} width={width} height={height} fill="rgba(0,0,0,0.4)" stroke={C.black} strokeWidth={2} />
      <rect x={x + 2} y={y + 2} width={width - 4} height={height - 4} fill="rgba(0,0,0,0.25)" stroke={border} strokeWidth={2} />
      <text
        x={x + width / 2}
        y={y + height / 2 + 3}
        textAnchor="middle"
        className="font-pixel"
        fontSize={fontSize}
        fill={text}
      >
        {label}
      </text>
    </g>
  )
}

export default function BombArt({
  mm,
  ss,
  urgent,
  wires = [],
  selectedWireId,
  wiresClickable,
  onWireClick,
  showConfirmWire,
  onConfirmWire,
  showCutNow,
  onCutNow,
}) {
  const {
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
    viewH,
    btnW,
    btnH,
    btnX,
    cutBtnY,
  } = L

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
        <WireGraphics key={w.id} wire={w} index={i} isSelected={w.id === selectedWireId} />
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

      {/* cut marks on top of timer so they stay visible */}
      {wires.map((w, i) =>
        w.id === selectedWireId ? <WireCutOverlay key={`cut-${w.id}`} wire={w} index={i} /> : null,
      )}

      {/* hit targets on top — segment first, then labels so letters stay precise */}
      <g role="radiogroup" aria-label="Choose a wire to cut">
        {wires.map((w, i) => (
          <WireSegmentHit
            key={`seg-${w.id}`}
            wire={w}
            index={i}
            clickable={wiresClickable}
            selected={w.id === selectedWireId}
            onClick={onWireClick}
          />
        ))}
        {wires.map((w, i) => (
          <WireLabelHit
            key={`label-${w.id}`}
            wire={w}
            index={i}
            clickable={wiresClickable}
            selected={w.id === selectedWireId}
            onClick={onWireClick}
          />
        ))}
      </g>

      <g pointerEvents="none" aria-hidden="true">
        <rect x={bx + 8} y={frontY[0] - 10} width={4} height={8} fill={C.black} />
        <rect x={bx + stickW - 12} y={frontY[0] - 10} width={4} height={8} fill={C.black} />
      </g>

      {(showConfirmWire || showCutNow) && (
        <g aria-label="Defusal actions">
          {showConfirmWire && (
            <SvgActionButton
              x={btnX}
              y={cutBtnY}
              width={btnW}
              height={btnH}
              label="CONFIRM SELECTED WIRE"
              variant="primary"
              fontSize={7}
              onClick={onConfirmWire}
            />
          )}
          {showCutNow && (
            <SvgActionButton
              x={btnX}
              y={cutBtnY}
              width={btnW}
              height={btnH}
              label="CUT NOW"
              variant="danger"
              onClick={onCutNow}
            />
          )}
        </g>
      )}
    </svg>
  )
}
