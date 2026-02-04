import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
      </div>
      <div className="container hero-content">
        <div className="hero-badge">2026 NFL Draft</div>
        <h1 className="hero-title">
          NFL Draft Guide
          <span className="hero-year">2026</span>
        </h1>
        <p className="hero-subtitle">
          Comprehensive prospect rankings, player profiles, and draft analysis.
          Build your own big board and track top talent heading into the draft.
        </p>
        <div className="hero-actions">
          <Link to="/prospects" className="btn btn-primary">
            View Big Board
          </Link>
          <Link to="/my-board" className="btn btn-secondary">
            Build Your Board
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">100+</span>
            <span className="hero-stat-label">Prospects</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">12</span>
            <span className="hero-stat-label">Positions</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-value">7</span>
            <span className="hero-stat-label">Rounds</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
