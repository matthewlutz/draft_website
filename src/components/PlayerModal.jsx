import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getCollegeLogo } from '../data/collegeLogos';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import './PlayerModal.css';

function PlayerModal({ player, isOpen, onClose, onNext, onPrev, onToggleBoard, isOnBoard, positionRank }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && onPrev) {
      onPrev();
    } else if (e.key === 'ArrowRight' && onNext) {
      onNext();
    } else if (e.key === 'Tab') {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose, onNext, onPrev]);

  // Fetch user's note for this player
  useEffect(() => {
    if (isOpen && player && user) {
      setNoteLoading(true);
      supabase
        .from('player_notes')
        .select('note')
        .eq('user_id', user.id)
        .eq('player_id', player.id)
        .single()
        .then(({ data }) => {
          setNoteText(data?.note || '');
          setNoteLoading(false);
        })
        .catch(() => {
          setNoteText('');
          setNoteLoading(false);
        });
    } else if (isOpen) {
      setNoteText('');
    }
  }, [isOpen, player?.id, user?.id]);

  // Reset tab when player changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setNoteSaved(false);
    }
  }, [isOpen, player?.id]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => modalRef.current?.focus(), 0);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  const handleSaveNote = async () => {
    if (!user) {
      onClose();
      navigate('/register');
      return;
    }
    setNoteSaving(true);
    setNoteSaved(false);
    try {
      await supabase
        .from('player_notes')
        .upsert(
          {
            user_id: user.id,
            player_id: player.id,
            note: noteText,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,player_id' }
        );
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2500);
    } catch (err) {
      // silently fail
    } finally {
      setNoteSaving(false);
    }
  };

  if (!isOpen || !player) return null;

  const positionClass = player.position.toLowerCase().replace('/', '-');
  const collegeLogo = getCollegeLogo(player.college);

  const renderStats = () => {
    const stats = player.stats;
    if (!stats || Object.keys(stats).length === 0) return null;

    const statGroups = [];

    if (stats.passingYards !== undefined) {
      statGroups.push({
        label: 'Passing',
        items: [
          { label: 'Yards', value: stats.passingYards.toLocaleString() },
          { label: 'TDs', value: stats.touchdowns },
          { label: 'INTs', value: stats.interceptions },
          { label: 'Comp %', value: `${stats.completionPct}%` }
        ]
      });
    }

    if (stats.rushingYards !== undefined) {
      statGroups.push({
        label: 'Rushing',
        items: [
          { label: 'Yards', value: stats.rushingYards.toLocaleString() },
          { label: 'TDs', value: stats.rushingTDs },
          { label: 'YPC', value: stats.yardsPerCarry || '-' }
        ]
      });
    }

    if (stats.receptions !== undefined) {
      statGroups.push({
        label: 'Receiving',
        items: [
          { label: 'Rec', value: stats.receptions },
          { label: 'Yards', value: stats.receivingYards?.toLocaleString() },
          { label: 'TDs', value: stats.touchdowns || stats.receivingTDs || '-' },
          { label: 'YPR', value: stats.yardsPerReception }
        ]
      });
    }

    if (stats.tackles !== undefined) {
      statGroups.push({
        label: 'Defense',
        items: [
          { label: 'Tackles', value: stats.tackles },
          { label: 'Sacks', value: stats.sacks || '-' },
          { label: 'INTs', value: stats.interceptions || '-' },
          { label: 'TFL', value: stats.tacklesForLoss || '-' },
          { label: 'PD', value: stats.passDefensed || '-' },
          { label: 'FF', value: stats.forcedFumbles || '-' }
        ].filter(item => item.value !== '-')
      });
    }

    if (stats.gamesStarted !== undefined) {
      statGroups.push({
        label: 'O-Line',
        items: [
          { label: 'Games Started', value: stats.gamesStarted },
          { label: 'Sacks Allowed', value: stats.sacksAllowed },
          { label: 'Penalties', value: stats.penaltiesCommitted }
        ]
      });
    }

    return statGroups;
  };

  const statGroups = renderStats();

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`${player.name} player profile`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-body">
          {/* Header */}
          <div className="modal-header">
            <div className="modal-logo">
              {collegeLogo ? (
                <img src={collegeLogo} alt={`${player.college} logo`} />
              ) : (
                <div className="modal-logo-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="modal-player-name">{player.name}</h2>
            <div className="modal-badges">
              <span className={`position-badge ${positionClass}`}>
                {player.position}
              </span>
              {positionRank && (
                <span className="modal-pos-rank">{positionRank}</span>
              )}
              <span className="modal-overall-rank">
                Overall Rank #{player.id}
              </span>
            </div>

            {/* Tab Buttons */}
            <div className="modal-tabs">
              <button
                className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`modal-tab-btn ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                Advanced
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Physical Stats Row */}
              <div className="modal-physical">
                <div className="modal-physical-item">
                  <span className="modal-physical-value">{player.height}</span>
                  <span className="modal-physical-label">Height</span>
                </div>
                <div className="modal-physical-divider" />
                <div className="modal-physical-item">
                  <span className="modal-physical-value">{player.weight} lbs</span>
                  <span className="modal-physical-label">Weight</span>
                </div>
                <div className="modal-physical-divider" />
                <div className="modal-physical-item">
                  <span className="modal-physical-value">{player.college}</span>
                  <span className="modal-physical-label">School</span>
                </div>
              </div>

              {/* Scouting Report */}
              <div className="modal-section">
                <h3>Scouting Report</h3>
                <p className="modal-summary">{player.summary}</p>
              </div>

              {/* Stats */}
              {statGroups && statGroups.length > 0 && (
                <div className="modal-section">
                  <h3>2024 Season Stats</h3>
                  <div className="modal-stats-grid">
                    {statGroups.map((group, idx) => (
                      <div key={idx} className="modal-stat-group">
                        <h4>{group.label}</h4>
                        <div className="modal-stat-items">
                          {group.items.map((stat, statIdx) => (
                            <div key={statIdx} className="modal-stat-item">
                              <span className="modal-stat-value">{stat.value}</span>
                              <span className="modal-stat-label">{stat.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pros & Cons */}
              <div className="modal-section">
                <div className="modal-pros-cons">
                  <div className="modal-pros">
                    <h3 className="pros-title">Pros</h3>
                    {player.strengths && player.strengths.length > 0 ? (
                      <ul>
                        {player.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    ) : (
                      <p className="modal-empty-list">No pros listed yet</p>
                    )}
                  </div>
                  <div className="modal-pros-cons-divider" />
                  <div className="modal-cons">
                    <h3 className="cons-title">Cons</h3>
                    {player.weaknesses && player.weaknesses.length > 0 ? (
                      <ul>
                        {player.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    ) : (
                      <p className="modal-empty-list">No cons listed yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Notes */}
              <div className="modal-section modal-notes-section">
                <h3>My Notes</h3>
                {user ? (
                  <div className="modal-notes-form">
                    <textarea
                      className="modal-notes-textarea"
                      placeholder="Add your personal notes about this player..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      disabled={noteLoading}
                      rows={3}
                    />
                    <div className="modal-notes-actions">
                      <button
                        className="modal-notes-save-btn"
                        onClick={handleSaveNote}
                        disabled={noteSaving || noteLoading}
                      >
                        {noteSaving ? 'Saving...' : noteSaved ? 'Saved!' : 'Save Note'}
                      </button>
                      {noteSaved && (
                        <span className="modal-notes-saved-indicator">Note saved successfully</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="modal-notes-login-prompt">
                    <p>Sign up or log in to add personal notes on players.</p>
                    <button
                      className="modal-notes-register-btn"
                      onClick={() => {
                        onClose();
                        navigate('/register');
                      }}
                    >
                      Sign Up / Register
                    </button>
                  </div>
                )}
              </div>

              {/* Board Button */}
              {onToggleBoard && (
                <button
                  className={`modal-board-btn ${isOnBoard ? 'on-board' : ''}`}
                  onClick={() => onToggleBoard(player)}
                >
                  {isOnBoard ? 'Remove from My Board' : 'Add to My Board'}
                </button>
              )}
            </>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="modal-advanced-placeholder">
              <div className="modal-advanced-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="modal-advanced-icon">
                  <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4>Advanced Analytics</h4>
                <p>Coming soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Nav Footer */}
        <div className="modal-nav">
          {onPrev ? (
            <button className="modal-nav-btn" onClick={onPrev}>
              <span className="nav-arrow">&larr;</span> Previous
            </button>
          ) : (
            <div />
          )}
          {onNext ? (
            <button className="modal-nav-btn" onClick={onNext}>
              Next <span className="nav-arrow">&rarr;</span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PlayerModal;
