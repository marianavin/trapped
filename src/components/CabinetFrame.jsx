import { StatusFooter } from './GlitchShell.jsx'

// Industrial arcade bezel — thick metal frame, corner screws, neon inner
// bevel, CRT screen, and status footer embedded in the bottom rail.
export default function CabinetFrame({ children }) {
  return (
    <div className="cabinet-shell h-screen w-screen crt-flicker">
      <div className="cabinet-frame">
        <CornerScrew className="cabinet-screw cabinet-screw-tl" />
        <CornerScrew className="cabinet-screw cabinet-screw-tr" />

        <div className="cabinet-bezel">
          <div className="cabinet-screen relative min-h-0 min-w-0 overflow-hidden flex flex-col">
            <div className="cabinet-screen-glare cabinet-screen-glare-tl" aria-hidden="true" />
            <div className="cabinet-screen-glare cabinet-screen-glare-br" aria-hidden="true" />
            <div className="relative flex-1 min-h-0 w-full">
              <div className="absolute inset-0 pointer-events-none z-50 scanlines" aria-hidden="true" />
              <div className="absolute inset-0 pointer-events-none z-[49] crt-vignette" aria-hidden="true" />
              <div className="relative h-full w-full">{children}</div>
            </div>
          </div>
        </div>

        <CornerScrew className="cabinet-screw cabinet-screw-bl" />
        <div className="cabinet-footer">
          <StatusFooter />
        </div>
        <CornerScrew className="cabinet-screw cabinet-screw-br" />
      </div>
    </div>
  )
}

function CornerScrew({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 22 22"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <circle cx={11} cy={11} r={9} fill="#1A1E3A" stroke="#0A0A0A" strokeWidth={2} />
      <circle cx={11} cy={11} r={7} fill="#2D325A" />
      <rect x={9} y={3} width={4} height={2} fill="#4A5088" opacity={0.55} />
      <line x1={6} y1={6} x2={16} y2={16} stroke="#0A0A0A" strokeWidth={2.5} />
      <line x1={6} y1={6} x2={16} y2={16} stroke="#4A5088" strokeWidth={1} opacity={0.4} />
    </svg>
  )
}
