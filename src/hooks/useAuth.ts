import { useState, useEffect, useCallback } from 'react';
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionIdState] = useState<string | null>(getSessionId());

  const fetchMe = useCallback(async () => {
    const sid = getSessionId();
    if (!sid) { setLoading(false); return; }
    const res = await apiFetch(`${API.auth}?action=me`);
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      clearSession();
      setSessionIdState(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const register = async (params: {
    name: string; email: string; password: string; phone?: string; city?: string; sport?: string;
  }) => {
    const res = await apiFetch(`${API.auth}?action=register`, { method: 'POST', body: JSON.stringify(params) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка регистрации');
    setSession(data.session_id);
    setSessionIdState(data.session_id);
    setUser(data.user);
    return data;
  };

  const login = async (email: string, password: string) => {
    const res = await apiFetch(`${API.auth}?action=login`, { method: 'POST', body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ошибка входа');
    setSession(data.session_id);
    setSessionIdState(data.session_id);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await apiFetch(`${API.auth}?action=logout`, { method: 'POST' });
    clearSession();
    setSessionIdState(null);
    setUser(null);
  };

  return { user, loading, sessionId, register, login, logout, isAdmin: user?.role === 'admin' };
}