/**
 * Shared utility functions for formatting and common operations
 */

/**
 * Format timestamp to readable date string
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted date (e.g., "Jan 15, 02:30 PM")
 */
export const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format bytes to human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
};

/**
 * Remove file extension from filename
 * @param {string} filename - Original filename
 * @returns {string} Filename without extension
 */
export const removeFileExtension = (filename) => {
  return filename.replace(/\.[^/.]+$/, '');
};

/**
 * Format processing time with unit
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time (e.g., "2.5s" or "1.2s")
 */
export const formatProcessingTime = (seconds) => {
  return `${seconds}s`;
};
