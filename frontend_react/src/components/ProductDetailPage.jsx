import { useEffect, useState } from 'react'
import { getCartItems, saveCartItems } from '../cart.js'
import './ProductDetailPage.css'

const views = ['De face', 'De côté', 'Du dessous']
const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

export default function ProductDetailPage({ productId }) {
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [status, setStatus] = useState('loading')
  const [cartMessage, setCartMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/catalogue/produits/${productId}`, { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) throw new Error('not-found')
        if (!response.ok) throw new Error('Le produit n’a pas pu être chargé.')
        return response.json()
      })
      .then((data) => {
        setProduct(data.product)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus(error.message === 'not-found' ? 'not-found' : 'error')
      })

    return () => controller.abort()
  }, [productId])

  const addToCart = (event) => {
    event.preventDefault()
    if (!product || !selectedSize) return

    const items = getCartItems()
    const existingItem = items.find((item) => item.productId === product.id && item.size === selectedSize)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.push({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size: selectedSize,
        quantity: 1,
      })
    }

    saveCartItems(items)
    setCartMessage(`${product.name} — taille ${selectedSize} ajouté au panier.`)
  }

  if (status === 'loading') return <div className="product-detail-page site-container"><p className="catalog-message">Chargement du produit…</p></div>
  if (status === 'not-found') return <div className="product-detail-page site-container"><p className="catalog-message">Ce produit n’existe pas.</p><a className="product-detail-back" href="/catalogue">Retour au catalogue</a></div>
  if (status === 'error') return <div className="product-detail-page site-container"><p className="catalog-message catalog-message--error">Le produit n’a pas pu être chargé. Vérifiez que Symfony et la base de données sont démarrés.</p><a className="product-detail-back" href="/catalogue">Retour au catalogue</a></div>

  const images = product.images?.length ? product.images : product.image ? [product.image] : []
  const galleryImages = images.length === 1 ? [images[0], images[0], images[0]] : images
  const activeImage = galleryImages[selectedImage]

  return (
    <div className="product-detail-page site-container">
      <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane">
        <a href="/">Accueil</a><span aria-hidden="true">›</span><a href="/catalogue">Catalogue</a><span aria-hidden="true">›</span><span>{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        <section className="product-detail-gallery" aria-label="Photos du produit">
          <div className="product-detail-main-image">
            {activeImage
              ? <img src={activeImage} alt={`${product.name} — vue ${views[selectedImage] || 'supplémentaire'}`} />
              : <div className="product-detail-no-image">Photo indisponible</div>}
          </div>
          <div className="product-detail-thumbnails" aria-label="Choisir une vue">
            {galleryImages.map((image, index) => (
              <button
                className={selectedImage === index ? 'is-selected' : ''}
                type="button"
                onClick={() => setSelectedImage(index)}
                aria-pressed={selectedImage === index}
                aria-label={`Afficher la vue ${views[index] || `supplémentaire ${index + 1}`}`}
                key={`${image}-${index}`}
              >
                {image && <img src={image} alt="" />}
                <span>{views[index] || `Vue ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="product-detail-info">
          <a className="product-detail-brand" href={`/catalogue?marque=${encodeURIComponent(product.brand.toLowerCase())}`}>{product.brand}</a>
          <h1>{product.name}</h1>
          <p className="product-detail-meta">{product.sport.name}{product.color ? ` · ${product.color}` : ''}</p>
          <p className="product-detail-price">{money(product.price)}</p>
          {product.description && <p className="product-detail-description">{product.description}</p>}

          <form onSubmit={addToCart}>
            <fieldset className="product-detail-sizes">
              <legend>Choisissez votre taille</legend>
              <div>
                {product.sizes.map((size) => (
                  <button className={selectedSize === size ? 'is-selected' : ''} type="button" key={size} aria-pressed={selectedSize === size} onClick={() => { setSelectedSize(size); setCartMessage('') }}>
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="product-detail-add" type="submit" disabled={!selectedSize}>Ajouter au panier</button>
          </form>
          <p className="product-detail-feedback" role="status" aria-live="polite">{cartMessage || (!selectedSize ? 'Sélectionnez une taille pour continuer.' : '')}</p>
        </section>
      </div>
    </div>
  )
}
