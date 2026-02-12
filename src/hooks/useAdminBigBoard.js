import { useState, useEffect } from 'react';
import { supabaseQuery } from '../supabase';
import { customBigBoardRankings } from '../data/customBigBoard';

export function useAdminBigBoard() {
  const [rankings, setRankings] = useState(customBigBoardRankings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    supabaseQuery('admin_big_board', {
      eq: { board_name: 'mr_lutz' },
      limit: 1,
    })
      .then(({ data }) => {
        if (!cancelled && data && data.length > 0 && data[0].prospect_ids) {
          const ids = data[0].prospect_ids;
          // Only use Supabase data if IDs are slugs (post-migration)
          if (ids.length > 0 && typeof ids[0] === 'string') {
            setRankings(ids);
          }
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { rankings, loading };
}
