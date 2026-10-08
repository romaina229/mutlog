import { CalendarDays, MapPin, Package, Search, Truck } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'

const results = [
  {
    route: 'Cotonou → Natitingou',
    date: '15 octobre 2026',
    cargo: 'Marchandises générales',
    capacity: '12 tonnes',
    available: '6 tonnes',
    price: '350 000 FCFA',
  },
]

export function TransportSearchPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="public-shell">
      <PublicHeader />
      <section className="search-page">
        <div className="section-heading">
          <span className="eyebrow">Recherche</span>
          <h1>Trouvez un transport disponible.</h1>
          <p>Recherchez une capacité correspondant à votre itinéraire, votre date et votre marchandise.</p>
        </div>

        <form className="search-panel" onSubmit={handleSubmit}>
          <label>
            <span>Départ</span>
            <div className="field-with-icon"><MapPin size={17} /><input required placeholder="Cotonou" /></div>
          </label>
          <label>
            <span>Destination</span>
            <div className="field-with-icon"><MapPin size={17} /><input required placeholder="Natitingou" /></div>
          </label>
          <label>
            <span>Date</span>
            <div className="field-with-icon"><CalendarDays size={17} /><input required type="date" /></div>
          </label>
          <label>
            <span>Marchandise</span>
            <div className="field-with-icon"><Package size={17} /><input placeholder="Produits agricoles..." /></div>
          </label>
          <label>
            <span>Poids</span>
            <div className="field-with-icon"><Truck size={17} /><input placeholder="2 tonnes" /></div>
          </label>
          <button className="button button-primary button-large search-submit" type="submit">
            <Search size={18} />
            Rechercher
          </button>
        </form>

        {submitted && (
          <div className="results-block">
            <div className="results-header">
              <div>
                <h2>Transports disponibles</h2>
                <span>Correspondances pertinentes</span>
              </div>
              <span className="results-count">1 résultat</span>
            </div>

            {results.map((result) => (
              <article className="transport-result-card" key={result.route}>
                <div className="transport-result-main">
                  <div className="route-title">{result.route}</div>
                  <div className="transport-meta">
                    <span><CalendarDays size={15} />{result.date}</span>
                    <span><Package size={15} />{result.cargo}</span>
                    <span>{result.capacity}</span>
                    <span>Disponible : {result.available}</span>
                  </div>
                </div>
                <div className="transport-price">
                  <strong>{result.price}</strong>
                  <span>par tonne</span>
                  <Link to="/inscription" className="button button-primary">Réserver</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
