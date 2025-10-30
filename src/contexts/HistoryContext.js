import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);
  const lastTokenRef = useRef(null);

  // Fetch history from backend
  const fetchHistory = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setHistory([]);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';
      const response = await fetch(`${apiUrl}/user/transcriptions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        
        const transformed = data.transcriptions.map(t => {
          const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
          // Extract hostname from URL (e.g., "localhost:9000" from "http://localhost:9000")
          const serverName = new URL(serverUrl).host || 'localhost';
          
          return {
            id: t.id.toString(),
            timestamp: t.created_at,
            fileName: t.filename,
            processingTime: t.processing_time,
            midiFilename: t.midi_filename,
            status: t.status,
            serverName: serverName,
            serverUrl: serverUrl
          };
        });
        
        setHistory(transformed);
      } else {
        console.error('Failed to fetch history, status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  }, []);

  // Load history on mount AND when access token changes (user login/logout)
  useEffect(() => {
    const currentToken = localStorage.getItem('access_token');
    
    // Check if token has changed (user logged in/out)
    if (currentToken !== lastTokenRef.current) {
      lastTokenRef.current = currentToken;
      fetchHistory();
    }
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        fetchHistory();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check token every 500ms to catch same-tab changes
    const interval = setInterval(() => {
      const newToken = localStorage.getItem('access_token');
      if (newToken !== lastTokenRef.current) {
        lastTokenRef.current = newToken;
        fetchHistory();
      }
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [fetchHistory]);

  // Clear all history
  const clearHistory = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return { success: false, error: 'Not authenticated' };

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';
      const response = await fetch(`${apiUrl}/user/transcriptions`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setHistory([]);
        return { success: true };
      } else {
        try {
          const data = await response.json();
          console.error('Clear history error response:', data);
          return { success: false, error: data.error || `Error: ${response.status}` };
        } catch {
          console.error('Failed to parse error response, status:', response.status);
          return { success: false, error: `Server error (${response.status})` };
        }
      }
    } catch (error) {
      console.error('Clear history network error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Remove single transcription
  const removeTranscription = useCallback(async (id) => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) return { success: false, error: 'Not authenticated' };

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000/api';
      const response = await fetch(`${apiUrl}/user/transcriptions/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok || response.status === 404) {
        setHistory(prev => prev.filter(item => item.id !== id));
        return { success: true };
      } else {
        try {
          const data = await response.json();
          console.error('Remove transcription error response:', data);
          return { success: false, error: data.error || `Error: ${response.status}` };
        } catch {
          console.error('Failed to parse error response, status:', response.status);
          return { success: false, error: `Server error (${response.status})` };
        }
      }
    } catch (error) {
      console.error('Remove transcription network error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  }, []);

  // Reload history after saving new transcription
  const reloadHistory = fetchHistory;

  return (
    <HistoryContext.Provider value={{ history, clearHistory, removeTranscription, reloadHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};