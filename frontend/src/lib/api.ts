import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const sanctum = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
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

export async function initializeCsrf() {
  await sanctum.get('/sanctum/csrf-cookie')
}
