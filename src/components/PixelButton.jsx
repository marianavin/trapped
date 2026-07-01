// Shared across all levels — reconstructed after an accidental overwrite.
// variant covers the palettes each level/screen needs; className is always
// appended last so a caller (e.g. Reveal screens) can override with `!`
// utilities for a one-off palette without needing a new variant.
const VARIANTS = {
  default: 'border-white text-white bg-transparent hover:bg-white hover:text-black',
  prompt: 'border-l3-prompt text-l3-prompt bg-transparent hover:bg-l3-prompt hover:text-l3-bg',
  dark: 'border-l4text text-l4text bg-l4panel hover:bg-l4text hover:text-l4panel',
  light: 'border-l4text text-l4text bg-transparent hover:bg-l4text hover:text-l4panel',
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
        'font-pixel text-[10px] sm:text-xs px-4 py-3 border-2 transition-colors duration-100',
        'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
        'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-yellow-300',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        full ? 'w-full' : '',
        VARIANTS[variant] || VARIANTS.default,
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
