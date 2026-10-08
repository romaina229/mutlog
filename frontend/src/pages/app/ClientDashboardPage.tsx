import { Link } from 'react-router-dom'

export function ClientDashboardPage() {
  const user = JSON.parse(localStorage.getItem('mutlog_user') ?? '{}') as { name?: string }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <span className="eyebrow">Espace Client</span>
        <h1>Bienvenue {user.name ?? ''}</h1>
        <p>Votre authentification MUTLOG est active. Le tableau de bord métier sera construit à partir des demandes de transport du cahier des charges.</p>
        <Link className="button button-primary" to="/rechercher">Rechercher un transport</Link>
      </section>
    </main>
  )
}
