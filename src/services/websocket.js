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
      console.log('WebSocket already connected');
      return this.socket;
    }

    console.log('Initializing WebSocket connection to:', this.currentBaseURL);
    
    this.socket = io(this.currentBaseURL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✓ WebSocket connected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    // Set up transcription_update listener immediately
    this.socket.on('transcription_update', (...args) => {
      const data = args[0];
      console.log('Received transcription_update:', data);
      
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

  joinTask(taskId) {
    /**
     * Join a task-specific room to receive updates only for this task.
     * This ensures privacy: clients only receive updates for their own tasks,
     * not other users' transcription progress.
     * 
     * If the socket is not yet connected, wait for it to connect first.
     */
    console.log(`[joinTask] Attempting to join task: ${taskId}`);
    
    if (!this.socket) {
      console.log('[joinTask] Socket not initialized, initializing now...');
      this.connect();
    }

    const emitJoin = () => {
      console.log(`[joinTask] Socket connected, emitting join_task for: ${taskId}`);
      this.socket.emit('join_task', { task_id: taskId });
    };

    if (this.socket?.connected) {
      console.log('[joinTask] Socket already connected, joining immediately');
      emitJoin();
    } else {
      console.log('[joinTask] Socket not yet connected, waiting for connect event...');
      // Wait for connection to establish
      this.socket.once('connect', emitJoin);
    }
  }

  leaveTask(taskId) {
    /**
     * Leave a task-specific room when done with the task.
     * Cleans up server-side room subscriptions.
     */
    console.log(`[leaveTask] Attempting to leave task: ${taskId}`);
    
    if (this.socket?.connected) {
      console.log(`[leaveTask] Socket connected, leaving task: ${taskId}`);
      this.socket.emit('leave_task', { task_id: taskId });
    } else {
      console.log('[leaveTask] Socket not connected, queueing leave for reconnect');
      // If not connected, queue it to send on reconnect
      this.socket?.once('connect', () => {
        console.log(`[leaveTask] Reconnected, leaving task: ${taskId}`);
        this.socket.emit('leave_task', { task_id: taskId });
      });
    }
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
