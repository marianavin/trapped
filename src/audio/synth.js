// Tiny chiptune-style WAV synthesizer.
// Generates short 8-bit-feeling sound effects at runtime as PCM16 WAV data URLs,
// so the game ships with zero binary audio assets. Howler.js (see sounds.js)
// is used purely as the playback engine over these generated sources.
// Swap any of these for real Bfxr / Chiptone exports later without touching
// the rest of the game.

const SAMPLE_RATE = 22050

function encodeWav(samples) {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, samples.length * 2, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }

  const blob = new Blob([view], { type: 'audio/wav' })
  return URL.createObjectURL(blob)
}

function envelope(n, total, attack = 0.02, release = 0.35) {
  const a = attack * total
  const r = release * total
  if (n < a) return n / a
  if (n > total - r) return Math.max(0, (total - n) / r)
  return 1
}

// square / sine tone, quantized like an 8-bit voice
function tone({ freq, duration, type = 'square', volume = 0.25, sampleRate = SAMPLE_RATE }) {
  const total = Math.floor(duration * sampleRate)
  const samples = new Float32Array(total)
  for (let n = 0; n < total; n++) {
    const t = n / sampleRate
    let v
    if (type === 'square') {
      v = Math.sign(Math.sin(2 * Math.PI * freq * t))
    } else if (type === 'noise') {
      v = Math.random() * 2 - 1
    } else {
      v = Math.sin(2 * Math.PI * freq * t)
    }
    samples[n] = v * volume * envelope(n, total)
  }
  return samples
}

// linear frequency sweep - used for the siren wail
function sweep({ freqStart, freqEnd, duration, volume = 0.2, sampleRate = SAMPLE_RATE }) {
  const total = Math.floor(duration * sampleRate)
  const samples = new Float32Array(total)
  let phase = 0
  for (let n = 0; n < total; n++) {
    const t = n / total
    const freq = freqStart + (freqEnd - freqStart) * t
    phase += (2 * Math.PI * freq) / sampleRate
    samples[n] = Math.sign(Math.sin(phase)) * volume * envelope(n, total, 0.05, 0.05)
  }
  return samples
}

function concat(...arrays) {
  const total = arrays.reduce((sum, a) => sum + a.length, 0)
  const out = new Float32Array(total)
  let offset = 0
  for (const a of arrays) {
    out.set(a, offset)
    offset += a.length
  }
  return out
}

function silence(duration, sampleRate = SAMPLE_RATE) {
  return new Float32Array(Math.floor(duration * sampleRate))
}

function sequence(notes, gap = 0.02) {
  const parts = []
  notes.forEach((note, i) => {
    parts.push(tone(note))
    if (i < notes.length - 1) parts.push(silence(gap))
  })
  return concat(...parts)
}

export function makeUrl(samples) {
  return encodeWav(samples)
}

export const sounds = {
  bootChime: () =>
    makeUrl(
      sequence(
        [
          { freq: 523.25, duration: 0.09, type: 'square', volume: 0.22 },
          { freq: 659.25, duration: 0.09, type: 'square', volume: 0.22 },
          { freq: 783.99, duration: 0.16, type: 'square', volume: 0.24 },
        ],
        0.01
      )
    ),
  setupTone: () => makeUrl(tone({ freq: 196, duration: 0.5, type: 'sine', volume: 0.18 })),
  keyClick: () => makeUrl(tone({ freq: 880, duration: 0.045, type: 'square', volume: 0.18 })),
  wrongBuzz: () => makeUrl(tone({ freq: 110, duration: 0.3, type: 'square', volume: 0.28 })),
  connectSuccess: () =>
    makeUrl(
      sequence(
        [
          { freq: 392, duration: 0.08, type: 'square', volume: 0.22 },
          { freq: 523.25, duration: 0.08, type: 'square', volume: 0.22 },
          { freq: 659.25, duration: 0.08, type: 'square', volume: 0.22 },
          { freq: 880, duration: 0.18, type: 'square', volume: 0.26 },
        ],
        0.005
      )
    ),
  failPhrase: () =>
    makeUrl(
      sequence(
        [
          { freq: 392, duration: 0.14, type: 'square', volume: 0.22 },
          { freq: 329.63, duration: 0.14, type: 'square', volume: 0.22 },
          { freq: 261.63, duration: 0.22, type: 'square', volume: 0.24 },
        ],
        0.01
      )
    ),
  revealLoad: () => makeUrl(tone({ freq: 440, duration: 0.4, type: 'sine', volume: 0.14 })),
  biasCaught: () => makeUrl(tone({ freq: 150, duration: 0.22, type: 'sine', volume: 0.22 })),
  biasEscaped: () => makeUrl(tone({ freq: 990, duration: 0.12, type: 'square', volume: 0.2 })),
  sirenWail: () => makeUrl(sweep({ freqStart: 480, freqEnd: 740, duration: 1.4, volume: 0.1 })),

  // Level 1 — The Escape. Repeating pixel alarm blip, distinct from the
  // ambulance/phone siren wail used elsewhere — a short flat double-beep
  // that loops underneath play, per TRAPPED_Visual_Sound_Reference.md.
  alarmBlip: () =>
    makeUrl(
      sequence(
        [
          { freq: 740, duration: 0.11, type: 'square', volume: 0.22 },
          { freq: 740, duration: 0.11, type: 'square', volume: 0.22 },
        ],
        0.08
      )
    ),
  doorLock: () =>
    makeUrl(
      concat(
        tone({ freq: 130, duration: 0.12, type: 'square', volume: 0.26 }),
        tone({ freq: 90, duration: 0.22, type: 'square', volume: 0.24 })
      )
    ),

  // Level 4 — The Witness
  dispatcherRing: () =>
    makeUrl(
      sequence(
        [
          { freq: 480, duration: 0.35, type: 'sine', volume: 0.16 },
          { freq: 440, duration: 0.35, type: 'sine', volume: 0.16 },
        ],
        0.05
      )
    ),
  questionArrive: () => makeUrl(tone({ freq: 300, duration: 0.09, type: 'sine', volume: 0.14 })),
  impactHit: () =>
    makeUrl(
      concat(
        tone({ freq: 80, duration: 0.15, type: 'square', volume: 0.3 }),
        tone({ freq: 60, duration: 0.2, type: 'sine', volume: 0.2 })
      )
    ),
  consequenceStamp: () =>
    makeUrl(
      sequence(
        [
          { freq: 220, duration: 0.15, type: 'square', volume: 0.22 },
          { freq: 140, duration: 0.3, type: 'square', volume: 0.24 },
        ],
        0.01
      )
    ),

  // Act 2 — the newspaper. A short burst of noise stands in for a page
  // rustle/unfold; there's no clean "paper" timbre available from square/
  // sine oscillators alone, so noise is the closest fit in this synth.
  paperRustle: () =>
    makeUrl(
      concat(
        tone({ freq: 200, duration: 0.12, type: 'noise', volume: 0.08 }),
        tone({ freq: 200, duration: 0.08, type: 'noise', volume: 0.05 })
      )
    ),
}
