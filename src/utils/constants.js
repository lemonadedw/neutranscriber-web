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

// Status messages for transcription progress (used in useTranscription hook)
export const STATUS_MESSAGES = {
    UPLOADING: 'Uploading audio file...',
    TRANSCRIBING: 'Transcribing audio...',
    PROCESSING: 'Processing...',
    COMPLETE: 'Transcription complete!',
    FAILURE: 'Transcription failed. Please try again.'
};

export const SERVER_STATUS_DISPLAY = {
    [SERVER_STATUS.ONLINE]: 'Online',
    [SERVER_STATUS.OFFLINE]: 'Offline',
    [SERVER_STATUS.ERROR]: 'Error',
    [SERVER_STATUS.CHECKING]: 'Checking...'
};

// Unified status color and badge styling
export const STATUS_STYLES = {
    // Status indicator dot classes (small circle)
    indicator: {
        [SERVER_STATUS.ONLINE]: 'bg-green-500 shadow-green-500/50',
        [SERVER_STATUS.OFFLINE]: 'bg-red-500 shadow-red-500/50',
        [SERVER_STATUS.ERROR]: 'bg-red-500 shadow-red-500/50',
        [SERVER_STATUS.CHECKING]: 'bg-yellow-500 shadow-yellow-500/50 animate-pulse'
    },
    // Status badge classes (text + background)
    badge: {
        [SERVER_STATUS.ONLINE]: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
        [SERVER_STATUS.OFFLINE]: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
        [SERVER_STATUS.ERROR]: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
        [SERVER_STATUS.CHECKING]: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300'
    }
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
export const SERVER_HEALTH_CHECK_INTERVAL = 30000; // 30 seconds