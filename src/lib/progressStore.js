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
    console.error('saveLevelResult failed:', error.message)
  }

  return loadProgress(userId)
}
