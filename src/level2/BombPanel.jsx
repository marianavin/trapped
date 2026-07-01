// Hand-drawn pixel-art bomb device, built as a grid-aligned SVG (flat fills,
// hard edges, shape-rendering="crispEdges", no gradients or smooth curves —
// "rounded" bits like the bolts and battery cap are stepped rectangles, the
// way real pixel-art sprites fake curvature) rather than CSS shapes. The
// switches / logic-gate boxes / side wiring are decorative flavor matching
// the reference composition; the three colored wires between the battery
// and the switch stack are the actual clickable "cut this wire" mechanic.
const C = {
  bodyLight: '#3A5A9A',
  body: '#232659',
  bodyDark: '#12132B',
  black: '#0A0A0A',
  stripeRed: '#FF4477',
  bolt: '#B8D4E8',
  boltDark: '#4A5A8A',
  batteryBody: '#3A3A3A',
  batteryGreen: '#2DE8FF',
  batteryGreenDark: '#0E8FA6',
  wireYellow: '#F2C230',
  wireTip: '#FF4477',
  switchBody: '#232659',
  gateBox: '#EDEDE6',
  gateText: '#1A1A1A',
  ledBg: '#050505',
  led: '#2DE8FF',
  indicatorGreen: '#2DE8FF',
  indicatorRed: '#FF4477',
  bezel: '#3A3D6B',
  bezelDark: '#232659',
  warnYellow: '#F5C518',
}

// A stripe cap made of alternating red/black blocks with pixel-stepped
// (staircase) rounded ends instead of a smooth border-radius.
function StripeCap({ y }) {
  const blocks = []
  const blockW = 18
  for (let x = 44; x < 308; x += blockW) {
    blocks.push(<rect key={x} x={x} y={y} width={blockW - 3} height={10} fill={C.stripeRed} />)
  }
  return (
    <g>
      <rect x={40} y={y} width={272} height={10} fill={C.black} />
      {blocks}
      {/* pixel-stepped rounded end caps */}
      <rect x={36} y={y + 2} width={4} height={6} fill={C.black} />
      <rect x={312} y={y + 2} width={4} height={6} fill={C.black} />
    </g>
  )
}

function PixelBolt({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width={8} height={8} fill={C.boltDark} />
      <rect x={x + 1} y={y + 1} width={6} height={6} fill={C.bolt} />
      <rect x={x + 3} y={y + 1} width={2} height={6} fill={C.boltDark} />
      <rect x={x + 1} y={y + 3} width={6} height={2} fill={C.boltDark} />
    </g>
  )
}

export default function BombPanel({
  wires,
  currentWireId,
  mm,
  ss,
  message,
  legendLabel,
  legendRows,
  showLegend,
  onWireClick,
  wiresClickable,
  showRecheck,
  onRecheck,
  showCutNow,
  onCutNow,
}) {
  const wireY = [72, 98, 124]

  return (
    <div className="relative w-full mx-auto select-none" style={{ maxWidth: 640, aspectRatio: '352 / 200' }}>
      <svg viewBox="0 0 352 200" className="absolute inset-0 w-full h-full" shapeRendering="crispEdges">
        {/* chassis body */}
        <rect x={40} y={44} width={272} height={112} fill={C.body} stroke={C.black} strokeWidth={3} />
        {/* top-left highlight edge + bottom-right shadow edge, pixel-art shading */}
        <rect x={40} y={44} width={272} height={4} fill={C.bodyLight} />
        <rect x={40} y={44} width={4} height={112} fill={C.bodyLight} />
        <rect x={40} y={152} width={272} height={4} fill={C.bodyDark} />
        <rect x={308} y={44} width={4} height={112} fill={C.bodyDark} />
        {/* section dividers */}
        <rect x={136} y={48} width={4} height={104} fill={C.bodyDark} />
        <rect x={232} y={48} width={4} height={104} fill={C.bodyDark} />

        <StripeCap y={34} />
        <StripeCap y={156} />

        <PixelBolt x={46} y={50} />
        <PixelBolt x={298} y={50} />
        <PixelBolt x={46} y={142} />
        <PixelBolt x={298} y={142} />

        {/* battery cell */}
        <rect x={64} y={44} width={6} height={8} fill={C.wireTip} />
        <rect x={78} y={44} width={6} height={8} fill={C.wireTip} />
        <rect x={64} y={50} width={6} height={10} fill={C.wireYellow} />
        <rect x={78} y={50} width={6} height={10} fill={C.wireYellow} />
        <rect x={60} y={60} width={24} height={8} fill={C.batteryBody} stroke={C.black} strokeWidth={2} />
        <rect x={52} y={68} width={40} height={64} fill={C.batteryBody} stroke={C.black} strokeWidth={2} />
        <rect x={52} y={104} width={40} height={4} fill={C.batteryGreenDark} />
        <rect x={52} y={108} width={40} height={24} fill={C.batteryGreen} />

        {/* switch stack + gate boxes (decorative wiring flavor) */}
        {wireY.map((y, i) => (
          <g key={`switch-${i}`}>
            <path
              d={`M 148 ${y + 4} L 168 ${y + 4}`}
              stroke={C.black}
              strokeWidth={3}
              fill="none"
            />
            <rect x={148} y={y - 4} width={20} height={16} fill={C.switchBody} stroke={C.black} strokeWidth={2} />
            <text x={158} y={y + 8} textAnchor="middle" className="font-pixel" fontSize={5} fill="#fff">
              IO
            </text>
          </g>
        ))}
        {/* traces from switches into gates, converging right */}
        <path d="M 168 76 L 180 76 L 180 76" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 180 76 L 196 76" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 168 102 L 176 102 L 176 90 L 196 90" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 168 128 L 220 128" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 240 76 L 250 76 L 250 128 L 220 128" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 240 90 L 246 90 L 246 76" stroke={C.black} strokeWidth={3} fill="none" />
        <path d="M 250 102 L 260 102 L 260 148 L 236 148" stroke={C.black} strokeWidth={3} fill="none" />

        <rect x={196} y={68} width={44} height={16} fill={C.gateBox} stroke={C.black} strokeWidth={2} />
        <text x={218} y={79} textAnchor="middle" className="font-pixel" fontSize={5} fill={C.gateText}>
          AND
        </text>
        <rect x={196} y={94} width={44} height={16} fill={C.gateBox} stroke={C.black} strokeWidth={2} />
        <text x={218} y={105} textAnchor="middle" className="font-pixel" fontSize={5} fill={C.gateText}>
          AND
        </text>
        <rect x={196} y={120} width={44} height={16} fill={C.gateBox} stroke={C.black} strokeWidth={2} />
        <text x={218} y={131} textAnchor="middle" className="font-pixel" fontSize={5} fill={C.gateText}>
          NAND
        </text>

        {/* display bezel */}
        <rect x={244} y={52} width={64} height={96} fill={C.bezel} stroke={C.black} strokeWidth={3} />
        <rect x={244} y={52} width={64} height={4} fill="#5A5E9E" />
        <rect x={250} y={58} width={52} height={22} fill={C.ledBg} stroke={C.black} strokeWidth={2} />
        <text x={276} y={74} textAnchor="middle" className="font-pixel tabular-nums" fontSize={13} fill={C.led}>
          {mm}:{ss}
        </text>

        <rect x={250} y={86} width={6} height={6} fill={C.indicatorGreen} />
        <text x={260} y={92} className="font-pixel" fontSize={5} fill="#fff">
          DEFUSED
        </text>
        <rect x={250} y={98} width={6} height={6} fill={C.indicatorRed} className="animate-pulse" />
        <text x={260} y={104} className="font-pixel" fontSize={5} fill="#fff">
          ARMED
        </text>

        <rect x={250} y={110} width={30} height={14} fill={C.ledBg} stroke={C.black} strokeWidth={2} />
        <text x={265} y={120} textAnchor="middle" className="font-pixel tabular-nums" fontSize={7} fill={C.led}>
          {mm}:{ss}
        </text>
        <polygon points="290,124 297,136 283,136" fill={C.warnYellow} stroke={C.black} strokeWidth={1.5} />
        <text x={290} y={134} textAnchor="middle" className="font-pixel" fontSize={6} fill={C.black}>
          !
        </text>

        {/* the three functional wires — click to cut */}
        {wires.map((w, i) => {
          const y = wireY[i]
          const isCurrent = w.id === currentWireId
          return (
            <g key={w.id}>
              <rect
                x={96}
                y={y - 4}
                width={isCurrent ? 26 : 52}
                height={8}
                fill={w.color}
                stroke={C.black}
                strokeWidth={2}
              />
              {isCurrent && (
                <rect
                  x={130}
                  y={y + 3}
                  width={20}
                  height={8}
                  fill={w.color}
                  stroke={C.black}
                  strokeWidth={2}
                  transform={`rotate(24 130 ${y + 3})`}
                />
              )}
              {isCurrent && (
                <text x={122} y={y - 10} textAnchor="middle" fontSize={9} aria-hidden="true">
                  ✂️
                </text>
              )}
              <rect
                x={92}
                y={y - 8}
                width={60}
                height={16}
                fill="transparent"
                stroke="none"
                onClick={() => wiresClickable && onWireClick(w.id)}
                style={{ cursor: wiresClickable ? 'pointer' : 'default', pointerEvents: 'all' }}
                aria-label={`Cut ${w.label}`}
                role="button"
                tabIndex={wiresClickable ? 0 : -1}
                onKeyDown={(e) => {
                  if (wiresClickable && (e.key === 'Enter' || e.key === ' ')) onWireClick(w.id)
                }}
              />
            </g>
          )
        })}

        {/* side wire loops, purely decorative */}
        {[64, 88, 112].map((y) => (
          <path
            key={`left-${y}`}
            d={`M 40 ${y} Q 24 ${y + 6} 40 ${y + 12}`}
            stroke={C.bodyLight}
            strokeWidth={4}
            fill="none"
          />
        ))}
        {[64, 88, 112].map((y) => (
          <path
            key={`right-${y}`}
            d={`M 312 ${y} Q 328 ${y + 6} 312 ${y + 12}`}
            stroke={C.wireYellow}
            strokeWidth={4}
            fill="none"
          />
        ))}
      </svg>

      {/* final-stage confirm control */}
      {showCutNow && (
        <button
          type="button"
          onClick={onCutNow}
          className="absolute font-pixel text-white text-[8px] sm:text-[9px] px-2 py-2 active:translate-y-[2px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
          style={{ right: '10%', bottom: '4%', background: '#FF4477', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
        >
          CUT NOW
        </button>
      )}

      {/* instruction speech bubble — sits in the SVG's own top margin (device body starts at y=44/200=22%) */}
      {message && (
        <div
          className="absolute p-2 sm:p-3"
          style={{ right: '1%', top: '1%', width: '52%', background: '#FFFFFF', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}
        >
          <p className="font-mono text-[9px] sm:text-xs leading-snug text-black">{message}</p>
        </div>
      )}

      {/* legend card — sits in the SVG's own bottom margin (device body ends at y=156/200=78%) */}
      {showLegend && (
        <div
          className="absolute p-2 sm:p-3"
          style={{ left: '0%', bottom: '1%', width: '46%', background: '#F5F5F0', color: '#1A1A1A', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}
        >
          {/* was text-gray-500 (~4.4:1 on this bg) at 6-7px — failed WCAG for
              normal text and was unreadable at pixel-font size; text-gray-700
              gets ~9.9:1 and the bump to 8-9px keeps it legible on a phone */}
          <p className="font-pixel text-[8px] sm:text-[9px] tracking-wide text-gray-700 mb-1">{legendLabel}</p>
          {legendRows.map((row) => (
            <p key={row} className="font-mono text-[10px] sm:text-xs leading-tight font-bold">
              {row}
            </p>
          ))}
          {showRecheck && (
            <button
              type="button"
              onClick={onRecheck}
              className="mt-1 font-pixel text-[9px] sm:text-[10px] underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              🔍 RE-CHECK THE KEY
            </button>
          )}
        </div>
      )}
    </div>
  )
}
