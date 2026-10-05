import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './components/HomePage.jsx'
import CatalogPage from './components/CatalogPage.jsx'
import SportsPage from './components/SportsPage.jsx'
import ProductDetailPage from './components/ProductDetailPage.jsx'
import CartPage from './components/CartPage.jsx'
import './App.css'

export default function App() {
  const path = window.location.pathname
  const productMatch = path.match(/^\/produit\/(\d+)\/?$/)
  const page = path === '/sports'
    ? <SportsPage />
    : path === '/catalogue'
      ? <CatalogPage />
      : path === '/panier'
        ? <CartPage />
        : productMatch
          ? <ProductDetailPage productId={productMatch[1]} />
          : <HomePage />

  return (
    <div className="store-layout">
      <Header />
      <main className="store-content" aria-label="Contenu principal">
        {page}
      </main>
      <Footer />
    </div>
  )
}
