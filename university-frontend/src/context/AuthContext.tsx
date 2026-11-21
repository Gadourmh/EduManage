"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function safeParseUser(rawUser: string): User | null {
    try {
      const parsed = JSON.parse(rawUser) as Partial<User>;

      if (
        typeof parsed.id !== "number" ||
        typeof parsed.fullName !== "string" ||
        typeof parsed.email !== "string" ||
        typeof parsed.role !== "string"
      ) {
        return null;
      }

      return {
        id: parsed.id,
        fullName: parsed.fullName,
        email: parsed.email,
        role: parsed.role,
      };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const storedUser = window.localStorage.getItem("user");

    if (storedToken && storedUser) {
      const parsedUser = safeParseUser(storedUser);
      if (parsedUser) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
      }
    } else {
      // Keep storage consistent if one key is missing/corrupted.
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("token");
    }

    setLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

