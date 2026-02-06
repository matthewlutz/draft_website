import './SyncStatus.css';

function SyncStatus({ status }) {
  if (status === 'idle') return null;

  return (
    <span className={`sync-status sync-${status}`}>
      {status === 'saving' && (
        <>
          <span className="sync-spinner" />
          Saving...
        </>
      )}
      {status === 'saved' && (
        <>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Saved
        </>
      )}
      {status === 'error' && 'Save failed'}
    </span>
  );
}

export default SyncStatus;
