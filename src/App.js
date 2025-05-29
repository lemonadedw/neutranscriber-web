import React, { useState, useEffect } from 'react';
import AudioUpload from './components/AudioUpload';
import TranscriptionHistory from './components/TranscriptionHistory';
import { useTranscription } from './hooks/useTranscription';
import { useHistory } from './contexts/HistoryContext';
import { transcriptionAPI } from './services/api';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { transcribeAudio, resetTranscription, isTranscribing, progress, result, error } = useTranscription();
  const { addTranscription } = useHistory();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleStartTranscription = () => {
    if (selectedFile) {
      transcribeAudio(selectedFile);
    }
  };

  const handleDownload = () => {
    if (result && result.midi_filename) {
      const downloadUrl = transcriptionAPI.downloadMidi(result.midi_filename);
      window.open(downloadUrl, '_blank');
    }
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    resetTranscription();
  };

  // Add successful transcription to history
  useEffect(() => {
    if (result && result.status === 'SUCCESS' && selectedFile) {
      addTranscription({
        ...result,
        fileName: selectedFile.name,
        fileSize: selectedFile.size
      });
    }
  }, [result, selectedFile, addTranscription]);

  return (
    <div className="App">
      <TranscriptionHistory />
      
      <div className="App-header">
        <h1>🎵 NeuTranscriptor</h1>

        <AudioUpload
          onFileSelect={handleFileSelect}
          disabled={isTranscribing}
        />

        {selectedFile && !isTranscribing && !result && (
          <div className="transcription-controls scale-in">
            <button
              onClick={handleStartTranscription}
              className="transcribe-btn"
            >
              Start Transcription
            </button>
          </div>
        )}

        {isTranscribing && (
          <div className="progress fade-in">
            <p>{progress}</p>
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error fade-in">
            <p>❌ {error}</p>
            <button
              onClick={handleStartOver}
              style={{
                background: 'none',
                border: '1px solid #e53e3e',
                color: '#e53e3e',
                padding: '8px 16px',
                borderRadius: '8px',
                marginTop: '12px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {result && result.status === 'SUCCESS' && (
          <div className="result scale-in">
            <h3>🎉 Transcription Complete!</h3>
            <p>⏱️ Processing time: {result.transcription_time} seconds</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleDownload} className="download-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
                Download MIDI
              </button>
              <button
                onClick={handleStartOver}
                style={{
                  background: 'linear-gradient(135deg, #718096, #4a5568)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                New Transcription
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;