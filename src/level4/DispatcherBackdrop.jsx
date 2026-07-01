// Ambient backdrop for the dispatcher call. Previously this screen had no
// scenery at all — just the flat l4bg color behind the dialogue panel. This
// gives continuity with the flash scene that just played: same night
// skyline, now seen through a window from wherever the player is calling
// from, with a phone cord in the foreground corner. Flat pixel-art style
// (shape-rendering="crispEdges", no circles/gradients/blur), full-bleed
// behind the real dialogue box + response buttons rendered on top by
// DispatcherCall.jsx — purely decorative, aria-hidden.
import { Building, CoiledWire } from '../components/PixelArtKit.jsx'

export default function DispatcherBackdrop() {
  return (
    <svg
      viewBox="0 0 360 640"
      preserveAspectRatio="xMidYMid slice"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="360" height="640" fill="#0A0E1A" />

      {/* interior wall, slightly lighter than the base background */}
      <rect x="0" y="0" width="360" height="640" fill="#0E1422" />

      {/* window frame with the night skyline visible through it */}
      <rect x="40" y="60" width="220" height="260" fill="#0A0E1A" stroke="#1E2A3A" strokeWidth="6" />
      <Building x={44} y={200} width={40} height={116} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={0} />
      <Building x={86} y={160} width={34} height={156} body="#22304A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={1} />
      <Building x={122} y={210} width={44} height={106} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={2} />
      <Building x={200} y={180} width={36} height={136} body="#22304A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={1} />
      <Building x={238} y={220} width={20} height={96} body="#1E2A3A" bodyDark="#141C28" litColor="#FFD166" dimColor="#E8E8E8" seed={3} />
      {/* window cross-bars */}
      <rect x="148" y="60" width="4" height="260" fill="#1E2A3A" />
      <rect x="40" y="188" width="220" height="4" fill="#1E2A3A" />

      {/* phone cord trailing into the corner, foreground */}
      <CoiledWire x={16} y={420} turns={8} color="#1E2A3A" step={8} />

      {/* floor line */}
      <rect x="0" y="600" width="360" height="40" fill="#080C16" />
    </svg>
  )
}
