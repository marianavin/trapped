// Web Speech API wrapper for the "calm voice" that recites digits and
// addresses. Falls back silently if unavailable - every task also shows
// the phrase on-screen briefly so the game is still playable muted.

let voiceCache = null

function pickVoice() {
  if (voiceCache) return voiceCache
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  voiceCache =
    voices.find((v) => /en(-|_)?(GB|US)/i.test(v.lang) && /female|samantha|karen|zira/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0] ||
    null
  return voiceCache
}

export function speak(text, opts = {}) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = opts.rate ?? 0.85
    utter.pitch = opts.pitch ?? 0.95
    utter.volume = opts.volume ?? 0.9
    const v = pickVoice()
    if (v) utter.voice = v
    synth.speak(utter)
  } catch {
    // audio is enhancement, never blocking
  }
}

export function speakDigits(digits, opts = {}) {
  const spoken = digits.join(', ')
  speak(spoken, { rate: 0.7, ...opts })
}

export function cancelSpeech() {
  try {
    window.speechSynthesis?.cancel()
  } catch {
    // ignore
  }
}
