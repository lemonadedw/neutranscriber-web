export const API_BASE_URL = 'http://localhost:9000'; // Base URL for the music transcription API
export const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`; // Endpoint for uploading audio files
export const TRANSCRIPTION_STATUS_ENDPOINT = `${API_BASE_URL}/status`; // Endpoint for checking transcription status

export const STATUS_MESSAGES = {
    SUCCESS: 'Transcription completed successfully.',
    FAILURE: 'Transcription failed. Please try again.',
    UPLOADING: 'Uploading audio file...',
    TRANSCRIBING: 'Transcribing audio...',
};