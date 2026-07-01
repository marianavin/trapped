import { supabase, isSupabaseConfigured } from './supabaseClient.js'

// Normalized shape every level result is stored as, regardless of backend:
// { levelId, outcomeSuccess, totalBiases, escapedCount, results, completedAt }

function localKey(userId) {
  return `trapped_progress_${userId}`
}

function loadLocal(userId) {
  try {
    const raw = localStorage.getItem(localKey(userId))
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function saveLocal(userId, all) {
  try {
    localStorage.setItem(localKey(userId), JSON.stringify(all))
  } catch (e) {
    // localStorage can be unavailable — never block the game on it
  }
}

// Returns { [levelId]: normalizedResult } for the given user.
export async function loadProgress(userId) {
  if (!userId) return {}

  if (!isSupabaseConfigured) {
    return loadLocal(userId)
  }

  const { data, error } = await supabase
    .from('level_progress')
    .select('level_id, outcome_success, total_biases, escaped_count, results, completed_at')
    .eq('user_id', userId)

  if (error) {
    console.error('loadProgress failed, falling back to empty progress:', error.message)
    return {}
  }

  const map = {}
  for (const row of data) {
    map[row.level_id] = {
      levelId: row.level_id,
      outcomeSuccess: row.outcome_success,
      totalBiases: row.total_biases,
      escapedCount: row.escaped_count,
      results: row.results,
      completedAt: row.completed_at,
    }
  }
  return map
}

// Persists one level's result and returns the full updated progress map.
export async function saveLevelResult(userId, levelId, normalizedResult) {
  const record = { ...normalizedResult, levelId, completedAt: new Date().toISOString() }

  if (!isSupabaseConfigured) {
    const all = loadLocal(userId)
    all[levelId] = record
    saveLocal(userId, all)
    return all
  }

  const { error } = await supabase.from('level_progress').upsert(
    {
      user_id: userId,
      level_id: levelId,
      outcome_success: record.outcomeSuccess,
      total_biases: record.totalBiases,
      escaped_count: record.escapedCount,
      results: record.results,
      completed_at: record.completedAt,
    },
    { onConflict: 'user_id,level_id' }
  )

  if (error) {
    // Don't let a network/DB hiccup erase the result the player just earned:
    // cache it locally (merged with whatever we can still load from the
    // server) so the hub reflects it, and it can sync up on a future save.
    console.error('saveLevelResult failed, caching locally instead:', error.message)
    const cached = loadLocal(userId)
    cached[levelId] = record
    saveLocal(userId, cached)
    const serverProgress = await loadProgress(userId)
    return { ...serverProgress, ...cached }
  }

  return loadProgress(userId)
}

// Registers/renames a player so the leaderboard has a nickname to show.
// No-op when Supabase isn't configured (leaderboard simply isn't available
// offline — nothing else in the app depends on this succeeding).
export async function upsertPlayer(id, nickname) {
  if (!isSupabaseConfigured || !id) return

  const { error } = await supabase
    .from('players')
    .upsert({ id, nickname, updated_at: new Date().toISOString() }, { onConflict: 'id' })

  if (error) {
    console.error('upsertPlayer failed:', error.message)
  }
}

// Full rankings for the Leaderboard tab: one row per player who has played
// at least once, sorted by points (see supabase/schema.sql's `leaderboard`
// view for how points are computed). Returns [] when Supabase isn't
// configured or the query fails — the UI treats that as "no leaderboard
// available yet" rather than an error state.
export async function loadLeaderboard() {
  if (!isSupabaseConfigured) return []

  const { data, error } = await supabase
    .from('leaderboard')
    .select('player_id, nickname, scenarios_survived, levels_completed, biases_escaped, biases_attempted, points')

  if (error) {
    console.error('loadLeaderboard failed:', error.message)
    return []
  }

  return data
    .filter((row) => row.levels_completed > 0)
    .map((row) => ({
      playerId: row.player_id,
      nickname: row.nickname,
      scenariosSurvived: row.scenarios_survived,
      levelsCompleted: row.levels_completed,
      biasesEscaped: row.biases_escaped,
      biasesAttempted: row.biases_attempted,
      points: row.points,
    }))
}
