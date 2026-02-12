// Script to reorder prospects.js based on Tankathon's top 177 rankings
// Run with: node scripts/reorder-prospects.mjs

import { readFileSync, writeFileSync } from 'fs';

// Tankathon top 177 (2026 NFL Draft)
const tankathon = [
  { name: "Arvell Reese", pos: "OLB", college: "Ohio State" },
  { name: "Rueben Bain Jr.", pos: "EDGE", college: "Miami (FL)" },
  { name: "Caleb Downs", pos: "S", college: "Ohio State" },
  { name: "Fernando Mendoza", pos: "QB", college: "Indiana" },
  { name: "David Bailey", pos: "EDGE", college: "Texas Tech" },
  { name: "Francis Mauigoa", pos: "OT", college: "Miami (FL)" },
  { name: "Carnell Tate", pos: "WR", college: "Ohio State" },
  { name: "Spencer Fano", pos: "OT", college: "Utah" },
  { name: "Jeremiyah Love", pos: "RB", college: "Notre Dame" },
  { name: "Jordyn Tyson", pos: "WR", college: "Arizona State" },
  { name: "Mansoor Delane", pos: "CB", college: "LSU" },
  { name: "Makai Lemon", pos: "WR", college: "USC" },
  { name: "Sonny Styles", pos: "OLB", college: "Ohio State" },
  { name: "Jermod McCoy", pos: "CB", college: "Tennessee" },
  { name: "Keldric Faulk", pos: "DL5T", college: "Auburn" },
  { name: "Peter Woods", pos: "DL3T", college: "Clemson" },
  { name: "Kenyon Sadiq", pos: "TE", college: "Oregon" },
  { name: "Olaivavega Ioane", pos: "OG", college: "Penn State" },
  { name: "Denzel Boston", pos: "WR", college: "Washington" },
  { name: "Cashius Howell", pos: "EDGE", college: "Texas A&M" },
  { name: "Avieon Terrell", pos: "CB", college: "Clemson" },
  { name: "Kadyn Proctor", pos: "OT", college: "Alabama" },
  { name: "Caleb Lomu", pos: "OT", college: "Utah" },
  { name: "C.J. Allen", pos: "OLB", college: "Georgia" },
  { name: "Kayden McDonald", pos: "DL1T", college: "Ohio State" },
  { name: "Kevin Concepcion", pos: "WR", college: "Texas A&M" },
  { name: "Ty Simpson", pos: "QB", college: "Alabama" },
  { name: "T.J. Parker", pos: "EDGE", college: "Clemson" },
  { name: "Caleb Banks", pos: "DL1T", college: "Florida" },
  { name: "Brandon Cisse", pos: "CB", college: "South Carolina" },
  { name: "Akheem Mesidor", pos: "DL5T", college: "Miami (FL)" },
  { name: "Monroe Freeling", pos: "OT", college: "Georgia" },
  { name: "Colton Hood", pos: "CB", college: "Tennessee" },
  { name: "Emmanuel McNeil-Warren", pos: "S", college: "Toledo" },
  { name: "Anthony Hill Jr.", pos: "ILB", college: "Texas" },
  { name: "Emmanuel Pregnon", pos: "OG", college: "Oregon" },
  { name: "Lee Hunter", pos: "DL1T", college: "Texas Tech" },
  { name: "Dillon Thieneman", pos: "S", college: "Oregon" },
  { name: "Blake Miller", pos: "OT", college: "Clemson" },
  { name: "R Mason Thomas", pos: "EDGE", college: "Oklahoma" },
  { name: "Chris Bell", pos: "WR", college: "Louisville" },
  { name: "Christen Miller", pos: "DL3T", college: "Georgia" },
  { name: "Zion Young", pos: "EDGE", college: "Missouri" },
  { name: "Gennings Dunker", pos: "OT", college: "Iowa" },
  { name: "Chris Johnson", pos: "CB", college: "San Diego State" },
  { name: "Zachariah Branch", pos: "WR", college: "Georgia" },
  { name: "Keith Abney II", pos: "CB", college: "Arizona State" },
  { name: "D'Angelo Ponds", pos: "CB", college: "Indiana" },
  { name: "Germie Bernard", pos: "WR", college: "Alabama" },
  { name: "Max Iheanachor", pos: "OT", college: "Arizona State" },
  { name: "A.J. Haulcy", pos: "S", college: "LSU" },
  { name: "Jake Golday", pos: "OLB", college: "Cincinnati" },
  { name: "Chris Brazzell II", pos: "WR", college: "Tennessee" },
  { name: "Caleb Tiernan", pos: "OT", college: "Northwestern" },
  { name: "L.T. Overton", pos: "DL5T", college: "Alabama" },
  { name: "Keionte Scott", pos: "CB", college: "Miami (FL)" },
  { name: "Jadarian Price", pos: "RB", college: "Notre Dame" },
  { name: "Kamari Ramsey", pos: "S", college: "USC" },
  { name: "Elijah Sarratt", pos: "WR", college: "Indiana" },
  { name: "Omar Cooper Jr.", pos: "WR", college: "Indiana" },
  { name: "Connor Lew", pos: "OC", college: "Auburn" },
  { name: "Chase Bisontis", pos: "OG", college: "Texas A&M" },
  { name: "Gabe Jacas", pos: "EDGE", college: "Illinois" },
  { name: "Max Klare", pos: "TE", college: "Ohio State" },
  { name: "Deontae Lawson", pos: "ILB", college: "Alabama" },
  { name: "Joshua Josephs", pos: "EDGE", college: "Tennessee" },
  { name: "Malik Muhammad", pos: "CB", college: "Texas" },
  { name: "Isaiah World", pos: "OT", college: "Oregon" },
  { name: "Josiah Trotter", pos: "ILB", college: "Missouri" },
  { name: "Domonique Orange", pos: "DL1T", college: "Iowa State" },
  { name: "Ja'Kobi Lane", pos: "WR", college: "USC" },
  { name: "Malachi Fields", pos: "WR", college: "Notre Dame" },
  { name: "Jacob Rodriguez", pos: "ILB", college: "Texas Tech" },
  { name: "Antonio Williams", pos: "WR", college: "Clemson" },
  { name: "Eli Stowers", pos: "TE", college: "Vanderbilt" },
  { name: "Derrick Moore", pos: "EDGE", college: "Michigan" },
  { name: "Romello Height", pos: "EDGE", college: "Texas Tech" },
  { name: "Trinidad Chambliss", pos: "QB", college: "Ole Miss" },
  { name: "Julian Neal", pos: "CB", college: "Arkansas" },
  { name: "Dani Dennis-Sutton", pos: "EDGE", college: "Penn State" },
  { name: "Darrell Jackson Jr.", pos: "DL1T", college: "Florida State" },
  { name: "Jonah Coleman", pos: "RB", college: "Washington" },
  { name: "Michael Trigg", pos: "TE", college: "Baylor" },
  { name: "Jake Slaughter", pos: "OC", college: "Florida" },
  { name: "Emmett Johnson", pos: "RB", college: "Nebraska" },
  { name: "Davison Igbinosun", pos: "CB", college: "Ohio State" },
  { name: "Anthony Lucas", pos: "EDGE", college: "USC" },
  { name: "Genesis Smith", pos: "S", college: "Arizona" },
  { name: "Chandler Rivers", pos: "CB", college: "Duke" },
  { name: "Deion Burks", pos: "WR", college: "Oklahoma" },
  { name: "Austin Barber", pos: "OT", college: "Florida" },
  { name: "Carson Beck", pos: "QB", college: "Miami (FL)" },
  { name: "Will Lee III", pos: "CB", college: "Texas A&M" },
  { name: "Treydan Stukes", pos: "CB", college: "Arizona" },
  { name: "Devin Moore", pos: "CB", college: "Florida" },
  { name: "Taurean York", pos: "ILB", college: "Texas A&M" },
  { name: "Nick Singleton", pos: "RB", college: "Penn State" },
  { name: "Jack Endries", pos: "TE", college: "Texas" },
  { name: "Skyler Bell", pos: "WR", college: "Connecticut" },
  { name: "Dontay Corleone", pos: "DL1T", college: "Cincinnati" },
  { name: "Harold Perkins Jr.", pos: "OLB", college: "LSU" },
  { name: "Drew Shelton", pos: "OT", college: "Penn State" },
  { name: "Kaytron Allen", pos: "RB", college: "Penn State" },
  { name: "Zakee Wheatley", pos: "S", college: "Penn State" },
  { name: "Malachi Lawrence", pos: "EDGE", college: "UCF" },
  { name: "Chris McClellan", pos: "DL1T", college: "Missouri" },
  { name: "Brian Parker II", pos: "OC", college: "Duke" },
  { name: "Daylen Everette", pos: "CB", college: "Georgia" },
  { name: "Ted Hurst", pos: "WR", college: "Georgia State" },
  { name: "Lander Barton", pos: "ILB", college: "Utah" },
  { name: "Garrett Nussmeier", pos: "QB", college: "LSU" },
  { name: "Jaishawn Barham", pos: "ILB", college: "Michigan" },
  { name: "Jude Bowry", pos: "OT", college: "Boston College" },
  { name: "Gracen Halton", pos: "DL3T", college: "Oklahoma" },
  { name: "Caden Curry", pos: "EDGE", college: "Ohio State" },
  { name: "Jalon Kilgore", pos: "S", college: "South Carolina" },
  { name: "Dametrious Crownover", pos: "OT", college: "Texas A&M" },
  { name: "Mikail Kamara", pos: "EDGE", college: "Indiana" },
  { name: "Bud Clark", pos: "S", college: "TCU" },
  { name: "C.J. Daniels", pos: "WR", college: "Miami (FL)" },
  { name: "Sam Hecht", pos: "OC", college: "Kansas State" },
  { name: "Justin Joly", pos: "TE", college: "NC State" },
  { name: "Keylan Rutledge", pos: "OG", college: "Georgia Tech" },
  { name: "Michael Taaffe", pos: "S", college: "Texas" },
  { name: "Ar'Maj Reed-Adams", pos: "OG", college: "Texas A&M" },
  { name: "Kyle Louis", pos: "OLB", college: "Pittsburgh" },
  { name: "Zane Durant", pos: "DL3T", college: "Penn State" },
  { name: "Tyreak Sapp", pos: "DL5T", college: "Florida" },
  { name: "Eli Raridon", pos: "TE", college: "Notre Dame" },
  { name: "Demond Claiborne", pos: "RB", college: "Wake Forest" },
  { name: "Tim Keenan III", pos: "DL1T", college: "Alabama" },
  { name: "Drew Allar", pos: "QB", college: "Penn State" },
  { name: "Sam Roush", pos: "TE", college: "Stanford" },
  { name: "Louis Moore", pos: "S", college: "Indiana" },
  { name: "Fernando Carmona Jr.", pos: "OG", college: "Arkansas" },
  { name: "Aamil Wagner", pos: "OT", college: "Notre Dame" },
  { name: "Oscar Delp", pos: "TE", college: "Georgia" },
  { name: "Xavier Scott", pos: "CB", college: "Illinois" },
  { name: "Mike Washington Jr.", pos: "RB", college: "Arkansas" },
  { name: "Tacario Davis", pos: "CB", college: "Washington" },
  { name: "Joe Royer", pos: "TE", college: "Cincinnati" },
  { name: "Skyler Gill-Howard", pos: "DL5T", college: "Texas Tech" },
  { name: "Bryce Lance", pos: "WR", college: "North Dakota State" },
  { name: "Parker Brailsford", pos: "OC", college: "Alabama" },
  { name: "Logan Jones", pos: "OC", college: "Iowa" },
  { name: "Cade Klubnik", pos: "QB", college: "Clemson" },
  { name: "Beau Stephens", pos: "OG", college: "Iowa" },
  { name: "Brenen Thompson", pos: "WR", college: "Mississippi State" },
  { name: "Albert Regis", pos: "DL3T", college: "Texas A&M" },
  { name: "Hezekiah Masses", pos: "CB", college: "California" },
  { name: "J.C. Davis", pos: "OT", college: "Illinois" },
  { name: "Kevin Coleman Jr.", pos: "WR", college: "Missouri" },
  { name: "Domani Jackson", pos: "CB", college: "Alabama" },
  { name: "D.J. Campbell", pos: "OG", college: "Texas" },
  { name: "Rayshaun Benny", pos: "DL3T", college: "Michigan" },
  { name: "Dallen Bentley", pos: "TE", college: "Utah" },
  { name: "Eric Rivers", pos: "WR", college: "Georgia Tech" },
  { name: "Josh Cameron", pos: "WR", college: "Baylor" },
  { name: "Zxavian Harris", pos: "DL1T", college: "Ole Miss" },
  { name: "Jaeden Roberts", pos: "OG", college: "Alabama" },
  { name: "Kage Casey", pos: "OT", college: "Boise State" },
  { name: "Aaron Anderson", pos: "WR", college: "LSU" },
  { name: "Aiden Fisher", pos: "ILB", college: "Indiana" },
  { name: "Eric McAlister", pos: "WR", college: "TCU" },
  { name: "John Michael Gyllenborg", pos: "TE", college: "Wyoming" },
  { name: "T.J. Hall", pos: "CB", college: "Iowa" },
  { name: "J'Mari Taylor", pos: "RB", college: "Virginia" },
  { name: "DeMonte Capehart", pos: "DL5T", college: "Clemson" },
  { name: "Sawyer Robertson", pos: "QB", college: "Baylor" },
  { name: "Max Llewellyn", pos: "EDGE", college: "Iowa" },
  { name: "Thaddeus Dixon", pos: "CB", college: "North Carolina" },
  { name: "Marlin Klein", pos: "TE", college: "Michigan" },
  { name: "Dae'Quan Wright", pos: "TE", college: "Ole Miss" },
  { name: "Bishop Fitzgerald", pos: "S", college: "USC" },
  { name: "Trey Moore", pos: "EDGE", college: "Texas" },
  { name: "Trey Zuhn III", pos: "OT", college: "Texas A&M" },
  { name: "Keyron Crawford", pos: "EDGE", college: "Auburn" },
];

// Read the current prospects.js
const fileContent = readFileSync('src/data/prospects.js', 'utf-8');

// Extract CSV data between backticks
const csvMatch = fileContent.match(/const csvData = `([^`]+)`/s);
if (!csvMatch) {
  console.error('Could not find csvData in prospects.js');
  process.exit(1);
}

const csvLines = csvMatch[1].trim().split('\n');
const header = csvLines[0]; // "Rank,Player Name,College,Position,Height,Weight"

// Parse all CSV rows
const allRows = [];
const seenNames = new Set();

for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i];
  // Parse CSV with quoted fields
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());

  if (values.length >= 6) {
    const name = values[1];
    const college = values[2];
    const key = `${name.toLowerCase()}|${college.toLowerCase()}`;

    // Skip duplicates
    if (seenNames.has(key)) continue;
    seenNames.add(key);

    allRows.push({
      origRank: parseInt(values[0]),
      name,
      college,
      position: values[3],
      height: values[4],
      weight: values[5],
      raw: null, // will rebuild
    });
  }
}

console.log(`Parsed ${allRows.length} unique players from current CSV`);

// Normalize name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Find a match in allRows for a Tankathon player
function findMatch(tankPlayer) {
  const tName = normalizeName(tankPlayer.name);
  const tCollege = tankPlayer.college.toLowerCase();

  // Direct name match
  for (const row of allRows) {
    if (normalizeName(row.name) === tName) return row;
  }

  // Try partial match (last name + college)
  const tLastName = tName.split(' ').pop();
  for (const row of allRows) {
    const rName = normalizeName(row.name);
    const rCollege = row.college.toLowerCase();
    if (rName.includes(tLastName) && rCollege.includes(tCollege.replace(' (fl)', ''))) {
      return row;
    }
  }

  // Special cases
  const specialMappings = {
    'nick singleton': 'Nick Singleton',
    'nicholas singleton': 'Nick Singleton',
  };
  if (specialMappings[tName]) {
    for (const row of allRows) {
      if (row.name === specialMappings[tName]) return row;
    }
  }

  return null;
}

// New players not in current CSV - add with estimated measurables
const newPlayers = {
  'Keionte Scott': { college: 'Miami (FL)', pos: 'CB', height: '"6\'0""', weight: '185' },
  'Anthony Lucas': { college: 'USC', pos: 'EDGE', height: '"6\'5""', weight: '258' },
  'Genesis Smith': { college: 'Arizona', pos: 'S', height: '"6\'0""', weight: '200' },
  'Devin Moore': { college: 'Florida', pos: 'CB', height: '"6\'1""', weight: '190' },
  'Jack Endries': { college: 'Texas', pos: 'TE', height: '"6\'5""', weight: '250' },
  'Caden Curry': { college: 'Ohio State', pos: 'EDGE', height: '"6\'3""', weight: '260' },
  'Mikail Kamara': { college: 'Indiana', pos: 'EDGE', height: '"6\'3""', weight: '248' },
  'Xavier Scott': { college: 'Illinois', pos: 'CB', height: '"6\'0""', weight: '185' },
  'Tacario Davis': { college: 'Washington', pos: 'CB', height: '"6\'4""', weight: '195' },
  'DeMonte Capehart': { college: 'Clemson', pos: 'DL5T', height: '"6\'4""', weight: '310' },
  'Marlin Klein': { college: 'Michigan', pos: 'TE', height: '"6\'5""', weight: '250' },
};

// Build the new ordered list
const usedOrigRanks = new Set();
const newOrderedRows = [];

// Phase 1: Tankathon top 177 only (entries beyond 177 are next year's class)
const TOP_N = 177;
let missing = [];
for (let i = 0; i < TOP_N; i++) {
  const t = tankathon[i];
  const match = findMatch(t);

  if (match) {
    newOrderedRows.push(match);
    usedOrigRanks.add(match.origRank);
  } else if (newPlayers[t.name]) {
    // Add new player
    const np = newPlayers[t.name];
    newOrderedRows.push({
      origRank: -1,
      name: t.name,
      college: np.college,
      position: np.pos,
      height: np.height,
      weight: np.weight,
    });
    console.log(`  NEW: #${i + 1} ${t.name} (${np.college}) - added as new player`);
  } else {
    missing.push(`#${i + 1} ${t.name} (${t.college})`);
  }
}

if (missing.length > 0) {
  console.log(`\nMISSING (${missing.length}):`);
  missing.forEach(m => console.log(`  ${m}`));
}

// Phase 2: Remaining players in original rank order
const remaining = allRows
  .filter(row => !usedOrigRanks.has(row.origRank))
  .sort((a, b) => a.origRank - b.origRank);

newOrderedRows.push(...remaining);

console.log(`\nTotal: ${newOrderedRows.length} players`);
console.log(`  Tankathon top ${TOP_N}: ${TOP_N - missing.length} placed (matched + new)`);
console.log(`  Remaining: ${remaining.length}`);

// Generate new CSV
let newCsv = header + '\n';
for (let i = 0; i < newOrderedRows.length; i++) {
  const row = newOrderedRows[i];
  const rank = i + 1;
  newCsv += `${rank},${row.name},${row.college},${row.position},${row.height},${row.weight}\n`;
}

// Remove trailing newline
newCsv = newCsv.trimEnd();

// Replace the csvData in the file
const newFileContent = fileContent.replace(
  /const csvData = `[^`]+`/s,
  `const csvData = \`${newCsv}\``
);

writeFileSync('src/data/prospects.js', newFileContent, 'utf-8');
console.log('\nDone! prospects.js updated.');
