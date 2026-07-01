/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"Courier New"', 'monospace'],
      },
      colors: {
        // Level 1 — The Escape (Fire)
        'l1-bg': '#0D0D0D',
        'l1-smoke': '#2A2A2A',
        'l1-danger': '#FF2D2D',
        'l1-correct': '#5A5A5A',
        'l1-text': '#FFB347',
        'l1-overlay': '#CCCCCC',

        // Level 4 — The Witness (Night Street)
        l4bg: '#0A0E1A',
        l4street: '#FFD166',
        l4panel: '#1E2A3A',
        l4text: '#E8E8E8',
        l4flash: '#FFF8E7',
        wrong: '#FF4444',
        correct: '#44FF88',

        // Level 2 — The Bomb (cold terminal green/black bomb panel)
        'l2-bg': '#04120A',
        'l2-panel': '#0C2A1B',
        'l2-text': '#B8FFC9',
        'l2-accent': '#00FF41',

        // Level 3 — The Scrambled Keypad (Clinical)
        // NOTE: reconstructed from TRAPPED_Visual_Sound_Reference.md after an
        // accidental overwrite of this file — l3-label wasn't in the doc's
        // table explicitly, so it's a best-effort pale tint alongside l3-prompt.
        // Worth a quick visual diff against intent.
        'l3-bg': '#1A1A2E',
        'l3-face': '#3A3A4A',
        'l3-prompt': '#A8C8E8',
        'l3-label': '#D8E8F5',
        'l3-error': '#FF4444',
        'l3-success': '#44FF88',

        // Reveal screen (shared across all levels)
        revealbg: '#F5F5F5',
        revealtext: '#1A1A1A',
        escaped: '#2ECC71',
        caught: '#E74C3C',
        'reveal-bg': '#F5F5F5',
        'reveal-text': '#1A1A1A',
        'reveal-escaped': '#2ECC71',
        'reveal-caught': '#E74C3C',
      },
    },
  },
  plugins: [],
}
