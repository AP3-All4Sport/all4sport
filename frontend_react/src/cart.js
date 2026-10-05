const cartStorageKey = 'all4sport-cart'

export function getCartItems() {
  const savedItems = window.localStorage.getItem(cartStorageKey)
  if (!savedItems) return []

  const items = JSON.parse(savedItems)
  if (!Array.isArray(items)) throw new Error('Le contenu du panier est invalide.')

  return items
}

export function saveCartItems(items) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items))
  window.dispatchEvent(new Event('all4sport:cart-updated'))
}
