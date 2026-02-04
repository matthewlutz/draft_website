import { useState } from 'react';
import { Link } from 'react-router-dom';
import { prospects } from '../data/prospects';
import './MyBoard.css';

function MyBoard({ myBoard, onToggleBoard, onReorderBoard }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  const positionClass = (position) => position.toLowerCase().replace('/', '-');

  return (
    <div className="my-board-page">
      <div className="container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>My Big Board</h1>
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

                  <Link to={`/player/${player.id}`} className="board-item-content">
                    <div className="board-item-info">
                      <span className={`position-badge ${positionClass(player.position)}`}>
                        {player.position}
                      </span>
                      <h3 className="board-item-name">{player.name}</h3>
                      <span className="board-item-college">{player.college}</span>
                    </div>
                    <div className="board-item-meta">
                      <span className={`round-badge round-${player.projectedRound}`}>
                        Rd {player.projectedRound}
                      </span>
                    </div>
                  </Link>

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
      </div>
    </div>
  );
}

export default MyBoard;
