import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'transcriptionHistory';

// Storage utility functions
const saveToStorage = (data) => {
  try {
    if (data.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return true;
  } catch (error) {
    console.warn('Failed to update localStorage:', error);
    return false;
  }
};

const loadFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return [];
  }
};

const HistoryContext = createContext();

const historyReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TRANSCRIPTION':
      newState = [action.payload, ...state];
      break;
    case 'LOAD_HISTORY':
      return action.payload;
    case 'CLEAR_HISTORY':
      newState = [];
      break;
    case 'REMOVE_TRANSCRIPTION':
      newState = state.filter(item => item.id !== action.payload);
      break;
    default:
      return state;
  }

  // Update localStorage for all mutations except LOAD_HISTORY
  if (action.type !== 'LOAD_HISTORY') {
    saveToStorage(newState);
  }

  return newState;
};

export const HistoryProvider = ({ children }) => {
  const [history, dispatch] = useReducer(historyReducer, []);

  useEffect(() => {
    const savedHistory = loadFromStorage();
    dispatch({ type: 'LOAD_HISTORY', payload: savedHistory });
  }, []);

  const addTranscription = useCallback((transcription) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fileName: transcription.fileName,
      fileSize: transcription.fileSize,
      processingTime: transcription.transcription_time,
      midiFilename: transcription.midi_filename,
      status: transcription.status,
      serverUrl: transcription.serverUrl,
      serverName: transcription.serverName
    };
    dispatch({ type: 'ADD_TRANSCRIPTION', payload: historyItem });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const removeTranscription = useCallback((id) => {
    dispatch({ type: 'REMOVE_TRANSCRIPTION', payload: id });
  }, []);

  return (
    <HistoryContext.Provider value={{
      history,
      addTranscription,
      clearHistory,
      removeTranscription
    }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};