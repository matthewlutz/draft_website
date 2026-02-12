import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useBoard } from './hooks/useBoard';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import ProspectsList from './pages/ProspectsList';
import PlayerDetail from './pages/PlayerDetail';
import MyBoard from './pages/MyBoard';
import MockDraft from './pages/MockDraft';
import TeamNeeds from './pages/TeamNeeds';
import Login from './pages/Login';
import Register from './pages/Register';
import SharedBoard from './pages/SharedBoard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminBigBoard from './pages/admin/AdminBigBoard';
import AdminPlayerNotes from './pages/admin/AdminPlayerNotes';
import AdminModeration from './pages/admin/AdminModeration';
import AdminSystem from './pages/admin/AdminSystem';
import AdminJobs from './pages/admin/AdminJobs';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import './App.css';

function AppContent() {
  const location = useLocation();
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

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdmin && <Navbar />}
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
          <Route path="/team-needs" element={<TeamNeeds />} />
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

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUserDetail />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="big-board" element={<AdminBigBoard />} />
            <Route path="player-notes" element={<AdminPlayerNotes />} />
            <Route path="moderation" element={<AdminModeration />} />
            <Route path="system" element={<AdminSystem />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="audit-log" element={<AdminAuditLog />} />
          </Route>
        </Routes>
      </main>
      {!isAdmin && (
        <footer className="footer">
          <div className="container footer-content">
            <p>
              2026 NFL Draft Guide
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  const { loading } = useAuth();

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
      <AppContent />
    </Router>
  );
}

export default App;
