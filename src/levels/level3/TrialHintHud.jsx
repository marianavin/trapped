import { motion } from 'framer-motion'
import WindowChrome from '../../components/WindowChrome.jsx'
import { useTrialHintState } from './TrialHintContext.jsx'

export default function TrialHintHud({ hint, label = 'HINT', animate = false }) {
  if (!hint) return null

  const content = (
    <p className="font-mono text-xs sm:text-sm text-l3-label leading-relaxed">{hint}</p>
  )

  return (
    <div className="w-[11.5rem] sm:w-52 shrink-0">
      <WindowChrome title={label} bodyClassName="!p-2 sm:!p-3">
        {animate ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {content}
          </motion.div>
        ) : (
          content
        )}
      </WindowChrome>
    </div>
  )
}

export function TrialHintSlot() {
  const ctx = useTrialHintState()
  if (!ctx?.hint) return null
  return <TrialHintHud hint={ctx.hint} animate={ctx.animate} />
}
