import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { loadAuth, saveAuth, clearAuth, onUnauthorized } from '../api/client';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());

  useEffect(() => {
    onUnauthorized(() => setAuth(null));
  }, []);

  const doLogin = useCallback(async (email, senha) => {
    const data = await authApi.login(email, senha);
    saveAuth(data);
    setAuth(data);
    return data;
  }, []);

  const doLogout = useCallback(async () => {
    await authApi.logout(auth?.refreshToken);
    clearAuth();
    setAuth(null);
  }, [auth]);

  const value = useMemo(
    () => ({
      usuario: auth?.usuario || null,
      isAuthenticated: !!auth?.accessToken,
      login: doLogin,
      logout: doLogout,
    }),
    [auth, doLogin, doLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
