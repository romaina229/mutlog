import { Link } from 'react-router-dom'

export function ClientDashboardPage() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-card">
        <span className="eyebrow">Espace Client</span>
        <h1>Votre espace est sécurisé.</h1>
        <p>Votre session MUTLOG est authentifiée par Laravel Sanctum. Le prochain bloc métier sera le tableau de bord client et la publication d'une demande de transport.</p>
        <Link className="button button-primary" to="/rechercher">Rechercher un transport</Link>
      </section>
    </main>
  )
}
