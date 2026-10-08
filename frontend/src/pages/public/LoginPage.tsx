import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'

export function LoginPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
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
              <input required type="tel" placeholder="+229 01 00 00 00" />
            </label>
            <label>
              <span>Mot de passe</span>
              <input required type="password" placeholder="Votre mot de passe" />
            </label>
            <button className="button button-primary button-large" type="submit">Se connecter</button>
          </form>

          {submitted && <p className="form-feedback">Connexion prête pour l'intégration de l'API Laravel.</p>}

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
