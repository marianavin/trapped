import { useEffect, useRef, useState } from 'react'

export default function Typewriter({ text, speed = 28, onDone, className = '' }) {
  const [shown, setShown] = useState('')
  // Keep latest onDone/speed available to the interval without restarting
  // the typewriter on every parent re-render (callers often pass inline
  // onDone functions that get a new reference each render).
  const onDoneRef = useRef(onDone)
  const speedRef = useRef(speed)
  useEffect(() => {
    onDoneRef.current = onDone
    speedRef.current = speed
  })

  useEffect(() => {
    setShown('')
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(id)
        onDoneRef.current && onDoneRef.current()
      }
    }, speedRef.current)
    return () => clearInterval(id)
  }, [text])

  return <p className={className}>{shown}</p>
}
