import { useState, useCallback } from 'react';
import { transcriptionAPI } from '../services/api';
import { STATUS_MESSAGES, POLL_INTERVAL } from '../utils/constants';

const STATUS_HANDLERS = {
  PENDING: (setProgress) => {
    setProgress(STATUS_MESSAGES.PROCESSING);
    return true; // Continue polling
  },
  SUCCESS: (setProgress, setResult, setIsTranscribing, status) => {
    setResult(status.result);
    setProgress(STATUS_MESSAGES.COMPLETE);
    setIsTranscribing(false);
    return false; // Stop polling
  },
  FAILURE: (setError, setIsTranscribing, status) => {
    setError(status.status || STATUS_MESSAGES.FAILURE);
    setIsTranscribing(false);
    return false; // Stop polling
  }
};

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const pollStatus = useCallback(async (taskId) => {
    try {
      const status = await transcriptionAPI.getTranscriptionStatus(taskId);
      const handler = STATUS_HANDLERS[status.state] ||
        ((setError, setIsTranscribing) => {
          setError('Unknown transcription status');
          setIsTranscribing(false);
          return false;
        });

      const shouldContinuePolling = handler(
        setProgress,
        setResult,
        setIsTranscribing,
        status,
        setError
      );

      if (shouldContinuePolling) {
        setTimeout(() => pollStatus(taskId), POLL_INTERVAL);
      }
    } catch (err) {
      setError('Failed to check transcription status');
      setIsTranscribing(false);
    }
  }, []);

  const transcribeAudio = useCallback(async (file) => {
    setIsTranscribing(true);
    setError(null);
    setResult(null);
    setProgress(STATUS_MESSAGES.UPLOADING);

    try {
      const { task_id } = await transcriptionAPI.uploadAndTranscribe(file);
      setProgress(STATUS_MESSAGES.TRANSCRIBING);
      pollStatus(task_id);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
      setIsTranscribing(false);
    }
  }, [pollStatus]);

  const resetTranscription = useCallback(() => {
    setIsTranscribing(false);
    setProgress('');
    setResult(null);
    setError(null);
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