// Shared trial chrome — stacked layout so phone + keypad scroll on short viewports.
export default function TrialLayout({ header, prompt, phone, footer, overlay }) {
  return (
    <div className="relative w-full min-h-full bg-l3-bg px-5 pt-14 pb-10">
      {overlay}
      <div className="relative z-10 mx-auto min-h-[2.5rem] max-w-sm text-center">{header}</div>
      <div className="relative z-10 mt-2 mx-auto min-h-[2rem] max-w-sm text-center">{prompt}</div>
      <div className="relative z-10 mt-6 flex justify-center overflow-visible">{phone}</div>
      <div className="relative z-10 mt-6 min-h-4 text-center">{footer}</div>
    </div>
  )
}
