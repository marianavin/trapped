import { motion } from 'framer-motion'
import BombArt from './BombArt.jsx'
import WindowChrome from '../components/WindowChrome.jsx'
import PixelButton from '../components/PixelButton.jsx'
import { LEGEND_SWATCHES } from '../data/level2.js'

export function BombWireKey({
  legendLabel,
  legendRows,
  showRecheck,
  onRecheck,
  showCutNow,
  onCutNow,
  className = '',
}) {
  return (
    <div
      className={[
        'absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-2',
        'w-[11.5rem] sm:w-52 max-w-[calc(100%-1.5rem)]',
        className,
      ].join(' ')}
    >
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
        {showRecheck && (
          <PixelButton variant="primary" size="sm" full onClick={onRecheck} className="mt-2">
            RE-CHECK THE KEY
          </PixelButton>
        )}
      </WindowChrome>
      {showCutNow && (
        <PixelButton variant="danger" size="sm" onClick={onCutNow}>
          CUT NOW
        </PixelButton>
      )}
    </div>
  )
}

export default function BombPanel({
  wires,
  currentWireId,
  mm,
  ss,
  secondsLeft = 60,
  message,
  messageHint,
  onWireClick,
  wiresClickable,
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
          {messageHint && (
            <p className="font-mono text-[10px] sm:text-xs text-accent-cyan/90 mt-2 leading-snug">{messageHint}</p>
          )}
        </WindowChrome>
      )}

      <motion.div
        className="w-full border-2 border-black shadow-window-offset"
        animate={urgent ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
        transition={{ duration: 0.4, repeat: urgent ? Infinity : 0 }}
      >
        <BombArt
          mm={mm}
          ss={ss}
          urgent={urgent}
          wires={wires}
          currentWireId={currentWireId}
          wiresClickable={wiresClickable}
          onWireClick={onWireClick}
        />
      </motion.div>
    </div>
  )
}
