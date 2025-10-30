import { io } from 'socket.io-client';
import { DEFAULT_API_BASE_URL } from '../utils/constants';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentBaseURL = DEFAULT_API_BASE_URL.replace('/api', '');
    this.transcriptionCallbacks = [];
    this.isConnecting = false; // Prevent duplicate connection attempts
  }

  connect() {
    // If already connected or currently connecting, return existing socket
    if (this.socket || this.isConnecting) {
      return this.socket;
    }
    
    this.isConnecting = true;
    
    this.socket = io(this.currentBaseURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      this.isConnecting = false;
      console.log('WebSocket connected');
    });

    this.socket.on('connect_error', (error) => {
      // Reset connecting flag on error to allow retry
      this.isConnecting = false;
      console.error('WebSocket error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnecting = false;
      console.log('WebSocket disconnected:', reason);
    });

    // Set up transcription_update listener
    this.socket.on('transcription_update', (...args) => {
      const data = args[0];
      
      // Call all registered callbacks
      this.transcriptionCallbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Transcription callback error:', error);
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
    this.isConnecting = false;
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

  joinTask(taskId) {
    if (!this.socket) {
      this.connect();
    }

    const emitJoin = () => {
      this.socket.emit('join_task', { task_id: taskId });
    };

    if (this.socket?.connected) {
      emitJoin();
    } else {
      this.socket.once('connect', emitJoin);
    }
  }

  leaveTask(taskId) {
    if (this.socket?.connected) {
      this.socket.emit('leave_task', { task_id: taskId });
    } else {
      // If not connected, queue it to send on reconnect
      this.socket?.once('connect', () => {
        this.socket.emit('leave_task', { task_id: taskId });
      });
    }
  }

  updateBaseURL(newBaseURL) {
    const wasConnected = this.socket?.connected;
    
    // Only disconnect if socket exists and was actively connected
    // Avoid disconnecting a socket that's not in a stable state
    if (this.socket && wasConnected) {
      this.socket.disconnect();
      this.socket = null;
    } else if (this.socket) {
      // Socket exists but not connected, just set to null without calling disconnect
      this.socket = null;
    }
    
    // Update base URL
    this.currentBaseURL = newBaseURL;
    
    // Reconnect if previously connected
    if (wasConnected) {
      // Use setTimeout to allow cleanup to complete before reconnecting
      setTimeout(() => this.connect(), 100);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
