import { transcriptionAPI } from '../services/api';

/**
 * Shared download utility to avoid duplication
 * Used by both App.js and TranscriptionHistory.js
 */

/**
 * Download MIDI file and trigger browser download
 * @param {string} midiFilename - MIDI filename from backend
 * @param {string} fileName - Original audio filename for output name
 * @param {string} accessToken - JWT access token
 * @returns {Promise<void>}
 */
export const downloadMidiFile = async (midiFilename, fileName, accessToken) => {
  if (!midiFilename || !accessToken) {
    throw new Error('Missing required download parameters');
  }

  try {
    const blob = await transcriptionAPI.downloadMidi(midiFilename, accessToken);
    
    // Create blob URL and trigger download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Remove extension from original filename and add .mid
    const baseFileName = fileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseFileName}.mid`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
