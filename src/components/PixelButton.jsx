// Shared across all levels. Neon-glow rounded button: colored border + text
// + soft glow (via .neon-glow, currentColor-driven — see index.css), no
// fill by default. Pressed/hover state brightens instead of inverting to a
// solid fill, matching the reference UI kit's glow-button language.
// variant covers the palettes each level/screen needs; className is always
// appended last so a caller (e.g. Reveal screens) can override with `!`
// utilities for a one-off palette without needing a new variant.
//
// `primary` / `danger` are the two the reveal screens should standardize
// on (cyan = proceed/NEXT, magenta = retry/TRY AGAIN) — previously every
// level rolled its own one-off (`variant="dark"` for both outcomes in some
// screens, `!border-white !text-white` overrides in others), which is why
// the same button meant something different on every level.
const VARIANTS = {
  default: 'border-white text-white bg-black/30 hover:bg-white/10',
  primary: 'border-accent-cyan text-accent-cyan bg-black/30 hover:bg-accent-cyan/10',
  danger: 'border-accent-magenta text-accent-magenta bg-black/30 hover:bg-accent-magenta/10',
  prompt: 'border-l3-prompt text-l3-prompt bg-black/30 hover:bg-l3-prompt/10',
  dark: 'border-l4text text-l4text bg-l4panel hover:bg-l4text/10',
  light: 'border-l4text text-l4text bg-black/20 hover:bg-l4text/10',
}

export default function PixelButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  full = false,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        'font-pixel text-[10px] sm:text-xs px-4 py-3 border-2 rounded-lg neon-glow transition-all duration-100',
        'active:scale-95 active:brightness-125',
        'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:brightness-125',
        full ? 'w-full' : '',
        VARIANTS[variant] || VARIANTS.default,
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
