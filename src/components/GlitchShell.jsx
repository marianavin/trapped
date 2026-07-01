// Shared screen wrapper — gives every shell screen the same glitchwave
// dashboard frame: optional chromatic title, content area, and a status
// footer matching the reference UI kit's build-id bar.
export function ScreenHeader({ title, subtitle, compact = false, className = '' }) {
  return (
    <header className={`text-center px-6 ${className}`}>
      <h1 className="font-pixel text-xl sm:text-3xl tracking-widest glitch-title glitch-shift">{title}</h1>
      {subtitle && (
        <p
          className={[
            'font-mono max-w-md mx-auto',
            compact ? 'text-[10px] text-l4text/50 mt-2' : 'text-sm sm:text-base text-l4text/75 mt-4',
          ].join(' ')}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}

const AUTHORS = [
  { handle: '@simona.leimonė', url: 'https://vinted.slack.com/team/U08UDAYP9PX' },
  { handle: '@mariana', url: 'https://vinted.slack.com/team/U05RH83LC80' },
]

export function StatusFooter({ left = 'TRAPPED v0.1', right = 'D&R FUNCTION DAYS · Q2 2026' }) {
  return (
    <footer className="cabinet-footer-inner px-4 py-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <span className="font-mono text-[9px] sm:text-[10px] text-accent-cyan/60">{left}</span>
      <span className="font-mono text-[9px] sm:text-[10px] text-l4text/40">
        Authors:{' '}
        {AUTHORS.map((author, i) => (
          <span key={author.url}>
            {i > 0 && ' & '}
            <a
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan/60 hover:text-accent-cyan underline underline-offset-2"
            >
              {author.handle}
            </a>
          </span>
        ))}
      </span>
      <span className="font-mono text-[9px] sm:text-[10px] text-l4text/40">{right}</span>
    </footer>
  )
}

export default function GlitchShell({ children, className = '', contentClassName = '' }) {
  return (
    <div className={`h-full w-full flex flex-col bg-l4bg text-l4text overflow-hidden ${className}`}>
      <div className={`flex-1 flex flex-col items-center justify-center overflow-y-auto gw-scrollbar ${contentClassName}`}>
        {children}
      </div>
    </div>
  )
}
