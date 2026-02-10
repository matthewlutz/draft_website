import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPositionRanks } from '../data/prospects';
import { getCollegeLogo } from '../data/collegeLogos';
import SyncStatus from '../components/SyncStatus';
import PlayerModal from '../components/PlayerModal';
import SearchFilter from '../components/SearchFilter';
import './MyBoard.css';

function MyBoard({
  myBoard,
  onToggleBoard,
  onReorderBoard,
  syncStatus,
  boardName,
  isPublic,
  shareSlug,
  onTogglePublic,
  onSetBoardName,
}) {
  const { user } = useAuth();
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    positions: [],
    college: ''
  });

  const positionRanks = useMemo(() => getPositionRanks(myBoard), [myBoard]);

  // Check if any filters are active
  const hasActiveFilters = filters.search || (filters.positions && filters.positions.length > 0) || filters.college;

  // Filter the board based on search/position/college
  const filteredBoard = useMemo(() => {
    if (!hasActiveFilters) return myBoard;

    return myBoard.filter((player) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = player.name.toLowerCase().includes(searchLower);
        const matchesCollege = player.college.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesCollege) return false;
      }

      if (filters.positions && filters.positions.length > 0) {
        if (!filters.positions.includes(player.position)) {
          return false;
        }
      }

      if (filters.college && player.college !== filters.college) {
        return false;
      }

      return true;
    });
  }, [myBoard, filters, hasActiveFilters]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newBoard = [...myBoard];
    const [removed] = newBoard.splice(draggedItem, 1);
    newBoard.splice(dropIndex, 0, removed);
    onReorderBoard(newBoard);

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newBoard = [...myBoard];
    [newBoard[index - 1], newBoard[index]] = [newBoard[index], newBoard[index - 1]];
    onReorderBoard(newBoard);
  };

  const moveDown = (index) => {
    if (index === myBoard.length - 1) return;
    const newBoard = [...myBoard];
    [newBoard[index], newBoard[index + 1]] = [newBoard[index + 1], newBoard[index]];
    onReorderBoard(newBoard);
  };

  const clearBoard = () => {
    setShowClearModal(true);
    setClearConfirmText('');
  };

  const confirmClearBoard = () => {
    if (clearConfirmText === 'clear-my-board') {
      onReorderBoard([]);
      setShowClearModal(false);
      setClearConfirmText('');
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/shared/${shareSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const positionClass = (position) => position.toLowerCase().replace('/', '-');

  // Get display name for personalized board title
  const displayName = user?.user_metadata?.display_name || (user ? 'MrLutz' : null);
  const boardTitle = displayName ? `${displayName}'s Big Board` : boardName;

  return (
    <div className="my-board-page">
      <div className="container">
        {!user && (
          <div className="guest-banner">
            <p>Sign up to save your board and access it anywhere</p>
            <Link to="/register" className="btn btn-primary btn-small">
              Sign Up Free
            </Link>
          </div>
        )}

        <div className="page-header">
          <div className="page-header-content">
            <div className="page-title-row">
              <h1>{boardTitle}</h1>
              {user && <SyncStatus status={syncStatus} />}
            </div>
            <p className="page-subtitle">
              Create your personal prospect rankings by dragging players to reorder
            </p>
          </div>
          {myBoard.length > 0 && (
            <button className="btn btn-secondary" onClick={clearBoard}>
              Clear Board
            </button>
          )}
        </div>

        {myBoard.length > 0 && (
          <div className="board-actions-row">
            {user && shareSlug && (
              <button className="share-btn" onClick={copyShareLink}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                {copied ? 'Link Copied!' : 'Share Board'}
              </button>
            )}
          </div>
        )}

        {myBoard.length > 0 && (
          <SearchFilter filters={filters} onFilterChange={setFilters} />
        )}

        {myBoard.length === 0 ? (
          <div className="empty-board">
            <div className="empty-board-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="2" />
                <line x1="12" y1="11" x2="12" y2="17" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <h2>Your board is empty</h2>
            <p>Add players from the Big Board to start building your rankings</p>
            <Link to="/prospects" className="btn btn-primary">
              Browse Prospects
            </Link>
          </div>
        ) : (
          <>
            <p className="board-stats-text">
              <span>{hasActiveFilters ? `${filteredBoard.length}/${myBoard.length}` : myBoard.length} Players</span>
              <span className="stats-divider">|</span>
              <span>{[...new Set((hasActiveFilters ? filteredBoard : myBoard).map(p => p.position))].length} Positions</span>
            </p>

            {hasActiveFilters && filteredBoard.length > 0 && (
              <p className="filter-notice">
                Drag to reorder is disabled while filters are active
              </p>
            )}

            {hasActiveFilters && filteredBoard.length === 0 ? (
              <div className="empty-filter-results">
                <h3>No players match your filters</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => setFilters({ search: '', positions: [], college: '' })}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
            <div className="board-list">
              {filteredBoard.map((player) => {
                // Find the original index in myBoard for proper reordering
                const originalIndex = myBoard.findIndex(p => p.id === player.id);
                return (
                  <div
                    key={player.id}
                    className={`board-item ${dragOverIndex === originalIndex ? 'drag-over' : ''} ${hasActiveFilters ? 'no-drag' : ''}`}
                    draggable={!hasActiveFilters}
                    onDragStart={!hasActiveFilters ? (e) => handleDragStart(e, originalIndex) : undefined}
                    onDragEnd={!hasActiveFilters ? handleDragEnd : undefined}
                    onDragOver={!hasActiveFilters ? (e) => handleDragOver(e, originalIndex) : undefined}
                    onDrop={!hasActiveFilters ? (e) => handleDrop(e, originalIndex) : undefined}
                  >
                    <div className="board-item-rank">
                      <span className="rank-number">{originalIndex + 1}</span>
                    </div>

                    <div className="board-item-drag">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="9" cy="6" r="1.5" />
                        <circle cx="15" cy="6" r="1.5" />
                        <circle cx="9" cy="12" r="1.5" />
                        <circle cx="15" cy="12" r="1.5" />
                        <circle cx="9" cy="18" r="1.5" />
                        <circle cx="15" cy="18" r="1.5" />
                      </svg>
                    </div>

                    <div className="board-item-logo">
                      {getCollegeLogo(player.college) ? (
                        <img src={getCollegeLogo(player.college)} alt={`${player.college} logo`} />
                      ) : (
                        <div className="board-item-logo-placeholder">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="board-item-content"
                      onClick={() => setSelectedPlayerIndex(originalIndex)}
                    >
                      <div className="board-item-info">
                        <span className={`position-badge ${positionClass(player.position)}`}>
                          {player.position}
                        </span>
                        <h3 className="board-item-name">{player.name}</h3>
                        <span className="board-item-college">{player.college}</span>
                        {positionRanks[player.id] && (
                          <span className="board-item-pos-rank">{positionRanks[player.id]}</span>
                        )}
                      </div>
                      <div className="board-item-meta">
                        <span className={`round-badge round-${player.projectedRound}`}>
                          Rd {player.projectedRound}
                        </span>
                      </div>
                    </button>

                    <div className="board-item-actions">
                      <button
                        className="move-btn"
                        onClick={() => moveUp(originalIndex)}
                        disabled={hasActiveFilters || originalIndex === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className="move-btn"
                        onClick={() => moveDown(originalIndex)}
                        disabled={hasActiveFilters || originalIndex === myBoard.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => onToggleBoard(player)}
                        title="Remove from board"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            <div className="add-more">
              <p>Want to add more players?</p>
              <Link to="/prospects" className="btn btn-secondary">
                Browse Big Board
              </Link>
            </div>
          </>
        )}

        <PlayerModal
          player={selectedPlayerIndex !== null ? myBoard[selectedPlayerIndex] : null}
          isOpen={selectedPlayerIndex !== null}
          onClose={() => setSelectedPlayerIndex(null)}
          onPrev={selectedPlayerIndex > 0 ? () => setSelectedPlayerIndex(selectedPlayerIndex - 1) : null}
          onNext={selectedPlayerIndex !== null && selectedPlayerIndex < myBoard.length - 1 ? () => setSelectedPlayerIndex(selectedPlayerIndex + 1) : null}
          onToggleBoard={onToggleBoard}
          isOnBoard={true}
          positionRank={selectedPlayerIndex !== null && myBoard[selectedPlayerIndex] ? positionRanks[myBoard[selectedPlayerIndex].id] : null}
        />

        {showClearModal && (
          <div className="clear-modal-overlay" onClick={() => setShowClearModal(false)}>
            <div className="clear-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Clear Your Board</h3>
              <p>This will remove all {myBoard.length} players from your board. This action cannot be undone.</p>
              <p className="clear-modal-instruction">Type <strong>clear-my-board</strong> to confirm:</p>
              <input
                type="text"
                value={clearConfirmText}
                onChange={(e) => setClearConfirmText(e.target.value)}
                placeholder="clear-my-board"
                className="clear-modal-input"
                autoFocus
              />
              <div className="clear-modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowClearModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmClearBoard}
                  disabled={clearConfirmText !== 'clear-my-board'}
                >
                  Clear Board
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBoard;
