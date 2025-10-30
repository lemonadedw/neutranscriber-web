/**
 * GoogleLogin.js
 * 
 * Handles Google OAuth login flow
 * Shows a "Sign in with Google" button
 * Communicates with backend to get JWT token
 */

import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function GoogleLoginButton() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle successful Google login
   * 
   * This function:
   * 1. Receives authorization code from Google
   * 2. Sends auth code to backend
   * 3. Backend exchanges code for ID token
   * 4. Backend verifies with Google and returns JWT
   * 5. Save JWT and user info
   * 6. Redirect to dashboard
   */
  const handleGoogleLoginSuccess = async (codeResponse) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Sending authorization code to backend...');

      // Send authorization code to our backend
      const response = await fetch('http://localhost:9000/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The authorization code from Google OAuth
        body: JSON.stringify({
          code: codeResponse.code,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      // Backend returns JWT token and user info
      const data = await response.json();
      console.log('✅ Login successful!', data.user);

      // Save to AuthContext and localStorage
      login(data.access_token, data.refresh_token, data.user);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google login error
   */
  const handleGoogleLoginError = () => {
    setError('Google login failed. Please try again.');
  };

  /**
   * Setup Google login button
   * 
   * Uses 'auth-code' flow to get authorization code
   * which gets exchanged for ID token on the backend
   * More secure than implicit flow
   */
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: 'auth-code', // auth-code flow: get code to exchange for tokens on backend
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => googleLogin()}
        disabled={isLoading}
        className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-md 
                   hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2 font-medium text-gray-700"
      >
        {/* Google Icon */}
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isLoading ? 'Signing in...' : 'Sign in with Google'}
      </button>

      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

/**
 * Standalone Login Page Component
 * Shows the Google login button and some styling
 */
export function LoginPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            NeuTranscriber
          </h1>
          <p className="text-gray-600">
            Convert your audio to sheet music
          </p>
        </div>

        <div className="mb-6">
          <GoogleLoginButton />
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>
            We use Google to securely authenticate your account.
          </p>
        </div>
      </div>
    </div>
  );
}
