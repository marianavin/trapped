const VARIANTS = {
  default: 'border-white text-white bg-black/40 hover:bg-white/10',
  primary: 'border-accent-cyan text-accent-cyan bg-black/40 hover:bg-accent-cyan/10',
  danger: 'border-accent-red text-accent-red bg-black/40 hover:bg-accent-red/10',
  prompt: 'border-l3-prompt text-l3-prompt bg-black/40 hover:bg-l3-prompt/10',
  dark: 'border-l4text text-l4text bg-l4panel hover:bg-l4text/10',
  light: 'border-l4text text-l4text bg-black/30 hover:bg-l4text/10',
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
        'font-pixel text-[10px] sm:text-xs px-5 py-3 border-2 rounded-sm neon-glow transition-all duration-100',
        'active:scale-95 active:brightness-125',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan',
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
