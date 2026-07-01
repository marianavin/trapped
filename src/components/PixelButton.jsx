const VARIANTS = {
  default: 'border-white text-white bg-black/40 hover:bg-white/10',
  primary: 'border-accent-cyan text-accent-cyan bg-black/40 hover:bg-accent-cyan/10',
  danger: 'border-accent-red text-accent-red bg-black/40 hover:bg-accent-red/10',
  prompt: 'border-l3-prompt text-l3-prompt bg-black/40 hover:bg-l3-prompt/10',
  dark: 'border-l4text text-l4text bg-l4panel hover:bg-l4text/10',
  light: 'border-l4text text-l4text bg-black/30 hover:bg-l4text/10',
  purple: 'border-[#4A3FA8] text-white bg-[#4A3FA8] hover:bg-[#5A4BB8] active:brightness-95 purple-glow-pulse',
  ghost: 'border-l4text/50 text-l4text bg-black/30 hover:bg-white/5 hover:border-l4text/80',
}

const SIZES = {
  xs: 'text-[8px] sm:text-[9px] px-2 py-1.5',
  sm: 'text-[9px] sm:text-[10px] px-3 py-2',
  md: 'text-[10px] sm:text-xs px-5 py-3',
}

export default function PixelButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  full = false,
  className = '',
}) {
  const isGhost = variant === 'ghost'
  const isPurple = variant === 'purple'
  const glow = isGhost ? '' : isPurple ? '' : 'neon-glow'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        'font-pixel border-2 rounded-sm transition-all duration-100',
        SIZES[size] || SIZES.md,
        glow,
        'active:scale-95',
        isGhost ? 'active:brightness-100' : 'active:brightness-125 hover:brightness-125',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-cyan',
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
