// A hand-built (no image asset) pixel-art bomb device: a flat-color blue
// chassis with red/black hazard-stripe end caps, corner rivets, a battery
// cell, an LED countdown, and status lights — styled like a retro
// platformer prop rather than a photoreal illustration. The player still
// cuts the physical wires running across the chassis; the flavor pieces
// (battery, lights) are decoration that sells the "device" silhouette.
const STRIPE_BG = 'repeating-linear-gradient(90deg, #C81E1E 0 9%, #141414 9% 13%)'

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
    <div className="relative w-full mx-auto select-none" style={{ maxWidth: 620, aspectRatio: '16 / 10' }}>
      {/* chassis */}
      <div
        className="absolute inset-x-0"
        style={{
          top: '16%',
          bottom: '16%',
          background: '#2E6DA8',
          border: '4px solid #0A0A0A',
          boxShadow: '6px 6px 0 rgba(0,0,0,0.55)',
        }}
      >
        {/* corner rivets */}
        {[
          { top: 6, left: 6 },
          { top: 6, right: 6 },
          { bottom: 6, left: 6 },
          { bottom: 6, right: 6 },
        ].map((corner, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{ width: 10, height: 10, background: '#B8B8B8', border: '2px solid #0A0A0A', ...corner }}
          />
        ))}

        {/* battery cell */}
        <div
          className="absolute flex flex-col-reverse overflow-hidden"
          style={{ left: '3%', top: '14%', width: '13%', height: '60%', background: '#333', border: '3px solid #0A0A0A' }}
        >
          <div style={{ height: '55%', background: '#4CD137', borderTop: '2px solid #2E8B1F' }} />
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
              style={{ left: '20%', top: `${20 + i * 22}%`, width: '46%', height: '12%' }}
            >
              <span
                className="block h-[45%]"
                style={{
                  width: nicked ? '55%' : '100%',
                  background: w.color,
                  border: '3px solid #0A0A0A',
                  transition: 'width 120ms ease-out',
                }}
              />
              {nicked && (
                <span
                  className="block h-[45%] origin-left"
                  style={{
                    width: '40%',
                    background: w.color,
                    border: '3px solid #0A0A0A',
                    transform: 'rotate(22deg) translateY(45%)',
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

        {/* LED countdown + status lights */}
        <div className="absolute flex flex-col gap-1" style={{ right: '3%', top: '10%', width: '26%' }}>
          <div
            className="flex items-center justify-center"
            style={{ background: '#0A0A0A', border: '3px solid #0A0A0A', padding: '4px 0' }}
          >
            <span className="font-pixel text-l2-accent tabular-nums" style={{ fontSize: 'clamp(9px, 3vw, 18px)' }}>
              {mm}:{ss}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-1" style={{ background: '#4A4A4A', border: '3px solid #0A0A0A' }}>
            <div className="flex items-center gap-1">
              <span className="rounded-full" style={{ width: 6, height: 6, background: '#3DDC5C' }} />
              <span className="font-pixel text-white leading-none" style={{ fontSize: 6 }}>
                DEFUSED
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="rounded-full animate-pulse" style={{ width: 6, height: 6, background: '#FF4444' }} />
              <span className="font-pixel text-white leading-none" style={{ fontSize: 6 }}>
                ARMED
              </span>
            </div>
          </div>
        </div>

        {/* final-stage confirm control */}
        {showCutNow && (
          <button
            type="button"
            onClick={onCutNow}
            className="absolute font-pixel text-white text-[8px] sm:text-[9px] px-2 py-2 active:translate-y-[2px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            style={{ right: '3%', bottom: '6%', background: '#C81E1E', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
          >
            CUT NOW
          </button>
        )}
      </div>

      {/* hazard-stripe end caps */}
      <div className="absolute inset-x-0" style={{ top: '13%', height: '5%', background: STRIPE_BG, border: '3px solid #0A0A0A' }} />
      <div className="absolute inset-x-0" style={{ bottom: '13%', height: '5%', background: STRIPE_BG, border: '3px solid #0A0A0A' }} />

      {/* instruction speech bubble */}
      {message && (
        <div className="absolute p-2 sm:p-3" style={{ right: '2%', top: '0%', width: '54%', background: '#FFFFFF', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}>
          <p className="font-mono text-[9px] sm:text-xs leading-snug text-black">{message}</p>
        </div>
      )}

      {/* legend card */}
      {showLegend && (
        <div
          className="absolute p-2 sm:p-3"
          style={{ left: '1%', bottom: '0%', width: '44%', background: '#F5F5F0', color: '#1A1A1A', border: '3px solid #0A0A0A', boxShadow: '3px 3px 0 rgba(0,0,0,0.4)' }}
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
