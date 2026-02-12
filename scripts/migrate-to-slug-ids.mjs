/**
 * Migration script: Convert old numeric prospect IDs to stable slug IDs in Supabase.
 *
 * Run: node scripts/migrate-to-slug-ids.mjs
 *
 * What it does:
 * 1. Builds old-rank-to-slug mapping from the pre-reorder CSV
 * 2. Updates boards.prospect_ids arrays
 * 3. Updates admin_big_board.prospect_ids arrays
 * 4. Updates admin_player_notes.prospect_id values
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY env vars (or edit below).
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read Supabase config from .env.local
const envPath = resolve(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) envVars[key.trim()] = val.join('=').trim();
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || envVars.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or key. Set SUPABASE_SERVICE_KEY or check .env.local');
  process.exit(1);
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[.']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Old CSV order (before Tankathon reorder) — rank → player name
const oldCsvNames = {
  1: 'Fernando Mendoza', 2: 'Caleb Downs', 3: 'Rueben Bain Jr.', 4: 'Arvell Reese',
  5: 'Peter Woods', 6: 'Francis Mauigoa', 7: 'Keldric Faulk', 8: 'Spencer Fano',
  9: 'Jordyn Tyson', 10: 'Jeremiyah Love', 11: 'Jermod McCoy', 12: 'Carnell Tate',
  13: 'Mansoor Delane', 14: 'Makai Lemon', 15: 'Avieon Terrell', 16: 'T.J. Parker',
  17: 'Cashius Howell', 18: 'David Bailey', 19: 'Denzel Boston', 20: 'Kevin Concepcion',
  21: 'Kadyn Proctor', 22: 'Olaivavega Ioane', 23: 'C.J. Allen', 24: 'Kenyon Sadiq',
  25: 'Ty Simpson', 26: 'L.T. Overton', 27: 'Christen Miller', 28: 'Sonny Styles',
  29: 'Caleb Lomu', 30: 'Colton Hood', 31: 'Romello Height', 32: 'Dani Dennis-Sutton',
  33: 'Gabe Jacas', 34: 'Chris Bell', 35: 'Anthony Hill Jr.', 36: 'Caleb Banks',
  37: 'Brandon Cisse', 38: 'Kayden McDonald', 39: 'Dillon Thieneman', 40: 'Isaiah World',
  41: 'Zachariah Branch', 42: 'Domonique Orange', 43: 'Eli Stowers', 44: 'Lee Hunter',
  45: 'Monroe Freeling', 46: "D'Angelo Ponds", 47: 'Joshua Josephs', 48: 'Kamari Ramsey',
  49: 'Gennings Dunker', 50: 'Deontae Lawson', 51: 'R Mason Thomas', 52: 'Akheem Mesidor',
  53: 'Harold Perkins Jr.', 54: 'Emmanuel McNeil-Warren', 55: 'Taurean York',
  56: "Ja'Kobi Lane", 57: 'Emmanuel Pregnon', 58: 'Davison Igbinosun',
  59: 'Keith Abney II', 60: 'Zion Young', 61: 'Tyreak Sapp', 62: 'Malik Muhammad',
  63: 'Elijah Sarratt', 64: 'Zxavian Harris', 65: 'Connor Lew', 66: 'Derrick Moore',
  67: 'Domani Jackson', 68: 'Jake Slaughter', 69: 'Germie Bernard', 70: 'Jonah Coleman',
  71: 'Carson Beck', 72: 'Chris Johnson', 73: 'Malachi Fields', 74: 'Jacob Rodriguez',
  75: 'Caleb Tiernan', 76: 'Blake Miller', 77: 'Daylen Everette', 78: 'Garrett Nussmeier',
  79: 'Michael Taaffe', 80: 'Bud Clark', 81: 'Max Klare', 82: 'Julian Neal',
  83: 'Kyle Louis', 84: 'Kaytron Allen', 85: 'Chris Brazzell II', 86: 'Austin Barber',
  87: 'Antonio Williams', 88: 'Chase Bisontis', 89: 'Drew Allar',
  90: 'Kevin Coleman Jr.', 91: 'A.J. Haulcy', 92: 'Michael Trigg', 93: 'Jake Golday',
  94: 'Deion Burks', 95: 'Brian Parker II', 96: 'Max Iheanachor', 97: 'Zane Durant',
  98: 'Darrell Jackson Jr.', 99: 'Josiah Trotter', 100: 'Dontay Corleone',
};

// Build mapping: old numeric ID → new slug
const oldIdToSlug = {};
for (const [rank, name] of Object.entries(oldCsvNames)) {
  oldIdToSlug[Number(rank)] = generateSlug(name);
}

console.log('Old ID → Slug mapping (first 10):');
for (let i = 1; i <= 10; i++) {
  console.log(`  ${i} → ${oldIdToSlug[i]}`);
}

async function supabaseRequest(table, method, params = {}) {
  let url = `${SUPABASE_URL}/rest/v1/${table}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': method === 'GET' ? '' : 'return=representation',
  };

  if (params.select) url += `?select=${params.select}`;
  if (params.eq) {
    for (const [k, v] of Object.entries(params.eq)) {
      url += `${url.includes('?') ? '&' : '?'}${k}=eq.${v}`;
    }
  }

  const options = { method, headers };
  if (params.data) options.body = JSON.stringify(params.data);

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${table}: ${res.status} ${text}`);
  }
  return res.json();
}

function migrateIds(ids) {
  return ids.map(id => {
    if (typeof id === 'string') return id; // Already migrated
    const slug = oldIdToSlug[id];
    if (!slug) {
      console.warn(`  Warning: No mapping for old ID ${id}, skipping`);
      return null;
    }
    return slug;
  }).filter(Boolean);
}

async function migrate() {
  console.log('\n--- Migrating boards ---');
  try {
    const boards = await supabaseRequest('boards', 'GET', { select: 'id,user_id,prospect_ids' });
    console.log(`Found ${boards.length} boards`);

    for (const board of boards) {
      if (!board.prospect_ids || board.prospect_ids.length === 0) continue;

      // Check if already migrated (first item is a string)
      if (typeof board.prospect_ids[0] === 'string') {
        console.log(`  Board ${board.id} (user: ${board.user_id}) — already migrated`);
        continue;
      }

      const newIds = migrateIds(board.prospect_ids);
      console.log(`  Board ${board.id}: ${board.prospect_ids.length} → ${newIds.length} prospects`);

      await supabaseRequest('boards', 'PATCH', {
        data: { prospect_ids: newIds },
        eq: { id: board.id },
      });
    }
  } catch (e) {
    console.error('Board migration error:', e.message);
  }

  console.log('\n--- Migrating admin_big_board ---');
  try {
    const bigBoards = await supabaseRequest('admin_big_board', 'GET', { select: 'id,board_name,prospect_ids' });
    console.log(`Found ${bigBoards.length} big boards`);

    for (const bb of bigBoards) {
      if (!bb.prospect_ids || bb.prospect_ids.length === 0) continue;
      if (typeof bb.prospect_ids[0] === 'string') {
        console.log(`  ${bb.board_name} — already migrated`);
        continue;
      }

      const newIds = migrateIds(bb.prospect_ids);
      console.log(`  ${bb.board_name}: ${bb.prospect_ids.length} → ${newIds.length} prospects`);

      await supabaseRequest('admin_big_board', 'PATCH', {
        data: { prospect_ids: newIds },
        eq: { id: bb.id },
      });
    }
  } catch (e) {
    console.error('Admin big board migration error:', e.message);
  }

  console.log('\n--- Migrating admin_player_notes ---');
  try {
    const notes = await supabaseRequest('admin_player_notes', 'GET', { select: 'id,prospect_id' });
    console.log(`Found ${notes.length} player notes`);

    for (const note of notes) {
      if (typeof note.prospect_id === 'string' && isNaN(note.prospect_id)) {
        console.log(`  Note ${note.id} — already migrated (${note.prospect_id})`);
        continue;
      }

      const numId = Number(note.prospect_id);
      const slug = oldIdToSlug[numId];
      if (!slug) {
        console.warn(`  Note ${note.id}: No mapping for prospect_id ${note.prospect_id}`);
        continue;
      }

      console.log(`  Note ${note.id}: ${note.prospect_id} → ${slug}`);
      await supabaseRequest('admin_player_notes', 'PATCH', {
        data: { prospect_id: slug },
        eq: { id: note.id },
      });
    }
  } catch (e) {
    console.error('Player notes migration error:', e.message);
  }

  console.log('\nMigration complete!');
}

migrate().catch(console.error);
