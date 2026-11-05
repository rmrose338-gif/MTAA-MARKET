import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, registerRequest, setAuthToken, getCurrentUser, updateProfileRequest } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mtaa_token");
    if (!token) {
      setLoading(false);
      return;
    }
    setAuthToken(token);
    getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("mtaa_token");
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const result = await loginRequest(credentials);
    localStorage.setItem("mtaa_token", result.token);
    setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function register(details) {
    const result = await registerRequest(details);
    localStorage.setItem("mtaa_token", result.token);
    setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }

  async function updateProfile(profile) {
    const updatedUser = await updateProfileRequest(profile);
    setUser(updatedUser);
    return updatedUser;
  }

  function logout() {
    localStorage.removeItem("mtaa_token");
    setAuthToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, login, register, updateProfile, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
