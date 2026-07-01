import { createContext } from 'react'

// Level-wide countdown — lives in the scrollable trial layout (not viewport-fixed).
// Format: MM:SS:CS (centiseconds), e.g. 00:20:00 at start, 00:00:00 at expiry.
export const LevelTimerContext = createContext(null)

export function formatLevelTimer(ms) {
  const clamped = Math.max(0, ms)
  const totalCs = Math.floor(clamped / 10)
  const minutes = Math.floor(totalCs / 6000)
  const seconds = Math.floor((totalCs % 6000) / 100)
  const centis = totalCs % 100
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centis).padStart(2, '0')}`
}

export default function TrialTimer({ ms }) {
  const urgent = ms <= 5000
  return (
    <p
      className={`pointer-events-none font-pixel text-xl tabular-nums text-l3-error ${
        urgent ? 'animate-pulse' : ''
      }`}
    >
      {formatLevelTimer(ms)}
    </p>
  )
}
