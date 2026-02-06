import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { getProspectById } from '../data/prospects';
import './SharedBoard.css';

function SharedBoard() {
  const { slug } = useParams();
  const [board, setBoard] = useState(null);
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBoard() {
      try {
        const q = query(
          collection(db, 'boards'),
          where('shareSlug', '==', slug),
          where('isPublic', '==', true)
        );
        const snap = await getDocs(q);
        if (snap.empty) {
          setError('Board not found');
          setLoading(false);
          return;
        }
        const boardData = snap.docs[0].data();
        setBoard(boardData);

        // Fetch owner display name
        const userSnap = await getDoc(doc(db, 'users', boardData.userId));
        if (userSnap.exists()) {
          setOwnerName(userSnap.data().displayName || 'Anonymous');
        }
      } catch (err) {
        console.error('Failed to load shared board:', err);
        setError('Failed to load board');
      }
      setLoading(false);
    }
    fetchBoard();
  }, [slug]);

  if (loading) {
    return (
      <div className="shared-board-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-board-page">
        <div className="container">
          <div className="shared-board-error">
            <h2>{error}</h2>
            <p>This board may have been removed or made private.</p>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const players = (board.prospectIds || [])
    .map((id) => getProspectById(id))
    .filter(Boolean);

  const positionClass = (position) => position.toLowerCase().replace('/', '-');

  return (
    <div className="shared-board-page">
      <div className="container">
        <div className="shared-header">
          <h1>{board.name || 'Big Board'}</h1>
          <p className="shared-owner">by {ownerName}</p>
          <p className="shared-count">{players.length} player{players.length !== 1 ? 's' : ''}</p>
        </div>

        {players.length === 0 ? (
          <div className="empty-board">
            <h2>This board is empty</h2>
          </div>
        ) : (
          <div className="board-list">
            {players.map((player, index) => (
              <div key={player.id} className="board-item shared-item">
                <div className="board-item-rank">
                  <span className="rank-number">{index + 1}</span>
                </div>
                <Link to={`/player/${player.id}`} className="board-item-content">
                  <div className="board-item-info">
                    <span className={`position-badge ${positionClass(player.position)}`}>
                      {player.position}
                    </span>
                    <h3 className="board-item-name">{player.name}</h3>
                    <span className="board-item-college">{player.college}</span>
                  </div>
                  <div className="board-item-meta">
                    <span className={`round-badge round-${player.projectedRound}`}>
                      Rd {player.projectedRound}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedBoard;
