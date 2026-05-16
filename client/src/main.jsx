import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CrashBoard from '../../crashboard-sdk/src/index.js'

CrashBoard.init({
  apiKey:     'cb_live_your_actual_api_key_here',  // from your project
  project:    'vertex-bank',
  env:        'development',
  ingestUrl:  'http://localhost:5000/api/ingest',
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)