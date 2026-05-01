import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setToken, clearToken, getToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [school,  setSchool]  = useState({ name: 'NEXTWAY Academy', board: 'CBSE', city: 'Indore' });
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (!getToken()) { setLoading(false); return; }
      try {
        const data = await authApi.me();
        if (data.user) setUser(data.user);
      } catch {
        clearToken();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // Real login
  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.accessToken);
    setUser(data.user);
    return data.user;
  };

  // Demo login - works without backend
  const demoLogin = (role) => {
    const DEMO = {
      admin:   { id:'1', name:'Rahul Sharma', role:'school_admin', email:'admin@nextway.edu',         avatar:'RS' },
      teacher: { id:'2', name:'Priya Verma',  role:'teacher',      email:'priya@nextway.edu',         avatar:'PV' },
      student: { id:'3', name:'Aarav Gupta',  role:'student',      email:'aarav@student.nextway.edu', avatar:'AG' },
      parent:  { id:'4', name:'Suresh Gupta', role:'parent',       email:'suresh@gmail.com',          avatar:'SG' },
    };
    setUser(DEMO[role]);
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, school, loading, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
