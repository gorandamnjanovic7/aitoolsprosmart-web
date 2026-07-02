import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // OVO JE KLJUČNO DA BI DIZAJN RADIO!
import { HelmetProvider } from 'react-helmet-async' // 🔥 DODATO ZA SEO

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🔥 UMOTAVAMO APP ZA SEO PODRŠKU 🔥 */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)