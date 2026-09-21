import { useEffect, useRef, useState } from 'react'
import logo from '../assets/brand/all4sport-logo.svg'
import Icon from './Icon.jsx'

const navigationItems = [
  {
    id: 'sports',
    label: 'Tous les sports',
    columns: [
      { title: 'Sports collectifs', links: ['Football', 'Basketball', 'Rugby', 'Handball'] },
      { title: 'Fitness', links: ['Musculation', 'Cardio training', 'Yoga', 'Cross training'] },
      { title: 'Plein air', links: ['Randonnée', 'Running', 'Cyclisme', 'Camping'] },
      { title: 'Sports de raquette', links: ['Tennis', 'Padel', 'Badminton', 'Tennis de table'] },
    ],
  },
  {
    id: 'homme',
    label: 'Homme',
    columns: [
      { title: 'Chaussures', links: ['Running', 'Randonnée', 'Football', 'Fitness'] },
      { title: 'Vêtements', links: ['T-shirts', 'Shorts', 'Pantalons', 'Vestes'] },
      { title: 'Accessoires', links: ['Sacs à dos', 'Casquettes', 'Lunettes', 'Montres'] },
      { title: 'Sportswear', links: ['Baskets', 'Sweats', 'Joggings', 'Nouveautés'] },
    ],
  },
  {
    id: 'femme',
    label: 'Femme',
    columns: [
      { title: 'Chaussures', links: ['Running', 'Randonnée', 'Fitness', 'Sportswear'] },
      { title: 'Vêtements', links: ['Brassières', 'Leggings', 'Shorts', 'Vestes'] },
      { title: 'Accessoires', links: ['Sacs', 'Casquettes', 'Lunettes', 'Montres'] },
      { title: 'Collections', links: ['Yoga', 'Running', 'Randonnée', 'Nouveautés'] },
    ],
  },
  {
    id: 'enfant',
    label: 'Enfant',
    columns: [
      { title: 'Chaussures', links: ['Baskets', 'Football', 'Running', 'Randonnée'] },
      { title: 'Vêtements', links: ['Fille', 'Garçon', 'Bébé', 'Sportswear'] },
      { title: 'Sports', links: ['Football', 'Natation', 'Cyclisme', 'Gymnastique'] },
      { title: 'Accessoires', links: ['Sacs', 'Casques', 'Protections', 'Gourdes'] },
    ],
  },
]

function getCategoryUrl(universe, category) {
  const parameters = new URLSearchParams({ univers: universe })

  if (category) {
    parameters.set('categorie', category)
  }

  return `/react?${parameters.toString()}`
}

export default function Header() {
  const [searchNotice, setSearchNotice] = useState('')
  const [openMenuId, setOpenMenuId] = useState(null)
  const navigationRef = useRef(null)
  const activeTriggerRef = useRef(null)
  const openMenu = navigationItems.find(({ id }) => id === openMenuId)

  useEffect(() => {
    if (!openMenuId) return undefined

    function closeOnOutsideClick(event) {
      if (!navigationRef.current?.contains(event.target)) {
        setOpenMenuId(null)
      }
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setOpenMenuId(null)
        activeTriggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openMenuId])

  function toggleMenu(event, menuId) {
    activeTriggerRef.current = event.currentTarget
    setOpenMenuId((currentMenuId) => currentMenuId === menuId ? null : menuId)
  }

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

      <div className="header-navigation" ref={navigationRef}>
        <nav className="header-nav site-container" aria-label="Navigation principale">
          {navigationItems.map(({ id, label }) => {
            const isOpen = openMenuId === id

            return (
              <button
                className={isOpen ? 'header-nav-trigger header-nav-trigger--active' : 'header-nav-trigger'}
                key={id}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`mega-menu-${id}`}
                onClick={(event) => toggleMenu(event, id)}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {openMenu && (
          <section className="mega-menu" id={`mega-menu-${openMenu.id}`} aria-label={`Menu ${openMenu.label}`}>
            <div className="mega-menu-inner site-container">
              <div className="mega-menu-heading">
                <h2>{openMenu.label}</h2>
                <div className="mega-menu-actions">
                  <a href={getCategoryUrl(openMenu.id)}>Voir toute la sélection</a>
                  <button type="button" onClick={() => setOpenMenuId(null)} aria-label={`Fermer le menu ${openMenu.label}`}>
                    ×
                  </button>
                </div>
              </div>

              <div className="mega-menu-grid">
                {openMenu.columns.map(({ title, links }) => (
                  <section className="mega-menu-column" key={title}>
                    <h3>
                      <a href={getCategoryUrl(openMenu.id, title)}>{title}</a>
                    </h3>
                    <ul>
                      {links.map((link) => (
                        <li key={link}>
                          <a href={getCategoryUrl(openMenu.id, link)}>{link}</a>
                        </li>
                      ))}
                    </ul>
                    <a className="mega-menu-see-all" href={getCategoryUrl(openMenu.id, title)}>
                      Voir tout <span aria-hidden="true">›</span>
                    </a>
                  </section>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </header>
  )
}
