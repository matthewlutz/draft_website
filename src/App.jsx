import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProspectsList from './pages/ProspectsList';
import PlayerDetail from './pages/PlayerDetail';
import MyBoard from './pages/MyBoard';
import MockDraft from './pages/MockDraft';
import './App.css';

function App() {
  // Load my board from localStorage
  const [myBoard, setMyBoard] = useState(() => {
    const saved = localStorage.getItem('nfl-draft-my-board');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever myBoard changes
  useEffect(() => {
    localStorage.setItem('nfl-draft-my-board', JSON.stringify(myBoard));
  }, [myBoard]);

  // Toggle player on/off the board
  const handleToggleBoard = (player) => {
    setMyBoard((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) {
        return prev.filter((p) => p.id !== player.id);
      }
      return [...prev, player];
    });
  };

  // Reorder the board
  const handleReorderBoard = (newBoard) => {
    setMyBoard(newBoard);
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home myBoard={myBoard} onToggleBoard={handleToggleBoard} />
              }
            />
            <Route
              path="/prospects"
              element={
                <ProspectsList
                  myBoard={myBoard}
                  onToggleBoard={handleToggleBoard}
                />
              }
            />
            <Route
              path="/player/:id"
              element={
                <PlayerDetail
                  myBoard={myBoard}
                  onToggleBoard={handleToggleBoard}
                />
              }
            />
            <Route
              path="/my-board"
              element={
                <MyBoard
                  myBoard={myBoard}
                  onToggleBoard={handleToggleBoard}
                  onReorderBoard={handleReorderBoard}
                />
              }
            />
            <Route
              path="/mock-draft"
              element={
                <MockDraft myBoard={myBoard} />
              }
            />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container footer-content">
            <p>
              NFL Draft Guide 2026 - Data compiled from{' '}
              <a
                href="https://www.nfl.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                NFL.com
              </a>
              ,{' '}
              <a
                href="https://www.espn.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                ESPN
              </a>
              ,{' '}
              <a
                href="https://www.pff.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                PFF
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
