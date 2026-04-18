"use client";

import { fr } from "zod/v4/locales";
import { createContext, useContext, useEffect, useState } from "react";
import { set } from "zod";
import GloabalLoadingWrapper from "@/app/dashboard/components/dashboard/common/GlobalLoaderWrapper";

interface User {
  user: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("_UPLFMMATRIX");
    console.log("Token in effect", token)
    const user = localStorage.getItem("user");

    if (token && user) {
      setToken(token);
      setUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // console.log("token in auth", token)


  const setAuth = (user: User, token: string) => {
    localStorage.setItem("_UPLFMMATRIX", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setToken(token);
    setLoading(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, setAuth, logout, loading }} >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}