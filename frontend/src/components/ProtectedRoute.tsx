import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { hasRole } from '../lib/roles'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { token, user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.some((role) => hasRole(user, role as any))) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}


