import { useState, useMemo } from 'react';
import { prospects, getPositionRanks } from '../data/prospects';
import { customBigBoardRankings, customBoardName } from '../data/customBigBoard';
import { isPlayerReviewed, reviewedPlayerIds } from '../data/playerNotes';
import playerStats from '../data/playerStats.json';
import PlayerCard from '../components/PlayerCard';
import PlayerModal from '../components/PlayerModal';
import SearchFilter from '../components/SearchFilter';
import './ProspectsList.css';

// Helper to get player stats key
const getPlayerStatsKey = (player) => `${player.name}-${player.college}`;

// Helper to parse stat value (remove commas)
const parseStatValue = (val) => {
  if (!val) return 0;
  return parseInt(String(val).replace(/,/g, '')) || 0;
};

// Helper to parse float stat value
const parseFloatStatValue = (val) => {
  if (!val) return 0;
  return parseFloat(String(val).replace(/,/g, '')) || 0;
};

// Helper to get 2025 season data from season arrays
const get2025Season = (seasons) => {
  if (!seasons || !Array.isArray(seasons)) return null;
  return seasons.find(s => s.year === "2025") || null;
};

// Helper function to convert height string like "6'2"" to inches
const parseHeightToInches = (heightStr) => {
  if (!heightStr) return null;
  const match = heightStr.match(/(\d+)'(\d+)/);
  if (match) {
    return parseInt(match[1]) * 12 + parseInt(match[2]);
  }
  return null;
};

function ProspectsList({ myBoard, onToggleBoard }) {
  const [filters, setFilters] = useState({
    search: '',
    positions: [],
    college: ''
  });
  const [advancedFilters, setAdvancedFilters] = useState({
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    minPassingYards: '',
    minPassingTDs: '',
    minRushingYards: '',
    minRushingTDs: '',
    minYardsPerRush: '',
    minReceivingYards: '',
    minReceptions: '',
    minYardsPerReception: '',
    minTackles: '',
    minSacks: '',
    minInterceptions: '',
    minForcedFumbles: '',
    sortBy: 'rank',
    sortDirection: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [boardType, setBoardType] = useState('custom'); // 'custom' or 'consensus'
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [showReviewedOnly, setShowReviewedOnly] = useState(false);

  // Check if custom board has rankings
  const hasCustomBoard = customBigBoardRankings.length > 0;

  // Get prospects in the selected board order
  const orderedProspects = useMemo(() => {
    if (boardType === 'custom' && hasCustomBoard) {
      const ranked = [];
      const rankedIds = new Set();

      customBigBoardRankings.forEach((id, index) => {
        const player = prospects.find(p => p.id === id);
        if (player) {
          ranked.push({ ...player, customRank: index + 1 });
          rankedIds.add(id);
        }
      });

      prospects.forEach(player => {
        if (!rankedIds.has(player.id)) {
          ranked.push({ ...player, customRank: ranked.length + 1 });
        }
      });

      return ranked;
    }
    return prospects.map(p => ({ ...p, customRank: p.id }));
  }, [boardType, hasCustomBoard]);

  // Position ranks based on board order
  const positionRanks = useMemo(() => getPositionRanks(orderedProspects), [orderedProspects]);

  const filteredProspects = useMemo(() => {
    let result = orderedProspects.filter((player) => {
      // Reviewed only filter (only applies to Mr Lutz's Board)
      if (showReviewedOnly && boardType === 'custom' && !isPlayerReviewed(player.id)) {
        return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(searchLower);
        const matchesCollege = player.college.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCollege) return false;
      }

      // Position filter - check if player's position matches any selected positions
      if (filters.positions && filters.positions.length > 0) {
        if (!filters.positions.includes(player.position)) {
          return false;
        }
      }

      if (filters.college && player.college !== filters.college) {
        return false;
      }

      // Advanced filters
      // Height filter
      if (advancedFilters.minHeight || advancedFilters.maxHeight) {
        const playerHeightInches = parseHeightToInches(player.height);
        if (playerHeightInches) {
          if (advancedFilters.minHeight && playerHeightInches < parseInt(advancedFilters.minHeight)) {
            return false;
          }
          if (advancedFilters.maxHeight && playerHeightInches > parseInt(advancedFilters.maxHeight)) {
            return false;
          }
        }
      }

      // Weight filter
      if (advancedFilters.minWeight && player.weight < parseInt(advancedFilters.minWeight)) {
        return false;
      }
      if (advancedFilters.maxWeight && player.weight > parseInt(advancedFilters.maxWeight)) {
        return false;
      }

      // Stats filters - 2025 season only
      const statsKey = getPlayerStatsKey(player);
      const stats = playerStats[statsKey];

      // Get 2025 season data from each category
      const passing2025 = get2025Season(stats?.passingSeasons);
      const rushing2025 = get2025Season(stats?.rushingSeasons);
      const receiving2025 = get2025Season(stats?.receivingSeasons);
      const defense2025 = get2025Season(stats?.defenseSeasons);

      if (advancedFilters.minPassingYards) {
        const passingYards = passing2025?.yards ? parseStatValue(passing2025.yards) : 0;
        if (passingYards < parseInt(advancedFilters.minPassingYards)) return false;
      }
      if (advancedFilters.minPassingTDs) {
        const passingTDs = passing2025?.touchdowns ? parseStatValue(passing2025.touchdowns) : 0;
        if (passingTDs < parseInt(advancedFilters.minPassingTDs)) return false;
      }
      if (advancedFilters.minRushingYards) {
        const rushingYards = rushing2025?.yards ? parseStatValue(rushing2025.yards) : 0;
        if (rushingYards < parseInt(advancedFilters.minRushingYards)) return false;
      }
      if (advancedFilters.minRushingTDs) {
        const rushingTDs = rushing2025?.touchdowns ? parseStatValue(rushing2025.touchdowns) : 0;
        if (rushingTDs < parseInt(advancedFilters.minRushingTDs)) return false;
      }
      if (advancedFilters.minYardsPerRush) {
        const ypc = rushing2025?.yardsPerCarry ? parseFloatStatValue(rushing2025.yardsPerCarry) : 0;
        if (ypc < parseFloat(advancedFilters.minYardsPerRush)) return false;
      }
      if (advancedFilters.minReceivingYards) {
        const receivingYards = receiving2025?.yards ? parseStatValue(receiving2025.yards) : 0;
        if (receivingYards < parseInt(advancedFilters.minReceivingYards)) return false;
      }
      if (advancedFilters.minReceptions) {
        const receptions = receiving2025?.receptions ? parseStatValue(receiving2025.receptions) : 0;
        if (receptions < parseInt(advancedFilters.minReceptions)) return false;
      }
      if (advancedFilters.minYardsPerReception) {
        const ypr = receiving2025?.yardsPerReception ? parseFloatStatValue(receiving2025.yardsPerReception) : 0;
        if (ypr < parseFloat(advancedFilters.minYardsPerReception)) return false;
      }
      if (advancedFilters.minTackles) {
        const tackles = defense2025?.totalTackles ? parseStatValue(defense2025.totalTackles) : 0;
        if (tackles < parseInt(advancedFilters.minTackles)) return false;
      }
      if (advancedFilters.minSacks) {
        const sacks = defense2025?.sacks ? parseFloatStatValue(defense2025.sacks) : 0;
        if (sacks < parseFloat(advancedFilters.minSacks)) return false;
      }
      if (advancedFilters.minInterceptions) {
        const interceptions = defense2025?.interceptions ? parseStatValue(defense2025.interceptions) : 0;
        if (interceptions < parseInt(advancedFilters.minInterceptions)) return false;
      }
      if (advancedFilters.minForcedFumbles) {
        const forcedFumbles = defense2025?.fumblesForced ? parseStatValue(defense2025.fumblesForced) : 0;
        if (forcedFumbles < parseInt(advancedFilters.minForcedFumbles)) return false;
      }

      return true;
    });

    // Apply sorting
    if (advancedFilters.sortBy && advancedFilters.sortBy !== 'rank') {
      result = [...result].sort((a, b) => {
        let aVal, bVal;
        const aStats = playerStats[getPlayerStatsKey(a)];
        const bStats = playerStats[getPlayerStatsKey(b)];

        // Get 2025 season data for sorting
        const aPassing2025 = get2025Season(aStats?.passingSeasons);
        const bPassing2025 = get2025Season(bStats?.passingSeasons);
        const aRushing2025 = get2025Season(aStats?.rushingSeasons);
        const bRushing2025 = get2025Season(bStats?.rushingSeasons);
        const aReceiving2025 = get2025Season(aStats?.receivingSeasons);
        const bReceiving2025 = get2025Season(bStats?.receivingSeasons);
        const aDefense2025 = get2025Season(aStats?.defenseSeasons);
        const bDefense2025 = get2025Season(bStats?.defenseSeasons);

        switch (advancedFilters.sortBy) {
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'weight':
            aVal = a.weight;
            bVal = b.weight;
            break;
          case 'height':
            aVal = parseHeightToInches(a.height) || 0;
            bVal = parseHeightToInches(b.height) || 0;
            break;
          case 'position':
            aVal = a.position;
            bVal = b.position;
            break;
          case 'passingYards':
            aVal = aPassing2025?.yards ? parseStatValue(aPassing2025.yards) : 0;
            bVal = bPassing2025?.yards ? parseStatValue(bPassing2025.yards) : 0;
            break;
          case 'rushingYards':
            aVal = aRushing2025?.yards ? parseStatValue(aRushing2025.yards) : 0;
            bVal = bRushing2025?.yards ? parseStatValue(bRushing2025.yards) : 0;
            break;
          case 'receivingYards':
            aVal = aReceiving2025?.yards ? parseStatValue(aReceiving2025.yards) : 0;
            bVal = bReceiving2025?.yards ? parseStatValue(bReceiving2025.yards) : 0;
            break;
          case 'tackles':
            aVal = aDefense2025?.totalTackles ? parseStatValue(aDefense2025.totalTackles) : 0;
            bVal = bDefense2025?.totalTackles ? parseStatValue(bDefense2025.totalTackles) : 0;
            break;
          default:
            return 0;
        }

        if (aVal < bVal) return advancedFilters.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return advancedFilters.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    } else if (advancedFilters.sortDirection === 'desc') {
      // Reverse the default rank order
      result = [...result].reverse();
    }

    return result;
  }, [filters, orderedProspects, showReviewedOnly, boardType, advancedFilters]);

  // Reset to page 1 when filters or board type change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProspects.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedProspects = filteredProspects.slice(startIndex, endIndex);

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const isOnBoard = (playerId) => myBoard.some((p) => p.id === playerId);

  // Modal handlers
  const selectedPlayer = selectedPlayerIndex !== null ? filteredProspects[selectedPlayerIndex] : null;

  const openModal = (indexInFiltered) => {
    setSelectedPlayerIndex(indexInFiltered);
  };

  const closeModal = () => {
    setSelectedPlayerIndex(null);
  };

  const goToPrev = selectedPlayerIndex > 0
    ? () => setSelectedPlayerIndex(selectedPlayerIndex - 1)
    : null;

  const goToNext = selectedPlayerIndex !== null && selectedPlayerIndex < filteredProspects.length - 1
    ? () => setSelectedPlayerIndex(selectedPlayerIndex + 1)
    : null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="prospects-page">
      <div className="container">
        <div className="prospects-header">
          <h1 className="prospects-title">
            {boardType === 'custom' ? "Mr Lutz's Big Board" : "Consensus Big Board"}
          </h1>
        </div>

        {/* Board Toggle and Reviewed Filter Row */}
        <div className="board-controls">
          <div className="board-toggle">
            <button
              className={`board-toggle-btn ${boardType === 'custom' ? 'active' : ''}`}
              onClick={() => { setBoardType('custom'); setCurrentPage(1); }}
            >
              {customBoardName}
            </button>
            <button
              className={`board-toggle-btn ${boardType === 'consensus' ? 'active' : ''}`}
              onClick={() => { setBoardType('consensus'); setCurrentPage(1); }}
            >
              Consensus Board
            </button>
          </div>

          {boardType === 'custom' && (
            <div className="twitter-controls">
              <label className="reviewed-filter-label">
                <input
                  type="checkbox"
                  checked={showReviewedOnly}
                  onChange={(e) => { setShowReviewedOnly(e.target.checked); setCurrentPage(1); }}
                />
                <span className="reviewed-filter-text">
                  Only show players reviewed on{' '}
                  <a
                    href="https://x.com/mr1lutz/highlights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="reviewed-filter-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    twitter
                  </a>
                  <span className="reviewed-count">({reviewedPlayerIds.size})</span>
                </span>
              </label>
              <a
                href="https://x.com/mr1lutz"
                target="_blank"
                rel="noopener noreferrer"
                className="twitter-follow"
              >
                <span>Follow me on</span>
                <svg viewBox="0 0 24 24" className="x-logo" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          )}
        </div>

        <SearchFilter
          filters={filters}
          onFilterChange={setFilters}
          advancedFilters={advancedFilters}
          onAdvancedFilterChange={(newFilters) => {
            setAdvancedFilters(newFilters);
            setCurrentPage(1);
          }}
        />

        <div className="results-header">
          <p className="results-text">
            Showing <span>{startIndex + 1}-{Math.min(endIndex, filteredProspects.length)}</span> of{' '}
            <span>{filteredProspects.length}</span> prospects
          </p>

          <div className="per-page-selector">
            <span className="per-page-label">Show:</span>
            {[25, 50, 100].map((num) => (
              <button
                key={num}
                className={`per-page-btn ${perPage === num ? 'active' : ''}`}
                onClick={() => handlePerPageChange(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {paginatedProspects.length > 0 ? (
          <>
            <div className="player-list">
              {paginatedProspects.map((player, index) => {
                const globalIndex = startIndex + index;
                return (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    rank={boardType === 'custom' ? player.customRank : player.id}
                    onAddToBoard={onToggleBoard}
                    isOnBoard={isOnBoard(player.id)}
                    positionRank={positionRanks[player.id]}
                    onClick={() => openModal(globalIndex)}
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-pages">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={page}
                        className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h3>No prospects found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        <PlayerModal
          player={selectedPlayer}
          isOpen={selectedPlayerIndex !== null}
          onClose={closeModal}
          onPrev={goToPrev}
          onNext={goToNext}
          onToggleBoard={onToggleBoard}
          isOnBoard={selectedPlayer ? isOnBoard(selectedPlayer.id) : false}
          positionRank={selectedPlayer ? positionRanks[selectedPlayer.id] : null}
        />
      </div>
    </div>
  );
}

export default ProspectsList;
