import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import './style/Layout.css';

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
    // Comenta o elimina las etiquetas <StrictMode> para la prueba del conteo correcto de la grafica de 'productos' de proveedor
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)