import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase';
import { prospects } from '../../data/prospects';
import { customBigBoardRankings } from '../../data/customBigBoard';
import { reviewedPlayerIds } from '../../data/playerNotes';
import './AdminSystem.css';

export default function AdminSystem() {
  const [supabaseStatus, setSupabaseStatus] = useState(
    isSupabaseConfigured ? 'checking' : 'not_configured'
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    supabase.from('users').select('id').limit(1)
      .then(() => { if (!cancelled) setSupabaseStatus('connected'); })
      .catch(() => { if (!cancelled) setSupabaseStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const items = [
    { label: 'React', value: '19.2' },
    { label: 'Vite', value: '7' },
    { label: 'Supabase', value: isSupabaseConfigured ? 'Configured' : 'Not configured' },
    { label: 'Connection', value: supabaseStatus, isStatus: true },
    { label: 'Prospects in DB', value: prospects.length },
    { label: 'Big Board Size', value: customBigBoardRankings.length },
    { label: 'Reviewed Players', value: reviewedPlayerIds.size },
    { label: 'Environment', value: import.meta.env.MODE },
    { label: 'Base URL', value: window.location.origin },
  ];

  return (
    <div className="admin-system">
      <div className="admin-page-header">
        <h1>System</h1>
        <p>App health and configuration</p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.label}>
                <td style={{ fontWeight: 500 }}>{item.label}</td>
                <td>
                  {item.isStatus ? (
                    <span className={`admin-badge admin-badge-${item.value === 'connected' ? 'green' : item.value === 'checking' ? 'yellow' : 'red'}`}>
                      {item.value}
                    </span>
                  ) : (
                    item.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
