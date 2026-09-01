import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance, { setUnauthorizedHandler } from "../config/AxiosInstance";

/*
 * Who is signed in, for the whole app.
 *
 * The session token used to sit in a cookie this code could read, so "am I
 * signed in?" was answered by looking for it. It is httpOnly now — invisible
 * to every script on the page, which is the point — so the question is asked
 * of the server once at boot, and the answer is kept here.
 */
const AuthContext = createContext(null);

/** "loading" until the first /me answers; then "authenticated" or "anonymous". */
const LOADING = "loading";
const AUTHENTICATED = "authenticated";
const ANONYMOUS = "anonymous";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(LOADING);

  const clear = useCallback(() => {
    setUser(null);
    setStatus(ANONYMOUS);
  }, []);

  // A 401 on any ordinary request means the cookie expired or was revoked
  // mid-session. One place decides what that means.
  useEffect(() => {
    setUnauthorizedHandler(clear);
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axiosInstance.get("/me");
        if (cancelled) return;
        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          setStatus(AUTHENTICATED);
          return;
        }
        clear();
      } catch {
        // 401 here is the ordinary "no session" answer, not a failure.
        if (!cancelled) clear();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clear]);

  const login = useCallback(async (credentials) => {
    const res = await axiosInstance.post("/login", credentials);
    if (!res.data?.success || !res.data.user) {
      throw new Error(res.data?.message || "Could not sign you in");
    }
    setUser(res.data.user);
    setStatus(AUTHENTICATED);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      // Only the server can delete an httpOnly cookie.
      await axiosInstance.post("/logout");
    } catch {
      // Already expired, or the network is down. Either way this session is
      // over as far as the app is concerned.
    }
    clear();
  }, [clear]);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === AUTHENTICATED,
      isLoading: status === LOADING,
      login,
      logout,
    }),
    [user, status, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
