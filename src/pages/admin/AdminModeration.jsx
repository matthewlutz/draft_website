import './AdminModeration.css';

export default function AdminModeration() {
  return (
    <div className="admin-moderation">
      <div className="admin-page-header">
        <h1>Moderation</h1>
        <p>Content moderation queue</p>
      </div>

      <div className="admin-empty" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>No flagged content</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>When users flag shared boards or content, they will appear here for review.</p>
      </div>
    </div>
  );
}
