import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import TrialHintHud from './TrialHintHud.jsx'

const TrialHintContext = createContext(null)

export function TrialHintProvider({ children }) {
  const [hint, setHint] = useState(null)
  const [animate, setAnimate] = useState(false)
  const value = useMemo(() => ({ setHint, setAnimate }), [])

  return (
    <TrialHintContext.Provider value={value}>
      <div className="relative h-full w-full overflow-hidden">
        {children}
        <TrialHintHud hint={hint} animate={animate} />
      </div>
    </TrialHintContext.Provider>
  )
}

export function useTrialHint(hint, { animate = false } = {}) {
  const ctx = useContext(TrialHintContext)

  useEffect(() => {
    if (!ctx) return
    ctx.setHint(hint)
    ctx.setAnimate(animate)
    return () => {
      ctx.setHint(null)
      ctx.setAnimate(false)
    }
  }, [hint, animate, ctx])
}
