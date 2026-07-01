import { motion } from 'framer-motion'
import Typewriter from './Typewriter.jsx'
import WindowChrome from './WindowChrome.jsx'

export default function DialogueBox({ text, sub, title = 'MESSAGE', tone = 'cyan', onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-md w-full"
    >
      <WindowChrome title={title} tone={tone} className="text-l4text">
        <Typewriter
          text={text}
          speed={22}
          onDone={onDone}
          className="font-mono text-sm sm:text-base leading-relaxed"
        />
        {sub && <p className="font-mono text-xs text-l4-muted mt-2">{sub}</p>}
      </WindowChrome>
    </motion.div>
  )
}
