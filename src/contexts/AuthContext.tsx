// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem('authToken');
//     const userData = localStorage.getItem('userData');

//     if (token && userData) {
//       try {
//         setUser(JSON.parse(userData));
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('userData');
//       }
//     }

//     setLoading(false);
//   }, []);

//   const login = (userData, token) => {
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('userData', JSON.stringify(userData));
//     setUser(userData);
//   };

//   const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userData');
//     setUser(null);
//   };

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/config/axiosInstance";
import * as jwt_decode from "jwt-decode";

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
      const { exp } = (jwt_decode as any).default(token) as { exp: number };
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  // Try to refresh token if expired on app load
  useEffect(() => {
    async function ensureFreshToken() {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (token && isTokenExpired(token)) {
        try {
          const refreshResponse = await axiosInstance.post("/auth/refresh", {}, { withCredentials: true });
          const newToken = refreshResponse.data.token;
          localStorage.setItem("authToken", newToken);
          if (userData) {
            setUser(JSON.parse(userData));
          }
        } catch (err) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          setUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (token && userData) {
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
