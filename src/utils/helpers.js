/**
 * Shared utility functions for formatting and common operations
 */

/**
 * Format timestamp to readable date string (converted to local time)
 * @param {string} timestamp - ISO timestamp string (UTC, from backend)
 * @returns {string} Formatted date in local timezone (e.g., "Jan 15, 02:30 PM")
 */
export const formatDate = (timestamp) => {
  // Ensure the timestamp has timezone info (append Z if not present)
  // Backend sends timestamps without Z, so we must add it to signal UTC
  let isoString = timestamp;
  if (timestamp && !timestamp.includes('Z') && !timestamp.includes('+')) {
    isoString = timestamp + 'Z';  // Append 'Z' to indicate UTC
  }
  
  // Parse the UTC timestamp
  const date = new Date(isoString);
  
  // If parsing failed, return the original timestamp
  if (isNaN(date.getTime())) {
    return timestamp;
  }
  
  // toLocaleString() automatically converts UTC to browser's local timezone
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true  // Ensure 12-hour format with AM/PM
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
