import { useAuth } from '../context/AuthContext';
import { supabaseRest } from '../supabase';

export function useAuditLog() {
  const { user } = useAuth();

  async function log(action, targetType, targetId, details = null) {
    if (!user) return;
    try {
      await supabaseRest('audit_log', 'POST', {
        data: {
          admin_id: user.id,
          action,
          target_type: targetType,
          target_id: targetId,
          details,
        },
      });
    } catch (err) {
      console.error('Audit log failed:', err);
    }
  }

  return { log };
}
