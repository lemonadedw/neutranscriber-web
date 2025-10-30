import axios from 'axios';
import { DEFAULT_API_BASE_URL } from '../utils/constants';
import { websocketService } from './websocket';

let currentBaseURL = DEFAULT_API_BASE_URL;

// Create axios instance with custom config
const api = axios.create({
  baseURL: currentBaseURL,
  timeout: 30000, // 30 second timeout
});

// Error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Log errors or handle them globally
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Update base URL dynamically
export const updateApiBaseURL = (newBaseURL) => {
  const newApiURL = `${newBaseURL}/api`;
  
  // Only update if URL actually changed
  if (currentBaseURL === newApiURL) {
    return;
  }
  
  currentBaseURL = newApiURL;
  api.defaults.baseURL = currentBaseURL;
  
  // Also update WebSocket connection
  websocketService.updateBaseURL(newBaseURL);
};

export const transcriptionAPI = {
  // Upload file and start transcription
  uploadAndTranscribe: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get JWT token from localStorage (stored as 'access_token' by AuthContext)
      const accessToken = localStorage.getItem('access_token');
      
      // Create config with authorization header
      // IMPORTANT: Do NOT set Content-Type header for FormData
      // Axios will automatically set it with the correct boundary
      const config = {
        headers: {
          // Remove Content-Type - let axios set it automatically with boundary
        }
      };
      
      // Add authorization header if token exists
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await api.post('/transcribe', formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check transcription status
  getTranscriptionStatus: async (taskId) => {
    try {
      const response = await api.get(`/transcription_status/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download MIDI file with authentication
  downloadMidi: async (filename, token) => {
    try {
      const response = await fetch(`${currentBaseURL}/download_midi/${filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Download failed: ${response.statusText}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },

  // Health check for a server
  checkServerHealth: async (healthUrl) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.status === 'ok' ? 'online' : 'error';
      }
      return 'error';
    } catch (error) {
      return 'offline';
    }
  },

  // Get current base URL
  getCurrentBaseURL: () => currentBaseURL
};