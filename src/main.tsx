import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { StoreProvider } from './lib/StoreContext'
import { TimerProvider } from './lib/TimerContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StoreProvider>
      <TimerProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </TimerProvider>
    </StoreProvider>
  </React.StrictMode>,
)
