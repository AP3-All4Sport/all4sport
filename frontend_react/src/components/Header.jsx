import { useEffect, useState } from 'react'
import logo from '../assets/brand/all4sport-logo-dark.svg'
import Icon from './Icon.jsx'
import { getCartItems } from '../cart.js'

const navigationItems = [
  { id: 'sports', label: 'Tous les sports', href: '/sports' },
  { id: 'homme', label: 'Homme', href: '/catalogue?univers=homme' },
  { id: 'femme', label: 'Femme', href: '/catalogue?univers=femme' },
  { id: 'enfant', label: 'Enfant', href: '/catalogue?univers=enfant' },
]

export default function Header() {
  const [cartCount, setCartCount] = useState(() => getCartItems().reduce((total, item) => total + item.quantity, 0))

  useEffect(() => {
    const updateCartCount = () => setCartCount(getCartItems().reduce((total, item) => total + item.quantity, 0))
    window.addEventListener('all4sport:cart-updated', updateCartCount)
    window.addEventListener('storage', updateCartCount)
    return () => {
      window.removeEventListener('all4sport:cart-updated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('q')?.toString().trim()
    if (query) window.location.assign('/catalogue?q=' + encodeURIComponent(query))
  }

  return (
    <header className="site-header" id="haut-de-page" tabIndex={-1}>
      <div className="header-main site-container">
        <a className="header-logo" href="/" aria-label="All4Sport — Accueil">
          <img src={logo} alt="All4Sport" width="280" height="66" />
        </a>

        <div className="header-search">
          <form className="search-form" role="search" onSubmit={handleSearch}>
            <button type="submit" aria-label="Rechercher">
              <Icon name="search" />
            </button>
            <input
              type="search"
              name="q"
              aria-label="Rechercher un produit, une marque, un sport"
              placeholder="Rechercher un produit, une marque, un sport..."
              required
            />
          </form>
        </div>

        <div className="header-actions">
          <a className="header-action" href="/login" aria-label="Mon compte">
            <Icon name="user-round" />
            <span>Mon compte</span>
          </a>
          <a className="header-action" href="/panier" aria-label={`Panier${cartCount ? `, ${cartCount} article${cartCount > 1 ? 's' : ''}` : ''}`}>
            <Icon name="shopping-bag" />
            <span>Panier{cartCount > 0 ? ` (${cartCount})` : ''}</span>
          </a>
        </div>
      </div>

      <div className="header-navigation">
        <nav className="header-nav site-container" aria-label="Navigation principale">
          {navigationItems.map(({ id, label, href }) => (
            <a className="header-nav-trigger" key={id} href={href}>{label}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}
