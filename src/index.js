import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HistoryProvider } from './contexts/HistoryContext';
import './App.css';

ReactDOM.render(
  <React.StrictMode>
    <HistoryProvider>
      <App />
    </HistoryProvider>
  </React.StrictMode>,
  document.getElementById('root')
);