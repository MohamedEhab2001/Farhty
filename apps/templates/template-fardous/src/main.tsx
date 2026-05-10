import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TemplateProvider } from '@farhty/template-sdk'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TemplateProvider>
      <App />
    </TemplateProvider>
  </StrictMode>,
)
