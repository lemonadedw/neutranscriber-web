import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const HistoryContext = createContext();

const historyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSCRIPTION':
      const newHistory = [action.payload, ...state];
      localStorage.setItem('transcriptionHistory', JSON.stringify(newHistory));
      return newHistory;
    
    case 'LOAD_HISTORY':
      return action.payload;
    
    case 'CLEAR_HISTORY':
      localStorage.removeItem('transcriptionHistory');
      return [];
    
    case 'REMOVE_TRANSCRIPTION':
      const filteredHistory = state.filter(item => item.id !== action.payload);
      localStorage.setItem('transcriptionHistory', JSON.stringify(filteredHistory));
      return filteredHistory;
    
    default:
      return state;
  }
};

export const HistoryProvider = ({ children }) => {
  const [history, dispatch] = useReducer(historyReducer, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('transcriptionHistory');
    if (savedHistory) {
      dispatch({ type: 'LOAD_HISTORY', payload: JSON.parse(savedHistory) });
    }
  }, []);

  const addTranscription = useCallback((transcription) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      fileName: transcription.fileName,
      fileSize: transcription.fileSize,
      processingTime: transcription.transcription_time,
      midiFilename: transcription.midi_filename,
      status: transcription.status
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