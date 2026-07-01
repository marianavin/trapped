// A hand-built (no image asset) bomb-panel scene: dynamite sticks, a
// circuit board, an embedded LED countdown, and physical wires the player
// clicks directly to cut — matching the rest of the codebase's convention
// of pure CSS/Tailwind shapes instead of raster art (see the QA report on
// Levels 3-4), but with enough distinct silhouettes that it reads as a bomb
// panel rather than a wireframe.
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
  return (
    <div
      className="relative w-full mx-auto select-none"
      style={{ maxWidth: 560, aspectRatio: '16 / 10' }}
    >
      {/* scene backdrop */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{ background: 'linear-gradient(180deg, #1A211C 0%, #060A07 75%)', border: '2px solid #000' }}
      />

      {/* dynamite bundle */}
      <div className="absolute flex gap-[3%]" style={{ left: '6%', top: '6%', width: '48%', height: '26%' }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-full"
            style={{
              background: 'linear-gradient(180deg, #E85D5D 0%, #8A1F1F 65%, #4A0F0F 100%)',
              border: '2px solid #2A0A0A',
            }}
          />
        ))}
      </div>

      {/* circuit board panel */}
      <div
        className="absolute rounded-md"
        style={{
          left: '6%',
          top: '32%',
          width: '88%',
          height: '58%',
          background: 'linear-gradient(155deg, #123B23 0%, #0A2617 100%)',
          border: '3px solid #04150C',
          boxShadow: 'inset 0 0 18px rgba(0,0,0,0.65)',
        }}
      >
        {/* decorative chips */}
        <div className="absolute rounded-sm" style={{ left: '5%', top: '8%', width: '13%', height: '16%', background: '#0B1F13', border: '1px solid #000' }} />
        <div className="absolute rounded-sm" style={{ left: '5%', top: '28%', width: '13%', height: '16%', background: '#0B1F13', border: '1px solid #000' }} />

        {/* LED countdown */}
        <div
          className="absolute rounded flex items-center justify-center"
          style={{ right: '5%', top: '7%', width: '38%', height: '20%', background: '#020A04', border: '2px solid #000' }}
        >
          <span className="font-pixel text-l2-accent tabular-nums" style={{ fontSize: 'clamp(10px, 3.4vw, 20px)' }}>
            {mm}:{ss}
          </span>
        </div>

        {/* wires */}
        {wires.map((w, i) => {
          const isCurrent = w.id === currentWireId
          const nicked = isCurrent
          return (
            <button
              key={w.id}
              type="button"
              disabled={!wiresClickable}
              onClick={() => onWireClick(w.id)}
              aria-label={`Cut ${w.label}`}
              className={[
                'absolute flex items-center focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
                wiresClickable ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
              style={{ left: '4%', top: `${44 + i * 16}%`, width: '58%', height: '10%' }}
            >
              <span
                className="block h-[38%] rounded-sm"
                style={{
                  width: nicked ? '55%' : '100%',
                  background: w.color,
                  border: '2px solid #0A0A0A',
                  transition: 'width 120ms ease-out',
                }}
              />
              {nicked && (
                <span
                  className="block h-[38%] rounded-sm origin-left"
                  style={{
                    width: '40%',
                    background: w.color,
                    border: '2px solid #0A0A0A',
                    transform: 'rotate(20deg) translateY(35%)',
                    transition: 'transform 160ms ease-out',
                  }}
                />
              )}
              {isCurrent && (
                <span className="absolute -top-4 left-[52%] text-xs" aria-hidden="true">
                  ✂️
                </span>
              )}
            </button>
          )
        })}

        {/* final-stage confirm button, styled like a detonator control */}
        {showCutNow && (
          <button
            type="button"
            onClick={onCutNow}
            className="absolute rounded-full flex items-center justify-center font-pixel text-white text-[9px] sm:text-[10px] active:scale-95 transition-transform focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            style={{
              right: '5%',
              bottom: '6%',
              width: '20%',
              aspectRatio: '1 / 1',
              background: 'radial-gradient(circle at 35% 30%, #ff8a8a 0%, #e02424 45%, #6b1010 100%)',
              border: '2px solid #1a1a1a',
              boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,255,255,0.3)',
            }}
          >
            CUT NOW
          </button>
        )}
      </div>

      {/* instruction speech bubble */}
      {message && (
        <div
          className="absolute rounded bg-white text-black p-2 sm:p-3"
          style={{ right: '3%', top: '2%', width: '52%' }}
        >
          <p className="font-mono text-[9px] sm:text-xs leading-snug">{message}</p>
        </div>
      )}

      {/* legend card */}
      {showLegend && (
        <div
          className="absolute rounded p-2 sm:p-3"
          style={{ left: '2%', bottom: '2%', width: '42%', background: '#F5F5F0', color: '#1A1A1A' }}
        >
          <p className="font-pixel text-[6px] sm:text-[7px] tracking-wide text-gray-500 mb-1">{legendLabel}</p>
          {legendRows.map((row) => (
            <p key={row} className="font-mono text-[8px] sm:text-[10px] leading-tight">
              {row}
            </p>
          ))}
          {showRecheck && (
            <button
              type="button"
              onClick={onRecheck}
              className="mt-1 font-pixel text-[7px] sm:text-[8px] underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              🔍 RE-CHECK THE KEY
            </button>
          )}
        </div>
      )}
    </div>
  )
}
