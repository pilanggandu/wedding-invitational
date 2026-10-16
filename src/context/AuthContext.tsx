"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser } from "@/types/auth";
import {
  loginToBackend,
  registerToBackend,
  fetchCurrentUserFromBackend,
  logoutFromBackend,
  getStoredAuthToken,
} from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (params: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = getStoredAuthToken();
    if (!stored) {
      setIsLoading(false);
      return;
    }

    setToken(stored);
    fetchCurrentUserFromBackend()
      .then((currUser) => {
        if (currUser) {
          setUser(currUser);
        } else {
          setToken(null);
        }
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginToBackend({ username, password });
    if (res.error || !res.user) {
      return { success: false, error: res.error || "Gagal masuk" };
    }

    setUser(res.user);
    setToken(res.token);
    return { success: true };
  };

  const register = async (params: {
    username: string;
    password: string;
    fullName: string;
    email?: string;
  }) => {
    const res = await registerToBackend(params);
    if (res.error || !res.user) {
      return { success: false, error: res.error || "Gagal mendaftar" };
    }

    setUser(res.user);
    setToken(res.token);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await logoutFromBackend();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
