import { Link } from 'react-router-dom';
import './Hero.css';

const boardBenefits = [
  {
    title: 'Rank prospects your way',
    desc: 'Drag and drop to build rankings based on your own evaluations, not the media consensus.',
  },
  {
    title: 'Save and revisit anytime',
    desc: 'Your board is stored in the cloud. Pick up right where you left off on any device.',
  },
  {
    title: 'Add personal scouting notes',
    desc: 'Write private notes on every player. Film observations, combine takeaways, anything.',
  },
  {
    title: 'Compare against the consensus',
    desc: 'See where your rankings differ from the experts and track which evaluators you align with.',
  },
  {
    title: 'Share with friends',
    desc: 'Generate a shareable link to your board. Debate rankings with your league mates.',
  },
  {
    title: 'Track how you evolve',
    desc: 'Your board updates over time so you can see how your evaluations shift as the draft approaches.',
  },
];

function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-gradient"></div>
      </div>
      <div className="container hero-content">
        <p className="hero-eyebrow">2026 NFL Draft</p>
        <h1 className="hero-title">
          Build your own
          <br />
          <span className="hero-highlight">Big Board.</span>
        </h1>
        <p className="hero-subtitle">
          Stop relying on someone else's rankings. Create a board that reflects
          how you actually evaluate talent, save it, and share it.
        </p>

        <div className="hero-actions">
          <Link to="/my-board" className="btn btn-primary">
            Start Building
          </Link>
          <Link to="/prospects" className="btn btn-secondary">
            View Consensus Board
          </Link>
        </div>

        <div className="hero-benefits">
          {boardBenefits.map((b, i) => (
            <div key={i} className="hero-benefit">
              <span className="hero-benefit-number">{'0' + (i + 1)}</span>
              <div>
                <h3 className="hero-benefit-title">{b.title}</h3>
                <p className="hero-benefit-desc">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
