// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { speak } from "../utils/speech";


export const AuthContext = createContext();

const BACKEND_URL = "http://localhost:5000";

export function AuthProvider({ children }) {
  // const [user, setUser] = useState(() => {
  //   const saved = localStorage.getItem("memorizer_user");
  //   return saved ? JSON.parse(saved) : null;
  // });
  // const [token, setToken] = useState(() =>
  //   localStorage.getItem("memorizer_token")
  // );

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("memorizer_user")) || null
  );
  const [token, setToken] = useState(() =>
    localStorage.getItem("memorizer_token")
  );

  useEffect(() => {
    if (token) fetchProfile();
    else setUser(null);
  }, [token]);

  // Persist to localStorage
  useEffect(() => {
    token
      ? localStorage.setItem("memorizer_token", token)
      : localStorage.removeItem("memorizer_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("memorizer_user", JSON.stringify(user));
    else localStorage.removeItem("memorizer_user");
  }, [user]);

  const signup = async (data) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Signup failed");
    }
    const { token: tkn, user: u } = await res.json();
    setToken(tkn);
    setUser(u);
    speak(`Welcome, ${u.name}, you have been successfully signed up!`);
    await fetchProfile();
    // setUser(u);
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    const { token: tkn, user: u } = await res.json();
    setToken(tkn);
    setUser(u);
    speak(`Welcome, ${u.name}, you have been successfully logged in!`);
    await fetchProfile();
  };

  const fetchProfile = async () => {
    const res = await fetch(`${BACKEND_URL}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return; // bail on 401, redirects, etc.
    if (!res.headers.get("content-type")?.includes("application/json")) return;
    const { user: profile } = await res.json();
    setUser(profile);
  };

  const updateProfile = async (updates) => {
    const res = await fetch(`${BACKEND_URL}/api/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Update failed");
    }
    const { user: updated } = await res.json();
    setUser(updated);
    speak(`Profile updated successfully, ${updated.name}!`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    speak("You have been logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signup,
        login,
        fetchProfile,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
