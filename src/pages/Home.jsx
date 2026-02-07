import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import PlayerCard from '../components/PlayerCard';
import PlayerModal from '../components/PlayerModal';
import { prospects, getPositionRanks } from '../data/prospects';
import './Home.css';

function Home({ myBoard, onToggleBoard }) {
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(null);

  // Get top 8 prospects for featured section
  const topProspects = prospects.slice(0, 8);

  // Position ranks for the top prospects
  const positionRanks = useMemo(() => getPositionRanks(prospects), []);

  // Get position breakdown
  const positionCounts = prospects.reduce((acc, player) => {
    acc[player.position] = (acc[player.position] || 0) + 1;
    return acc;
  }, {});

  const isOnBoard = (playerId) => myBoard.some((p) => p.id === playerId);

  // Modal handlers
  const selectedPlayer = selectedPlayerIndex !== null ? topProspects[selectedPlayerIndex] : null;

  const closeModal = () => setSelectedPlayerIndex(null);

  const goToPrev = selectedPlayerIndex > 0
    ? () => setSelectedPlayerIndex(selectedPlayerIndex - 1)
    : null;

  const goToNext = selectedPlayerIndex !== null && selectedPlayerIndex < topProspects.length - 1
    ? () => setSelectedPlayerIndex(selectedPlayerIndex + 1)
    : null;

  return (
    <div className="home-page">
      <Hero />

      {/* Quick Actions - Moved to top */}
      <section className="actions-section">
        <div className="container">
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="2" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                </svg>
              </div>
              <h3>Consensus Big Board</h3>
              <p>Rankings compiled from NFL.com, ESPN, PFF, and more</p>
              <Link to="/prospects" className="btn btn-primary">
                View Rankings
              </Link>
            </div>

            <div className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-4" />
                </svg>
              </div>
              <h3>Build Your Board</h3>
              <p>Create your own rankings and compare to the experts</p>
              <Link to="/my-board" className="btn btn-primary">
                Start Building
              </Link>
            </div>

            <div className="action-card">
              <div className="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </div>
              <h3>Search Players</h3>
              <p>Find specific prospects by name, position, or school</p>
              <Link to="/prospects" className="btn btn-primary">
                Search Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prospects */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Top Prospects</h2>
            <Link to="/prospects" className="btn btn-secondary">
              View All
            </Link>
          </div>
          <div className="player-list">
            {topProspects.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                rank={index + 1}
                onAddToBoard={onToggleBoard}
                isOnBoard={isOnBoard(player.id)}
                positionRank={positionRanks[player.id]}
                onClick={() => setSelectedPlayerIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Position Breakdown */}
      <section className="positions-section">
        <div className="container">
          <h2>Position Breakdown</h2>
          <div className="positions-grid">
            {Object.entries(positionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([position, count]) => (
                <Link
                  key={position}
                  to={`/prospects?position=${position}`}
                  className="position-card"
                >
                  <span className={`position-badge ${position.toLowerCase().replace('/', '-')}`}>
                    {position}
                  </span>
                  <span className="position-count">{count}</span>
                  <span className="position-label">Prospects</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

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
  );
}

export default Home;
