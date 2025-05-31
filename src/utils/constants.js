export const DEFAULT_SERVERS = [
    {
        id: 'localhost',
        name: 'Local Server',
        url: 'http://localhost:9000',
        healthUrl: 'http://localhost:9000/api/health',
        status: 'checking'
    },
    {
        id: 'remote',
        name: 'Remote Server',
        url: 'http://40.73.3.5:9000',
        healthUrl: 'http://40.73.3.5:9000/api/health',
        status: 'checking'
    }
];

export const DEFAULT_API_BASE_URL = 'http://localhost:9000/api';

export const STATUS_MESSAGES = {
    SUCCESS: 'Transcription completed successfully.',
    FAILURE: 'Transcription failed. Please try again.',
    UPLOADING: 'Uploading audio file...',
    TRANSCRIBING: 'Transcribing audio...',
    PROCESSING: 'Processing...',
    COMPLETE: 'Transcription complete!'
};

export const SUPPORTED_AUDIO_TYPES = [
    'audio/mpeg', 'audio/mp3',
    'audio/wav', 'audio/wave', 'audio/x-wav',
    'audio/flac', 'audio/x-flac',
    'audio/ogg', 'audio/vorbis',
    'audio/mp4', 'audio/m4a', 'audio/x-m4a',
    'audio/aiff', 'audio/x-aiff',
    'audio/aac', 'audio/aacp'
];

export const SUPPORTED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aiff', '.aac'];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const POLL_INTERVAL = 2000; // 2 seconds