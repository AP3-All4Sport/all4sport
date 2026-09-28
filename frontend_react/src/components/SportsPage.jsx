import { useEffect, useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import './CatalogPage.css'

export default function SportsPage() {
  const [sports, setSports] = useState([])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/catalogue/sports', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Sports indisponibles')
        return response.json()
      })
      .then((data) => {
        setSports(data.sports)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })
    return () => controller.abort()
  }, [])

  const selection = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    return normalizedQuery ? sports.filter((sport) => sport.name.toLocaleLowerCase('fr').includes(normalizedQuery)) : sports
  }, [query, sports])

  return (
    <div className="sports-page site-container">
      <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">›</span><span>Tous les sports</span></nav>
      <div className="sports-heading">
        <h1>Tous les sports</h1>
        <p>Trouvez votre sport et découvrez tout l’équipement qu’il vous faut.</p>
      </div>
      <label className="sports-search">
        <Icon name="search" />
        <span className="catalog-sr-only">Rechercher un sport</span>
        <input type="search" placeholder="Rechercher un sport" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <h2>Choisissez votre sport</h2>
      {status === 'loading' && <p className="catalog-message">Chargement des sports…</p>}
      {status === 'error' && <p className="catalog-message catalog-message--error">Les sports n’ont pas pu être chargés.</p>}
      <div className="sports-grid">
        {selection.map((sport) => <a className="sport-card" key={sport.code} href={'/catalogue?sport=' + encodeURIComponent(sport.code)}>
          <img src={sport.image} alt="" width="600" height="800" loading="lazy" />
          <span className="sport-card-shade" />
          <strong>{sport.name}</strong>
          <span className="sport-card-arrow" aria-hidden="true">→</span>
          <span className="catalog-sr-only">{sport.productCount} produit(s)</span>
        </a>)}
      </div>
      {status === 'ready' && selection.length === 0 && <p className="catalog-message">Aucun sport ne correspond à cette recherche.</p>}
    </div>
  )
}
