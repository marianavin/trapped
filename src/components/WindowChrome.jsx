// Retro "system window" chrome: gradient title bar + hard black outline +
// flat offset drop-shadow, matching the reference glitchwave UI kit's
// SYSTEM ALERT / KERNEL PANIC / PROTOCOL_SELECT windows.

export function titleBarToneClass(tone = 'cyan') {
  return tone === 'danger'
    ? 'bg-accent-red'
    : 'bg-gradient-to-r from-accent-cyan via-accent-cyan/80 to-accent-magenta'
}

/** Hollow frame for drag-trail ghosts — title bar + empty body shell. */
export function WindowChromeTrail({ title, tone = 'cyan', style, className = '' }) {
  return (
    <div
      aria-hidden
      className={`border-2 border-black shadow-window-offset overflow-hidden pointer-events-none ${className}`}
      style={style}
    >
      {title && (
        <div className={`flex items-center justify-between gap-2 px-2 py-1.5 border-b-2 border-black ${titleBarToneClass(tone)}`}>
          <span className="font-pixel text-[7px] sm:text-[8px] text-black tracking-wide truncate uppercase">
            {title}
          </span>
        </div>
      )}
      <div className="gw-panel-grid bg-l4bg/25 h-full min-h-0" />
    </div>
  )
}

export default function WindowChrome({
  title,
  tone = 'cyan',
  children,
  className = '',
  bodyClassName = '',
  titleBarClassName = '',
  onTitleBarPointerDown,
  ...rest
}) {
  const titleBarClass = titleBarToneClass(tone)

  return (
    <div
      className={`border-2 border-black shadow-window-offset overflow-hidden ${className}`}
      {...rest}
    >
      {title && (
        <div
          className={`flex items-center justify-between gap-2 px-2 py-1.5 border-b-2 border-black select-none ${titleBarClass} ${titleBarClassName}`}
          onPointerDown={onTitleBarPointerDown}
        >
          <span className="font-pixel text-[7px] sm:text-[8px] text-black tracking-wide truncate uppercase">
            {title}
          </span>
        </div>
      )}
      <div className={`p-3 sm:p-4 gw-panel-grid text-l4text ${bodyClassName}`}>{children}</div>
    </div>
  )
}
