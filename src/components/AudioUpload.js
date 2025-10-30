import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SUPPORTED_AUDIO_TYPES, SUPPORTED_AUDIO_EXTENSIONS, MAX_FILE_SIZE } from '../utils/constants';

/**
 * AudioUpload Component
 * 
 * - Handles audio file upload with JWT authentication
 * - Shows user info and logout button
 * - Sends JWT token in Authorization header
 * - Validates files before upload
 */
const AudioUpload = ({ onFileSelect, disabled, selectedFile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Reset file input when selectedFile becomes null
  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFile]);

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

  /**
   * Handle logout
   * Clears auth context and redirects to login
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine upload zone styling based on state
  const getUploadZoneState = () => {
    if (disabled) return { zoneClass: 'upload-zone-disabled', iconClass: 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500' };
    if (isDragOver) return { zoneClass: 'upload-zone-dragging', iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800/30 dark:text-emerald-400' };
    if (selectedFile) return { zoneClass: 'upload-zone-active', iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-800/30 dark:text-blue-400' };
    return { zoneClass: 'upload-zone border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 cursor-pointer hover:shadow-lg dark:hover:shadow-slate-900/20', iconClass: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-800/30 dark:group-hover:text-blue-400' };
  };

  const uploadState = getUploadZoneState();

  return (
    <div className="space-y-6">
      {/* User Info Header */}
      {user && (
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            {user.picture_url ? (
              <img
                src={user.picture_url}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-blue-300 dark:border-blue-600"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
            )}

            {/* User Details */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Welcome back!
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 
                       border border-slate-300 dark:border-slate-600 rounded-lg
                       hover:bg-slate-50 dark:hover:bg-slate-700
                       transition-colors duration-200 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      )}

      {/* Upload Section Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl header-primary mb-3">
          Upload Your Piano Audio
        </h2>
        <p className="text-secondary text-lg">
          Drop your audio file here or click to browse
        </p>
      </div>
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

        <div className={uploadState.zoneClass}>
          {/* Upload Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300 ${uploadState.iconClass}`}>
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
            <h3 className="text-xl font-bold transition-colors duration-300 text-slate-700 dark:text-slate-200">
              {selectedFile ? 'File Selected!' : isDragOver ? 'Drop your file here' : 'Choose Audio File'}
            </h3>
            <p className="text-sm transition-colors duration-300 text-slate-500 dark:text-slate-400">
              {selectedFile ? 'Click to change file' : `Supports ${SUPPORTED_AUDIO_EXTENSIONS.join(', ').toUpperCase()} • Max ${MAX_FILE_SIZE / 1024 / 1024}MB`}
            </p>
          </div>
        </div>
      </div>

      {/* File Details */}
      {selectedFile && (
        <div className="animate-slide-up">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {/* Audio Preview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Preview:</p>
                  <audio
                    controls
                    src={URL.createObjectURL(selectedFile)}
                    className="w-full h-10 rounded-lg dark:invert"
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