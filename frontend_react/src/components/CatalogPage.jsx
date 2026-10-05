import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard.jsx'
import './CatalogPage.css'

const universeNames = { homme: 'Homme', femme: 'Femme', enfant: 'Enfant' }

function FilterSection({ id, title, openSection, setOpenSection, children }) {
  const isOpen = openSection === id

  return (
    <section className="catalog-side-section">
      <button type="button" aria-expanded={isOpen} aria-controls={`filter-${id}`} onClick={() => setOpenSection(isOpen ? '' : id)}>
        <span>{title}</span><b aria-hidden="true">{isOpen ? '−' : '+'}</b>
      </button>
      {isOpen && <div id={`filter-${id}`} className="catalog-side-section-content">{children}</div>}
    </section>
  )
}

export default function CatalogPage() {
  const parameters = new URLSearchParams(window.location.search)
  const universe = parameters.get('univers')
  const sportCode = parameters.get('sport')
  const categoryCode = parameters.get('categorie')
  const sizeCode = parameters.get('taille')
  const colorCode = parameters.get('couleur')
  const brandCode = parameters.get('marque')
  const minimumPrice = parameters.get('prix_min')
  const maximumPrice = parameters.get('prix_max')
  const query = parameters.get('q')
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ categories: [], sizes: [], colors: [], brands: [], priceRange: { minimumPrice: 0, maximumPrice: 0 } })
  const [filtersVisible, setFiltersVisible] = useState(true)
  const [openSection, setOpenSection] = useState('')
  const [draftCategory, setDraftCategory] = useState(categoryCode || '')
  const [draftSize, setDraftSize] = useState(sizeCode || '')
  const [draftColor, setDraftColor] = useState(colorCode || '')
  const [draftBrand, setDraftBrand] = useState(brandCode || '')
  const [draftMinimumPrice, setDraftMinimumPrice] = useState(minimumPrice || '')
  const [draftMaximumPrice, setDraftMaximumPrice] = useState(maximumPrice || '')
  const [status, setStatus] = useState('loading')
  const [sort, setSort] = useState('relevance')

  useEffect(() => {
    const controller = new AbortController()
    const apiParameters = new URLSearchParams()
    if (universe) apiParameters.set('univers', universe)
    if (sportCode) apiParameters.set('sport', sportCode)
    if (categoryCode) apiParameters.set('categorie', categoryCode)
    if (sizeCode) apiParameters.set('taille', sizeCode)
    if (colorCode) apiParameters.set('couleur', colorCode)
    if (brandCode) apiParameters.set('marque', brandCode)
    if (minimumPrice) apiParameters.set('prix_min', minimumPrice)
    if (maximumPrice) apiParameters.set('prix_max', maximumPrice)
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
  }, [brandCode, categoryCode, colorCode, maximumPrice, minimumPrice, query, sizeCode, sportCode, universe])

  useEffect(() => {
    const controller = new AbortController()
    const apiParameters = new URLSearchParams()
    if (universe) apiParameters.set('univers', universe)
    if (sportCode) apiParameters.set('sport', sportCode)
    if (draftCategory) apiParameters.set('categorie', draftCategory)

    fetch('/api/catalogue/filtres?' + apiParameters.toString(), { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Filtres indisponibles')
        return response.json()
      })
      .then((data) => {
        setFilters(data)
        setDraftSize((value) => data.sizes.some((item) => item.code === value) ? value : '')
        setDraftColor((value) => data.colors.some((item) => item.code === value) ? value : '')
        setDraftBrand((value) => data.brands.some((item) => item.code === value) ? value : '')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setFilters({ categories: [], sizes: [], colors: [], brands: [], priceRange: { minimumPrice: 0, maximumPrice: 0 } })
      })

    return () => controller.abort()
  }, [draftCategory, sportCode, universe])

  const sortedProducts = useMemo(() => {
    const copy = [...products]
    if (sort === 'price-asc') copy.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') copy.sort((a, b) => b.price - a.price)
    return copy
  }, [products, sort])

  const categoryName = filters.categories.find((item) => item.code === categoryCode)?.name
  const sizeName = filters.sizes.find((item) => item.code === sizeCode)?.name || sizeCode
  const colorName = filters.colors.find((item) => item.code === colorCode)?.name || colorCode
  const brandName = filters.brands.find((item) => item.code === brandCode)?.name || brandCode
  const sportName = sportCode ? products[0]?.sport.name : null
  const universeName = universeNames[universe]
  const title = categoryName
    ? `${categoryName}${universeName ? ` ${universeName.toLowerCase()}` : ''}`
    : universeName || sportName || (query ? 'Résultats de recherche' : 'Tous les produits')
  const currentBreadcrumb = categoryName || sportName || universeName || 'Catalogue'
  const activeFilterCount = [categoryCode, sizeCode, colorCode, brandCode, minimumPrice || maximumPrice].filter(Boolean).length

  const updateLocation = (updates) => {
    const nextParameters = new URLSearchParams(window.location.search)
    Object.entries(updates).forEach(([name, value]) => {
      if (value) nextParameters.set(name, value)
      else nextParameters.delete(name)
    })
    const search = nextParameters.toString()
    window.location.assign('/catalogue' + (search ? `?${search}` : ''))
  }

  const applyFilters = (event) => {
    event.preventDefault()
    updateLocation({ categorie: draftCategory, couleur: draftColor, taille: draftSize, marque: draftBrand, prix_min: draftMinimumPrice, prix_max: draftMaximumPrice })
  }

  const resetFilters = () => updateLocation({ categorie: '', couleur: '', taille: '', marque: '', prix_min: '', prix_max: '' })

  return (
    <div className="catalog-page site-container">
      <nav className="catalog-breadcrumb" aria-label="Fil d’Ariane">
        <a href="/">Accueil</a><span aria-hidden="true">›</span>
        {universeName && (categoryName || sportName) && <><a href={`/catalogue?univers=${universe}`}>{universeName}</a><span aria-hidden="true">›</span></>}
        {sportName && categoryName && <><a href={`/catalogue?${new URLSearchParams({ ...(universe ? { univers: universe } : {}), sport: sportCode }).toString()}`}>{sportName}</a><span aria-hidden="true">›</span></>}
        <span>{currentBreadcrumb}</span>
      </nav>
      <div className="catalog-title"><h1>{title}</h1>{query && <p>Recherche : « {query} »</p>}</div>

      <div className="catalog-toolbar">
        <button className="catalog-filter-button" type="button" aria-expanded={filtersVisible} onClick={() => setFiltersVisible((visible) => !visible)}>
          <span className="catalog-filter-icon" aria-hidden="true"><i /><i /><i /></span>
          {filtersVisible ? 'Masquer les filtres' : 'Afficher les filtres'}
          {activeFilterCount > 0 && <span className="catalog-filter-count">{activeFilterCount}</span>}
        </button>
        <div><strong>{products.length} produit{products.length > 1 ? 's' : ''}</strong><label><span className="catalog-sr-only">Trier les produits</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Le plus pertinent</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option></select></label></div>
      </div>

      <div className={`catalog-content-layout ${filtersVisible ? '' : 'catalog-content-layout--wide'}`}>
        {filtersVisible && (
          <form className="catalog-sidebar" onSubmit={applyFilters}>
            <FilterSection id="category" title="Type de produit" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="catalog-choice-list">
                <button className={!draftCategory ? 'is-selected' : ''} type="button" onClick={() => setDraftCategory('')}><span>Tout voir</span><small>{filters.categories.reduce((total, item) => total + item.productCount, 0)}</small></button>
                {filters.categories.map((item) => <button className={draftCategory === item.code ? 'is-selected' : ''} type="button" onClick={() => setDraftCategory(item.code)} key={item.code}><span>{item.name}</span><small>{item.productCount}</small></button>)}
              </div>
            </FilterSection>

            <FilterSection id="colors" title="Couleurs" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="catalog-choice-list catalog-color-list">
                {filters.colors.map((item) => <button className={draftColor === item.code ? 'is-selected' : ''} type="button" onClick={() => setDraftColor(draftColor === item.code ? '' : item.code)} key={item.code}><span><i className={`catalog-color-dot catalog-color-dot--${item.code}`} />{item.name}</span><small>{item.productCount}</small></button>)}
              </div>
            </FilterSection>

            <FilterSection id="sizes" title="Tailles" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="catalog-side-sizes">{filters.sizes.map((item) => <button className={draftSize === item.code ? 'is-selected' : ''} type="button" onClick={() => setDraftSize(draftSize === item.code ? '' : item.code)} key={item.code}>{item.name}</button>)}</div>
            </FilterSection>

            <FilterSection id="brands" title="Marques" openSection={openSection} setOpenSection={setOpenSection}>
              <div className="catalog-choice-list">{filters.brands.map((item) => <button className={draftBrand === item.code ? 'is-selected' : ''} type="button" onClick={() => setDraftBrand(draftBrand === item.code ? '' : item.code)} key={item.code}><span>{item.name}</span><small>{item.productCount}</small></button>)}</div>
            </FilterSection>

            <FilterSection id="price" title="Prix" openSection={openSection} setOpenSection={setOpenSection}>
              <p className="catalog-price-range">De {Math.floor(filters.priceRange.minimumPrice)} € à {Math.ceil(filters.priceRange.maximumPrice)} €</p>
              <div className="catalog-side-price">
                <label><span>Minimum</span><span><input type="number" min="0" step="1" placeholder={String(Math.floor(filters.priceRange.minimumPrice))} value={draftMinimumPrice} onChange={(event) => setDraftMinimumPrice(event.target.value)} /><b>€</b></span></label>
                <label><span>Maximum</span><span><input type="number" min="0" step="1" placeholder={String(Math.ceil(filters.priceRange.maximumPrice))} value={draftMaximumPrice} onChange={(event) => setDraftMaximumPrice(event.target.value)} /><b>€</b></span></label>
              </div>
            </FilterSection>

            <div className="catalog-side-actions"><button type="button" onClick={resetFilters}>Réinitialiser</button><button type="submit">Appliquer</button></div>
          </form>
        )}

        <section className="catalog-products">
          {activeFilterCount > 0 && <div className="catalog-active-filters" aria-label="Filtres actifs">{categoryName && <span>{categoryName}</span>}{colorName && <span>{colorName}</span>}{sizeName && <span>Taille {sizeName}</span>}{brandName && <span>{brandName}</span>}{(minimumPrice || maximumPrice) && <span>Prix : {minimumPrice || '0'} € – {maximumPrice || 'maximum'} €</span>}<button type="button" onClick={resetFilters}>Tout effacer</button></div>}
          {status === 'loading' && <p className="catalog-message">Chargement des produits…</p>}
          {status === 'error' && <p className="catalog-message catalog-message--error">Le catalogue n’a pas pu être chargé. Vérifiez que Symfony et la base de données sont démarrés.</p>}
          {status === 'ready' && products.length === 0 && <p className="catalog-message">Aucun produit ne correspond à cette sélection.</p>}
          <div className="home-product-grid">{sortedProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={({ id }) => window.location.assign(`/produit/${id}`)} />)}</div>
        </section>
      </div>
    </div>
  )
}
