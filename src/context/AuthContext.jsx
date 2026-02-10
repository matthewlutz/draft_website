import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage first (workaround for getSession() hanging)
    const storedSession = localStorage.getItem('sb-nkqsuftmozkxnucqwyby-auth-token');
    let restoredUser = null;

    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        // Check if token is expired
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
      } catch (e) {
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

      return () => clearTimeout(timeoutId);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user && event === 'SIGNED_IN') {
          await ensureUserProfile(session.user);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function ensureUserProfile(user) {
    // Check if user profile exists, create if not
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!existing) {
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.display_name || '',
      });
    }
  }

  const register = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data.user;
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
