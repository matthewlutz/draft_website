import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getCollegeLogo } from '../data/collegeLogos';
import './PlayerModal.css';

function PlayerModal({ player, isOpen, onClose, onNext, onPrev, onToggleBoard, isOnBoard, positionRank }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && onPrev) {
      onPrev();
    } else if (e.key === 'ArrowRight' && onNext) {
      onNext();
    } else if (e.key === 'Tab') {
      // Trap focus within modal
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

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Focus modal after render
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
              <span className={`round-badge round-${player.projectedRound}`}>
                Round {player.projectedRound}
              </span>
            </div>
          </div>

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

          {/* Strengths & Weaknesses */}
          {((player.strengths && player.strengths.length > 0) || (player.weaknesses && player.weaknesses.length > 0)) && (
            <div className="modal-section">
              <h3>Analysis</h3>
              <div className="modal-analysis">
                {player.strengths && player.strengths.length > 0 && (
                  <div className="modal-analysis-card strengths">
                    <h4>Strengths</h4>
                    <ul>
                      {player.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {player.weaknesses && player.weaknesses.length > 0 && (
                  <div className="modal-analysis-card weaknesses">
                    <h4>Weaknesses</h4>
                    <ul>
                      {player.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Board Button */}
          {onToggleBoard && (
            <button
              className={`modal-board-btn ${isOnBoard ? 'on-board' : ''}`}
              onClick={() => onToggleBoard(player)}
            >
              {isOnBoard ? 'Remove from My Board' : 'Add to My Board'}
            </button>
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
