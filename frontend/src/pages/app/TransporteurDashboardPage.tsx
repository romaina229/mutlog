import { Link } from 'react-router-dom'

export function TransporteurDashboardPage() {
  const user = JSON.parse(localStorage.getItem('mutlog_user') ?? '{}') as { name?: string }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <span className="eyebrow">Espace Transporteur</span>
        <h1>Bienvenue {user.name ?? ''}</h1>
        <p>Votre authentification MUTLOG est active. La gestion des véhicules et des offres de transport constitue la prochaine couche métier.</p>
        <Link className="button button-primary" to="/">Retour à l'accueil</Link>
      </section>
    </main>
  )
}
