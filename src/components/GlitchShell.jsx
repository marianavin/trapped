// Shared screen wrapper — gives every shell screen the same glitchwave
// dashboard frame: optional chromatic title, content area, and a status
// footer matching the reference UI kit's build-id bar.
export function ScreenHeader({ title, subtitle, className = '' }) {
  return (
    <header className={`text-center px-6 ${className}`}>
      <h1 className="font-pixel text-xl sm:text-3xl tracking-widest glitch-title glitch-shift">{title}</h1>
      {subtitle && (
        <p className="font-mono text-sm sm:text-base text-l4text/75 mt-4 max-w-md mx-auto">{subtitle}</p>
      )}
    </header>
  )
}

export function StatusFooter({ left = 'TRAPPED v0.1', right = 'D&R FUNCTION DAYS' }) {
  return (
    <footer className="gw-status-bar px-4 py-2 flex items-center justify-between gap-3 shrink-0">
      <span className="font-mono text-[9px] sm:text-[10px] text-accent-cyan/70">{left}</span>
      <span className="font-mono text-[9px] sm:text-[10px] text-l4text/50">{right}</span>
    </footer>
  )
}

export default function GlitchShell({ children, footer, className = '', contentClassName = '' }) {
  return (
    <div className={`h-full w-full flex flex-col bg-l4bg text-l4text overflow-hidden ${className}`}>
      <div className={`flex-1 flex flex-col items-center justify-center overflow-y-auto ${contentClassName}`}>
        {children}
      </div>
      {footer !== false && (footer || <StatusFooter />)}
    </div>
  )
}
