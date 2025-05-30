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
    <div className="space-y-6">
      {/* Upload Section Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          Upload Your Piano Audio
        </h2>
        <p className="text-slate-600 text-lg">
          Drop your MP3 file here or click to browse
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative group transition-all duration-300 ${
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        <div className={`
          relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-emerald-400 bg-emerald-50 scale-105' 
            : selectedFile 
              ? 'border-blue-300 bg-blue-50' 
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
        `}>
          {/* Upload Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${
            isDragOver 
              ? 'bg-emerald-100 text-emerald-600' 
              : selectedFile 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600'
          }`}>
            {selectedFile ? (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            ) : (
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {/* Upload Text */}
          <div className="space-y-2">
            <h3 className={`text-xl font-bold transition-colors duration-300 ${
              isDragOver 
                ? 'text-emerald-700' 
                : selectedFile 
                  ? 'text-blue-700' 
                  : 'text-slate-700'
            }`}>
              {selectedFile ? 'File Selected!' : isDragOver ? 'Drop your file here' : 'Choose Audio File'}
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              isDragOver 
                ? 'text-emerald-600' 
                : selectedFile 
                  ? 'text-blue-600' 
                  : 'text-slate-500'
            }`}>
              {selectedFile ? 'Click to change file' : 'Supports MP3 format • Max 50MB'}
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-60"></div>
          <div className="absolute top-6 right-6 w-2 h-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-40"></div>
          <div className="absolute bottom-4 left-6 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-50"></div>
        </div>
      </div>
      
      {/* File Details */}
      {selectedFile && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              
              <div className="flex-grow min-w-0">
                <h4 className="text-lg font-semibold text-slate-800 mb-1 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                {/* Audio Preview */}
                <div className="bg-white rounded-xl p-4 border border-blue-100">
                  <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                  <audio 
                    controls 
                    src={URL.createObjectURL(selectedFile)} 
                    className="w-full h-10 rounded-lg"
                    preload="metadata"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUpload;