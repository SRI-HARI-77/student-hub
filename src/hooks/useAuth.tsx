import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { api, setToken, removeToken, getStoredUser, setStoredUser, removeStoredUser } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName }),
        requiresAuth: false,
      });

      if (response.token && response.user) {
        setToken(response.token);
        setStoredUser(response.user);
        setUser(response.user);
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Signup failed') };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        requiresAuth: false,
      });

      if (response.token && response.user) {
        setToken(response.token);
        setStoredUser(response.user);
        setUser(response.user);
      }

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Login failed') };
    }
  };

  const signOut = async () => {
    removeToken();
    removeStoredUser();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        requiresAuth: false,
      });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Password reset request failed') };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      await api('/auth/update-password', {
        method: 'PUT',
        body: JSON.stringify({ newPassword: password }),
      });

      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error : new Error('Password update failed') };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
