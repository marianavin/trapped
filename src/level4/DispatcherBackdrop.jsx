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
      <rect x="0" y="0" width="360" height="640" fill="#121225" />

      {/* interior wall, slightly lighter than the base background */}
      <rect x="0" y="0" width="360" height="640" fill="#191B3F" />

      {/* window frame with the night skyline visible through it — a cyan
          frame instead of a dark one so it reads as a lit window, matching
          the glow-border language used everywhere else in the UI */}
      <rect x="40" y="60" width="220" height="260" fill="#121225" stroke="#00F0FF" strokeWidth="4" opacity="0.8" />
      <Building x={44} y={200} width={40} height={116} body="#1A1A3A" bodyDark="#0B0C1F" litColor="#00F0FF" dimColor="#CFEFFF" seed={0} />
      <Building x={86} y={160} width={34} height={156} body="#232659" bodyDark="#0B0C1F" litColor="#00F0FF" dimColor="#CFEFFF" seed={1} />
      <Building x={122} y={210} width={44} height={106} body="#1A1A3A" bodyDark="#0B0C1F" litColor="#00F0FF" dimColor="#CFEFFF" seed={2} />
      <Building x={200} y={180} width={36} height={136} body="#232659" bodyDark="#0B0C1F" litColor="#00F0FF" dimColor="#CFEFFF" seed={1} />
      <Building x={238} y={220} width={20} height={96} body="#1A1A3A" bodyDark="#0B0C1F" litColor="#00F0FF" dimColor="#CFEFFF" seed={3} />
      {/* window cross-bars */}
      <rect x="148" y="60" width="4" height="260" fill="#2A2D66" />
      <rect x="40" y="188" width="220" height="4" fill="#2A2D66" />

      {/* phone cord trailing into the corner, foreground */}
      <CoiledWire x={16} y={420} turns={8} color="#2A2D66" step={8} />

      {/* floor line */}
      <rect x="0" y="600" width="360" height="40" fill="#0B0C1F" />
    </svg>
  )
}
