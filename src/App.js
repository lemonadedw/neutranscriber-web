import React, { useState, useEffect } from 'react';
import AudioUpload from './components/AudioUpload';
import TranscriptionHistory from './components/TranscriptionHistory';
import ServerSelector from './components/ServerSelector';
import ThemeToggle from './components/ThemeToggle';
import { useTranscription } from './hooks/useTranscription';
import { useHistory } from './contexts/HistoryContext';
import { transcriptionAPI, updateApiBaseURL } from './services/api';
import { DEFAULT_SERVERS, SERVER_STATUS } from './utils/constants';

// UI Components
const Header = ({ selectedServer }) => (
  <div className="text-center mb-8 lg:mb-12">
    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 dark:text-slate-100 mb-4 tracking-tight transition-colors duration-300">
      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        Neu
      </span>
      <span className="text-slate-700 dark:text-slate-200 transition-colors duration-300">Transcriber</span>
    </h1>
    <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium transition-colors duration-300">
      Transform your piano recordings into MIDI files
    </p>
    <div className="flex items-center justify-center gap-2 mt-4">
      <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      <div className="h-1 w-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-60"></div>
      <div className="h-1 w-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-30"></div>
    </div>

    {/* Server Status Indicator */}
    <div className="mt-6 flex items-center justify-center gap-2 text-sm">
      <span className="text-slate-600 dark:text-slate-400 transition-colors duration-300">Connected to:</span>
      <div className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30 dark:border-slate-700/30 transition-colors duration-300">
        <div className={`w-2 h-2 rounded-full ${selectedServer.status === SERVER_STATUS.ONLINE
          ? 'bg-green-500 shadow-green-500/50'
          : selectedServer.status === SERVER_STATUS.CHECKING
            ? 'bg-yellow-500 shadow-yellow-500/50 animate-pulse'
            : 'bg-red-500 shadow-red-500/50'
          } shadow-lg`}></div>
        <span className="font-medium text-slate-700 dark:text-slate-200 transition-colors duration-300">{selectedServer.name}</span>
      </div>
    </div>
  </div>
);

const BackgroundPattern = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300"></div>
    <div className="absolute inset-0 opacity-30 dark:opacity-20 transition-opacity duration-300">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgb(99 102 241)" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>
    </div>
  </>
);

const Footer = () => (
  <div className="text-center mt-8 text-slate-500 dark:text-slate-400 transition-colors duration-300">
    <p className="text-sm">Created by Henry B. W.</p>
  </div>
);

// Server warning component
const ServerWarning = () => (
  <div className="mt-6 status-warning">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mb-3 transition-colors duration-300">
      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-1 transition-colors duration-300">Server Unavailable</h3>
    <p className="text-yellow-700 dark:text-yellow-400 text-sm transition-colors duration-300">
      The selected server is not responding. Please choose an online server to start transcription.
    </p>
  </div>
);

// Transcribe button component
const TranscribeButton = ({ onClick }) => (
  <div className="mt-6 animate-slide-up">
    <button
      onClick={onClick}
      className="btn-primary w-full py-4 px-8 text-lg"
    >
      <div className="relative flex items-center justify-center gap-3">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <span>Start Transcription</span>
      </div>
    </button>
  </div>
);

// Loading state component
const LoadingState = ({ progress }) => (
  <div className="mt-6 text-center animate-fade-in">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 relative">
      <div className="absolute inset-2 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center transition-colors duration-300">
        <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 rounded-full animate-spin transition-colors duration-300"></div>
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 transition-colors duration-300">Processing Your Audio</h3>
    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4 transition-colors duration-300">{progress}</p>
    <div className="flex justify-center">
      <div className="h-2 w-64 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Error state component
const ErrorState = ({ error, onReset }) => (
  <div className="mt-6 animate-slide-up">
    <div className="status-error">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full mb-4 transition-colors duration-300">
        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2 transition-colors duration-300">Transcription Failed</h3>
      <p className="text-red-700 dark:text-red-400 mb-6 transition-colors duration-300">{error}</p>
      <button
        onClick={onReset}
        className="btn-danger inline-flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Try Again
      </button>
    </div>
  </div>
);

// Success state component
const SuccessState = ({ result, onDownload, onStartOver }) => (
  <div className="mt-6 animate-slide-up">
    <div className="status-success">
      {/* Success Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="success-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="rgb(16 185 129)" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#success-pattern)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-3xl font-bold text-emerald-800 dark:text-emerald-300 mb-2 transition-colors duration-300">🎉 Transcription Complete!</h3>
        <p className="text-lg text-emerald-700 dark:text-emerald-400 mb-8 transition-colors duration-300">
          ⚡ Processed in {result.transcription_time} seconds
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onDownload}
            className="btn-secondary group py-4 px-8 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download MIDI</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>

          <button
            onClick={onStartOver}
            className="btn-tertiary py-4 px-8 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Transcription</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedServer, setSelectedServer] = useState(DEFAULT_SERVERS[0]); // Default to first server

  const { transcribeAudio, resetTranscription, isTranscribing, progress, result, error } = useTranscription();
  const { addTranscription } = useHistory();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    resetTranscription();
  };

  const handleServerSelect = (server) => {
    setSelectedServer(server);
    resetTranscription();
  };

  const handleStartTranscription = () => {
    if (selectedFile && selectedServer.status === SERVER_STATUS.ONLINE) {
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

  // Initialize API base URL on component mount
  useEffect(() => {
    updateApiBaseURL(selectedServer.url);
  }, [selectedServer.url]);

  // Add successful transcription to history
  useEffect(() => {
    if (result && result.status === 'SUCCESS' && selectedFile) {
      addTranscription({
        ...result,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        serverUrl: selectedServer.url,
        serverName: selectedServer.name
      });
    }
  }, [result, selectedFile, selectedServer, addTranscription]);

  // Determine which state to render
  const renderTranscriptionState = () => {
    if (isTranscribing) {
      return <LoadingState progress={progress} />;
    }

    if (error) {
      return <ErrorState error={error} onReset={resetTranscription} />;
    }

    if (result && result.status === 'SUCCESS') {
      return <SuccessState
        result={result}
        onDownload={handleDownload}
        onStartOver={handleStartOver}
      />;
    }

    if (selectedFile && selectedServer.status !== SERVER_STATUS.ONLINE) {
      return <ServerWarning />;
    }

    if (selectedFile && !isTranscribing && !error && !result && selectedServer.status === SERVER_STATUS.ONLINE) {
      return <TranscribeButton onClick={handleStartTranscription} />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      <BackgroundPattern />
      <ServerSelector
        onServerSelect={handleServerSelect}
        selectedServer={selectedServer}
      />
      <ThemeToggle />
      <TranscriptionHistory />

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          <Header selectedServer={selectedServer} />

          {/* Main Card */}
          <div className="card-primary mx-auto max-w-3xl">
            <AudioUpload
              onFileSelect={handleFileSelect}
              disabled={isTranscribing}
              selectedFile={selectedFile}
            />

            {renderTranscriptionState()}
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;