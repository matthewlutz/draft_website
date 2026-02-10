// Script to fetch all player stats from ESPN and save to a JSON file
// Run with: node scripts/fetchAllStats.js

const fs = require('fs');
const path = require('path');

const ESPN_SEARCH_URL = 'https://site.api.espn.com/apis/common/v3/search';
const ESPN_STATS_URL = 'https://site.web.api.espn.com/apis/common/v3/sports/football/college-football/athletes';

// Read prospects from the source file
const prospectsFilePath = path.join(__dirname, '../src/data/prospects.js');
const prospectsContent = fs.readFileSync(prospectsFilePath, 'utf-8');

// Extract CSV data from the file
const csvMatch = prospectsContent.match(/const csvData = `([^`]+)`/);
if (!csvMatch) {
  console.error('Could not find CSV data in prospects.js');
  process.exit(1);
}

const csvData = csvMatch[1];
const lines = csvData.trim().split('\n');
const players = [];

// Parse the CSV
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  if (values.length >= 4) {
    const rank = parseInt(values[0]);
    const name = values[1];
    const college = values[2];
    const position = values[3];

    // Skip OL positions - they don't have relevant stats
    const oLinePositions = ['OT', 'OG', 'OC', 'OL', 'IOL', 'G', 'T', 'C'];
    if (!oLinePositions.includes(position)) {
      players.push({ rank, name, college, position });
    }
  }
}

console.log(`Found ${players.length} non-OL players to fetch stats for`);

// Delay between requests to avoid rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Search for a player's ESPN ID
async function searchPlayerId(playerName, college) {
  try {
    const response = await fetch(
      `${ESPN_SEARCH_URL}?query=${encodeURIComponent(playerName)}&limit=10&type=player`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.items || [];

    // Find the college football player that matches
    for (const item of results) {
      const isCollegeFootball = item?.league?.slug === 'college-football' ||
                                item?.league?.name?.includes('College') ||
                                item?.type === 'athlete';

      if (isCollegeFootball && item?.id) {
        return item.id;
      }
    }

    // If no exact match, try the first result that looks like an athlete
    if (results.length > 0 && results[0]?.id) {
      return results[0].id;
    }

    return null;
  } catch (error) {
    console.error(`Error searching for ${playerName}:`, error.message);
    return null;
  }
}

// Fetch player stats from ESPN
async function fetchPlayerStats(espnId) {
  if (!espnId) return null;

  try {
    const response = await fetch(`${ESPN_STATS_URL}/${espnId}/stats`);

    if (!response.ok) return null;

    const data = await response.json();
    return parseEspnStats(data);
  } catch (error) {
    console.error(`Error fetching stats for ID ${espnId}:`, error.message);
    return null;
  }
}

// Parse ESPN stats response
function parseEspnStats(data) {
  if (!data?.categories) return null;

  const stats = {
    passing: null,
    rushing: null,
    receiving: null,
    defense: null,
    passingSeasons: [],
    rushingSeasons: [],
    receivingSeasons: [],
    defenseSeasons: []
  };

  for (const category of data.categories) {
    const categoryName = category.name?.toLowerCase() || '';
    const totals = category.totals || [];
    const names = category.names || [];

    // Create a map using the camelCase names as keys
    const statMap = {};
    names.forEach((name, idx) => {
      statMap[name] = totals[idx];
    });

    // Extract season-by-season data
    if (category.statistics && category.statistics.length > 0) {
      category.statistics.forEach(seasonStats => {
        const seasonStatMap = {};
        names.forEach((name, idx) => {
          seasonStatMap[name] = seasonStats.stats?.[idx];
        });

        // Only process if we have actual data
        if (!Object.keys(seasonStatMap).some(k => seasonStatMap[k] && seasonStatMap[k] !== '0')) {
          return;
        }

        const seasonData = {
          year: seasonStats.season?.displayName || seasonStats.season?.year,
          team: seasonStats.team?.shortDisplayName || seasonStats.team?.displayName,
          ...seasonStatMap
        };

        // Add to appropriate season array
        if (categoryName.includes('pass')) {
          stats.passingSeasons.push(seasonData);
        } else if (categoryName.includes('rush')) {
          stats.rushingSeasons.push(seasonData);
        } else if (categoryName.includes('receiv')) {
          stats.receivingSeasons.push(seasonData);
        } else if (categoryName.includes('defen') || categoryName.includes('tackl')) {
          stats.defenseSeasons.push(seasonData);
        }
      });
    }

    // Parse totals by category type
    if (categoryName.includes('pass')) {
      stats.passing = {
        yards: statMap['passingYards'],
        touchdowns: statMap['passingTouchdowns'],
        interceptions: statMap['interceptions'],
        completions: statMap['completions'],
        attempts: statMap['passingAttempts'],
        rating: statMap['QBRating'] || statMap['adjQBR'],
        completionPct: statMap['completionPct']
      };
    } else if (categoryName.includes('rush')) {
      stats.rushing = {
        yards: statMap['rushingYards'],
        touchdowns: statMap['rushingTouchdowns'],
        attempts: statMap['rushingAttempts'],
        yardsPerCarry: statMap['yardsPerRushAttempt'],
        long: statMap['longRushing']
      };
    } else if (categoryName.includes('receiv')) {
      stats.receiving = {
        receptions: statMap['receptions'],
        yards: statMap['receivingYards'],
        touchdowns: statMap['receivingTouchdowns'],
        yardsPerReception: statMap['yardsPerReception'],
        long: statMap['longReception']
      };
    } else if (categoryName.includes('defen') || categoryName.includes('tackl')) {
      stats.defense = {
        tackles: statMap['totalTackles'],
        soloTackles: statMap['soloTackles'],
        assistTackles: statMap['assistTackles'],
        sacks: statMap['sacks'],
        interceptions: statMap['interceptions'],
        intYards: statMap['interceptionYards'],
        intTD: statMap['interceptionTouchdowns'],
        passDefensed: statMap['passesDefended'],
        forcedFumbles: statMap['fumblesForced'],
        tacklesForLoss: statMap['tacklesForLoss']
      };
    }
  }

  // Clean up null totals
  ['passing', 'rushing', 'receiving', 'defense'].forEach(key => {
    if (stats[key]) {
      const hasData = Object.values(stats[key]).some(v => v && v !== '0' && v !== '-');
      if (!hasData) stats[key] = null;
    }
  });

  // Clean up empty season arrays
  ['passingSeasons', 'rushingSeasons', 'receivingSeasons', 'defenseSeasons'].forEach(key => {
    if (stats[key].length === 0) {
      delete stats[key];
    }
  });

  return stats;
}

// Main function to fetch all player stats
async function fetchAllStats() {
  const allStats = {};
  let successCount = 0;
  let failCount = 0;

  console.log('Starting to fetch stats...\n');

  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const cacheKey = `${player.name}-${player.college}`;

    process.stdout.write(`[${i + 1}/${players.length}] Fetching ${player.name} (${player.college})... `);

    try {
      const espnId = await searchPlayerId(player.name, player.college);

      if (espnId) {
        const stats = await fetchPlayerStats(espnId);

        if (stats && (stats.passing || stats.rushing || stats.receiving || stats.defense)) {
          allStats[cacheKey] = stats;
          console.log('SUCCESS');
          successCount++;
        } else {
          console.log('No stats found');
          failCount++;
        }
      } else {
        console.log('Player not found');
        failCount++;
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
      failCount++;
    }

    // Delay between requests to avoid rate limiting
    if (i < players.length - 1) {
      await delay(200);
    }
  }

  console.log('\n========================================');
  console.log(`Total: ${players.length} players`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed/No data: ${failCount}`);
  console.log('========================================\n');

  // Save to JSON file
  const outputPath = path.join(__dirname, '../src/data/playerStats.json');
  fs.writeFileSync(outputPath, JSON.stringify(allStats, null, 2));
  console.log(`Stats saved to: ${outputPath}`);

  // Calculate file size
  const fileSize = fs.statSync(outputPath).size;
  console.log(`File size: ${(fileSize / 1024).toFixed(2)} KB`);
}

fetchAllStats().catch(console.error);
