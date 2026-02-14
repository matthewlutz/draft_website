import { useState, useEffect } from 'react';
import { supabaseQuery } from '../supabase';
import { playerNotes, reviewedPlayerIds } from '../data/playerNotes';

export function useAdminPlayerNotes() {
  const [notes, setNotes] = useState(playerNotes);
  const [reviewedIds, setReviewedIds] = useState(reviewedPlayerIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabaseQuery('admin_player_notes', { select: 'prospect_id,pros,cons,comparisons' })
      .then(({ data }) => {
        if (!cancelled && data && data.length > 0) {
          const merged = { ...playerNotes };
          const ids = new Set(Object.keys(playerNotes));
          data.forEach(row => {
            // Only merge Supabase data if prospect_id is a slug (post-migration)
            if (typeof row.prospect_id !== 'string') return;
            merged[row.prospect_id] = {
              pros: row.pros || [],
              cons: row.cons || [],
              ...(row.comparisons ? { comparisons: row.comparisons } : {}),
            };
            ids.add(row.prospect_id);
          });
          setNotes(merged);
          setReviewedIds(ids);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return {
    notes,
    reviewedIds,
    loading,
    getNotes: (id) => notes[id] || null,
    isReviewed: (id) => reviewedIds.has(id),
  };
}
