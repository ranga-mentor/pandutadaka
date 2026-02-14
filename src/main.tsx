import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { setupGoogleAnalytics } from './analytics'

setupGoogleAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID)

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
