import { useState, useMemo } from 'react';
import { prospects } from '../data/prospects';
import { customBigBoardRankings, customBoardName } from '../data/customBigBoard';
import PlayerCard from '../components/PlayerCard';
import SearchFilter from '../components/SearchFilter';
import './ProspectsList.css';

function ProspectsList({ myBoard, onToggleBoard }) {
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    college: '',
    round: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [boardType, setBoardType] = useState('consensus'); // 'consensus' or 'custom'

  // Check if custom board has rankings
  const hasCustomBoard = customBigBoardRankings.length > 0;

  // Get prospects in the selected board order
  const orderedProspects = useMemo(() => {
    if (boardType === 'custom' && hasCustomBoard) {
      // Create ordered list based on custom rankings
      const ranked = [];
      const rankedIds = new Set();

      // First, add players in custom order
      customBigBoardRankings.forEach((id, index) => {
        const player = prospects.find(p => p.id === id);
        if (player) {
          ranked.push({ ...player, customRank: index + 1 });
          rankedIds.add(id);
        }
      });

      // Then add unranked players in consensus order
      prospects.forEach(player => {
        if (!rankedIds.has(player.id)) {
          ranked.push({ ...player, customRank: ranked.length + 1 });
        }
      });

      return ranked;
    }
    return prospects.map(p => ({ ...p, customRank: p.id }));
  }, [boardType, hasCustomBoard]);

  const filteredProspects = useMemo(() => {
    return orderedProspects.filter((player) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(searchLower);
        const matchesCollege = player.college.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCollege) return false;
      }

      // Position filter
      if (filters.position && player.position !== filters.position) {
        return false;
      }

      // College filter
      if (filters.college && player.college !== filters.college) {
        return false;
      }

      // Round filter
      if (filters.round) {
        if (filters.round === 'UDFA') {
          if (player.projectedRound !== 'UDFA') return false;
        } else if (filters.round === '4+') {
          if (typeof player.projectedRound === 'number' && player.projectedRound < 4) return false;
          if (player.projectedRound === 'UDFA') return false;
        } else if (player.projectedRound !== parseInt(filters.round)) {
          return false;
        }
      }

      return true;
    });
  }, [filters, orderedProspects]);

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
    // Scroll to top of list
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const isOnBoard = (playerId) => myBoard.some((p) => p.id === playerId);

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
        <div className="page-header">
          <h1>2026 NFL Draft Big Board</h1>
          <p className="page-subtitle">
            Top 500 prospect rankings for the 2026 NFL Draft
          </p>
        </div>

        {/* Board Type Toggle */}
        <div className="board-toggle">
          <button
            className={`board-toggle-btn ${boardType === 'consensus' ? 'active' : ''}`}
            onClick={() => { setBoardType('consensus'); setCurrentPage(1); }}
          >
            Consensus Board
          </button>
          {hasCustomBoard && (
            <button
              className={`board-toggle-btn ${boardType === 'custom' ? 'active' : ''}`}
              onClick={() => { setBoardType('custom'); setCurrentPage(1); }}
            >
              {customBoardName}
            </button>
          )}
        </div>

        <SearchFilter filters={filters} onFilterChange={setFilters} />

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
              {paginatedProspects.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={boardType === 'custom' ? player.customRank : player.id}
                  onAddToBoard={onToggleBoard}
                  isOnBoard={isOnBoard(player.id)}
                />
              ))}
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
      </div>
    </div>
  );
}

export default ProspectsList;
