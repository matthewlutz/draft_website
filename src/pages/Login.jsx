import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function mapAuthError(err) {
  const msg = err?.message?.toLowerCase() || '';
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong password')) {
    return 'Incorrect email or password.';
  }
  if (msg.includes('invalid email') || msg.includes('valid email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('rate limit') || msg.includes('too many')) {
    return 'Too many failed attempts. Please try again later.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.';
  }
  return err?.message || 'An error occurred. Please try again.';
}

function Login() {
  const { user, login, loginWithGoogle, updateDisplayName } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDisplayNameSetup, setShowDisplayNameSetup] = useState(false);
  const [googleDisplayName, setGoogleDisplayName] = useState('');

  useEffect(() => {
    if (user && !showDisplayNameSetup) {
      const hasDisplayName = user.user_metadata?.display_name;
      if (!hasDisplayName) {
        // User needs to set a display name
        setShowDisplayNameSetup(true);
        const googleName = user.user_metadata?.full_name || user.user_metadata?.name || '';
        setGoogleDisplayName(googleName);
      } else {
        navigate('/my-board', { replace: true });
      }
    }
  }, [user, navigate, showDisplayNameSetup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/my-board');
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      // Navigation handled by useEffect after checking display name
    } catch (err) {
      setError(mapAuthError(err));
    }
  };

  const handleDisplayNameSubmit = async (e) => {
    e.preventDefault();
    if (!googleDisplayName.trim()) {
      setError('Please enter a display name.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await updateDisplayName(googleDisplayName.trim());
      navigate('/my-board');
    } catch (err) {
      setError('Failed to save display name. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (showDisplayNameSetup) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome!</h1>
          <p className="auth-subtitle">Choose a display name for your board</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleDisplayNameSubmit}>
            <div className="form-group">
              <label htmlFor="googleDisplayName">Display Name</label>
              <input
                id="googleDisplayName"
                type="text"
                value={googleDisplayName}
                onChange={(e) => setGoogleDisplayName(e.target.value)}
                placeholder="Your name"
                required
                autoFocus
              />
              <p className="form-hint">This will appear as "{googleDisplayName || 'Your Name'}'s Big Board"</p>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Log In</h1>
        <p className="auth-subtitle">Welcome back to NFL Draft Guide</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Log In'}
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
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
