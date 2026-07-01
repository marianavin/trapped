// Shared hand-authored pixel-art primitives used by the level backdrops
// (Level 1's Artwork.jsx, Level 3's StreetBackdrop/PhoneHousing, Level 4's
// FlashScene/DispatcherBackdrop). Pulled out into one file so every scene
// builds "detail" (window grids, foliage, glow, hardware) out of the same
// small set of building blocks instead of every file reinventing its own
// circle/gradient/blur shortcuts.
//
// Hard rules enforced by every primitive here, matching the pixel-art brief:
//  - flat fills only, no gradients
//  - no <circle>/<ellipse> — round things are faked with stepped rectangles
//  - no blur filters — glow is faked with 2-3 stacked squares of falling opacity
//  - every coordinate is a whole number on a small grid so edges stay crisp
//    when shapeRendering="crispEdges" is set on the parent <svg>

// A building silhouette with a window grid, deterministic "lit" pattern
// (derived from position, not Math.random, so it never flickers on re-render).
export function Building({ x, y, width, height, body, bodyDark, litColor, dimColor, seed = 0 }) {
  const cols = Math.max(1, Math.floor((width - 8) / 14))
  const rows = Math.max(1, Math.floor((height - 16) / 18))
  const windows = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (c + r + seed) % 4 === 0
      windows.push(
        <rect
          key={`${r}-${c}`}
          x={x + 6 + c * 14}
          y={y + 12 + r * 18}
          width={8}
          height={10}
          fill={lit ? litColor : dimColor}
          opacity={lit ? 0.95 : 0.35}
        />
      )
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={body} />
      <rect x={x} y={y} width={width} height={4} fill={bodyDark} />
      {windows}
    </g>
  )
}

// Stepped-pyramid mound — the pixel-art way to fake a round cloud, smoke
// puff, or tree canopy without a circle or blur. Three tiers, each wider
// than the last, stacked so the silhouette reads as soft from a distance.
export function Mound({ x, y, width, color, opacity = 1 }) {
  const tierH = Math.max(4, Math.round(width / 8))
  const topW = Math.round(width * 0.4)
  const midW = Math.round(width * 0.7)
  return (
    <g opacity={opacity}>
      <rect x={x + (width - topW) / 2} y={y} width={topW} height={tierH} fill={color} />
      <rect x={x + (width - midW) / 2} y={y + tierH} width={midW} height={tierH} fill={color} />
      <rect x={x} y={y + tierH * 2} width={width} height={tierH} fill={color} />
    </g>
  )
}

// A tree: trunk + mound canopy, no circles.
export function PixelTree({ x, y, trunkColor, canopyColor, scale = 1 }) {
  const canopyW = 32 * scale
  const trunkH = 16 * scale
  return (
    <g>
      <rect x={x - 3 * scale} y={y - trunkH} width={6 * scale} height={trunkH} fill={trunkColor} />
      <Mound x={x - canopyW / 2} y={y - trunkH - canopyW * 0.55} width={canopyW} color={canopyColor} />
    </g>
  )
}

// A moon (or sun): a stepped-circle disc built from horizontal rows of
// decreasing width, the classic pixel-art way to fake a circle without an
// actual <circle> element. `rows` controls how chunky/smooth it reads —
// low numbers (5-7) look deliberately blocky, matching this game's low-fi
// pixel-art brief better than a "smooth" 20-row approximation would.
export function PixelMoon({ cx, cy, radius, color, rows = 6 }) {
  const bands = []
  for (let i = 0; i < rows; i++) {
    const t = (i + 0.5) / rows - 0.5 // -0.5..0.5 across the disc
    const bandY = cy - radius + (i * (2 * radius)) / rows
    const bandH = (2 * radius) / rows
    const halfW = Math.sqrt(Math.max(0, 0.25 - t * t)) * radius * 2
    bands.push(
      <rect key={i} x={cx - halfW} y={bandY} width={halfW * 2} height={bandH + 0.5} fill={color} />
    )
  }
  return <g>{bands}</g>
}

// A small 4-point "+" star sprite — flat rects forming a plus, not a glow.
export function Starburst({ x, y, size = 4, color }) {
  const s = size
  return (
    <g fill={color}>
      <rect x={x - s / 2} y={y - 1} width={s} height={2} />
      <rect x={x - 1} y={y - s / 2} width={2} height={s} />
    </g>
  )
}

// A streetlamp with a stepped-opacity glow halo instead of a blurred circle.
export function StreetLamp({ x, y, poleColor, glowColor, poleHeight = 50 }) {
  return (
    <g>
      <rect x={x - 2} y={y} width={4} height={poleHeight} fill={poleColor} />
      <rect x={x - 10} y={y - 4} width={20} height={4} fill={poleColor} />
      <rect x={x - 14} y={y - 14} width={28} height={14} fill={glowColor} opacity={0.08} />
      <rect x={x - 9} y={y - 14} width={18} height={10} fill={glowColor} opacity={0.18} />
      <rect x={x - 5} y={y - 12} width={10} height={8} fill={glowColor} opacity={0.95} />
    </g>
  )
}

// Small stepped-square bolt/rivet used to dress panel hardware corners —
// pixel art's usual trick for a "round" bolt head at tiny scale.
export function Bolt({ x, y, size = 8, light, dark }) {
  const s = size
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill={dark} />
      <rect x={x + 1} y={y + 1} width={s - 2} height={s - 2} fill={light} />
      <rect x={x + s / 2 - 1} y={y + 1} width={2} height={s - 2} fill={dark} />
      <rect x={x + 1} y={y + s / 2 - 1} width={s - 2} height={2} fill={dark} />
    </g>
  )
}

// A small rectangular wall sign/placard with a pixel-font label baked in —
// cheaper and more legible than hand-drawing letterforms out of rects.
export function SignPlacard({ x, y, w, h, fill, stroke = '#0A0A0A', textColor = '#fff', label, fontSize = 6 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={2} />
      {label && (
        <text
          x={x + w / 2}
          y={y + h / 2 + fontSize / 3}
          textAnchor="middle"
          className="font-pixel"
          fontSize={fontSize}
          fill={textColor}
        >
          {label}
        </text>
      )}
    </g>
  )
}

// A coiled cable/wire, drawn as a zigzag stack of short blocks rather than a
// smooth spring curve — used for phone cords and side wiring.
export function CoiledWire({ x, y, turns = 5, color, step = 8 }) {
  return (
    <g>
      {Array.from({ length: turns }).map((_, i) => (
        <rect
          key={i}
          x={x + (i % 2 === 0 ? 0 : step)}
          y={y + i * step}
          width={step}
          height={step - 2}
          fill={color}
        />
      ))}
    </g>
  )
}

// A road strip with dashed lane markings — flat rects, no dash-array blur.
export function RoadStrip({ x, y, width, height, roadColor, dashColor, dashCount = 8 }) {
  const dashW = Math.round(width / (dashCount * 2))
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={roadColor} />
      {Array.from({ length: dashCount }).map((_, i) => (
        <rect
          key={i}
          x={x + i * dashW * 2}
          y={y + height / 2 - 2}
          width={dashW}
          height={4}
          fill={dashColor}
          opacity={0.6}
        />
      ))}
    </g>
  )
}
