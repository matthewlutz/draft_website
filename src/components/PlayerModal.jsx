import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getCollegeLogo } from '../data/collegeLogos';
import { getPlayerNotes } from '../data/playerNotes';
import { getCollegeColors } from '../data/collegeColors';
import { getPlayerStats, formatStat } from '../services/espnStats';
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
  const [espnStats, setEspnStats] = useState(null);
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

  // Position groups for filtering stats
  const offensivePositions = ['QB', 'RB', 'WR', 'TE', 'FB', 'HB'];
  const defensivePositions = ['CB', 'S', 'FS', 'SS', 'LB', 'ILB', 'OLB', 'MLB', 'DE', 'DT', 'NT', 'DL', 'EDGE', 'DB'];
  const oLinePositions = ['OT', 'OG', 'C', 'G', 'T', 'OL', 'IOL'];
  const receiverPositions = ['WR', 'TE']; // Only show receiving stats
  const rushingPositions = ['RB', 'FB', 'HB']; // Show rushing and receiving

  const isOffensivePlayer = player ? offensivePositions.includes(player.position) : false;
  const isDefensivePlayer = player ? defensivePositions.includes(player.position) : false;
  const isOLineman = player ? oLinePositions.includes(player.position) : false;
  const isReceiver = player ? receiverPositions.includes(player.position) : false;
  const isRB = player ? rushingPositions.includes(player.position) : false;
  const isQB = player ? player.position === 'QB' : false;

  // Load ESPN stats when player changes (skip for OL) - instant since data is hardcoded
  useEffect(() => {
    if (isOpen && player && !isOLineman) {
      const stats = getPlayerStats(player.name, player.college);
      setEspnStats(stats);
    } else {
      setEspnStats(null);
    }
  }, [isOpen, player?.id, player?.name, player?.college, isOLineman]);

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
  const collegeColors = getCollegeColors(player.college);

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
        {/* Corner triangles with team colors */}
        <div className="modal-corner-top-right">
          <svg viewBox="0 0 80 80" preserveAspectRatio="none">
            <polygon points="0,0 80,0 80,80" fill={collegeColors.primary} />
            <polygon points="20,0 80,0 80,60" fill={collegeColors.secondary} />
          </svg>
        </div>
        <div className="modal-corner-bottom-left">
          <svg viewBox="0 0 80 80" preserveAspectRatio="none">
            <polygon points="0,0 0,80 80,80" fill={collegeColors.primary} />
            <polygon points="0,20 0,80 60,80" fill={collegeColors.secondary} />
          </svg>
        </div>

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
            <div className="modal-badges-text">
              <span className="modal-badge-item">{player.position}</span>
              {positionRank && (
                <>
                  <span className="modal-badge-divider">|</span>
                  <span className="modal-badge-item">{positionRank}</span>
                </>
              )}
              <span className="modal-badge-divider">|</span>
              <span className="modal-badge-item">Consensus #{player.id}</span>
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

              {/* ESPN Career Stats - Skip for OL */}
              {!isOLineman && (
              <div className="modal-section">
                <h3>Career College Stats</h3>
                {espnStats ? (
                  <div className="espn-stats-tables">
                    {/* Defense Stats Table - Only for defensive players */}
                    {isDefensivePlayer && espnStats.defenseSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Defense & Tackles</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Solo</th>
                                <th>Ast</th>
                                <th>Tot</th>
                                <th>TFL</th>
                                <th>Sack</th>
                                <th>Int</th>
                                <th>IntYd</th>
                                <th>PD</th>
                                <th>FF</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.defenseSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.soloTackles)}</td>
                                  <td>{formatStat(season.assistTackles)}</td>
                                  <td>{formatStat(season.totalTackles)}</td>
                                  <td>{formatStat(season.tacklesForLoss)}</td>
                                  <td>{formatStat(season.sacks)}</td>
                                  <td>{formatStat(season.interceptions)}</td>
                                  <td>{formatStat(season.interceptionYards)}</td>
                                  <td>{formatStat(season.passesDefended)}</td>
                                  <td>{formatStat(season.fumblesForced)}</td>
                                </tr>
                              ))}
                              {espnStats.defense && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.defense.soloTackles)}</td>
                                  <td>{formatStat(espnStats.defense.assistTackles)}</td>
                                  <td>{formatStat(espnStats.defense.tackles)}</td>
                                  <td>{formatStat(espnStats.defense.tacklesForLoss)}</td>
                                  <td>{formatStat(espnStats.defense.sacks)}</td>
                                  <td>{formatStat(espnStats.defense.interceptions)}</td>
                                  <td>{formatStat(espnStats.defense.intYards)}</td>
                                  <td>{formatStat(espnStats.defense.passDefensed)}</td>
                                  <td>{formatStat(espnStats.defense.forcedFumbles)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* QB Stats: Passing first, then Rushing, NO Receiving */}
                    {isQB && espnStats.passingSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Passing</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Cmp</th>
                                <th>Att</th>
                                <th>Yds</th>
                                <th>TD</th>
                                <th>Int</th>
                                <th>Rtg</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.passingSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.completions)}</td>
                                  <td>{formatStat(season.passingAttempts)}</td>
                                  <td>{formatStat(season.passingYards)}</td>
                                  <td>{formatStat(season.passingTouchdowns)}</td>
                                  <td>{formatStat(season.interceptions)}</td>
                                  <td>{formatStat(season.QBRating || season.adjQBR)}</td>
                                </tr>
                              ))}
                              {espnStats.passing && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.passing.completions)}</td>
                                  <td>{formatStat(espnStats.passing.attempts)}</td>
                                  <td>{formatStat(espnStats.passing.yards)}</td>
                                  <td>{formatStat(espnStats.passing.touchdowns)}</td>
                                  <td>{formatStat(espnStats.passing.interceptions)}</td>
                                  <td>{formatStat(espnStats.passing.rating)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* QB Rushing Stats (after passing) */}
                    {isQB && espnStats.rushingSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Rushing</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Att</th>
                                <th>Yds</th>
                                <th>Avg</th>
                                <th>TD</th>
                                <th>Lng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.rushingSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.rushingAttempts)}</td>
                                  <td>{formatStat(season.rushingYards)}</td>
                                  <td>{formatStat(season.yardsPerRushAttempt)}</td>
                                  <td>{formatStat(season.rushingTouchdowns)}</td>
                                  <td>{formatStat(season.longRushing)}</td>
                                </tr>
                              ))}
                              {espnStats.rushing && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.rushing.attempts)}</td>
                                  <td>{formatStat(espnStats.rushing.yards)}</td>
                                  <td>{formatStat(espnStats.rushing.yardsPerCarry)}</td>
                                  <td>{formatStat(espnStats.rushing.touchdowns)}</td>
                                  <td>{formatStat(espnStats.rushing.long)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* RB/FB Stats: Rushing first, then Receiving */}
                    {isRB && espnStats.rushingSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Rushing</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Att</th>
                                <th>Yds</th>
                                <th>Avg</th>
                                <th>TD</th>
                                <th>Lng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.rushingSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.rushingAttempts)}</td>
                                  <td>{formatStat(season.rushingYards)}</td>
                                  <td>{formatStat(season.yardsPerRushAttempt)}</td>
                                  <td>{formatStat(season.rushingTouchdowns)}</td>
                                  <td>{formatStat(season.longRushing)}</td>
                                </tr>
                              ))}
                              {espnStats.rushing && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.rushing.attempts)}</td>
                                  <td>{formatStat(espnStats.rushing.yards)}</td>
                                  <td>{formatStat(espnStats.rushing.yardsPerCarry)}</td>
                                  <td>{formatStat(espnStats.rushing.touchdowns)}</td>
                                  <td>{formatStat(espnStats.rushing.long)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* RB Receiving Stats (after rushing) */}
                    {isRB && espnStats.receivingSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Receiving</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Rec</th>
                                <th>Yds</th>
                                <th>Avg</th>
                                <th>TD</th>
                                <th>Lng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.receivingSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.receptions)}</td>
                                  <td>{formatStat(season.receivingYards)}</td>
                                  <td>{formatStat(season.yardsPerReception)}</td>
                                  <td>{formatStat(season.receivingTouchdowns)}</td>
                                  <td>{formatStat(season.longReception)}</td>
                                </tr>
                              ))}
                              {espnStats.receiving && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.receiving.receptions)}</td>
                                  <td>{formatStat(espnStats.receiving.yards)}</td>
                                  <td>{formatStat(espnStats.receiving.yardsPerReception)}</td>
                                  <td>{formatStat(espnStats.receiving.touchdowns)}</td>
                                  <td>{formatStat(espnStats.receiving.long)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* WR/TE Stats: Only Receiving */}
                    {isReceiver && espnStats.receivingSeasons?.length > 0 && (
                      <div className="stats-table-wrapper">
                        <h4>Receiving</h4>
                        <div className="stats-table-scroll">
                          <table className="stats-table">
                            <thead>
                              <tr>
                                <th>Year</th>
                                <th>Team</th>
                                <th>Rec</th>
                                <th>Yds</th>
                                <th>Avg</th>
                                <th>TD</th>
                                <th>Lng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {espnStats.receivingSeasons.map((season, idx) => (
                                <tr key={idx}>
                                  <td>{season.year}</td>
                                  <td>{season.team}</td>
                                  <td>{formatStat(season.receptions)}</td>
                                  <td>{formatStat(season.receivingYards)}</td>
                                  <td>{formatStat(season.yardsPerReception)}</td>
                                  <td>{formatStat(season.receivingTouchdowns)}</td>
                                  <td>{formatStat(season.longReception)}</td>
                                </tr>
                              ))}
                              {espnStats.receiving && (
                                <tr className="stats-total-row">
                                  <td colSpan="2">Career</td>
                                  <td>{formatStat(espnStats.receiving.receptions)}</td>
                                  <td>{formatStat(espnStats.receiving.yards)}</td>
                                  <td>{formatStat(espnStats.receiving.yardsPerReception)}</td>
                                  <td>{formatStat(espnStats.receiving.touchdowns)}</td>
                                  <td>{formatStat(espnStats.receiving.long)}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Empty state based on position */}
                    {isDefensivePlayer && !espnStats.defenseSeasons?.length && (
                      <p className="espn-stats-empty">No career stats available</p>
                    )}
                    {isQB && !espnStats.passingSeasons?.length && !espnStats.rushingSeasons?.length && (
                      <p className="espn-stats-empty">No career stats available</p>
                    )}
                    {isRB && !espnStats.rushingSeasons?.length && !espnStats.receivingSeasons?.length && (
                      <p className="espn-stats-empty">No career stats available</p>
                    )}
                    {isReceiver && !espnStats.receivingSeasons?.length && (
                      <p className="espn-stats-empty">No career stats available</p>
                    )}
                  </div>
                ) : (
                  <p className="espn-stats-empty">Stats not available</p>
                )}
              </div>
              )}

              {/* Pros & Cons */}
              {(() => {
                const notes = getPlayerNotes(player.id);
                const pros = notes?.pros || player.strengths || [];
                const cons = notes?.cons || player.weaknesses || [];
                return (
                  <div className="modal-section">
                    {notes?.comparisons && (
                      <div className="modal-comparisons">
                        <span className="comparisons-label">Comparisons:</span> {notes.comparisons}
                      </div>
                    )}
                    <div className="modal-pros-cons">
                      <div className="modal-pros">
                        <h3 className="pros-title">Pros</h3>
                        {pros.length > 0 ? (
                          <ul>
                            {pros.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        ) : (
                          <p className="modal-empty-list">Coming soon</p>
                        )}
                      </div>
                      <div className="modal-pros-cons-divider" />
                      <div className="modal-cons">
                        <h3 className="cons-title">Cons</h3>
                        {cons.length > 0 ? (
                          <ul>
                            {cons.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        ) : (
                          <p className="modal-empty-list">Coming soon</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

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
