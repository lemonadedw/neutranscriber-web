import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

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
    return `${API_BASE_URL}/download_midi/${filename}`;
  }
};