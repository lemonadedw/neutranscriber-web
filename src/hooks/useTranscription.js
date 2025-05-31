import { useState, useCallback } from 'react';
import { transcriptionAPI } from '../services/api';
import { STATUS_MESSAGES, POLL_INTERVAL } from '../utils/constants';

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const pollStatus = useCallback(async (taskId) => {
    try {
      const status = await transcriptionAPI.getTranscriptionStatus(taskId);

      switch (status.state) {
        case 'PENDING':
          setProgress(STATUS_MESSAGES.PROCESSING);
          setTimeout(() => pollStatus(taskId), POLL_INTERVAL);
          break;
        case 'SUCCESS':
          setResult(status.result);
          setProgress(STATUS_MESSAGES.COMPLETE);
          setIsTranscribing(false);
          break;
        case 'FAILURE':
          setError(status.status || STATUS_MESSAGES.FAILURE);
          setIsTranscribing(false);
          break;
        default:
          setError('Unknown transcription status');
          setIsTranscribing(false);
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