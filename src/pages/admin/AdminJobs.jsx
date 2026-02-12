import { useState, useEffect } from 'react';
import { supabaseQuery } from '../../supabase';
import './AdminJobs.css';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const { data } = await supabaseQuery('job_runs', {
        order: { column: 'started_at', ascending: false },
        limit: 50,
      });
      setJobs(data || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }

  const statusCounts = {
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
    running: jobs.filter(j => j.status === 'running').length,
  };

  return (
    <div className="admin-jobs">
      <div className="admin-page-header">
        <h1>Jobs</h1>
        <p>Background job runs</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Completed</div>
          <div className="admin-stat-value" style={{ color: '#22c55e' }}>{statusCounts.completed}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Failed</div>
          <div className="admin-stat-value" style={{ color: '#ef4444' }}>{statusCounts.failed}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Running</div>
          <div className="admin-stat-value" style={{ color: '#eab308' }}>{statusCounts.running}</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Processed</th>
              <th>Errors</th>
              <th>Duration</th>
              <th>Started</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="admin-empty"><div className="spinner"></div></td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={7} className="admin-empty">No job runs recorded</td></tr>
            ) : (
              jobs.map(j => (
                <>
                  <tr key={j.id} onClick={() => setExpandedId(expandedId === j.id ? null : j.id)} style={{ cursor: j.error_message ? 'pointer' : 'default' }}>
                    <td style={{ fontWeight: 500 }}>{j.job_name}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${j.status === 'completed' ? 'green' : j.status === 'failed' ? 'red' : 'yellow'}`}>
                        {j.status}
                      </span>
                    </td>
                    <td>{j.priority || '—'}</td>
                    <td>{j.processed ?? '—'}</td>
                    <td>{j.errors ?? 0}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {j.duration_ms ? `${(j.duration_ms / 1000).toFixed(1)}s` : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {j.started_at ? new Date(j.started_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                  {expandedId === j.id && j.error_message && (
                    <tr key={`${j.id}-err`}>
                      <td colSpan={7} style={{ background: 'rgba(239, 68, 68, 0.05)', fontSize: '0.8rem', color: '#ef4444', fontFamily: 'monospace' }}>
                        {j.error_message}
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
