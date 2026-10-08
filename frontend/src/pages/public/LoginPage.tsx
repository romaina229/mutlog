import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'
import { api, initializeCsrf, type MutlogUser } from '../../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await initializeCsrf()
      await api.post('/auth/login', { phone, password })
      const { data } = await api.get<{ user: MutlogUser }>('/auth/me')
      navigate(data.user.user_type === 'transporteur' ? '/transporteur' : '/client', { replace: true })
    } catch (err) {
      const response = axios.isAxiosError(err) ? err.response?.data : undefined
      setError(response?.message ?? response?.errors?.phone?.[0] ?? 'Impossible de se connecter. Vérifiez vos identifiants.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="public-shell">
      <PublicHeader />
      <section className="auth-page">
        <div className="auth-card">
          <div className="section-heading compact">
            <span className="eyebrow">Connexion</span>
            <h1>Accédez à votre espace MUTLOG.</h1>
            <p>Connectez-vous avec votre numéro de téléphone et votre mot de passe.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>Numéro de téléphone</span>
              <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+229 01 00 00 00" autoComplete="tel" />
            </label>
            <label>
              <span>Mot de passe</span>
              <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" autoComplete="current-password" />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="button button-primary button-large" type="submit" disabled={submitting}>
              {submitting ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="auth-switch">
            Vous n'avez pas encore de compte ?
            {' '}
            <Link to="/inscription">Créer un compte</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
