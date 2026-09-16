import logo from '../assets/brand/all4sport-logo.svg'
import Icon from './Icon.jsx'

const services = [
  { icon: 'truck', title: 'Livraison rapide', text: 'Chez vous ou en point relais' },
  { icon: 'credit-card', title: 'Paiement sécurisé', text: '100% sécurisé' },
  { icon: 'package-open', title: 'Retours faciles', text: 'Sous 30 jours' },
  { icon: 'heart', title: 'Une équipe à votre écoute', text: 'Conseils & service client' },
]

const columns = [
  {
    title: 'Faites votre shopping avec All4Sport',
    links: ['Livraison', 'Guide des tailles', 'Trouver un magasin', 'Programme de Fidélité', 'Réduction Étudiants', 'All4Sport Blog'],
  },
  {
    title: 'Service Clients',
    links: ['Retours et échanges', 'Contact', 'FAQ', 'Suivre ma Commande'],
  },
  {
    title: 'Entreprise',
    links: ['Carrières', 'Programme Affiliation', 'All4Sport Fashion', 'Nos engagements'],
  },
  {
    title: 'Légal',
    links: ['Conditions Générales de Vente', 'Confidentialité et Cookies', 'Paramètres des Cookies', 'Politique d’avis en ligne', 'Accessibilité'],
  },
]

const socials = [
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'facebook', label: 'Facebook' },
  { icon: 'youtube', label: 'YouTube' },
  { icon: 'tiktok', label: 'TikTok' },
]

const payments = [
  { icon: 'visa', label: 'Visa' },
  { icon: 'mastercard', label: 'Mastercard' },
  { icon: 'americanexpress', label: 'American Express' },
  { icon: 'paypal', label: 'PayPal' },
  { icon: 'applepay', label: 'Apple Pay' },
  { icon: 'klarna', label: 'Klarna' },
]

function backToTop() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
  document.getElementById('haut-de-page')?.focus({ preventScroll: true })
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <section className="service-strip" aria-label="Les services All4Sport">
        <ul className="service-list site-container">
          {services.map(({ icon, title, text }) => (
            <li className="service-item" key={title}>
              <Icon name={icon} />
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="footer-dark">
        <div className="footer-main site-container">
          <div className="footer-brand">
            <a href="/react" aria-label="All4Sport — Accueil">
              <img className="footer-logo" src={logo} alt="All4Sport" width="210" height="50" />
            </a>
            <p>Le sport nous rassemble. Chez All4Sport, nous croyons en un avenir plus responsable, plus solidaire et plus actif.</p>
            <ul className="social-list" aria-label="Réseaux sociaux">
              {socials.map(({ icon, label }) => (
                <li key={icon}>
                  <button type="button" disabled aria-label={`${label} — lien à venir`} title={`${label} — lien à venir`}>
                    <Icon name={icon} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {columns.map(({ title, links }) => (
            <nav className="footer-column" key={title} aria-label={title}>
              <h2>{title}</h2>
              <ul>
                {links.map((label) => (
                  <li key={label}>
                    <span className="footer-pending-link" role="link" aria-disabled="true" title="Page à venir">{label}</span>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-inner site-container">
            <div className="footer-copyright">
              <p>Visitez notre site corporate <span className="corporate-address" role="link" aria-disabled="true" title="Site corporate à confirmer">www.all4sport.com</span></p>
              <p>Copyright © {new Date().getFullYear()} All4Sport. Tous droits réservés.</p>
            </div>
            <button className="back-to-top" type="button" onClick={backToTop}>
              Haut de page <Icon name="arrow-up" />
            </button>
            <div className="footer-payments">
              <p>Nous acceptons les méthodes de paiement suivantes</p>
              <ul className="payment-list" aria-label="Moyens de paiement">
                {payments.map(({ icon, label }) => (
                  <li className={`payment-badge payment-badge--${icon}`} key={icon} aria-label={label}>
                    <Icon name={icon} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
