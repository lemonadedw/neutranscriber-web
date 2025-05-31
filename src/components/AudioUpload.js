import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SUPPORTED_AUDIO_TYPES, SUPPORTED_AUDIO_EXTENSIONS, MAX_FILE_SIZE } from '../utils/constants';

const AudioUpload = ({ onFileSelect, disabled, selectedFile: externalSelectedFile }) => {
  const [internalSelectedFile, setInternalSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const selectedFile = externalSelectedFile || internalSelectedFile;

  // Sync internal state with external selectedFile prop
  useEffect(() => {
    setInternalSelectedFile(externalSelectedFile);
  }, [externalSelectedFile]);

  // Reset file input when selectedFile becomes null
  useEffect(() => {
    if (!externalSelectedFile && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [externalSelectedFile]);

  const validateFile = useCallback((file) => {
    if (!file) return { isValid: false, error: 'No file selected' };

    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }

    const isValidType = SUPPORTED_AUDIO_TYPES.includes(file.type) ||
      SUPPORTED_AUDIO_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      return { isValid: false, error: 'Please select a valid audio file (MP3, WAV, FLAC, OGG, M4A, AIFF, AAC)' };
    }

    return { isValid: true };
  }, []);

  const processFile = useCallback((file) => {
    const { isValid, error } = validateFile(file);

    if (isValid) {
      setInternalSelectedFile(file);
      onFileSelect(file);
    } else {
      alert(error);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [validateFile, onFileSelect]);

  const handleFileChange = useCallback((event) => {
    processFile(event.target.files[0]);
  }, [processFile]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    processFile(event.dataTransfer.files[0]);
  }, [processFile]);

  const getUploadZoneClasses = () => {
    const baseClasses = "relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300";

    if (disabled) return `${baseClasses} opacity-50 cursor-not-allowed`;
    if (isDragOver) return `${baseClasses} border-emerald-400 bg-emerald-50 scale-105`;
    if (selectedFile) return `${baseClasses} border-blue-300 bg-blue-50`;

    return `${baseClasses} border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50 cursor-pointer hover:shadow-lg`;
  };

  const getIconClasses = () => {
    const baseClasses = "inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300";

    if (isDragOver) return `${baseClasses} bg-emerald-100 text-emerald-600`;
    if (selectedFile) return `${baseClasses} bg-blue-100 text-blue-600`;

    return `${baseClasses} bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          Upload Your Piano Audio
        </h2>
        <p className="text-slate-600 text-lg">
          Drop your audio file here or click to browse
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative group transition-all duration-300 ${isDragOver ? 'scale-105' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={`${SUPPORTED_AUDIO_EXTENSIONS.join(',')},${SUPPORTED_AUDIO_TYPES.join(',')}`}
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className={getUploadZoneClasses()}>
          {/* Upload Icon */}
          <div className={getIconClasses()}>
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
            <h3 className="text-xl font-bold transition-colors duration-300 text-slate-700">
              {selectedFile ? 'File Selected!' : isDragOver ? 'Drop your file here' : 'Choose Audio File'}
            </h3>
            <p className="text-sm transition-colors duration-300 text-slate-500">
              {selectedFile ? 'Click to change file' : `Supports ${SUPPORTED_AUDIO_EXTENSIONS.join(', ').toUpperCase()} • Max ${MAX_FILE_SIZE / 1024 / 1024}MB`}
            </p>
          </div>
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