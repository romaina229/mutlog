import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ClipboardList, Circle, LogOut, MapPin, Package, PackagePlus, Phone, Plus, Truck } from 'lucide-react'
import {
  api,
  createTransportRequest,
  fetchClientRequest,
  fetchClientRequests,
  fetchCurrentUser,
  type MutlogUser,
  type TransportRequest,
} from '../../lib/api'

const statusLabels: Record<TransportRequest['status'], string> = {
  demande: 'Demande',
  recherche: 'Recherche',
  mutualisation: 'Mutualisation',
  confirmee: 'Confirmée',
  en_cours: 'En cours',
  livree: 'Livrée',
  terminee: 'Terminée',
}

const steps: Array<{ key: TransportRequest['status']; label: string }> = [
  { key: 'demande', label: 'Demande' },
  { key: 'recherche', label: 'Recherche' },
  { key: 'mutualisation', label: 'Mutualisation' },
  { key: 'confirmee', label: 'Confirmée' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'livree', label: 'Livrée' },
  { key: 'terminee', label: 'Terminée' },
]

function formatDate(value: string, full = false) {
  return new Intl.DateTimeFormat('fr-FR', full ? { dateStyle: 'full' } : { dateStyle: 'medium' }).format(new Date(value))
}

function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback
  const response = error.response?.data
  const firstError = response?.errors ? Object.values(response.errors)[0]?.[0] : undefined
  return firstError ?? response?.message ?? fallback
}

function ClientHeader({ user }: { user: MutlogUser | null }) {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    setLoggingOut(true)
    try {
      await api.post('/auth/logout')
    } finally {
      navigate('/connexion', { replace: true })
    }
  }

  return (
    <header className="app-header">
      <Link className="brand" to="/"><span className="brand-mark"><Truck size={19} /></span><span className="brand-name">MUTLOG</span></Link>
      <nav className="app-nav" aria-label="Navigation client">
        <Link to="/client">Tableau de bord</Link>
        <Link to="/client/demandes">Mes demandes</Link>
        <Link to="/client/historique">Historique</Link>
      </nav>
      <div className="app-header-actions">
        <span className="user-chip">{user?.name ?? 'Client'}</span>
        <button className="button button-secondary button-small" type="button" onClick={logout} disabled={loggingOut}><LogOut size={16} /> {loggingOut ? 'Déconnexion...' : 'Déconnexion'}</button>
      </div>
    </header>
  )
}

function RequestList({ requests, historyOnly = false }: { requests: TransportRequest[]; historyOnly?: boolean }) {
  const visible = historyOnly
    ? requests.filter((request) => ['livree', 'terminee'].includes(request.status))
    : requests

  if (visible.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={30} />
        <strong>{historyOnly ? 'Aucune opération terminée.' : 'Aucune demande publiée.'}</strong>
        <p>{historyOnly ? 'Vos demandes apparaîtront ici une fois livrées ou terminées.' : 'Publiez votre première demande pour commencer la recherche de transport.'}</p>
        {!historyOnly && <Link className="button button-primary" to="/client/demandes/nouvelle">Publier une demande</Link>}
      </div>
    )
  }

  return (
    <div className="request-list">
      {visible.map((request) => (
        <Link className="request-row" to={'/client/demandes/' + request.id} key={request.id}>
          <div>
            <strong>{request.departure} → {request.destination}</strong>
            <span>{request.cargo_type} · {request.weight_kg} kg · {formatDate(request.desired_date)}</span>
          </div>
          <div className="request-row-end">
            <span className={'status-badge status-' + request.status}>{statusLabels[request.status]}</span>
            <ArrowRight size={17} />
          </div>
        </Link>
      ))}
    </div>
  )
}

function NewRequestForm({ onCreated }: { onCreated: (request: TransportRequest) => void }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<MutlogUser | null>(null)
  const [form, setForm] = useState({
    departure: '',
    destination: '',
    desired_date: '',
    cargo_type: '',
    weight_kg: '',
    volume_m3: '',
    package_count: '',
    special_instructions: '',
    contact_phone: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser)
        setForm((current) => ({ ...current, contact_phone: current.contact_phone || currentUser.phone }))
      })
      .catch(() => navigate('/connexion', { replace: true }))
  }, [navigate])

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const request = await createTransportRequest({
        departure: form.departure.trim(),
        destination: form.destination.trim(),
        desired_date: form.desired_date,
        cargo_type: form.cargo_type.trim(),
        weight_kg: Number(form.weight_kg),
        volume_m3: form.volume_m3 ? Number(form.volume_m3) : null,
        package_count: form.package_count ? Number(form.package_count) : null,
        special_instructions: form.special_instructions.trim() || null,
        contact_phone: form.contact_phone.trim(),
      })
      onCreated(request)
    } catch (err) {
      setError(getErrorMessage(err, 'Impossible de publier la demande.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="app-panel request-form" onSubmit={submit}>
      <div className="form-section-heading"><PackagePlus size={20} /><div><strong>Itinéraire et date</strong><span>Les informations de trajet utilisées pour la recherche.</span></div></div>
      <div className="form-grid-2">
        <label><span>Lieu de départ</span><input required value={form.departure} onChange={(event) => update('departure', event.target.value)} placeholder="Lokossa" /></label>
        <label><span>Destination</span><input required value={form.destination} onChange={(event) => update('destination', event.target.value)} placeholder="Cotonou" /></label>
        <label><span>Date souhaitée</span><input required type="date" min={todayIso()} value={form.desired_date} onChange={(event) => update('desired_date', event.target.value)} /></label>
        <label><span>Type de marchandise</span><input required value={form.cargo_type} onChange={(event) => update('cargo_type', event.target.value)} placeholder="Produit agricole" /></label>
      </div>

      <div className="form-section-heading"><PackagePlus size={20} /><div><strong>Marchandise</strong><span>Quantité, volume et nombre de colis si disponibles.</span></div></div>
      <div className="form-grid-3">
        <label><span>Poids / quantité (kg)</span><input required min="0.001" step="0.001" type="number" value={form.weight_kg} onChange={(event) => update('weight_kg', event.target.value)} placeholder="1000" /></label>
        <label><span>Volume (m³) <small>facultatif</small></span><input min="0.001" step="0.001" type="number" value={form.volume_m3} onChange={(event) => update('volume_m3', event.target.value)} placeholder="2.5" /></label>
        <label><span>Nombre de colis <small>facultatif</small></span><input min="1" step="1" type="number" value={form.package_count} onChange={(event) => update('package_count', event.target.value)} placeholder="20" /></label>
      </div>

      <div className="form-section-heading"><PackagePlus size={20} /><div><strong>Informations particulières</strong><span>Contraintes ou précisions utiles pour le transport.</span></div></div>
      <div className="form-grid-1">
        <label><span>Informations particulières <small>facultatif</small></span><textarea rows={4} value={form.special_instructions} onChange={(event) => update('special_instructions', event.target.value)} placeholder="Fragile, besoin de bâchage, horaires de chargement..." /></label>
        <label><span>Contact</span><input required type="tel" value={form.contact_phone} onChange={(event) => update('contact_phone', event.target.value)} placeholder="+229 97 00 00 00" /></label>
      </div>

      {error && <p className="form-error">{error}</p>}
      <div className="form-actions">
        <Link className="button button-secondary" to="/client">Annuler</Link>
        <button className="button button-primary button-large" type="submit" disabled={submitting}>{submitting ? 'Publication...' : 'Publier ma demande'}</button>
      </div>
      {user && <span className="form-helper">Contact prérempli avec le numéro du compte : {user.phone}</span>}
    </form>
  )
}

function RequestDetail({ request }: { request: TransportRequest }) {
  const activeStepIndex = steps.findIndex((step) => step.key === request.status)

  return (
    <>
      <section className="app-panel">
        <div className="app-panel-heading"><div><span className="eyebrow">Suivi</span><h2>Cycle de votre opération</h2></div></div>
        <div className="status-timeline">
          {steps.map((step, index) => {
            const complete = index <= activeStepIndex
            return (
              <div className={'timeline-step ' + (complete ? 'is-complete' : '') + (index === activeStepIndex ? ' is-current' : '')} key={step.key}>
                <div className="timeline-icon">{complete ? <CheckCircle2 size={20} /> : <Circle size={20} />}</div>
                <span>{step.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="detail-grid">
        <section className="app-panel">
          <div className="app-panel-heading"><div><span className="eyebrow">Itinéraire</span><h2>Détails du trajet</h2></div></div>
          <div className="detail-list">
            <div><MapPin size={18} /><span><small>Départ</small><strong>{request.departure}</strong></span></div>
            <div><MapPin size={18} /><span><small>Destination</small><strong>{request.destination}</strong></span></div>
            <div><CalendarDays size={18} /><span><small>Date souhaitée</small><strong>{formatDate(request.desired_date, true)}</strong></span></div>
          </div>
        </section>

        <section className="app-panel">
          <div className="app-panel-heading"><div><span className="eyebrow">Marchandise</span><h2>Informations déclarées</h2></div></div>
          <div className="detail-list">
            <div><Package size={18} /><span><small>Type</small><strong>{request.cargo_type}</strong></span></div>
            <div><Package size={18} /><span><small>Poids / quantité</small><strong>{request.weight_kg} kg</strong></span></div>
            {request.volume_m3 !== null && <div><Package size={18} /><span><small>Volume</small><strong>{request.volume_m3} m³</strong></span></div>}
            {request.package_count !== null && <div><Package size={18} /><span><small>Colis</small><strong>{request.package_count}</strong></span></div>}
          </div>
        </section>
      </div>

      <section className="app-panel">
        <div className="app-panel-heading"><div><span className="eyebrow">Contact</span><h2>Informations complémentaires</h2></div></div>
        <div className="detail-list detail-list-horizontal"><div><Phone size={18} /><span><small>Téléphone</small><strong>{request.contact_phone}</strong></span></div></div>
        {request.special_instructions && <p className="detail-note">{request.special_instructions}</p>}
      </section>
    </>
  )
}

export function ClientWorkspacePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState<MutlogUser | null>(null)
  const [requests, setRequests] = useState<TransportRequest[]>([])
  const [detail, setDetail] = useState<TransportRequest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const path = location.pathname
  const isNew = path.endsWith('/demandes/nouvelle')
  const isHistory = path.endsWith('/historique')
  const detailMatch = path.match(/\/client\/demandes\/(\d+)$/)
  const detailId = detailMatch?.[1]
  const isList = path.endsWith('/demandes')
  const isDashboard = path === '/client'

  useEffect(() => {
    setError('')
    setLoading(true)
    const requestPromise = detailId ? fetchClientRequest(detailId).then(setDetail) : fetchClientRequests().then(setRequests)
    Promise.all([fetchCurrentUser(), requestPromise])
      .then(([currentUser]) => setUser(currentUser))
      .catch((err: unknown) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          navigate('/connexion', { replace: true })
          return
        }
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError('Cette demande n’existe pas ou ne vous appartient pas.')
          return
        }
        setError('Impossible de charger votre espace client.')
      })
      .finally(() => setLoading(false))
  }, [detailId, isDashboard, isHistory, isList, navigate])

  const activeRequests = useMemo(() => requests.filter((request) => !['livree', 'terminee'].includes(request.status)), [requests])
  const completedRequests = useMemo(() => requests.filter((request) => ['livree', 'terminee'].includes(request.status)), [requests])

  if (loading) return <main className="dashboard-shell"><div className="dashboard-card"><span className="eyebrow">Espace Client</span><h1>Chargement...</h1></div></main>

  if (isNew) {
    return (
      <main className="app-shell">
        <ClientHeader user={user} />
        <section className="app-content app-content-narrow">
          <div className="app-heading"><div><span className="eyebrow">Nouvelle demande</span><h1>Publier votre besoin de transport</h1><p>Renseignez les informations nécessaires à la recherche d'une capacité compatible.</p></div></div>
          <NewRequestForm onCreated={(created) => navigate('/client/demandes/' + created.id, { replace: true })} />
        </section>
      </main>
    )
  }

  if (detailId) {
    return (
      <main className="app-shell">
        <ClientHeader user={user} />
        <section className="app-content">
          {detail ? (
            <>
              <div className="app-heading">
                <div><span className="eyebrow">Détail de la demande #{detail.id}</span><h1>{detail.departure} → {detail.destination}</h1><p>Publié le {formatDate(detail.created_at)}.</p></div>
                <span className={'status-badge status-' + detail.status}>{statusLabels[detail.status]}</span>
              </div>
              <RequestDetail request={detail} />
              <Link className="back-link" to="/client/demandes"><ArrowLeft size={16} /> Retour à mes demandes</Link>
            </>
          ) : <div className="dashboard-card"><span className="eyebrow">Demande introuvable</span><h1>{error}</h1><Link className="button button-primary" to="/client/demandes">Retour à mes demandes</Link></div>}
        </section>
      </main>
    )
  }

  if (isNew) return null

  const title = isHistory ? 'Vos opérations terminées' : 'Toutes vos demandes'
  const eyebrow = isHistory ? 'Historique' : 'Demandes de transport'

  if (isList || isHistory) {
    return (
      <main className="app-shell">
        <ClientHeader user={user} />
        <section className="app-content">
          <div className="app-heading">
            <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{isHistory ? 'Retrouvez les demandes dont le transport est livré ou terminé.' : 'Consultez vos demandes, leur statut et les détails saisis à la publication.'}</p></div>
            {!isHistory && <Link className="button button-primary" to="/client/demandes/nouvelle"><Plus size={18} /> Nouvelle demande</Link>}
          </div>
          {error && <p className="form-error">{error}</p>}
          <section className="app-panel"><RequestList requests={requests} historyOnly={isHistory} /></section>
          <Link className="back-link" to="/client"><ArrowLeft size={16} /> Retour au tableau de bord</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <ClientHeader user={user} />
      <section className="app-content">
        <div className="app-heading">
          <div><span className="eyebrow">Espace Client / Expéditeur</span><h1>Bonjour {user?.name ?? ''}</h1><p>Publiez votre besoin de transport et suivez son avancement depuis un seul espace.</p></div>
          <Link className="button button-primary" to="/client/demandes/nouvelle"><Plus size={18} /> Publier une demande</Link>
        </div>
        {error && <p className="form-error">{error}</p>}
        <div className="app-card-grid app-card-grid-3">
          <article className="metric-card"><span>Demandes totales</span><strong>{requests.length}</strong><small><ClipboardList size={15} /> Publiées</small></article>
          <article className="metric-card"><span>En cours</span><strong>{activeRequests.length}</strong><small>À suivre</small></article>
          <article className="metric-card"><span>Terminées</span><strong>{completedRequests.length}</strong><small>Historique</small></article>
        </div>
        <section className="app-panel">
          <div className="app-panel-heading"><div><span className="eyebrow">Demandes récentes</span><h2>Vos besoins de transport</h2></div><Link className="text-link" to="/client/demandes">Voir toutes <ArrowRight size={16} /></Link></div>
          <RequestList requests={requests.slice(0, 5)} />
        </section>
      </section>
    </main>
  )
}
