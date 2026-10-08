import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  allowedRoles?: Array<'client' | 'transporteur' | 'admin'>
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem('mutlog_token')
  const user = JSON.parse(localStorage.getItem('mutlog_user') ?? 'null') as { user_type?: 'client' | 'transporteur' | 'admin' } | null

  if (!token || !user) {
    return <Navigate to="/connexion" replace />
  }

  if (allowedRoles && (!user.user_type || !allowedRoles.includes(user.user_type))) {
    return <Navigate to="/" replace />
  }

  return children
}
