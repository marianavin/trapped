import { useEffect, useState } from 'react'

export default function Typewriter({ text, speed = 28, onDone, className = '' }) {
  const [shown, setShown] = useState('')

  useEffect(() => {
    setShown('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDone && onDone()
      }
    }, speed)
    return () => clearInterval(id)
  }, [text])

  return <p className={className}>{shown}</p>
}
