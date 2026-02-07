import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { prospects, positions } from '../data/prospects';
import { draftOrder as baseDraftOrder, teamColors, roundInfo, allTeams } from '../data/draftOrder';
import PlayerModal from '../components/PlayerModal';
import './MockDraft.css';

function MockDraft({ myBoard }) {
  const [userTeams, setUserTeams] = useState([]);
  const [draftStarted, setDraftStarted] = useState(false);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftedPlayers, setDraftedPlayers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [showTeamSelect, setShowTeamSelect] = useState(true);
  const [roundCount, setRoundCount] = useState(1);
  const [randomness, setRandomness] = useState(0);
  const [teamNeedsWeight, setTeamNeedsWeight] = useState(50);
  const [isSimulating, setIsSimulating] = useState(false);
  const [trades, setTrades] = useState([]); // Array of { pick, fromTeam, toTeam }
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeUserPick, setTradeUserPick] = useState(null);
  const [tradeTargetPick, setTradeTargetPick] = useState(null);
  const [modalPlayer, setModalPlayer] = useState(null);
  const [modalPlayerIndex, setModalPlayerIndex] = useState(null);
  const currentPickRef = useRef(null);
  const simulationRef = useRef(null);

  // Apply trades to draft order
  const draftOrder = useMemo(() => {
    const order = baseDraftOrder.map(p => ({ ...p }));
    trades.forEach(trade => {
      const pick = order.find(p => p.pick === trade.pick);
      if (pick) {
        pick.abbrev = trade.toTeam;
        pick.team = allTeams.find(t => t === trade.toTeam) || trade.toTeam;
      }
    });
    return order;
  }, [trades]);

  // Get the rounds array from roundCount
  const selectedRounds = useMemo(() => {
    return Array.from({ length: roundCount }, (_, i) => i + 1);
  }, [roundCount]);

  // Get the picks for selected rounds
  const activePicks = useMemo(() => {
    return draftOrder.filter(p => p.round <= roundCount);
  }, [roundCount, draftOrder]);

  const totalPicks = activePicks.length;
  const currentPickIndex = activePicks.findIndex(p => p.pick === currentPick);

  // Scroll to current pick when it changes
  useEffect(() => {
    if (currentPickRef.current && draftStarted) {
      currentPickRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPick, draftStarted]);

  // Get available players sorted by board
  const getAvailablePlayers = useCallback((drafted) => {
    const draftedIds = Object.values(drafted).map(p => p.id);
    const available = prospects.filter(p => !draftedIds.includes(p.id));

    if (myBoard && myBoard.length > 0) {
      const boardIds = myBoard.map(p => p.id);
      return available.sort((a, b) => {
        const aIndex = boardIds.indexOf(a.id);
        const bIndex = boardIds.indexOf(b.id);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.id - b.id;
      });
    }
    return available.sort((a, b) => a.id - b.id);
  }, [myBoard]);

  const availablePlayers = useMemo(() => {
    return getAvailablePlayers(draftedPlayers);
  }, [draftedPlayers, getAvailablePlayers]);

  // Filter available players by search and position
  const filteredPlayers = useMemo(() => {
    return availablePlayers.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.college.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = !positionFilter || p.position === positionFilter;
      return matchesSearch && matchesPosition;
    });
  }, [availablePlayers, searchTerm, positionFilter]);

  const currentPickInfo = activePicks.find(p => p.pick === currentPick);
  const isUserPick = currentPickInfo && userTeams.includes(currentPickInfo.abbrev);

  const toggleTeam = (abbrev) => {
    setUserTeams(prev =>
      prev.includes(abbrev)
        ? prev.filter(t => t !== abbrev)
        : [...prev, abbrev]
    );
  };

  const selectAllTeams = () => setUserTeams([...allTeams]);
  const clearAllTeams = () => setUserTeams([]);

  const getPicksForRounds = (numRounds) => {
    return draftOrder.filter(p => p.round <= numRounds).length;
  };

  // Get random pick based on randomness and team needs settings
  const getRandomPick = useCallback((available, teamNeeds = []) => {
    if (available.length === 0) return null;

    // Calculate the candidate pool size based on randomness
    const maxRange = Math.max(1, Math.floor(1 + (randomness / 100) * 3));
    const range = Math.min(maxRange, available.length);

    // Get the top candidates based on big board
    let candidates = available.slice(0, Math.max(range * 3, 15)); // Consider more players for needs matching

    // If team needs weight > 0, score candidates by needs matching
    if (teamNeedsWeight > 0 && teamNeeds.length > 0) {
      candidates = candidates.map(player => {
        // Check if player's position matches any team need
        const needIndex = teamNeeds.indexOf(player.position);
        let needScore = 0;

        if (needIndex !== -1) {
          // Higher score for higher priority needs (earlier in the array)
          needScore = (teamNeeds.length - needIndex) / teamNeeds.length;
        }

        // Big board score (higher = better rank, normalized)
        const boardRank = available.indexOf(player);
        const boardScore = 1 - (boardRank / Math.max(available.length, 1));

        // Weighted combination of scores
        const needsInfluence = teamNeedsWeight / 100;
        const combinedScore = (boardScore * (1 - needsInfluence)) + (needScore * needsInfluence);

        return { ...player, score: combinedScore };
      });

      // Sort by combined score
      candidates.sort((a, b) => b.score - a.score);
    }

    // Pick from top candidates with some randomness
    const finalRange = Math.min(range, candidates.length);
    const pickIndex = Math.floor(Math.random() * finalRange);
    return candidates[pickIndex];
  }, [randomness, teamNeedsWeight]);

  // Simulate picks with delay until user pick or end
  const simulateWithDelay = useCallback((startIndex, drafted, onComplete) => {
    let pickIndex = startIndex;
    let currentDrafted = { ...drafted };
    let available = getAvailablePlayers(currentDrafted);

    const makeNextPick = () => {
      if (pickIndex >= activePicks.length) {
        setIsSimulating(false);
        setCurrentPick(activePicks[activePicks.length - 1].pick + 1);
        if (onComplete) onComplete(currentDrafted);
        return;
      }

      const pickInfo = activePicks[pickIndex];

      // Stop if it's a user pick
      if (userTeams.includes(pickInfo.abbrev)) {
        setIsSimulating(false);
        setCurrentPick(pickInfo.pick);
        setDraftedPlayers(currentDrafted);
        if (onComplete) onComplete(currentDrafted);
        return;
      }

      // Make CPU pick
      if (available.length > 0) {
        const bestPick = getRandomPick(available, pickInfo.needs || []);
        if (bestPick) {
          currentDrafted = { ...currentDrafted, [pickInfo.pick]: bestPick };
          available = available.filter(p => p.id !== bestPick.id);
          setDraftedPlayers(currentDrafted);
          setCurrentPick(pickInfo.pick);
        }
      }

      pickIndex++;
      simulationRef.current = setTimeout(makeNextPick, 150); // 150ms delay between picks
    };

    setIsSimulating(true);
    makeNextPick();
  }, [activePicks, userTeams, getAvailablePlayers, getRandomPick]);

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        clearTimeout(simulationRef.current);
      }
    };
  }, []);

  const startDraft = () => {
    setDraftStarted(true);
    setShowTeamSelect(false);
    setDraftedPlayers({});

    // Start simulation from pick 1
    const firstPickIndex = 0;
    simulateWithDelay(firstPickIndex, {});
  };

  const resetDraft = () => {
    if (simulationRef.current) {
      clearTimeout(simulationRef.current);
    }
    setIsSimulating(false);
    setDraftStarted(false);
    setShowTeamSelect(true);
    setCurrentPick(1);
    setDraftedPlayers({});
    setSearchTerm('');
    setPositionFilter('');
    setTrades([]);
  };

  const makePick = (player) => {
    const newDrafted = { ...draftedPlayers, [currentPick]: player };
    setDraftedPlayers(newDrafted);
    setSearchTerm('');
    setPositionFilter('');

    // Find next pick index and simulate
    const nextIndex = currentPickIndex + 1;
    if (nextIndex < activePicks.length) {
      simulateWithDelay(nextIndex, newDrafted);
    } else {
      setCurrentPick(activePicks[activePicks.length - 1].pick + 1);
    }
  };

  // Trade functionality
  const getUserFuturePicks = () => {
    return activePicks.filter(p =>
      userTeams.includes(p.abbrev) &&
      p.pick > currentPick &&
      !draftedPlayers[p.pick]
    );
  };

  const getTradeTargetPicks = () => {
    return activePicks.filter(p =>
      !userTeams.includes(p.abbrev) &&
      p.pick > currentPick &&
      !draftedPlayers[p.pick]
    );
  };

  const executeTrade = () => {
    if (!tradeUserPick || !tradeTargetPick) return;

    const userPickInfo = activePicks.find(p => p.pick === tradeUserPick);
    const targetPickInfo = activePicks.find(p => p.pick === tradeTargetPick);

    if (!userPickInfo || !targetPickInfo) return;

    // Swap the picks
    setTrades(prev => [
      ...prev,
      { pick: tradeUserPick, fromTeam: userPickInfo.abbrev, toTeam: targetPickInfo.abbrev },
      { pick: tradeTargetPick, fromTeam: targetPickInfo.abbrev, toTeam: userPickInfo.abbrev }
    ]);

    setShowTradeModal(false);
    setTradeUserPick(null);
    setTradeTargetPick(null);
  };

  const isDraftComplete = !activePicks.some(p => p.pick >= currentPick);
  const progressPercent = Math.min((Object.keys(draftedPlayers).length / totalPicks) * 100, 100);

  // Get user's picks for the summary
  const userPicks = useMemo(() => {
    return activePicks
      .filter(p => userTeams.includes(p.abbrev) && draftedPlayers[p.pick])
      .map(p => ({
        pick: p.pick,
        round: p.round,
        pickInRound: p.pickInRound,
        team: p.team,
        abbrev: p.abbrev,
        player: draftedPlayers[p.pick]
      }));
  }, [draftedPlayers, userTeams, activePicks]);

  // Get unique teams for team selection
  const teamsWithPicks = useMemo(() => {
    const teamMap = new Map();
    baseDraftOrder.forEach(p => {
      if (!teamMap.has(p.abbrev)) {
        teamMap.set(p.abbrev, { abbrev: p.abbrev, team: p.team, firstPick: p.pick });
      }
    });
    return Array.from(teamMap.values()).sort((a, b) => a.firstPick - b.firstPick);
  }, []);

  return (
    <div className="mock-draft-page">
      <div className="container">
        <div className="page-header">
          <h1>Mock Draft Simulator</h1>
          <p className="page-subtitle">
            {myBoard && myBoard.length > 0 ? (
              <span className="board-indicator">Custom Board ({myBoard.length})</span>
            ) : (
              <span className="board-indicator">Consensus Board</span>
            )}
          </p>
        </div>

        {/* Team Selection */}
        {showTeamSelect && (
          <div className="team-selection">
            <div className="round-selection">
              <h3>Select Rounds</h3>
              <p>Choose how many rounds to simulate</p>
              <div className="round-options">
                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                  <label key={num} className={`round-option ${roundCount === num ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="roundCount"
                      checked={roundCount === num}
                      onChange={() => setRoundCount(num)}
                    />
                    <span className="round-radio"></span>
                    <span className="round-label">
                      <span className="round-num">{num} Round{num !== 1 ? 's' : ''}</span>
                      <span className="round-picks">{getPicksForRounds(num)} picks</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="cpu-settings">
              <div className="cpu-setting">
                <h3>CPU Randomness</h3>
                <p>Controls how much variance in CPU picks (0 = always best available, 100 = high variance)</p>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={randomness}
                    onChange={(e) => setRandomness(parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <div className="slider-labels">
                    <span>Predictable</span>
                    <span className="slider-value">{randomness}%</span>
                    <span>Chaotic</span>
                  </div>
                </div>
              </div>

              <div className="cpu-setting">
                <h3>Team Needs Weight</h3>
                <p>How much CPU prioritizes filling team needs vs best player available</p>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={teamNeedsWeight}
                    onChange={(e) => setTeamNeedsWeight(parseInt(e.target.value))}
                    className="setting-slider"
                  />
                  <div className="slider-labels">
                    <span>BPA Only</span>
                    <span className="slider-value">{teamNeedsWeight}%</span>
                    <span>Needs Only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="team-selection-inner">
              <h2>Select Your Teams</h2>
              <p>Choose which teams you want to control in the draft</p>

              <div className="team-select-actions">
                <button className="btn btn-secondary" onClick={selectAllTeams}>
                  Select All
                </button>
                <button className="btn btn-secondary" onClick={clearAllTeams}>
                  Clear All
                </button>
              </div>

              <div className="team-grid">
                {teamsWithPicks.map(({ team, abbrev, firstPick }) => (
                  <button
                    key={abbrev}
                    className={`team-btn ${userTeams.includes(abbrev) ? 'selected' : ''}`}
                    onClick={() => toggleTeam(abbrev)}
                    style={{
                      '--team-primary': teamColors[abbrev]?.primary,
                      '--team-secondary': teamColors[abbrev]?.secondary
                    }}
                  >
                    <span className="team-pick">#{firstPick}</span>
                    <span className="team-abbrev">{abbrev}</span>
                    <span className="team-name">{team}</span>
                  </button>
                ))}
              </div>

              <div className="start-draft-section">
                <p className="teams-selected">
                  {userTeams.length === 0
                    ? 'Select at least one team to start'
                    : <><strong>{userTeams.length}</strong> team{userTeams.length !== 1 ? 's' : ''} selected</>}
                </p>
                <button
                  className="btn btn-primary btn-large start-draft-btn"
                  onClick={startDraft}
                  disabled={userTeams.length === 0}
                >
                  Start Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Draft Interface - Swapped layout */}
        {draftStarted && (
          <>
            {/* Progress Bar */}
            <div className="draft-progress">
              <div className="progress-info">
                <span className="progress-label">
                  {roundCount === 1 ? 'Round 1' : `Rounds 1-${roundCount}`}
                </span>
                <span className="progress-text">
                  Pick {Math.min(Object.keys(draftedPlayers).length + 1, totalPicks)} of {totalPicks}
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="progress-actions">
                <button className="btn btn-secondary btn-small" onClick={resetDraft}>
                  Reset
                </button>
              </div>
            </div>

            <div className="draft-interface">
              {/* Main Selection Panel (now on left, larger) */}
              {!isDraftComplete && currentPickInfo && (
                <div className="selection-panel">
                  <div
                    className="on-the-clock"
                    style={{
                      '--team-primary': teamColors[currentPickInfo?.abbrev]?.primary,
                      '--team-secondary': teamColors[currentPickInfo?.abbrev]?.secondary
                    }}
                  >
                    <div className="clock-header">
                      <span className="clock-label">
                        {isSimulating ? 'Simulating...' : 'On The Clock'}
                      </span>
                      <span className="clock-pick">
                        Pick #{currentPick} (R{currentPickInfo.round}.{currentPickInfo.pickInRound})
                      </span>
                    </div>
                    <div className="clock-team-info">
                      <span className="clock-team-name">{currentPickInfo?.team}</span>
                      {isUserPick && !isSimulating && <span className="your-pick-badge">YOUR PICK</span>}
                    </div>
                  </div>

                  <div className="selection-content">
                    {isSimulating ? (
                      <div className="simulating-indicator">
                        <div className="sim-spinner"></div>
                        <p>Simulating picks...</p>
                      </div>
                    ) : isUserPick ? (
                      <>
                        <div className="user-pick-actions">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowTradeModal(true)}
                          >
                            Trade Pick
                          </button>
                        </div>

                        <div className="search-controls">
                          <input
                            type="text"
                            placeholder="Search players..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                          />
                          <select
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                            className="position-select"
                          >
                            <option value="">All Pos</option>
                            {positions.map(pos => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </div>

                        <div className="available-players">
                          <div className="available-header">
                            <h3>Available Players</h3>
                            <span className="available-count">{filteredPlayers.length}</span>
                          </div>
                          <div className="player-list-draft">
                            {filteredPlayers.slice(0, 50).map((player, index) => (
                              <div key={player.id} className="draft-player-row">
                                <button
                                  type="button"
                                  className="draft-player-link"
                                  onClick={() => { setModalPlayer(player); setModalPlayerIndex(index); }}
                                >
                                  <span className="player-rank">{player.id}</span>
                                  <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                                    {player.position}
                                  </span>
                                  <div className="player-info">
                                    <span className="player-name">{player.name}</span>
                                    <span className="player-college">{player.college}</span>
                                  </div>
                                </button>
                                <button
                                  className="btn btn-primary btn-small"
                                  onClick={() => makePick(player)}
                                >
                                  Draft
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Draft Complete Panel */}
              {isDraftComplete && (
                <div className="selection-panel draft-complete-panel">
                  <div className="draft-complete">
                    <div className="complete-icon">🏆</div>
                    <h2>Draft Complete!</h2>
                    <p>
                      {roundCount === 7
                        ? 'All 7 rounds are finished.'
                        : `Round${roundCount > 1 ? 's' : ''} 1${roundCount > 1 ? `-${roundCount}` : ''} complete.`}
                    </p>

                    {userPicks.length > 0 && (
                      <div className="user-picks-summary">
                        <h3>Your Selections ({userPicks.length} picks)</h3>
                        <div className="user-picks-list">
                          {userPicks.map(({ pick, round, pickInRound, abbrev, player }) => (
                            <div key={pick} className="user-pick-item">
                              <div className="pick-number-group">
                                <div className="pick-number">{pick}</div>
                                <div className="pick-round">R{round}.{pickInRound}</div>
                              </div>
                              <div className="pick-team">
                                <span className="team-abbrev">{abbrev}</span>
                              </div>
                              <div className="pick-player">
                                <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                                  {player.position}
                                </span>
                                <span className="player-name">{player.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="complete-actions">
                      <button className="btn btn-primary" onClick={resetDraft}>
                        Start New Draft
                      </button>
                      <Link to="/prospects" className="btn btn-secondary">
                        View Big Board
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Draft Board Sidebar (now on right, smaller) */}
              <div className="draft-board">
                <div className="draft-board-header">
                  <h2>Draft Board</h2>
                </div>

                <div className="draft-picks">
                  {activePicks.map((pickData) => {
                    const { pick, round, pickInRound, abbrev, notes } = pickData;
                    const player = draftedPlayers[pick];
                    const isCurrent = pick === currentPick;
                    const isUser = userTeams.includes(abbrev);

                    return (
                      <div
                        key={pick}
                        ref={isCurrent ? currentPickRef : null}
                        className={`draft-pick ${player ? 'picked' : ''} ${isCurrent ? 'current' : ''} ${isUser ? 'user-team' : ''}`}
                        style={{
                          '--team-primary': teamColors[abbrev]?.primary,
                          '--team-secondary': teamColors[abbrev]?.secondary
                        }}
                      >
                        <div className="pick-number">{pick}</div>
                        <div className="pick-team">
                          <span className="team-abbrev">{abbrev}</span>
                          {isUser && <span className="user-badge">YOU</span>}
                        </div>
                        {player ? (
                          <div className="pick-player">
                            <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                              {player.position}
                            </span>
                            <span className="player-name">{player.name}</span>
                          </div>
                        ) : (
                          <div className={`pick-empty ${isCurrent ? 'on-clock' : ''}`}>
                            {isCurrent ? '◉' : '—'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <PlayerModal
          player={modalPlayer}
          isOpen={modalPlayer !== null}
          onClose={() => { setModalPlayer(null); setModalPlayerIndex(null); }}
          onPrev={modalPlayerIndex > 0 ? () => {
            const prev = filteredPlayers[modalPlayerIndex - 1];
            if (prev) { setModalPlayer(prev); setModalPlayerIndex(modalPlayerIndex - 1); }
          } : null}
          onNext={modalPlayerIndex !== null && modalPlayerIndex < Math.min(filteredPlayers.length, 50) - 1 ? () => {
            const next = filteredPlayers[modalPlayerIndex + 1];
            if (next) { setModalPlayer(next); setModalPlayerIndex(modalPlayerIndex + 1); }
          } : null}
        />

        {/* Trade Modal */}
        {showTradeModal && (
          <div className="trade-modal-overlay" onClick={() => setShowTradeModal(false)}>
            <div className="trade-modal" onClick={e => e.stopPropagation()}>
              <div className="trade-modal-header">
                <h2>Trade Draft Pick</h2>
                <button className="close-btn" onClick={() => setShowTradeModal(false)}>×</button>
              </div>

              <div className="trade-modal-content">
                <div className="trade-side">
                  <h3>Your Pick to Trade</h3>
                  <div className="trade-picks-list">
                    {getUserFuturePicks().map(p => (
                      <button
                        key={p.pick}
                        className={`trade-pick-btn ${tradeUserPick === p.pick ? 'selected' : ''}`}
                        onClick={() => setTradeUserPick(p.pick)}
                      >
                        <span className="pick-num">#{p.pick}</span>
                        <span className="pick-info">R{p.round}.{p.pickInRound}</span>
                      </button>
                    ))}
                    {getUserFuturePicks().length === 0 && (
                      <p className="no-picks">No picks available to trade</p>
                    )}
                  </div>
                </div>

                <div className="trade-arrow">⇄</div>

                <div className="trade-side">
                  <h3>Pick to Acquire</h3>
                  <div className="trade-picks-list">
                    {getTradeTargetPicks().slice(0, 20).map(p => (
                      <button
                        key={p.pick}
                        className={`trade-pick-btn ${tradeTargetPick === p.pick ? 'selected' : ''}`}
                        onClick={() => setTradeTargetPick(p.pick)}
                      >
                        <span className="pick-num">#{p.pick}</span>
                        <span className="pick-info">R{p.round}.{p.pickInRound} ({p.abbrev})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="trade-modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={executeTrade}
                  disabled={!tradeUserPick || !tradeTargetPick}
                >
                  Execute Trade
                </button>
                <button className="btn btn-secondary" onClick={() => setShowTradeModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockDraft;
