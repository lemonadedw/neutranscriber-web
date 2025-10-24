import axios from 'axios';
import { DEFAULT_API_BASE_URL } from '../utils/constants';
import { websocketService } from './websocket';

let currentBaseURL = DEFAULT_API_BASE_URL;

// Create axios instance with custom config
const api = axios.create({
  baseURL: currentBaseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
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
  currentBaseURL = `${newBaseURL}/api`;
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
      const response = await api.post('/transcribe', formData);
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

  // Download MIDI file
  downloadMidi: (filename) => {
    return `${currentBaseURL}/download_midi/${filename}`;
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