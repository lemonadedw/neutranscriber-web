/**
 * ProtectedRoute.js
 * 
 * A wrapper component that protects routes from unauthenticated users
 * If user is not logged in, redirects to login page
 * 
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @returns {JSX.Element} Either the protected component or a redirect to login
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, show the protected component
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" replace />;
}

/**
 * Example: How to use ProtectedRoute in App.js
 * 
 * import { BrowserRouter, Routes, Route } from 'react-router-dom';
 * import { ProtectedRoute } from './components/ProtectedRoute';
 * import { LoginPage } from './components/GoogleLogin';
 * import { Dashboard } from './components/Dashboard';
 * 
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>
 *         <Route path="/login" element={<LoginPage />} />
 *         <Route
 *           path="/dashboard"
 *           element={
 *             <ProtectedRoute>
 *               <Dashboard />
 *             </ProtectedRoute>
 *           }
 *         />
 *       </Routes>
 *     </BrowserRouter>
 *   );
 * }
 */
