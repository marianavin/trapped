// Shared trial chrome — fixed vertical slots keep the phone in the same place
// on every task regardless of header/prompt copy length.
const PHONE_TOP = 'top-[161px]'

export default function TrialLayout({ header, prompt, phone, footer, overlay }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-l3-bg px-5 py-6">
      {overlay}
      <div className="relative z-10 mx-auto min-h-[2.5rem] max-w-sm text-center">{header}</div>
      <div className="relative z-10 -mt-[10px] mx-auto min-h-[2rem] max-w-sm text-center">{prompt}</div>
      <div className={`absolute left-1/2 z-10 -translate-x-1/2 overflow-visible ${PHONE_TOP}`}>{phone}</div>
      <div className="absolute inset-x-5 bottom-6 z-10 h-4 text-center">{footer}</div>
    </div>
  )
}
