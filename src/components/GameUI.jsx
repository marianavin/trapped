import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PixelButton from './PixelButton.jsx'
import WindowChrome from './WindowChrome.jsx'

const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan'

/** Hub / shell tab control */
export function TabButton({ id, label, active, controls, onClick, activeClassName = 'text-accent-cyan' }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className={[
        'font-pixel text-[8px] sm:text-[9px] px-2 py-2 rounded-sm transition-colors',
        FOCUS_RING,
        active ? activeClassName : 'text-l4-muted hover:text-l4text/80',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

/** Clickable card — level select, etc. */
const PANEL_ACCENT = {
  cyan: { border: 'neon-border-cyan', label: 'panel-label-cyan' },
  magenta: { border: 'neon-border-magenta', label: 'panel-label-magenta' },
  purple: { border: 'neon-border-purple', label: 'panel-label-purple' },
  caught: { border: 'neon-border-caught', label: 'text-caught' },
}

export function PanelCard({
  children,
  disabled = false,
  accent = 'cyan',
  textAccentOnly = false,
  onClick,
  className = '',
  ...rest
}) {
  const accentStyle = PANEL_ACCENT[accent] ?? PANEL_ACCENT.cyan
  const borderClass = disabled
    ? ''
    : textAccentOnly
      ? 'border-l4text/20'
      : accentStyle.border

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'text-left p-4 flex flex-col gap-2 transition-all border-2 rounded-sm',
        FOCUS_RING,
        disabled
          ? 'bg-l4bg/40 text-l4text/40 border-l4text/10 cursor-not-allowed opacity-50 saturate-[0.35] grayscale-[0.4]'
          : `gw-panel-grid text-l4text cursor-pointer hover:brightness-110 active:scale-[0.98] ${borderClass}`,
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}

export function panelAccentLabelClass(accent = 'cyan') {
  return (PANEL_ACCENT[accent] ?? PANEL_ACCENT.cyan).label
}

/** Non-interactive stat tile */
export function StatCard({ children, tone = 'cyan', className = '' }) {
  const toneClass = tone === 'caught' ? 'neon-border-caught text-caught' : 'neon-border-cyan text-escaped'
  return (
    <div className={`gw-panel-grid border-2 rounded-sm p-4 text-center ${toneClass} ${className}`}>{children}</div>
  )
}

/** Full-screen level wrapper — one background everywhere */
export function LevelScreen({ children, scroll = false, center = false, className = '' }) {
  const base = 'h-full w-full bg-l4bg text-l4text'
  const scrollClass = scroll ? 'overflow-y-auto gw-scrollbar' : 'overflow-hidden'

  if (scroll && center) {
    return (
      <div className={`${base} ${scrollClass}`}>
        <div className={`min-h-full flex flex-col items-center justify-center ${className}`}>{children}</div>
      </div>
    )
  }

  return (
    <div
      className={[base, scrollClass, center ? 'flex flex-col items-center justify-center' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/** Section title used on reveal / hub screens */
export function ScreenTitle({ children, className = '' }) {
  return (
    <h2
      className={`font-pixel text-sm sm:text-base text-center text-accent-cyan tracking-widest glitch-shift ${className}`}
    >
      {children}
    </h2>
  )
}

/** Reveal screen layout */
export function RevealScreen({ title, subtitle, children, actions }) {
  return (
    <LevelScreen scroll className="px-5 py-8 flex flex-col items-center gap-8">
      <div className="text-center">
        <ScreenTitle>{title}</ScreenTitle>
        {subtitle != null && <div className="font-mono text-sm mt-2">{subtitle}</div>}
      </div>
      <div className="w-full max-w-md flex flex-col gap-4">{children}</div>
      {actions && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          {actions}
        </motion.div>
      )}
    </LevelScreen>
  )
}

/** Auto-advancing setup lines */
export function SetupIntro({ lines, onDone, lineDelay = 1100, endDelay = 1400 }) {
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    if (lineIndex < lines.length - 1) {
      const t = setTimeout(() => setLineIndex((i) => i + 1), lineDelay)
      return () => clearTimeout(t)
    }
    const t = setTimeout(onDone, endDelay)
    return () => clearTimeout(t)
  }, [lineIndex, lines.length, onDone, lineDelay, endDelay])

  return (
    <LevelScreen center className="px-6 text-center gap-3">
      {lines.slice(0, lineIndex + 1).map((line) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-pixel text-sm sm:text-lg"
        >
          {line}
        </motion.p>
      ))}
    </LevelScreen>
  )
}

/** Outcome flash before reveal */
export function ConsequenceBeat({ lines, tone = 'success', onDone, delay = 1800 }) {
  const color = tone === 'fail' ? 'text-caught' : 'text-escaped'

  return <ConsequenceBeatInner lines={lines} color={color} onDone={onDone} delay={delay} />
}

function ConsequenceBeatInner({ lines, color, onDone, delay }) {
  useEffect(() => {
    const t = setTimeout(onDone, delay)
    return () => clearTimeout(t)
  }, [onDone, delay])

  return (
    <LevelScreen center className="px-6 text-center">
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.3 }}
          className={`font-pixel text-lg sm:text-2xl ${color}`}
        >
          {line}
        </motion.p>
      ))}
    </LevelScreen>
  )
}

/** Cabinet loading state — cycling system boot lines */
const LOADING_LINES = [
  'BOOTING NEURAL MAZE…',
  'LOADING SUBJECT FILE…',
  'MAPPING COGNITIVE TRAPS…',
  'VERIFYING BIASES…',
]

export function LoadingScreen({ message }) {
  const [lineIndex, setLineIndex] = useState(0)
  const lines = message ? [message] : LOADING_LINES

  useEffect(() => {
    if (lines.length <= 1) return
    const t = setInterval(() => setLineIndex((i) => (i + 1) % lines.length), 1400)
    return () => clearInterval(t)
  }, [lines.length])

  return (
    <LevelScreen center>
      <p role="status" aria-live="polite" className="font-pixel text-xs text-accent-cyan glitch-shift">
        {lines[lineIndex]}
      </p>
    </LevelScreen>
  )
}

/** Brief CRT flash on screen cuts */
export function ScreenFlash({ show }) {
  if (!show) return null
  return <div className="screen-flash pointer-events-none" aria-hidden="true" />
}

/** In-world confirm — never use browser chrome mid-game */
export function AbortDialog({ open, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
      <WindowChrome title="ABORT PROTOCOL" tone="danger" className="w-full max-w-xs">
        <p className="font-mono text-xs text-l4text text-center leading-relaxed mb-4">
          EXIT THIS LEVEL?
          <br />
          PROGRESS WON&apos;T BE SAVED.
        </p>
        <div className="flex gap-3 justify-center">
          <PixelButton variant="ghost" size="sm" onClick={onCancel}>
            STAY
          </PixelButton>
          <PixelButton variant="danger" size="sm" onClick={onConfirm}>
            ABORT
          </PixelButton>
        </div>
      </WindowChrome>
    </div>
  )
}

/** Pixel-styled text input */
export function TextInput({ className = '', ...props }) {
  return (
    <input
      className={[
        'font-pixel text-[10px] w-full bg-black/40 rounded-sm border-[1.5px] border-accent-cyan text-l4text px-3 py-3 text-center',
        'placeholder:text-l4-muted',
        'focus:outline-none focus-visible:outline-none focus:ring-0 focus:border-accent-cyan',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

/** Leaderboard / progress list row */
export function ListRow({ children, highlight = false, className = '' }) {
  return (
    <li
      className={[
        'flex items-center gap-3 font-mono text-xs sm:text-sm py-3 border-b border-accent-cyan/10',
        highlight ? 'bg-accent-cyan/5' : '',
        className,
      ].join(' ')}
    >
      {children}
    </li>
  )
}

export function RankBadge({ rank }) {
  const label = rank === 0 ? '1ST' : rank === 1 ? '2ND' : rank === 2 ? '3RD' : String(rank + 1)
  const accent = rank < 3 ? 'text-accent-cyan' : 'text-l4-muted'
  return (
    <span className={`font-pixel text-[8px] sm:text-[9px] w-7 text-center shrink-0 ${accent}`}>{label}</span>
  )
}

/** Standard reveal action buttons */
export function RevealActions({ success, onNext, onRetry }) {
  return success ? (
    <PixelButton variant="primary" onClick={onNext}>
      NEXT
    </PixelButton>
  ) : (
    <PixelButton variant="danger" onClick={onRetry}>
      TRY AGAIN
    </PixelButton>
  )
}
