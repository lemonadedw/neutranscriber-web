import React, { useState, useCallback } from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { formatDate, formatFileSize, removeFileExtension } from '../utils/helpers';

const TranscriptionHistory = () => {
  const { history, clearHistory, removeTranscription } = useHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDownload = useCallback((midiFilename, fileName, serverUrl) => {
    if (midiFilename && serverUrl) {
      // Use the original server URL, not the current one
      const downloadUrl = `${serverUrl}/api/download_midi/${midiFilename}`;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${removeFileExtension(fileName)}.mid`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all transcription history?')) {
      clearHistory();
    }
  }, [clearHistory]);

  const handleRemoveItem = useCallback((id, fileName) => {
    if (window.confirm(`Remove "${fileName}" from history?`)) {
      removeTranscription(id);
    }
  }, [removeTranscription]);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  return (
    <>
      {/* History Toggle Button */}
      <div className="fixed top-3 right-3 lg:top-5 lg:right-5 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none py-2 px-3 lg:py-3 lg:px-4 rounded-xl text-xs lg:text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1.5 lg:gap-2 shadow-lg shadow-indigo-500/30 backdrop-blur-sm border border-white/20 dark:border-indigo-500/30 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/40 active:transform active:translate-y-0"
          title="View transcription history"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="lg:w-5 lg:h-5">
            <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
          </svg>
          <span className="hidden sm:inline lg:inline">History</span>
          <span className="bg-white/20 text-white py-0.5 px-1.5 rounded-lg text-xs font-semibold">
            {history.length}
          </span>
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-100 animate-fade-in" onClick={closeSidebar}>
          <div className="absolute top-0 right-0 w-full sm:w-[420px] lg:w-[480px] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-white/30 dark:border-slate-700/30 shadow-2xl flex flex-col animate-slide-in-from-right transition-colors duration-300" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 lg:p-6 border-b border-white/30 dark:border-slate-700/30 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 transition-colors duration-300">
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-500 dark:text-indigo-400 sm:w-6 sm:h-6 transition-colors duration-300">
                  <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
                </svg>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 m-0 transition-colors duration-300">Transcription History</h3>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-0.5 px-2 sm:py-1 sm:px-2.5 rounded-lg sm:rounded-xl text-xs font-semibold">
                  {history.length}
                </span>
              </div>
              <div className="flex gap-1.5 sm:gap-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="p-1.5 sm:p-2 border-none rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 hover:scale-110"
                    title="Clear all history"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={closeSidebar}
                  className="p-1.5 sm:p-2 border-none rounded-md sm:rounded-lg cursor-pointer transition-all duration-300 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110 transition-colors duration-300"
                  title="Close sidebar"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-white/10 dark:scrollbar-track-slate-800/50 transition-colors duration-300">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 text-center text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-70">📝</div>
                  <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">No transcriptions yet</p>
                  <span className="text-xs sm:text-sm opacity-80">Your completed transcriptions will appear here</span>
                </div>
              ) : (
                <div className="py-2 sm:py-3">
                  {history.map((item, index) => (
                    <div
                      key={item.id}
                      className="mx-2 sm:mx-3 mb-1.5 sm:mb-2 bg-white/70 dark:bg-slate-800/70 rounded-lg sm:rounded-xl border border-white/30 dark:border-slate-700/30 transition-all duration-300 animate-slide-in-from-right hover:bg-white/90 dark:hover:bg-slate-800/90 hover:transform hover:-translate-x-1 hover:shadow-lg transition-colors duration-300"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="text-lg sm:text-xl mt-0.5"><svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 m-0 mb-1 sm:mb-2 whitespace-nowrap overflow-hidden text-ellipsis transition-colors duration-300" title={item.fileName}>
                              {item.fileName}
                            </h4>
                            <div className="flex flex-col gap-0.5 sm:gap-1">
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 sm:w-3 sm:h-3">
                                  <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
                                </svg>
                                {formatDate(item.timestamp)}
                              </span>
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 sm:w-3 sm:h-3">
                                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z" />
                                </svg>
                                {formatFileSize(item.fileSize)}
                              </span>
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 sm:w-3 sm:h-3">
                                  <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                </svg>
                                {item.processingTime}s
                              </span>
                              {/* Add server information */}
                              <span className="flex items-center gap-1 sm:gap-1.5 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="opacity-60 sm:w-3 sm:h-3">
                                  <path d="M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17Z" />
                                </svg>
                                {item.serverName || 'Unknown Server'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 justify-end">
                          <button
                            onClick={() => handleDownload(item.midiFilename, item.fileName, item.serverUrl)}
                            className="p-1.5 sm:p-2 border-none rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/40"
                            title="Download MIDI file"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="sm:w-4 sm:h-4">
                              <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.fileName)}
                            className="p-1.5 sm:p-2 border-none rounded-md cursor-pointer transition-all duration-300 flex items-center justify-center bg-red-50 dark:bg-red-900/40 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 hover:transform hover:-translate-y-1"
                            title="Remove from history"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3.5 sm:h-3.5">
                              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TranscriptionHistory;