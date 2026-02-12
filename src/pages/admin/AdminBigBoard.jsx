import { useState, useEffect, useRef } from 'react';
import { supabaseQuery, supabaseRest } from '../../supabase';
import { prospects, getProspectById } from '../../data/prospects';
import { customBigBoardRankings } from '../../data/customBigBoard';
import { useAuditLog } from '../../hooks/useAuditLog';
import { GripVertical, X, Search, Save, ChevronUp, ChevronDown } from 'lucide-react';
import './AdminBigBoard.css';

export default function AdminBigBoard() {
  const [boardIds, setBoardIds] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const { log } = useAuditLog();
  const dragItem = useRef(null);
  const dragOver = useRef(null);

  useEffect(() => {
    loadBoard();
  }, []);

  async function loadBoard() {
    try {
      const { data } = await supabaseQuery('admin_big_board', {
        eq: { board_name: 'mr_lutz' },
        limit: 1,
      });
      if (data && data.length > 0) {
        const ids = data[0].prospect_ids || [];
        setBoardId(data[0].id);
        setLastSaved(data[0].updated_at);
        // Only use Supabase data if IDs are slugs (post-migration)
        setBoardIds(ids.length > 0 && typeof ids[0] === 'string' ? ids : [...customBigBoardRankings]);
      } else {
        // Fall back to static data
        setBoardIds([...customBigBoardRankings]);
      }
    } catch {
      setBoardIds([...customBigBoardRankings]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (boardId) {
        await supabaseRest('admin_big_board', 'PATCH', {
          data: { prospect_ids: boardIds, updated_at: new Date().toISOString() },
          eq: { id: boardId },
        });
      } else {
        await supabaseRest('admin_big_board', 'POST', {
          data: { board_name: 'mr_lutz', prospect_ids: boardIds, updated_at: new Date().toISOString() },
        });
      }
      await log('update_big_board', 'big_board', 'mr_lutz', { count: boardIds.length });
      setHasChanges(false);
      setLastSaved(new Date().toISOString());
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Check console for details.');
    } finally {
      setSaving(false);
    }
  }

  function addPlayer(id) {
    if (boardIds.includes(id)) return;
    setBoardIds(prev => [...prev, id]);
    setHasChanges(true);
    setSearch('');
  }

  function removePlayer(id) {
    setBoardIds(prev => prev.filter(pid => pid !== id));
    setHasChanges(true);
  }

  function movePlayer(index, direction) {
    const newIds = [...boardIds];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newIds.length) return;
    [newIds[index], newIds[targetIndex]] = [newIds[targetIndex], newIds[index]];
    setBoardIds(newIds);
    setHasChanges(true);
  }

  function handleDragStart(index) {
    dragItem.current = index;
  }

  function handleDragEnter(index) {
    dragOver.current = index;
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOver.current === null) return;
    const newIds = [...boardIds];
    const draggedId = newIds[dragItem.current];
    newIds.splice(dragItem.current, 1);
    newIds.splice(dragOver.current, 0, draggedId);
    setBoardIds(newIds);
    setHasChanges(true);
    dragItem.current = null;
    dragOver.current = null;
  }

  // Search results: prospects not already on board
  const searchResults = search.length >= 2
    ? prospects.filter(p =>
        !boardIds.includes(p.id) &&
        (p.name.toLowerCase().includes(search.toLowerCase()) ||
         p.college.toLowerCase().includes(search.toLowerCase()) ||
         p.position.toLowerCase().includes(search.toLowerCase()))
      ).slice(0, 10)
    : [];

  if (loading) {
    return <div className="admin-empty"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-big-board">
      <div className="admin-page-header">
        <h1>Big Board Editor</h1>
        <p>{boardIds.length} prospects ranked</p>
      </div>

      {hasChanges && (
        <div className="admin-unsaved-bar">
          <span>You have unsaved changes</span>
          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={handleSave} disabled={saving}>
            <Save size={14} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {lastSaved && !hasChanges && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>
          Last saved: {new Date(lastSaved).toLocaleString()}
        </div>
      )}

      {/* Add player search */}
      <div className="bb-search-wrap">
        <div className="bb-search-input-wrap">
          <Search size={14} />
          <input
            type="text"
            className="admin-input"
            placeholder="Search prospects to add..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="bb-search-results">
            {searchResults.map(p => (
              <button key={p.id} className="bb-search-result" onClick={() => addPlayer(p.id)}>
                <span className="bb-search-rank">#{p.rank}</span>
                <span className="bb-search-name">{p.name}</span>
                <span className="bb-search-meta">{p.position} - {p.college}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Board list */}
      <div className="bb-list">
        {boardIds.map((id, index) => {
          const prospect = getProspectById(id);
          if (!prospect) return null;
          return (
            <div
              key={id}
              className="bb-row"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={e => e.preventDefault()}
            >
              <div className="bb-row-drag">
                <GripVertical size={14} />
              </div>
              <div className="bb-row-rank">{index + 1}</div>
              <div className="bb-row-info">
                <span className="bb-row-name">{prospect.name}</span>
                <span className="bb-row-meta">{prospect.position} - {prospect.college}</span>
              </div>
              <div className="bb-row-consensus">#{prospect.rank}</div>
              <div className="bb-row-actions">
                <button
                  className="bb-row-btn"
                  onClick={() => movePlayer(index, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  className="bb-row-btn"
                  onClick={() => movePlayer(index, 1)}
                  disabled={index === boardIds.length - 1}
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  className="bb-row-btn bb-row-btn-remove"
                  onClick={() => removePlayer(id)}
                  title="Remove"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
