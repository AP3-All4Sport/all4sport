import { useEffect, useRef, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import cyclisme from '../assets/home/cyclisme.jpg'
import snowboard from '../assets/home/snowboard.png'
import volley from '../assets/home/volley.png'
import homme from '../assets/home/homme.jpg'
import femme from '../assets/home/femme.jpg'
import enfant from '../assets/home/enfant.jpg'
import blackBoot from '../assets/home/crampon-noir.jpg'
import yellowBoot from '../assets/home/crampon-jaune.jpg'
import nikeLogo from '../assets/brands/nike.svg'
import adidasLogo from '../assets/brands/adidas.svg'
import nakamuraLogo from '../assets/brands/nakamura.png'
import pumaLogo from '../assets/brands/puma.svg'
import asicsLogo from '../assets/brands/asics.jpg'
import northFaceLogo from '../assets/brands/the-north-face.svg'
import mckinleyLogo from '../assets/brands/mckinley.png'
import underArmourLogo from '../assets/brands/under-armour.svg'
import './HomePage.css'

const categories = [
  { id: 'homme', name: 'Homme', description: 'Style. Performance. Partout.', image: homme },
  { id: 'femme', name: 'Femme', description: 'Confiance. Énergie. Mouvement.', image: femme },
  { id: 'enfant', name: 'Enfant', description: 'Grandir avec le sport.', image: enfant },
]

const brands = [
  { name: 'Nike', logo: nikeLogo },
  { name: 'Adidas', logo: adidasLogo },
  { name: 'Nakamura', logo: nakamuraLogo },
  { name: 'Puma', logo: pumaLogo },
  { name: 'Asics', logo: asicsLogo },
  { name: 'The North Face', logo: northFaceLogo },
  { name: 'McKinley', logo: mckinleyLogo },
  { name: 'Under Armour', logo: underArmourLogo },
]
const products = [
  { id: 'club-enfant', name: 'Chaussure Predator FG CLUB Enfant Noir', brand: 'Adidas', category: 'enfant', type: 'Football · Enfant', image: blackBoot, price: 29.99, description: 'Un modèle à crampons pour accompagner les jeunes joueurs sur le terrain.' },
  { id: 'match-adulte', name: 'Chaussure FUTURE 9 Match FG/AG Adulte Jaune/Bleu', brand: 'Puma', category: 'homme', type: 'Football · Adulte', image: yellowBoot, price: 56.90, description: 'Une silhouette légère et une tige souple pour les entraînements de football.' },
  { id: 'club-noir', name: 'Chaussure F50 FG Pack Club — Noir', brand: 'Adidas', category: 'femme', type: 'Football · Adulte', image: blackBoot, price: 39.99, description: 'Une chaussure de football au profil épuré pour jouer avec aisance.' },
  { id: 'play-enfant', name: 'Chaussure FUTURE Play Enfant Jaune/Bleu', brand: 'Puma', category: 'enfant', type: 'Football · Enfant', image: yellowBoot, price: 39.99, description: 'Un modèle coloré pour les jeunes passionnés de football.' },
]
const slides = [
  { image: cyclisme, title: 'Le matériel des champions,', second: 'accessible dès', accent: 'aujourd\'hui', subtitle: 'Pas d\'excuses, juste le bon équipement', label: 'La sélection sport', action: 'campaign' },
  { image: snowboard, title: 'Votre terrain de jeu,', second: 'vos nouvelles', accent: 'envies', subtitle: 'Le style et le sport, au quotidien', label: 'La sélection homme', action: 'homme' },
  { image: volley, title: 'À chaque mouvement,', second: 'une nouvelle', accent: 'énergie', subtitle: 'Trouvez votre rythme, dépassez-vous', label: 'La sélection femme', action: 'femme' },
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
  const [notice, setNotice] = useState('')
  const [modal, setModal] = useState(null)
  const slide = slides[slideIndex]
  const selection = products.filter((product) => (!filter.category || product.category === filter.category) && (!filter.brand || product.brand === filter.brand))

  function chooseCategory(category) {
    window.location.assign('/catalogue?univers=' + encodeURIComponent(category))
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
            <button className="home-button home-button-white" type="button" onClick={() => slide.action === 'campaign' ? window.location.assign('/catalogue?sport=cyclisme') : chooseCategory(slide.action)}>En savoir plus <Arrow /></button>
          </div>
        </div>
        <button className="home-slider-arrow home-slider-arrow--previous" type="button" aria-label="Diapositive précédente" onClick={() => setSlideIndex((slideIndex + slides.length - 1) % slides.length)}>‹</button>
        <button className="home-slider-arrow home-slider-arrow--next" type="button" aria-label="Diapositive suivante" onClick={() => setSlideIndex((slideIndex + 1) % slides.length)}>›</button>
        <div className="home-slider-dots">
          {slides.map((item, index) => <button key={item.action} type="button" aria-label={item.label} aria-current={index === slideIndex ? 'true' : undefined} onClick={() => setSlideIndex(index)} />)}
        </div>
      </section>

      <div className="site-container home-shopping">
        <section className="home-categories" aria-label="Choisissez votre univers">
          {categories.map((category) => <a className="home-category" key={category.id} href={`/catalogue?univers=${category.id}`}>
            <img src={category.image} alt="" loading="lazy" width="600" height="800" />
            <span className="home-category-copy"><strong>{category.name}</strong><span>{category.description}</span><span className="home-category-cta">Voir <Arrow /></span></span>
          </a>)}
        </section>

        <section className="home-brands" aria-labelledby="home-brands-title">
          <div className="home-section-heading"><h2 id="home-brands-title">Nos marques</h2></div>
          <div className="home-brand-grid">
            {brands.map(({ name, logo }) => <button className="home-brand" key={name} type="button" aria-pressed={filter.brand === name} onClick={() => { setFilter({ category: '', brand: filter.brand === name ? '' : name }); document.getElementById('home-products')?.scrollIntoView({ block: 'start' }) }}><img className="home-brand-logo" src={logo} alt="" /><span>{name}</span></button>)}
          </div>
        </section>

        <section className="home-products" id="home-products" aria-labelledby="home-products-title">
          <div className="home-section-heading"><h2 id="home-products-title">Les meilleurs crampons de la rentrée !</h2></div>
          {(filter.category || filter.brand) && <div className="home-filter">Sélection : {filter.brand || categories.find(({ id }) => id === filter.category)?.name}<button type="button" onClick={() => setFilter({ category: '', brand: '' })}>Effacer le filtre ×</button></div>}
          <div className="home-product-grid">
            {selection.map((product) => <ProductCard key={product.id} product={product} onOpen={(selectedProduct) => setModal({ title: selectedProduct.name, description: selectedProduct.description, image: selectedProduct.image, eyebrow: selectedProduct.brand, product: selectedProduct })} />)}
          </div>
          {selection.length === 0 && <p className="home-empty">Aucun article de démonstration pour cette marque. Choisissez « Voir tout » pour retrouver la sélection.</p>}
          <p className="home-sr-only" role="status">{notice}</p>
        </section>
      </div>

      {modal && <Dialog content={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
