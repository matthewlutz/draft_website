import { useState, useEffect } from 'react';
import { supabaseQuery, supabaseRest } from '../../supabase';
import { prospects, getProspectById } from '../../data/prospects';
import { playerNotes as staticNotes } from '../../data/playerNotes';
import { useAuditLog } from '../../hooks/useAuditLog';
import { Search, Save, FileText } from 'lucide-react';
import './AdminPlayerNotes.css';

export default function AdminPlayerNotes() {
  const [allNotes, setAllNotes] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all | has_notes
  const [editProsText, setEditProsText] = useState('');
  const [editConsText, setEditConsText] = useState('');
  const [editComparisons, setEditComparisons] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const { log } = useAuditLog();

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const { data } = await supabaseQuery('admin_player_notes', {
        select: 'prospect_id,pros,cons,comparisons',
      });
      const merged = { ...staticNotes };
      if (data && data.length > 0) {
        data.forEach(row => {
          merged[row.prospect_id] = {
            pros: row.pros || [],
            cons: row.cons || [],
            ...(row.comparisons ? { comparisons: row.comparisons } : {}),
          };
        });
      }
      setAllNotes(merged);
    } catch {
      setAllNotes({ ...staticNotes });
    } finally {
      setLoading(false);
    }
  }

  // Convert array to bullet-point text (one item per line)
  function arrayToText(arr) {
    return (arr || []).join('\n');
  }

  // Convert text back to array (each line = one item, skip blanks)
  function textToArray(text) {
    return text.split('\n').filter(line => line.trim());
  }

  function selectPlayer(id) {
    if (hasChanges && !confirm('You have unsaved changes. Discard?')) return;
    setSelectedId(id);
    const notes = allNotes[id] || { pros: [], cons: [] };
    setEditProsText(arrayToText(notes.pros));
    setEditConsText(arrayToText(notes.cons));
    setEditComparisons(notes.comparisons || '');
    setHasChanges(false);
  }

  async function handleSave() {
    if (!selectedId) return;
    setSaving(true);
    const pros = textToArray(editProsText);
    const cons = textToArray(editConsText);
    const comparisons = editComparisons.trim() || null;

    try {
      // Check if record exists
      const { data: existing } = await supabaseQuery('admin_player_notes', {
        eq: { prospect_id: selectedId },
        limit: 1,
      });

      if (existing && existing.length > 0) {
        await supabaseRest('admin_player_notes', 'PATCH', {
          data: { pros, cons, comparisons, updated_at: new Date().toISOString() },
          eq: { prospect_id: selectedId },
        });
      } else {
        await supabaseRest('admin_player_notes', 'POST', {
          data: { prospect_id: selectedId, pros, cons, comparisons },
        });
      }

      await log('update_player_notes', 'player_notes', String(selectedId), {
        pros_count: pros.length,
        cons_count: cons.length,
      });

      // Update local state
      setAllNotes(prev => ({
        ...prev,
        [selectedId]: { pros, cons, ...(comparisons ? { comparisons } : {}) },
      }));
      setHasChanges(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save. Check console for details.');
    } finally {
      setSaving(false);
    }
  }

  // Filtered prospect list
  const filteredProspects = prospects.filter(p => {
    const matchesSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMode === 'all' || allNotes[p.id];
    return matchesSearch && matchesFilter;
  }).slice(0, 100);

  const notesCount = Object.keys(allNotes).length;

  if (loading) {
    return <div className="admin-empty"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-player-notes">
      <div className="admin-page-header">
        <h1>Player Notes Editor</h1>
        <p>{notesCount} prospects with notes</p>
      </div>

      <div className="pn-layout">
        {/* Left panel - prospect list */}
        <div className="pn-list-panel">
          <div className="pn-list-controls">
            <div className="pn-search-wrap">
              <Search size={14} />
              <input
                type="text"
                className="admin-input"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="admin-select"
              value={filterMode}
              onChange={e => setFilterMode(e.target.value)}
            >
              <option value="all">All</option>
              <option value="has_notes">Has Notes</option>
            </select>
          </div>

          <div className="pn-prospect-list">
            {filteredProspects.map(p => (
              <button
                key={p.id}
                className={`pn-prospect-item ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => selectPlayer(p.id)}
              >
                <span className="pn-prospect-rank">#{p.id}</span>
                <div className="pn-prospect-info">
                  <span className="pn-prospect-name">{p.name}</span>
                  <span className="pn-prospect-meta">{p.position} - {p.college}</span>
                </div>
                {allNotes[p.id] && <FileText size={12} className="pn-has-notes" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right panel - editor */}
        <div className="pn-editor-panel">
          {selectedId ? (
            <>
              <div className="pn-editor-header">
                <div>
                  <h2 className="pn-editor-name">{getProspectById(selectedId)?.name}</h2>
                  <span className="pn-editor-meta">
                    {getProspectById(selectedId)?.position} - {getProspectById(selectedId)?.college}
                  </span>
                </div>
                {hasChanges && (
                  <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                    <Save size={14} />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                )}
              </div>

              {/* Comparisons */}
              <div className="pn-field">
                <label className="pn-field-label">Comparisons</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="e.g. Jerry Jeudy, Cooper Kupp"
                  value={editComparisons}
                  onChange={e => { setEditComparisons(e.target.value); setHasChanges(true); }}
                />
              </div>

              {/* Pros */}
              <div className="pn-field">
                <label className="pn-field-label">
                  Pros ({textToArray(editProsText).length})
                </label>
                <textarea
                  className="pn-textarea"
                  value={editProsText}
                  onChange={e => { setEditProsText(e.target.value); setHasChanges(true); }}
                  placeholder="One pro per line..."
                  rows={6}
                />
              </div>

              {/* Cons */}
              <div className="pn-field">
                <label className="pn-field-label">
                  Cons ({textToArray(editConsText).length})
                </label>
                <textarea
                  className="pn-textarea"
                  value={editConsText}
                  onChange={e => { setEditConsText(e.target.value); setHasChanges(true); }}
                  placeholder="One con per line..."
                  rows={6}
                />
              </div>
            </>
          ) : (
            <div className="pn-no-selection">
              Select a prospect to edit notes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
