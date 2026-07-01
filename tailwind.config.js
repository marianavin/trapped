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
        // --- Unified "glitchwave" system (2026 redesign) ---------------
        // Every level used to carry its own unrelated palette (amber fire,
        // green terminal, cool grey clinical, navy streetlight), which is
        // why the app read as four different apps stitched together. Per
        // design direction, there is now exactly one palette, reused by
        // every level and the shell: deep navy/grid background, cyan as
        // the single primary/interactive/success accent, magenta-red as
        // the single danger/fail accent. Token *names* below are left
        // untouched (dozens of components already reference l1-text,
        // l3-prompt, etc.) — only the hex values move, so every consumer
        // repaints for free without a find-and-replace across components.
        // The two shared brand accents also get their own generic names
        // for new code: `accent-cyan` / `accent-magenta`.
        'accent-cyan': '#2DE8FF',
        'accent-magenta': '#FF4477',

        // Level 4 — The Witness
        l4bg: '#12132B',
        l4street: '#2DE8FF',
        l4panel: '#1B1D45',
        l4text: '#EAF7FF',
        l4flash: '#F5FBFF',
        wrong: '#FF4477',
        correct: '#2DE8FF',

        // Level 2 — The Bomb
        'l2-bg': '#12132B',
        'l2-panel': '#1B1D45',
        'l2-text': '#CFEFFF',
        'l2-accent': '#2DE8FF',

        // Level 3 — The Scrambled Keypad
        'l3-bg': '#12132B',
        'l3-face': '#1B1D45',
        'l3-prompt': '#2DE8FF',
        'l3-label': '#CFEFFF',
        'l3-error': '#FF4477',
        'l3-success': '#2DE8FF',

        // Reveal screen — the one deliberately light "printed document"
        // surface (matches the reference's white system-alert/search
        // windows sitting on the dark grid), left as near-white/near-black
        // rather than folded into the dark palette.
        revealbg: '#F5F5F5',
        revealtext: '#1A1A1A',
        escaped: '#2DE8FF',
        caught: '#FF4477',
        'reveal-bg': '#F5F5F5',
        'reveal-text': '#1A1A1A',
        'reveal-escaped': '#0E8FA6',
        'reveal-caught': '#C0392B',
      },
    },
  },
  plugins: [],
}
