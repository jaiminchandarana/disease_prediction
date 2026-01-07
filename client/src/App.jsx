import React from 'react'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import { DNAWavyBackground } from './components/DNAWavyBackground'
import './App.css'

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Full Page DNA Wavy Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <DNAWavyBackground />
      </div>
      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <AppRoutes />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#20b2aa',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App