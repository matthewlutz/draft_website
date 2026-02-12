import { useAuth } from '../context/AuthContext';

export function useAdmin() {
  const { userRole } = useAuth();

  return {
    isAdmin: userRole === 'ADMIN' || userRole === 'SUPER_ADMIN',
    isSuperAdmin: userRole === 'SUPER_ADMIN',
    role: userRole,
  };
}
