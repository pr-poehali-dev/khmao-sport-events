import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { API, apiFetch, setSession, clearSession, getSessionId } from '@/lib/api';

export interface User {
  user_id?: number;
  id?: number;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  sport?: string;
  rank?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  register: (params: { name: string; email: string; password: string; phone?: string; city?: string; sport?: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const sid = getSessionId();
    if (!sid) { setLoading(false); return; }
    const res = await apiFetch(`${API.auth}?action=me`);
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const register = async (params: { name: string; email: string; password: string; phone?: string; city?: string; sport?: string }) => {
    const res = await apiFetch(`${API.auth}?action=register`, { method: 'POST', body: JSON.stringify(params) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    setSession(data.session_id);
    setUser(data.user);
  };

  const login = async (email: string, password: string) => {
    const res = await apiFetch(`${API.auth}?action=login`, { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка входа');
    setSession(data.session_id);
    setUser(data.user);
  };

  const logout = async () => {
    await apiFetch(`${API.auth}?action=logout`, { method: 'POST' });
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}