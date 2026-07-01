import { useContext } from 'react'
import TrialTimer, { LevelTimerContext } from './TrialTimer.jsx'

// Shared trial chrome — stacked layout so phone + keypad scroll on short viewports.
export default function TrialLayout({ header, phone, footer, overlay }) {
  const timeRemainingMs = useContext(LevelTimerContext)

  return (
    <div className="relative w-full min-h-full bg-l3-bg px-5 pt-6 pb-44">
      {overlay}
      {timeRemainingMs != null && (
        <div className="relative z-10 mb-4 text-center">
          <TrialTimer ms={timeRemainingMs} />
        </div>
      )}
      <div className="relative z-10 mx-auto min-h-[2.5rem] max-w-sm text-center">{header}</div>
      <div className="relative z-10 mt-6 flex justify-center overflow-visible">{phone}</div>
      <div className="relative z-10 mt-6 min-h-4 text-center">{footer}</div>
    </div>
  )
}
