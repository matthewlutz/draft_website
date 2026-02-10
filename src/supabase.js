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

  const result = await response.json();
  return { data: Array.isArray(result) ? result : [result], error: null };
}
