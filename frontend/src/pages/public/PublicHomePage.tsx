import { ArrowRight, CheckCircle2, Search, Truck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'

const benefits = [
  'Réduction des coûts',
  'Optimisation des capacités',
  'Transport plus durable',
]

export function PublicHomePage() {
  return (
    <main className="mutlog-page">
      <PublicHeader />

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Mutualiser. Optimiser. Transporter.</span>
          <h1>
            Le transport
            <span> plus intelligent,</span>
            ensemble.
          </h1>
          <p>
            MUTLOG vous permet de mutualiser vos transports de marchandises
            pour réduire vos coûts, optimiser vos trajets et contribuer à un
            transport plus durable.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary button-large" to="/inscription">
              Publier une demande
              <ArrowRight size={18} />
            </Link>
            <Link className="button button-outline button-large" to="/rechercher">
              Trouver un transport
              <Search size={18} />
            </Link>
          </div>

          <div className="benefits">
            {benefits.map((benefit) => (
              <span key={benefit}>
                <CheckCircle2 size={17} />
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-label="Aperçu du transport mutualisé">
          <div className="hero-image-frame">
            <div className="hero-sky" />
            <div className="hero-mountain hero-mountain-one" />
            <div className="hero-mountain hero-mountain-two" />
            <div className="hero-road" />
            <div className="hero-truck">
              <div className="truck-cab">
                <div className="truck-window" />
                <div className="truck-grille" />
              </div>
              <div className="truck-body">
                <span>MUTLOG</span>
              </div>
              <i className="wheel wheel-one" />
              <i className="wheel wheel-two" />
            </div>
            <div className="hero-route-pill">
              <span className="route-icon"><Users size={17} /></span>
              <span>
                <strong>Des trajets partagés</strong>
                <small>pour un avenir durable</small>
              </span>
            </div>
            <div className="hero-location-pill">
              <span className="location-dot" />
              <strong>Capacité disponible</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="public-features" id="comment-ca-marche">
        <div>
          <span className="eyebrow">Une logique simple</span>
          <h2>De la demande à la livraison, chaque étape reste lisible.</h2>
        </div>
        <div className="feature-grid">
          <article><span>01</span><strong>Publier</strong><p>Décrivez votre trajet, votre marchandise et votre besoin.</p></article>
          <article><span>02</span><strong>Matcher</strong><p>Identifiez les offres de transport compatibles.</p></article>
          <article><span>03</span><strong>Mutualiser</strong><p>Regroupez les demandes compatibles avec validation.</p></article>
        </div>
      </section>

      <section className="public-cta" id="services">
        <div>
          <span className="eyebrow">MUTLOG</span>
          <h2>Moins de trajets à vide. Plus de capacités valorisées.</h2>
          <p>Une même plateforme pour les clients, les transporteurs et l'équipe MUTLOG.</p>
        </div>
        <Link className="button button-primary button-large" to="/inscription">Commencer maintenant</Link>
      </section>

      <section className="public-anchor-spacer" id="a-propos" aria-hidden="true" />
      <section className="public-anchor-spacer" id="contact" aria-hidden="true" />
    </main>
  )
}
