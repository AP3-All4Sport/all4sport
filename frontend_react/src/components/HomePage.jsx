import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import ocean from '../assets/home/ocean.jpg'
import homme from '../assets/home/homme.jpg'
import femme from '../assets/home/femme.jpg'
import enfant from '../assets/home/enfant.jpg'
import blackBoot from '../assets/home/crampon-noir.jpg'
import yellowBoot from '../assets/home/crampon-jaune.jpg'
import './HomePage.css'

const categories = [
  { id: 'homme', name: 'Homme', description: 'Style. Performance. Partout.', image: homme },
  { id: 'femme', name: 'Femme', description: 'Confiance. Énergie. Mouvement.', image: femme },
  { id: 'enfant', name: 'Enfant', description: 'Grandir avec le sport.', image: enfant },
]

const brands = ['Nike', 'Adidas', 'Nakamura', 'Puma', 'Asics', 'The North Face', 'McKinley', 'Under Armour']
const products = [
  { id: 'club-enfant', name: 'Chaussure Predator FG CLUB Enfant Noir', brand: 'Adidas', category: 'enfant', image: blackBoot, price: 29.99, previous: 54.99, discount: 45, description: 'Un modèle à crampons pour accompagner les jeunes joueurs sur le terrain.' },
  { id: 'match-adulte', name: 'Chaussure FUTURE 9 Match FG/AG Adulte Jaune/Bleu', brand: 'Puma', category: 'homme', image: yellowBoot, price: 56.90, previous: 94.99, discount: 40, description: 'Une silhouette légère et une tige souple pour les entraînements de football.' },
  { id: 'club-noir', name: 'Chaussure F50 FG Pack Club — Noir', brand: 'Adidas', category: 'femme', image: blackBoot, price: 39.99, previous: 54.99, discount: 27, description: 'Une chaussure de football au profil épuré pour jouer avec aisance.' },
  { id: 'play-enfant', name: 'Chaussure FUTURE Play Enfant Jaune/Bleu', brand: 'Puma', category: 'enfant', image: yellowBoot, price: 39.99, previous: 49.99, discount: 20, description: 'Un modèle coloré pour les jeunes passionnés de football.' },
]
const slides = [
  { image: ocean, title: 'Le sport au service', second: 'd’un monde', accent: 'meilleur', subtitle: 'Ensemble pour la préservation des océans', label: 'Préserver les océans', action: 'campaign' },
  { image: homme, title: 'Votre terrain de jeu,', second: 'vos nouvelles', accent: 'envies', subtitle: 'Le style et le sport, au quotidien', label: 'La sélection homme', action: 'homme' },
  { image: femme, title: 'À chaque mouvement,', second: 'une nouvelle', accent: 'énergie', subtitle: 'Trouvez votre rythme, dépassez-vous', label: 'La sélection femme', action: 'femme' },
]
const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

function Arrow() {
  return <svg className="home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
}

function Dialog({ content, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
  }, [])
  return (
    <dialog ref={ref} className="home-dialog" onClose={onClose} aria-labelledby="home-dialog-title" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <button type="button" className="home-dialog-close" onClick={onClose} aria-label="Fermer">×</button>
      {content.image && <img className="home-dialog-image" src={content.image} alt="" />}
      <p className="home-eyebrow">{content.eyebrow || 'All4Sport'}</p>
      <h2 id="home-dialog-title">{content.title}</h2>
      <p>{content.description}</p>
      {content.product && <><strong className="home-price">{money(content.product.price)}</strong><p className="home-demo-note">Exemple de produit et visuel d’illustration. La commande en ligne n’est pas encore disponible.</p></>}
      {content.items && <ul>{content.items.map((item) => <li key={item}>{item}</li>)}</ul>}
      <button type="button" className="home-button home-button-orange" onClick={onClose}>Continuer ma visite <Arrow /></button>
    </dialog>
  )
}

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [filter, setFilter] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return { category: categories.some(({ id }) => id === params.get('univers')) ? params.get('univers') : '', brand: '' }
  })
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('all4sport:favorites') || '[]')
      return Array.isArray(stored) ? stored.filter((id) => products.some((product) => product.id === id)) : []
    } catch { return [] }
  })
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(null)
  const [relay, setRelay] = useState({ postalCode: '', city: '', country: 'France' })
  const [relayMessage, setRelayMessage] = useState('')
  const [mapUrl, setMapUrl] = useState('')
  const [locating, setLocating] = useState(false)
  const locationRequest = useRef(0)
  const slide = slides[slideIndex]
  const selection = products.filter((product) => (!filter.category || product.category === filter.category) && (!filter.brand || product.brand === filter.brand))

  useEffect(() => () => { locationRequest.current += 1 }, [])

  function chooseCategory(category) {
    setFilter({ category, brand: '' })
    document.getElementById('home-products')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }

  function toggleFavorite(product) {
    const selected = favorites.includes(product.id)
    const next = selected ? favorites.filter((id) => id !== product.id) : [...favorites, product.id]
    setFavorites(next)
    try {
      localStorage.setItem('all4sport:favorites', JSON.stringify(next))
      setNotice(`${product.name} : ${selected ? 'retiré des' : 'ajouté aux'} favoris.`)
    } catch { setNotice('Favoris mis à jour pour cette visite. Le stockage local est indisponible.') }
  }

  function openCampaign() {
    setModal({ title: 'Le sport au service d’un monde meilleur', eyebrow: 'Préserver les océans', description: 'La nature est notre plus beau terrain de jeu. Chacun peut contribuer à la préserver, à son échelle.', items: ['Ramasser ses déchets après une sortie et participer aux collectes locales.', 'Privilégier les équipements durables, les réparer et leur donner une seconde vie.', 'Respecter les espaces naturels et les animaux lors de ses activités.'] })
  }

  function findRelay(event) {
    event.preventDefault()
    locationRequest.current += 1
    setLocating(false)
    if (!relay.city.trim() && !relay.postalCode.trim()) {
      setMapUrl('')
      setRelayMessage('Indiquez un code postal ou une ville pour lancer la recherche.')
      return
    }
    const query = `point relais locker ${relay.postalCode.trim()} ${relay.city.trim()} ${relay.country}`
    setMapUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`)
    setRelayMessage('Votre recherche est prête. Consultez les points relais sur la carte et vérifiez leurs horaires.')
  }

  function locate() {
    setMapUrl('')
    if (!navigator.geolocation) {
      setRelayMessage('La géolocalisation n’est pas disponible. Saisissez votre ville ou code postal.')
      return
    }
    const request = ++locationRequest.current
    setLocating(true)
    setRelayMessage('Recherche de votre position…')
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (request !== locationRequest.current) return
      setLocating(false)
      setMapUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`point relais locker près de ${coords.latitude},${coords.longitude}`)}`)
      setRelayMessage('Position trouvée. Ouvrez la carte pour consulter les points relais à proximité.')
    }, () => {
      if (request !== locationRequest.current) return
      setLocating(false)
      setRelayMessage('Position indisponible ou autorisation refusée. Saisissez votre ville ou code postal.')
    }, { timeout: 10000, maximumAge: 60000 })
  }

  return (
    <div className="home-page">
      <section className="home-hero" aria-roledescription="carrousel" aria-label="À la une">
        <img key={slide.image} className={`home-hero-photo home-hero-photo--${slide.action}`} src={slide.image} alt="" fetchPriority="high" />
        <div className="home-hero-shade" />
        <div className="home-hero-copy" aria-live="polite" aria-atomic="true">
          <h1>{slide.title}<br />{slide.second} <span>{slide.accent}</span></h1>
          <p>{slide.subtitle}</p>
          <div className="home-hero-actions">
            <button className="home-button home-button-orange" type="button" onClick={() => slide.action === 'campaign' ? openCampaign() : chooseCategory(slide.action)}>En savoir plus <Arrow /></button>
            <button className="home-button home-button-white" type="button" onClick={openCampaign}>Agir pour la planète</button>
          </div>
        </div>
        <button className="home-slider-arrow home-slider-arrow--previous" type="button" aria-label="Diapositive précédente" onClick={() => setSlideIndex((slideIndex + slides.length - 1) % slides.length)}>‹</button>
        <button className="home-slider-arrow home-slider-arrow--next" type="button" aria-label="Diapositive suivante" onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}>›</button>
        <span className="home-hero-caption">Le sport nous rassemble <span /></span>
        <div className="home-slider-dots">
          {slides.map((item, index) => <button key={item.action} type="button" aria-label={item.label} aria-current={index === slideIndex ? 'true' : undefined} onClick={() => setSlideIndex(index)} />)}
        </div>
      </section>

      <div className="site-container home-shopping">
        <section className="home-categories" aria-label="Choisissez votre univers">
          {categories.map((category) => <button type="button" className="home-category" key={category.id} onClick={() => chooseCategory(category.id)}>
            <img src={category.image} alt="" loading="lazy" width="600" height="800" />
            <span className="home-category-copy"><strong>{category.name}</strong><span>{category.description}</span><span className="home-category-cta">Voir <Arrow /></span></span>
          </button>)}
        </section>

        <section className="home-brands" aria-labelledby="home-brands-title">
          <div className="home-section-heading"><h2 id="home-brands-title">Nos marques</h2><button type="button" className="home-text-link" onClick={() => setModal({ title: 'Nos marques', description: 'Retrouvez les marques de la maquette All4Sport. La sélection de démonstration ci-dessous présente Adidas et Puma.', items: brands })}>Voir toutes les marques <Arrow /></button></div>
          <div className="home-brand-grid">
            {brands.map((brand) => <button className="home-brand" key={brand} type="button" aria-pressed={filter.brand === brand} onClick={() => { setFilter({ category: '', brand: filter.brand === brand ? '' : brand }); document.getElementById('home-products')?.scrollIntoView({ block: 'start' }) }}><span className={`home-brand-wordmark home-brand-wordmark--${brand.toLowerCase().replaceAll(' ', '-')}`}>{brand}</span><span>{brand}</span></button>)}
          </div>
        </section>

        <section className="home-products" id="home-products" aria-labelledby="home-products-title">
          <div className="home-section-heading"><h2 id="home-products-title">Les meilleurs crampons de la rentrée !</h2><button className="home-text-link" type="button" onClick={() => { setFilter({ category: '', brand: '' }); setNotice('Les quatre articles de la sélection sont affichés.') }}>Voir tout <Arrow /></button></div>
          {(filter.category || filter.brand) && <div className="home-filter">Sélection : {filter.brand || categories.find(({ id }) => id === filter.category)?.name}<button type="button" onClick={() => setFilter({ category: '', brand: '' })}>Effacer le filtre ×</button></div>}
          <div className="home-product-grid">
            {selection.map((product) => <article className="home-product" key={product.id}>
              <button className="home-favorite" type="button" aria-label={`${favorites.includes(product.id) ? 'Retirer des' : 'Ajouter aux'} favoris : ${product.name}`} aria-pressed={favorites.includes(product.id)} onClick={() => toggleFavorite(product)}><Icon name="heart" /></button>
              <button className="home-product-open" type="button" onClick={() => setModal({ title: product.name, description: product.description, image: product.image, eyebrow: product.brand, product })}>
                <img className="home-product-photo" src={product.image} alt={product.name} width="480" height="480" loading="lazy" />
                <span className="home-product-info"><span className="home-product-name">{product.name}</span><span className="home-product-type">Football · {product.category === 'enfant' ? 'Enfant' : 'Adulte'}</span><span className="home-product-prices"><strong className="home-price">{money(product.price)}</strong><del>{money(product.previous)}</del><span className="home-discount">−{product.discount}%</span></span></span>
              </button>
            </article>)}
          </div>
          {selection.length === 0 && <p className="home-empty">Aucun article de démonstration pour cette marque. Choisissez « Voir tout » pour retrouver la sélection.</p>}
          <p className="home-catalog-note">Sélection de démonstration · Visuels d’illustration, prix indicatifs.</p>
          <p className="home-sr-only" role="status">{notice}</p>
        </section>
      </div>

      <section className="home-relay" aria-labelledby="home-relay-title">
        <div className="site-container">
          <div className="home-relay-heading"><svg viewBox="0 0 40 52" aria-hidden="true"><path d="M20 1C9 1 1 9 1 20c0 13 19 31 19 31s19-18 19-31C39 9 31 1 20 1Zm0 10a9 9 0 1 1 0 18 9 9 0 0 1 0-18Z" fill="currentColor" /></svg><div><h2 id="home-relay-title">Trouver votre Point Relais ou Locker</h2><p>Retirez vos commandes près de chez vous, facilement et rapidement.</p></div></div>
          <form className="home-relay-form" onSubmit={findRelay}>
            <label>Code postal<input name="postalCode" autoComplete="postal-code" placeholder="Saisir un code postal" maxLength="12" value={relay.postalCode} onChange={(event) => { setRelay({ ...relay, postalCode: event.target.value }); setMapUrl('') }} /></label>
            <label>Ville<input name="city" autoComplete="address-level2" placeholder="Votre ville" maxLength="100" value={relay.city} onChange={(event) => { setRelay({ ...relay, city: event.target.value }); setMapUrl('') }} /></label>
            <label><span className="home-sr-only">Pays</span><select name="country" autoComplete="country-name" value={relay.country} onChange={(event) => { setRelay({ ...relay, country: event.target.value }); setMapUrl('') }}><option>France</option><option>Belgique</option><option>Luxembourg</option><option>Suisse</option></select></label>
            <button className="home-button home-button-orange" type="submit">Trouver</button>
            <button className="home-button home-button-outline" type="button" onClick={locate} disabled={locating}><span aria-hidden="true">◎</span>{locating ? 'Localisation…' : 'Se localiser'}</button>
          </form>
          <div className="home-relay-result" role="status"><p>{relayMessage}</p>{mapUrl && <a className="home-text-link" href={mapUrl} target="_blank" rel="noopener noreferrer">Voir les points relais sur Google Maps (nouvel onglet) <Arrow /></a>}</div>
        </div>
      </section>
      {modal && <Dialog content={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
