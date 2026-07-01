// Retro "system window" chrome: gradient title bar + hard black outline +
// flat offset drop-shadow, matching the reference glitchwave UI kit's
// SYSTEM ALERT / KERNEL PANIC / PROTOCOL_SELECT windows.
export default function WindowChrome({
  title,
  tone = 'cyan',
  children,
  className = '',
  bodyClassName = '',
  ...rest
}) {
  const titleBarClass =
    tone === 'danger'
      ? 'bg-accent-red'
      : 'bg-gradient-to-r from-accent-cyan via-accent-cyan/80 to-accent-magenta'

  return (
    <div
      className={`border-2 border-black shadow-window-offset overflow-hidden ${className}`}
      {...rest}
    >
      {title && (
        <div className={`flex items-center justify-between gap-2 px-2 py-1.5 border-b-2 border-black ${titleBarClass}`}>
          <span className="font-pixel text-[7px] sm:text-[8px] text-black tracking-wide truncate uppercase">
            {title}
          </span>
          <span className="font-mono text-[10px] leading-none text-black/70 flex items-center gap-1 shrink-0" aria-hidden="true">
            <span>_</span>
            <span>□</span>
            <span>×</span>
          </span>
        </div>
      )}
      <div className={`p-3 sm:p-4 gw-panel-grid text-l4text ${bodyClassName}`}>{children}</div>
    </div>
  )
}
