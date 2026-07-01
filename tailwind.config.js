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
        // Glitchwave palette — matched to the reference UI kit image.
        // Token names stay stable so existing components repaint for free.
        'accent-cyan': '#00F0FF',
        'accent-magenta': '#FF00FF',
        'accent-red': '#FF3131',

        // Level 4 — The Witness
        l4bg: '#121225',
        l4street: '#00F0FF',
        l4panel: '#1A1A3A',
        l4text: '#E8F8FF',
        l4flash: '#F5FBFF',
        wrong: '#FF3131',
        correct: '#00F0FF',

        // Level 2 — The Bomb
        'l2-bg': '#121225',
        'l2-panel': '#1A1A3A',
        'l2-text': '#CFEFFF',
        'l2-accent': '#00F0FF',

        // Level 3 — The Scrambled Keypad
        'l3-bg': '#121225',
        'l3-face': '#1A1A3A',
        'l3-prompt': '#00F0FF',
        'l3-label': '#CFEFFF',
        'l3-error': '#FF3131',
        'l3-success': '#00F0FF',

        // Reveal — light "printed document" surfaces on the dark grid
        revealbg: '#F0F0F5',
        revealtext: '#121225',
        escaped: '#00F0FF',
        caught: '#FF3131',
        'reveal-bg': '#F0F0F5',
        'reveal-text': '#121225',
        'reveal-escaped': '#00A8C0',
        'reveal-caught': '#C62828',
      },
      boxShadow: {
        'neon-cyan': '0 0 4px #00F0FF, 0 0 14px #00F0FF88, 0 0 28px #00F0FF44',
        'neon-magenta': '0 0 4px #FF00FF, 0 0 14px #FF00FF88, 0 0 28px #FF00FF44',
        'neon-red': '0 0 4px #FF3131, 0 0 14px #FF313188, 0 0 28px #FF313144',
        'window-offset': '4px 4px 0 rgba(0, 0, 0, 0.55)',
      },
    },
  },
  plugins: [],
}
