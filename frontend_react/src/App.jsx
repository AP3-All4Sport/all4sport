import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import './App.css'

export default function App() {
  return (
    <div className="store-layout">
      <Header />
      <main className="store-content" aria-label="Contenu principal" />
      <Footer />
    </div>
  )
}
