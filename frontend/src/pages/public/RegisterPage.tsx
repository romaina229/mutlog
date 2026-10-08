import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PublicHeader } from '../../components/layout/PublicHeader'

export function RegisterPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
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
            <label><span>Nom et prénom</span><input required placeholder="Nom complet" /></label>
            <label><span>Téléphone</span><input required type="tel" placeholder="+229 01 00 00 00" /></label>
            <label><span>Adresse</span><input required placeholder="Adresse" /></label>
            <label><span>Ville / localité</span><input required placeholder="Cotonou" /></label>
            <label>
              <span>Type d'utilisateur</span>
              <select required defaultValue="">
                <option value="" disabled>Choisir un profil</option>
                <option value="client">Client / Expéditeur</option>
                <option value="transporteur">Transporteur</option>
              </select>
            </label>
            <label><span>Adresse e-mail <small>(facultative)</small></span><input type="email" placeholder="vous@exemple.com" /></label>
            <label><span>Mot de passe</span><input required minLength={8} type="password" placeholder="8 caractères minimum" /></label>
            <label><span>Confirmer le mot de passe</span><input required minLength={8} type="password" placeholder="Confirmer" /></label>
            <button className="button button-primary button-large register-submit" type="submit">Créer mon compte</button>
          </form>

          {submitted && <p className="form-feedback">Formulaire prêt pour la connexion à l'API Laravel.</p>}

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
