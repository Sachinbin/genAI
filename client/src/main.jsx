import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppRouter from './router/AppRouter.jsx'
import {  AuthProvider } from './contexts/authContext.jsx'
import { QueryClientProvider} from '@tanstack/react-query'
import { queryClient } from './lib/queryClient.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppRouter>
       <App />
      </AppRouter>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
