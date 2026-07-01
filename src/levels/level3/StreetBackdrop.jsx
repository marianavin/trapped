// Static street-scene backdrop for Act 1 (the bystander/sign moment).
// Composition borrows from a reference pixel-art city street — skyline,
// storefronts, streetlamps, trees, road with a crosswalk — but stays inside
// Level 3's documented "Clinical" palette (TRAPPED_Visual_Sound_Reference.md):
// l3-bg, l3-face, l3-prompt, plus white/black at varying opacity for depth
// and window detail. The crosswalk nods directly at the copy spec's "NEAR
// THE CROSSING" line. Purely decorative — sits behind the dialogue box and
// sign button, z-0, so none of Act1Location's interaction logic changes.
export default function StreetBackdrop() {
  return (
    <svg
      viewBox="0 0 480 270"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="480" height="270" fill="#1A1A2E" />

      {/* distant skyline — blurred-perception buildings, low contrast on purpose */}
      <g opacity="0.35">
        <rect x="8" y="70" width="34" height="110" fill="#000000" />
        <rect x="46" y="95" width="26" height="85" fill="#000000" />
        <rect x="86" y="55" width="30" height="125" fill="#000000" />
        <rect x="150" y="90" width="24" height="90" fill="#000000" />
        <rect x="300" y="60" width="32" height="120" fill="#000000" />
        <rect x="340" y="100" width="22" height="80" fill="#000000" />
        <rect x="400" y="75" width="30" height="105" fill="#000000" />
        <rect x="440" y="95" width="28" height="85" fill="#000000" />
        {/* faint distant window dots */}
        {Array.from({ length: 18 }).map((_, i) => (
          <rect
            key={i}
            x={12 + (i % 6) * 60}
            y={100 + Math.floor(i / 6) * 22}
            width="3"
            height="6"
            fill="#FFFFFF"
            opacity="0.25"
          />
        ))}
      </g>

      {/* sidewalk */}
      <rect x="0" y="170" width="480" height="20" fill="#3A3A4A" opacity="0.55" />
      {/* road */}
      <rect x="0" y="190" width="480" height="80" fill="#000000" opacity="0.45" />
      {/* dashed center line */}
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={20 + i * 40} y="228" width="18" height="4" fill="#FFFFFF" opacity="0.5" />
      ))}
      {/* crosswalk — "near the crossing" */}
      <g opacity="0.6">
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={350 + i * 12} y="192" width="6" height="76" fill="#FFFFFF" />
        ))}
      </g>

      {/* storefront row */}
      {[
        { x: 20, w: 70, h: 90 },
        { x: 96, w: 60, h: 75 },
        { x: 200, w: 66, h: 100 },
        { x: 272, w: 58, h: 80 },
      ].map((b, bi) => (
        <g key={bi}>
          <rect x={b.x} y={170 - b.h} width={b.w} height={b.h} fill="#3A3A4A" />
          <rect x={b.x} y={170 - b.h} width={b.w} height="4" fill="#1A1A2E" />
          {Array.from({ length: Math.floor(b.w / 16) }).map((_, wi) =>
            Array.from({ length: Math.floor((b.h - 16) / 20) }).map((_, hi) => {
              const lit = (bi + wi + hi) % 5 === 0
              return (
                <rect
                  key={`${wi}-${hi}`}
                  x={b.x + 6 + wi * 16}
                  y={170 - b.h + 12 + hi * 20}
                  width="8"
                  height="10"
                  fill={lit ? '#A8C8E8' : '#FFFFFF'}
                  opacity={lit ? 0.9 : 0.2}
                />
              )
            })
          )}
        </g>
      ))}

      {/* trees */}
      {[
        { x: 160, y: 170 },
        { x: 420, y: 170 },
      ].map((t, ti) => (
        <g key={ti}>
          <rect x={t.x - 3} y={t.y - 18} width="6" height="18" fill="#3A3A4A" />
          <circle cx={t.x} cy={t.y - 32} r="16" fill="#3A3A4A" opacity="0.9" />
          <circle cx={t.x - 8} cy={t.y - 24} r="11" fill="#3A3A4A" opacity="0.7" />
          <circle cx={t.x + 9} cy={t.y - 22} r="10" fill="#3A3A4A" opacity="0.7" />
        </g>
      ))}

      {/* streetlamps */}
      {[80, 340].map((x, li) => (
        <g key={li}>
          <rect x={x - 2} y="120" width="4" height="50" fill="#E8E8E8" opacity="0.6" />
          <rect x={x - 10} y="116" width="20" height="4" fill="#E8E8E8" opacity="0.6" />
          <circle cx={x} cy="112" r="10" fill="#A8C8E8" opacity="0.55" />
          <circle cx={x} cy="112" r="4" fill="#A8C8E8" />
        </g>
      ))}
    </svg>
  )
}
