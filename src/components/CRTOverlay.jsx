// Nested inside each screen's own `relative` wrapper (see Level3/Level4),
// so this overlays just that screen rather than the whole viewport.
export default function CRTOverlay() {
  return <div className="absolute inset-0 pointer-events-none z-40 scanlines" aria-hidden="true" />
}
