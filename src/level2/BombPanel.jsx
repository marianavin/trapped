import { motion } from 'framer-motion'
import BombArt from './BombArt.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import { LEGEND_SWATCHES } from '../data/level2.js'

const HUD_STACK = 'flex flex-col gap-2 w-full'

export function BombPlayHud({ legendLabel, legendRows, className = '' }) {
  return (
    <div className={[HUD_STACK, className].filter(Boolean).join(' ')}>
      <WindowChrome title={legendLabel} bodyClassName="!p-2 sm:!p-3">
        <ul className="flex flex-col gap-1.5">
          {legendRows.map((row) => (
            <li key={row} className="font-mono text-[10px] sm:text-xs text-l4text flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block w-3 h-3 border-2 border-black shrink-0"
                style={{
                  background: row.startsWith('BLUE')
                    ? LEGEND_SWATCHES.BLUE
                    : row.startsWith('RED')
                      ? LEGEND_SWATCHES.RED
                      : LEGEND_SWATCHES.YELLOW,
                }}
              />
              <span>{row}</span>
            </li>
          ))}
        </ul>
      </WindowChrome>
    </div>
  )
}

export default function BombPanel({
  wires,
  selectedWireId,
  mm,
  ss,
  secondsLeft = 60,
  message,
  onWireClick,
  wiresClickable,
  showConfirmWire,
  onConfirmWire,
  showCutNow,
  onCutNow,
  hud,
}) {
  const urgent = secondsLeft > 0 && secondsLeft <= 5

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
      {message && (
        <WindowChrome
          title="VOICE // INCOMING"
          className="w-full"
          bodyClassName="!p-2 sm:!p-3"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="font-mono text-[11px] sm:text-sm text-l4text leading-snug">{message}</p>
        </WindowChrome>
      )}

      <motion.div
        className="w-full border-2 border-black shadow-window-offset flex items-center justify-center"
        animate={urgent ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.4, repeat: urgent ? Infinity : 0 }}
      >
        <BombArt
          mm={mm}
          ss={ss}
          urgent={urgent}
          wires={wires}
          selectedWireId={selectedWireId}
          wiresClickable={wiresClickable}
          onWireClick={onWireClick}
          showConfirmWire={showConfirmWire}
          onConfirmWire={onConfirmWire}
          showCutNow={showCutNow}
          onCutNow={onCutNow}
        />
      </motion.div>

      {hud}
    </div>
  )
}
