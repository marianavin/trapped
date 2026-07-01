import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TrialHintContext = createContext(null)

export function TrialHintProvider({ children }) {
  const [hint, setHint] = useState(null)
  const [animate, setAnimate] = useState(false)
  const value = useMemo(() => ({ hint, animate, setHint, setAnimate }), [hint, animate])

  return <TrialHintContext.Provider value={value}>{children}</TrialHintContext.Provider>
}

export function useTrialHintState() {
  return useContext(TrialHintContext)
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
