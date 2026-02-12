import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { prospects, positions } from '../data/prospects';
import { useAdminBigBoard } from '../hooks/useAdminBigBoard';
import { draftOrder as baseDraftOrder, teamColors, roundInfo, allTeams, teamNeeds } from '../data/draftOrder';
import { getNflLogo } from '../data/nflLogos';
import { getCollegeLogo } from '../data/collegeLogos';
import PlayerModal from '../components/PlayerModal';
import './MockDraft.css';

function MockDraft({ myBoard }) {
  const { rankings: customBigBoardRankings } = useAdminBigBoard();
  const [userTeams, setUserTeams] = useState([]);
  const [draftStarted, setDraftStarted] = useState(false);
  const [currentPick, setCurrentPick] = useState(1);
  const [draftedPlayers, setDraftedPlayers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [showTeamSelect, setShowTeamSelect] = useState(true);
  const [roundCount, setRoundCount] = useState(1);
  const [randomness, setRandomness] = useState(35);
  const [teamNeedsWeight, setTeamNeedsWeight] = useState(35);
  const [selectedBoard, setSelectedBoard] = useState('mrlutz'); // 'consensus', 'mrlutz', 'custom'
  const [isSimulating, setIsSimulating] = useState(false);
  const [trades, setTrades] = useState([]); // Array of { pick, fromTeam, toTeam }
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeUserPick, setTradeUserPick] = useState(null);
  const [tradeTargetPick, setTradeTargetPick] = useState(null);
  const [modalPlayer, setModalPlayer] = useState(null);
  const [modalPlayerIndex, setModalPlayerIndex] = useState(null);
  const [pickDebugInfo, setPickDebugInfo] = useState({});
  const [filledNeeds, setFilledNeeds] = useState({});
  const [showDebug, setShowDebug] = useState(false);
  const [showFullResults, setShowFullResults] = useState(false);
  const [fullResultsRoundFilter, setFullResultsRoundFilter] = useState(null);
  const [showMyPicks, setShowMyPicks] = useState(false);
  const [myPicksTeamIndex, setMyPicksTeamIndex] = useState(0);
  const [reviewTeam, setReviewTeam] = useState(null); // For complete panel team review
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

  // Get the board order based on selection
  const activeBoardOrder = useMemo(() => {
    if (selectedBoard === 'mrlutz' && customBigBoardRankings.length > 0) {
      return customBigBoardRankings;
    } else if (selectedBoard === 'custom' && myBoard && myBoard.length > 0) {
      return myBoard.map(p => p.id);
    }
    // Default to consensus (prospect ids in order)
    return prospects.map(p => p.id);
  }, [selectedBoard, myBoard, customBigBoardRankings]);

  // Get available players sorted by board
  const getAvailablePlayers = useCallback((drafted) => {
    const draftedIds = Object.values(drafted).map(p => p.id);
    const available = prospects.filter(p => !draftedIds.includes(p.id));

    // Sort by the active board order
    return available.sort((a, b) => {
      const aIndex = activeBoardOrder.indexOf(a.id);
      const bIndex = activeBoardOrder.indexOf(b.id);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.id - b.id;
    });
  }, [activeBoardOrder]);

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

  // Position value premiums by round tier
  const positionPremiums = useMemo(() => ({
    early: { QB: 0.3, EDGE: 0.2, OT: 0.2, CB: 0.15, WR: 0.1, DL: 0.1 },
    mid:   { WR: 0.15, S: 0.1, LB: 0.1, DL: 0.1 },
    late:  { RB: 0.15, OG: 0.1, OC: 0.1, TE: 0.1 }
  }), []);

  // Evaluate all candidates and return best pick with debug info
  const evaluatePick = useCallback((available, pickInfo, currentFilledNeeds) => {
    if (available.length === 0) return null;

    const teamNeeds = pickInfo.needs || [];
    const abbrev = pickInfo.abbrev;
    const teamFilled = currentFilledNeeds[abbrev] || {};
    const round = pickInfo.round;
    const pickNum = pickInfo.pick;

    // SPECIAL CASE: Raiders pick #1 - ALWAYS select Mendoza
    if (pickNum === 1 && abbrev === 'LV') {
      const mendoza = available.find(p => p.name.toLowerCase().includes('mendoza'));
      if (mendoza) {
        return {
          player: mendoza,
          debug: {
            boardScore: 1,
            needScore: 1,
            posValueScore: 1,
            reachPenalty: 0,
            finalScore: 1,
            confidence: 99,
            pickType: 'Locked Pick',
            teamNeeds,
            filledPositions: { ...teamFilled },
            runners: []
          }
        };
      }
    }

    // SPECIAL CASE: Jets pick #2 - BPA excluding offensive line
    if (pickNum === 2 && abbrev === 'NYJ') {
      const oLinePositions = ['OT', 'OG', 'OC'];
      const nonOLineAvailable = available.filter(p => !oLinePositions.includes(p.position));
      if (nonOLineAvailable.length > 0) {
        const bestPlayer = nonOLineAvailable[0]; // First available is BPA
        return {
          player: bestPlayer,
          debug: {
            boardScore: 1,
            needScore: 0,
            posValueScore: 1,
            reachPenalty: 0,
            finalScore: 1,
            confidence: 99,
            pickType: 'BPA (No OL)',
            teamNeeds,
            filledPositions: { ...teamFilled },
            runners: nonOLineAvailable.slice(1, 4).map(p => ({ name: p.name, position: p.position, finalScore: 0.9 }))
          }
        };
      }
    }

    // SPECIAL CASE: Cardinals pick #3 - BPA excluding RB
    if (pickNum === 3 && abbrev === 'ARI') {
      const nonRBAvailable = available.filter(p => p.position !== 'RB');
      if (nonRBAvailable.length > 0) {
        const bestPlayer = nonRBAvailable[0];
        return {
          player: bestPlayer,
          debug: {
            boardScore: 1,
            needScore: 0,
            posValueScore: 1,
            reachPenalty: 0,
            finalScore: 1,
            confidence: 99,
            pickType: 'BPA (No RB)',
            teamNeeds,
            filledPositions: { ...teamFilled },
            runners: nonRBAvailable.slice(1, 4).map(p => ({ name: p.name, position: p.position, finalScore: 0.9 }))
          }
        };
      }
    }

    // SPECIAL CASE: Browns pick #6 - Offense only, excluding QB
    if (pickNum === 6 && abbrev === 'CLE') {
      const offensivePositions = ['RB', 'WR', 'TE', 'OT', 'OG', 'OC'];
      const offensiveAvailable = available.filter(p => offensivePositions.includes(p.position));
      if (offensiveAvailable.length > 0) {
        const bestOffensive = offensiveAvailable[0];
        return {
          player: bestOffensive,
          debug: {
            boardScore: 1,
            needScore: 1,
            posValueScore: 1,
            reachPenalty: 0,
            finalScore: 1,
            confidence: 99,
            pickType: 'Offense Only',
            teamNeeds,
            filledPositions: { ...teamFilled },
            runners: offensiveAvailable.slice(1, 4).map(p => ({ name: p.name, position: p.position, finalScore: 0.9 }))
          }
        };
      }
    }

    // Determine round tier for position premiums
    const roundTier = round <= 2 ? 'early' : round <= 4 ? 'mid' : 'late';
    const premiums = positionPremiums[roundTier];

    // Candidate pool: wider than before
    const maxRange = Math.max(1, Math.floor(1 + (randomness / 100) * 4));
    const candidatePoolSize = Math.max(maxRange * 3, 20);
    const candidates = available.slice(0, Math.min(candidatePoolSize, available.length));

    // QB boost for QB-needy teams in top 12 picks (tapers from pick 1 to 12)
    const hasQBNeed = teamNeeds.includes('QB');
    const qbBoostMultiplier = (hasQBNeed && pickNum <= 12) ? (1 - (pickNum - 1) / 12) : 0;

    // Chargers first round interior OL bias
    const isChargersRound1 = abbrev === 'LAC' && round === 1;

    // Score each candidate
    const scored = candidates.map((player, idx) => {
      // 1. Board Score (BPA)
      const boardScore = 1 - (idx / candidatePoolSize);

      // 2. Need Score with diminishing returns
      let needScore = 0;
      if (teamNeeds.length > 0) {
        const needIndex = teamNeeds.indexOf(player.position);
        if (needIndex !== -1) {
          const baseNeedScore = (teamNeeds.length - needIndex) / teamNeeds.length;
          const timesFilled = teamFilled[player.position] || 0;
          needScore = baseNeedScore * Math.pow(0.5, timesFilled);
        }
      }

      // 3. Position Value Score
      const premium = premiums[player.position] || 0;
      const posValueScore = 0.5 + premium;

      // 4. Reach Penalty (player.id = consensus rank)
      const reachGap = player.id - pickInfo.pick;
      let reachPenalty = 0;
      if (reachGap > 40) reachPenalty = 0.3;
      else if (reachGap > 25) reachPenalty = 0.15;
      else if (reachGap > 15) reachPenalty = 0.05;

      // 5. QB boost for top 12 QB-needy teams (very strong, tapers off)
      let qbBoost = 0;
      if (player.position === 'QB' && qbBoostMultiplier > 0) {
        // Strong boost: 0.8 at pick 1, tapering to 0 at pick 12
        qbBoost = 0.8 * qbBoostMultiplier;
      }

      // 6. Chargers round 1 interior OL bias
      let interiorOLBoost = 0;
      if (isChargersRound1 && (player.position === 'OG' || player.position === 'OC')) {
        interiorOLBoost = 0.5;
      }

      // Combine scores with dynamic weights
      const needsInfluence = teamNeedsWeight / 100;
      const W_board = (1 - needsInfluence) * 0.65 + 0.2;
      const W_need = needsInfluence * 0.6;
      const W_posValue = 0.15;

      const finalScore = (boardScore * W_board) + (needScore * W_need) + (posValueScore * W_posValue) - reachPenalty + qbBoost + interiorOLBoost;

      return { player, boardScore, needScore, posValueScore, reachPenalty, qbBoost, interiorOLBoost, finalScore, W_board, W_need, W_posValue };
    });

    // Sort by final score descending
    scored.sort((a, b) => b.finalScore - a.finalScore);

    // Apply randomness to pick from top N
    const finalRange = Math.max(1, Math.floor(1 + (randomness / 100) * 4));
    const pickIndex = Math.floor(Math.random() * Math.min(finalRange, scored.length));
    const selected = scored[pickIndex];

    // Classify pick type
    const flags = [];
    if (selected.boardScore > 0.8 && selected.needScore < 0.3) flags.push('BPA');
    else if (selected.needScore > 0.5 && selected.boardScore < 0.6) flags.push('Need');
    else if (selected.boardScore > 0.5 && selected.needScore > 0.3) flags.push('BPA + Need');
    else if (selected.boardScore > 0.5) flags.push('BPA');
    else flags.push('Need');

    if (selected.reachPenalty > 0 && !flags.includes('Reach')) {
      if (flags[0] === 'BPA') flags[0] = 'Reach';
      else flags.push('Reach');
    }

    const pickType = flags.join(' + ');

    // Confidence score
    const maxPossible = selected.W_board + selected.W_need + selected.W_posValue;
    const confidence = Math.min(99, Math.max(0, Math.round((selected.finalScore / maxPossible) * 100)));

    // Top 3 runners-up (excluding selected)
    const runners = scored
      .filter((s, i) => i !== pickIndex)
      .slice(0, 3)
      .map(s => ({ name: s.player.name, position: s.player.position, finalScore: s.finalScore }));

    return {
      player: selected.player,
      debug: {
        boardScore: selected.boardScore,
        needScore: selected.needScore,
        posValueScore: selected.posValueScore,
        reachPenalty: selected.reachPenalty,
        finalScore: selected.finalScore,
        confidence,
        pickType,
        teamNeeds,
        filledPositions: { ...teamFilled },
        runners
      }
    };
  }, [randomness, teamNeedsWeight, positionPremiums]);

  // Simulate picks with delay until user pick or end
  const simulateWithDelay = useCallback((startIndex, drafted, onComplete, existingFilledNeeds = {}) => {
    let pickIndex = startIndex;
    let currentDrafted = { ...drafted };
    let available = getAvailablePlayers(currentDrafted);
    const currentFilledNeeds = JSON.parse(JSON.stringify(existingFilledNeeds));
    const currentDebugInfo = {};

    const makeNextPick = () => {
      if (pickIndex >= activePicks.length) {
        setIsSimulating(false);
        setCurrentPick(activePicks[activePicks.length - 1].pick + 1);
        setPickDebugInfo(prev => ({ ...prev, ...currentDebugInfo }));
        setFilledNeeds(currentFilledNeeds);
        if (onComplete) onComplete(currentDrafted);
        return;
      }

      const pickInfo = activePicks[pickIndex];

      // Stop if it's a user pick
      if (userTeams.includes(pickInfo.abbrev)) {
        setIsSimulating(false);
        setCurrentPick(pickInfo.pick);
        setDraftedPlayers(currentDrafted);
        setPickDebugInfo(prev => ({ ...prev, ...currentDebugInfo }));
        setFilledNeeds(currentFilledNeeds);
        if (onComplete) onComplete(currentDrafted);
        return;
      }

      // Make CPU pick
      if (available.length > 0) {
        const result = evaluatePick(available, pickInfo, currentFilledNeeds);
        if (result) {
          const { player, debug } = result;
          currentDrafted = { ...currentDrafted, [pickInfo.pick]: player };
          available = available.filter(p => p.id !== player.id);
          setDraftedPlayers(currentDrafted);
          setCurrentPick(pickInfo.pick);

          // Track filled needs
          if (!currentFilledNeeds[pickInfo.abbrev]) currentFilledNeeds[pickInfo.abbrev] = {};
          currentFilledNeeds[pickInfo.abbrev][player.position] = (currentFilledNeeds[pickInfo.abbrev][player.position] || 0) + 1;

          // Store debug info
          currentDebugInfo[pickInfo.pick] = debug;
        }
      }

      pickIndex++;
      simulationRef.current = setTimeout(makeNextPick, 150);
    };

    setIsSimulating(true);
    makeNextPick();
  }, [activePicks, userTeams, getAvailablePlayers, evaluatePick]);

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
    setPickDebugInfo({});
    setFilledNeeds({});

    // Start simulation from pick 1
    const firstPickIndex = 0;
    simulateWithDelay(firstPickIndex, {}, null, {});
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
    setPickDebugInfo({});
    setFilledNeeds({});
    setShowDebug(false);
  };

  const makePick = (player) => {
    const newDrafted = { ...draftedPlayers, [currentPick]: player };
    setDraftedPlayers(newDrafted);
    setSearchTerm('');
    setPositionFilter('');

    // Track user's filled needs
    const updatedFilledNeeds = JSON.parse(JSON.stringify(filledNeeds));
    if (currentPickInfo) {
      const abbrev = currentPickInfo.abbrev;
      if (!updatedFilledNeeds[abbrev]) updatedFilledNeeds[abbrev] = {};
      updatedFilledNeeds[abbrev][player.position] = (updatedFilledNeeds[abbrev][player.position] || 0) + 1;
    }
    setFilledNeeds(updatedFilledNeeds);

    // Find next pick index and simulate
    const nextIndex = currentPickIndex + 1;
    if (nextIndex < activePicks.length) {
      simulateWithDelay(nextIndex, newDrafted, null, updatedFilledNeeds);
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
                    <span className="round-num">{num}</span>
                  </label>
                ))}
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
                {teamsWithPicks.map(({ abbrev, firstPick }) => (
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
                    <img
                      src={getNflLogo(abbrev)}
                      alt={abbrev}
                      className="team-logo"
                    />
                  </button>
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

            <div className="board-selection">
              <h3>Draft Board</h3>
              <p>Choose which big board the CPU will draft from</p>
              <div className="board-options-inline">
                <span
                  className={`board-option-text ${selectedBoard === 'consensus' ? 'selected' : ''}`}
                  onClick={() => setSelectedBoard('consensus')}
                >
                  Consensus
                </span>
                <span className="board-divider">|</span>
                <span
                  className={`board-option-text ${selectedBoard === 'mrlutz' ? 'selected' : ''}`}
                  onClick={() => setSelectedBoard('mrlutz')}
                >
                  Mr Lutz's
                </span>
                <span className="board-divider">|</span>
                <span
                  className={`board-option-text ${selectedBoard === 'custom' ? 'selected' : ''} ${!myBoard || myBoard.length === 0 ? 'disabled' : ''}`}
                  onClick={() => myBoard && myBoard.length > 0 && setSelectedBoard('custom')}
                >
                  My Board
                </span>
              </div>
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
                    <div className="clock-team-needs">
                      Needs: {teamNeeds[currentPickInfo?.abbrev]?.join(', ') || 'N/A'}
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
                                  <div className="player-logo-small">
                                    {getCollegeLogo(player.college) ? (
                                      <img src={getCollegeLogo(player.college)} alt={player.college} />
                                    ) : (
                                      <div className="logo-placeholder-small">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                          <path d="M2 17l10 5 10-5" />
                                          <path d="M2 12l10 5 10-5" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
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
                    <h2>Draft Complete!</h2>
                    <p>
                      {roundCount === 7
                        ? 'All 7 rounds are finished.'
                        : `Round${roundCount > 1 ? 's' : ''} 1${roundCount > 1 ? `-${roundCount}` : ''} complete.`}
                    </p>

                    <div className="complete-actions">
                      <button className="btn btn-primary" onClick={() => setShowFullResults(true)}>
                        View Full Results
                      </button>
                    </div>

                    <div className="complete-team-review">
                      <div className="team-review-header">
                        <h3>Team Review</h3>
                        <div className="team-review-nav">
                          {userTeams.length > 1 && (
                            <button
                              className="team-nav-btn-small"
                              onClick={() => {
                                const newIdx = (myPicksTeamIndex - 1 + userTeams.length) % userTeams.length;
                                setMyPicksTeamIndex(newIdx);
                                setReviewTeam(userTeams[newIdx]);
                              }}
                            >
                              ←
                            </button>
                          )}
                          <select
                            className="team-review-select"
                            value={reviewTeam || (userTeams.length > 0 ? userTeams[0] : allTeams[0])}
                            onChange={(e) => setReviewTeam(e.target.value)}
                          >
                            {allTeams.map(team => (
                              <option key={team} value={team}>{team}</option>
                            ))}
                          </select>
                          {userTeams.length > 1 && (
                            <button
                              className="team-nav-btn-small"
                              onClick={() => {
                                const newIdx = (myPicksTeamIndex + 1) % userTeams.length;
                                setMyPicksTeamIndex(newIdx);
                                setReviewTeam(userTeams[newIdx]);
                              }}
                            >
                              →
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="team-review-picks">
                        {(() => {
                          const selectedTeam = reviewTeam || (userTeams.length > 0 ? userTeams[0] : allTeams[0]);
                          const teamPicks = activePicks
                            .filter(p => p.abbrev === selectedTeam && draftedPlayers[p.pick])
                            .map(p => ({ ...p, player: draftedPlayers[p.pick] }));

                          if (teamPicks.length === 0) {
                            return <p className="no-picks-inline">No picks for this team</p>;
                          }

                          return teamPicks.map(({ pick, round, pickInRound, player }) => (
                            <div key={pick} className="team-review-pick">
                              <span className="review-pick-num">{pick}</span>
                              <div className="review-player-logo">
                                {getCollegeLogo(player.college) ? (
                                  <img src={getCollegeLogo(player.college)} alt={player.college} />
                                ) : (
                                  <div className="logo-placeholder-tiny" />
                                )}
                              </div>
                              <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                                {player.position}
                              </span>
                              <span className="review-player-name">{player.name}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    <div className="complete-actions-secondary">
                      <button className="btn btn-secondary" onClick={resetDraft}>
                        Start New Draft
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Draft Board Sidebar (now on right, smaller) */}
              <div className="draft-board">
                <div className="draft-board-header">
                  <h2>Draft Board</h2>
                  {Object.keys(pickDebugInfo).length > 0 && (
                    <button
                      className="debug-toggle-small"
                      onClick={() => setShowDebug(!showDebug)}
                    >
                      {showDebug ? 'Hide' : 'Show'} Analysis
                    </button>
                  )}
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
                          <img src={getNflLogo(abbrev)} alt={abbrev} className="team-logo-small" />
                          {isUser && <span className="user-badge">YOU</span>}
                        </div>
                        {player ? (
                          <div className="pick-player">
                            <div className="pick-player-logo">
                              {getCollegeLogo(player.college) ? (
                                <img src={getCollegeLogo(player.college)} alt={player.college} />
                              ) : (
                                <div className="logo-placeholder-tiny" />
                              )}
                            </div>
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

            {/* Debug Analysis Panel */}
            {Object.keys(pickDebugInfo).length > 0 && showDebug && (
              <div className="debug-section">
                <div className="debug-log">
                  {Object.entries(pickDebugInfo)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([pickNum, debug]) => {
                      const pick = activePicks.find(p => p.pick === Number(pickNum));
                      const player = draftedPlayers[pickNum];
                      return (
                        <div key={pickNum} className="debug-entry">
                          <div className="debug-header">
                            <span className="debug-pick">#{pickNum}</span>
                            <span className="debug-team">{pick?.abbrev}</span>
                            <span className="debug-player">{player?.name} ({player?.position})</span>
                            <span className={`pick-type-badge ${debug.pickType.toLowerCase().replace(/\s\+\s/g, '-')}`}>{debug.pickType}</span>
                            <span className="debug-confidence">{debug.confidence}%</span>
                          </div>
                          <div className="debug-scores">
                            <span>Board: {debug.boardScore.toFixed(2)}</span>
                            <span>Need: {debug.needScore.toFixed(2)}</span>
                            <span>Pos Value: {debug.posValueScore.toFixed(2)}</span>
                            {debug.reachPenalty > 0 && <span className="debug-reach">Reach: -{debug.reachPenalty.toFixed(2)}</span>}
                          </div>
                          <div className="debug-meta">
                            <span>Needs: [{debug.teamNeeds.join(', ')}]</span>
                            <span>Filled: {Object.keys(debug.filledPositions).length > 0
                              ? Object.entries(debug.filledPositions).map(([p,c]) => `${p}\u00d7${c}`).join(', ')
                              : '\u2014'}</span>
                          </div>
                          <div className="debug-runners">
                            Runners-up: {debug.runners.map(r => `${r.name} (${r.finalScore.toFixed(2)})`).join(', ')}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
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

        {/* Full Results Modal */}
        {showFullResults && (
          <div className="results-modal-overlay" onClick={() => setShowFullResults(false)}>
            <div className="results-modal" onClick={e => e.stopPropagation()}>
              <div className="results-modal-header">
                <h2>Draft Results</h2>
                <button className="close-btn" onClick={() => setShowFullResults(false)}>×</button>
              </div>
              <div className="results-round-filter">
                <button
                  className={`round-filter-btn ${fullResultsRoundFilter === null ? 'active' : ''}`}
                  onClick={() => setFullResultsRoundFilter(null)}
                >
                  All
                </button>
                {Array.from({ length: roundCount }, (_, i) => i + 1).map(r => (
                  <button
                    key={r}
                    className={`round-filter-btn ${fullResultsRoundFilter === r ? 'active' : ''}`}
                    onClick={() => setFullResultsRoundFilter(r)}
                  >
                    Rd {r}
                  </button>
                ))}
              </div>
              <div className="results-modal-content">
                {(() => {
                  const filteredPicks = activePicks.filter(p =>
                    draftedPlayers[p.pick] && (fullResultsRoundFilter === null || p.round === fullResultsRoundFilter)
                  );
                  const midpoint = Math.ceil(filteredPicks.length / 2);
                  const leftPicks = filteredPicks.slice(0, midpoint);
                  const rightPicks = filteredPicks.slice(midpoint);

                  return (
                    <div className="results-columns">
                      <div className="results-column">
                        {leftPicks.map(p => {
                          const player = draftedPlayers[p.pick];
                          return (
                            <div key={p.pick} className="results-pick-row">
                              <span className="results-pick-num">{p.pick}</span>
                              <span className="results-team">{p.abbrev}</span>
                              <div className="results-player-logo">
                                {getCollegeLogo(player.college) ? (
                                  <img src={getCollegeLogo(player.college)} alt={player.college} />
                                ) : (
                                  <div className="logo-placeholder-tiny" />
                                )}
                              </div>
                              <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                                {player.position}
                              </span>
                              <span className="results-player-name">{player.name}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="results-column">
                        {rightPicks.map(p => {
                          const player = draftedPlayers[p.pick];
                          return (
                            <div key={p.pick} className="results-pick-row">
                              <span className="results-pick-num">{p.pick}</span>
                              <span className="results-team">{p.abbrev}</span>
                              <div className="results-player-logo">
                                {getCollegeLogo(player.college) ? (
                                  <img src={getCollegeLogo(player.college)} alt={player.college} />
                                ) : (
                                  <div className="logo-placeholder-tiny" />
                                )}
                              </div>
                              <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                                {player.position}
                              </span>
                              <span className="results-player-name">{player.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* My Picks Modal */}
        {showMyPicks && userTeams.length > 0 && (
          <div className="results-modal-overlay" onClick={() => setShowMyPicks(false)}>
            <div className="results-modal my-picks-modal" onClick={e => e.stopPropagation()}>
              <div className="results-modal-header">
                <h2>My Picks</h2>
                <button className="close-btn" onClick={() => setShowMyPicks(false)}>×</button>
              </div>
              {userTeams.length > 1 && (
                <div className="my-picks-team-nav">
                  <button
                    className="team-nav-btn"
                    onClick={() => setMyPicksTeamIndex(i => (i - 1 + userTeams.length) % userTeams.length)}
                  >
                    ←
                  </button>
                  <img src={getNflLogo(userTeams[myPicksTeamIndex])} alt={userTeams[myPicksTeamIndex]} className="my-picks-team-logo" />
                  <button
                    className="team-nav-btn"
                    onClick={() => setMyPicksTeamIndex(i => (i + 1) % userTeams.length)}
                  >
                    →
                  </button>
                </div>
              )}
              {userTeams.length === 1 && (
                <div className="my-picks-team-header">
                  <img src={getNflLogo(userTeams[0])} alt={userTeams[0]} className="my-picks-team-logo" />
                </div>
              )}
              <div className="results-modal-content my-picks-content">
                {(() => {
                  const currentTeam = userTeams[myPicksTeamIndex];
                  const teamPicks = activePicks
                    .filter(p => p.abbrev === currentTeam && draftedPlayers[p.pick])
                    .map(p => ({ ...p, player: draftedPlayers[p.pick] }));

                  if (teamPicks.length === 0) {
                    return <p className="no-picks-message">No picks made yet for {currentTeam}</p>;
                  }

                  return (
                    <div className="my-picks-list">
                      {teamPicks.map(({ pick, round, pickInRound, player }) => (
                        <div key={pick} className="my-picks-row">
                          <div className="my-picks-pick-info">
                            <span className="my-picks-pick-num">{pick}</span>
                            <span className="my-picks-round">R{round}.{pickInRound}</span>
                          </div>
                          <div className="my-picks-player-logo">
                            {getCollegeLogo(player.college) ? (
                              <img src={getCollegeLogo(player.college)} alt={player.college} />
                            ) : (
                              <div className="logo-placeholder-tiny" />
                            )}
                          </div>
                          <span className={`position-badge ${player.position.toLowerCase().replace('/', '-')}`}>
                            {player.position}
                          </span>
                          <span className="my-picks-player-name">{player.name}</span>
                          <span className="my-picks-college">{player.college}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MockDraft;
