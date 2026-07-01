// Hand-drawn pixel-art SVG scenery for Level 1 — flat fills, hard edges,
// shape-rendering="crispEdges", no gradients/blur/circles/curves. "Round"
// things (the ceiling light glow, the plant canopy, figures' heads) are
// faked with stepped rectangles the way real pixel-art sprites do it,
// matching Level 2's BombPanel.jsx (already built this way) and the
// city-street pixel-art reference rather than the earlier vector/gradient
// version of this file.
//
// Purely decorative: every interactive element (Emergency Release, the
// keypad, the push-bar, the fork paths, the extinguisher) is a real
// transparent <button> layered on top by the screen that uses this art, so
// hit-testing, disabled states and copy text never live inside the SVG.
import { Bolt, Mound } from '../../components/PixelArtKit.jsx'

const PIXEL_FONT = "'Press Start 2P'"

function WallTexture({ tone = '#1B4A46', dark = '#123433' }) {
  return (
    <>
      <rect width="360" height="640" fill={tone} />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={i * 60} y="0" width="2" height="560" fill={dark} opacity="0.5" />
      ))}
    </>
  )
}

function Floor({ dark = '#123433' }) {
  return (
    <>
      <rect x="0" y="560" width="360" height="80" fill="#2E3436" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 40} y="560" width="1" height="80" fill={dark} opacity="0.6" />
      ))}
    </>
  )
}

// Stepped-square glow instead of a radial gradient — three shrinking,
// brightening squares read as a glowing bulb at this scale without any
// gradient fill.
function CeilingLight({ cx, glow = true }) {
  return (
    <g>
      <rect x={cx - 2} y="10" width="4" height="24" fill="#123433" />
      {glow && (
        <>
          <rect x={cx - 26} y="24" width="52" height="52" fill="#FF2D2D" opacity="0.08" />
          <rect x={cx - 16} y="30" width="32" height="32" fill="#FF2D2D" opacity="0.18" />
        </>
      )}
      <rect x={cx - 11} y="39" width="22" height="22" fill={glow ? '#FF2D2D' : '#4B5257'} stroke="#123433" strokeWidth="2" />
      <rect x={cx - 6} y="44" width="6" height="6" fill="#FFFFFF" opacity={glow ? 0.5 : 0.25} />
    </g>
  )
}

function Sign({ x, y, w, h, fill = '#1F7A4C' }) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} stroke="#123433" strokeWidth="1.5" opacity="0.9" />
}

// The door-panel room. Emergency Release / Keypad / Push-bar hotspots are
// added on top by Act2Panel — the coordinates below are documented there so
// the overlay buttons line up with the art.
export function RoomScene() {
  return (
    <svg
      viewBox="0 0 360 640"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <WallTexture />
      <Floor />

      {/* left-wall dressing — purely atmospheric, never interactive */}
      <Sign x={10} y={92} w={72} h={26} fill="#1F7A4C" />
      <Sign x={10} y={126} w={72} h={22} fill="#4B5257" />
      <Sign x={10} y={156} w={72} h={22} fill="#4B5257" />

      {/* fish tank — fish are small blocky rects, not circles */}
      <g opacity="0.9">
        <rect x="6" y="430" width="90" height="56" fill="#3E7C82" opacity="0.55" stroke="#123433" strokeWidth="2" />
        <rect x="0" y="486" width="102" height="10" fill="#4B5257" />
        <rect x="14" y="510" width="72" height="46" fill="#4B5257" />
        <rect x="34" y="452" width="8" height="6" fill="#FFB347" />
        <rect x="60" y="462" width="8" height="6" fill="#FFB347" />
      </g>

      {/* potted plant — blocky stepped-mound leaves instead of bezier curves */}
      <g>
        <rect x="90" y="500" width="34" height="38" fill="#4B5257" />
        <Mound x={78} y={452} width={30} color="#1F7A4C" />
        <Mound x={100} y={444} width={26} color="#1F7A4C" />
      </g>

      <CeilingLight cx={56} />

      {/* exit sign — straight-line pictogram only, no curves */}
      <g>
        <rect x="126" y="22" width="108" height="34" fill="#1F7A4C" stroke="#123433" strokeWidth="2" />
        <path
          d="M139 30 v18 M139 30 h8 M139 39 h6 M139 48 h8 M151 30 l8 18 M167 30 l-8 18"
          stroke="#F5F5F5"
          strokeWidth="2"
          fill="none"
          strokeLinecap="square"
        />
        <text x="188" y="46" fontFamily={PIXEL_FONT} fontSize="10" fill="#F5F5F5" textAnchor="middle">
          EXIT
        </text>
      </g>

      {/* door */}
      <rect x="114" y="96" width="130" height="442" fill="#4B5257" />
      <rect x="122" y="104" width="114" height="426" fill="#9AA1A7" />
      <rect x="177" y="104" width="2" height="426" fill="#4B5257" />
      <rect x="138" y="128" width="52" height="42" fill="#3E7C82" opacity="0.55" />
      <rect x="196" y="128" width="52" height="42" fill="#3E7C82" opacity="0.55" />
      {/* door handle — this IS the push-bar hotspot's art. Small, grey,
          unlabeled, blending straight into the door. */}
      <rect x="171" y="318" width="8" height="72" fill="#D8DDE1" stroke="#4B5257" strokeWidth="1" />
      <Bolt x={126} y={108} size={8} light="#D8DDE1" dark="#4B5257" />
      <Bolt x={226} y={108} size={8} light="#D8DDE1" dark="#4B5257" />
      <Bolt x={126} y={522} size={8} light="#D8DDE1" dark="#4B5257" />
      <Bolt x={226} y={522} size={8} light="#D8DDE1" dark="#4B5257" />

      {/* side control-panel housing */}
      <rect x="250" y="148" width="94" height="366" fill="#20262B" stroke="#123433" strokeWidth="2" />
      <rect x="260" y="160" width="30" height="22" fill="#3E7C82" opacity="0.7" />
      <rect x="304" y="160" width="30" height="22" fill="#4B5257" />

      {/* keypad body art (label + hit area rendered by Act2Panel on top) */}
      <rect x="262" y="222" width="70" height="52" fill="#123433" stroke="#4B5257" strokeWidth="2" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={268 + (i % 3) * 20}
          y={228 + Math.floor(i / 3) * 15}
          width="14"
          height="10"
          fill="#4B5257"
        />
      ))}

      {/* decorative sector lights */}
      <rect x="262" y="470" width="16" height="12" fill="#4B5257" />
      <rect x="284" y="470" width="16" height="12" fill="#4B5257" />
      <rect x="306" y="470" width="16" height="12" fill="#4B5257" />

      {/* emergency button plate — the pulsing red button itself is rendered
          as an HTML element on top so it can animate; this is just the
          panel cut-out behind it (a square recess, not a circle). */}
      <rect x="259" y="362" width="76" height="76" fill="#171B1E" stroke="#123433" strokeWidth="2" />
      <Bolt x={263} y={366} size={8} light="#3A3A3A" dark="#171B1E" />
      <Bolt x={327} y={366} size={8} light="#3A3A3A" dark="#171B1E" />
      <Bolt x={263} y={430} size={8} light="#3A3A3A" dark="#171B1E" />
      <Bolt x={327} y={430} size={8} light="#3A3A3A" dark="#171B1E" />
    </svg>
  )
}

// Left (empty) side of the corridor fork. Quiet, dim, unremarkable —
// nothing pulls the eye here, which is the point.
export function LeftPathArt() {
  return (
    <svg
      viewBox="0 0 180 640"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <WallTexture tone="#163E3B" />
      <Floor />
      <CeilingLight cx={90} glow={false} />
      <rect x="66" y="420" width="48" height="140" fill="#123433" opacity="0.85" />
    </svg>
  )
}

// Right (crowd) side of the corridor fork. Warmer glow, an alarm light, and
// a small cluster of figures already walking that way — the pull is
// entirely visual, nothing is written down.
export function RightPathArt() {
  const figures = [0, 1, 2]
  return (
    <svg
      viewBox="0 0 180 640"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <WallTexture tone="#1B4A46" />
      <Floor />
      <CeilingLight cx={90} />
      {figures.map((i) => (
        <g key={i} transform={`translate(${58 + i * 26}, ${470 - i * 10})`}>
          <rect x="0" y="10" width="14" height="24" fill="#CCCCCC" />
          <rect x="1" y="0" width="12" height="12" fill="#CCCCCC" />
        </g>
      ))}
    </svg>
  )
}

// The extinguisher decision. A believable wall-mounted extinguisher on one
// side, an exit arrow on the other — same corridor, two objects.
export function ExtinguisherArt() {
  return (
    <svg
      viewBox="0 0 360 640"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <WallTexture />
      <Floor />
      <CeilingLight cx={180} />

      {/* extinguisher bracket + cylinder (art only — the tap target sits on
          top, sized generously by the screen that uses this art) */}
      <g transform="translate(96, 300)">
        <rect x="-16" y="0" width="32" height="10" fill="#4B5257" />
        <rect x="-13" y="10" width="26" height="70" fill="#FF2D2D" stroke="#123433" strokeWidth="2" />
        <rect x="-13" y="10" width="26" height="6" fill="#FFFFFF" opacity="0.25" />
        <rect x="-6" y="-10" width="12" height="12" fill="#9AA1A7" />
        {/* hose, drawn as a blocky right-angle path instead of a smooth curve */}
        <path
          d="M13 26 h10 v10 h8 v10 h6"
          stroke="#4B5257"
          strokeWidth="4"
          fill="none"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </g>

      {/* far doorway glow, standing in for "keep moving" — stepped squares
          instead of a gradient fill */}
      <g transform="translate(240, 260)">
        <rect x="0" y="0" width="60" height="140" fill="#123433" />
        <rect x="8" y="8" width="44" height="124" fill="#FF2D2D" opacity="0.12" />
        <rect x="16" y="40" width="28" height="60" fill="#FF2D2D" opacity="0.2" />
      </g>
    </svg>
  )
}

// Shared moody backdrop for Setup / Consequence — same room, no
// interactive elements, just enough scenery so those beats don't feel like
// a plain color card next to the fully dressed corridor and panel.
export function HallwayBackdrop() {
  return (
    <svg
      viewBox="0 0 360 640"
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <WallTexture tone="#123433" dark="#0D0D0D" />
      <Floor />
      <CeilingLight cx={110} />
      <CeilingLight cx={280} />
    </svg>
  )
}
