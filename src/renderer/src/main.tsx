import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './ui/global.css'
import './ui/keyboard.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Remove Preload scripts loading
postMessage({ payload: 'removeLoading' }, '*')
