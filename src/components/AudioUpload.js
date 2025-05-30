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
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-600">Upload Solo Piano Audio for Transcription</h2>

      <div
        className={`relative inline-block cursor-pointer w-full transition-all duration-300 ${
          isDragOver ? 'scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".mp3,audio/mpeg,audio/mp3"
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute opacity-0 w-full h-full cursor-pointer"
        />
        <div className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none py-4 px-8 rounded-xl text-base font-medium cursor-pointer transition-all duration-300 w-full flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40 active:transform active:translate-y-0 ${
          disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed transform-none shadow-none' : ''
        } ${
          isDragOver ? 'bg-gradient-to-r from-green-400 to-green-600 transform scale-105 border-2 border-dashed border-green-400' : ''
        }`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
          {selectedFile ? 'Change File' : 'Choose MP3 File or Drag & Drop'}
        </div>
      </div>
      
      {selectedFile && (
        <div className="mt-6 p-5 bg-green-50 border border-green-200 rounded-xl animate-scale-in">
          <p className="mb-4 font-medium text-gray-800">✅ Selected: {selectedFile.name}</p>
          <p className="mb-4 font-medium text-gray-800">📁 Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <audio controls src={URL.createObjectURL(selectedFile)} className="w-full rounded-lg outline-none" />
        </div>
      )}
    </div>
  );
};

export default AudioUpload;