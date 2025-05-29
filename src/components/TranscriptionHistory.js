import React, { useState } from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { transcriptionAPI } from '../services/api';

const TranscriptionHistory = () => {
  const { history, clearHistory, removeTranscription } = useHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const handleDownload = (midiFilename, fileName) => {
    if (midiFilename) {
      const downloadUrl = transcriptionAPI.downloadMidi(midiFilename);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${fileName.replace('.mp3', '')}.mid`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all transcription history?')) {
      clearHistory();
    }
  };

  const handleRemoveItem = (id, fileName) => {
    if (window.confirm(`Remove "${fileName}" from history?`)) {
      removeTranscription(id);
    }
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* History Toggle Button - Always show */}
      <div className="history-trigger">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="history-trigger-btn"
          title="View transcription history"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
          </svg>
          History ({history.length})
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}>
          <div className="history-sidebar" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" />
                </svg>
                <h3>Transcription History</h3>
                <span className="history-count">{history.length}</span>
              </div>
              <div className="sidebar-actions">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="clear-all-btn"
                    title="Clear all history"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={closeSidebar}
                  className="close-sidebar-btn"
                  title="Close sidebar"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="sidebar-content">
              {history.length === 0 ? (
                <div className="sidebar-empty">
                  <div className="empty-icon">📝</div>
                  <p>No transcriptions yet</p>
                  <span>Your completed transcriptions will appear here</span>
                </div>
              ) : (
                <div className="history-items">
                  {history.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="sidebar-history-item"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="item-content">
                        <div className="item-header">
                          <div className="item-icon">🎵</div>
                          <div className="item-info">
                            <h4 className="item-title" title={item.fileName}>
                              {item.fileName}
                            </h4>
                            <div className="item-meta">
                              <span className="meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" />
                                </svg>
                                {formatDate(item.timestamp)}
                              </span>
                              <span className="meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2Z" />
                                </svg>
                                {formatFileSize(item.fileSize)}
                              </span>
                              <span className="meta-item">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                                </svg>
                                {item.processingTime}s
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button
                            onClick={() => handleDownload(item.midiFilename, item.fileName)}
                            className="sidebar-download-btn"
                            title="Download MIDI file"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRemoveItem(item.id, item.fileName)}
                            className="sidebar-remove-btn"
                            title="Remove from history"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
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