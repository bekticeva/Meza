import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './routes/AppRouter'
import CartProvider from './context/CartCntx.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <AppRouter/>
    </CartProvider>
  </StrictMode>,
)
