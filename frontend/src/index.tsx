// 🚀 Main Entry Point
// This is where our React app starts

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 🚀 Create the root element and render our app
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 📝 How this works:
// 1. ReactDOM.createRoot creates a root container
// 2. We render our App component inside it
// 3. StrictMode helps catch potential problems
// 4. The app starts here and renders everything else
