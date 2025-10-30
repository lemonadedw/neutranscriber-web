import { useState, useCallback, useEffect, useRef } from 'react';
import { transcriptionAPI } from '../services/api';
import { websocketService } from '../services/websocket';
import { STATUS_MESSAGES } from '../utils/constants';

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const currentTaskIdRef = useRef(null);
  const transcriptionIdRef = useRef(null);
  const processedEventsRef = useRef(new Set()); // De-duplicate events from multiple workers

  useEffect(() => {
    // Connect to WebSocket on mount
    websocketService.connect();

    // Set up listener for transcription updates
    const cleanup = websocketService.onTranscriptionUpdate((data) => {
      const { task_id, state, data: payload } = data;

      // Only process updates for the current task
      if (task_id !== currentTaskIdRef.current) {
        return;
      }

      // De-duplicate: Create unique event ID and check if already processed
      // This prevents duplicate processing when multiple Gunicorn workers emit the same event
      const payloadKey = payload.status || payload.midi_filename || payload.error || '';
      const eventId = `${task_id}-${state}-${payloadKey}`;
      
      if (processedEventsRef.current.has(eventId)) {
        return;
      }
      processedEventsRef.current.add(eventId);

      switch (state) {
        case 'PROCESSING':
          setProgress(payload.status || STATUS_MESSAGES.PROCESSING);
          break;

        case 'SUCCESS':
          setResult({
            ...payload,
            transcription_id: transcriptionIdRef.current
          });
          setProgress(STATUS_MESSAGES.COMPLETE);
          setIsTranscribing(false);
          currentTaskIdRef.current = null;
          break;

        case 'FAILURE':
          setError(payload.error || STATUS_MESSAGES.FAILURE);
          setIsTranscribing(false);
          currentTaskIdRef.current = null;
          break;

        default:
          break;
      }
    });

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  const transcribeAudio = useCallback(async (file) => {
    setIsTranscribing(true);
    setError(null);
    setResult(null);
    setProgress(STATUS_MESSAGES.UPLOADING);
    processedEventsRef.current.clear(); // Clear processed events for new task

    try {
      const { task_id, transcription_id } = await transcriptionAPI.uploadAndTranscribe(file);
      currentTaskIdRef.current = task_id;
      transcriptionIdRef.current = transcription_id;
      
      // Join the task-specific room to ensure this client only receives updates for this task
      websocketService.joinTask(task_id);
      
      setProgress(STATUS_MESSAGES.TRANSCRIBING);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to upload file');
      setIsTranscribing(false);
      currentTaskIdRef.current = null;
    }
  }, []);

  const resetTranscription = useCallback(() => {
    // Leave the task room to clean up
    if (currentTaskIdRef.current) {
      websocketService.leaveTask(currentTaskIdRef.current);
    }
    
    setIsTranscribing(false);
    setProgress('');
    setResult(null);
    setError(null);
    currentTaskIdRef.current = null;
    transcriptionIdRef.current = null;
    processedEventsRef.current.clear(); // Clear processed events on reset
  }, []);

  return {
    transcribeAudio,
    resetTranscription,
    isTranscribing,
    progress,
    result,
    error
  };
};