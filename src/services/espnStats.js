// ESPN Stats Service - Uses pre-fetched career college stats for players
// Stats are loaded from playerStats.json for instant display

import playerStats from '../data/playerStats.json';

/**
 * Get stats for a player by name (synchronous - instant!)
 * Returns null if no stats found
 */
export function getPlayerStats(playerName, college) {
  const cacheKey = `${playerName}-${college}`;
  return playerStats[cacheKey] || null;
}

/**
 * Format a stat value for display
 */
export function formatStat(value) {
  if (value === null || value === undefined || value === '-') return '-';

  const num = parseFloat(value);
  if (isNaN(num)) return value;

  // Format large numbers with commas
  if (num >= 1000) {
    return num.toLocaleString();
  }

  // Format decimals
  if (value.toString().includes('.')) {
    return num.toFixed(1);
  }

  return value;
}
