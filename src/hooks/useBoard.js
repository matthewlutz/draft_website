import { useState, useEffect, useCallback, useRef } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { getProspectById } from '../data/prospects';

const LOCAL_KEY = 'nfl-draft-my-board';

function generateSlug() {
  return Math.random().toString(36).substring(2, 10);
}

// Read localStorage board, normalizing old format (full objects) to IDs
function readLocalBoard() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => (typeof item === 'object' ? item.id : item));
  } catch {
    return [];
  }
}

function writeLocalBoard(ids) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ids));
}

function resolveIds(ids) {
  return ids.map((id) => getProspectById(id)).filter(Boolean);
}

export function useBoard() {
  const { user } = useAuth();

  // Internal state: array of prospect IDs
  const [prospectIds, setProspectIds] = useState([]);
  const [boardName, setBoardNameState] = useState('My Big Board');
  const [isPublic, setIsPublic] = useState(false);
  const [shareSlug, setShareSlug] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [firestoreDocId, setFirestoreDocId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const debounceTimer = useRef(null);
  const prevUser = useRef(null);

  // --- Load board ---
  useEffect(() => {
    let cancelled = false;

    async function loadFirestoreBoard(uid) {
      try {
        const q = query(
          collection(db, 'boards'),
          where('userId', '==', uid)
        );
        const snap = await getDocs(q);
        if (cancelled) return;
        if (!snap.empty) {
          const boardDoc = snap.docs[0];
          const data = boardDoc.data();
          setFirestoreDocId(boardDoc.id);
          setProspectIds(data.prospectIds || []);
          setBoardNameState(data.name || 'My Big Board');
          setIsPublic(data.isPublic || false);
          setShareSlug(data.shareSlug || null);
        } else {
          // New user, no board yet — start empty
          setProspectIds([]);
          setBoardNameState('My Big Board');
          setIsPublic(false);
          setShareSlug(null);
          setFirestoreDocId(null);
        }
      } catch (err) {
        console.error('Failed to load board from Firestore:', err);
      }
      if (!cancelled) setLoaded(true);
    }

    if (user) {
      // Authenticated: load from Firestore
      setLoaded(false);
      loadFirestoreBoard(user.uid);
    } else {
      // Guest: load from localStorage
      setProspectIds(readLocalBoard());
      setFirestoreDocId(null);
      setBoardNameState('My Big Board');
      setIsPublic(false);
      setShareSlug(null);
      setLoaded(true);
    }

    prevUser.current = user;

    return () => {
      cancelled = true;
    };
  }, [user]);

  // --- Debounced Firestore save ---
  const saveToFirestore = useCallback(
    async (ids, name, pub, slug) => {
      if (!user) return;
      setSyncStatus('saving');
      try {
        if (firestoreDocId) {
          await updateDoc(doc(db, 'boards', firestoreDocId), {
            prospectIds: ids,
            name,
            isPublic: pub,
            shareSlug: slug,
            updatedAt: serverTimestamp(),
          });
        } else {
          const docRef = await addDoc(collection(db, 'boards'), {
            userId: user.uid,
            prospectIds: ids,
            name,
            isPublic: pub,
            shareSlug: slug,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          setFirestoreDocId(docRef.id);
        }
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 3000);
      } catch (err) {
        console.error('Failed to save board:', err);
        setSyncStatus('error');
      }
    },
    [user, firestoreDocId]
  );

  const scheduleSave = useCallback(
    (ids, name, pub, slug) => {
      if (!user) return;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        saveToFirestore(ids, name, pub, slug);
      }, 2000);
    },
    [user, saveToFirestore]
  );

  // --- Guest localStorage sync ---
  useEffect(() => {
    if (!user && loaded) {
      writeLocalBoard(prospectIds);
    }
  }, [prospectIds, user, loaded]);

  // --- Public API ---
  const togglePlayer = useCallback(
    (player) => {
      setProspectIds((prev) => {
        const id = typeof player === 'object' ? player.id : player;
        const exists = prev.includes(id);
        const next = exists ? prev.filter((pid) => pid !== id) : [...prev, id];
        if (user) scheduleSave(next, boardName, isPublic, shareSlug);
        return next;
      });
    },
    [user, boardName, isPublic, shareSlug, scheduleSave]
  );

  const reorderBoard = useCallback(
    (newBoard) => {
      // Accept either player objects or IDs
      const ids = newBoard.map((item) =>
        typeof item === 'object' ? item.id : item
      );
      setProspectIds(ids);
      if (user) scheduleSave(ids, boardName, isPublic, shareSlug);
    },
    [user, boardName, isPublic, shareSlug, scheduleSave]
  );

  const setBoardName = useCallback(
    (name) => {
      setBoardNameState(name);
      if (user) scheduleSave(prospectIds, name, isPublic, shareSlug);
    },
    [user, prospectIds, isPublic, shareSlug, scheduleSave]
  );

  const togglePublic = useCallback(() => {
    setIsPublic((prev) => {
      const next = !prev;
      const slug = next && !shareSlug ? generateSlug() : shareSlug;
      if (next && !shareSlug) setShareSlug(slug);
      if (user) scheduleSave(prospectIds, boardName, next, slug);
      return next;
    });
  }, [user, prospectIds, boardName, shareSlug, scheduleSave]);

  const migrateFromLocal = useCallback(async () => {
    const localIds = readLocalBoard();
    if (localIds.length === 0 || !user) return;
    setProspectIds(localIds);
    // Save immediately (not debounced)
    await saveToFirestore(localIds, boardName, isPublic, shareSlug);
    localStorage.removeItem(LOCAL_KEY);
  }, [user, boardName, isPublic, shareSlug, saveToFirestore]);

  const hasLocalBoard = readLocalBoard().length > 0;

  // Resolve IDs to full player objects for consumers
  const myBoard = resolveIds(prospectIds);

  return {
    myBoard,
    boardName,
    isPublic,
    shareSlug,
    syncStatus,
    loaded,
    togglePlayer,
    reorderBoard,
    setBoardName,
    togglePublic,
    migrateFromLocal,
    hasLocalBoard,
  };
}
