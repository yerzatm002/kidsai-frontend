import React from "react";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  getAccessToken,
  setTokens,
  clearTokens
} from "./authStorage";
import { loginApi, registerApi, meApi } from "./authApi";

const AuthContext = React.createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = React.useState(getStoredUser());
  const [loading, setLoading] = React.useState(true);

  const isAuthenticated = !!getAccessToken();

  const syncMe = React.useCallback(async () => {
    try {
      const me = await meApi();
      setUser(me);
      setStoredUser(me);
      return me;
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // если /me не отдалось — считаем сессию битой
      logout();
      return null;
    }
  }, []);

  React.useEffect(() => {
    // при старте приложения: если есть токен — подтянуть /me
    (async () => {
      if (getAccessToken()) {
        await syncMe();
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = React.useCallback(async ({ email, password }) => {
    const data = await loginApi({ email, password });
    // ожидаем accessToken/refreshToken/user
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    // обязательный /me после логина
    const me = await syncMe();
    return me;
  }, [syncMe]);

  const register = React.useCallback(
    async ({ name, email, password, role, grade }) => {
      const payload = { fullName: name, email, password, role };
      // grade нужен для STUDENT
      if (role === "STUDENT") payload.grade = Number(grade);

      const data = await registerApi(payload);
      // многие бэки сразу возвращают токены, но если не вернул — делаем login
      if (data?.accessToken && data?.refreshToken) {
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        const me = await syncMe();
        return me;
      }

      // fallback: логин после регистрации
      const me = await login({ email, password });
      return me;
    },
    [login, syncMe]
  );

  const logout = React.useCallback(() => {
    clearTokens();
    clearStoredUser();
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({
      user,
      role: user?.role || null,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      syncMe
    }),
    [user, loading, isAuthenticated, login, register, logout, syncMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}