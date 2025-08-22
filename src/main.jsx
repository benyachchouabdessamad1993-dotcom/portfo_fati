import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { setDefaultFavicon } from './utils/faviconUtils'
// Import de sécurité pour éviter les erreurs ReferenceError
import './utils/portfolioSafety'

// Supprimer les avertissements findDOMNode en développement
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes('findDOMNode')) return;
    originalWarn(...args);
  };
}

// Définir le favicon par défaut au démarrage
setDefaultFavicon()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
// Force rebuild avec nouvelle sécurité - v2.0

// Force rebuild Fri Aug 22 22:35:22 +01 2025
