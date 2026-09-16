import { useState } from 'react'
import logo from '../assets/brand/all4sport-logo.svg'
import Icon from './Icon.jsx'

export default function Header() {
  const [searchNotice, setSearchNotice] = useState('')

  function handleSearch(event) {
    event.preventDefault()
    setSearchNotice('La recherche de produits sera bientôt disponible.')
  }

  return (
    <header className="site-header" id="haut-de-page" tabIndex={-1}>
      <div className="header-main site-container">
        <a className="header-logo" href="/react" aria-label="All4Sport — Accueil">
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
              onChange={() => setSearchNotice('')}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearchNotice('')
              }}
            />
          </form>
          <p className="search-notice" role="status">{searchNotice}</p>
        </div>

        <div className="header-actions">
          <a className="header-action" href="/login" aria-label="Mon compte">
            <Icon name="user-round" />
            <span>Mon compte</span>
          </a>
          <button className="header-action" type="button" disabled aria-label="Panier" title="Panier bientôt disponible">
            <Icon name="shopping-bag" />
            <span>Panier</span>
          </button>
        </div>
      </div>

      <nav className="header-nav site-container" aria-label="Navigation principale">
        {['Tous les sports', 'Homme', 'Femme'].map((label) => (
          <button key={label} type="button" disabled title={`${label} — page à venir`}>
            {label}
          </button>
        ))}
      </nav>
    </header>
  )
}
