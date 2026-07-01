import { cloneElement, useEffect, useState } from 'react'
import { PHONE_IMAGE_SRC, DISPLAY_POSITION, STATUS_RIGHT_POSITION } from './keypadPositions.js'

// Checked once per session and cached at module scope - every task mounts
// its own PhoneFrame, and there's no reason to re-probe the same asset
// every time.
let cachedStatus = null

function useImageAvailable(src) {
  const [status, setStatus] = useState(cachedStatus)
  useEffect(() => {
    if (cachedStatus !== null) return
    const img = new Image()
    img.onload = () => {
      cachedStatus = true
      setStatus(true)
    }
    img.onerror = () => {
      cachedStatus = false
      setStatus(false)
    }
    img.src = src
  }, [src])
  return status
}

// Wraps the Keypad in the actual phone-mockup artwork, positioning the
// dialled-digits readout and the trial's status text directly on top of it.
// If `public/phone-frame.png` isn't present yet, falls back to a CSS-drawn
// chassis using this project's shared neon-glow / currentColor convention
// (see .pixel-border in index.css) so the game still runs end to end.
export default function PhoneFrame({ display, statusRight = '', children }) {
  const imageOk = useImageAvailable(PHONE_IMAGE_SRC)

  if (imageOk) {
    return (
      <div className="relative mx-auto w-[260px] sm:w-[300px] select-none">
        <img
          src={PHONE_IMAGE_SRC}
          alt=""
          draggable={false}
          className="w-full h-auto block pointer-events-none"
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 font-mono tracking-widest text-l3-prompt text-xl sm:text-2xl tabular-nums"
          style={{ left: `${DISPLAY_POSITION.x}%`, top: `${DISPLAY_POSITION.y}%` }}
        >
          {display || ' '}
        </div>
        {statusRight && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 font-pixel text-[8px] sm:text-[9px] text-accent-magenta whitespace-nowrap"
            style={{ left: `${STATUS_RIGHT_POSITION.x}%`, top: `${STATUS_RIGHT_POSITION.y}%` }}
          >
            {statusRight}
          </div>
        )}
        {cloneElement(children, { imageMode: true })}
      </div>
    )
  }

  return (
    <div className="pixel-border relative mx-auto rounded-[36px] p-2 w-[280px] sm:w-[300px] text-l3-prompt bg-l3-bg">
      <div className="absolute top-1 left-1/2 -translate-x-1/2 h-4 w-24 rounded-b-2xl bg-black z-10 border border-l3-prompt/40" />
      <div className="rounded-[28px] px-4 pt-6 pb-4 flex flex-col items-center gap-3">
        <div className="w-full flex justify-between items-center font-mono text-[10px] px-1">
          <span className="text-l3-prompt">9:41</span>
          <span className="text-accent-magenta">{statusRight}</span>
        </div>
        <div className="w-full min-h-[48px] my-6 flex items-center justify-center">
          <span className="font-light tracking-widest text-2xl sm:text-3xl tabular-nums text-l3-prompt">
            {display || ' '}
          </span>
        </div>
        {cloneElement(children, { imageMode: false })}
        <div className="mt-2 h-1 w-24 rounded-full bg-l3-prompt/60" />
      </div>
    </div>
  )
}
