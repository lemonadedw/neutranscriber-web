import axios from 'axios';
import { DEFAULT_API_BASE_URL } from '../utils/constants';

let currentBaseURL = DEFAULT_API_BASE_URL;

const api = axios.create({
  baseURL: currentBaseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Function to update the base URL dynamically
export const updateApiBaseURL = (newBaseURL) => {
  currentBaseURL = `${newBaseURL}/api`;
  api.defaults.baseURL = currentBaseURL;
};

export const transcriptionAPI = {
  // Upload file and start transcription
  uploadAndTranscribe: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/transcribe', formData);
    return response.data;
  },

  // Check transcription status
  getTranscriptionStatus: async (taskId) => {
    const response = await api.get(`/transcription_status/${taskId}`);
    return response.data;
  },

  // Download MIDI file
  downloadMidi: (filename) => {
    return `${currentBaseURL}/download_midi/${filename}`;
  },

  // Get current base URL
  getCurrentBaseURL: () => currentBaseURL
};