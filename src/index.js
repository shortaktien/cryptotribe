import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Erstellen Sie den Root-Container
const container = document.getElementById('root');

// Verwenden Sie createRoot anstelle von ReactDOM.render
const root = ReactDOM.createRoot(container);

// Rendern Sie die App-Komponente
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Wenn Sie den Leistungsbericht benötigen, können Sie reportWebVitals verwenden
reportWebVitals();
