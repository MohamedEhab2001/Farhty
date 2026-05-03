import React from 'react'
import ReactDOM from 'react-dom/client'
import { TemplateProvider } from '@farhty/template-sdk'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TemplateProvider>
      <App />
    </TemplateProvider>
  </React.StrictMode>
)