import './ProductCard.css'

const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)

export default function ProductCard({ product, onOpen }) {
  const details = product.type || [product.sport?.name, product.department].filter(Boolean).join(' · ')
  const content = (
    <>
      {product.image && <img className="home-product-photo" src={product.image} alt={product.name} width="480" height="480" loading="lazy" />}
      <span className="home-product-info">
        <span className="home-product-name">{product.name}</span>
        <span className="home-product-type">{details}</span>
        <span className="home-product-prices"><strong className="home-price">{money(product.price)}</strong></span>
      </span>
    </>
  )

  return (
    <article className="home-product">
      {onOpen
        ? <button className="home-product-open" type="button" onClick={() => onOpen(product)}>{content}</button>
        : <div className="home-product-open">{content}</div>}
    </article>
  )
}
