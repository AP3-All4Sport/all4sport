import { useEffect, useState } from 'react'
import './DatabaseStatus.css'

const contentByStatus = {
  checking: {
    label: 'Vérification en cours',
    title: 'Test de la base de données',
    message: 'Symfony essaie de joindre la base configurée.',
  },
  connected: {
    label: 'Connexion réussie',
    title: 'La BDD est bien reliée',
    message: 'La base a répondu à la requête de test en lecture seule.',
  },
  disconnected: {
    label: 'Connexion échouée',
    title: "La BDD n'est pas reliée",
    message: 'La base ne répond pas avec la configuration actuelle.',
  },
}

async function getDatabaseStatus(signal) {
  try {
    const response = await fetch('/api/database/status', {
      headers: { Accept: 'application/json' },
      signal,
    })
    const result = await response.json()

    return response.ok && result.connected ? 'connected' : 'disconnected'
  } catch (error) {
    return error.name === 'AbortError' ? null : 'disconnected'
  }
}

export default function DatabaseStatus() {
  const [status, setStatus] = useState('checking')
  const [checkedAt, setCheckedAt] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    getDatabaseStatus(controller.signal).then((nextStatus) => {
      if (nextStatus !== null) {
        setStatus(nextStatus)
        setCheckedAt(new Date())
      }
    })

    return () => controller.abort()
  }, [])

  const retryDatabase = async () => {
    setStatus('checking')
    const nextStatus = await getDatabaseStatus()

    setStatus(nextStatus)
    setCheckedAt(new Date())
  }

  const content = contentByStatus[status]

  return (
    <main className="database-page">
      <header className="page-header">
        <a className="brand" href="/" aria-label="Accueil All4Sport">
          <span className="brand-icon" aria-hidden="true">A4</span>
          All4Sport
        </a>
        <span className="environment">Test local</span>
      </header>

      <section className={`status-card status-card--${status}`}>
        <div className="status-illustration" aria-hidden="true">
          <div className="database-shape">
            <span />
            <span />
            <span />
          </div>
          <span className="connection-dot" />
        </div>

        <div className="status-content" role="status" aria-live="polite">
          <p className="status-label">{content.label}</p>
          <h1>{content.title}</h1>
          <p className="status-message">{content.message}</p>

          <dl className="test-details">
            <div>
              <dt>Test effectué</dt>
              <dd>SELECT 1 (lecture seule)</dd>
            </div>
            <div>
              <dt>Dernière vérification</dt>
              <dd>{checkedAt ? checkedAt.toLocaleTimeString('fr-FR') : 'En cours…'}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={retryDatabase}
            disabled={status === 'checking'}
          >
            <span aria-hidden="true">↻</span>
            {status === 'checking' ? 'Test en cours…' : 'Retester la connexion'}
          </button>
        </div>
      </section>

      <footer>
        Aucune donnée n'est ajoutée, modifiée ou supprimée pendant ce test.
      </footer>
    </main>
  )
}
