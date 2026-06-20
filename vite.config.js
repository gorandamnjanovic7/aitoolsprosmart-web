// POČETAK FAJLA: vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// POČETAK FUNKCIJE: Vite Konfiguracija
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,

    // Firebase Google Auth popup fix
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    }
  }
});
// KRAJ FUNKCIJE: Vite Konfiguracija
// KRAJ FAJLA: vite.config.js