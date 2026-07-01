import { motion } from 'framer-motion'
import Typewriter from './Typewriter.jsx'

export default function DialogueBox({ text, sub, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="pixel-border bg-l4panel text-l4text p-4 max-w-md w-full"
    >
      <Typewriter
        text={text}
        speed={22}
        onDone={onDone}
        className="font-mono text-sm sm:text-base leading-relaxed"
      />
      {sub && <p className="font-mono text-xs text-l4text/60 mt-2">{sub}</p>}
    </motion.div>
  )
}
