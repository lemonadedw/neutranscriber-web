// Server configuration
export const DEFAULT_SERVERS = [
    {
        id: '0',
        name: 'Localhost',
        url: 'http://localhost:9000',
    },
    // {
    //     id: '1',
    //     name: '40.73.3.5',
    //     url: 'http://40.73.3.5:9000',
    // }
];

export const DEFAULT_API_BASE_URL = `${DEFAULT_SERVERS[0].url}/api`;

// Server status mapping
export const SERVER_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    ERROR: 'error',
    CHECKING: 'checking'
};

// Application status messages
export const STATUS_MESSAGES = {
    SUCCESS: 'Transcription completed successfully.',
    FAILURE: 'Transcription failed. Please try again.',
    UPLOADING: 'Uploading audio file...',
    TRANSCRIBING: 'Transcribing audio...',
    PROCESSING: 'Processing...',
    COMPLETE: 'Transcription complete!'
};

export const SERVER_STATUS_DISPLAY = {
    [SERVER_STATUS.ONLINE]: 'Online',
    [SERVER_STATUS.OFFLINE]: 'Offline',
    [SERVER_STATUS.ERROR]: 'Error',
    [SERVER_STATUS.CHECKING]: 'Checking...'
};

// File upload configurations
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

// App configurations
export const POLL_INTERVAL = 2000; // 2 seconds
export const SERVER_HEALTH_CHECK_INTERVAL = 30000; // 30 seconds