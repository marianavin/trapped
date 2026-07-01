import { Howl, Howler } from 'howler'
import { sounds as gen } from './synth.js'

// Howl instances are created lazily on first play, both because generating
// the WAV data URLs eagerly is wasted work if the player never triggers a
// sound, and because mobile browsers require a user gesture before audio
// will play at all.
const cache = {}

function getHowl(key) {
  if (!cache[key]) {
    cache[key] = new Howl({ src: [gen[key]()], format: ['wav'] })
  }
  return cache[key]
}

export function play(key) {
  try {
    getHowl(key).play()
  } catch {
    // Audio is a non-blocking enhancement - never let it break play.
  }
}

let sirenHowl = null
let sirenTimer = null

export function startSiren() {
  if (sirenTimer) return
  const loop = () => {
    try {
      sirenHowl?.stop()
      sirenHowl = new Howl({ src: [gen.sirenWail()], format: ['wav'] })
      sirenHowl.play()
    } catch {
      // ignore
    }
  }
  loop()
  sirenTimer = setInterval(loop, 1500)
}

export function stopSiren() {
  if (sirenTimer) {
    clearInterval(sirenTimer)
    sirenTimer = null
  }
  sirenHowl?.stop()
  sirenHowl = null
}

/** Stop siren loop and every cached / in-flight Howl instance. */
export function stopAll() {
  stopSiren()
  try {
    Howler.stop()
  } catch {
    // ignore
  }
}
