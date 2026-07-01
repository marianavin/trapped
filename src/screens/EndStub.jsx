import PixelButton from '../components/PixelButton.jsx'

// Levels 1, 2 and 4 aren't built yet, so the run ends here for now instead
// of a full end screen with radar chart / profile. Swap this for the real
// end screen once all 4 levels exist.
export default function EndStub({ onReplay }) {
  return (
    <div className="h-full w-full bg-[#0D0D0D] flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-pixel text-[#FFB347] text-sm sm:text-base">LEVEL 3 COMPLETE</p>
      <p className="font-mono text-[#E8E8E8] text-xs sm:text-sm max-w-xs">
        Levels 1, 2 and 4 aren't built yet — the full YOUR MIND UNDER PRESSURE
        end screen unlocks once all four exist.
      </p>
      <PixelButton onClick={onReplay}>PLAY LEVEL 3 AGAIN</PixelButton>
    </div>
  )
}
