import { Howl } from 'howler'

const cache = {}

function load(name) {
  if (!cache[name]) {
    cache[name] = new Howl({ src: [`/sounds/${name}.wav`], volume: 0.6 })
  }
  return cache[name]
}

export const SFX = {
  startChime: 'start_chime',
  setupTone: 'setup_tone',
  wrongBuzz: 'wrong_buzz',
  rightBlip: 'right_blip',
  failPhrase: 'fail_phrase',
  succeedMelody: 'succeed_melody',
  revealTone: 'reveal_tone',
  biasCaught: 'bias_caught',
  biasEscaped: 'bias_escaped',
  dispatcherRing: 'dispatcher_ring',
  questionArrive: 'question_arrive',
  impact: 'impact',
  consequence: 'consequence',
}

export function play(name) {
  try {
    load(name).play()
  } catch (e) {
    // audio can fail before first user gesture on some browsers — ignore
  }
}
