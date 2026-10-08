import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/comment-ca-marche', label: 'Comment ça marche' },
  { to: '/services', label: 'Nos services' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

export function PublicHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="MUTLOG - Accueil">
        <span className="brand-mark">M</span>
        <span className="brand-name">MUTLOG</span>
      </Link>

      <nav className="site-nav" aria-label="Navigation principale">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="site-actions">
        <Link className="button button-secondary" to="/connexion">Se connecter</Link>
        <Link className="button button-primary" to="/inscription">S'inscrire</Link>
      </div>
    </header>
  )
}
