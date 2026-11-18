import { create } from 'zustand'
import api from '../lib/api'

export interface User {
  id: string
  nombre: string
  apellidos: string
  email: string
  rol: 'estudiante' | 'tutor' | 'revisor' | 'administrador'
  es_tutor?: boolean
  es_revisor?: boolean
  ru?: string
}

interface AuthState {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

interface RegisterData {
  nombre: string
  apellidos: string
  email: string
  password: string
  rol: 'estudiante' | 'tutor' | 'revisor' | 'administrador'
  es_tutor?: boolean
  es_revisor?: boolean
  ru?: string
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: (() => {
    try {
      const stored = localStorage.getItem('auth-storage')
      return stored ? JSON.parse(stored).user : null
    } catch {
      return null
    }
  })(),
  token: (() => {
    try {
      const stored = localStorage.getItem('auth-storage')
      return stored ? JSON.parse(stored).token : null
    } catch {
      return null
    }
  })(),

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const data = { user: response.data.user, token: response.data.token }
    set(data)
    localStorage.setItem('auth-storage', JSON.stringify(data))
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data)
    const authData = { user: response.data.user, token: response.data.token }
    set(authData)
    localStorage.setItem('auth-storage', JSON.stringify(authData))
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('auth-storage')
    delete api.defaults.headers.common['Authorization']
  },

  checkAuth: async () => {
    const state = get()
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
      try {
        const response = await api.get('/auth/me')
        set({ user: response.data.user })
      } catch (error) {
        set({ user: null, token: null })
        localStorage.removeItem('auth-storage')
        delete api.defaults.headers.common['Authorization']
      }
    }
  },
}))

