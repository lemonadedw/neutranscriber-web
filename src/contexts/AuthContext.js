/**
 * AuthContext.js
 * 
 * Global authentication context that stores:
 * - Current logged-in user
 * - JWT access token
 * - JWT refresh token
 * - Login/logout functions
 * 
 * Usage: Wrap your app with <AuthProvider> to make auth available everywhere
 */

import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

/**
 * AuthProvider component
 * 
 * Props:
 *   children: React components to wrap
 * 
 * Features:
 *   - Loads saved tokens from localStorage on mount
 *   - Provides user, token, and auth functions to all children
 *   - Persists tokens in localStorage so user stays logged in after page refresh
 */
export function AuthProvider({ children }) {
  // State variables
  const [user, setUser] = useState(null);           // Current user object
  const [accessToken, setAccessToken] = useState(null);   // JWT access token
  const [refreshToken, setRefreshToken] = useState(null); // JWT refresh token
  const [isLoading, setIsLoading] = useState(true);  // Loading state on mount

  /**
   * Load tokens from localStorage when component mounts
   * This makes user stay logged in after page refresh
   */
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedAccessToken && storedUser) {
      setAccessToken(storedAccessToken);
      setUser(JSON.parse(storedUser));
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
      }
    }

    setIsLoading(false); // Done loading
  }, []);

  /**
   * Login function - called after Google OAuth succeeds
   * 
   * Args:
   *   accessToken: JWT token from backend
   *   refreshToken: Refresh token from backend
   *   userData: User object from backend
   */
  const login = (accessToken, refreshToken, userData) => {
    // Save to state
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(userData);

    // Save to localStorage for persistence
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Logout function - called when user clicks logout
   */
  const logout = () => {
    // Clear state
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Note: transcriptionHistory no longer stored in localStorage
    // History is loaded from backend on login
  };

  /**
   * Check if user is currently logged in
   */
  const isAuthenticated = !!accessToken && !!user;

  /**
   * Context value that gets passed to all children
   * Can be accessed with: useContext(AuthContext)
   */
  const value = {
    user,                // Current user object { id, email, name, picture, ... }
    accessToken,         // JWT token for API calls
    refreshToken,        // Token for refreshing access token
    isAuthenticated,     // Boolean: is user logged in?
    isLoading,          // Boolean: is auth still loading?
    login,              // Function: login(accessToken, refreshToken, user)
    logout,             // Function: logout()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use AuthContext easily
 * 
 * Usage:
 *   const { user, accessToken, login, logout } = useAuth();
 */
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
