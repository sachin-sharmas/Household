import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(payload) {
        const data = await authApi.login(payload);
        setUser(data.user);
        return data.user;
      },
      async register(payload) {
        const data = await authApi.register(payload);
        setUser(data.user);
        return data.user;
      },
      async logout() {
        await authApi.logout();
        setUser(null);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
