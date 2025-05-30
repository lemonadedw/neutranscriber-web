import React, { useState, useEffect } from 'react';
import AudioUpload from './components/AudioUpload';
import TranscriptionHistory from './components/TranscriptionHistory';
import { useTranscription } from './hooks/useTranscription';
import { useHistory } from './contexts/HistoryContext';
import { transcriptionAPI } from './services/api';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { transcribeAudio, resetTranscription, isTranscribing, progress, result, error } = useTranscription();
  const { addTranscription } = useHistory();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Reset any previous transcription state when a new file is selected
    resetTranscription();
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      <div className="absolute inset-0 opacity-30">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgb(99 102 241)" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <TranscriptionHistory />

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-800 mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Neu
              </span>
              <span className="text-slate-700">Transcriber</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 font-medium">
              Transform your piano recordings into MIDI files
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <div className="h-1 w-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-60"></div>
              <div className="h-1 w-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-30"></div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 lg:p-12 mx-auto max-w-3xl">
            <AudioUpload
              onFileSelect={handleFileSelect}
              disabled={isTranscribing}
            />

            {/* Transcribe Button */}
            {selectedFile && !isTranscribing && !error && !result && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                <button
                  onClick={handleStartTranscription}
                  className="group relative w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/25 active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span>Start Transcription</span>
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  </div>
                </button>
              </div>
            )}

            {/* Loading State */}
            {isTranscribing && (
              <div className="mt-8 text-center animate-in fade-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 relative">
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Processing Your Audio</h3>
                <p className="text-lg text-slate-600 mb-4">{progress}</p>
                <div className="flex justify-center">
                  <div className="h-2 w-64 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Transcription Failed</h3>
                  <p className="text-red-700 mb-6">{error}</p>
                  {selectedFile && (
                    <button
                      onClick={() => resetTranscription()}
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Success State */}
            {result && result.status === 'SUCCESS' && (
              <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl p-8 text-center relative overflow-hidden">
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
                    
                    <h3 className="text-3xl font-bold text-emerald-800 mb-2">🎉 Transcription Complete!</h3>
                    <p className="text-lg text-emerald-700 mb-8">
                      ⚡ Processed in {result.transcription_time} seconds
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleDownload}
                        className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 relative overflow-hidden"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download MIDI</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                      </button>
                      
                      <button
                        onClick={handleStartOver}
                        className="inline-flex items-center justify-center gap-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
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
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-500">
            <p className="text-sm">Created by Henry B. W.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;