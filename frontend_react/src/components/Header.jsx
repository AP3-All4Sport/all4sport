import logo from '../assets/brand/all4sport-logo-dark.svg'
import Icon from './Icon.jsx'

const navigationItems = [
  { id: 'sports', label: 'Tous les sports', href: '/sports' },
  { id: 'homme', label: 'Homme', href: '/catalogue?univers=homme' },
  { id: 'femme', label: 'Femme', href: '/catalogue?univers=femme' },
  { id: 'enfant', label: 'Enfant', href: '/catalogue?univers=enfant' },
]

export default function Header() {
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
          <button className="header-action" type="button" disabled aria-label="Panier" title="Panier bientôt disponible">
            <Icon name="shopping-bag" />
            <span>Panier</span>
          </button>
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
