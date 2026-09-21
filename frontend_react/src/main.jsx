import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'

const appRoot = document.getElementById('root')

if (appRoot) {
  createRoot(appRoot).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

const accountHeaderRoot = document.getElementById('account-header-root')

if (accountHeaderRoot) {
  createRoot(accountHeaderRoot).render(
    <StrictMode>
      <Header />
    </StrictMode>,
  )
}

const accountFooterRoot = document.getElementById('account-footer-root')

if (accountFooterRoot) {
  createRoot(accountFooterRoot).render(
    <StrictMode>
      <Footer />
    </StrictMode>,
  )
}
