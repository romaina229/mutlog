import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mutlog_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export type MutlogUser = {
  id: number
  name: string
  phone: string
  address: string
  city: string
  user_type: 'client' | 'transporteur' | 'admin'
  email?: string | null
}

export type AuthResponse = {
  message: string
  user: MutlogUser
  token: string
  token_type: 'Bearer'
}

export function persistAuth(response: AuthResponse) {
  localStorage.setItem('mutlog_token', response.token)
  localStorage.setItem('mutlog_user', JSON.stringify(response.user))
}

export function clearAuth() {
  localStorage.removeItem('mutlog_token')
  localStorage.removeItem('mutlog_user')
}
