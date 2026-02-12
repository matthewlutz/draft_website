import { useState, useEffect } from 'react';
import { supabaseQuery } from '../../supabase';
import './AdminAnalytics.css';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ dau: 0, wau: 0, mau: 0, dailySignups: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const { data: users } = await supabaseQuery('users', {
        select: 'id,created_at,last_active',
      });

      if (!users) { setLoading(false); return; }

      const now = new Date();
      const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

      const dau = users.filter(u => u.last_active && new Date(u.last_active) > dayAgo).length;
      const wau = users.filter(u => u.last_active && new Date(u.last_active) > weekAgo).length;
      const mau = users.filter(u => u.last_active && new Date(u.last_active) > monthAgo).length;

      // Daily signups for last 14 days
      const dailySignups = [];
      for (let i = 13; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = users.filter(u =>
          u.created_at && u.created_at.startsWith(dateStr)
        ).length;
        dailySignups.push({ date: dateStr, count });
      }

      setStats({ dau, wau, mau, dailySignups });
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="admin-empty"><div className="spinner"></div></div>;
  }

  const maxSignup = Math.max(...stats.dailySignups.map(d => d.count), 1);

  return (
    <div className="admin-analytics">
      <div className="admin-page-header">
        <h1>Analytics</h1>
        <p>User activity approximations</p>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-label">DAU (24h)</div>
          <div className="admin-stat-value">{stats.dau}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">WAU (7d)</div>
          <div className="admin-stat-value">{stats.wau}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">MAU (30d)</div>
          <div className="admin-stat-value">{stats.mau}</div>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-section-title">Daily Signups (14d)</div>
        <div className="analytics-chart">
          {stats.dailySignups.map(d => (
            <div key={d.date} className="analytics-bar-wrap">
              <div className="analytics-bar-count">{d.count}</div>
              <div
                className="analytics-bar"
                style={{ height: `${(d.count / maxSignup) * 120}px` }}
              />
              <div className="analytics-bar-label">
                {new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
