import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext'
import { LoadingProvider } from './context/LoadingContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LoadingProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
