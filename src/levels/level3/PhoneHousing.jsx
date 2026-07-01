// Ambient backdrop for Act 2 (the scrambled keypad). This screen previously
// had no scenery at all — just the flat l3-bg color behind the dial grid.
// This adds a payphone-booth environment in the same flat, hard-edged
// pixel-art style as Level 1/2's art (shape-rendering="crispEdges", no
// circles/gradients/blur), full-bleed behind the real interactive keypad
// grid rendered on top by Act2Keypad.jsx — purely decorative, aria-hidden,
// and never involved in hit-testing.
import { Bolt, CoiledWire } from '../../components/PixelArtKit.jsx'

export default function PhoneHousing() {
  return (
    <svg
      viewBox="0 0 300 420"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="300" height="420" fill="#1A1A2E" />

      {/* booth back wall panel, subtly lighter than the base background */}
      <rect x="20" y="20" width="260" height="380" fill="#22223A" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={20 + i * 44} y="20" width="2" height="380" fill="#1A1A2E" opacity="0.6" />
      ))}

      {/* wall-mounted phone box, off to the side so it never collides with
          the centered interactive dial grid */}
      <g>
        <rect x="30" y="60" width="70" height="110" fill="#3A3A4A" stroke="#0A0A0A" strokeWidth="2" />
        <Bolt x={34} y={64} size={7} light="#5A5A6A" dark="#0A0A0A" />
        <Bolt x={87} y={64} size={7} light="#5A5A6A" dark="#0A0A0A" />
        <Bolt x={34} y={159} size={7} light="#5A5A6A" dark="#0A0A0A" />
        <Bolt x={87} y={159} size={7} light="#5A5A6A" dark="#0A0A0A" />
        {/* coin slot + small indicator, atmosphere only */}
        <rect x="48" y="80" width="24" height="6" fill="#0A0A0A" />
        <rect x="48" y="96" width="8" height="8" fill="#44FF88" opacity="0.7" />
      </g>

      {/* handset dangling off-hook beside the box, cord swinging down —
          suggests urgency without any invented copy */}
      <g>
        <CoiledWire x={96} y={80} turns={7} color="#5A5A6A" step={7} />
        <rect x="92" y="128" width="34" height="14" fill="#D8E8F5" />
        <rect x="86" y="132" width="10" height="8" fill="#D8E8F5" />
        <rect x="122" y="132" width="10" height="8" fill="#D8E8F5" />
      </g>

      {/* floor line, grounding the booth */}
      <rect x="0" y="392" width="300" height="28" fill="#141428" />
    </svg>
  )
}
