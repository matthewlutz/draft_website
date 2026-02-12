import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseRest } from '../supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('USER');
  const [loading, setLoading] = useState(true);

  const ensureUserProfile = async (authUser) => {
    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id, role')
        .eq('id', authUser.id)
        .single();

      if (existing) {
        setUserRole(existing.role || 'USER');
        supabaseRest('users', 'PATCH', {
          data: { last_active: new Date().toISOString() },
          eq: { id: authUser.id },
        }).catch(() => {});
      } else {
        const { error: insertError } = await supabase.from('users').insert({
          id: authUser.id,
          email: authUser.email,
          display_name: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
        });
        if (insertError) {
          console.error('Failed to create user profile:', insertError);
        }
        setUserRole('USER');
      }
    } catch (err) {
      console.error('ensureUserProfile error:', err);
      setUserRole('USER');
    }
  };

  useEffect(() => {
    // Always listen for auth changes (must be registered before any session restore)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user && event === 'SIGNED_IN') {
          await ensureUserProfile(session.user);
        }
        setLoading(false);
      }
    );

    // Try to restore session from localStorage first (workaround for getSession() hanging)
    const storedSession = localStorage.getItem('sb-nkqsuftmozkxnucqwyby-auth-token');
    let restoredUser = null;

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        const expiresAt = parsed?.expires_at;
        const now = Math.floor(Date.now() / 1000);

        if (parsed?.user && expiresAt && expiresAt > now) {
          restoredUser = parsed.user;
          setUser(restoredUser);
          setLoading(false);
          ensureUserProfile(restoredUser);
        } else if (parsed?.user && expiresAt && expiresAt <= now) {
          localStorage.removeItem('sb-nkqsuftmozkxnucqwyby-auth-token');
        }
      } catch {
        // Invalid stored session
      }
    }

    // If no valid stored session, try getSession with timeout
    if (!restoredUser) {
      let resolved = false;
      const timeoutId = setTimeout(() => {
        if (!resolved) {
          setLoading(false);
        }
      }, 5000);

      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          resolved = true;
          clearTimeout(timeoutId);
          setUser(session?.user ?? null);
          if (session?.user) {
            ensureUserProfile(session.user);
          }
          setLoading(false);
        })
        .catch(() => {
          resolved = true;
          clearTimeout(timeoutId);
          setLoading(false);
        });

      return () => {
        clearTimeout(timeoutId);
        subscription.unsubscribe();
      };
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    if (data.user) {
      await ensureUserProfile(data.user);
    }
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.user) {
      await ensureUserProfile(data.user);
    }
    return data.user;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    // Clear state immediately so UI updates even if signOut() fails
    setUser(null);
    setUserRole('USER');
    try {
      await supabase.auth.signOut();
    } catch {
      // Sign out may fail if token is already invalid - that's fine, state is already cleared
    }
  };

  const updateDisplayName = async (displayName) => {
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw error;

    // Also update the users table
    if (user) {
      await supabase
        .from('users')
        .update({ display_name: displayName })
        .eq('id', user.id);
    }

    // Update local user state
    if (data.user) {
      setUser(data.user);
    }

    return data.user;
  };

  const value = {
    user,
    userRole,
    loading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
