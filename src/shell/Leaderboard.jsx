import { useEffect, useState } from 'react'
import { loadLeaderboard } from '../lib/progressStore.js'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { ListRow, RankBadge } from '../components/GameUI.jsx'

function Row({ entry, rank, isSelf }) {
  return (
    <ListRow highlight={isSelf}>
      <RankBadge rank={rank} />
      <span className="font-pixel text-[9px] sm:text-[10px] flex-1 truncate text-accent-cyan">
        {entry.nickname}
        {isSelf ? ' (YOU)' : ''}
      </span>
      <span className="text-l4text/60 text-[10px] sm:text-xs shrink-0">
        {entry.scenariosSurvived}/{entry.levelsCompleted} SURVIVED
      </span>
      <span className="text-l4text/60 text-[10px] sm:text-xs shrink-0">
        {entry.biasesEscaped}/{entry.biasesAttempted} BIASES
      </span>
      <span className="font-pixel text-[10px] sm:text-xs text-accent-cyan shrink-0 w-16 text-right">
        {entry.points} POINTS
      </span>
    </ListRow>
  )
}

function EmptyState({ message }) {
  return (
    <div className="w-full max-w-2xl mx-auto p-5 text-center">
      <p className="font-mono text-xs text-l4text/70">{message}</p>
    </div>
  )
}

export default function Leaderboard({ selfId }) {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('unavailable')
      return
    }
    let cancelled = false
    loadLeaderboard().then((rows) => {
      if (cancelled) return
      setEntries(rows)
      setStatus('ready')
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'unavailable') {
    return <EmptyState message="RANKINGS OFFLINE — NO UPLINK TO HQ." />
  }

  if (status === 'loading') {
    return (
      <div className="w-full max-w-2xl mx-auto p-5 text-center">
        <p className="font-pixel text-xs text-accent-cyan glitch-shift">PULLING RANKINGS…</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return <EmptyState message="NO SCORES LOGGED YET. FINISH A LEVEL — CLAIM THE TOP." />
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-5">
      <h2 className="sr-only">Leaderboard</h2>
      <ul>
        {entries.map((entry, i) => (
          <Row key={entry.playerId} entry={entry} rank={i} isSelf={entry.playerId === selfId} />
        ))}
      </ul>
    </div>
  )
}
