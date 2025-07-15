import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiCall} from "../config/api";
import { apiConfig } from "../config/apiConfig";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  role?: string; // <-- Add this
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to check if token is expired
  function isTokenExpired(token: string | null) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const exp = decoded?.exp;
      return exp ? Date.now() >= exp * 1000 : true;
    } catch {
      return true;
    }
  }

  // Try to refresh token if expired on app load
  useEffect(() => {
    async function ensureFreshToken() {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!token) {
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        try {
          const refreshResponse = await apiCall(`${apiConfig.endpoints.refresh}`, {
            method: 'GET',
            withCredentials: true
          });
          
          if (refreshResponse.accessToken) {
            const newToken = refreshResponse.accessToken;
            localStorage.setItem("authToken", newToken);
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } else {
            throw new Error("No access token in refresh response");
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
      setLoading(false);
    }
    ensureFreshToken();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
