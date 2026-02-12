import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate credentials
const isValidKey = supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_publishable_');
const isConfigured = supabaseUrl && supabaseAnonKey && isValidKey;

if (!isConfigured) {
  console.warn('Supabase not configured properly. Auth features will be disabled.');
}

// Create client for auth only
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export const isSupabaseConfigured = isConfigured;

// Get user's access token from localStorage
function getUserAccessToken() {
  try {
    const stored = localStorage.getItem('sb-nkqsuftmozkxnucqwyby-auth-token');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.access_token || null;
    }
  } catch {
    // Invalid stored session
  }
  return null;
}

// Direct REST API helper (bypasses buggy supabase-js client)
export async function supabaseRest(table, method, options = {}) {
  const { data, eq, select } = options;

  let url = `${supabaseUrl}/rest/v1/${table}`;

  // Use user's access token if available (required for RLS), fallback to anon key
  const accessToken = getUserAccessToken() || supabaseAnonKey;

  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'Prefer': select ? 'return=representation' : 'return=minimal',
  };

  // Add query params for filtering
  if (eq) {
    const params = new URLSearchParams();
    Object.entries(eq).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
    url += '?' + params.toString();
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase REST error: ${response.status} - ${error}`);
  }

  if (method === 'DELETE' || response.status === 204) {
    return { data: null, error: null };
  }

  const text = await response.text();
  if (!text) {
    return { data: null, error: null };
  }

  const result = JSON.parse(text);
  return { data: Array.isArray(result) ? result : [result], error: null };
}

// Advanced query helper with ordering, pagination, search, and select
export async function supabaseQuery(table, options = {}) {
  const { eq, or, order, range, limit, select, single } = options;

  const accessToken = getUserAccessToken() || supabaseAnonKey;

  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  if (single) {
    headers['Accept'] = 'application/vnd.pgrst.object+json';
  }

  const params = new URLSearchParams();

  // Select columns
  if (select) {
    params.append('select', select);
  }

  // Equality filters
  if (eq) {
    Object.entries(eq).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
  }

  // OR filter (PostgREST syntax)
  if (or) {
    params.append('or', `(${or})`);
  }

  // Ordering
  if (order) {
    const { column, ascending = true } = order;
    params.append('order', `${column}.${ascending ? 'asc' : 'desc'}`);
  }

  // Pagination via range
  if (range) {
    const [from, to] = range;
    headers['Range'] = `${from}-${to}`;
    headers['Range-Unit'] = 'items';
    headers['Prefer'] = 'count=exact';
  }

  // Limit
  if (limit) {
    params.append('limit', limit);
  }

  const queryString = params.toString();
  const url = `${supabaseUrl}/rest/v1/${table}${queryString ? '?' + queryString : ''}`;

  const response = await fetch(url, { method: 'GET', headers });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase query error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  // Extract total count from Content-Range header if pagination used
  let count = null;
  if (range) {
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)/);
      if (match) count = parseInt(match[1], 10);
    }
  }

  return { data, count, error: null };
}
