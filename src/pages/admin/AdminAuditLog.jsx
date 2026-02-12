import { useState, useEffect } from 'react';
import { supabaseQuery } from '../../supabase';
import { Search } from 'lucide-react';
import './AdminAuditLog.css';

const PAGE_SIZE = 25;

export default function AdminAuditLog() {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [page, actionFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadEntries() {
    setLoading(true);
    try {
      const options = {
        select: 'id,admin_id,action,target_type,target_id,details,created_at',
        order: { column: 'created_at', ascending: false },
        range: [page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1],
      };

      if (actionFilter) {
        options.eq = { action: actionFilter };
      }

      const { data, count } = await supabaseQuery('audit_log', options);
      setEntries(data || []);
      setTotal(count || data?.length || 0);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-audit-log">
      <div className="admin-page-header">
        <h1>Audit Log</h1>
        <p>Admin action history</p>
      </div>

      <div className="admin-filters">
        <select
          className="admin-select"
          value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(0); }}
        >
          <option value="">All Actions</option>
          <option value="update_big_board">Big Board Update</option>
          <option value="update_player_notes">Player Notes Update</option>
          <option value="change_role">Role Change</option>
          <option value="user_suspended">User Suspended</option>
          <option value="user_banned">User Banned</option>
          <option value="user_active">User Activated</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
              <th>Admin</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="admin-empty"><div className="spinner"></div></td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan={5} className="admin-empty">No audit entries</td></tr>
            ) : (
              entries.map(e => (
                <tr key={e.id}>
                  <td>
                    <span className="admin-badge admin-badge-blue">{e.action}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{e.target_type}:</span>{' '}
                    <span style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{e.target_id?.substring(0, 8) || '—'}</span>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.details ? JSON.stringify(e.details) : '—'}
                  </td>
                  <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {e.admin_id?.substring(0, 8) || '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {e.created_at ? new Date(e.created_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Prev</button>
          <span className="admin-pagination-info">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
        </div>
      )}
    </div>
  );
}
