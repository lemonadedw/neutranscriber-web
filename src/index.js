import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HistoryProvider } from './contexts/HistoryContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

// Initialize WebSocket connection immediately
import { websocketService } from './services/websocket';
console.log('Initializing WebSocket from index.js');
websocketService.connect();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);