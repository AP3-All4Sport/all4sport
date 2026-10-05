import { useEffect, useState } from 'react'
import { getCartItems, saveCartItems } from '../cart.js'
import './ProductDetailPage.css'

const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

export default function CartPage() {
  const [items, setItems] = useState(getCartItems)

  useEffect(() => {
    const updateItems = () => setItems(getCartItems())
    window.addEventListener('all4sport:cart-updated', updateItems)
    return () => window.removeEventListener('all4sport:cart-updated', updateItems)
  }, [])

  const removeItem = (productId, size) => {
    const nextItems = items.filter((item) => item.productId !== productId || item.size !== size)
    saveCartItems(nextItems)
    setItems(nextItems)
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="product-detail-page site-container cart-page">
      <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span aria-hidden="true">›</span><span>Panier</span></nav>
      <h1>Mon panier</h1>
      {items.length === 0
        ? <div className="cart-empty"><p>Votre panier est vide.</p><a className="product-detail-add" href="/catalogue">Découvrir le catalogue</a></div>
        : <>
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={`${item.productId}-${item.size}`}>
                {item.image && <img src={item.image} alt="" />}
                <div><strong>{item.name}</strong><span>{item.brand} · Taille {item.size} · Quantité : {item.quantity}</span><b>{money(item.price * item.quantity)}</b></div>
                <button type="button" onClick={() => removeItem(item.productId, item.size)}>Retirer</button>
              </article>
            ))}
          </div>
          <p className="cart-total">Total <strong>{money(total)}</strong></p>
          <p className="cart-note">Le paiement en ligne n’est pas encore disponible.</p>
        </>}
    </div>
  )
}
