import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { api, type MutlogUser } from '../../lib/api'

type Props = {
  children: ReactNode
  allowedRoles?: Array<'client' | 'transporteur' | 'admin'>
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const [user, setUser] = useState<MutlogUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    api.get<{ user: MutlogUser }>('/auth/me')
      .then(({ data }) => {
        if (active) setUser(data.user)
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401 && active) {
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <main className="dashboard-shell"><div className="dashboard-card"><span className="eyebrow">MUTLOG</span><h1>Chargement...</h1></div></main>
  }

  if (!user) {
    return <Navigate to="/connexion" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />
  }

  return children
}
