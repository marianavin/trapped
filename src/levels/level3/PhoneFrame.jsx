import { cloneElement, useEffect, useState } from 'react'
import { PHONE_IMAGE_SRC, DISPLAY_POSITION, STATUS_RIGHT_POSITION } from './keypadPositions.js'
import { PHONE } from './phoneTheme.js'

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

export default function PhoneFrame({ display, statusRight = '', children }) {
  const imageOk = useImageAvailable(PHONE_IMAGE_SRC)

  if (imageOk) {
    return (
      <div
        className="phone-chassis-glow relative mx-auto w-[218px] sm:w-[251px] select-none rounded-[40px] p-[2.5px]"
        style={{
          background: `linear-gradient(180deg, ${PHONE.chassisFrom}, ${PHONE.chassisTo})`,
        }}
      >
        <img
          src={PHONE_IMAGE_SRC}
          alt=""
          draggable={false}
          className="w-full h-auto block pointer-events-none rounded-[38px]"
        />
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 font-mono tracking-widest text-xl sm:text-2xl tabular-nums"
          style={{
            left: `${DISPLAY_POSITION.x}%`,
            top: `${DISPLAY_POSITION.y}%`,
            color: PHONE.display,
            textShadow: `0 0 6px ${PHONE.display}88`,
          }}
        >
          {display || ' '}
        </div>
        {statusRight && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 font-pixel text-[8px] sm:text-[9px] whitespace-nowrap"
            style={{
              left: `${STATUS_RIGHT_POSITION.x}%`,
              top: `${STATUS_RIGHT_POSITION.y}%`,
              color: PHONE.clock,
            }}
          >
            {statusRight}
          </div>
        )}
        {cloneElement(children, { imageMode: true })}
      </div>
    )
  }

  return (
    <div
      className="phone-chassis-glow relative mx-auto rounded-[40px] p-[3px] w-[234px] sm:w-[251px] select-none"
      style={{
        background: `linear-gradient(180deg, ${PHONE.chassisFrom} 0%, #FF3131 55%, ${PHONE.chassisTo} 100%)`,
      }}
    >
      <div className="absolute top-[10px] left-1/2 -translate-x-1/2 h-5 w-28 rounded-b-2xl bg-black z-20" aria-hidden="true" />

      <div
        className="relative rounded-[38px] overflow-hidden flex flex-col items-center px-4 pt-8 pb-5"
        style={{
          backgroundColor: PHONE.screenBg,
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)',
        }}
      >
        <div className="w-full flex justify-between items-center font-mono text-[11px] px-1 mb-2">
          <span style={{ color: PHONE.clock, textShadow: `0 0 4px ${PHONE.clock}66` }}>9:41</span>
          {statusRight && (
            <span className="font-pixel text-[8px] sm:text-[9px]" style={{ color: PHONE.clock }}>
              {statusRight}
            </span>
          )}
        </div>

        <div className="w-full min-h-[40px] my-10 flex items-center justify-center">
          <span
            className="font-mono tracking-[0.35em] text-xl sm:text-2xl tabular-nums"
            style={{ color: PHONE.display, textShadow: `0 0 8px ${PHONE.display}66` }}
          >
            {display || ' '}
          </span>
        </div>

        <div className="relative w-full mt-2">{cloneElement(children, { imageMode: false })}</div>
      </div>
    </div>
  )
}
