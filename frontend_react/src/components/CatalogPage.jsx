import { useEffect, useMemo, useState } from 'react'
import './CatalogPage.css'

const universeNames = { homme: 'Homme', femme: 'Femme', enfant: 'Enfant' }
const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

export default function CatalogPage() {
  const parameters = new URLSearchParams(window.location.search)
  const universe = parameters.get('univers')
  const sportCode = parameters.get('sport')
  const query = parameters.get('q')
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [sort, setSort] = useState('relevance')

  useEffect(() => {
    const controller = new AbortController()
    const apiParameters = new URLSearchParams()
    if (universe) apiParameters.set('univers', universe)
    if (sportCode) apiParameters.set('sport', sportCode)
    if (query) apiParameters.set('q', query)

    fetch('/api/catalogue/produits?' + apiParameters.toString(), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Catalogue indisponible')
        return response.json()
      })
      .then((data) => {
        setProducts(data.products)
        setStatus('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setStatus('error')
      })

    return () => controller.abort()
  }, [query, sportCode, universe])

  const sortedProducts = useMemo(() => {
    const copy = [...products]
    if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price)
    return copy
  }, [products, sort])

  const sportName = products[0]?.sport.name
  const title = universeNames[universe] || sportName || (query ? 'Résultats de recherche' : 'Tous les produits')
  const breadcrumb = universeNames[universe] || sportName || 'Catalogue'

  return (
    <div className="catalog-page site-container">
      <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane">
        <a href="/">Accueil</a><span aria-hidden="true">›</span><span>{breadcrumb}</span>
      </nav>
      <div className="catalog-title">
        <h1>{title}</h1>
        {query && <p>Recherche : « {query} »</p>}
      </div>

      <div className="catalog-toolbar">
        <a className="catalog-filter-button" href="/sports"><span aria-hidden="true">☷</span> Sports</a>
        <div>
          <strong>{products.length} produit{products.length > 1 ? 's' : ''}</strong>
          <label>
            <span className="catalog-sr-only">Trier les produits</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">Le plus pertinent</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      {status === 'loading' && <p className="catalog-message">Chargement des produits…</p>}
      {status === 'error' && <p className="catalog-message catalog-message--error">Le catalogue n’a pas pu être chargé. Vérifiez que Symfony et la base de données sont démarrés.</p>}
      {status === 'ready' && products.length === 0 && <p className="catalog-message">Aucun produit ne correspond à cette sélection.</p>}

      <div className="home-product-grid">
        {sortedProducts.map((product) => <article className="home-product" key={product.id}>
          <div className="home-product-open">
            {product.image && <img className="home-product-photo" src={product.image} alt={product.name} width="480" height="480" loading="lazy" />}
            <span className="home-product-info">
              <span className="home-product-name"><strong>{product.brand}</strong> {product.name}</span>
              <span className="home-product-type">{product.sport.name} · {product.department}</span>
              <span className="home-product-prices"><strong className="home-price">{money(product.price)}</strong></span>
            </span>
          </div>
        </article>)}
      </div>
    </div>
  )
}
