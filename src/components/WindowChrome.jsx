// Retro "system window" chrome: gradient title bar + hard black outline +
// flat offset drop-shadow, matching the reference glitchwave UI kit's
// SYSTEM ALERT / KERNEL PANIC / PROTOCOL_SELECT windows. This is a second,
// deliberately distinct motif from PixelButton/BiasCard's soft neon glow:
// glow = interactive controls and outcome cards, window chrome = anything
// framed as a message/alert/transcript arriving on screen from someone or
// something else (dispatcher lines, bystander dialogue, defusal voice
// lines, error states). Keeping the two motifs consistent everywhere they
// apply is what makes different levels read as the same app.
//
// `tone="cyan"` (default) is the neutral/informational title bar — a
// cyan-to-magenta gradient, per the reference's SYSTEM ALERT window.
// `tone="danger"` is a solid magenta bar for alert/failure-framed messages,
// per the reference's KERNEL PANIC window.
export default function WindowChrome({
  title,
  tone = 'cyan',
  children,
  className = '',
  bodyClassName = '',
  ...rest
}) {
  const titleBarClass = tone === 'danger' ? 'bg-accent-magenta' : 'bg-gradient-to-r from-accent-cyan to-accent-magenta'

  return (
    <div
      className={`border-2 border-black bg-l4panel shadow-[4px_4px_0_rgba(0,0,0,0.45)] ${className}`}
      {...rest}
    >
      {title && (
        <div className={`flex items-center justify-between gap-2 px-2 py-1 border-b-2 border-black ${titleBarClass}`}>
          <span className="font-pixel text-[7px] sm:text-[8px] text-black tracking-wide truncate">{title}</span>
          {/* decorative window controls, aria-hidden — the reference's "_ □ ×"
              glyphs, not real minimize/maximize/close behavior */}
          <span className="font-mono text-[10px] leading-none text-black/70 flex items-center gap-1 shrink-0" aria-hidden="true">
            <span>_</span>
            <span>□</span>
            <span>×</span>
          </span>
        </div>
      )}
      <div className={`p-3 sm:p-4 ${bodyClassName}`}>{children}</div>
    </div>
  )
}
