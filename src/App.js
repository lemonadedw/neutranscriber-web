import React, { useState, useEffect } from 'react';
import AudioUpload from './components/AudioUpload';
import TranscriptionHistory from './components/TranscriptionHistory';
import { useTranscription } from './hooks/useTranscription';
import { useHistory } from './contexts/HistoryContext';
import { transcriptionAPI } from './services/api';
import './App.css'; // All styles are now imported through App.css

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-5 font-inter">
      <TranscriptionHistory />
      
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20 max-w-2xl w-full text-center animate-slide-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-8">
          🎵 NeuTranscriber
        </h1>

        <AudioUpload
          onFileSelect={handleFileSelect}
          disabled={isTranscribing}
        />

        {selectedFile && !isTranscribing && !result && (
          <div className="my-8 animate-scale-in">
            <button
              onClick={handleStartTranscription}
              className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white border-none py-4 px-8 text-lg font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-green-400/30 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-green-400/40 active:transform active:translate-y-0 relative overflow-hidden group"
            >
              <span className="relative z-10">Start Transcription</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </button>
          </div>
        )}

        {isTranscribing && (
          <div className="my-8 text-center animate-fade-in">
            <p className="text-lg font-medium text-gray-600 mb-4">{progress}</p>
            <div className="w-12 h-12 border-3 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="my-8 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <p className="text-red-600 font-medium mb-3">❌ {error}</p>
            <button
              onClick={handleStartOver}
              className="bg-transparent border border-red-500 text-red-500 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-50 cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              Try Again
            </button>
          </div>
        )}

        {result && result.status === 'SUCCESS' && (
          <div className="my-8 p-6 bg-green-50 border border-green-200 rounded-2xl animate-pulse-success">
            <h3 className="text-gray-800 text-2xl font-semibold mb-4">🎉 Transcription Complete!</h3>
            <p className="text-gray-600 mb-6 text-base">⏱️ Processing time: {result.transcription_time} seconds</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleDownload} 
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-none py-3.5 px-7 text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-lg shadow-purple-500/30 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 active:transform active:translate-y-0 inline-flex items-center justify-center gap-2 min-h-[48px] w-full sm:w-auto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                </svg>
                Download MIDI
              </button>
              <button
                onClick={handleStartOver}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white border-none py-3.5 px-7 text-base font-semibold rounded-xl cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 min-h-[48px] w-full sm:w-auto"
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