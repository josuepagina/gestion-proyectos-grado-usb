import type { User } from '../store/authStore'

export const hasRole = (user: User | null | undefined, role: 'administrador' | 'estudiante' | 'tutor' | 'revisor'): boolean => {
  if (!user) return false
  if (role === 'administrador') return user.rol === 'administrador'
  if (role === 'estudiante') return user.rol === 'estudiante'
  if (role === 'tutor') return !!user.es_tutor || user.rol === 'tutor'
  if (role === 'revisor') return !!user.es_revisor || user.rol === 'revisor'
  return false
}
