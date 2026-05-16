import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../api';

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthState>({ user: null, setUser: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const s = localStorage.getItem('docmind_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const setUser = (u: User | null) => {
    if (u) localStorage.setItem('docmind_user', JSON.stringify(u));
    else localStorage.removeItem('docmind_user');
    setUserState(u);
  };

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
