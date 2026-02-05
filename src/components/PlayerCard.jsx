import { Link } from 'react-router-dom';
import { getCollegeLogo } from '../data/collegeLogos';
import './PlayerCard.css';

function PlayerCard({ player, rank, showRank = true, onAddToBoard, isOnBoard = false }) {
  const positionClass = player.position.toLowerCase().replace('/', '-');
  const collegeLogo = getCollegeLogo(player.college);

  return (
    <div className="player-card card">
      <Link to={`/player/${player.id}`} className="player-card-link">
        {showRank && (
          <div className="player-rank">
            <span className="rank-number">{rank}</span>
          </div>
        )}

        <div className="player-logo">
          {collegeLogo ? (
            <img src={collegeLogo} alt={`${player.college} logo`} className="team-logo-img" />
          ) : (
            <div className="team-logo-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
          )}
        </div>

        <div className="player-info">
          <h3 className="player-name">{player.name}</h3>
          <p className="player-college">{player.college}</p>
        </div>

        <div className="player-position">
          <span className={`position-badge ${positionClass}`}>
            {player.position}
          </span>
          {player.notes && (
            <span className="player-notes">{player.notes}</span>
          )}
        </div>

        <div className="player-physical">
          <span className="physical-item">{player.height}</span>
          <span className="physical-item">{player.weight} lbs</span>
        </div>
      </Link>

      {onAddToBoard && (
        <div className="player-card-actions">
          <button
            className={`btn btn-small ${isOnBoard ? 'btn-accent' : 'btn-primary'}`}
            onClick={(e) => {
              e.preventDefault();
              onAddToBoard(player);
            }}
          >
            {isOnBoard ? 'Remove' : 'Add'}
          </button>
        </div>
      )}
    </div>
  );
}

export default PlayerCard;
