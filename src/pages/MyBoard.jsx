import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPositionRanks } from '../data/prospects';
import SyncStatus from '../components/SyncStatus';
import PlayerModal from '../components/PlayerModal';
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

  const positionRanks = useMemo(() => getPositionRanks(myBoard), [myBoard]);

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
    if (window.confirm('Are you sure you want to clear your entire board?')) {
      onReorderBoard([]);
    }
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/shared/${shareSlug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const positionClass = (position) => position.toLowerCase().replace('/', '-');

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
              <h1>{boardName}</h1>
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

        {user && (
          <div className="sharing-section">
            <label className="share-toggle">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={onTogglePublic}
              />
              <span>Share board publicly</span>
            </label>
            {isPublic && shareSlug && (
              <div className="share-link-row">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/shared/${shareSlug}`}
                  className="share-link-input"
                />
                <button className="btn btn-small btn-secondary" onClick={copyShareLink}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
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
            <div className="board-stats">
              <div className="board-stat">
                <span className="stat-value">{myBoard.length}</span>
                <span className="stat-label">Players</span>
              </div>
              <div className="board-stat">
                <span className="stat-value">
                  {myBoard.filter(p => p.projectedRound === 1).length}
                </span>
                <span className="stat-label">1st Rounders</span>
              </div>
              <div className="board-stat">
                <span className="stat-value">
                  {[...new Set(myBoard.map(p => p.position))].length}
                </span>
                <span className="stat-label">Positions</span>
              </div>
            </div>

            <div className="board-list">
              {myBoard.map((player, index) => (
                <div
                  key={player.id}
                  className={`board-item ${dragOverIndex === index ? 'drag-over' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="board-item-rank">
                    <span className="rank-number">{index + 1}</span>
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

                  <button
                    type="button"
                    className="board-item-content"
                    onClick={() => setSelectedPlayerIndex(index)}
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
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="move-btn"
                      onClick={() => moveDown(index)}
                      disabled={index === myBoard.length - 1}
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
              ))}
            </div>

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
      </div>
    </div>
  );
}

export default MyBoard;
