import { Building, Mound, PixelMoon, Starburst, StreetLamp } from '../components/PixelArtKit.jsx'

// Act 1 background — a synthwave/"glitchwave" cityscape (crimson dusk sky,
// stepped-circle moon, cyan/magenta-lit skyline, a converging road into
// DISTRICT 7) recreated in this game's flat-fill/no-circle/no-blur pixel-art
// convention from a reference image. We can't embed the reference bitmap
// directly — there's no image asset pipeline wired up for uploaded
// reference art — so this rebuilds its composition (sky bands, moon+cloud,
// stars, skyline with NEO CITY signage, an abstract arch monument, and the
// perspective road) out of the same primitives every other level backdrop
// uses. Purely decorative: FlashScene.jsx renders the car/pedestrian/driver
// on top at fixed bottom-anchored offsets that land inside the road's flat
// foreground band (roughly the bottom 25% of this viewBox), same contract
// as every other level backdrop in this file's family.
//
// Colors are the reference's actual crimson/magenta dusk, not the app's
// navy `l4bg` — a deliberate one-off for this outdoor establishing shot,
// same as l3-label was a one-off addition earlier. `accent-cyan`/
// `accent-magenta` (#2DE8FF / #FF4477) are reused for signage so this stays
// in the same family as the rest of the now-unified glitchwave palette.
// NOTE: the driver's shirt truth-color (#FFD166 amber, in FlashScene.jsx)
// is intentionally NOT reused anywhere in this backdrop, so it stays the
// one unambiguous amber pixel in the whole scene.
export default function AccidentBackdrop() {
  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* dusk sky — stacked flat bands standing in for a gradient */}
      <rect x="0" y="0" width="800" height="60" fill="#3D0F30" />
      <rect x="0" y="60" width="800" height="80" fill="#6B1442" />
      <rect x="0" y="140" width="800" height="80" fill="#9C1E52" />
      <rect x="0" y="220" width="800" height="80" fill="#C42C5C" />
      <rect x="0" y="300" width="800" height="30" fill="#E8577B" />

      {/* stars */}
      {[
        [40, 25], [120, 60], [220, 20], [340, 45], [520, 30], [610, 65], [700, 25], [760, 90], [30, 110], [770, 150],
      ].map(([x, y], i) => (
        <Starburst key={i} x={x} y={y} size={i % 3 === 0 ? 6 : 4} color="#FBE8F0" />
      ))}

      {/* moon, with a cloud drifting in front of its lower edge */}
      <PixelMoon cx={430} cy={95} radius={55} color="#F6E3A8" rows={8} />
      <Mound x={430} y={118} width={150} color="#8A6A99" opacity={0.92} />

      {/* background clouds */}
      <Mound x={10} y={40} width={120} color="#7A5A8C" opacity={0.7} />
      <Mound x={640} y={75} width={130} color="#7A5A8C" opacity={0.55} />
      <Mound x={700} y={135} width={90} color="#6B4E7A" opacity={0.5} />

      {/* distant skyline, cyan/magenta signage mixed like the reference */}
      <Building x={0} y={160} width={90} height={170} body="#1B1D45" bodyDark="#0B0C1F" litColor="#2DE8FF" dimColor="#3A2A44" seed={0} />
      <Building x={95} y={190} width={60} height={140} body="#231F4A" bodyDark="#0B0C1F" litColor="#FF4477" dimColor="#3A2A44" seed={1} />
      <Building x={160} y={130} width={70} height={200} body="#1B1D45" bodyDark="#0B0C1F" litColor="#2DE8FF" dimColor="#3A2A44" seed={2} />
      <Building x={520} y={140} width={64} height={190} body="#231F4A" bodyDark="#0B0C1F" litColor="#FF4477" dimColor="#3A2A44" seed={1} />
      <Building x={590} y={180} width={80} height={150} body="#1B1D45" bodyDark="#0B0C1F" litColor="#2DE8FF" dimColor="#3A2A44" seed={3} />
      <Building x={680} y={160} width={70} height={170} body="#231F4A" bodyDark="#0B0C1F" litColor="#FF4477" dimColor="#3A2A44" seed={2} />
      <Building x={755} y={200} width={45} height={130} body="#1B1D45" bodyDark="#0B0C1F" litColor="#2DE8FF" dimColor="#3A2A44" seed={0} />

      {/* NEO CITY marquee, top of the near skyline */}
      <rect x="520" y="150" width="94" height="26" fill="#0B0C1F" stroke="#2DE8FF" strokeWidth="2" />
      <text x="567" y="167" textAnchor="middle" className="font-pixel" fontSize="9" fill="#2DE8FF">
        NEO CITY
      </text>

      {/* abstract arch monument straddling the vanishing point — noisy
          blue/purple silhouette, no true circle, just stacked rows + pillars */}
      <g>
        <rect x="340" y="220" width="36" height="110" fill="#3B4FA0" />
        <rect x="430" y="220" width="36" height="110" fill="#3B4FA0" />
        {Array.from({ length: 9 }).map((_, i) => {
          const rows = 9
          const domeR = 63
          const cx = 403
          const t = (i + 0.5) / rows - 0.5
          const halfW = Math.sqrt(Math.max(0, 0.25 - t * t)) * domeR * 2
          const y = 170 + (i * 50) / rows
          return <rect key={i} x={cx - halfW} y={y} width={halfW * 2} height={50 / rows + 0.5} fill="#3B4FA0" />
        })}
        {/* noise dots — deterministic pseudo-scatter, not Math.random, so it
            never flickers on re-render */}
        {Array.from({ length: 46 }).map((_, i) => {
          const cols = 6
          const row = Math.floor(i / cols)
          const col = i % cols
          const x = 342 + col * 22 + ((row * 7) % 11)
          const y = 178 + row * 16
          if ((row + col) % 3 === 0) return null
          return <rect key={i} x={x} y={y} width={6} height={6} fill="#7B5FD1" opacity={0.75} />
        })}
      </g>

      {/* horizon glow wash at the base of the skyline */}
      <rect x="0" y="322" width="800" height="10" fill="#FF8FAE" opacity="0.15" />

      {/* left/right shoulders */}
      <polygon points="0,450 60,450 340,330 300,330" fill="#2A1E3A" />
      <polygon points="800,450 740,450 460,330 500,330" fill="#2A1E3A" />

      {/* road — converging trapezoid toward the arch's base */}
      <polygon points="60,450 740,450 460,330 340,330" fill="#181229" />
      {/* side lines */}
      <polygon points="60,450 64,450 341,330 338,330" fill="#EAF7FF" opacity="0.5" />
      <polygon points="740,450 736,450 459,330 462,330" fill="#EAF7FF" opacity="0.5" />
      {/* dashed center line, dashes shrinking toward the horizon */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6 // 0 near horizon .. 1 at the bottom
        const y = 330 + t * 120
        const w = 4 + t * 10
        const h = 10 + t * 22
        const x = 400 - w / 2
        return <rect key={i} x={x} y={y} width={w} height={h} fill="#E8B34D" opacity={0.85} />
      })}

      {/* DISTRICT 7 ground signage, low-glow text near the left shoulder */}
      <text x="30" y="345" className="font-pixel" fontSize="10" fill="#FF4477" opacity="0.85">
        DISTRICT 7
      </text>

      {/* foreground streetlamps flanking the wide part of the road */}
      <StreetLamp x={90} y={330} poleColor="#EAF7FF" glowColor="#2DE8FF" poleHeight={90} />
      <StreetLamp x={710} y={330} poleColor="#EAF7FF" glowColor="#2DE8FF" poleHeight={90} />
    </svg>
  )
}
