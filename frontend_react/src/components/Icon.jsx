const icons = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export default function Icon({ name, className = '' }) {
  return (
    <img
      className={`icon ${className}`}
      src={icons[`../assets/icons/${name}.svg`]}
      width="24"
      height="24"
      alt=""
      aria-hidden="true"
    />
  )
}
