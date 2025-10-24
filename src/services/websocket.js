import { io } from 'socket.io-client';
import { DEFAULT_API_BASE_URL } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentBaseURL = DEFAULT_API_BASE_URL.replace('/api', '');
    this.transcriptionCallbacks = [];
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.currentBaseURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Set up transcription_update listener immediately
    this.socket.on('transcription_update', (...args) => {
      const data = args[0];
      
      // Call all registered callbacks
      this.transcriptionCallbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in transcription callback:', error);
        }
      });
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  onTranscriptionUpdate(callback) {
    // Add callback to the list
    this.transcriptionCallbacks.push(callback);

    // Return cleanup function
    return () => {
      const index = this.transcriptionCallbacks.indexOf(callback);
      if (index > -1) {
        this.transcriptionCallbacks.splice(index, 1);
      }
    };
  }

  updateBaseURL(newBaseURL) {
    const wasConnected = this.socket?.connected;
    
    // Disconnect existing connection
    this.disconnect();
    
    // Update base URL
    this.currentBaseURL = newBaseURL;
    
    // Reconnect if previously connected
    if (wasConnected) {
      this.connect();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
