import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'

type Props = {
  eyebrow: string
  title: string
  description: string
  actionLabel?: string
}

export function PublicInfoPage({ eyebrow, title, description, actionLabel = 'Commencer avec MUTLOG' }: Props) {
  return (
    <main className="public-shell">
      <PublicHeader />
      <section className="info-page">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link className="button button-primary button-large" to="/inscription">
          {actionLabel}
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  )
}
