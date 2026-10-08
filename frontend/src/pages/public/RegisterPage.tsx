import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'
import { api, initializeCsrf, type MutlogUser } from '../../lib/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    user_type: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (form.password !== form.password_confirmation) {
      setError('Les deux mots de passe doivent être identiques.')
      return
    }

    setSubmitting(true)

    try {
      await initializeCsrf()
      await api.post('/auth/register', {
        ...form,
        email: form.email || null,
      })
      const { data } = await api.get<{ user: MutlogUser }>('/auth/me')
      navigate(data.user.user_type === 'transporteur' ? '/transporteur' : '/client', { replace: true })
    } catch (err) {
      const response = axios.isAxiosError(err) ? err.response?.data : undefined
      setError(response?.message ?? Object.values(response?.errors ?? {})?.[0]?.[0] ?? 'Impossible de créer le compte.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="public-shell">
      <PublicHeader />
      <section className="auth-page">
        <div className="auth-card auth-card-wide">
          <div className="section-heading compact">
            <span className="eyebrow">Inscription</span>
            <h1>Créez votre compte MUTLOG.</h1>
            <p>Choisissez votre profil : client/expéditeur ou transporteur.</p>
          </div>

          <form className="register-grid" onSubmit={handleSubmit}>
            <label><span>Nom et prénom</span><input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Nom complet" autoComplete="name" /></label>
            <label><span>Téléphone</span><input required type="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+229 01 00 00 00" autoComplete="tel" /></label>
            <label><span>Adresse</span><input required value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Adresse" autoComplete="street-address" /></label>
            <label><span>Ville / localité</span><input required value={form.city} onChange={(event) => update('city', event.target.value)} placeholder="Cotonou" autoComplete="address-level2" /></label>
            <label>
              <span>Type d'utilisateur</span>
              <select required value={form.user_type} onChange={(event) => update('user_type', event.target.value)}>
                <option value="" disabled>Choisir un profil</option>
                <option value="client">Client / Expéditeur</option>
                <option value="transporteur">Transporteur</option>
              </select>
            </label>
            <label><span>Adresse e-mail <small>(facultative)</small></span><input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="vous@exemple.com" autoComplete="email" /></label>
            <label><span>Mot de passe</span><input required minLength={8} type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="8 caractères minimum" autoComplete="new-password" /></label>
            <label><span>Confirmer le mot de passe</span><input required minLength={8} type="password" value={form.password_confirmation} onChange={(event) => update('password_confirmation', event.target.value)} placeholder="Confirmer" autoComplete="new-password" /></label>
            {error && <p className="form-error register-error">{error}</p>}
            <button className="button button-primary button-large register-submit" type="submit" disabled={submitting}>
              {submitting ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="auth-switch">
            Vous avez déjà un compte ?
            {' '}
            <Link to="/connexion">Se connecter</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
