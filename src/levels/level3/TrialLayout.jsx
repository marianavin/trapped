import { useContext } from 'react'
import TrialTimer, { LevelTimerContext } from './TrialTimer.jsx'
import { TrialHintSlot } from './TrialHintHud.jsx'

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
      <div className="relative z-10 mt-6 w-full">
        <div className="flex justify-center">
          <div className="relative shrink-0">
            {phone}
            <div className="absolute left-full top-1/2 hidden -translate-y-1/2 pl-4 sm:block sm:pl-5">
              <TrialHintSlot />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center sm:hidden">
          <TrialHintSlot />
        </div>
      </div>
      <div className="relative z-10 mt-6 min-h-4 text-center">{footer}</div>
    </div>
  )
}
