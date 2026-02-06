import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function mapFirebaseError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    default:
      return 'An error occurred. Please try again.';
  }
}

function Register({ hasLocalBoard, onMigrate }) {
  const { user, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showMigration, setShowMigration] = useState(false);

  // Count local board players for migration modal
  const localCount = (() => {
    try {
      const raw = localStorage.getItem('nfl-draft-my-board');
      if (!raw) return 0;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  })();

  useEffect(() => {
    // If user was already logged in before visiting this page, redirect
    if (user && !showMigration) {
      if (hasLocalBoard && localCount > 0) {
        setShowMigration(true);
      } else {
        navigate('/my-board', { replace: true });
      }
    }
  }, [user, navigate, hasLocalBoard, localCount, showMigration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, displayName);
      if (hasLocalBoard && localCount > 0) {
        setShowMigration(true);
      } else {
        navigate('/my-board');
      }
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      if (hasLocalBoard && localCount > 0) {
        setShowMigration(true);
      } else {
        navigate('/my-board');
      }
    } catch (err) {
      setError(mapFirebaseError(err.code));
    }
  };

  const handleImport = async () => {
    await onMigrate();
    navigate('/my-board');
  };

  const handleStartFresh = () => {
    localStorage.removeItem('nfl-draft-my-board');
    navigate('/my-board');
  };

  if (showMigration) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="migration-modal">
            <h2>Import Your Board?</h2>
            <p>
              You have <strong>{localCount} player{localCount !== 1 ? 's' : ''}</strong> on
              your local board. Would you like to import them to your account?
            </p>
            <div className="migration-actions">
              <button className="btn btn-primary" onClick={handleImport}>
                Import My Board
              </button>
              <button className="btn btn-secondary" onClick={handleStartFresh}>
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Create your NFL Draft Guide account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="google-btn" onClick={handleGoogle} type="button">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
