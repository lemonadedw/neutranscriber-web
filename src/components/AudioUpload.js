import React, { useState } from 'react';

const AudioUpload = ({ onFileSelect, disabled }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.toLowerCase().endsWith('.mp3'))) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please select an MP3 file');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Audio for Piano Transcription</h2>
      
      <div 
        className={`file-input-wrapper ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".mp3,audio/mpeg,audio/mp3"
          onChange={handleFileChange}
          disabled={disabled}
          className="file-input"
        />
        <div className="file-input-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          {selectedFile ? 'Change File' : 'Choose MP3 File or Drag & Drop'}
        </div>
      </div>
      
      {selectedFile && (
        <div className="file-info fade-in">
          <p>✅ Selected: {selectedFile.name}</p>
          <p>📁 Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <audio controls src={URL.createObjectURL(selectedFile)} />
        </div>
      )}
    </div>
  );
};

export default AudioUpload;