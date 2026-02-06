import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useBoard } from './hooks/useBoard';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProspectsList from './pages/ProspectsList';
import PlayerDetail from './pages/PlayerDetail';
import MyBoard from './pages/MyBoard';
import MockDraft from './pages/MockDraft';
import Login from './pages/Login';
import Register from './pages/Register';
import SharedBoard from './pages/SharedBoard';
import './App.css';

function App() {
  const { loading } = useAuth();
  const {
    myBoard,
    boardName,
    isPublic,
    shareSlug,
    syncStatus,
    togglePlayer,
    reorderBoard,
    setBoardName,
    togglePublic,
    migrateFromLocal,
    hasLocalBoard,
  } = useBoard();

  if (loading) {
    return (
      <div className="app">
        <div className="loading" style={{ minHeight: '100vh' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home myBoard={myBoard} onToggleBoard={togglePlayer} />
              }
            />
            <Route
              path="/prospects"
              element={
                <ProspectsList
                  myBoard={myBoard}
                  onToggleBoard={togglePlayer}
                />
              }
            />
            <Route
              path="/player/:id"
              element={
                <PlayerDetail
                  myBoard={myBoard}
                  onToggleBoard={togglePlayer}
                />
              }
            />
            <Route
              path="/my-board"
              element={
                <MyBoard
                  myBoard={myBoard}
                  onToggleBoard={togglePlayer}
                  onReorderBoard={reorderBoard}
                  syncStatus={syncStatus}
                  boardName={boardName}
                  isPublic={isPublic}
                  shareSlug={shareSlug}
                  onTogglePublic={togglePublic}
                  onSetBoardName={setBoardName}
                />
              }
            />
            <Route
              path="/mock-draft"
              element={
                <MockDraft myBoard={myBoard} />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/register"
              element={
                <Register
                  hasLocalBoard={hasLocalBoard}
                  onMigrate={migrateFromLocal}
                />
              }
            />
            <Route path="/shared/:slug" element={<SharedBoard />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container footer-content">
            <p>
              NFL Draft Guide 2026
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
