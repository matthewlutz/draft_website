import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Get the pre-reorder prospects.js (before Tankathon reorder)
const oldContent = execSync('git show 43e9cca:src/data/prospects.js', { encoding: 'utf-8' });

// Extract CSV data between backticks
const csvMatch = oldContent.match(/const csvData = `([\s\S]*?)`/);
if (!csvMatch) { console.error('No CSV found'); process.exit(1); }

const lines = csvMatch[1].trim().split('\n').slice(1); // skip header
const results = {};

for (const line of lines) {
  const parts = [];
  let current = '', inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { parts.push(current.trim()); current = ''; }
    else { current += ch; }
  }
  parts.push(current.trim());
  if (parts.length >= 2) {
    const rank = parseInt(parts[0]);
    const name = parts[1];
    if (rank && name) results[rank] = name;
  }
}

function slug(name) {
  return name.toLowerCase().replace(/[.']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

console.log(`Total old players: ${Object.keys(results).length}`);

// Generate SQL VALUES
const vals = Object.entries(results)
  .map(([r, n]) => `  (${r},'${slug(n)}')`)
  .join(',\n');

writeFileSync('scripts/id_map_values.sql', vals);
console.log('Written to scripts/id_map_values.sql');
console.log('First 5:', Object.entries(results).slice(0, 5).map(([r, n]) => `${r} -> ${slug(n)}`));
console.log('Last 5:', Object.entries(results).slice(-5).map(([r, n]) => `${r} -> ${slug(n)}`));
