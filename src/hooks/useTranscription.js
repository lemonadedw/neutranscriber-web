import { useState, useCallback } from 'react';
import { transcriptionAPI } from '../services/api';

export const useTranscription = () => {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const transcribeAudio = useCallback(async (file) => {
    setIsTranscribing(true);
    setError(null);
    setResult(null);
    setProgress('Uploading file...');

    try {
      // Start transcription
      const { task_id } = await transcriptionAPI.uploadAndTranscribe(file);
      setProgress('Transcribing audio...');

      // Poll for status
      const pollStatus = async () => {
        try {
          const status = await transcriptionAPI.getTranscriptionStatus(task_id);
          
          if (status.state === 'PENDING') {
            setProgress('Processing...');
            setTimeout(pollStatus, 2000); // Poll every 2 seconds
          } else if (status.state === 'SUCCESS') {
            setResult(status.result);
            setProgress('Transcription complete!');
            setIsTranscribing(false);
          } else if (status.state === 'FAILURE') {
            setError(status.status);
            setIsTranscribing(false);
          }
        } catch (err) {
          setError('Failed to check transcription status');
          setIsTranscribing(false);
        }
      };

      pollStatus();
    } catch (err) {
      setError('Failed to upload file');
      setIsTranscribing(false);
    }
  }, []);

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