import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProspectById, prospects } from '../data/prospects';
import './PlayerDetail.css';

function PlayerDetail({ myBoard, onToggleBoard }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const player = getProspectById(id);

  if (!player) {
    return (
      <div className="player-detail-page">
        <div className="container">
          <div className="empty-state">
            <h2>Player not found</h2>
            <p>The player you're looking for doesn't exist.</p>
            <Link to="/prospects" className="btn btn-primary">
              Back to Big Board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOnBoard = myBoard.some((p) => p.id === player.id);
  const currentIndex = prospects.findIndex((p) => p.id === player.id);
  const prevPlayer = currentIndex > 0 ? prospects[currentIndex - 1] : null;
  const nextPlayer = currentIndex < prospects.length - 1 ? prospects[currentIndex + 1] : null;

  const positionClass = player.position.toLowerCase().replace('/', '-');

  // Format stats based on position
  const renderStats = () => {
    const stats = player.stats;
    if (!stats) return null;

    const statGroups = [];

    // Passing stats
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

    // Rushing stats
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

    // Receiving stats
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

    // Defensive stats
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

    // O-Line stats
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

  return (
    <div className="player-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/prospects">Big Board</Link>
          <span className="breadcrumb-sep">/</span>
          <span>{player.name}</span>
        </nav>

        {/* Player Header */}
        <div className="player-header">
          <div className="player-header-content">
            <div className="player-header-badges">
              <span className={`position-badge ${positionClass}`}>
                {player.position}
              </span>
              <span className={`round-badge round-${player.projectedRound}`}>
                Projected Round {player.projectedRound}
              </span>
            </div>

            <h1 className="player-header-name">{player.name}</h1>
            <p className="player-header-college">{player.college}</p>

            <div className="player-header-meta">
              <div className="meta-item">
                <span className="meta-label">Height</span>
                <span className="meta-value">{player.height}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Weight</span>
                <span className="meta-value">{player.weight} lbs</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Class</span>
                <span className="meta-value">{player.class}</span>
              </div>
            </div>

            <button
              className={`btn ${isOnBoard ? 'btn-accent' : 'btn-primary'}`}
              onClick={() => onToggleBoard(player)}
            >
              {isOnBoard ? 'Remove from My Board' : 'Add to My Board'}
            </button>
          </div>

          <div className="player-header-rank">
            <span className="rank-label">Overall Rank</span>
            <span className="rank-value">#{currentIndex + 1}</span>
          </div>
        </div>

        {/* Player Content */}
        <div className="player-content">
          {/* Summary */}
          <section className="player-section">
            <h2>Scouting Report</h2>
            <p className="player-summary">{player.summary}</p>
          </section>

          {/* Stats */}
          {statGroups && statGroups.length > 0 && (
            <section className="player-section">
              <h2>2024 Season Stats</h2>
              <div className="stats-grid">
                {statGroups.map((group, idx) => (
                  <div key={idx} className="stat-group">
                    <h4 className="stat-group-label">{group.label}</h4>
                    <div className="stat-items">
                      {group.items.map((stat, statIdx) => (
                        <div key={statIdx} className="stat-item">
                          <span className="stat-value">{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="stats-source">
                Stats sourced from ESPN and PFF
              </p>
            </section>
          )}

          {/* Strengths & Weaknesses */}
          <section className="player-section">
            <h2>Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-card strengths">
                <h3>Strengths</h3>
                {player.strengths && player.strengths.length > 0 ? (
                  <ul>
                    {player.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="analysis-placeholder">
                    Strengths to be added...
                  </p>
                )}
              </div>
              <div className="analysis-card weaknesses">
                <h3>Weaknesses</h3>
                {player.weaknesses && player.weaknesses.length > 0 ? (
                  <ul>
                    {player.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="analysis-placeholder">
                    Weaknesses to be added...
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Draft Projection */}
          <section className="player-section">
            <h2>Draft Projection</h2>
            <div className="projection-card">
              <div className="projection-round">
                <span className="projection-label">Projected Round</span>
                <span className={`projection-value round-${player.projectedRound}`}>
                  Round {player.projectedRound}
                </span>
              </div>
              <p className="projection-note">
                Based on consensus rankings from NFL.com, ESPN, PFF, and other major draft analysts.
              </p>
            </div>
          </section>
        </div>

        {/* Navigation */}
        <div className="player-nav">
          {prevPlayer ? (
            <button
              className="player-nav-btn prev"
              onClick={() => navigate(`/player/${prevPlayer.id}`)}
            >
              <span className="nav-arrow">←</span>
              <span className="nav-label">Previous</span>
              <span className="nav-name">{prevPlayer.name}</span>
            </button>
          ) : (
            <div className="player-nav-btn placeholder" />
          )}

          {nextPlayer ? (
            <button
              className="player-nav-btn next"
              onClick={() => navigate(`/player/${nextPlayer.id}`)}
            >
              <span className="nav-label">Next</span>
              <span className="nav-name">{nextPlayer.name}</span>
              <span className="nav-arrow">→</span>
            </button>
          ) : (
            <div className="player-nav-btn placeholder" />
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerDetail;
