import { motion } from 'framer-motion'
import WindowChrome from '../../components/WindowChrome.jsx'

const HUD_CORNER =
  'absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 w-[11.5rem] sm:w-52 max-w-[calc(100%-1.5rem)]'

export default function TrialHintHud({ hint, label = 'HINT', animate = false }) {
  if (!hint) return null

  const content = (
    <p className="font-mono text-[10px] sm:text-xs text-l4text leading-snug tracking-wide">{hint}</p>
  )

  return (
    <div className={HUD_CORNER}>
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
